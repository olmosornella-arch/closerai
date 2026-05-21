// CloserAI · CRMApp v3 · Silent Luxury Edition
// Rediseño completo — tipografía, espaciado, jerarquía, glassmorphism refinado
import { useState, useEffect, useRef } from "react";

// ── GOOGLE FONTS ──────────────────────────────────────────────────────────────
const _fonts = document.createElement("link");
_fonts.rel = "stylesheet";
_fonts.href =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap";
document.head.appendChild(_fonts);

// ── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const _style = document.createElement("style");
_style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:         #07090F;
    --bg2:        #0C1018;
    --bg3:        #111827;
    --surface:    rgba(255,255,255,0.035);
    --surface-h:  rgba(255,255,255,0.065);
    --border:     rgba(255,255,255,0.07);
    --border-h:   rgba(201,168,76,0.3);
    --gold:       #C9A84C;
    --gold-m:     rgba(201,168,76,0.12);
    --gold-b:     rgba(201,168,76,0.22);
    --emerald:    #10b981;
    --em-m:       rgba(16,185,129,0.12);
    --red:        #f87171;
    --red-m:      rgba(248,113,113,0.1);
    --txt:        #EAE6DF;
    --txt2:       #8A8A8A;
    --txt3:       #555;
    --sidebar-w:  220px;
    --radius:     12px;
    --radius-sm:  8px;
    --transition: 0.18s ease;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--txt);
    background: var(--bg);
  }
  .display { font-family: 'Cormorant Garant', serif; }
  .mono    { font-family: 'DM Mono', monospace; }

  html, body, #root { height: 100%; overflow: hidden; }

  /* Scrollbar */
  ::-webkit-scrollbar       { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-h); border-radius: 99px; }

  /* Glassmorphism card */
  .glass {
    background: var(--surface);
    border: 0.5px solid var(--border);
    border-radius: var(--radius);
    backdrop-filter: blur(12px);
    transition: border-color var(--transition), background var(--transition);
  }
  .glass:hover { border-color: rgba(255,255,255,0.12); }
  .glass-gold  { border-color: var(--gold-b) !important; }

  /* Pill badge */
  .pill {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 10px; border-radius: 99px;
    font-size: 11px; font-weight: 500; letter-spacing: 0.02em;
  }
  .pill-gold    { background: var(--gold-m); color: var(--gold); border: 0.5px solid var(--gold-b); }
  .pill-green   { background: var(--em-m);   color: var(--emerald); border: 0.5px solid rgba(16,185,129,0.25); }
  .pill-red     { background: var(--red-m);  color: var(--red); border: 0.5px solid rgba(248,113,113,0.2); }
  .pill-muted   { background: var(--surface); color: var(--txt2); border: 0.5px solid var(--border); }

  /* Button */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 8px 18px; border-radius: var(--radius-sm); border: none;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all var(--transition); white-space: nowrap;
  }
  .btn-primary {
    background: var(--gold); color: #0a0800;
    box-shadow: 0 0 20px rgba(201,168,76,0.2);
  }
  .btn-primary:hover { background: #d4b45c; box-shadow: 0 0 28px rgba(201,168,76,0.3); }
  .btn-ghost {
    background: var(--surface); color: var(--txt2);
    border: 0.5px solid var(--border);
  }
  .btn-ghost:hover { background: var(--surface-h); color: var(--txt); border-color: rgba(255,255,255,0.12); }
  .btn-danger { background: var(--red-m); color: var(--red); border: 0.5px solid rgba(248,113,113,0.2); }
  .btn-danger:hover { background: rgba(248,113,113,0.18); }

  /* Input */
  .inp {
    width: 100%; padding: 9px 14px; border-radius: var(--radius-sm);
    background: var(--bg2); border: 0.5px solid var(--border);
    color: var(--txt); font-family: 'DM Sans', sans-serif; font-size: 13px;
    outline: none; transition: border-color var(--transition);
  }
  .inp:focus { border-color: var(--gold-b); }
  .inp::placeholder { color: var(--txt3); }

  /* Sidebar nav item */
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 14px; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 400; color: var(--txt2);
    cursor: pointer; transition: all var(--transition);
    border: 0.5px solid transparent;
    user-select: none;
  }
  .nav-item:hover { background: var(--surface); color: var(--txt); }
  .nav-item.active {
    background: var(--gold-m); color: var(--gold);
    border-color: var(--gold-b);
    font-weight: 500;
  }
  .nav-item .nav-icon { width: 16px; text-align: center; font-size: 15px; opacity: 0.7; }
  .nav-item.active .nav-icon { opacity: 1; }

  /* Score bar */
  .score-bar { height: 3px; border-radius: 99px; background: var(--border); overflow: hidden; }
  .score-fill { height: 100%; border-radius: 99px; transition: width 0.5s ease; }

  /* Animate in */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.3s ease forwards; }

  /* Gold line on stat card */
  .stat-card::after {
    content: ''; display: block;
    height: 1px; background: linear-gradient(90deg, var(--gold-b), transparent);
    margin-top: 16px;
  }

  /* Kanban column */
  .kan-col { min-height: 200px; }

  /* Lead card hover */
  .lead-card { cursor: pointer; }
  .lead-card:hover { border-color: var(--gold-b) !important; transform: translateY(-1px); }

  /* Tag */
  .tag {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 1px 8px; border-radius: 4px; font-size: 10px;
    font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
  }

  /* Divider */
  .divider { height: 0.5px; background: var(--border); margin: 16px 0; }

  /* Onboarding card */
  .onboard-wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg);
    background-image: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%);
  }
