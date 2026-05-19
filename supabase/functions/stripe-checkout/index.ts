// ─────────────────────────────────────────────────────────────────────────────
// /stripe-checkout — Crea una sesión de Stripe Checkout
// El cliente llega acá desde la página de signup después de elegir su plan
// Stripe maneja el pago, el trial de 14 días, y llama al webhook cuando termina
// ─────────────────────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { CORS, corsResponse, json, err, getWorkspace, supabaseAdmin } from "../_shared/utils.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return corsResponse();

  const workspace = await getWorkspace(req);
  if (!workspace) return err("No autorizado", 401);

  const {
    priceId,
    email,
    trialDays = 14,
    successUrl,
    cancelUrl,
  } = await req.json().catch(() => ({}));

  if (!priceId || !email) return err("priceId y email son requeridos");

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) return err("Stripe no configurado", 500);

  const sb = supabaseAdmin();

  // Verificar si ya tiene un customer_id de Stripe
  const { data: wsData } = await sb
    .from("workspaces")
    .select("stripe_customer_id, plan")
    .eq("id", workspace.id)
    .single();

  let customerId = wsData?.stripe_customer_id;

  // Si no tiene customer_id, crear uno en Stripe
  if (!customerId) {
    const customerRes = await fetch("https://api.stripe.com/v1/customers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email,
        "metadata[workspace_id]": workspace.id,
        "metadata[user_id]": workspace.user_id,
      }),
    });

    if (!customerRes.ok) {
      const e = await customerRes.json();
      return err(e.error?.message || "Error creando customer en Stripe", 500);
    }

    const customer = await customerRes.json();
    customerId = customer.id;

    // Guardar customer_id en Supabase
    await sb
      .from("workspaces")
      .update({ stripe_customer_id: customerId })
      .eq("id", workspace.id);
  }

  // Crear sesión de Checkout con trial de 14 días
  const checkoutParams = new URLSearchParams({
    "customer": customerId,
    "mode": "subscription",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    "subscription_data[trial_period_days]": String(trialDays),
    // Pedir tarjeta pero no cobrar hasta que termina el trial
    "payment_method_collection": "always",
    "success_url": successUrl,
    "cancel_url": cancelUrl,
    // Metadata para el webhook
    "subscription_data[metadata][workspace_id]": workspace.id,
    "subscription_data[metadata][user_id]": workspace.user_id,
    // Permitir códigos de descuento (útil para beta)
    "allow_promotion_codes": "true",
    // Configuración de facturación
    "billing_address_collection": "auto",
    "locale": "auto",
  });

  const checkoutRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: checkoutParams,
  });

  if (!checkoutRes.ok) {
    const e = await checkoutRes.json();
    console.error("Stripe checkout error:", e);
    return err(e.error?.message || "Error creando sesión de pago", 500);
  }

  const session = await checkoutRes.json();

  console.log(`Checkout creado: workspace=${workspace.id} price=${priceId} session=${session.id}`);

  return json({ url: session.url, sessionId: session.id });
});
