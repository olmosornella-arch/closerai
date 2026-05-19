// src/pages/upgrade/UpgradePage.tsx
// Página de upgrade/planes con Stripe Checkout real
// Accesible en /upgrade — también sirve como modal desde el TrialBanner

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { callEdgeFunction } from "@/lib/supabase";
import { PLANS, STRIPE_PRICE_IDS, getAnnualSavings } from "@/lib/plans";
import { useNavigate } from "react-router-dom";

const T = { gold:"#C9A84C", goldBg:"rgba(201,168,76,.08)", goldBorder:"rgba(201,168,76,.22)", bg:"#07090F", card:"#0D0F17", text:"#E8E6E0", muted:"#52525b" };
const FM = "'DM Mono',monospace";
const FS = "'DM Sans',sans-serif";
const FP = "'Playfair Display',serif";

const PLAN_FEATURES = {
  growth: ["WhatsApp BYOK","Email campaigns","IA generación mensajes","1 workspace","500 contactos"],
  pro:    ["Todo Growth +","SMS y Dialer USA/CA","Closer View completa","Secuencias automáticas","5 Actos","Email Marketing IA","3 workspaces · 2.500 contactos"],
  agency: ["Todo Pro +","Workspaces ilimitados","Usuarios ilimitados","API access","White-label","Soporte dedicado"],
};

export function UpgradePage() {
  const { user, workspace } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [cycle, setCycle] = useState<"monthly"|"annual">("monthly");
  const [loading, setLoading] = useState<string|null>(null);
  const [error, setError] = useState("");

  const currentPlan = workspace?.plan || "trial";

  const handleCheckout = async (planId: "growth"|"pro"|"agency") => {
    if (!user) { navigate("/login"); return; }
    setLoading(planId); setError("");
    try {
      const priceId = STRIPE_PRICE_IDS[planId][cycle];
      if (priceId.includes("COMPLETAR")) {
        setError(lang==="es"
          ? "Stripe aún no está configurado. Completá los Price IDs en src/lib/plans.ts"
          : "Stripe not configured yet. Add your Price IDs in src/lib/plans.ts");
        setLoading(null); return;
      }
      const { url } = await callEdgeFunction<{ url: string }>("stripe-checkout", {
        priceId,
        email: user.email,
        trialDays: 0, // ya pasó el trial
        successUrl: `${window.location.origin}/app?upgraded=true`,
        cancelUrl: `${window.location.origin}/upgrade`,
      });
      if (url) window.location.href = url;
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  };

  const handlePortal = async () => {
    try {
      const { url } = await callEdgeFunction<{ url: string }>("stripe-portal", {
        returnUrl: `${window.location.origin}/upgrade`,
      });
      if (url) window.location.href = url;
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen" style={{background:T.bg, fontFamily:FS}}>
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-8 text-center">
        <button onClick={() => navigate("/app")} className="text-xs mb-8 block mx-auto"
          style={{color:T.muted,fontFamily:FM}}>← Volver a la app</button>
        <h1 className="text-3xl font-black text-white mb-3" style={{fontFamily:FP}}>
          {lang==="es" ? "Elegí tu plan" : "Choose your plan"}
        </h1>
        <p className="text-sm" style={{color:T.muted}}>
          {lang==="es"
            ? "Todos los planes incluyen trial de 14 días. Sin tarjeta de crédito para empezar."
            : "All plans include a 14-day trial. No credit card required to start."}
        </p>

        {/* Cycle toggle */}
        <div className="inline-flex items-center gap-1 mt-6 p-1 rounded-xl"
          style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.06)"}}>
          {(["monthly","annual"] as const).map(c => (
            <button key={c} onClick={() => setCycle(c)}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: cycle===c ? T.goldBg : "transparent",
                color: cycle===c ? T.gold : T.muted,
                fontFamily: FM,
              }}>
              {c==="monthly"
                ? (lang==="es" ? "Mensual" : "Monthly")
                : (lang==="es" ? "Anual −20%" : "Annual −20%")}
            </button>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div className="max-w-4xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["growth","pro","agency"] as const).map(planId => {
          const plan = PLANS[planId];
          const price = plan.price[cycle];
          const savings = getAnnualSavings(planId);
          const isCurrent = currentPlan === planId;
          const isPro = planId === "pro";

          return (
            <div key={planId}
              className="rounded-2xl border p-6 flex flex-col relative"
              style={{
                background: isPro ? "rgba(201,168,76,.06)" : T.card,
                borderColor: isPro ? T.goldBorder : "rgba(255,255,255,.06)",
                boxShadow: isPro ? `0 0 40px rgba(201,168,76,.08)` : "none",
              }}>
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full"
                    style={{background:T.gold,color:"#07090F",fontFamily:FM}}>
                    {lang==="es" ? "MÁS POPULAR" : "MOST POPULAR"}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{color:isPro?T.gold:T.muted,fontFamily:FM}}>{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">${price}</span>
                  <span className="text-xs" style={{color:T.muted,fontFamily:FM}}>/mes</span>
                </div>
                {cycle==="annual" && savings > 0 && (
                  <p className="text-[11px] mt-1" style={{color:"#10b981",fontFamily:FM}}>
                    Ahorrás ${savings}/año
                  </p>
                )}
              </div>

              <ul className="space-y-2 flex-1 mb-6">
                {PLAN_FEATURES[planId].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{color:T.text}}>
                    <span style={{color:"#10b981",flexShrink:0}}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full py-3 rounded-xl text-center text-xs font-bold"
                  style={{background:"rgba(255,255,255,.04)",color:T.muted,fontFamily:FM}}>
                  {lang==="es" ? "Plan actual" : "Current plan"}
                </div>
              ) : (
                <button
                  onClick={() => handleCheckout(planId)}
                  disabled={!!loading}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: loading===planId ? "rgba(255,255,255,.05)" :
                      isPro ? `linear-gradient(135deg,${T.gold},#E8C96A)` : "rgba(255,255,255,.06)",
                    color: loading===planId ? T.muted :
                      isPro ? "#07090F" : T.text,
                    border: isPro ? "none" : "1px solid rgba(255,255,255,.1)",
                    fontFamily: FM,
                  }}>
                  {loading===planId
                    ? "..."
                    : lang==="es" ? `Empezar con ${plan.name}` : `Start with ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Manage billing */}
      {currentPlan !== "trial" && (
        <div className="max-w-4xl mx-auto px-6 pb-8 text-center">
          <button onClick={handlePortal} className="text-xs underline"
            style={{color:T.muted}}>
            {lang==="es" ? "Administrar facturación y suscripción" : "Manage billing and subscription"}
          </button>
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto px-6 pb-8">
          <div className="rounded-xl border p-3 text-xs text-center"
            style={{background:"rgba(239,68,68,.06)",borderColor:"rgba(239,68,68,.2)",color:"#f87171"}}>
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
