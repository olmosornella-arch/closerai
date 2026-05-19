// supabase/functions/save-keys/index.ts
// Guarda las API keys del usuario encriptadas con AES-256-GCM
// El frontend NUNCA almacena keys en texto plano

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsResponse, json, err, getWorkspace, supabaseAdmin, encrypt } from "../_shared/utils.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return corsResponse();

  const workspace = await getWorkspace(req);
  if (!workspace) return err("No autorizado", 401);

  const { provider, key, secret, config = {} } = await req.json().catch(() => ({}));
  if (!provider || !key) return err("provider y key son requeridos");

  const validProviders = ["resend", "evolution", "twilio"];
  if (!validProviders.includes(provider)) return err(`Provider inválido. Opciones: ${validProviders.join(", ")}`);

  const encryptedKey    = await encrypt(key);
  const encryptedSecret = secret ? await encrypt(secret) : null;

  const sb = supabaseAdmin();
  const { error } = await sb
    .from("workspace_integrations")
    .upsert({
      workspace_id:     workspace.id,
      provider,
      encrypted_key:    encryptedKey,
      encrypted_secret: encryptedSecret,
      config_json:      config,
      updated_at:       new Date().toISOString(),
    }, { onConflict: "workspace_id,provider" });

  if (error) return err(`Error al guardar: ${error.message}`, 500);

  return json({ success: true, message: `${provider} guardado correctamente` });
});
