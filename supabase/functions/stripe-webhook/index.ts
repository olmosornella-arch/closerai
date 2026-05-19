// ─────────────────────────────────────────────────────────────────────────────
// /stripe-webhook — Maneja todos los eventos de Stripe
// Stripe llama a esta URL cuando: trial termina, pago exitoso, suscripción cancela
// Esta función actualiza el plan del workspace automáticamente
// ─────────────────────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabaseAdmin } from "../_shared/utils.ts";

// Mapa de Stripe Price IDs → plan de CloserAI
// Completar con los Price IDs reales de tu cuenta de Stripe cuando los tengas
// Los IDs están en: stripe.com → Products → [producto] → Pricing → ID
const PRICE_TO_PLAN: Record<string, string> = {
  // Growth
  [Deno.env.get("STRIPE_PRICE_GROWTH_MONTHLY") || "price_growth_monthly"]: "growth",
  [Deno.env.get("STRIPE_PRICE_GROWTH_ANNUAL")  || "price_growth_annual"]:  "growth",
  // Pro
  [Deno.env.get("STRIPE_PRICE_PRO_MONTHLY")    || "price_pro_monthly"]:    "pro",
  [Deno.env.get("STRIPE_PRICE_PRO_ANNUAL")      || "price_pro_annual"]:    "pro",
  // Agency
  [Deno.env.get("STRIPE_PRICE_AGENCY_MONTHLY") || "price_agency_monthly"]: "agency",
  [Deno.env.get("STRIPE_PRICE_AGENCY_ANNUAL")  || "price_agency_annual"]:  "agency",
};

