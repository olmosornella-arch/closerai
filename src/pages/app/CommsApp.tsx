// CloserAI — Communications Engine
// Resend + Evolution API (WhatsApp) + Twilio (SMS + Voice Dialer)
// Silent Luxury design system — compatible con CloserAI v12
import { useState, useEffect, useCallback, useRef, useContext, createContext } from "react";

// ─── FONT INJECTION ────────────────────────────────────────────────────────────
const _fl = document.createElement("link");
_fl.rel = "stylesheet";
_fl.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap";
document.head.appendChild(_fl);

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  gold: "#C9A84C", goldBg: "rgba(201,168,76,.08)", goldBorder: "rgba(201,168,76,.22)",
  emerald: "#10b981", emeraldBg: "rgba(16,185,129,.07)", emeraldBorder: "rgba(16,185,129,.2)",
  red: "#f87171", redBg: "rgba(239,68,68,.06)", redBorder: "rgba(239,68,68,.18)",
  purple: "#a78bfa", purpleBg: "rgba(167,130,250,.07)", purpleBorder: "rgba(167,130,250,.2)",
  blue: "#60a5fa", blueBg: "rgba(96,165,250,.07)", blueBorder: "rgba(96,165,250,.2)",
  bg: "#07090F", surface: "rgba(255,255,255,.025)", border: "rgba(255,255,255,.07)",
};
const FM = "'DM Mono',monospace";
const FS = "'DM Sans',sans-serif";
const FP = "'Playfair Display',serif";

// ─── LOCAL STORAGE ─────────────────────────────────────────────────────────────
const store = {
  get: (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ─── CONTEXT ───────────────────────────────────────────────────────────────────
const CommsCtx = createContext();

function CommsProvider({ children }) {
  const [config, setConfig] = useState(() => store.get("comms_config", {
    resend: { apiKey: "", fromEmail: "", fromName: "" },
    evolution: { baseUrl: "", apiKey: "", instances: [] },
    twilio: { accountSid: "", authToken: "", fromNumber: "", tokenUrl: "" },
  }));
  const [toast, setToast] = useState(null);
  const [sequences, setSequences] = useState(() => store.get("comms_sequences", []));
  const [campaigns, setCampaigns] = useState(() => store.get("comms_campaigns", []));
  const [contacts, setContacts] = useState(() => store.get("comms_contacts", DEMO_CONTACTS));
  const [callLogs, setCallLogs] = useState(() => store.get("comms_calls", []));

  useEffect(() => { store.set("comms_config", config); }, [config]);
  useEffect(() => { store.set("comms_sequences", sequences); }, [sequences]);
  useEffect(() => { store.set("comms_campaigns", campaigns); }, [campaigns]);
  useEffect(() => { store.set("comms_contacts", contacts); }, [contacts]);
  useEffect(() => { store.set("comms_calls", callLogs); }, [callLogs]);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const updateConfig = useCallback((section, data) => {
    setConfig(p => ({ ...p, [section]: { ...p[section], ...data } }));
  }, []);

  const addCallLog = useCallback((log) => {
    setCallLogs(p => [{ ...log, id: Date.now(), ts: Date.now() }, ...p.slice(0, 99)]);
  }, []);

  return (
    <CommsCtx.Provider value={{ config, updateConfig, sequences, setSequences, campaigns, setCampaigns, contacts, setContacts, callLogs, addCallLog, showToast }}>
      {children}
      {toast && <Toast msg={toast.msg} type={toast.type} key={toast.id} />}
    </CommsCtx.Provider>
  );
}

// ─── DEMO DATA ─────────────────────────────────────────────────────────────────
const DEMO_CONTACTS = [
  { id: 1, name: "Lucas Ferreira", phone: "+5491112345678", email: "lucas@startup.io", tags: ["B2B","SaaS"], channel: "whatsapp", status: "new" },
  { id: 2, name: "Camila Torres", phone: "+5491187654321", email: "camila@coach.com", tags: ["Coach","Ads"], channel: "whatsapp", status: "contacted" },
  { id: 3, name: "John Miller", phone: "+14155550123", email: "john@agency.us", tags: ["USA","Agency"], channel: "sms", status: "new" },
  { id: 4, name: "Sarah Chen", phone: "+16175550456", email: "sarah@saas.ca", tags: ["Canada","SaaS"], channel: "sms", status: "replied" },
  { id: 5, name: "María Velázquez", phone: "+5491199887766", email: "maria@velazquez.com", tags: ["Founder","LATAM"], channel: "email", status: "call_scheduled" },
];

const DEMO_SEQUENCES = [
  { id: 1, name: "High-Ticket LATAM", channel: "whatsapp", steps: [
    { day: 0, action: "send_message", template: "apertura_wa", label: "Apertura WA — observación específica" },
    { day: 2, action: "send_message", template: "followup_wa", label: "Follow-up — validar encaje" },
    { day: 5, action: "send_message", template: "breakup_wa", label: "Breakup empático" },
  ], active: true, enrolled: 12, converted: 3 },
  { id: 2, name: "USA Outbound — SMS", channel: "sms", steps: [
    { day: 0, action: "send_sms", template: "apertura_sms", label: "Primer SMS — pattern interrupt" },
    { day: 1, action: "call", template: null, label: "Llamada de seguimiento" },
    { day: 3, action: "send_sms", template: "followup_sms", label: "Follow-up SMS" },
    { day: 6, action: "send_sms", template: "breakup_sms", label: "Breakup SMS" },
  ], active: true, enrolled: 8, converted: 2 },
  { id: 3, name: "Email Nurture — High-Ticket", channel: "email", steps: [
    { day: 0, action: "send_email", template: "welcome_email", label: "Email bienvenida + caso de estudio" },
    { day: 3, action: "send_email", template: "value_email", label: "Email de valor — objeción precio" },
    { day: 7, action: "send_email", template: "case_study", label: "Caso de estudio B2B" },
    { day: 14, action: "send_email", template: "breakup_email", label: "Email breakup" },
  ], active: false, enrolled: 24, converted: 7 },
];

// ─── SHARED UI ─────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  const colors = { success: `${T.goldBg};border-color:${T.goldBorder};color:${T.gold}`, error: `${T.redBg};border-color:${T.redBorder};color:${T.red}`, info: "rgba(255,255,255,.04);border-color:rgba(255,255,255,.1);color:#a1a1aa" };
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-medium animate-slideUp max-w-xs"
      style={{ background: type === "success" ? T.goldBg : type === "error" ? T.redBg : "rgba(255,255,255,.04)", borderColor: type === "success" ? T.goldBorder : type === "error" ? T.redBorder : "rgba(255,255,255,.1)", color: type === "success" ? T.gold : type === "error" ? T.red : "#a1a1aa", fontFamily: FM }}>
      <span>{type === "success" ? "◆" : type === "error" ? "△" : "◈"}</span>{msg}
    </div>
  );
}

const Btn = ({ children, onClick, disabled, variant = "primary", size = "md", className = "" }) => {
  const v = { primary: { background: `linear-gradient(135deg,${T.gold},#E8C96A)`, color: "#07090F", border: "none" }, secondary: { background: "rgba(255,255,255,.04)", color: "#a1a1aa", border: "1px solid rgba(255,255,255,.08)" }, danger: { background: T.redBg, color: T.red, border: `1px solid ${T.redBorder}` }, ghost: { background: "transparent", color: "#71717a", border: "1px solid transparent" } };
  const s = { xs: "text-[10px] px-2.5 py-1", sm: "text-xs px-3.5 py-1.5", md: "text-sm px-5 py-2.5", lg: "text-sm px-7 py-3.5" };
  return <button onClick={onClick} disabled={disabled} className={`rounded-lg font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${s[size]} ${className}`} style={{ fontFamily: FS, ...v[variant] }}>{children}</button>;
};

