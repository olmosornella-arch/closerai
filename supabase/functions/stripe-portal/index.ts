// ─────────────────────────────────────────────────────────────────────────────
// /stripe-portal — Abre el Customer Portal de Stripe
// El cliente puede cambiar plan, ver facturas, cancelar desde acá
// Sin escribir ningún código de facturación — Stripe lo maneja todo
// ─────────────────────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsResponse, json, err, getWorkspace, supabaseAdmin } from "../_shared/utils.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return corsResponse();

  const workspace = await getWorkspace(req);
  if (!workspace) return err("No autorizado", 401);

  const { returnUrl } = await req.json().catch(() => ({}));
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) return err("Stripe no configurado", 500);

  const sb = supabaseAdmin();

  // Obtener customer_id de Stripe
  const { data: wsData } = await sb
    .from("workspaces")
    .select("stripe_customer_id")
    .eq("id", workspace.id)
    .single();

  if (!wsData?.stripe_customer_id) {
    return err("No tenés una suscripción activa todavía", 422);
  }

  // Crear sesión del portal
  const portalRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      customer: wsData.stripe_customer_id,
      return_url: returnUrl || `${Deno.env.get("CLOSER_AI_DOMAIN")}/settings`,
    }),
  });

  if (!portalRes.ok) {
    const e = await portalRes.json();
    return err(e.error?.message || "Error abriendo portal de facturación", 500);
  }

  const portal = await portalRes.json();
  return json({ url: portal.url });
});