serve(async (req: Request) => {
  // Stripe siempre envía POST con signature en el header
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!stripeKey || !webhookSecret) {
    console.error("Faltan STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET");
    return new Response("Config error", { status: 500 });
  }

  // Verificar la firma de Stripe (previene webhooks falsos)
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("No signature", { status: 400 });

  const body = await req.text();

  // Verificar signature manualmente (sin SDK de Stripe para Deno)
  const isValid = await verifyStripeSignature(body, signature, webhookSecret);
  if (!isValid) {
    console.error("Stripe signature inválida");
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);
  console.log(`Stripe event: ${event.type}`);

  const sb = supabaseAdmin();

  try {
    switch (event.type) {

      // ─── CHECKOUT COMPLETADO ────────────────────────────────────────────────
      // Cuando el cliente completa el pago inicial (o acepta el trial)
      case "checkout.session.completed": {
        const session = event.data.object;
        const workspaceId = session.metadata?.workspace_id ||
          session.subscription_data?.metadata?.workspace_id;

        if (!workspaceId) break;

        // Obtener la suscripción para saber el precio
        const subRes = await fetch(
          `https://api.stripe.com/v1/subscriptions/${session.subscription}`,
          { headers: { Authorization: `Bearer ${stripeKey}` } }
        );
        const sub = await subRes.json();
        const priceId = sub.items?.data?.[0]?.price?.id;
        const plan = PRICE_TO_PLAN[priceId] || "growth";

        await sb.from("workspaces").update({
          plan,
          stripe_subscription_id: session.subscription,
          stripe_customer_id: session.customer,
          subscription_status: "trialing",
          trial_ends_at: new Date(sub.trial_end * 1000).toISOString(),
          plan_updated_at: new Date().toISOString(),
        }).eq("id", workspaceId);

        console.log(`Checkout completado: workspace=${workspaceId} plan=${plan} trial_end=${sub.trial_end}`);
        break;
      }

      // ─── TRIAL TERMINANDO ───────────────────────────────────────────────────
      // Stripe avisa 3 días antes que el trial termina → podés enviar un email
      case "customer.subscription.trial_will_end": {
        const sub = event.data.object;
        const workspaceId = sub.metadata?.workspace_id;
        if (!workspaceId) break;

        // Enviar email de recordatorio (opcional — usando Resend del workspace o el tuyo)
        // Por ahora solo lo loggeamos
        const trialEnd = new Date(sub.trial_end * 1000);
        console.log(`Trial termina en 3 días: workspace=${workspaceId} fecha=${trialEnd.toISOString()}`);

        // TODO: enviar email recordatorio usando la Edge Function send-notification
        break;
      }

      // ─── PAGO EXITOSO ───────────────────────────────────────────────────────
      // Cada vez que Stripe cobra exitosamente (mensual o anual)
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        if (invoice.billing_reason === "subscription_create") break; // ya manejado arriba

        const customerId = invoice.customer as string;

        const { data: ws } = await sb
          .from("workspaces")
          .select("id, plan")
          .eq("stripe_customer_id", customerId)
          .single();

        if (ws) {
          await sb.from("workspaces").update({
            subscription_status: "active",
            last_payment_at: new Date().toISOString(),
          }).eq("id", ws.id);

          // Registrar el pago en billing_logs
          await sb.from("billing_logs").insert({
            workspace_id: ws.id,
            stripe_invoice_id: invoice.id,
            amount_usd: invoice.amount_paid / 100,
            status: "paid",
            period_start: new Date(invoice.period_start * 1000).toISOString(),
            period_end: new Date(invoice.period_end * 1000).toISOString(),
          });

          console.log(`Pago exitoso: workspace=${ws.id} monto=$${invoice.amount_paid / 100}`);
        }
        break;
      }

      // ─── PAGO FALLIDO ────────────────────────────────────────────────────────
      // Cuando falla el cobro → marcar como past_due pero no bloquear todavía
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        const { data: ws } = await sb
          .from("workspaces")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (ws) {
          await sb.from("workspaces").update({
            subscription_status: "past_due",
          }).eq("id", ws.id);

          console.log(`Pago fallido: workspace=${ws.id} — marcado past_due`);
          // TODO: enviar email de alerta al cliente
        }
        break;
      }

      // ─── PLAN CAMBIADO ───────────────────────────────────────────────────────
      // Cuando el cliente sube o baja de plan desde el Customer Portal
      case "customer.subscription.updated": {
        const sub = event.data.object;
        const workspaceId = sub.metadata?.workspace_id;
        if (!workspaceId) break;

        const priceId = sub.items?.data?.[0]?.price?.id;
        const newPlan = PRICE_TO_PLAN[priceId];
        if (!newPlan) break;

        const prevPlan = sub.previous_attributes?.items?.data?.[0]?.price?.id
          ? PRICE_TO_PLAN[sub.previous_attributes.items.data[0].price.id]
          : null;

        await sb.from("workspaces").update({
          plan: newPlan,
          subscription_status: sub.status,
          plan_updated_at: new Date().toISOString(),
        }).eq("id", workspaceId);

        console.log(`Plan actualizado: workspace=${workspaceId} ${prevPlan}→${newPlan}`);
        break;
      }

      // ─── SUSCRIPCIÓN CANCELADA ───────────────────────────────────────────────
      // Cuando el cliente cancela — mantener acceso hasta el fin del período pagado
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const workspaceId = sub.metadata?.workspace_id;
        if (!workspaceId) break;

        const periodEnd = new Date(sub.current_period_end * 1000);

        await sb.from("workspaces").update({
          subscription_status: "canceled",
          plan_ends_at: periodEnd.toISOString(),
          plan_updated_at: new Date().toISOString(),
        }).eq("id", workspaceId);

        console.log(`Suscripción cancelada: workspace=${workspaceId} acceso hasta=${periodEnd.toISOString()}`);
        break;
      }

      default:
        console.log(`Evento no manejado: ${event.type}`);
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    console.error(`Error procesando evento ${event.type}:`, msg);
    // Igual devolvemos 200 para que Stripe no reintente
  }

  // Stripe espera 200 para confirmar que recibimos el evento
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

// ─── VERIFICAR FIRMA DE STRIPE ────────────────────────────────────────────────
async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const parts = signature.split(",").reduce((acc, part) => {
      const [key, value] = part.split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const timestamp = parts["t"];
    const expectedSig = parts["v1"];

    if (!timestamp || !expectedSig) return false;

    // Verificar que el timestamp no sea muy viejo (previene replay attacks)
    const tolerance = 300; // 5 minutos
    if (Math.abs(Date.now() / 1000 - parseInt(timestamp)) > tolerance) {
      console.error("Stripe webhook timestamp muy viejo");
      return false;
    }

    const signedPayload = `${timestamp}.${payload}`;
    const keyData = new TextEncoder().encode(secret);
    const messageData = new TextEncoder().encode(signedPayload);

    const cryptoKey = await crypto.subtle.importKey(
      "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );

    const signature_bytes = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
    const computedSig = Array.from(new Uint8Array(signature_bytes))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    return computedSig === expectedSig;
  } catch {
    return false;
  }
}
