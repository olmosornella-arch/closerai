// src/components/app/FeatureGate.tsx
// Envuelve cualquier feature y la bloquea si el plan no la incluye
// Uso: <FeatureGate feature="sms"><SMSModule /></FeatureGate>

import { hasFeature, PLANS, PlanId } from "@/lib/plans";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";

const T = { gold: "#C9A84C", goldBg: "rgba(201,168,76,.08)", goldBorder: "rgba(201,168,76,.22)" };
const FM = "'DM Mono',monospace";
const FS = "'DM Sans',sans-serif";
const FP = "'Playfair Display',serif";

type Feature = keyof typeof PLANS.growth.features;

interface FeatureGateProps {
  feature: Feature;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FEATURE_LABELS: Record<Feature, { es: string; en: string }> = {
  whatsapp:       { es: "WhatsApp", en: "WhatsApp" },
  sms:            { es: "SMS & Dialer", en: "SMS & Dialer" },
  voiceDialer:    { es: "Dialer de voz", en: "Voice Dialer" },
  emailCampaigns: { es: "Campañas de email", en: "Email Campaigns" },
  sequences:      { es: "Secuencias automáticas", en: "Automated Sequences" },
  aiMessages:     { es: "Redacción con IA", en: "AI Messaging" },
  closerView:     { es: "Vista Closer", en: "Closer View" },
  fiveActSystem:  { es: "Secuencia 5 Actos", en: "5-Act System" },
  apiAccess:      { es: "API Access", en: "API Access" },
  whiteLabel:     { es: "White-label", en: "White-label" },
  prioritySupport:{ es: "Soporte prioritario", en: "Priority Support" },
};

const UPGRADE_PLAN: Record<Feature, PlanId> = {
  whatsapp:       "growth",
  sms:            "pro",
  voiceDialer:    "pro",
  emailCampaigns: "growth",
  sequences:      "pro",
  aiMessages:     "growth",
  closerView:     "pro",
  fiveActSystem:  "pro",
  apiAccess:      "agency",
  whiteLabel:     "agency",
  prioritySupport:"pro",
};

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { workspace } = useAuth();
  const { lang } = useLang();
  const plan = (workspace?.plan || "growth") as PlanId;

  if (hasFeature(plan, feature)) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  const featureLabel = FEATURE_LABELS[feature][lang];
  const requiredPlan = UPGRADE_PLAN[feature];
  const requiredPlanName = PLANS[requiredPlan].name;

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-64 p-8 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
        style={{ background: T.goldBg, border: `1px solid ${T.goldBorder}` }}>
        🔒
      </div>
      <div className="space-y-2">
        <p className="text-lg font-bold text-white" style={{ fontFamily: FP }}>
          {lang === "es" ? `${featureLabel} no está disponible en tu plan` : `${featureLabel} is not available on your plan`}
        </p>
        <p className="text-sm text-zinc-500 max-w-xs" style={{ fontFamily: FS }}>
          {lang === "es"
            ? `Esta función está disponible desde el plan ${requiredPlanName}.`
            : `This feature is available starting with the ${requiredPlanName} plan.`}
        </p>
      </div>
      {/* TODO: conectar con Stripe Checkout cuando integres pagos */}
      <button
        className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
        style={{ background: `linear-gradient(135deg,${T.gold},#E8C96A)`, color: "#07090F", fontFamily: FS }}
        onClick={() => window.location.href = "/upgrade"}
      >
        {lang === "es" ? `Pasarme al plan ${requiredPlanName} →` : `Upgrade to ${requiredPlanName} →`}
      </button>
    </div>
  );
}
