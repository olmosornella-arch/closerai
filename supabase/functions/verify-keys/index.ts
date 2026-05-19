// supabase/functions/verify-keys/index.ts
// Verifica que las keys del usuario son válidas llamando a cada proveedor

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsResponse, json, err, getWorkspace, getDecryptedKey } from "../_shared/utils.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return corsResponse();

  const workspace = await getWorkspace(req);
  if (!workspace) return err("No autorizado", 401);

  const { provider, testPhone } = await req.json().catch(() => ({}));
  if (!provider) return err("provider requerido");

  const keys = await getDecryptedKey(workspace.id, provider);
  if (!keys) return err(`No hay keys configuradas para ${provider}`, 404);

  try {
    // ── RESEND ──────────────────────────────────────────────────────────────
    if (provider === "resend") {
      const res = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${keys.key}` },
      });
      if (!res.ok) return json({ success: false, provider, error: "Key de Resend inválida" });
      const data = await res.json();
      return json({
        success: true, provider,
        message: `Resend verificado. ${data.data?.length || 0} dominio(s) configurado(s)`,
        details: { domains: data.data?.map((d: any) => d.name) },
      });
    }

    // ── EVOLUTION API (WhatsApp) ─────────────────────────────────────────────
    if (provider === "evolution") {
      const baseUrl = keys.config?.baseUrl || "https://api.evolutionapi.com";
      const res = await fetch(`${baseUrl}/instance/fetchInstances`, {
        headers: { apikey: keys.key },
      });
      if (!res.ok) return json({ success: false, provider, error: "Key de Evolution API inválida" });
      const data = await res.json();
      const instances = Array.isArray(data) ? data : [];
      return json({
        success: true, provider,
        message: `Evolution API verificada. ${instances.length} instancia(s) encontrada(s)`,
        details: { instances: instances.map((i: any) => i.instance?.instanceName || i.instanceName) },
      });
    }

    // ── TWILIO ───────────────────────────────────────────────────────────────
    if (provider === "twilio") {
      const accountSid = keys.config?.accountSid || keys.key;
      const authToken  = keys.secret || "";
      const credentials = btoa(`${accountSid}:${authToken}`);
      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`,
        { headers: { Authorization: `Basic ${credentials}` } }
      );
      if (!res.ok) return json({ success: false, provider, error: "Credenciales de Twilio inválidas" });
      const data = await res.json();
      return json({
        success: true, provider,
        message: `Twilio verificado. Cuenta: ${data.friendly_name}`,
        details: { accountName: data.friendly_name, status: data.status },
      });
    }

    return err(`Provider ${provider} no soportado`);
  } catch (e: any) {
    return json({ success: false, provider, error: e.message });
  }
});