`;
document.head.appendChild(_style);

// ── TYPES ─────────────────────────────────────────────────────────────────────
interface Lead {
  id: string;
  name: string;
  role: string;
  company?: string;
  score: number;
  temp: "Warm" | "Frío" | "Hot";
  stage: string;
  lastAction?: string;
  nextAction?: string;
  notes?: string;
  createdAt: string;
}

interface UserProfile {
  name: string;
  role: string;
  niche: string;
  valueProp: string;
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const STAGES = ["Nuevo", "Contactado", "Calificado", "Propuesta", "Cerrado"];
const STAGE_COLORS: Record<string, string> = {
  Nuevo: "#6366f1",
  Contactado: "#3b82f6",
  Calificado: "#f59e0b",
  Propuesta: "#10b981",
  Cerrado: "#C9A84C",
};

const NAV: { id: string; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard",      icon: "⌘" },
  { id: "pipeline",  label: "CRM Pipeline",   icon: "◈" },
  { id: "closer",    label: "Vista Closer",   icon: "◎" },
  { id: "buscador",  label: "Prospector",     icon: "◉" },
  { id: "generar",   label: "Redacción IA",   icon: "✦" },
  { id: "email",     label: "Email Marketing",icon: "✉" },
  { id: "cadence",   label: "Cadencias",      icon: "≋" },
  { id: "inbox",     label: "Inbox",          icon: "▣" },
  { id: "qualify",   label: "Qualify Gate",   icon: "◆" },
  { id: "knowledge", label: "Base Conocim.",  icon: "◐" },
];

const DEMO_LEADS: Lead[] = [
  { id: "1", name: "María Velázquez", role: "Founder", company: "StartupMX", score: 10, temp: "Warm", stage: "Calificado", nextAction: "Call hoy", createdAt: "2026-05-20" },
  { id: "2", name: "Agencia Scale MX", role: "CEO", company: "Scale MX", score: 9, temp: "Hot", stage: "Contactado", lastAction: "Contactado", createdAt: "2026-05-19" },
  { id: "3", name: "Camila Torres", role: "Coach", company: "Self", score: 9, temp: "Warm", stage: "Nuevo", nextAction: "DM LinkedIn", createdAt: "2026-05-20" },
  { id: "4", name: "Diego Ramírez", role: "CMO", company: "Fintech SA", score: 7, temp: "Frío", stage: "Propuesta", lastAction: "Enviada propuesta", createdAt: "2026-05-18" },
  { id: "5", name: "Laura Gómez", role: "Growth Lead", company: "EdTech Co", score: 8, temp: "Warm", stage: "Calificado", nextAction: "Follow-up", createdAt: "2026-05-17" },
];

// ── UTILS ─────────────────────────────────────────────────────────────────────
function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function tempColor(t: Lead["temp"]): string {
  return t === "Hot" ? "#f87171" : t === "Warm" ? "#C9A84C" : "#64748b";
}

function scoreColor(s: number): string {
  if (s >= 9) return "#10b981";
  if (s >= 7) return "#C9A84C";
  return "#64748b";
}

// ── SCORE BAR ─────────────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  return (
    <div className="score-bar" style={{ marginTop: 6 }}>
      <div
        className="score-fill"
        style={{ width: `${score * 10}%`, background: scoreColor(score) }}
      />
    </div>
  );
}

// ── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      className="glass stat-card"
      style={{ padding: "20px 22px", position: "relative", overflow: "hidden" }}
    >
      {accent && (
        <div
          style={{
            position: "absolute", top: 0, right: 0,
            width: 60, height: 60,
            background: `radial-gradient(circle at top right, ${accent}22, transparent 70%)`,
          }}
        />
      )}
      <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--txt2)", fontWeight: 500, marginBottom: 10 }}>
        {label}
      </p>
      <p className="display" style={{ fontSize: 32, fontWeight: 300, color: accent || "var(--txt)", lineHeight: 1 }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: 12, color: "var(--txt3)", marginTop: 6 }}>{sub}</p>
      )}
    </div>
  );
}

// ── LEAD CARD ─────────────────────────────────────────────────────────────────
function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  return (
    <div
      className="glass lead-card"
      onClick={onClick}
      style={{ padding: "14px 16px", transition: "all 0.18s ease" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <p style={{ fontWeight: 500, fontSize: 13, color: "var(--txt)", lineHeight: 1.3 }}>{lead.name}</p>
          <p style={{ fontSize: 11, color: "var(--txt2)", marginTop: 2 }}>{lead.role}{lead.company ? ` · ${lead.company}` : ""}</p>
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 300, color: scoreColor(lead.score), lineHeight: 1 }}>
          {lead.score}
        </span>
      </div>
      <ScoreBar score={lead.score} />
      <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
        <span className="pill" style={{ background: `${tempColor(lead.temp)}18`, color: tempColor(lead.temp), border: `0.5px solid ${tempColor(lead.temp)}35`, fontSize: 10 }}>
          {lead.temp === "Hot" ? "🔥" : lead.temp === "Warm" ? "◈" : "❄"} {lead.temp}
        </span>
        {lead.nextAction && (
          <span className="pill pill-muted" style={{ fontSize: 10 }}>→ {lead.nextAction}</span>
        )}
      </div>
    </div>
  );
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
      onClick={onClose}
    >
      <div
        className="glass"
        style={{ maxWidth: 540, width: "100%", padding: 28, border: "0.5px solid var(--gold-b)" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 className="display" style={{ fontSize: 22, fontWeight: 400, color: "var(--txt)" }}>{title}</h2>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── FORM FIELD ────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--txt2)", marginBottom: 6, fontWeight: 500 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
let _toastFn: ((m: string, t?: "ok" | "err") => void) | null = null;
function useToast() { return _toastFn!; }

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: "ok" | "err" }[]>([]);
  _toastFn = (msg, type = "ok") => {
    const id = uid();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };
  return (
    <>
      {children}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} className="glass" style={{
            padding: "10px 16px", display: "flex", alignItems: "center", gap: 10,
            border: `0.5px solid ${t.type === "ok" ? "var(--gold-b)" : "rgba(248,113,113,0.3)"}`,
            animation: "fadeUp 0.25s ease",
          }}>
            <span style={{ fontSize: 15 }}>{t.type === "ok" ? "✦" : "✕"}</span>
            <span style={{ fontSize: 13, color: "var(--txt)" }}>{t.msg}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ leads }: { leads: Lead[] }) {
  const warm = leads.filter(l => l.temp !== "Frío");
  const today = leads.filter(l => l.nextAction);
  const avgScore = leads.length ? (leads.reduce((a, b) => a + b.score, 0) / leads.length).toFixed(1) : "0";

  return (
    <div className="fade-up" style={{ padding: "32px 36px", overflowY: "auto", height: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="display" style={{ fontSize: 36, fontWeight: 300, color: "var(--txt)", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: "var(--txt2)", marginTop: 6 }}>
          {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Stat grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 36 }}>
        <StatCard label="Leads Warm" value={`${warm.length}`} sub={`de ${leads.length} totales`} accent="#C9A84C" />
        <StatCard label="Score Promedio" value={avgScore} sub="BANT estimado" accent="#10b981" />
        <StatCard label="Acción Hoy" value={`${today.length}`} sub="leads pendientes" accent="#6366f1" />
        <StatCard label="Pipeline Activo" value={`${leads.filter(l => l.stage !== "Cerrado").length}`} sub="en proceso" accent="#f59e0b" />
      </div>

      {/* Misión del día */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--txt2)" }}>
            Misión del día
          </h2>
          <span className="pill pill-gold">{today.length} pendientes</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {today.slice(0, 4).map(lead => (
            <div key={lead.id} className="glass" style={{ padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <p style={{ fontWeight: 500, fontSize: 13 }}>{lead.name}</p>
                <span className="pill" style={{ background: `${tempColor(lead.temp)}18`, color: tempColor(lead.temp), border: `0.5px solid ${tempColor(lead.temp)}35`, fontSize: 10 }}>
                  {lead.temp}
                </span>
              </div>
              <p style={{ fontSize: 11, color: "var(--txt2)", marginBottom: 10 }}>{lead.role}</p>
              <ScoreBar score={lead.score} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <span style={{ fontSize: 11, color: "var(--txt3)" }}>{lead.nextAction}</span>
                <span className="mono" style={{ fontSize: 16, fontWeight: 300, color: scoreColor(lead.score) }}>{lead.score}/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flujo guiado */}
      <div className="glass" style={{ padding: "18px 22px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--txt2)", fontWeight: 500, marginBottom: 14 }}>
          Flujo de trabajo
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Capturar leads", "Escribir mensaje", "Registrar respuesta", "Mover en pipeline", "Cerrar deal"].map((step, i) => (
            <span key={i} className="btn btn-ghost" style={{ fontSize: 12, padding: "6px 14px" }}>
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PIPELINE KANBAN ───────────────────────────────────────────────────────────
function Pipeline({ leads, onLeadClick, onStageChange }: {
  leads: Lead[];
  onLeadClick: (l: Lead) => void;
  onStageChange: (id: string, stage: string) => void;
}) {
  return (
    <div className="fade-up" style={{ padding: "32px 36px", height: "100%", overflowX: "auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="display" style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.01em" }}>CRM Pipeline</h1>
        <p style={{ fontSize: 13, color: "var(--txt2)", marginTop: 4 }}>{leads.length} leads en seguimiento</p>
      </div>
      <div style={{ display: "flex", gap: 16, minWidth: "max-content", paddingBottom: 24 }}>
        {STAGES.map(stage => {
          const col = leads.filter(l => l.stage === stage);
          return (
            <div key={stage} style={{ width: 240 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: STAGE_COLORS[stage], display: "inline-block" }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--txt2)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{stage}</span>
                </div>
                <span className="pill pill-muted">{col.length}</span>
              </div>
              <div className="kan-col" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.map(lead => (
                  <LeadCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
                ))}
                {col.length === 0 && (
                  <div style={{ border: "0.5px dashed var(--border)", borderRadius: "var(--radius)", padding: "24px 16px", textAlign: "center" }}>
                    <p style={{ fontSize: 12, color: "var(--txt3)" }}>Sin leads</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── REDACCIÓN IA ──────────────────────────────────────────────────────────────
function RedaccionIA({ leads }: { leads: Lead[] }) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [tone, setTone] = useState<"directo" | "empático" | "vsl">("directo");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function generate() {
    if (!selectedLead) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const templates = {
      directo: `Hola ${selectedLead.name}, vi tu perfil como ${selectedLead.role} y quería conectar. Trabajo con perfiles como el tuyo en optimizar su sistema de prospección B2B. ¿Tendrías 15 min esta semana?`,
      empático: `Hola ${selectedLead.name} 👋 Estuve analizando el trabajo que hacés como ${selectedLead.role} y me parece que estás en un punto donde un sistema de outreach bien armado podría cambiar tu ritmo de crecimiento. ¿Charlamos?`,
      vsl: `${selectedLead.name}, tengo algo específico para vos como ${selectedLead.role}. Preparé un video corto (3 min) que explica exactamente cómo cerrar más deals sin prospectar manualmente. ¿Te lo mando?`,
    };
    setMsg(templates[tone]);
    setLoading(false);
  }

  return (
    <div className="fade-up" style={{ padding: "32px 36px", height: "100%", overflowY: "auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="display" style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.01em" }}>Redacción IA</h1>
        <p style={{ fontSize: 13, color: "var(--txt2)", marginTop: 4 }}>Generá mensajes personalizados para cada lead</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 840 }}>
        <div>
          <Field label="Seleccionar Lead">
            <select
              className="inp"
              value={selectedLead?.id || ""}
              onChange={e => setSelectedLead(leads.find(l => l.id === e.target.value) || null)}
              style={{ background: "var(--bg2)" }}
            >
              <option value="">— Elegí un lead —</option>
              {leads.map(l => (
                <option key={l.id} value={l.id}>{l.name} · {l.role}</option>
              ))}
            </select>
          </Field>

          {selectedLead && (
            <div className="glass" style={{ padding: "16px 18px", marginBottom: 16 }}>
              <p style={{ fontWeight: 500, marginBottom: 4 }}>{selectedLead.name}</p>
              <p style={{ fontSize: 12, color: "var(--txt2)", marginBottom: 10 }}>{selectedLead.role}{selectedLead.company ? ` · ${selectedLead.company}` : ""}</p>
              <ScoreBar score={selectedLead.score} />
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <span className="pill" style={{ background: `${tempColor(selectedLead.temp)}18`, color: tempColor(selectedLead.temp), border: `0.5px solid ${tempColor(selectedLead.temp)}35`, fontSize: 10 }}>
                  {selectedLead.temp}
                </span>
                <span className="pill pill-muted" style={{ fontSize: 10 }}>{selectedLead.stage}</span>
              </div>
            </div>
          )}

          <Field label="Tono del mensaje">
            <div style={{ display: "flex", gap: 8 }}>
              {(["directo", "empático", "vsl"] as const).map(t => (
                <button
                  key={t}
                  className={`btn ${tone === t ? "btn-primary" : "btn-ghost"}`}
                  style={{ flex: 1, fontSize: 12, padding: "7px 10px", textTransform: "capitalize" }}
                  onClick={() => setTone(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>

          <button
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 4 }}
            onClick={generate}
            disabled={!selectedLead || loading}
          >
            {loading ? "Generando..." : "✦ Generar mensaje"}
          </button>
        </div>

        <div>
          <Field label="Mensaje generado">
            <textarea
              className="inp"
              style={{ minHeight: 200, resize: "vertical", lineHeight: 1.6 }}
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder="El mensaje aparecerá aquí..."
            />
          </Field>
          {msg && (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-ghost"
                style={{ flex: 1, fontSize: 12 }}
                onClick={() => { navigator.clipboard.writeText(msg); toast("Copiado al portapapeles", "ok"); }}
              >
                Copiar
              </button>
              <button className="btn btn-ghost" style={{ flex: 1, fontSize: 12 }} onClick={generate}>
                Regenerar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── INBOX ─────────────────────────────────────────────────────────────────────
function Inbox({ leads }: { leads: Lead[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function analyze() {
    if (!response) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setAnalysis("🟢 Respuesta POSITIVA — Lead interesado. Acción recomendada: agendar call en las próximas 24h. Score sugerido: +1. Probabilidad de cierre: alta.");
    setLoading(false);
  }

  return (
    <div className="fade-up" style={{ padding: "32px 36px", height: "100%", overflowY: "auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="display" style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.01em" }}>Inbox</h1>
        <p style={{ fontSize: 13, color: "var(--txt2)", marginTop: 4 }}>Analizá respuestas con IA</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, maxWidth: 800 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {leads.slice(0, 5).map(l => (
            <div
              key={l.id}
              className={`glass ${selected === l.id ? "glass-gold" : ""}`}
              style={{ padding: "12px 14px", cursor: "pointer", transition: "all 0.18s" }}
              onClick={() => setSelected(l.id)}
            >
              <p style={{ fontWeight: 500, fontSize: 13 }}>{l.name}</p>
              <p style={{ fontSize: 11, color: "var(--txt2)", marginTop: 2 }}>{l.role}</p>
            </div>
          ))}
        </div>
        <div>
          <Field label="Pegar respuesta del lead">
            <textarea
              className="inp"
              style={{ minHeight: 140, resize: "vertical", lineHeight: 1.6 }}
              value={response}
              onChange={e => setResponse(e.target.value)}
              placeholder="Pegá aquí la respuesta que recibiste..."
            />
          </Field>
          <button className="btn btn-primary" onClick={analyze} disabled={!response || loading} style={{ marginBottom: 16 }}>
            {loading ? "Analizando..." : "✦ Analizar con IA"}
          </button>
          {analysis && (
            <div className="glass glass-gold" style={{ padding: "16px 18px" }}>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--txt)" }}>{analysis}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── QUALIFY GATE ──────────────────────────────────────────────────────────────
function QualifyGate({ leads, onScoreUpdate }: { leads: Lead[]; onScoreUpdate: (id: string, score: number) => void }) {
  const [selected, setSelected] = useState<Lead | null>(null);
  const [answers, setAnswers] = useState({ budget: "", authority: "", need: "", timeline: "" });

  const questions = [
    { key: "budget", label: "¿Tiene presupuesto asignado?", opts: ["No sabe", "< $500/mes", "$500-2k/mes", "> $2k/mes"] },
    { key: "authority", label: "¿Es el decisor?", opts: ["No", "Influenciador", "Co-decisor", "Decisor único"] },
    { key: "need", label: "¿Cuál es la urgencia del problema?", opts: ["Baja", "Media", "Alta", "Crítica"] },
    { key: "timeline", label: "¿Cuándo necesita la solución?", opts: ["> 6 meses", "3-6 meses", "1-3 meses", "Ahora"] },
  ] as const;

  const calcScore = () => {
    const vals = Object.values(answers);
    if (vals.some(v => !v)) return null;
    const score = vals.reduce((sum, v) => {
      const idx = 3; // simplified
      return sum + (["No sabe","No","Baja","> 6 meses"].includes(v) ? 2 : ["< $500/mes","Influenciador","Media","3-6 meses"].includes(v) ? 5 : ["$500-2k/mes","Co-decisor","Alta","1-3 meses"].includes(v) ? 8 : 10);
    }, 0) / 4;
    return Math.round(score * 10) / 10;
  };

  const score = calcScore();

  return (
    <div className="fade-up" style={{ padding: "32px 36px", height: "100%", overflowY: "auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="display" style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.01em" }}>Qualify Gate</h1>
        <p style={{ fontSize: 13, color: "var(--txt2)", marginTop: 4 }}>Calificación BANT interactiva</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, maxWidth: 760 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {leads.map(l => (
            <div
              key={l.id}
              className={`glass ${selected?.id === l.id ? "glass-gold" : ""}`}
              style={{ padding: "12px 14px", cursor: "pointer" }}
              onClick={() => setSelected(l)}
            >
              <p style={{ fontWeight: 500, fontSize: 12 }}>{l.name}</p>
              <ScoreBar score={l.score} />
            </div>
          ))}
        </div>
        <div>
          {questions.map(q => (
            <Field key={q.key} label={q.label}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {q.opts.map(opt => (
                  <button
                    key={opt}
                    className={`btn ${answers[q.key] === opt ? "btn-primary" : "btn-ghost"}`}
                    style={{ fontSize: 12, padding: "6px 12px" }}
                    onClick={() => setAnswers(p => ({ ...p, [q.key]: opt }))}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </Field>
          ))}
          {score !== null && (
            <div className="glass glass-gold" style={{ padding: "20px 22px", marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--txt2)", marginBottom: 4 }}>Score BANT calculado</p>
                  <p className="display" style={{ fontSize: 42, fontWeight: 300, color: scoreColor(score) }}>{score}<span style={{ fontSize: 20, color: "var(--txt2)" }}>/10</span></p>
                </div>
                {selected && (
                  <button className="btn btn-primary" onClick={() => { onScoreUpdate(selected.id, Math.round(score)); }}>
                    Actualizar score
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── PROSPECTOR ────────────────────────────────────────────────────────────────
function Prospector({ onAddLead }: { onAddLead: (l: Lead) => void }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Lead[]>([]);
  const toast = useToast();

  async function extract() {
    if (!url) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const demo: Lead[] = [
      { id: uid(), name: "Valentina Mier", role: "CEO", company: "StartupBA", score: 8, temp: "Warm", stage: "Nuevo", createdAt: new Date().toISOString() },
      { id: uid(), name: "Marcos Reyes", role: "CMO", company: "Scale Co", score: 7, temp: "Warm", stage: "Nuevo", createdAt: new Date().toISOString() },
      { id: uid(), name: "Andrea Font", role: "Founder", company: "EduTech", score: 9, temp: "Hot", stage: "Nuevo", createdAt: new Date().toISOString() },
    ];
    setResults(demo);
    setLoading(false);
    toast(`${demo.length} leads extraídos del post`, "ok");
  }

  return (
    <div className="fade-up" style={{ padding: "32px 36px", height: "100%", overflowY: "auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="display" style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.01em" }}>Prospector</h1>
        <p style={{ fontSize: 13, color: "var(--txt2)", marginTop: 4 }}>Extraé leads de posts de LinkedIn via Apify</p>
      </div>
      <div style={{ maxWidth: 640 }}>
        <Field label="URL del post de LinkedIn">
          <div style={{ display: "flex", gap: 10 }}>
            <input className="inp" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://linkedin.com/posts/..." />
            <button className="btn btn-primary" onClick={extract} disabled={loading || !url} style={{ whiteSpace: "nowrap" }}>
              {loading ? "Extrayendo..." : "Extraer"}
            </button>
          </div>
        </Field>

        {results.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--txt2)", fontWeight: 600 }}>
                Leads encontrados
              </p>
              <span className="pill pill-gold">{results.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {results.map(lead => (
                <div key={lead.id} className="glass" style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: 13 }}>{lead.name}</p>
                    <p style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>{lead.role} · {lead.company}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="mono" style={{ fontSize: 18, fontWeight: 300, color: scoreColor(lead.score) }}>{lead.score}</span>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => { onAddLead(lead); toast(`${lead.name} agregado al CRM`, "ok"); }}>
                      + Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PLACEHOLDER VIEWS ─────────────────────────────────────────────────────────
function PlaceholderView({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="fade-up" style={{ padding: "32px 36px", height: "100%", overflowY: "auto" }}>
      <h1 className="display" style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.01em", marginBottom: 8 }}>{title}</h1>
      <p style={{ fontSize: 13, color: "var(--txt2)", marginBottom: 32 }}>{desc}</p>
      <div className="glass" style={{ padding: "40px 32px", textAlign: "center", maxWidth: 480 }}>
        <p className="display" style={{ fontSize: 48, fontWeight: 300, color: "var(--gold)", marginBottom: 12 }}>✦</p>
        <p style={{ fontSize: 14, color: "var(--txt2)", lineHeight: 1.7 }}>
          Módulo en construcción. <br />La funcionalidad estará disponible próximamente.
        </p>
      </div>
    </div>
  );
}

// ── LEAD DETAIL MODAL ─────────────────────────────────────────────────────────
function LeadDetail({ lead, onClose, onUpdate }: {
  lead: Lead; onClose: () => void;
  onUpdate: (l: Lead) => void;
}) {
  const [l, setL] = useState<Lead>(lead);
  const toast = useToast();

  function save() {
    onUpdate(l);
    toast("Lead actualizado", "ok");
    onClose();
  }

  return (
    <Modal open title={l.name} onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <Field label="Nombre">
          <input className="inp" value={l.name} onChange={e => setL(p => ({ ...p, name: e.target.value }))} />
        </Field>
        <Field label="Rol">
          <input className="inp" value={l.role} onChange={e => setL(p => ({ ...p, role: e.target.value }))} />
        </Field>
        <Field label="Empresa">
          <input className="inp" value={l.company || ""} onChange={e => setL(p => ({ ...p, company: e.target.value }))} />
        </Field>
        <Field label="Temperatura">
          <select className="inp" value={l.temp} onChange={e => setL(p => ({ ...p, temp: e.target.value as Lead["temp"] }))}>
            <option>Warm</option><option>Hot</option><option>Frío</option>
          </select>
        </Field>
        <Field label="Etapa">
          <select className="inp" value={l.stage} onChange={e => setL(p => ({ ...p, stage: e.target.value }))}>
            {STAGES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Score (1-10)">
          <input className="inp" type="number" min={1} max={10} value={l.score} onChange={e => setL(p => ({ ...p, score: +e.target.value }))} />
        </Field>
      </div>
      <Field label="Próxima acción">
        <input className="inp" value={l.nextAction || ""} onChange={e => setL(p => ({ ...p, nextAction: e.target.value }))} placeholder="Ej: Call mañana 10am" />
      </Field>
      <Field label="Notas">
        <textarea className="inp" style={{ minHeight: 80, resize: "vertical" }} value={l.notes || ""} onChange={e => setL(p => ({ ...p, notes: e.target.value }))} placeholder="Notas del lead..." />
      </Field>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={save}>Guardar cambios</button>
      </div>
    </Modal>
  );
}

// ── ADD LEAD MODAL ────────────────────────────────────────────────────────────
function AddLeadModal({ open, onClose, onAdd }: {
  open: boolean; onClose: () => void; onAdd: (l: Lead) => void;
}) {
  const [form, setForm] = useState({ name: "", role: "", company: "", score: 7, temp: "Warm" as Lead["temp"], stage: "Nuevo", nextAction: "" });
  const toast = useToast();

  function submit() {
    if (!form.name || !form.role) return;
    onAdd({ ...form, id: uid(), createdAt: new Date().toISOString() });
    toast(`${form.name} agregado`, "ok");
    onClose();
    setForm({ name: "", role: "", company: "", score: 7, temp: "Warm", stage: "Nuevo", nextAction: "" });
  }

  return (
    <Modal open={open} onClose={onClose} title="Nuevo lead">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Nombre *">
          <input className="inp" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ej: María García" />
        </Field>
        <Field label="Rol *">
          <input className="inp" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="Ej: CEO" />
        </Field>
        <Field label="Empresa">
          <input className="inp" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
        </Field>
        <Field label="Temperatura">
          <select className="inp" value={form.temp} onChange={e => setForm(p => ({ ...p, temp: e.target.value as Lead["temp"] }))}>
            <option>Warm</option><option>Hot</option><option>Frío</option>
          </select>
        </Field>
        <Field label="Score inicial">
          <input className="inp" type="number" min={1} max={10} value={form.score} onChange={e => setForm(p => ({ ...p, score: +e.target.value }))} />
        </Field>
        <Field label="Etapa">
          <select className="inp" value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}>
            {STAGES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Próxima acción">
        <input className="inp" value={form.nextAction} onChange={e => setForm(p => ({ ...p, nextAction: e.target.value }))} placeholder="Ej: Enviar DM LinkedIn" />
      </Field>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={submit} disabled={!form.name || !form.role}>
          Agregar lead
        </button>
      </div>
    </Modal>
  );
}

// ── ONBOARDING ────────────────────────────────────────────────────────────────
function Onboarding({ onComplete }: { onComplete: (p: UserProfile) => void }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({ name: "", role: "", niche: "", valueProp: "" });

  const steps = [
    {
      label: "¿Cómo te llamás?",
      field: "name" as keyof UserProfile,
      placeholder: "Tu nombre completo",
    },
    {
      label: "¿Cuál es tu rol?",
      field: "role" as keyof UserProfile,
      placeholder: "Ej: Growth Lead, Setter B2B, Founder...",
    },
    {
      label: "¿En qué nicho trabajás?",
      field: "niche" as keyof UserProfile,
      placeholder: "Ej: comunidades digitales, SaaS, coaching...",
    },
    {
      label: "¿Cuál es tu propuesta de valor?",
      field: "valueProp" as keyof UserProfile,
      placeholder: "Ej: Ayudo a founders a sistematizar su prospección B2B",
    },
  ];

  const current = steps[step];

  function next() {
    if (!profile[current.field]) return;
    if (step < steps.length - 1) setStep(s => s + 1);
    else onComplete(profile);
  }

  return (
    <div className="onboard-wrap">
      <div style={{ maxWidth: 480, width: "100%", padding: 24 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p className="display" style={{ fontSize: 48, fontWeight: 300, letterSpacing: "-0.02em", color: "var(--txt)" }}>
            Closer<span style={{ color: "var(--gold)" }}>AI</span>
          </p>
          <p style={{ fontSize: 13, color: "var(--txt2)", marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            B2B Engine · v9
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 36 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 2, borderRadius: 99,
              background: i <= step ? "var(--gold)" : "var(--border)",
              transition: "background 0.3s ease",
            }} />
          ))}
        </div>

        {/* Question */}
        <div className="glass" style={{ padding: "32px 28px" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12, fontWeight: 500 }}>
            {step + 1} de {steps.length}
          </p>
          <h2 className="display" style={{ fontSize: 26, fontWeight: 400, marginBottom: 24, lineHeight: 1.3, color: "var(--txt)" }}>
            {current.label}
          </h2>
          <input
            className="inp"
            autoFocus
            value={profile[current.field]}
            onChange={e => setProfile(p => ({ ...p, [current.field]: e.target.value }))}
            placeholder={current.placeholder}
            onKeyDown={e => e.key === "Enter" && next()}
            style={{ marginBottom: 16, fontSize: 15 }}
          />
          <button className="btn btn-primary" style={{ width: "100%", padding: "11px 18px" }} onClick={next} disabled={!profile[current.field]}>
            {step < steps.length - 1 ? "Continuar →" : "Entrar al CRM ✦"}
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--txt3)", marginTop: 20 }}>
          Tus datos se guardan localmente
        </p>
      </div>
    </div>
  );
}

// ── VISTA CLOSER ──────────────────────────────────────────────────────────────
function VistaCloser({ leads, onLeadClick }: { leads: Lead[]; onLeadClick: (l: Lead) => void }) {
  const sorted = [...leads].sort((a, b) => b.score - a.score);
  return (
    <div className="fade-up" style={{ padding: "32px 36px", height: "100%", overflowY: "auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="display" style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.01em" }}>Vista Closer</h1>
        <p style={{ fontSize: 13, color: "var(--txt2)", marginTop: 4 }}>Leads priorizados por score — top opportunities</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 680 }}>
        {sorted.map((lead, i) => (
          <div
            key={lead.id}
            className="glass lead-card"
            onClick={() => onLeadClick(lead)}
            style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 20 }}
          >
            <span className="mono" style={{ fontSize: 22, fontWeight: 300, color: "var(--txt3)", width: 28, textAlign: "right", flexShrink: 0 }}>
              {i + 1}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <p style={{ fontWeight: 500, fontSize: 14 }}>{lead.name}</p>
                  <p style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>{lead.role}{lead.company ? ` · ${lead.company}` : ""}</p>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="pill" style={{ background: `${tempColor(lead.temp)}18`, color: tempColor(lead.temp), border: `0.5px solid ${tempColor(lead.temp)}35`, fontSize: 10 }}>
                    {lead.temp}
                  </span>
                  <span className="pill pill-muted" style={{ fontSize: 10 }}>{lead.stage}</span>
                </div>
              </div>
              <ScoreBar score={lead.score} />
            </div>
            <span className="mono" style={{ fontSize: 28, fontWeight: 300, color: scoreColor(lead.score), flexShrink: 0 }}>
              {lead.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({ active, onChange, profile, leadsCount }: {
  active: string; onChange: (id: string) => void;
  profile: UserProfile; leadsCount: number;
}) {
  return (
    <aside style={{
      width: "var(--sidebar-w)", minHeight: "100vh", flexShrink: 0,
      background: "rgba(6,8,14,0.95)",
      borderRight: "0.5px solid var(--border)",
      display: "flex", flexDirection: "column",
      backdropFilter: "blur(20px)",
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "0.5px solid var(--border)" }}>
        <p className="display" style={{ fontSize: 22, fontWeight: 300, letterSpacing: "-0.01em", color: "var(--txt)", lineHeight: 1 }}>
          Closer<span style={{ color: "var(--gold)" }}>AI</span>
        </p>
        <p style={{ fontSize: 10, color: "var(--txt3)", marginTop: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          v9 · B2B Engine
        </p>
      </div>

      {/* User */}
      <div style={{ padding: "14px 20px", borderBottom: "0.5px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "var(--gold-m)", border: "0.5px solid var(--gold-b)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600, color: "var(--gold)", flexShrink: 0,
          }}>
            {profile.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--txt)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {profile.name || "Usuario"}
            </p>
            <p style={{ fontSize: 10, color: "var(--txt3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {profile.role || "Growth Lead"}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(item => (
            <div
              key={item.id}
              className={`nav-item ${active === item.id ? "active" : ""}`}
              onClick={() => onChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer stat */}
      <div style={{ padding: "14px 20px", borderTop: "0.5px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--txt3)" }}>Leads activos</span>
          <span className="pill pill-gold" style={{ fontSize: 11 }}>{leadsCount}</span>
        </div>
      </div>
    </aside>
  );
}

// ── TOP BAR ───────────────────────────────────────────────────────────────────
function TopBar({ activeTab, onAddLead }: { activeTab: string; onAddLead: () => void }) {
  const tabLabel = NAV.find(n => n.id === activeTab)?.label || "";
  return (
    <header style={{
      height: 52, flexShrink: 0,
      borderBottom: "0.5px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px",
      background: "rgba(7,9,15,0.8)", backdropFilter: "blur(12px)",
    }}>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", alignItems: "center" }}>
        {/* breadcrumb */}
        <span style={{ fontSize: 12, color: "var(--txt3)" }}>CloserAI</span>
        <span style={{ fontSize: 12, color: "var(--txt3)" }}>·</span>
        <span style={{ fontSize: 12, color: "var(--txt2)" }}>{tabLabel}</span>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button className="btn btn-primary" style={{ fontSize: 12, padding: "6px 14px" }} onClick={onAddLead}>
          + Nuevo lead
        </button>
      </div>
    </header>
  );
}

// ── APP LAYOUT ────────────────────────────────────────────────────────────────
function AppLayout({ profile }: { profile: UserProfile }) {
  const [tab, setTab] = useState("dashboard");
  const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  function addLead(l: Lead) {
    setLeads(p => [l, ...p]);
  }

  function updateLead(l: Lead) {
    setLeads(p => p.map(x => x.id === l.id ? l : x));
  }

  function stageChange(id: string, stage: string) {
    setLeads(p => p.map(l => l.id === id ? { ...l, stage } : l));
  }

  function scoreUpdate(id: string, score: number) {
    setLeads(p => p.map(l => l.id === id ? { ...l, score } : l));
  }

  const views: Record<string, React.ReactNode> = {
    dashboard: <Dashboard leads={leads} />,
    pipeline:  <Pipeline leads={leads} onLeadClick={setSelectedLead} onStageChange={stageChange} />,
    closer:    <VistaCloser leads={leads} onLeadClick={setSelectedLead} />,
    buscador:  <Prospector onAddLead={addLead} />,
    generar:   <RedaccionIA leads={leads} />,
    email:     <PlaceholderView title="Email Marketing" desc="Campañas y secuencias de email automatizadas" />,
    cadence:   <PlaceholderView title="Cadencias" desc="Secuencias multicanal automatizadas" />,
    inbox:     <Inbox leads={leads} />,
    qualify:   <QualifyGate leads={leads} onScoreUpdate={scoreUpdate} />,
    knowledge: <PlaceholderView title="Base de Conocimiento" desc="Templates, scripts y recursos de cierre" />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar active={tab} onChange={setTab} profile={profile} leadsCount={leads.length} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar activeTab={tab} onAddLead={() => setAddOpen(true)} />
        <main style={{ flex: 1, overflow: "hidden" }}>
          {views[tab] || views["dashboard"]}
        </main>
      </div>

      {selectedLead && (
        <LeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdate={updateLead} />
      )}
      <AddLeadModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addLead} />
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function CRMApp() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try { const s = localStorage.getItem("closer_profile"); return s ? JSON.parse(s) : null; } catch { return null; }
  });

  function completeOnboarding(p: UserProfile) {
    localStorage.setItem("closer_profile", JSON.stringify(p));
    setProfile(p);
  }

  return (
    <ToastProvider>
      {profile ? <AppLayout profile={profile} /> : <Onboarding onComplete={completeOnboarding} />}
    </ToastProvider>
  );
}
