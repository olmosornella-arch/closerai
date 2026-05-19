import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";

const G = { gold:"#C9A84C", goldBg:"rgba(201,168,76,.08)", goldBorder:"rgba(201,168,76,.22)" };
const FM = "'DM Mono',monospace";
const FS = "'DM Sans',sans-serif";
const FP = "'Playfair Display',serif";

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-1 rounded-lg p-1" style={{background:"rgba(255,255,255,.05)"}}>
      {(["es","en"] as const).map(l=>(
        <button key={l} onClick={()=>setLang(l)} className="px-2.5 py-1 rounded text-xs font-semibold uppercase transition-all"
          style={{background:lang===l?G.goldBg:"transparent",color:lang===l?G.gold:"#52525b",fontFamily:FM}}>{l}</button>
      ))}
    </div>
  );
}

export function LoginPage() {
  const { signIn } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const result = await signIn(email, password);
    if (result.error) { setError(result.error); setLoading(false); }
    else navigate("/app");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{background:"#07090F"}}>
      <div className="absolute top-4 right-4"><LangToggle /></div>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-black text-white" style={{fontFamily:FP}}>Closer</span>
            <span className="text-4xl font-black" style={{color:G.gold,fontFamily:FP}}>AI</span>
          </div>
          <p className="text-sm text-zinc-500" style={{fontFamily:FM}}>{t.tagline}</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl border p-8 space-y-5" style={{background:"rgba(255,255,255,.025)",borderColor:"rgba(255,255,255,.07)"}}>
          <h2 className="text-xl font-bold text-white" style={{fontFamily:FP}}>{t.login}</h2>
          {error && <div className="rounded-lg px-4 py-3 text-sm" style={{background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",color:"#f87171",fontFamily:FS}}>{error}</div>}
          <div className="space-y-4">
            {[
              {label:t.email,value:email,setter:setEmail,placeholder:t.emailPlaceholder,type:"email"},
              {label:t.password,value:password,setter:setPassword,placeholder:"••••••••",type:"password"},
            ].map(({label,value,setter,placeholder,type})=>(
              <div key={label} className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500" style={{fontFamily:FM}}>{label}</label>
                <input type={type} value={value} onChange={e=>setter(e.target.value)} required placeholder={placeholder}
                  className="w-full rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-all"
                  style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",fontFamily:FS}} />
              </div>
            ))}
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-50"
            style={{background:`linear-gradient(135deg,${G.gold},#E8C96A)`,color:"#07090F",fontFamily:FS}}>
            {loading ? t.loading : t.loginBtn}
          </button>
          <p className="text-center text-sm text-zinc-600" style={{fontFamily:FS}}>
            {t.noAccount} <Link to="/signup" className="font-semibold" style={{color:G.gold}}>{t.startFree}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export function SignupPage() {
  const { signUp } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [step, setStep] = useState<"plan"|"form">("plan");
  const [selectedPlan, setSelectedPlan] = useState<"growth"|"pro"|"agency">("pro");
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const PLANS = [
    {id:"growth" as const, highlight:false, ...t.plans.growth},
    {id:"pro" as const,    highlight:true,  ...t.plans.pro},
    {id:"agency" as const, highlight:false, ...t.plans.agency},
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError(t.passwordMin); return; }
    setLoading(true); setError("");
    const result = await signUp(email, password, name);
    if (result.error) { setError(result.error); setLoading(false); }
    else navigate("/onboarding");
  };

  if (step === "plan") return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4" style={{background:"#07090F"}}>
      <div className="absolute top-4 right-4"><LangToggle /></div>
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-black text-white" style={{fontFamily:FP}}>Closer</span>
            <span className="text-3xl font-black" style={{color:G.gold,fontFamily:FP}}>AI</span>
          </div>
          <p className="text-xl font-bold text-white" style={{fontFamily:FP}}>{t.choosePlan}</p>
          <p className="text-sm text-zinc-500" style={{fontFamily:FS}}>{t.choosePlanSub}</p>
        </div>
        <div className="flex justify-center">
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border" style={{background:G.goldBg,borderColor:G.goldBorder}}>
            <span className="text-sm">⏱</span>
            <span className="text-sm font-semibold" style={{color:G.gold,fontFamily:FS}}>{t.trialBadge}</span>
            <span className="text-xs text-zinc-500" style={{fontFamily:FM}}>· {t.trialNote}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map(plan=>(
            <button key={plan.id} onClick={()=>{setSelectedPlan(plan.id);setStep("form");}}
              className="rounded-2xl border p-7 text-left space-y-5 transition-all hover:scale-[1.02]"
              style={{background:plan.highlight?G.goldBg:"rgba(255,255,255,.025)",borderColor:plan.highlight?G.goldBorder:"rgba(255,255,255,.07)"}}>
              {plan.highlight && <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{background:G.gold,color:"#07090F",fontFamily:FM}}>{t.mostPopular}</span>}
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white" style={{fontFamily:FP}}>{plan.price}</span>
                  <span className="text-sm text-zinc-500" style={{fontFamily:FS}}>{t.perMonth}</span>
                </div>
                <p className="text-[10px] text-zinc-600" style={{fontFamily:FM}}>{t.afterTrial}</p>
                <p className="text-lg font-bold text-white" style={{fontFamily:FP}}>{plan.name}</p>
                <p className="text-xs text-zinc-500" style={{fontFamily:FS}}>{plan.desc}</p>
              </div>
              <ul className="space-y-2.5">
                {plan.features.map(f=>(
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-400" style={{fontFamily:FS}}>
                    <span className="flex-shrink-0 mt-0.5" style={{color:G.gold}}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <div className="w-full py-3 rounded-xl text-center text-sm font-bold"
                style={{background:plan.highlight?`linear-gradient(135deg,${G.gold},#E8C96A)`:"rgba(255,255,255,.06)",color:plan.highlight?"#07090F":"#e4e4e7",fontFamily:FS}}>
                {t.selectPlan} {plan.name} →
              </div>
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-zinc-600" style={{fontFamily:FM}}>{t.byokNote}</p>
        <p className="text-center text-sm text-zinc-600" style={{fontFamily:FS}}>
          {t.alreadyAccount} <Link to="/login" className="font-semibold" style={{color:G.gold}}>{t.loginLink}</Link>
        </p>
      </div>
    </div>
  );

  const plan = PLANS.find(p=>p.id===selectedPlan)!;
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:"#07090F"}}>
      <div className="absolute top-4 right-4"><LangToggle /></div>
      <div className="w-full max-w-md space-y-6">
        <button onClick={()=>setStep("plan")} className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors" style={{fontFamily:FM}}>{t.changePlan}</button>
        <div className="rounded-xl border px-4 py-3.5 flex items-center justify-between" style={{background:G.goldBg,borderColor:G.goldBorder}}>
          <div>
            <p className="text-sm font-bold" style={{color:G.gold,fontFamily:FP}}>{plan.name}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5" style={{fontFamily:FM}}>{t.trialBadge} · {t.trialNote}</p>
          </div>
          <p className="text-xl font-black" style={{color:G.gold,fontFamily:FP}}>{plan.price}<span className="text-sm font-normal text-zinc-500">{t.perMonth}</span></p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl border p-8 space-y-5" style={{background:"rgba(255,255,255,.025)",borderColor:"rgba(255,255,255,.07)"}}>
          <h2 className="text-xl font-bold text-white" style={{fontFamily:FP}}>{t.signup}</h2>
          {error && <div className="rounded-lg px-4 py-3 text-sm" style={{background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",color:"#f87171",fontFamily:FS}}>{error}</div>}
          <div className="space-y-4">
            {[
              {label:t.name,value:name,setter:setName,placeholder:t.namePlaceholder,type:"text"},
              {label:t.email,value:email,setter:setEmail,placeholder:t.emailPlaceholder,type:"email"},
              {label:t.password,value:password,setter:setPassword,placeholder:t.passwordMin,type:"password"},
            ].map(({label,value,setter,placeholder,type})=>(
              <div key={label} className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500" style={{fontFamily:FM}}>{label}</label>
                <input type={type} value={value} onChange={e=>setter(e.target.value)} required placeholder={placeholder}
                  className="w-full rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-all"
                  style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",fontFamily:FS}} />
              </div>
            ))}
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-50"
            style={{background:`linear-gradient(135deg,${G.gold},#E8C96A)`,color:"#07090F",fontFamily:FS}}>
            {loading ? t.creatingBtn : t.createBtn}
          </button>
          <p className="text-[10px] text-center text-zinc-600" style={{fontFamily:FM}}>{t.terms}</p>
        </form>
      </div>
    </div>
  );
}
