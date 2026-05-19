import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useLang } from "@/context/LangContext";

const T = { gold: "#C9A84C", goldBg: "rgba(201,168,76,.08)", goldBorder: "rgba(201,168,76,.22)" };
const FM = "'DM Mono',monospace";
const FS = "'DM Sans',sans-serif";
const FP = "'Playfair Display',serif";

const STEPS = [
  { id: "resend",    icon: "📧", title: t.integrations.resend.title,    desc: t.integrations.resend.desc },
  { id: "evolution", icon: "💬", title: t.integrations.evolution.title,  desc: t.integrations.evolution.desc },
  { id: "twilio",    icon: "📞", title: t.integrations.twilio.title,     desc: t.integrations.twilio.desc },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; message?: string; error?: string; hint?: string } | null>(null);

  // Resend fields
  const [resendKey, setResendKey] = useState("");
  const [resendFrom, setResendFrom] = useState("");
  const [resendName, setResendName] = useState("");

  // Evolution fields
  const [evoUrl, setEvoUrl] = useState("");
  const [evoKey, setEvoKey] = useState("");

  // Twilio fields
  const [twilioSid, setTwilioSid] = useState("");
  const [twilioToken, setTwilioToken] = useState("");
  const [twilioNumber, setTwilioNumber] = useState("");
  const [twilioTestPhone, setTwilioTestPhone] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setVerifyResult(null);
    try {
      const current = STEPS[step].id as "resend" | "evolution" | "twilio";
      if (current === "resend") {
        await api.saveKeys({ provider: "resend", key: resendKey, config: { fromEmail: resendFrom, fromName: resendName } });
      } else if (current === "evolution") {
        await api.saveKeys({ provider: "evolution", key: evoKey, config: { baseUrl: evoUrl } });
      } else {
        await api.saveKeys({ provider: "twilio", key: twilioToken, config: { accountSid: twilioSid, fromNumber: twilioNumber } });
      }
      setCompleted(p => ({ ...p, [current]: true }));
      if (step < STEPS.length - 1) setStep(s => s + 1);
      else navigate("/");
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const current = STEPS[step].id as "resend" | "evolution" | "twilio";
      const result = await api.verifyKeys(current, current === "twilio" ? twilioTestPhone : undefined);
      setVerifyResult(result);
    } catch {
      setVerifyResult({ success: false, error: "No se pudo conectar con el servidor" });
    } finally {
      setVerifying(false);
    }
  };

  const handleSkip = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else navigate("/");
  };

  const currentStep = STEPS[step];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12" style={{ background: "#07090F" }}>
      <div className="w-full max-w-lg space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-black text-white" style={{ fontFamily: FP }}>Closer</span>
            <span className="text-2xl font-black" style={{ color: T.gold, fontFamily: FP }}>AI</span>
          </div>
          <p className="text-lg font-bold text-white" style={{ fontFamily: FP }}>Conectá tus integraciones</p>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto" style={{ fontFamily: FS }}>
            {t.onboardingSub}
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex-1 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full transition-all" style={{ background: i <= step ? T.gold : "rgba(255,255,255,.08)" }} />
              {i < STEPS.length - 1 && <div className="text-zinc-700 text-xs">›</div>}
            </div>
          ))}
        </div>

        {/* Step card */}
        <div className="rounded-2xl border p-8 space-y-6" style={{ background: "rgba(255,255,255,.025)", borderColor: "rgba(255,255,255,.07)" }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentStep.icon}</span>
            <div>
              <p className="text-lg font-bold text-white" style={{ fontFamily: FP }}>{currentStep.title}</p>
              <p className="text-xs text-zinc-500" style={{ fontFamily: FM }}>{currentStep.desc}</p>
            </div>
            {completed[currentStep.id] && (
              <span className="ml-auto text-sm font-bold" style={{ color: "#10b981", fontFamily: FM }}>✓ Conectado</span>
            )}
          </div>

          {/* Fields per step */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="rounded-lg border p-3 text-xs" style={{ background: T.goldBg, borderColor: T.goldBorder, color: T.gold, fontFamily: FM }}>
                Creá una cuenta gratis en <strong>resend.com</strong> → API Keys → Create API Key → pegala acá
              </div>
              {[
                { label: "API Key", value: resendKey, setter: setResendKey, placeholder: "re_...", password: true },
                { label: "Email remitente", value: resendFrom, setter: setResendFrom, placeholder: "hola@tudominio.com" },
                { label: "Nombre remitente", value: resendName, setter: setResendName, placeholder: "Tu Nombre" },
              ].map(({ label, value, setter, placeholder, password }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500" style={{ fontFamily: FM }}>{label}</label>
                  <input type={password ? "password" : "text"} value={value} onChange={e => setter(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 outline-none"
                    style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", fontFamily: FS }}
                  />
                </div>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="rounded-lg border p-3 text-xs" style={{ background: T.goldBg, borderColor: T.goldBorder, color: T.gold, fontFamily: FM }}>
                Necesitás una instancia de <strong>Evolution API</strong> corriendo. Podés usar la versión cloud en evolution-api.com o self-hosted con Docker.
              </div>
              {[
                { label: "URL Base", value: evoUrl, setter: setEvoUrl, placeholder: "https://tu-evolution.com" },
                { label: "API Key", value: evoKey, setter: setEvoKey, placeholder: "tu-api-key", password: true },
              ].map(({ label, value, setter, placeholder, password }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500" style={{ fontFamily: FM }}>{label}</label>
                  <input type={password ? "password" : "text"} value={value} onChange={e => setter(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 outline-none"
                    style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", fontFamily: FS }}
                  />
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-lg border p-3 text-xs" style={{ background: T.goldBg, borderColor: T.goldBorder, color: T.gold, fontFamily: FM }}>
                Creá una cuenta en <strong>twilio.com</strong> → Console → Account Info. Comprá un número +1 para SMS y llamadas.
              </div>
              {[
                { label: "Account SID", value: twilioSid, setter: setTwilioSid, placeholder: "ACxxx..." },
                { label: "Auth Token", value: twilioToken, setter: setTwilioToken, placeholder: "tu auth token", password: true },
                { label: "Número Twilio (From)", value: twilioNumber, setter: setTwilioNumber, placeholder: "+14155550100" },
                { label: "Teléfono de prueba (opcional)", value: twilioTestPhone, setter: setTwilioTestPhone, placeholder: "+5491112345678" },
              ].map(({ label, value, setter, placeholder, password }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500" style={{ fontFamily: FM }}>{label}</label>
                  <input type={password ? "password" : "text"} value={value} onChange={e => setter(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 outline-none"
                    style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", fontFamily: FS }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Verify result */}
          {verifyResult && (
            <div className="rounded-lg border px-4 py-3 text-sm space-y-1"
              style={{ background: verifyResult.success ? "rgba(16,185,129,.06)" : "rgba(239,68,68,.06)", borderColor: verifyResult.success ? "rgba(16,185,129,.2)" : "rgba(239,68,68,.2)", color: verifyResult.success ? "#10b981" : "#f87171", fontFamily: FS }}>
              <p className="font-semibold">{verifyResult.success ? t.testSuccess : t.testFail}</p>
              {(verifyResult.message || verifyResult.error) && <p className="text-xs opacity-80">{verifyResult.message || verifyResult.error}</p>}
              {verifyResult.hint && <p className="text-xs opacity-60">{verifyResult.hint}</p>}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleVerify} disabled={verifying}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all border disabled:opacity-50"
              style={{ background: "transparent", borderColor: "rgba(255,255,255,.1)", color: "#a1a1aa", fontFamily: FS }}>
              {verifying ? t.testing : t.test}
            </button>
            <button onClick={handleSave} disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
              style={{ background: `linear-gradient(135deg,${T.gold},#E8C96A)`, color: "#07090F", fontFamily: FS }}>
              {loading ? t.saving : step === STEPS.length - 1 ? "Empezar →" : t.saveAndContinue}
            </button>
          </div>

          <button onClick={handleSkip} className="w-full text-center text-xs text-zinc-700 hover:text-zinc-500 transition-colors" style={{ fontFamily: FM }}>
            Saltear por ahora — configurar después en Ajustes
          </button>
        </div>
      </div>
    </div>
  );
}
