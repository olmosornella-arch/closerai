// src/components/app/TrialBanner.tsx
// Muestra los días restantes del trial y el botón de upgrade
// Se muestra arriba de la app cuando el trial está activo

import { trialDaysLeft, isTrialActive } from "@/lib/plans";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/context/LangContext";
import { Link } from "react-router-dom";

const T = { gold: "#C9A84C", goldBg: "rgba(201,168,76,.08)", goldBorder: "rgba(201,168,76,.22)" };
const FM = "'DM Mono',monospace";
const FS = "'DM Sans',sans-serif";

interface TrialBannerProps {
  trialEndsAt: string | null;
  plan: string;
}

export function TrialBanner({ trialEndsAt, plan }: TrialBannerProps) {
  const navigate = useNavigate();
  if (!isTrialActive(trialEndsAt)) return null;

  const daysLeft = trialDaysLeft(trialEndsAt);
  const { lang } = useLang();

  const isUrgent = daysLeft <= 3;

  return (
    <div
      className="w-full px-4 py-2 flex items-center justify-between text-xs"
      style={{
        background: isUrgent ? "rgba(239,68,68,.08)" : T.goldBg,
        borderBottom: `1px solid ${isUrgent ? "rgba(239,68,68,.2)" : T.goldBorder}`,
      }}
    >
      <div className="flex items-center gap-2">
        <span>{isUrgent ? "⚠" : "⏱"}</span>
        <span style={{ color: isUrgent ? "#f87171" : T.gold, fontFamily: FM }}>
          {lang === "es"
            ? `${daysLeft} ${daysLeft === 1 ? "día" : "días"} restantes en tu trial gratuito`
            : `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left in your free trial`}
        </span>
      </div>
      {/* TODO: cuando conectes Stripe, este botón abre el Checkout */}
      <button
        className="px-3 py-1 rounded-lg text-[10px] font-bold transition-all hover:opacity-80"
        style={{ background: isUrgent ? "rgba(239,68,68,.15)" : `linear-gradient(135deg,${T.gold},#E8C96A)`, color: isUrgent ? "#f87171" : "#07090F", fontFamily: FM }}
        onClick={() => {
          navigate("/upgrade");
        }}
      >
        {lang === "es" ? "Elegir plan →" : "Choose plan →"}
      </button>
    </div>
  );
}