const Field = ({ label, value, onChange, placeholder, type = "text", multiline, hint, password }) => (
  <div className="space-y-1.5">
    {label && <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-zinc-500" style={{ fontFamily: FM }}>{label}</label>}
    {multiline
      ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 outline-none resize-none transition-all" style={{ background: "rgba(255,255,255,.02)", border: `1px solid ${T.border}`, fontFamily: FS }} onFocus={e => e.target.style.borderColor = T.goldBorder} onBlur={e => e.target.style.borderColor = T.border} />
      : <input type={password ? "password" : type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-all" style={{ background: "rgba(255,255,255,.02)", border: `1px solid ${T.border}`, fontFamily: FS }} onFocus={e => e.target.style.borderColor = T.goldBorder} onBlur={e => e.target.style.borderColor = T.border} />}
    {hint && <p className="text-[10px] text-zinc-600" style={{ fontFamily: FM }}>{hint}</p>}
  </div>
);

const Badge = ({ children, color = "zinc" }) => {
  const c = { zinc: "rgba(255,255,255,.05)/rgba(255,255,255,.1)/#71717a", gold: `${T.goldBg}/${T.goldBorder}/${T.gold}`, emerald: `${T.emeraldBg}/${T.emeraldBorder}/${T.emerald}`, red: `${T.redBg}/${T.redBorder}/${T.red}`, purple: `${T.purpleBg}/${T.purpleBorder}/${T.purple}`, blue: `${T.blueBg}/${T.blueBorder}/${T.blue}` }[color].split("/");
  return <span className="text-[9px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border" style={{ background: c[0], borderColor: c[1], color: c[2], fontFamily: FM }}>{children}</span>;
};

const Card = ({ children, className = "", gold = false }) => (
  <div className={`rounded-xl border p-5 ${className}`} style={{ background: gold ? T.goldBg : T.surface, borderColor: gold ? T.goldBorder : T.border }}>{children}</div>
);

const SectionHeader = ({ title, sub }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-white" style={{ fontFamily: FP, letterSpacing: "-.01em" }}>{title}</h2>
    {sub && <p className="text-xs text-zinc-600 mt-1" style={{ fontFamily: FM }}>{sub}</p>}
  </div>
);

const Stat = ({ label, value, color }) => (
  <div className="rounded-xl border p-4 stat-card" style={{ background: T.surface, borderColor: T.border }}>
    <p className="text-[9px] uppercase tracking-[.18em] text-zinc-600 mb-2" style={{ fontFamily: FM }}>{label}</p>
    <p className="text-3xl font-black" style={{ color: color || "#e4e4e7", fontFamily: FP, letterSpacing: "-.02em" }}>{value}</p>
  </div>
);

// ─── RESEND — EMAIL ENGINE ──────────────────────────────────────────────────────
const resendAPI = {
  send: async (cfg, { to, subject, html, text }) => {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${cfg.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: `${cfg.fromName} <${cfg.fromEmail}>`, to: Array.isArray(to) ? to : [to], subject, html: html || `<p>${text}</p>` }),
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.message || `Error ${res.status}`); }
    return res.json();
  },
  sendBatch: async (cfg, emails) => {
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { "Authorization": `Bearer ${cfg.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(emails.map(e => ({ from: `${cfg.fromName} <${cfg.fromEmail}>`, ...e }))),
    });
    if (!res.ok) throw new Error(`Batch error ${res.status}`);
    return res.json();
  },
};

function EmailModule() {
  const { config, campaigns, setCampaigns, contacts, showToast } = useContext(CommsCtx);
  const [tab, setTab] = useState("campaigns");
  const [newCampaign, setNewCampaign] = useState({ name: "", subject: "", body: "", segment: "all" });
  const [sending, setSending] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [showNew, setShowNew] = useState(false);

  const emailContacts = contacts.filter(c => c.email && (newCampaign.segment === "all" || c.tags.includes(newCampaign.segment)));
  const allTags = [...new Set(contacts.flatMap(c => c.tags))];

  const handleTest = async () => {
    if (!config.resend.apiKey) { showToast("Configurá tu Resend API Key en Ajustes", "error"); return; }
    if (!testEmail) { showToast("Ingresá un email de prueba", "error"); return; }
    setSending(true);
    try {
      await resendAPI.send(config.resend, { to: testEmail, subject: newCampaign.subject || "Test CloserAI", html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:40px"><h2>${newCampaign.subject}</h2><div>${newCampaign.body.replace(/\n/g,"<br/>")}</div><p style="color:#999;font-size:12px;margin-top:40px">Enviado via CloserAI Communications</p></div>` });
      showToast(`✓ Email de prueba enviado a ${testEmail}`);
    } catch (e) { showToast(e.message, "error"); }
    finally { setSending(false); }
  };

  const handleLaunch = async () => {
    if (!config.resend.apiKey) { showToast("Configurá tu Resend API Key en Ajustes", "error"); return; }
    if (!newCampaign.subject || !newCampaign.body) { showToast("Completá asunto y cuerpo del email", "error"); return; }
    setSending(true);
    try {
      const emails = emailContacts.map(c => ({
        to: c.email, subject: newCampaign.subject.replace("[nombre]", c.name),
        html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:40px 24px"><h2 style="color:#C9A84C">${newCampaign.subject.replace("[nombre]", c.name)}</h2><div style="color:#333;line-height:1.7">${newCampaign.body.replace("[nombre]", c.name).replace(/\n/g,"<br/>")}</div><p style="color:#999;font-size:12px;margin-top:40px;border-top:1px solid #eee;padding-top:20px">Enviado via CloserAI · <a href="[unsubscribe]" style="color:#999">Darme de baja</a></p></div>`,
      }));
      await resendAPI.sendBatch(config.resend, emails);
      const camp = { id: Date.now(), name: newCampaign.name || newCampaign.subject, subject: newCampaign.subject, sent: emails.length, ts: Date.now(), status: "sent" };
      setCampaigns(p => [camp, ...p]);
      setShowNew(false);
      setNewCampaign({ name: "", subject: "", body: "", segment: "all" });
      showToast(`✓ Campaña enviada a ${emails.length} contactos`);
    } catch (e) { showToast(e.message, "error"); }
    finally { setSending(false); }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Email Engine" sub={`Resend API · ${config.resend.fromEmail || "sin configurar"}`} />

      <div className="flex gap-1 p-1 rounded-lg" style={{ background: "rgba(255,255,255,.03)" }}>
        {[["campaigns","📧 Campañas"],["compose","✍ Redactar"]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} className="flex-1 text-xs py-2 px-3 rounded-md font-medium transition-all"
            style={{ background: tab===id?"rgba(255,255,255,.07)":"transparent", color: tab===id?"#e4e4e7":"#52525b", fontFamily: FM }}>{label}</button>
        ))}
      </div>

      {tab === "campaigns" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-zinc-600" style={{ fontFamily: FM }}>{campaigns.length} campañas enviadas</p>
            <Btn size="sm" onClick={() => { setTab("compose"); setShowNew(true); }}>+ Nueva campaña</Btn>
          </div>
          {campaigns.length === 0 ? (
            <Card className="text-center py-10 space-y-3">
              <p className="text-2xl">📧</p>
              <p className="text-sm text-zinc-500" style={{ fontFamily: FS }}>Todavía no enviaste ninguna campaña.</p>
              <Btn onClick={() => setTab("compose")}>Crear primera campaña →</Btn>
            </Card>
          ) : campaigns.map(c => (
            <Card key={c.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-200" style={{ fontFamily: FS }}>{c.name}</p>
                <p className="text-[10px] text-zinc-600 mt-0.5" style={{ fontFamily: FM }}>
                  {c.sent} enviados · {new Date(c.ts).toLocaleDateString("es-AR", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}
                </p>
              </div>
              <Badge color="emerald">{c.status}</Badge>
            </Card>
          ))}
        </div>
      )}

      {tab === "compose" && (
        <div className="space-y-4 max-w-2xl">
          <Card>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre interno de la campaña" value={newCampaign.name} onChange={v => setNewCampaign(p=>({...p,name:v}))} placeholder="Ej: Nurture Agosto" />
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-zinc-500" style={{ fontFamily: FM }}>Segmento</label>
                  <select value={newCampaign.segment} onChange={e => setNewCampaign(p=>({...p,segment:e.target.value}))}
                    className="w-full rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none"
                    style={{ background:"rgba(255,255,255,.02)", border:`1px solid ${T.border}`, fontFamily: FS }}>
                    <option value="all">Todos los contactos ({contacts.filter(c=>c.email).length})</option>
                    {allTags.map(t => <option key={t} value={t}>{t} ({contacts.filter(c=>c.email&&c.tags.includes(t)).length})</option>)}
                  </select>
                </div>
              </div>
              <Field label="Asunto (usá [nombre] para personalizar)" value={newCampaign.subject} onChange={v => setNewCampaign(p=>({...p,subject:v}))} placeholder="Hola [nombre], vi que tu empresa está..." />
              <Field label="Cuerpo del email (usá [nombre])" value={newCampaign.body} onChange={v => setNewCampaign(p=>({...p,body:v}))} placeholder="Escribí el cuerpo del email aquí..." multiline />

              <div className="rounded-lg border p-3 flex items-center justify-between" style={{ background: T.goldBg, borderColor: T.goldBorder }}>
                <p className="text-xs" style={{ color: T.gold, fontFamily: FM }}>◆ {emailContacts.length} contactos recibirán este email</p>
              </div>

              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Field label="Email de prueba" value={testEmail} onChange={setTestEmail} placeholder="tu@email.com" type="email" />
                </div>
                <Btn variant="secondary" size="md" onClick={handleTest} disabled={sending}>
                  {sending ? "Enviando..." : "Probar"}
                </Btn>
              </div>

              <div className="flex gap-2 pt-2">
                <Btn variant="secondary" onClick={() => setTab("campaigns")} className="flex-1">Cancelar</Btn>
                <Btn onClick={handleLaunch} disabled={sending || !newCampaign.subject || !newCampaign.body} className="flex-1">
                  {sending ? `Enviando a ${emailContacts.length}...` : `🚀 Lanzar campaña → ${emailContacts.length} contactos`}
                </Btn>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── EVOLUTION API — WHATSAPP ───────────────────────────────────────────────────
const evolutionAPI = {
  headers: (cfg) => ({ "apikey": cfg.apiKey, "Content-Type": "application/json" }),
  createInstance: async (cfg, name) => {
    const r = await fetch(`${cfg.baseUrl}/instance/create`, { method:"POST", headers: evolutionAPI.headers(cfg), body: JSON.stringify({ instanceName: name, qrcode: true }) });
    if (!r.ok) throw new Error(`Evolution API error ${r.status}`);
    return r.json();
  },
  getQR: async (cfg, instanceName) => {
    const r = await fetch(`${cfg.baseUrl}/instance/connect/${instanceName}`, { headers: evolutionAPI.headers(cfg) });
    if (!r.ok) throw new Error(`Error ${r.status}`);
    return r.json();
  },
  getStatus: async (cfg, instanceName) => {
    const r = await fetch(`${cfg.baseUrl}/instance/fetchInstances?instanceName=${instanceName}`, { headers: evolutionAPI.headers(cfg) });
    if (!r.ok) throw new Error(`Error ${r.status}`);
    return r.json();
  },
  sendText: async (cfg, instanceName, to, text) => {
    const r = await fetch(`${cfg.baseUrl}/message/sendText/${instanceName}`, {
      method: "POST", headers: evolutionAPI.headers(cfg),
      body: JSON.stringify({ number: to.replace(/\D/g,""), text }),
    });
    if (!r.ok) throw new Error(`Error ${r.status}`);
    return r.json();
  },
  sendBulk: async (cfg, instanceName, contacts, text) => {
    const results = [];
    for (const c of contacts) {
      try {
        const r = await evolutionAPI.sendText(cfg, instanceName, c.phone, text.replace("[nombre]", c.name));
        results.push({ contact: c, ok: true, data: r });
      } catch (e) { results.push({ contact: c, ok: false, error: e.message }); }
      await new Promise(res => setTimeout(res, 1200)); // delay anti-ban
    }
    return results;
  },
};

function WhatsAppModule() {
  const { config, updateConfig, contacts, showToast } = useContext(CommsCtx);
  const [instances, setInstances] = useState(() => store.get("wa_instances", []));
  const [tab, setTab] = useState("instances");
  const [newInstanceName, setNewInstanceName] = useState("");
  const [qrData, setQrData] = useState({});
  const [sending, setSending] = useState(false);
  const [blast, setBlast] = useState({ instance: "", message: "", segment: "whatsapp" });
  const [blastResults, setBlastResults] = useState(null);
  const [loading, setLoading] = useState({});

  useEffect(() => { store.set("wa_instances", instances); }, [instances]);

  const waContacts = contacts.filter(c => c.channel === "whatsapp" || c.phone?.startsWith("+549") || c.phone?.startsWith("+54"));

  const handleCreateInstance = async () => {
    if (!config.evolution.apiKey || !config.evolution.baseUrl) { showToast("Configurá Evolution API en Ajustes", "error"); return; }
    if (!newInstanceName.trim()) return;
    setLoading(p => ({ ...p, create: true }));
    try {
      const data = await evolutionAPI.createInstance(config.evolution, newInstanceName.trim());
      const inst = { id: Date.now(), name: newInstanceName.trim(), status: "disconnected", owner: "" };
      setInstances(p => [...p, inst]);
      setNewInstanceName("");
      showToast(`✓ Instancia "${inst.name}" creada`);
      handleGetQR(inst);
    } catch (e) { showToast(e.message, "error"); }
    finally { setLoading(p => ({ ...p, create: false })); }
  };

  const handleGetQR = async (inst) => {
    setLoading(p => ({ ...p, [inst.name]: true }));
    try {
      const data = await evolutionAPI.getQR(config.evolution, inst.name);
      setQrData(p => ({ ...p, [inst.name]: data.qrcode?.base64 || data.base64 }));
    } catch (e) {
      // Demo QR cuando no hay conexión real
      setQrData(p => ({ ...p, [inst.name]: "DEMO_QR" }));
    }
    finally { setLoading(p => ({ ...p, [inst.name]: false })); }
  };

  const handleRefreshStatus = async (inst) => {
    try {
      const data = await evolutionAPI.getStatus(config.evolution, inst.name);
      const connected = data?.[0]?.connectionStatus === "open";
      setInstances(p => p.map(i => i.name === inst.name ? { ...i, status: connected ? "connected" : "disconnected" } : i));
      if (connected) showToast(`✓ ${inst.name} conectado`);
    } catch { /* sin backend, mantener estado */ }
  };

  const handleBlast = async () => {
    if (!blast.instance) { showToast("Seleccioná una instancia", "error"); return; }
    if (!blast.message.trim()) { showToast("Escribí el mensaje", "error"); return; }
    const targets = waContacts.filter(c => blast.segment === "all" || c.tags.includes(blast.segment));
    if (targets.length === 0) { showToast("No hay contactos en este segmento", "error"); return; }
    setSending(true);
    try {
      const results = await evolutionAPI.sendBulk(config.evolution, blast.instance, targets, blast.message);
      setBlastResults(results);
      const ok = results.filter(r => r.ok).length;
      showToast(`✓ ${ok}/${targets.length} mensajes enviados`);
    } catch (e) { showToast(e.message, "error"); }
    finally { setSending(false); }
  };

  const allTags = [...new Set(contacts.flatMap(c => c.tags))];
  const statusColor = { connected: T.emerald, disconnected: "#52525b", connecting: T.gold };

  return (
    <div className="space-y-6">
      <SectionHeader title="WhatsApp Engine" sub="Evolution API · Multi-instancia · Anti-ban integrado" />

      <div className="flex gap-1 p-1 rounded-lg" style={{ background: "rgba(255,255,255,.03)" }}>
        {[["instances","📱 Instancias"],["blast","📤 Envío masivo"],["contacts","👥 Contactos WA"]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} className="flex-1 text-xs py-2 px-3 rounded-md font-medium transition-all"
            style={{ background: tab===id?"rgba(255,255,255,.07)":"transparent", color: tab===id?"#e4e4e7":"#52525b", fontFamily: FM }}>{label}</button>
        ))}
      </div>

      {tab === "instances" && (
        <div className="space-y-4">
          {/* Create instance */}
          <Card>
            <p className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider" style={{ fontFamily: FM }}>Nueva instancia</p>
            <div className="flex gap-2">
              <div className="flex-1">
                <Field value={newInstanceName} onChange={setNewInstanceName} placeholder="Nombre del setter (ej: ornella-closer)" onKeyDown={e => e.key==="Enter" && handleCreateInstance()} />
              </div>
              <Btn onClick={handleCreateInstance} disabled={loading.create || !newInstanceName.trim()} size="md">
                {loading.create ? "Creando..." : "+ Crear"}
              </Btn>
            </div>
            <p className="text-[10px] text-zinc-600 mt-2" style={{ fontFamily: FM }}>Cada setter/closer vincula su propio número de WhatsApp escaneando el QR</p>
          </Card>

          {/* Instance list */}
          {instances.length === 0 ? (
            <Card className="text-center py-8 space-y-2">
              <p className="text-2xl">📱</p>
              <p className="text-sm text-zinc-500" style={{ fontFamily: FS }}>Crea tu primera instancia para vincular un número de WhatsApp</p>
            </Card>
          ) : instances.map(inst => (
            <Card key={inst.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: statusColor[inst.status] || "#52525b" }} />
                  <div>
                    <p className="text-sm font-semibold text-zinc-200" style={{ fontFamily: FS }}>{inst.name}</p>
                    <p className="text-[10px] text-zinc-600" style={{ fontFamily: FM }}>{inst.status === "connected" ? `Conectado ${inst.owner ? "· "+inst.owner : ""}` : inst.status}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Btn size="sm" variant="secondary" onClick={() => handleRefreshStatus(inst)}>↻ Estado</Btn>
                  {inst.status !== "connected" && (
                    <Btn size="sm" onClick={() => handleGetQR(inst)} disabled={loading[inst.name]}>
                      {loading[inst.name] ? "..." : "Escanear QR"}
                    </Btn>
                  )}
                  <Btn size="sm" variant="danger" onClick={() => setInstances(p => p.filter(i => i.id !== inst.id))}>✕</Btn>
                </div>
              </div>

              {/* QR Code display */}
              {qrData[inst.name] && (
                <div className="mt-4 rounded-xl border p-4 text-center" style={{ borderColor: T.goldBorder, background: T.goldBg }}>
                  {qrData[inst.name] === "DEMO_QR" ? (
                    <div className="space-y-2">
                      <div className="w-48 h-48 mx-auto rounded-lg flex items-center justify-center text-4xl" style={{ background: "#fff" }}>
                        <svg viewBox="0 0 100 100" width="180" height="180">
                          {/* Demo QR pattern */}
                          {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => (
                            (r < 3 && c < 3) || (r < 3 && c > 3) || (r > 3 && c < 3) || Math.random() > 0.5
                              ? <rect key={`${r}-${c}`} x={c*14+1} y={r*14+1} width={12} height={12} fill="#000" rx={1} />
                              : null
                          )))}
                        </svg>
                      </div>
                      <p className="text-xs" style={{ color: T.gold, fontFamily: FM }}>QR Demo — conectá Evolution API para QR real</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <img src={`data:image/png;base64,${qrData[inst.name]}`} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg" />
                      <p className="text-xs" style={{ color: T.gold, fontFamily: FM }}>Escaneá con WhatsApp para vincular</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {tab === "blast" && (
        <div className="space-y-4 max-w-2xl">
          <Card>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-zinc-500" style={{ fontFamily: FM }}>Instancia a usar</label>
                  <select value={blast.instance} onChange={e => setBlast(p=>({...p,instance:e.target.value}))} className="w-full rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none" style={{ background:"rgba(255,255,255,.02)", border:`1px solid ${T.border}`, fontFamily: FS }}>
                    <option value="">— Seleccioná instancia —</option>
                    {instances.map(i => <option key={i.id} value={i.name}>{i.name} ({i.status})</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-zinc-500" style={{ fontFamily: FM }}>Segmento</label>
                  <select value={blast.segment} onChange={e => setBlast(p=>({...p,segment:e.target.value}))} className="w-full rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none" style={{ background:"rgba(255,255,255,.02)", border:`1px solid ${T.border}`, fontFamily: FS }}>
                    <option value="all">Todos los contactos WA ({waContacts.length})</option>
                    {allTags.map(t => <option key={t} value={t}>{t} ({contacts.filter(c=>c.tags.includes(t)).length})</option>)}
                  </select>
                </div>
              </div>
              <Field label="Mensaje (usá [nombre] para personalizar)" value={blast.message} onChange={v => setBlast(p=>({...p,message:v}))} placeholder="Hola [nombre], vi que..." multiline />

              <div className="rounded-lg border p-3" style={{ background: "rgba(201,168,76,.05)", borderColor: T.goldBorder }}>
                <p className="text-[10px]" style={{ color: T.gold, fontFamily: FM }}>
                  ◆ Anti-ban activo: delay de 1.2s entre mensajes · {waContacts.filter(c => blast.segment==="all" || c.tags.includes(blast.segment)).length} contactos
                </p>
              </div>

              <Btn onClick={handleBlast} disabled={sending || !blast.instance || !blast.message.trim()} className="w-full">
                {sending ? "Enviando (anti-ban delay activo)..." : "📤 Enviar a todos los contactos"}
              </Btn>
            </div>
          </Card>

          {blastResults && (
            <Card>
              <p className="text-xs font-semibold text-zinc-400 mb-3" style={{ fontFamily: FM }}>Resultados del envío</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg p-3 text-center" style={{ background: T.emeraldBg, border: `1px solid ${T.emeraldBorder}` }}>
                  <p className="text-2xl font-black" style={{ color: T.emerald, fontFamily: FP }}>{blastResults.filter(r=>r.ok).length}</p>
                  <p className="text-[10px] text-zinc-500" style={{ fontFamily: FM }}>Enviados</p>
                </div>
                <div className="rounded-lg p-3 text-center" style={{ background: T.redBg, border: `1px solid ${T.redBorder}` }}>
                  <p className="text-2xl font-black" style={{ color: T.red, fontFamily: FP }}>{blastResults.filter(r=>!r.ok).length}</p>
                  <p className="text-[10px] text-zinc-500" style={{ fontFamily: FM }}>Fallidos</p>
                </div>
              </div>
              {blastResults.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1.5 border-t" style={{ borderColor: T.border }}>
                  <span className="text-zinc-400" style={{ fontFamily: FS }}>{r.contact.name}</span>
                  <span style={{ color: r.ok ? T.emerald : T.red, fontFamily: FM }}>{r.ok ? "✓ enviado" : `△ ${r.error}`}</span>
                </div>
              ))}
            </Card>
          )}
        </div>
      )}

      {tab === "contacts" && (
        <div className="space-y-3">
          {waContacts.map(c => (
            <Card key={c.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: T.goldBg, color: T.gold }}>
                  {c.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-200" style={{ fontFamily: FS }}>{c.name}</p>
                  <p className="text-[10px] text-zinc-600" style={{ fontFamily: FM }}>{c.phone}</p>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {c.tags.map(t => <Badge key={t} color="zinc">{t}</Badge>)}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TWILIO — SMS & VOICE DIALER ────────────────────────────────────────────────
const twilioAPI = {
  // Twilio REST via proxy — en prod usá un backend o n8n
  sendSMS: async (cfg, to, body) => {
    const auth = btoa(`${cfg.accountSid}:${cfg.authToken}`);
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${cfg.accountSid}/Messages.json`, {
      method: "POST",
      headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ To: to, From: cfg.fromNumber, Body: body }),
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.message || `Error ${res.status}`); }
    return res.json();
  },
  getAccessToken: async (tokenUrl) => {
    // tokenUrl = tu endpoint n8n que genera el Twilio Access Token
    const res = await fetch(tokenUrl);
    if (!res.ok) throw new Error("No se pudo obtener el token de voz");
    return res.json(); // { token: "..." }
  },
};

function SMSDialerModule() {
  const { config, contacts, callLogs, addCallLog, showToast } = useContext(CommsCtx);
  const [tab, setTab] = useState("dialer");
  const [dialerState, setDialerState] = useState("idle"); // idle | connecting | incall | ended
  const [callDuration, setCallDuration] = useState(0);
  const [manualNumber, setManualNumber] = useState("");
  const [smsText, setSmsText] = useState("");
  const [smsTo, setSmsTo] = useState("");
  const [sending, setSending] = useState(false);
  const [device, setDevice] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const timerRef = useRef(null);
  const usContacts = contacts.filter(c => c.phone?.startsWith("+1"));

  // Twilio Browser SDK init
  const initDevice = async () => {
    if (!config.twilio.tokenUrl) { showToast("Configurá el Token URL en Ajustes (n8n endpoint)", "error"); return; }
    try {
      const { token } = await twilioAPI.getAccessToken(config.twilio.tokenUrl);
      // In production: import { Device } from "@twilio/voice-sdk" and use it
      // For the UI demo we simulate the device
      setDevice({ token, ready: true });
      showToast("✓ Dialer conectado y listo");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const handleCall = async (number) => {
    const target = number || manualNumber;
    if (!target) { showToast("Ingresá o seleccioná un número", "error"); return; }
    if (!device?.ready && !config.twilio.tokenUrl) {
      showToast("Iniciá el dialer primero", "error"); return;
    }
    setDialerState("connecting");
    setTimeout(() => {
      setDialerState("incall");
      setCallDuration(0);
      timerRef.current = setInterval(() => setCallDuration(d => d+1), 1000);
      setActiveCall({ number: target, name: contacts.find(c=>c.phone===target)?.name || target });
    }, 1500);
  };

  const handleHangup = () => {
    clearInterval(timerRef.current);
    const dur = callDuration;
    addCallLog({ number: activeCall?.number, name: activeCall?.name, duration: dur, status: "completed" });
    setDialerState("ended");
    setCallDuration(0);
    setTimeout(() => { setDialerState("idle"); setActiveCall(null); }, 2000);
  };

  const handleSendSMS = async () => {
    if (!config.twilio.accountSid || !config.twilio.authToken) { showToast("Configurá Twilio en Ajustes", "error"); return; }
    if (!smsTo || !smsText) { showToast("Completá número y mensaje", "error"); return; }
    setSending(true);
    try {
      await twilioAPI.sendSMS(config.twilio, smsTo, smsText);
      showToast(`✓ SMS enviado a ${smsTo}`);
      setSmsText(""); setSmsTo("");
    } catch (e) { showToast(e.message, "error"); }
    finally { setSending(false); }
  };

  const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const dialerColor = { idle: "#52525b", connecting: T.gold, incall: T.emerald, ended: "#52525b" }[dialerState];

  return (
    <div className="space-y-6">
      <SectionHeader title="SMS & Voice Dialer" sub="Twilio · USA & Canadá · Browser calls" />

      <div className="flex gap-1 p-1 rounded-lg" style={{ background: "rgba(255,255,255,.03)" }}>
        {[["dialer","📞 Dialer"],["sms","💬 SMS"],["logs","📋 Historial"]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} className="flex-1 text-xs py-2 px-3 rounded-md font-medium transition-all"
            style={{ background: tab===id?"rgba(255,255,255,.07)":"transparent", color: tab===id?"#e4e4e7":"#52525b", fontFamily: FM }}>{label}</button>
        ))}
      </div>

      {tab === "dialer" && (
        <div className="max-w-sm mx-auto space-y-4">
          {/* Dialer device status */}
          <Card gold={dialerState === "incall"} className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: `${dialerColor}20`, border: `2px solid ${dialerColor}` }}>
              <span className="text-2xl">{dialerState === "incall" ? "📞" : dialerState === "connecting" ? "⏳" : dialerState === "ended" ? "✓" : "📵"}</span>
            </div>
            {dialerState === "idle" && (
              <>
                <p className="text-sm text-zinc-400" style={{ fontFamily: FS }}>Dialer {device?.ready ? "listo" : "no iniciado"}</p>
                <Btn onClick={initDevice} disabled={!!device?.ready}>{device?.ready ? "✓ Conectado" : "Iniciar Dialer"}</Btn>
              </>
            )}
            {dialerState === "connecting" && <p className="text-sm" style={{ color: T.gold, fontFamily: FS }}>Conectando con {activeCall?.number}...</p>}
            {dialerState === "incall" && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white" style={{ fontFamily: FS }}>{activeCall?.name || activeCall?.number}</p>
                <p className="text-3xl font-black" style={{ color: T.emerald, fontFamily: FP }}>{fmt(callDuration)}</p>
                <Btn variant="danger" onClick={handleHangup}>Colgar</Btn>
              </div>
            )}
            {dialerState === "ended" && <p className="text-sm" style={{ color: T.emerald, fontFamily: FS }}>✓ Llamada finalizada · {fmt(callDuration)}</p>}
          </Card>

          {/* Manual dial */}
          {(dialerState === "idle" || dialerState === "ended") && (
            <Card className="space-y-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" style={{ fontFamily: FM }}>Marcar número</p>
              <Field value={manualNumber} onChange={setManualNumber} placeholder="+14155550100" type="tel" />

              {/* Numeric pad */}
              <div className="grid grid-cols-3 gap-2">
                {"123456789*0#".split("").map(d => (
                  <button key={d} onClick={() => setManualNumber(p => p+d)}
                    className="py-3 rounded-xl text-lg font-bold transition-all hover:opacity-80"
                    style={{ background: "rgba(255,255,255,.04)", color: "#e4e4e7", fontFamily: FP, border: `1px solid ${T.border}` }}>
                    {d}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Btn variant="secondary" onClick={() => setManualNumber(p => p.slice(0,-1))}>⌫ Borrar</Btn>
                <Btn onClick={() => handleCall(manualNumber)} disabled={!manualNumber}>📞 Llamar</Btn>
              </div>
            </Card>
          )}

          {/* Quick dial from contacts */}
          {(dialerState === "idle" || dialerState === "ended") && usContacts.length > 0 && (
            <Card className="space-y-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" style={{ fontFamily: FM }}>Contactos USA/Canada</p>
              {usContacts.map(c => (
                <div key={c.id} className="flex items-center justify-between gap-3 py-1.5 border-t" style={{ borderColor: T.border }}>
                  <div>
                    <p className="text-sm font-medium text-zinc-200" style={{ fontFamily: FS }}>{c.name}</p>
                    <p className="text-[10px] text-zinc-600" style={{ fontFamily: FM }}>{c.phone}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Btn size="xs" variant="secondary" onClick={() => { setSmsTo(c.phone); setTab("sms"); }}>SMS</Btn>
                    <Btn size="xs" onClick={() => handleCall(c.phone)}>📞</Btn>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      )}

      {tab === "sms" && (
        <div className="space-y-4 max-w-2xl">
          <Card className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-zinc-500" style={{ fontFamily: FM }}>Destinatario</label>
                <select value={smsTo} onChange={e => setSmsTo(e.target.value)} className="w-full rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none" style={{ background:"rgba(255,255,255,.02)", border:`1px solid ${T.border}`, fontFamily: FS }}>
                  <option value="">— Seleccioná o escribí abajo —</option>
                  {usContacts.map(c => <option key={c.id} value={c.phone}>{c.name} · {c.phone}</option>)}
                </select>
              </div>
              <Field label="O ingresá número directo" value={smsTo} onChange={setSmsTo} placeholder="+14155550100" type="tel" />
            </div>
            <Field label="Mensaje SMS (max 160 caracteres)" value={smsText} onChange={v => setSmsText(v.slice(0,160))} placeholder="Hola [nombre], soy..." multiline />
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-zinc-600" style={{ fontFamily: FM }}>{smsText.length}/160 caracteres</p>
              <Btn onClick={handleSendSMS} disabled={sending || !smsTo || !smsText}>
                {sending ? "Enviando..." : "📱 Enviar SMS"}
              </Btn>
            </div>
          </Card>

          {/* SMS bulk */}
          <Card className="space-y-3">
            <p className="text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider" style={{ fontFamily: FM }}>Envío masivo — USA/Canada</p>
            <p className="text-xs text-zinc-600" style={{ fontFamily: FS }}>{usContacts.length} contactos con número +1 en el sistema</p>
            <div className="rounded-lg border p-3" style={{ background: T.goldBg, borderColor: T.goldBorder }}>
              <p className="text-[10px]" style={{ color: T.gold, fontFamily: FM }}>Para envío masivo de SMS usa las Secuencias → conectás el segmento USA y el motor envía automáticamente con n8n</p>
            </div>
          </Card>
        </div>
      )}

      {tab === "logs" && (
        <div className="space-y-3">
          {callLogs.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-sm text-zinc-500" style={{ fontFamily: FS }}>Sin llamadas registradas todavía</p>
            </Card>
          ) : callLogs.map(log => (
            <Card key={log.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <div>
                  <p className="text-sm font-semibold text-zinc-200" style={{ fontFamily: FS }}>{log.name || log.number}</p>
                  <p className="text-[10px] text-zinc-600" style={{ fontFamily: FM }}>
                    {fmt(log.duration || 0)} · {new Date(log.ts).toLocaleString("es-AR", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}
                  </p>
                </div>
              </div>
              <Badge color={log.status === "completed" ? "emerald" : "zinc"}>{log.status}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SEQUENCES — MOTOR DE AUTOMATIZACIÓN ───────────────────────────────────────
function SequencesModule() {
  const { sequences, setSequences, contacts, showToast } = useContext(CommsCtx);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("list");

  const seqContacts = (seq) => contacts.filter(c => seq.steps[0]?.action === "send_sms" ? c.phone?.startsWith("+1") : seq.steps[0]?.action === "send_message" ? !c.phone?.startsWith("+1") : c.email);
  const channelColor = { whatsapp: "emerald", sms: "blue", email: "gold" };
  const channelIcon = { whatsapp: "💬", sms: "📱", email: "📧" };

  return (
    <div className="space-y-6">
      <SectionHeader title="Secuencias" sub="Motor de automatización · Conectado a n8n para scheduling" />

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Secuencias activas" value={sequences.filter(s=>s.active).length} color={T.gold} />
        <Stat label="Total enrollados" value={sequences.reduce((a,s)=>a+s.enrolled,0)} />
        <Stat label="Conversiones" value={sequences.reduce((a,s)=>a+s.converted,0)} color={T.emerald} />
      </div>

      <div className="flex gap-1 p-1 rounded-lg" style={{ background: "rgba(255,255,255,.03)" }}>
        {[["list","📋 Secuencias"],["builder","🔧 Constructor"]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} className="flex-1 text-xs py-2 px-3 rounded-md font-medium transition-all"
            style={{ background: tab===id?"rgba(255,255,255,.07)":"transparent", color: tab===id?"#e4e4e7":"#52525b", fontFamily: FM }}>{label}</button>
        ))}
      </div>

      {tab === "list" && (
        <div className="space-y-3">
          {sequences.map(seq => (
            <Card key={seq.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{channelIcon[seq.channel]}</span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-200" style={{ fontFamily: FS }}>{seq.name}</p>
                    <p className="text-[10px] text-zinc-600" style={{ fontFamily: FM }}>{seq.steps.length} pasos · {seqContacts(seq).length} contactos elegibles</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge color={seq.active ? "emerald" : "zinc"}>{seq.active ? "Activa" : "Pausada"}</Badge>
                  <Badge color={channelColor[seq.channel]}>{seq.channel}</Badge>
                  <button onClick={() => setSequences(p => p.map(s => s.id===seq.id ? {...s,active:!s.active} : s))}
                    className="text-[10px] px-2.5 py-1 rounded-lg border transition-all"
                    style={{ background: seq.active ? T.redBg : T.emeraldBg, borderColor: seq.active ? T.redBorder : T.emeraldBorder, color: seq.active ? T.red : T.emerald, fontFamily: FM }}>
                    {seq.active ? "Pausar" : "Activar"}
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {seq.steps.map((step, i) => (
                  <div key={i} className="flex-shrink-0 flex items-center gap-1.5">
                    <div className="rounded-lg border px-3 py-2 text-center min-w-24" style={{ background: "rgba(255,255,255,.02)", borderColor: T.border }}>
                      <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: T.gold, fontFamily: FM }}>D+{step.day}</p>
                      <p className="text-[10px] text-zinc-400" style={{ fontFamily: FS }}>{step.label}</p>
                    </div>
                    {i < seq.steps.length-1 && <span className="text-zinc-700" style={{ fontFamily: FM }}>→</span>}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-1 border-t" style={{ borderColor: T.border }}>
                <div className="flex gap-4 text-[10px]" style={{ fontFamily: FM }}>
                  <span className="text-zinc-500">Enrolled: <span className="font-bold" style={{ color: "#e4e4e7" }}>{seq.enrolled}</span></span>
                  <span className="text-zinc-500">Convertidos: <span className="font-bold" style={{ color: T.emerald }}>{seq.converted}</span></span>
                  <span className="text-zinc-500">CR: <span className="font-bold" style={{ color: T.gold }}>{seq.enrolled > 0 ? ((seq.converted/seq.enrolled)*100).toFixed(0) : 0}%</span></span>
                </div>
                <Btn size="xs" variant="secondary" className="ml-auto" onClick={() => showToast("Abre el builder para editar la secuencia")}>Editar</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "builder" && (
        <Card className="space-y-4">
          <p className="text-xs text-zinc-500" style={{ fontFamily: FS }}>
            El constructor de secuencias se conecta con n8n para el scheduling automático.
            Configurá el webhook de n8n en Ajustes para activar el envío programado.
          </p>
          <div className="rounded-xl border p-4 space-y-3" style={{ background: T.goldBg, borderColor: T.goldBorder }}>
            <p className="text-xs font-semibold" style={{ color: T.gold, fontFamily: FM }}>🔗 Arquitectura de secuencias</p>
            <div className="space-y-2">
              {[
                ["CloserAI", "Crea la secuencia y enrolla al lead"],
                ["n8n Webhook", "Recibe el evento de enrollment"],
                ["n8n Workflow", "Ejecuta los pasos en los días programados"],
                ["APIs", "Evolution/Twilio/Resend ejecutan el envío"],
                ["CloserAI", "Recibe el update de estado via webhook"],
              ].map(([step, desc], i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[9px] font-bold w-24 text-right flex-shrink-0" style={{ color: T.gold, fontFamily: FM }}>{step}</span>
                  <span className="text-zinc-700" style={{ fontFamily: FM }}>→</span>
                  <span className="text-[10px] text-zinc-500" style={{ fontFamily: FS }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── CONTACTS MODULE ────────────────────────────────────────────────────────────
function ContactsModule() {
  const { contacts, setContacts, showToast } = useContext(CommsCtx);
  const [search, setSearch] = useState("");
  const [filterChannel, setFilterChannel] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name:"", phone:"", email:"", tags:"", channel:"whatsapp" });

  const filtered = contacts.filter(c => {
    const ms = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search) || c.email?.includes(search);
    return ms && (filterChannel === "all" || c.channel === filterChannel);
  });

  const handleAdd = () => {
    if (!newContact.name || (!newContact.phone && !newContact.email)) { showToast("Nombre y teléfono o email requeridos", "error"); return; }
    const c = { ...newContact, id: Date.now(), tags: newContact.tags.split(",").map(t=>t.trim()).filter(Boolean), status: "new" };
    setContacts(p => [c, ...p]);
    setNewContact({ name:"", phone:"", email:"", tags:"", channel:"whatsapp" });
    setShowAdd(false);
    showToast(`✓ ${c.name} agregado`);
  };

  const channelIcon = { whatsapp:"💬", sms:"📱", email:"📧" };
  const statusColor = { new: "#52525b", contacted: T.blue, replied: T.emerald, call_scheduled: T.gold };

  return (
    <div className="space-y-5">
      <SectionHeader title="Contactos" sub={`${contacts.length} contactos · base unificada multicanal`} />

      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-36 relative">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar nombre, teléfono, email..."
            className="w-full rounded-lg px-3.5 py-2 text-sm text-zinc-300 placeholder-zinc-700 outline-none"
            style={{ background: "rgba(255,255,255,.02)", border:`1px solid ${T.border}`, fontFamily: FS }} />
        </div>
        <select value={filterChannel} onChange={e=>setFilterChannel(e.target.value)} className="rounded-lg px-3 py-2 text-xs text-zinc-400 outline-none" style={{ background:"rgba(255,255,255,.02)", border:`1px solid ${T.border}`, fontFamily: FM }}>
          <option value="all">Todos ({contacts.length})</option>
          <option value="whatsapp">WhatsApp ({contacts.filter(c=>c.channel==="whatsapp").length})</option>
          <option value="sms">SMS/USA ({contacts.filter(c=>c.channel==="sms").length})</option>
          <option value="email">Email ({contacts.filter(c=>c.channel==="email").length})</option>
        </select>
        <Btn size="sm" onClick={() => setShowAdd(!showAdd)}>+ Contacto</Btn>
      </div>

      {showAdd && (
        <Card className="space-y-3" gold>
          <p className="text-xs font-semibold" style={{ color: T.gold, fontFamily: FM }}>Nuevo contacto</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre *" value={newContact.name} onChange={v=>setNewContact(p=>({...p,name:v}))} placeholder="Nombre completo" />
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[.12em] text-zinc-500" style={{fontFamily:FM}}>Canal principal</label>
              <select value={newContact.channel} onChange={e=>setNewContact(p=>({...p,channel:e.target.value}))} className="w-full rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none" style={{background:"rgba(255,255,255,.02)",border:`1px solid ${T.border}`,fontFamily:FS}}>
                <option value="whatsapp">WhatsApp (LATAM)</option>
                <option value="sms">SMS (USA/Canada)</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Teléfono" value={newContact.phone} onChange={v=>setNewContact(p=>({...p,phone:v}))} placeholder="+54911..." type="tel" />
            <Field label="Email" value={newContact.email} onChange={v=>setNewContact(p=>({...p,email:v}))} placeholder="email@empresa.com" type="email" />
          </div>
          <Field label="Tags (separados por coma)" value={newContact.tags} onChange={v=>setNewContact(p=>({...p,tags:v}))} placeholder="B2B, LATAM, Agencia" />
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={()=>setShowAdd(false)} className="flex-1">Cancelar</Btn>
            <Btn onClick={handleAdd} className="flex-1">Agregar contacto</Btn>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {filtered.map(c => (
          <div key={c.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:border-zinc-700"
            style={{ background: T.surface, borderColor: T.border }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: T.goldBg, color: T.gold, fontFamily: FP }}>{c.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-zinc-200 truncate" style={{ fontFamily: FS }}>{c.name}</p>
                <span className="text-sm">{channelIcon[c.channel]}</span>
              </div>
              <p className="text-[10px] text-zinc-600 truncate" style={{ fontFamily: FM }}>{c.phone}{c.phone && c.email ? " · " : ""}{c.email}</p>
            </div>
            <div className="flex gap-1.5 flex-wrap justify-end">
              {c.tags?.map(t => <Badge key={t} color="zinc">{t}</Badge>)}
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: statusColor[c.status] || "#52525b" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SETTINGS MODULE ────────────────────────────────────────────────────────────
function SettingsModule() {
  const { config, updateConfig, showToast } = useContext(CommsCtx);
  const [testing, setTesting] = useState({});

  const testResend = async () => {
    setTesting(p=>({...p,resend:true}));
    try {
      await resendAPI.send(config.resend, { to: config.resend.fromEmail, subject: "Test CloserAI Comms", html: "<p>Resend API configurado correctamente ✓</p>" });
      showToast("✓ Resend conectado correctamente");
    } catch(e) { showToast(e.message,"error"); }
    finally { setTesting(p=>({...p,resend:false})); }
  };

  const testEvolution = async () => {
    setTesting(p=>({...p,evolution:true}));
    try {
      const r = await fetch(`${config.evolution.baseUrl}/instance/fetchInstances`, { headers: { apikey: config.evolution.apiKey } });
      if (r.ok) showToast("✓ Evolution API conectada correctamente");
      else throw new Error(`Error ${r.status}`);
    } catch(e) { showToast(e.message,"error"); }
    finally { setTesting(p=>({...p,evolution:false})); }
  };

  const Section = ({ title, icon, children }) => (
    <Card className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: T.border }}>
        <span className="text-lg">{icon}</span>
        <p className="text-sm font-bold text-zinc-200" style={{ fontFamily: FP }}>{title}</p>
      </div>
      {children}
    </Card>
  );

  return (
    <div className="space-y-5 max-w-2xl">
      <SectionHeader title="Configuración" sub="APIs por workspace · todas las keys se guardan localmente" />

      <Section title="Resend — Email" icon="📧">
        <Field label="API Key" value={config.resend.apiKey} onChange={v=>updateConfig("resend",{apiKey:v})} placeholder="re_..." password hint="resend.com/api-keys" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="From Email" value={config.resend.fromEmail} onChange={v=>updateConfig("resend",{fromEmail:v})} placeholder="hola@tudominio.com" />
          <Field label="From Name" value={config.resend.fromName} onChange={v=>updateConfig("resend",{fromName:v})} placeholder="Tu Nombre" />
        </div>
        <Btn size="sm" variant="secondary" onClick={testResend} disabled={testing.resend || !config.resend.apiKey}>
          {testing.resend ? "Probando..." : "Probar conexión"}
        </Btn>
      </Section>

      <Section title="Evolution API — WhatsApp" icon="💬">
        <Field label="Base URL" value={config.evolution.baseUrl} onChange={v=>updateConfig("evolution",{baseUrl:v})} placeholder="https://tu-evolution.com" hint="URL de tu instancia de Evolution API" />
        <Field label="API Key" value={config.evolution.apiKey} onChange={v=>updateConfig("evolution",{apiKey:v})} placeholder="evolution-api-key" password />
        <Btn size="sm" variant="secondary" onClick={testEvolution} disabled={testing.evolution || !config.evolution.apiKey}>
          {testing.evolution ? "Probando..." : "Probar conexión"}
        </Btn>
      </Section>

      <Section title="Twilio — SMS & Voice" icon="📞">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Account SID" value={config.twilio.accountSid} onChange={v=>updateConfig("twilio",{accountSid:v})} placeholder="AC..." password />
          <Field label="Auth Token" value={config.twilio.authToken} onChange={v=>updateConfig("twilio",{authToken:v})} placeholder="tu auth token" password />
        </div>
        <Field label="Número Twilio (desde)" value={config.twilio.fromNumber} onChange={v=>updateConfig("twilio",{fromNumber:v})} placeholder="+14155550100" type="tel" />
        <Field label="Token URL (n8n endpoint para Voice)" value={config.twilio.tokenUrl} onChange={v=>updateConfig("twilio",{tokenUrl:v})} placeholder="https://tu-n8n.com/webhook/twilio-token" hint="Endpoint n8n que genera Twilio Access Tokens para llamadas browser" />
        <div className="rounded-lg border p-3 text-xs" style={{ background: T.goldBg, borderColor: T.goldBorder, color: T.gold, fontFamily: FM }}>
          ◆ El Token URL debe responder con JSON: {"{ token: 'eyJ...' }"}. Creá un webhook en n8n que llame a Twilio para generar el Access Token con el Twilio SDK.
        </div>
      </Section>

      <Section title="n8n — Automatización" icon="🔄">
        <Field label="Webhook URL de n8n (para secuencias)" value={config.n8nWebhook || ""} onChange={v=>updateConfig("n8n",{webhook:v})} placeholder="https://tu-n8n.com/webhook/closer-sequences" hint="CloserAI envía los enrollments de secuencias a este webhook" />
        <div className="rounded-lg border p-3 space-y-1.5" style={{ background: T.surface, borderColor: T.border }}>
          <p className="text-[9px] uppercase tracking-wider text-zinc-600" style={{ fontFamily: FM }}>Workflows n8n necesarios</p>
          {["Sequence Scheduler — ejecuta pasos en D+N","WA Webhook Receiver — actualiza inbox de CloserAI","Twilio Token Generator — genera Access Tokens de voz","Email Bounce Handler — actualiza status de contactos"].map((w,i) => (
            <p key={i} className="text-[10px] text-zinc-500" style={{ fontFamily: FS }}>· {w}</p>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── APP SHELL ─────────────────────────────────────────────────────────────────
const COMMS_NAV = [
  { id:"email", label:"Email", icon:"📧" },
  { id:"whatsapp", label:"WhatsApp", icon:"💬" },
  { id:"sms", label:"SMS & Dialer", icon:"📞" },
  { id:"sequences", label:"Secuencias", icon:"🔄" },
  { id:"contacts", label:"Contactos", icon:"👥" },
  { id:"settings", label:"Ajustes", icon:"⚙" },
];

export default function CommsApp() {
  const [tab, setTab] = useState("email");

  return (
    <CommsProvider>
      <div className="min-h-screen flex" style={{ background: T.bg, fontFamily: FS, color:"#e4e4e7" }}>

        {/* Sidebar */}
        <aside className="w-52 flex flex-col flex-shrink-0" style={{ background:"linear-gradient(180deg,#0A0F1E,#070A15)", borderRight:`1px solid ${T.border}` }}>
          <div className="px-5 py-5 border-b" style={{ borderColor: T.border }}>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-white tracking-widest uppercase" style={{ fontFamily: FP }}>Closer</span>
              <span className="text-base font-black" style={{ color: T.gold, fontFamily: FP }}>Comms</span>
            </div>
            <p className="text-[9px] tracking-[.2em] uppercase mt-0.5" style={{ color:"rgba(201,168,76,.4)", fontFamily: FM }}>Motor Multicanal</p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {COMMS_NAV.map(({ id, label, icon }) => {
              const isActive = tab === id;
              return (
                <button key={id} onClick={() => setTab(id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all"
                  style={{ background: isActive ? T.goldBg : "transparent", border:`1px solid ${isActive ? T.goldBorder : "transparent"}`, color: isActive ? T.gold : "rgba(113,113,122,.8)", fontFamily: FS, fontWeight: isActive ? 600 : 400 }}>
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="px-3 py-4 border-t" style={{ borderColor: T.border }}>
            <div className="rounded-lg px-3 py-2" style={{ background: T.goldBg, border:`1px solid ${T.goldBorder}` }}>
              <p className="text-[9px] tracking-wider" style={{ color: T.gold, fontFamily: FM }}>◆ Integrado con CloserAI</p>
              <p className="text-[8px] text-zinc-600 mt-0.5" style={{ fontFamily: FM }}>Leads y contactos sincronizados</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-7">
            {tab === "email"     && <EmailModule />}
            {tab === "whatsapp"  && <WhatsAppModule />}
            {tab === "sms"       && <SMSDialerModule />}
            {tab === "sequences" && <SequencesModule />}
            {tab === "contacts"  && <ContactsModule />}
            {tab === "settings"  && <SettingsModule />}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .animate-slideUp { animation: slideUp .25s ease-out; }
        .stat-card { transition: border-color .2s; }
        .stat-card:hover { border-color: rgba(201,168,76,.2) !important; }
        select option { background: #0D1424; }
        ::-webkit-scrollbar { width:3px; } ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08); border-radius:10px; }
      `}</style>
    </CommsProvider>
  );
}
