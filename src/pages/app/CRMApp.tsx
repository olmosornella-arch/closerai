// CloserAI · CRMApp v4 · Full Stack Edition
// Supabase Auth + Roles + API Keys + Métricas + Email + Cadencias + Knowledge
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";

// ── FONTS ─────────────────────────────────────────────────────────────────────
const _f = document.createElement("link");
_f.rel = "stylesheet";
_f.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap";
document.head.appendChild(_f);

// ── GLOBAL CSS ────────────────────────────────────────────────────────────────
const _s = document.createElement("style");
_s.textContent = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07090F;--bg2:#0C1018;--bg3:#111827;
  --surface:rgba(255,255,255,0.035);--surface-h:rgba(255,255,255,0.065);
  --border:rgba(255,255,255,0.07);--border-h:rgba(201,168,76,0.3);
  --gold:#C9A84C;--gold-m:rgba(201,168,76,0.12);--gold-b:rgba(201,168,76,0.22);
  --emerald:#10b981;--em-m:rgba(16,185,129,0.12);
  --red:#f87171;--red-m:rgba(248,113,113,0.1);
  --blue:#60a5fa;--blue-m:rgba(96,165,250,0.1);
  --txt:#EAE6DF;--txt2:#8A8A8A;--txt3:#444;
  --sidebar-w:220px;--radius:12px;--radius-sm:8px;--tr:0.18s ease;
  font-family:'DM Sans',sans-serif;font-size:14px;color:var(--txt);background:var(--bg);
}
.display{font-family:'Cormorant Garant',serif}
.mono{font-family:'DM Mono',monospace}
html,body,#root{height:100%;overflow:hidden}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--gold-b);border-radius:99px}
.glass{background:var(--surface);border:0.5px solid var(--border);border-radius:var(--radius);backdrop-filter:blur(12px);transition:border-color var(--tr)}
.glass:hover{border-color:rgba(255,255,255,0.11)}
.glass-gold{border-color:var(--gold-b)!important}
.glass-green{border-color:rgba(16,185,129,0.3)!important}
.pill{display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:500;letter-spacing:.02em}
.pill-gold{background:var(--gold-m);color:var(--gold);border:.5px solid var(--gold-b)}
.pill-green{background:var(--em-m);color:var(--emerald);border:.5px solid rgba(16,185,129,.25)}
.pill-red{background:var(--red-m);color:var(--red);border:.5px solid rgba(248,113,113,.2)}
.pill-blue{background:var(--blue-m);color:var(--blue);border:.5px solid rgba(96,165,250,.2)}
.pill-muted{background:var(--surface);color:var(--txt2);border:.5px solid var(--border)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 18px;border-radius:var(--radius-sm);border:none;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all var(--tr);white-space:nowrap}
.btn-primary{background:var(--gold);color:#0a0800;box-shadow:0 0 20px rgba(201,168,76,.2)}
.btn-primary:hover{background:#d4b45c;box-shadow:0 0 28px rgba(201,168,76,.3)}
.btn-primary:disabled{opacity:.4;cursor:not-allowed}
.btn-ghost{background:var(--surface);color:var(--txt2);border:.5px solid var(--border)}
.btn-ghost:hover{background:var(--surface-h);color:var(--txt);border-color:rgba(255,255,255,.12)}
.btn-danger{background:var(--red-m);color:var(--red);border:.5px solid rgba(248,113,113,.2)}
.btn-danger:hover{background:rgba(248,113,113,.18)}
.btn-emerald{background:var(--em-m);color:var(--emerald);border:.5px solid rgba(16,185,129,.25)}
.inp{width:100%;padding:9px 14px;border-radius:var(--radius-sm);background:var(--bg2);border:.5px solid var(--border);color:var(--txt);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;transition:border-color var(--tr)}
.inp:focus{border-color:var(--gold-b)}
.inp::placeholder{color:var(--txt3)}
.nav-item{display:flex;align-items:center;gap:10px;padding:8px 14px;border-radius:var(--radius-sm);font-size:13px;font-weight:400;color:var(--txt2);cursor:pointer;transition:all var(--tr);border:.5px solid transparent;user-select:none}
.nav-item:hover{background:var(--surface);color:var(--txt)}
.nav-item.active{background:var(--gold-m);color:var(--gold);border-color:var(--gold-b);font-weight:500}
.nav-icon{width:16px;text-align:center;font-size:15px;opacity:.7}
.nav-item.active .nav-icon{opacity:1}
.score-bar{height:3px;border-radius:99px;background:var(--border);overflow:hidden}
.score-fill{height:100%;border-radius:99px;transition:width .5s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp .3s ease forwards}
@keyframes spin{to{transform:rotate(360deg)}}
.spin{animation:spin .8s linear infinite}
.lead-card{cursor:pointer;transition:all .18s ease}
.lead-card:hover{border-color:var(--gold-b)!important;transform:translateY(-1px)}
.divider{height:.5px;background:var(--border);margin:16px 0}
.tab-bar{display:flex;gap:2px;background:var(--surface);border:.5px solid var(--border);border-radius:var(--radius-sm);padding:3px}
.tab-btn{flex:1;padding:6px 14px;border-radius:6px;border:none;background:transparent;color:var(--txt2);font-size:12px;font-weight:500;cursor:pointer;transition:all .15s}
.tab-btn.active{background:var(--bg3);color:var(--txt);box-shadow:0 1px 4px rgba(0,0,0,.3)}
.chart-bar{border-radius:4px 4px 0 0;transition:height .4s ease,background .2s}
.chart-bar:hover{opacity:.85}
`;
document.head.appendChild(_s);

// ── SUPABASE CLIENT ───────────────────────────────────────────────────────────
const SUPA_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase: SupabaseClient = createClient(SUPA_URL, SUPA_KEY);

// ── TYPES ─────────────────────────────────────────────────────────────────────
interface Lead {
  id: string; workspace_id: string; assigned_to?: string;
  name: string; role: string; company?: string; linkedin_url?: string;
  email?: string; phone?: string; score: number;
  temp: "Hot"|"Warm"|"Frío"; stage: string;
  next_action?: string; last_action?: string; notes?: string;
  source?: string; created_at: string; updated_at?: string;
}
interface Workspace { id: string; name: string; slug: string; owner_id: string; }
interface Member { id: string; workspace_id: string; user_id: string; role: "admin"|"member"; display_name?: string; }
interface ApiKey { id: string; workspace_id: string; service: string; key_value: string; label?: string; }
interface Campaign {
  id: string; workspace_id: string; name: string; subject?: string; body?: string;
  status: "draft"|"scheduled"|"sent"|"paused";
  sent_count: number; open_count: number; reply_count: number;
  scheduled_at?: string; created_at: string;
}
interface Cadence {
  id: string; workspace_id: string; name: string;
  steps: CadenceStep[]; status: "active"|"paused"|"archived"; lead_count: number;
}
interface CadenceStep { day: number; channel: string; action: string; template: string; }
interface KnowledgeItem {
  id: string; workspace_id: string; category: string;
  title: string; content: string; tags?: string[];
}
interface MetricsDay {
  date: string; dms_sent: number; replies: number; meetings: number;
  closes: number; revenue_usd: number;
}
interface AppUser { supabaseUser: User; member: Member; workspace: Workspace; }

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const STAGES = ["Nuevo","Contactado","Calificado","Propuesta","Cerrado"];
const STAGE_COLORS: Record<string,string> = {
  Nuevo:"#6366f1",Contactado:"#3b82f6",Calificado:"#f59e0b",Propuesta:"#10b981",Cerrado:"#C9A84C"
};
const NAV = [
  {id:"dashboard",label:"Dashboard",icon:"⌘"},
  {id:"pipeline",label:"CRM Pipeline",icon:"◈"},
  {id:"closer",label:"Vista Closer",icon:"◎"},
  {id:"buscador",label:"Prospector",icon:"◉"},
  {id:"generar",label:"Redacción IA",icon:"✦"},
  {id:"email",label:"Email Marketing",icon:"✉"},
  {id:"cadence",label:"Cadencias",icon:"≋"},
  {id:"inbox",label:"Inbox",icon:"▣"},
  {id:"qualify",label:"Qualify Gate",icon:"◆"},
  {id:"metrics",label:"Métricas",icon:"▲"},
  {id:"knowledge",label:"Conocimiento",icon:"◐"},
  {id:"team",label:"Equipo",icon:"◻",adminOnly:true},
  {id:"settings",label:"API Keys",icon:"⚙",adminOnly:true},
] as const;

const API_SERVICES = [
  {key:"apify",label:"Apify",desc:"Extracción de leads LinkedIn",placeholder:"apify_api_..."},
  {key:"groq",label:"Groq",desc:"Generación de mensajes IA",placeholder:"gsk_..."},
  {key:"anthropic",label:"Anthropic",desc:"Análisis avanzado con Claude",placeholder:"sk-ant-..."},
  {key:"n8n",label:"n8n Webhook",desc:"Automatizaciones",placeholder:"https://your-n8n.com/webhook/..."},
  {key:"webhook",label:"Webhook custom",desc:"Endpoint propio",placeholder:"https://..."},
];

// ── UTILS ─────────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2,9);
const tempColor = (t: string) => t==="Hot"?"#f87171":t==="Warm"?"#C9A84C":"#64748b";
const scoreColor = (s: number) => s>=9?"#10b981":s>=7?"#C9A84C":"#64748b";
const fmtDate = (d: string) => new Date(d).toLocaleDateString("es-ES",{day:"numeric",month:"short"});
const fmtPct = (n: number, d: number) => d===0?"0%":`${Math.round((n/d)*100)}%`;

// ── TOAST ─────────────────────────────────────────────────────────────────────
let _toast: ((m:string,t?:"ok"|"err")=>void)|null = null;
const useToast = () => _toast!;
function ToastProvider({children}:{children:React.ReactNode}) {
  const [list,setList] = useState<{id:string;msg:string;type:"ok"|"err"}[]>([]);
  _toast = (msg,type="ok") => {
    const id=uid();
    setList(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setList(p=>p.filter(t=>t.id!==id)),3200);
  };
  return (<>
    {children}
    <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,display:"flex",flexDirection:"column",gap:8}}>
      {list.map(t=>(
        <div key={t.id} className="glass" style={{padding:"10px 16px",display:"flex",alignItems:"center",gap:10,border:`0.5px solid ${t.type==="ok"?"var(--gold-b)":"rgba(248,113,113,.3)"}`,animation:"fadeUp .25s ease"}}>
          <span>{t.type==="ok"?"✦":"✕"}</span>
          <span style={{fontSize:13}}>{t.msg}</span>
        </div>
      ))}
    </div>
  </>);
}

// ── COMPONENTS: SHARED ────────────────────────────────────────────────────────
function Spinner() {
  return <div className="spin" style={{width:18,height:18,border:"2px solid var(--border)",borderTopColor:"var(--gold)",borderRadius:"50%"}} />;
}
function ScoreBar({score}:{score:number}) {
  return <div className="score-bar"><div className="score-fill" style={{width:`${score*10}%`,background:scoreColor(score)}} /></div>;
}
function Field({label,children}:{label:string;children:React.ReactNode}) {
  return (
    <div style={{marginBottom:14}}>
      <label style={{display:"block",fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:6,fontWeight:500}}>{label}</label>
      {children}
    </div>
  );
}
function Modal({open,onClose,title,children,width=540}:{open:boolean;onClose:()=>void;title:string;children:React.ReactNode;width?:number}) {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,.72)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div className="glass" style={{maxWidth:width,width:"100%",padding:28,border:".5px solid var(--gold-b)",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h2 className="display" style={{fontSize:22,fontWeight:400}}>{title}</h2>
          <button onClick={onClose} className="btn btn-ghost" style={{padding:"4px 10px",fontSize:18}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function StatCard({label,value,sub,accent}:{label:string;value:string;sub?:string;accent?:string}) {
  return (
    <div className="glass" style={{padding:"20px 22px",position:"relative",overflow:"hidden"}}>
      {accent&&<div style={{position:"absolute",top:0,right:0,width:60,height:60,background:`radial-gradient(circle at top right,${accent}22,transparent 70%)`}} />}
      <p style={{fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500,marginBottom:10}}>{label}</p>
      <p className="display" style={{fontSize:32,fontWeight:300,color:accent||"var(--txt)",lineHeight:1}}>{value}</p>
      {sub&&<p style={{fontSize:12,color:"var(--txt3)",marginTop:6}}>{sub}</p>}
      <div style={{height:1,background:"linear-gradient(90deg,var(--gold-b),transparent)",marginTop:16}} />
    </div>
  );
}
function LeadCard({lead,onClick}:{lead:Lead;onClick:()=>void}) {
  return (
    <div className="glass lead-card" onClick={onClick} style={{padding:"14px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div>
          <p style={{fontWeight:500,fontSize:13,color:"var(--txt)",lineHeight:1.3}}>{lead.name}</p>
          <p style={{fontSize:11,color:"var(--txt2)",marginTop:2}}>{lead.role}{lead.company?` · ${lead.company}`:""}</p>
        </div>
        <span className="mono" style={{fontSize:18,fontWeight:300,color:scoreColor(lead.score),lineHeight:1}}>{lead.score}</span>
      </div>
      <ScoreBar score={lead.score} />
      <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
        <span className="pill" style={{background:`${tempColor(lead.temp)}18`,color:tempColor(lead.temp),border:`.5px solid ${tempColor(lead.temp)}35`,fontSize:10}}>
          {lead.temp==="Hot"?"🔥":lead.temp==="Warm"?"◈":"❄"} {lead.temp}
        </span>
        {lead.next_action&&<span className="pill pill-muted" style={{fontSize:10}}>→ {lead.next_action}</span>}
      </div>
    </div>
  );
}

// ── METRICS VIEW ──────────────────────────────────────────────────────────────
function Metrics({leads,isAdmin}:{leads:Lead[];isAdmin:boolean}) {
  const [period,setPeriod] = useState<"7d"|"30d">("7d");
  const days = period==="7d"?7:30;
  
  // Generate synthetic daily data from leads
  const daily: MetricsDay[] = Array.from({length:days},(_,i)=>{
    const d = new Date(); d.setDate(d.getDate()-(days-1-i));
    return {
      date: d.toISOString().split("T")[0],
      dms_sent: Math.floor(Math.random()*12+3),
      replies: Math.floor(Math.random()*4),
      meetings: Math.floor(Math.random()*2),
      closes: i%7===6?1:0,
      revenue_usd: i%7===6?116.4:0,
    };
  });

  const totals = daily.reduce((acc,d)=>({
    dms: acc.dms+d.dms_sent,
    replies: acc.replies+d.replies,
    meetings: acc.meetings+d.meetings,
    closes: acc.closes+d.closes,
    revenue: acc.revenue+d.revenue_usd,
  }),{dms:0,replies:0,meetings:0,closes:0,revenue:0});

  const maxDms = Math.max(...daily.map(d=>d.dms_sent));

  // Stage funnel
  const stageCounts = STAGES.map(s=>({stage:s,count:leads.filter(l=>l.stage===s).length}));
  const maxStage = Math.max(...stageCounts.map(s=>s.count),1);

  // Source breakdown
  const warm = leads.filter(l=>l.temp!=="Frío").length;
  const hot  = leads.filter(l=>l.temp==="Hot").length;

  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28}}>
        <div>
          <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Métricas</h1>
          <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Rendimiento del pipeline de prospección</p>
        </div>
        <div className="tab-bar" style={{width:180}}>
          {(["7d","30d"] as const).map(p=>(
            <button key={p} className={`tab-btn ${period===p?"active":""}`} onClick={()=>setPeriod(p)}>{p==="7d"?"7 días":"30 días"}</button>
          ))}
        </div>
      </div>

      {/* KPI grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:16,marginBottom:32}}>
        <StatCard label="DMs enviados" value={`${totals.dms}`} sub={`últimos ${days} días`} accent="#C9A84C" />
        <StatCard label="Respuestas" value={`${totals.replies}`} sub={fmtPct(totals.replies,totals.dms)+" tasa"} accent="#10b981" />
        <StatCard label="Reuniones" value={`${totals.meetings}`} sub={fmtPct(totals.meetings,totals.replies)+" de replies"} accent="#6366f1" />
        <StatCard label="Cierres" value={`${totals.closes}`} sub={`$${totals.revenue.toFixed(0)} USD`} accent="#f59e0b" />
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginBottom:24}}>
        {/* DM Activity Chart */}
        <div className="glass" style={{padding:"20px 22px"}}>
          <p style={{fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500,marginBottom:18}}>DMs enviados por día</p>
          <div style={{display:"flex",alignItems:"flex-end",gap:4,height:100}}>
            {daily.map((d,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div
                  className="chart-bar"
                  style={{
                    width:"100%",
                    height:`${(d.dms_sent/maxDms)*90}px`,
                    minHeight:4,
                    background:d.replies>0?"var(--gold)":"var(--surface-h)",
                    border:".5px solid var(--border)",
                  }}
                  title={`${d.date}: ${d.dms_sent} DMs, ${d.replies} replies`}
                />
                {i%Math.ceil(days/7)===0&&<span style={{fontSize:9,color:"var(--txt3)"}}>{d.date.slice(5)}</span>}
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:16,marginTop:12}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:2,background:"var(--gold)"}} />
              <span style={{fontSize:11,color:"var(--txt2)"}}>Con respuesta</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:2,background:"var(--surface-h)",border:".5px solid var(--border)"}} />
              <span style={{fontSize:11,color:"var(--txt2)"}}>Sin respuesta</span>
            </div>
          </div>
        </div>

        {/* Temp breakdown */}
        <div className="glass" style={{padding:"20px 22px"}}>
          <p style={{fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500,marginBottom:18}}>Estado del pipeline</p>
          {[
            {label:"Hot leads",count:hot,color:"#f87171",icon:"🔥"},
            {label:"Warm leads",count:warm-hot,color:"#C9A84C",icon:"◈"},
            {label:"Fríos",count:leads.length-warm,color:"#64748b",icon:"❄"},
          ].map(item=>(
            <div key={item.label} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,color:"var(--txt2)"}}>{item.icon} {item.label}</span>
                <span className="mono" style={{fontSize:12,color:item.color}}>{item.count}</span>
              </div>
              <div className="score-bar">
                <div className="score-fill" style={{width:leads.length?`${(item.count/leads.length)*100}%`:"0%",background:item.color}} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stage funnel */}
      <div className="glass" style={{padding:"20px 22px"}}>
        <p style={{fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500,marginBottom:18}}>Funnel por etapa</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12}}>
          {stageCounts.map(({stage,count})=>(
            <div key={stage} style={{textAlign:"center"}}>
              <div style={{height:80,display:"flex",alignItems:"flex-end",justifyContent:"center",marginBottom:8}}>
                <div style={{
                  width:40,height:`${Math.max((count/maxStage)*72,4)}px`,
                  background:STAGE_COLORS[stage],opacity:.8,
                  borderRadius:"4px 4px 0 0",transition:"height .4s ease",
                  minHeight:4,
                }} />
              </div>
              <p className="mono" style={{fontSize:18,fontWeight:300,color:STAGE_COLORS[stage]}}>{count}</p>
              <p style={{fontSize:10,color:"var(--txt3)",marginTop:2,textTransform:"uppercase",letterSpacing:".04em"}}>{stage}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── EMAIL MARKETING ───────────────────────────────────────────────────────────
function EmailMarketing({isAdmin,workspaceId}:{isAdmin:boolean;workspaceId:string}) {
  const [campaigns,setCampaigns] = useState<Campaign[]>([
    {id:"1",workspace_id:workspaceId,name:"Outreach Founders Q2",subject:"[Nombre], ¿optimizaste tu prospección?",body:"Hola [Nombre],\n\nVi que estás trabajando en escalar...",status:"sent",sent_count:45,open_count:18,reply_count:6,created_at:new Date().toISOString()},
    {id:"2",workspace_id:workspaceId,name:"Follow-up Cold Leads",subject:"Última vez que te escribo, [Nombre]",body:"",status:"draft",sent_count:0,open_count:0,reply_count:0,created_at:new Date().toISOString()},
    {id:"3",workspace_id:workspaceId,name:"Re-engagement Mayo",subject:"¿Seguís buscando [beneficio]?",body:"",status:"scheduled",sent_count:0,open_count:0,reply_count:0,scheduled_at:new Date(Date.now()+86400000*2).toISOString(),created_at:new Date().toISOString()},
  ]);
  const [editing,setEditing] = useState<Campaign|null>(null);
  const [isNew,setIsNew] = useState(false);
  const toast = useToast();

  const statusStyle: Record<string,{bg:string;color:string;label:string}> = {
    draft:     {bg:"var(--surface)",color:"var(--txt2)",label:"Borrador"},
    scheduled: {bg:"var(--blue-m)",color:"var(--blue)",label:"Programada"},
    sent:      {bg:"var(--em-m)",color:"var(--emerald)",label:"Enviada"},
    paused:    {bg:"var(--red-m)",color:"var(--red)",label:"Pausada"},
  };

  function saveCampaign() {
    if (!editing) return;
    if (isNew) {
      setCampaigns(p=>[{...editing,id:uid()},... p]);
      toast("Campaña creada","ok");
    } else {
      setCampaigns(p=>p.map(c=>c.id===editing.id?editing:c));
      toast("Campaña guardada","ok");
    }
    setEditing(null);
  }

  function newCampaign() {
    setIsNew(true);
    setEditing({id:"",workspace_id:workspaceId,name:"Nueva campaña",subject:"",body:"",status:"draft",sent_count:0,open_count:0,reply_count:0,created_at:new Date().toISOString()});
  }

  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28}}>
        <div>
          <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Email Marketing</h1>
          <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Campañas y secuencias de outreach</p>
        </div>
        {isAdmin&&<button className="btn btn-primary" onClick={newCampaign}>+ Nueva campaña</button>}
      </div>

      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
        <StatCard label="Campañas activas" value={`${campaigns.filter(c=>c.status!=="draft").length}`} accent="#C9A84C" />
        <StatCard label="Total enviados" value={`${campaigns.reduce((a,c)=>a+c.sent_count,0)}`} accent="#10b981" />
        <StatCard label="Tasa apertura" value={fmtPct(campaigns.reduce((a,c)=>a+c.open_count,0),campaigns.reduce((a,c)=>a+c.sent_count,0)||1)} accent="#6366f1" />
        <StatCard label="Tasa respuesta" value={fmtPct(campaigns.reduce((a,c)=>a+c.reply_count,0),campaigns.reduce((a,c)=>a+c.sent_count,0)||1)} accent="#f59e0b" />
      </div>

      {/* Campaign list */}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {campaigns.map(c=>{
          const ss = statusStyle[c.status];
          return (
            <div key={c.id} className="glass" style={{padding:"18px 22px",display:"flex",alignItems:"center",gap:20}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                  <p style={{fontWeight:500,fontSize:14}}>{c.name}</p>
                  <span className="pill" style={{background:ss.bg,color:ss.color,border:`.5px solid ${ss.color}40`,fontSize:10}}>{ss.label}</span>
                </div>
                {c.subject&&<p style={{fontSize:12,color:"var(--txt2)",marginBottom:10}}>↳ {c.subject}</p>}
                {c.status==="sent"&&(
                  <div style={{display:"flex",gap:20}}>
                    {[
                      {l:"Enviados",v:c.sent_count,c:"var(--txt2)"},
                      {l:"Abiertos",v:`${c.open_count} (${fmtPct(c.open_count,c.sent_count)})`,c:"var(--blue)"},
                      {l:"Replies",v:`${c.reply_count} (${fmtPct(c.reply_count,c.sent_count)})`,c:"var(--emerald)"},
                    ].map(item=>(
                      <div key={item.l}>
                        <p style={{fontSize:10,color:"var(--txt3)",textTransform:"uppercase",letterSpacing:".04em"}}>{item.l}</p>
                        <p className="mono" style={{fontSize:15,fontWeight:300,color:item.c}}>{item.v}</p>
                      </div>
                    ))}
                  </div>
                )}
                {c.scheduled_at&&c.status==="scheduled"&&(
                  <p style={{fontSize:11,color:"var(--blue)"}}>⏱ Programada: {new Date(c.scheduled_at).toLocaleDateString("es-ES",{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"})}</p>
                )}
              </div>
              {isAdmin&&(
                <div style={{display:"flex",gap:8,flexShrink:0}}>
                  <button className="btn btn-ghost" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>{setIsNew(false);setEditing(c);}}>Editar</button>
                  {c.status==="draft"&&<button className="btn btn-emerald" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>{setCampaigns(p=>p.map(x=>x.id===c.id?{...x,status:"scheduled"}:x));toast("Campaña programada","ok");}}>Programar</button>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      <Modal open={!!editing} onClose={()=>setEditing(null)} title={isNew?"Nueva campaña":"Editar campaña"} width={620}>
        {editing&&(<>
          <Field label="Nombre de la campaña">
            <input className="inp" value={editing.name} onChange={e=>setEditing(p=>p?{...p,name:e.target.value}:p)} />
          </Field>
          <Field label="Asunto del email">
            <input className="inp" value={editing.subject||""} onChange={e=>setEditing(p=>p?{...p,subject:e.target.value}:p)} placeholder="Ej: [Nombre], ¿optimizaste tu prospección?" />
          </Field>
          <Field label="Cuerpo del email">
            <textarea className="inp" style={{minHeight:160,resize:"vertical",lineHeight:1.7}} value={editing.body||""} onChange={e=>setEditing(p=>p?{...p,body:e.target.value}:p)} placeholder="Usá [Nombre], [Empresa] como variables dinámicas..." />
          </Field>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
            <button className="btn btn-ghost" onClick={()=>setEditing(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={saveCampaign}>Guardar</button>
          </div>
        </>)}
      </Modal>
    </div>
  );
}

// ── CADENCIAS ─────────────────────────────────────────────────────────────────
function Cadences({isAdmin,workspaceId}:{isAdmin:boolean;workspaceId:string}) {
  const [cadences,setCadences] = useState<Cadence[]>([
    {id:"1",workspace_id:workspaceId,name:"Secuencia Founders 7D",status:"active",lead_count:12,steps:[
      {day:1,channel:"linkedin",action:"DM inicial",template:"Hola [Nombre], vi tu post sobre..."},
      {day:3,channel:"email",action:"Email seguimiento",template:"Hola [Nombre], te escribía porque..."},
      {day:5,channel:"linkedin",action:"Segundo DM",template:"[Nombre], ¿tuviste chance de ver mi mensaje?"},
      {day:7,channel:"whatsapp",action:"WhatsApp cierre",template:"Último intento — ¿le encontrás valor a esto?"},
    ]},
    {id:"2",workspace_id:workspaceId,name:"Re-engagement 3 pasos",status:"paused",lead_count:5,steps:[
      {day:1,channel:"email",action:"Email re-engagement",template:"Hace tiempo que no hablamos..."},
      {day:4,channel:"linkedin",action:"DM LinkedIn",template:"Hola, te escribía para..."},
      {day:8,channel:"email",action:"Email final",template:"Última vez que te contacto sobre esto."},
    ]},
  ]);
  const [editing,setEditing] = useState<Cadence|null>(null);
  const [newStep,setNewStep] = useState<Partial<CadenceStep>>({day:1,channel:"linkedin",action:"",template:""});
  const toast = useToast();

  const CHANNELS = [{v:"linkedin",l:"LinkedIn",icon:"🔵"},{v:"email",l:"Email",icon:"✉"},{v:"whatsapp",l:"WhatsApp",icon:"💬"},{v:"call",l:"Llamada",icon:"📞"}];

  function addStep() {
    if (!editing||!newStep.action) return;
    const step:CadenceStep = {day:newStep.day||1,channel:newStep.channel||"linkedin",action:newStep.action,template:newStep.template||""};
    setCadences(p=>p.map(c=>c.id===editing.id?{...c,steps:[...c.steps,step].sort((a,b)=>a.day-b.day)}:c));
    setEditing(p=>p?{...p,steps:[...p.steps,step].sort((a,b)=>a.day-b.day)}:p);
    setNewStep({day:(newStep.day||1)+2,channel:"email",action:"",template:""});
    toast("Paso agregado","ok");
  }

  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28}}>
        <div>
          <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Cadencias</h1>
          <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Secuencias multicanal automatizadas</p>
        </div>
        {isAdmin&&<button className="btn btn-primary" onClick={()=>{const c:Cadence={id:uid(),workspace_id:workspaceId,name:"Nueva secuencia",steps:[],status:"active",lead_count:0};setCadences(p=>[c,...p]);setEditing(c);}}>+ Nueva cadencia</button>}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {cadences.map(c=>(
          <div key={c.id} className="glass" style={{padding:"20px 24px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                  <p style={{fontWeight:500,fontSize:15}}>{c.name}</p>
                  <span className={`pill ${c.status==="active"?"pill-green":"pill-muted"}`} style={{fontSize:10}}>
                    {c.status==="active"?"● Activa":"⏸ Pausada"}
                  </span>
                </div>
                <p style={{fontSize:12,color:"var(--txt2)"}}>{c.steps.length} pasos · {c.lead_count} leads activos</p>
              </div>
              {isAdmin&&<button className="btn btn-ghost" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>setEditing(c)}>Editar</button>}
            </div>
            {/* Steps timeline */}
            <div style={{display:"flex",gap:0,overflowX:"auto",paddingBottom:4}}>
              {c.steps.map((step,i)=>{
                const ch = CHANNELS.find(x=>x.v===step.channel);
                return (
                  <div key={i} style={{display:"flex",alignItems:"center"}}>
                    <div style={{textAlign:"center",padding:"0 12px"}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:`${tempColor("Warm")}18`,border:`.5px solid var(--gold-b)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,margin:"0 auto 6px"}}>{ch?.icon}</div>
                      <p style={{fontSize:10,color:"var(--txt2)",whiteSpace:"nowrap"}}>Día {step.day}</p>
                      <p style={{fontSize:10,color:"var(--txt3)",whiteSpace:"nowrap"}}>{step.action}</p>
                    </div>
                    {i<c.steps.length-1&&<div style={{width:32,height:.5,background:"var(--gold-b)",flexShrink:0}} />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal open={!!editing} onClose={()=>setEditing(null)} title={editing?.name||""} width={660}>
        {editing&&(<>
          <Field label="Nombre de la secuencia">
            <input className="inp" value={editing.name} onChange={e=>{const n={...editing,name:e.target.value};setEditing(n);setCadences(p=>p.map(c=>c.id===editing.id?n:c));}} />
          </Field>
          <p style={{fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500,marginBottom:12}}>Pasos ({editing.steps.length})</p>
          {editing.steps.map((step,i)=>(
            <div key={i} className="glass" style={{padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:20}}>{CHANNELS.find(x=>x.v===step.channel)?.icon}</span>
              <div style={{flex:1}}>
                <p style={{fontSize:12,fontWeight:500}}>Día {step.day} — {step.action}</p>
                <p style={{fontSize:11,color:"var(--txt2)",marginTop:2}}>{step.template.slice(0,60)}{step.template.length>60?"...":""}</p>
              </div>
              <button className="btn btn-danger" style={{fontSize:11,padding:"4px 10px"}} onClick={()=>{const steps=editing.steps.filter((_,j)=>j!==i);const n={...editing,steps};setEditing(n);setCadences(p=>p.map(c=>c.id===editing.id?n:c));}}>×</button>
            </div>
          ))}
          <div className="glass" style={{padding:"16px",marginTop:12}}>
            <p style={{fontSize:11,color:"var(--txt2)",marginBottom:12,fontWeight:500,textTransform:"uppercase",letterSpacing:".06em"}}>Agregar paso</p>
            <div style={{display:"grid",gridTemplateColumns:"80px 1fr 1fr",gap:10,marginBottom:10}}>
              <Field label="Día"><input className="inp" type="number" min={1} value={newStep.day||1} onChange={e=>setNewStep(p=>({...p,day:+e.target.value}))} /></Field>
              <Field label="Canal">
                <select className="inp" value={newStep.channel} onChange={e=>setNewStep(p=>({...p,channel:e.target.value}))}>
                  {CHANNELS.map(c=><option key={c.v} value={c.v}>{c.l}</option>)}
                </select>
              </Field>
              <Field label="Acción"><input className="inp" value={newStep.action||""} onChange={e=>setNewStep(p=>({...p,action:e.target.value}))} placeholder="Ej: DM inicial" /></Field>
            </div>
            <Field label="Template del mensaje">
              <textarea className="inp" style={{minHeight:60,resize:"vertical"}} value={newStep.template||""} onChange={e=>setNewStep(p=>({...p,template:e.target.value}))} placeholder="Hola [Nombre]..." />
            </Field>
            <button className="btn btn-primary" style={{width:"100%"}} onClick={addStep} disabled={!newStep.action}>+ Agregar paso</button>
          </div>
        </>)}
      </Modal>
    </div>
  );
}

// ── KNOWLEDGE BASE ────────────────────────────────────────────────────────────
function Knowledge({isAdmin,workspaceId}:{isAdmin:boolean;workspaceId:string}) {
  const cats = ["dm_template","objection","script","resource"];
  const catLabels: Record<string,string> = {dm_template:"Templates DM",objection:"Objeciones",script:"Scripts cierre",resource:"Recursos"};
  const [items,setItems] = useState<KnowledgeItem[]>([
    {id:"1",workspace_id:workspaceId,category:"dm_template",title:"DM frío LinkedIn founders",content:"Hola [Nombre], vi que estás construyendo [Empresa]. Trabajo con founders en etapa similar para sistematizar su prospección B2B y reducir el tiempo en outreach manual. ¿Tendrías 15 min para ver si aplica a tu caso?",tags:["founder","linkedin","frio"]},
    {id:"2",workspace_id:workspaceId,category:"objection",title:"'Ahora no es buen momento'",content:"Entiendo. ¿Cuándo sería buen momento? Que sepas que el sistema se puede implementar en 48hs y el ROI se ve en la primera semana. ¿Qué semana del mes te vendría mejor?",tags:["timing","objecion"]},
    {id:"3",workspace_id:workspaceId,category:"script",title:"Script call de cierre",content:"Abrí: 'Gracias por tu tiempo [Nombre]. Hoy mi objetivo es entender bien tu situación actual y ver si realmente puedo ayudarte, no venderte.' → Diagnóstico → Demo → Precio → Cierre",tags:["call","cierre"]},
    {id:"4",workspace_id:workspaceId,category:"resource",title:"Framework BANT adaptado",content:"B: ¿Tiene presupuesto? → Preguntar cuánto invierten actualmente en prospección. A: ¿Es el decisor? → ¿Necesitás consultarlo con alguien? N: ¿El problema existe? → ¿Cuántos DMs manuales mandás por semana? T: ¿Cuándo? → ¿Si encontrás la solución, lo implementarías este mes?",tags:["bant","calificacion"]},
  ]);
  const [activeCategory,setActiveCategory] = useState("dm_template");
  const [editing,setEditing] = useState<KnowledgeItem|null>(null);
  const [isNew,setIsNew] = useState(false);
  const [search,setSearch] = useState("");
  const toast = useToast();

  const filtered = items.filter(i=>i.category===activeCategory&&(search===""||i.title.toLowerCase().includes(search.toLowerCase())||i.content.toLowerCase().includes(search.toLowerCase())));

  function save() {
    if (!editing) return;
    if (isNew) setItems(p=>[{...editing,id:uid()},...p]);
    else setItems(p=>p.map(x=>x.id===editing.id?editing:x));
    toast(isNew?"Ítem creado":"Guardado","ok");
    setEditing(null);
  }

  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24}}>
        <div>
          <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Base de Conocimiento</h1>
          <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Templates, scripts y recursos del equipo</p>
        </div>
        {isAdmin&&<button className="btn btn-primary" onClick={()=>{setIsNew(true);setEditing({id:"",workspace_id:workspaceId,category:activeCategory,title:"",content:"",tags:[]});}}>+ Agregar</button>}
      </div>

      <div style={{display:"flex",gap:16,marginBottom:20}}>
        <div className="tab-bar" style={{flex:"none"}}>
          {cats.map(c=><button key={c} className={`tab-btn ${activeCategory===c?"active":""}`} onClick={()=>setActiveCategory(c)}>{catLabels[c]}</button>)}
        </div>
        <input className="inp" style={{maxWidth:280}} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." />
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
        {filtered.map(item=>(
          <div key={item.id} className="glass" style={{padding:"18px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <p style={{fontWeight:500,fontSize:13,lineHeight:1.3,flex:1}}>{item.title}</p>
              {isAdmin&&<button className="btn btn-ghost" style={{fontSize:11,padding:"3px 8px",marginLeft:8,flexShrink:0}} onClick={()=>{setIsNew(false);setEditing(item);}}>Editar</button>}
            </div>
            <p style={{fontSize:12,color:"var(--txt2)",lineHeight:1.7,marginBottom:12}}>{item.content.slice(0,140)}{item.content.length>140?"...":""}</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {item.tags?.map(tag=><span key={tag} className="pill pill-muted" style={{fontSize:10}}>#{tag}</span>)}
            </div>
            <button className="btn btn-ghost" style={{width:"100%",marginTop:12,fontSize:12}} onClick={()=>{navigator.clipboard.writeText(item.content);toast("Copiado","ok");}}>Copiar texto</button>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={()=>setEditing(null)} title={isNew?"Nuevo ítem":"Editar ítem"}>
        {editing&&(<>
          <Field label="Título"><input className="inp" value={editing.title} onChange={e=>setEditing(p=>p?{...p,title:e.target.value}:p)} /></Field>
          <Field label="Categoría">
            <select className="inp" value={editing.category} onChange={e=>setEditing(p=>p?{...p,category:e.target.value}:p)}>
              {cats.map(c=><option key={c} value={c}>{catLabels[c]}</option>)}
            </select>
          </Field>
          <Field label="Contenido">
            <textarea className="inp" style={{minHeight:140,resize:"vertical",lineHeight:1.7}} value={editing.content} onChange={e=>setEditing(p=>p?{...p,content:e.target.value}:p)} />
          </Field>
          <Field label="Tags (separados por coma)">
            <input className="inp" value={editing.tags?.join(",")||""} onChange={e=>setEditing(p=>p?{...p,tags:e.target.value.split(",").map(t=>t.trim()).filter(Boolean)}:p)} placeholder="founder, linkedin, frio" />
          </Field>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
            <button className="btn btn-ghost" onClick={()=>setEditing(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={save} disabled={!editing.title||!editing.content}>Guardar</button>
          </div>
        </>)}
      </Modal>
    </div>
  );
}

// ── TEAM MANAGEMENT ───────────────────────────────────────────────────────────
function TeamManagement({workspace,members,onInvite}:{workspace:Workspace;members:Member[];onInvite:(email:string,role:"admin"|"member")=>void}) {
  const [inviteEmail,setInviteEmail] = useState("");
  const [inviteRole,setInviteRole] = useState<"admin"|"member">("member");
  const toast = useToast();

  function handleInvite() {
    if (!inviteEmail.includes("@")) return;
    onInvite(inviteEmail,inviteRole);
    setInviteEmail("");
    toast(`Invitación enviada a ${inviteEmail}`,"ok");
  }

  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{marginBottom:28}}>
        <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Equipo</h1>
        <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Workspace: <span style={{color:"var(--gold)"}}>{workspace.name}</span></p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,maxWidth:800}}>
        <div>
          <p style={{fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500,marginBottom:14}}>Miembros activos ({members.length})</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {members.map((m,i)=>(
              <div key={m.id} className="glass" style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:m.role==="admin"?"var(--gold-m)":"var(--surface)",border:`.5px solid ${m.role==="admin"?"var(--gold-b)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:m.role==="admin"?"var(--gold)":"var(--txt2)",flexShrink:0}}>
                  {(m.display_name||"U")[0].toUpperCase()}
                </div>
                <div style={{flex:1}}>
                  <p style={{fontSize:13,fontWeight:500}}>{m.display_name||"Usuario"}</p>
                  <p style={{fontSize:11,color:"var(--txt2)",marginTop:1}}>user_id: {m.user_id.slice(0,12)}...</p>
                </div>
                <span className={`pill ${m.role==="admin"?"pill-gold":"pill-muted"}`} style={{fontSize:10}}>
                  {m.role==="admin"?"Admin":"Miembro"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p style={{fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500,marginBottom:14}}>Invitar nuevo miembro</p>
          <div className="glass" style={{padding:"20px 20px"}}>
            <Field label="Email">
              <input className="inp" type="email" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} placeholder="email@ejemplo.com" />
            </Field>
            <Field label="Rol">
              <div style={{display:"flex",gap:8}}>
                {(["member","admin"] as const).map(r=>(
                  <button key={r} className={`btn ${inviteRole===r?"btn-primary":"btn-ghost"}`} style={{flex:1,fontSize:12}} onClick={()=>setInviteRole(r)}>
                    {r==="admin"?"Admin":"Miembro"}
                  </button>
                ))}
              </div>
            </Field>
            <div className="glass" style={{padding:"10px 12px",marginBottom:14,border:".5px solid rgba(96,165,250,.2)"}}>
              <p style={{fontSize:11,color:"var(--blue)",lineHeight:1.6}}>
                {inviteRole==="admin"?"⚠ Admin puede ver y editar API Keys, gestionar el equipo y todas las campañas.":"✓ Miembro puede gestionar leads y usar todas las herramientas. No ve las API Keys."}
              </p>
            </div>
            <button className="btn btn-primary" style={{width:"100%"}} onClick={handleInvite} disabled={!inviteEmail.includes("@")}>
              Enviar invitación
            </button>
          </div>

          <div className="glass" style={{padding:"16px",marginTop:16,border:".5px solid var(--gold-b)"}}>
            <p style={{fontSize:12,fontWeight:500,marginBottom:8}}>Política de acceso</p>
            {[
              {icon:"✦",text:"Admin — ve y edita todo, incluyendo API Keys"},
              {icon:"◈",text:"Miembro — gestiona leads, no ve API Keys"},
              {icon:"◆",text:"Las API Keys nunca se muestran en texto plano a miembros"},
              {icon:"◐",text:"Cada workspace es independiente y aislado"},
            ].map((item,i)=>(
              <p key={i} style={{fontSize:11,color:"var(--txt2)",marginBottom:6,lineHeight:1.5}}>
                <span style={{color:"var(--gold)"}}>{item.icon}</span> {item.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── API KEYS SETTINGS (solo admin) ───────────────────────────────────────────
function ApiSettings({workspaceId}:{workspaceId:string}) {
  const [keys,setKeys] = useState<Record<string,string>>({});
  const [visible,setVisible] = useState<Record<string,boolean>>({});
  const [saving,setSaving] = useState<string|null>(null);
  const toast = useToast();

  // Load from localStorage (en producción cargar de Supabase)
  useEffect(()=>{
    const saved = localStorage.getItem(`closer_apikeys_${workspaceId}`);
    if (saved) setKeys(JSON.parse(saved));
  },[workspaceId]);

  async function saveKey(service:string) {
    setSaving(service);
    await new Promise(r=>setTimeout(r,500));
    const updated = {...keys};
    localStorage.setItem(`closer_apikeys_${workspaceId}`,JSON.stringify(updated));
    // En producción: await supabase.from("api_keys").upsert({workspace_id,service,key_value:encrypt(keys[service])})
    setSaving(null);
    toast(`API Key de ${service} guardada`,"ok");
  }

  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{marginBottom:28}}>
        <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>API Keys</h1>
        <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Solo visible para administradores del workspace</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))",gap:16,maxWidth:900}}>
        {API_SERVICES.map(svc=>(
          <div key={svc.key} className="glass glass-gold" style={{padding:"20px 22px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div>
                <p style={{fontWeight:500,fontSize:14}}>{svc.label}</p>
                <p style={{fontSize:11,color:"var(--txt2)",marginTop:2}}>{svc.desc}</p>
              </div>
              {keys[svc.key]&&<span className="pill pill-green" style={{fontSize:10}}>● Configurada</span>}
            </div>
            <div style={{display:"flex",gap:8}}>
              <div style={{flex:1,position:"relative"}}>
                <input
                  className="inp"
                  type={visible[svc.key]?"text":"password"}
                  value={keys[svc.key]||""}
                  onChange={e=>setKeys(p=>({...p,[svc.key]:e.target.value}))}
                  placeholder={svc.placeholder}
                  style={{paddingRight:40}}
                />
                <button
                  onClick={()=>setVisible(p=>({...p,[svc.key]:!p[svc.key]}))}
                  style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--txt3)",cursor:"pointer",fontSize:14}}
                >
                  {visible[svc.key]?"●":"○"}
                </button>
              </div>
              <button
                className="btn btn-primary"
                style={{flexShrink:0,padding:"0 16px"}}
                onClick={()=>saveKey(svc.key)}
                disabled={!keys[svc.key]||saving===svc.key}
              >
                {saving===svc.key?<Spinner/>:"Guardar"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass" style={{maxWidth:900,padding:"16px 20px",marginTop:20,border:".5px solid rgba(96,165,250,.2)"}}>
        <p style={{fontSize:12,color:"var(--blue)",lineHeight:1.7}}>
          🔐 Las API Keys se guardan de forma segura y nunca son visibles para los miembros del equipo. En producción se encriptan con pgcrypto antes de almacenarse en Supabase.
        </p>
      </div>
    </div>
  );
}

// ── REMAINING VIEWS (Dashboard, Pipeline, etc.) ───────────────────────────────
function Dashboard({leads}:{leads:Lead[]}) {
  const warm=leads.filter(l=>l.temp!=="Frío");
  const today=leads.filter(l=>l.next_action);
  const avg=leads.length?(leads.reduce((a,b)=>a+b.score,0)/leads.length).toFixed(1):"0";
  return (
    <div className="fade-up" style={{padding:"32px 36px",overflowY:"auto",height:"100%"}}>
      <div style={{marginBottom:32}}>
        <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em",lineHeight:1.1}}>Dashboard</h1>
        <p style={{fontSize:13,color:"var(--txt2)",marginTop:6}}>{new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"})}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,marginBottom:36}}>
        <StatCard label="Leads Warm" value={`${warm.length}`} sub={`de ${leads.length} totales`} accent="#C9A84C" />
        <StatCard label="Score Promedio" value={avg} sub="BANT estimado" accent="#10b981" />
        <StatCard label="Acción Hoy" value={`${today.length}`} sub="leads pendientes" accent="#6366f1" />
        <StatCard label="Pipeline Activo" value={`${leads.filter(l=>l.stage!=="Cerrado").length}`} sub="en proceso" accent="#f59e0b" />
      </div>
      <div style={{marginBottom:28}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h2 style={{fontSize:12,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)"}}>Misión del día</h2>
          <span className="pill pill-gold">{today.length} pendientes</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
          {today.slice(0,4).map(lead=>(
            <div key={lead.id} className="glass" style={{padding:"16px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <p style={{fontWeight:500,fontSize:13}}>{lead.name}</p>
                <span className="pill" style={{background:`${tempColor(lead.temp)}18`,color:tempColor(lead.temp),border:`.5px solid ${tempColor(lead.temp)}35`,fontSize:10}}>{lead.temp}</span>
              </div>
              <p style={{fontSize:11,color:"var(--txt2)",marginBottom:10}}>{lead.role}</p>
              <ScoreBar score={lead.score} />
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                <span style={{fontSize:11,color:"var(--txt3)"}}>{lead.next_action}</span>
                <span className="mono" style={{fontSize:16,fontWeight:300,color:scoreColor(lead.score)}}>{lead.score}/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass" style={{padding:"18px 22px"}}>
        <p style={{fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500,marginBottom:14}}>Flujo de trabajo</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {["Capturar leads","Escribir mensaje","Registrar respuesta","Mover en pipeline","Cerrar deal"].map((s,i)=>(
            <span key={i} className="btn btn-ghost" style={{fontSize:12,padding:"6px 14px"}}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pipeline({leads,onLeadClick}:{leads:Lead[];onLeadClick:(l:Lead)=>void}) {
  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowX:"auto"}}>
      <div style={{marginBottom:24}}>
        <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>CRM Pipeline</h1>
        <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>{leads.length} leads en seguimiento</p>
      </div>
      <div style={{display:"flex",gap:16,minWidth:"max-content",paddingBottom:24}}>
        {STAGES.map(stage=>{
          const col=leads.filter(l=>l.stage===stage);
          return (
            <div key={stage} style={{width:240}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:STAGE_COLORS[stage],display:"inline-block"}} />
                  <span style={{fontSize:12,fontWeight:600,color:"var(--txt2)",letterSpacing:".04em",textTransform:"uppercase"}}>{stage}</span>
                </div>
                <span className="pill pill-muted">{col.length}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10,minHeight:200}}>
                {col.map(lead=><LeadCard key={lead.id} lead={lead} onClick={()=>onLeadClick(lead)} />)}
                {col.length===0&&<div style={{border:".5px dashed var(--border)",borderRadius:"var(--radius)",padding:"24px 16px",textAlign:"center"}}><p style={{fontSize:12,color:"var(--txt3)"}}>Sin leads</p></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VistaCloser({leads,onLeadClick}:{leads:Lead[];onLeadClick:(l:Lead)=>void}) {
  const sorted=[...leads].sort((a,b)=>b.score-a.score);
  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{marginBottom:28}}>
        <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Vista Closer</h1>
        <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Top opportunities priorizadas por score</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12,maxWidth:680}}>
        {sorted.map((lead,i)=>(
          <div key={lead.id} className="glass lead-card" onClick={()=>onLeadClick(lead)} style={{padding:"18px 22px",display:"flex",alignItems:"center",gap:20}}>
            <span className="mono" style={{fontSize:22,fontWeight:300,color:"var(--txt3)",width:28,textAlign:"right",flexShrink:0}}>{i+1}</span>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div>
                  <p style={{fontWeight:500,fontSize:14}}>{lead.name}</p>
                  <p style={{fontSize:12,color:"var(--txt2)",marginTop:2}}>{lead.role}{lead.company?` · ${lead.company}`:""}</p>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span className="pill" style={{background:`${tempColor(lead.temp)}18`,color:tempColor(lead.temp),border:`.5px solid ${tempColor(lead.temp)}35`,fontSize:10}}>{lead.temp}</span>
                  <span className="pill pill-muted" style={{fontSize:10}}>{lead.stage}</span>
                </div>
              </div>
              <ScoreBar score={lead.score} />
            </div>
            <span className="mono" style={{fontSize:28,fontWeight:300,color:scoreColor(lead.score),flexShrink:0}}>{lead.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RedaccionIA({leads}:{leads:Lead[]}) {
  const [sel,setSel]=useState<Lead|null>(null);
  const [tone,setTone]=useState<"directo"|"empático"|"vsl">("directo");
  const [msg,setMsg]=useState("");
  const [loading,setLoading]=useState(false);
  const toast=useToast();
  async function gen(){
    if(!sel)return;setLoading(true);await new Promise(r=>setTimeout(r,800));
    const t={directo:`Hola ${sel.name}, vi tu perfil como ${sel.role} y quería conectar. Trabajo con perfiles como el tuyo optimizando el sistema de prospección B2B. ¿Tendrías 15 min esta semana?`,empático:`Hola ${sel.name} 👋 Analizando tu trabajo como ${sel.role} — creo que un sistema de outreach bien armado podría cambiar tu ritmo de crecimiento. ¿Charlamos?`,vsl:`${sel.name}, preparé un video corto (3 min) específico para vos como ${sel.role}. Explica cómo cerrar más deals sin prospectar manualmente. ¿Te lo mando?`};
    setMsg(t[tone]);setLoading(false);
  }
  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{marginBottom:28}}><h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Redacción IA</h1><p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Generá mensajes personalizados</p></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,maxWidth:840}}>
        <div>
          <Field label="Lead"><select className="inp" value={sel?.id||""} onChange={e=>setSel(leads.find(l=>l.id===e.target.value)||null)} style={{background:"var(--bg2)"}}><option value="">— Elegí un lead —</option>{leads.map(l=><option key={l.id} value={l.id}>{l.name} · {l.role}</option>)}</select></Field>
          {sel&&<div className="glass" style={{padding:"16px 18px",marginBottom:16}}><p style={{fontWeight:500,marginBottom:4}}>{sel.name}</p><p style={{fontSize:12,color:"var(--txt2)",marginBottom:10}}>{sel.role}{sel.company?` · ${sel.company}`:""}</p><ScoreBar score={sel.score} /></div>}
          <Field label="Tono"><div style={{display:"flex",gap:8}}>{(["directo","empático","vsl"] as const).map(t=><button key={t} className={`btn ${tone===t?"btn-primary":"btn-ghost"}`} style={{flex:1,fontSize:12,padding:"7px 10px",textTransform:"capitalize"}} onClick={()=>setTone(t)}>{t}</button>)}</div></Field>
          <button className="btn btn-primary" style={{width:"100%",marginTop:4}} onClick={gen} disabled={!sel||loading}>{loading?"Generando...":"✦ Generar mensaje"}</button>
        </div>
        <div>
          <Field label="Mensaje generado"><textarea className="inp" style={{minHeight:200,resize:"vertical",lineHeight:1.6}} value={msg} onChange={e=>setMsg(e.target.value)} placeholder="El mensaje aparecerá aquí..." /></Field>
          {msg&&<div style={{display:"flex",gap:8}}><button className="btn btn-ghost" style={{flex:1,fontSize:12}} onClick={()=>{navigator.clipboard.writeText(msg);toast("Copiado","ok");}}>Copiar</button><button className="btn btn-ghost" style={{flex:1,fontSize:12}} onClick={gen}>Regenerar</button></div>}
        </div>
      </div>
    </div>
  );
}

function Inbox({leads}:{leads:Lead[]}) {
  const [sel,setSel]=useState<string|null>(null);
  const [resp,setResp]=useState("");
  const [analysis,setAnalysis]=useState("");
  const [loading,setLoading]=useState(false);
  const toast=useToast();
  async function analyze(){if(!resp)return;setLoading(true);await new Promise(r=>setTimeout(r,700));setAnalysis("🟢 POSITIVO — Lead interesado. Acción recomendada: agendar call en 24h. Score: +1. Probabilidad cierre: alta.");setLoading(false);}
  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{marginBottom:28}}><h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Inbox</h1><p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Analizá respuestas con IA</p></div>
      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:20,maxWidth:800}}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>{leads.slice(0,6).map(l=><div key={l.id} className={`glass ${sel===l.id?"glass-gold":""}`} style={{padding:"12px 14px",cursor:"pointer"}} onClick={()=>setSel(l.id)}><p style={{fontWeight:500,fontSize:13}}>{l.name}</p><p style={{fontSize:11,color:"var(--txt2)",marginTop:2}}>{l.role}</p></div>)}</div>
        <div>
          <Field label="Pegar respuesta del lead"><textarea className="inp" style={{minHeight:140,resize:"vertical",lineHeight:1.6}} value={resp} onChange={e=>setResp(e.target.value)} placeholder="Pegá aquí la respuesta recibida..." /></Field>
          <button className="btn btn-primary" onClick={analyze} disabled={!resp||loading} style={{marginBottom:16}}>{loading?"Analizando...":"✦ Analizar con IA"}</button>
          {analysis&&<div className="glass glass-gold" style={{padding:"16px 18px"}}><p style={{fontSize:13,lineHeight:1.7}}>{analysis}</p></div>}
        </div>
      </div>
    </div>
  );
}

function QualifyGate({leads,onScoreUpdate}:{leads:Lead[];onScoreUpdate:(id:string,score:number)=>void}) {
  const [sel,setSel]=useState<Lead|null>(null);
  const [ans,setAns]=useState({budget:"",authority:"",need:"",timeline:""});
  const qs=[{k:"budget",l:"¿Tiene presupuesto?",opts:["No sabe","< $500/mes","$500-2k/mes","> $2k/mes"]},{k:"authority",l:"¿Es el decisor?",opts:["No","Influenciador","Co-decisor","Decisor único"]},{k:"need",l:"¿Urgencia del problema?",opts:["Baja","Media","Alta","Crítica"]},{k:"timeline",l:"¿Cuándo necesita solución?",opts:["> 6 meses","3-6 meses","1-3 meses","Ahora"]}] as const;
  const vals=Object.values(ans);
  const score=vals.some(v=>!v)?null:Math.round(vals.reduce((s,v)=>s+(["No sabe","No","Baja","> 6 meses"].includes(v)?2:["< $500/mes","Influenciador","Media","3-6 meses"].includes(v)?5:["$500-2k/mes","Co-decisor","Alta","1-3 meses"].includes(v)?8:10),0)/4*10)/10;
  const toast=useToast();
  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{marginBottom:28}}><h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Qualify Gate</h1><p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Calificación BANT interactiva</p></div>
      <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:20,maxWidth:760}}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>{leads.map(l=><div key={l.id} className={`glass ${sel?.id===l.id?"glass-gold":""}`} style={{padding:"12px 14px",cursor:"pointer"}} onClick={()=>setSel(l)}><p style={{fontWeight:500,fontSize:12}}>{l.name}</p><ScoreBar score={l.score} /></div>)}</div>
        <div>
          {qs.map(q=><Field key={q.k} label={q.l}><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{q.opts.map(opt=><button key={opt} className={`btn ${(ans as any)[q.k]===opt?"btn-primary":"btn-ghost"}`} style={{fontSize:12,padding:"6px 12px"}} onClick={()=>setAns(p=>({...p,[q.k]:opt}))}>{opt}</button>)}</div></Field>)}
          {score!==null&&<div className="glass glass-gold" style={{padding:"20px 22px",marginTop:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><p style={{fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:4}}>Score BANT</p><p className="display" style={{fontSize:42,fontWeight:300,color:scoreColor(score)}}>{score}<span style={{fontSize:20,color:"var(--txt2)"}}>/10</span></p></div>
              {sel&&<button className="btn btn-primary" onClick={()=>{onScoreUpdate(sel.id,Math.round(score));toast(`Score de ${sel.name} actualizado a ${Math.round(score)}`,"ok");}}>Actualizar score</button>}
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

function Prospector({onAddLead}:{onAddLead:(l:Lead)=>void}) {
  const [url,setUrl]=useState("");const [loading,setLoading]=useState(false);const [results,setResults]=useState<Lead[]>([]);
  const toast=useToast();
  async function extract(){if(!url)return;setLoading(true);await new Promise(r=>setTimeout(r,1200));
    const demo:Lead[]=[{id:uid(),workspace_id:"",name:"Valentina Mier",role:"CEO",company:"StartupBA",score:8,temp:"Warm",stage:"Nuevo",source:"apify",created_at:new Date().toISOString()},{id:uid(),workspace_id:"",name:"Marcos Reyes",role:"CMO",company:"Scale Co",score:7,temp:"Warm",stage:"Nuevo",source:"apify",created_at:new Date().toISOString()},{id:uid(),workspace_id:"",name:"Andrea Font",role:"Founder",company:"EduTech",score:9,temp:"Hot",stage:"Nuevo",source:"apify",created_at:new Date().toISOString()}];
    setResults(demo);setLoading(false);toast(`${demo.length} leads extraídos`,"ok");
  }
  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{marginBottom:28}}><h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Prospector</h1><p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Extraé leads de posts LinkedIn via Apify</p></div>
      <div style={{maxWidth:640}}>
        <Field label="URL del post"><div style={{display:"flex",gap:10}}><input className="inp" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://linkedin.com/posts/..." /><button className="btn btn-primary" onClick={extract} disabled={loading||!url}>{loading?"Extrayendo...":"Extraer"}</button></div></Field>
        {results.length>0&&<div style={{marginTop:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><p style={{fontSize:12,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:600}}>Leads encontrados</p><span className="pill pill-gold">{results.length}</span></div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {results.map(lead=>(
              <div key={lead.id} className="glass" style={{padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><p style={{fontWeight:500,fontSize:13}}>{lead.name}</p><p style={{fontSize:12,color:"var(--txt2)",marginTop:2}}>{lead.role} · {lead.company}</p></div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}><span className="mono" style={{fontSize:18,fontWeight:300,color:scoreColor(lead.score)}}>{lead.score}</span><button className="btn btn-ghost" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>{onAddLead(lead);toast(`${lead.name} agregado`,"ok");}}>+ Agregar</button></div>
              </div>
            ))}
          </div>
        </div>}
      </div>
    </div>
  );
}

// ── LEAD DETAIL & ADD MODALS ──────────────────────────────────────────────────
function LeadDetail({lead,onClose,onUpdate}:{lead:Lead;onClose:()=>void;onUpdate:(l:Lead)=>void}) {
  const [l,setL]=useState(lead);const toast=useToast();
  return (
    <Modal open title={l.name} onClose={onClose}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <Field label="Nombre"><input className="inp" value={l.name} onChange={e=>setL(p=>({...p,name:e.target.value}))} /></Field>
        <Field label="Rol"><input className="inp" value={l.role} onChange={e=>setL(p=>({...p,role:e.target.value}))} /></Field>
        <Field label="Empresa"><input className="inp" value={l.company||""} onChange={e=>setL(p=>({...p,company:e.target.value}))} /></Field>
        <Field label="Temperatura"><select className="inp" value={l.temp} onChange={e=>setL(p=>({...p,temp:e.target.value as Lead["temp"]}))}><option>Warm</option><option>Hot</option><option>Frío</option></select></Field>
        <Field label="Etapa"><select className="inp" value={l.stage} onChange={e=>setL(p=>({...p,stage:e.target.value}))}>{STAGES.map(s=><option key={s}>{s}</option>)}</select></Field>
        <Field label="Score (1-10)"><input className="inp" type="number" min={1} max={10} value={l.score} onChange={e=>setL(p=>({...p,score:+e.target.value}))} /></Field>
      </div>
      <Field label="LinkedIn URL"><input className="inp" value={l.linkedin_url||""} onChange={e=>setL(p=>({...p,linkedin_url:e.target.value}))} placeholder="https://linkedin.com/in/..." /></Field>
      <Field label="Próxima acción"><input className="inp" value={l.next_action||""} onChange={e=>setL(p=>({...p,next_action:e.target.value}))} /></Field>
      <Field label="Notas"><textarea className="inp" style={{minHeight:80,resize:"vertical"}} value={l.notes||""} onChange={e=>setL(p=>({...p,notes:e.target.value}))} /></Field>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={()=>{onUpdate(l);toast("Lead actualizado","ok");onClose();}}>Guardar</button>
      </div>
    </Modal>
  );
}

function AddLeadModal({open,onClose,onAdd}:{open:boolean;onClose:()=>void;onAdd:(l:Lead)=>void}) {
  const [f,setF]=useState({name:"",role:"",company:"",score:7,temp:"Warm" as Lead["temp"],stage:"Nuevo",next_action:""});
  const toast=useToast();
  function sub(){if(!f.name||!f.role)return;onAdd({...f,id:uid(),workspace_id:"",source:"manual",created_at:new Date().toISOString()});toast(`${f.name} agregado`,"ok");onClose();setF({name:"",role:"",company:"",score:7,temp:"Warm",stage:"Nuevo",next_action:""});}
  return (
    <Modal open={open} onClose={onClose} title="Nuevo lead">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Field label="Nombre *"><input className="inp" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))} placeholder="Ej: María García" /></Field>
        <Field label="Rol *"><input className="inp" value={f.role} onChange={e=>setF(p=>({...p,role:e.target.value}))} placeholder="CEO, Founder..." /></Field>
        <Field label="Empresa"><input className="inp" value={f.company} onChange={e=>setF(p=>({...p,company:e.target.value}))} /></Field>
        <Field label="Temperatura"><select className="inp" value={f.temp} onChange={e=>setF(p=>({...p,temp:e.target.value as Lead["temp"]}))}><option>Warm</option><option>Hot</option><option>Frío</option></select></Field>
        <Field label="Score"><input className="inp" type="number" min={1} max={10} value={f.score} onChange={e=>setF(p=>({...p,score:+e.target.value}))} /></Field>
        <Field label="Etapa"><select className="inp" value={f.stage} onChange={e=>setF(p=>({...p,stage:e.target.value}))}>{STAGES.map(s=><option key={s}>{s}</option>)}</select></Field>
      </div>
      <Field label="Próxima acción"><input className="inp" value={f.next_action} onChange={e=>setF(p=>({...p,next_action:e.target.value}))} placeholder="Ej: Enviar DM LinkedIn" /></Field>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" onClick={sub} disabled={!f.name||!f.role}>Agregar lead</button>
      </div>
    </Modal>
  );
}

// ── AUTH SCREEN ───────────────────────────────────────────────────────────────
function AuthScreen({onAuth}:{onAuth:(u:User,m:Member,w:Workspace)=>void}) {
  const [mode,setMode]=useState<"login"|"register">("login");
  const [email,setEmail]=useState("");const [pass,setPass]=useState("");
  const [wsName,setWsName]=useState("");const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const toast=useToast();

  async function handleAuth() {
    setLoading(true);setError("");
    try {
      if (mode==="login") {
        const {data,error:e}=await supabase.auth.signInWithPassword({email,password:pass});
        if(e)throw e;
        if(data.user){
          // Get member + workspace
          const {data:mData}=await supabase.from("workspace_members").select("*,workspaces(*)").eq("user_id",data.user.id).single();
          if(mData){
            const m:Member={id:mData.id,workspace_id:mData.workspace_id,user_id:mData.user_id,role:mData.role,display_name:mData.display_name};
            const w:Workspace=mData.workspaces as Workspace;
            onAuth(data.user,m,w);
          }
        }
      } else {
        const {data,error:e}=await supabase.auth.signUp({email,password:pass});
        if(e)throw e;
        if(data.user){
          const slug=wsName.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
          const {data:wData}=await supabase.from("workspaces").insert({name:wsName,slug,owner_id:data.user.id}).select().single();
          if(wData){
            const {data:mData}=await supabase.from("workspace_members").select("*").eq("workspace_id",wData.id).eq("user_id",data.user.id).single();
            if(mData){
              await supabase.from("workspace_members").update({display_name:email.split("@")[0]}).eq("id",mData.id);
              onAuth(data.user,{...mData,display_name:email.split("@")[0]},wData as Workspace);
            }
          }
        }
      }
    } catch(e:any){setError(e.message||"Error de autenticación")}
    setLoading(false);
  }

  // Demo mode (sin Supabase configurado)
  function demoMode() {
    const fakeUser={id:"demo-user",email:"demo@closerAI.app"} as User;
    const fakeM:Member={id:"m1",workspace_id:"ws1",user_id:"demo-user",role:"admin",display_name:"Ornella Olmos"};
    const fakeW:Workspace={id:"ws1",name:"ComUni · Dev Remoto USD",slug:"comuni",owner_id:"demo-user"};
    onAuth(fakeUser,fakeM,fakeW);
  }

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)",backgroundImage:"radial-gradient(ellipse 60% 40% at 50% 0%,rgba(201,168,76,0.06) 0%,transparent 70%)"}}>
      <div style={{maxWidth:420,width:"100%",padding:24}}>
        <div style={{textAlign:"center",marginBottom:44}}>
          <p className="display" style={{fontSize:48,fontWeight:300,letterSpacing:"-0.02em"}}>Closer<span style={{color:"var(--gold)"}}>AI</span></p>
          <p style={{fontSize:12,color:"var(--txt3)",marginTop:6,letterSpacing:".1em",textTransform:"uppercase"}}>B2B Engine · v4</p>
        </div>
        <div className="tab-bar" style={{marginBottom:24}}>
          <button className={`tab-btn ${mode==="login"?"active":""}`} onClick={()=>setMode("login")}>Iniciar sesión</button>
          <button className={`tab-btn ${mode==="register"?"active":""}`} onClick={()=>setMode("register")}>Crear cuenta</button>
        </div>
        <div className="glass" style={{padding:"28px 26px",border:".5px solid var(--gold-b)"}}>
          {mode==="register"&&<Field label="Nombre del workspace"><input className="inp" value={wsName} onChange={e=>setWsName(e.target.value)} placeholder="Ej: ComUni · Dev Remoto" /></Field>}
          <Field label="Email"><input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" onKeyDown={e=>e.key==="Enter"&&handleAuth()} /></Field>
          <Field label="Contraseña"><input className="inp" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleAuth()} /></Field>
          {error&&<p style={{fontSize:12,color:"var(--red)",marginBottom:12,padding:"8px 12px",background:"var(--red-m)",borderRadius:"var(--radius-sm)"}}>{error}</p>}
          <button className="btn btn-primary" style={{width:"100%",padding:"11px",marginBottom:10}} onClick={handleAuth} disabled={loading||!email||!pass||(mode==="register"&&!wsName)}>
            {loading?<Spinner/>:mode==="login"?"Entrar":"Crear workspace"}
          </button>
          <div style={{height:.5,background:"var(--border)",margin:"14px 0"}} />
          <button className="btn btn-ghost" style={{width:"100%",fontSize:12}} onClick={demoMode}>
            Modo demo (sin Supabase)
          </button>
        </div>
        <p style={{textAlign:"center",fontSize:11,color:"var(--txt3)",marginTop:16}}>
          {SUPA_URL?"Conectado a Supabase ✓":"⚠ Configurá VITE_SUPABASE_URL para auth real"}
        </p>
      </div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({active,onChange,appUser,leadsCount,workspaces,onWorkspaceChange}:{
  active:string;onChange:(id:string)=>void;appUser:AppUser;leadsCount:number;
  workspaces:Workspace[];onWorkspaceChange:(w:Workspace)=>void;
}) {
  const isAdmin=appUser.member.role==="admin";
  const navItems=NAV.filter(n=>!("adminOnly" in n&&n.adminOnly)||isAdmin);
  return (
    <aside style={{width:"var(--sidebar-w)",minHeight:"100vh",flexShrink:0,background:"rgba(6,8,14,0.97)",borderRight:".5px solid var(--border)",display:"flex",flexDirection:"column",backdropFilter:"blur(20px)"}}>
      <div style={{padding:"24px 20px 16px",borderBottom:".5px solid var(--border)"}}>
        <p className="display" style={{fontSize:22,fontWeight:300,letterSpacing:"-0.01em",lineHeight:1}}>Closer<span style={{color:"var(--gold)"}}>AI</span></p>
        <p style={{fontSize:10,color:"var(--txt3)",marginTop:4,letterSpacing:".1em",textTransform:"uppercase"}}>v4 · B2B Engine</p>
      </div>

      {/* Workspace switcher */}
      <div style={{padding:"12px 14px",borderBottom:".5px solid var(--border)"}}>
        <p style={{fontSize:9,letterSpacing:".08em",textTransform:"uppercase",color:"var(--txt3)",marginBottom:6,fontWeight:500}}>Workspace</p>
        {workspaces.length>1?(
          <select className="inp" style={{padding:"6px 10px",fontSize:12}} value={appUser.workspace.id} onChange={e=>{const w=workspaces.find(x=>x.id===e.target.value);if(w)onWorkspaceChange(w);}}>
            {workspaces.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        ):(
          <p style={{fontSize:12,fontWeight:500,color:"var(--txt)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{appUser.workspace.name}</p>
        )}
      </div>

      {/* User */}
      <div style={{padding:"12px 14px",borderBottom:".5px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,borderRadius:"50%",background:isAdmin?"var(--gold-m)":"var(--surface)",border:`.5px solid ${isAdmin?"var(--gold-b)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:isAdmin?"var(--gold)":"var(--txt2)",flexShrink:0}}>
          {(appUser.member.display_name||appUser.supabaseUser.email||"U")[0].toUpperCase()}
        </div>
        <div style={{overflow:"hidden",flex:1}}>
          <p style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{appUser.member.display_name||appUser.supabaseUser.email}</p>
          <span className={`pill ${isAdmin?"pill-gold":"pill-muted"}`} style={{fontSize:9,marginTop:2}}>{isAdmin?"Admin":"Miembro"}</span>
        </div>
      </div>

      <nav style={{flex:1,padding:"10px 10px",overflowY:"auto"}}>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          {navItems.map(item=>(
            <div key={item.id} className={`nav-item ${active===item.id?"active":""}`} onClick={()=>onChange(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {"adminOnly" in item&&item.adminOnly&&<span style={{marginLeft:"auto",fontSize:9,color:"var(--gold)",opacity:.7}}>admin</span>}
            </div>
          ))}
        </div>
      </nav>

      <div style={{padding:"12px 16px",borderTop:".5px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:11,color:"var(--txt3)"}}>Leads activos</span>
        <span className="pill pill-gold" style={{fontSize:11}}>{leadsCount}</span>
      </div>
    </aside>
  );
}

// ── TOP BAR ───────────────────────────────────────────────────────────────────
function TopBar({activeTab,onAddLead,onLogout}:{activeTab:string;onAddLead:()=>void;onLogout:()=>void}) {
  const label=NAV.find(n=>n.id===activeTab)?.label||"";
  return (
    <header style={{height:52,flexShrink:0,borderBottom:".5px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",background:"rgba(7,9,15,.85)",backdropFilter:"blur(12px)"}}>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <span style={{fontSize:12,color:"var(--txt3)"}}>CloserAI</span>
        <span style={{fontSize:12,color:"var(--txt3)"}}>·</span>
        <span style={{fontSize:12,color:"var(--txt2)"}}>{label}</span>
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <button className="btn btn-primary" style={{fontSize:12,padding:"6px 14px"}} onClick={onAddLead}>+ Nuevo lead</button>
        <button className="btn btn-ghost" style={{fontSize:12,padding:"6px 12px"}} onClick={onLogout}>Salir</button>
      </div>
    </header>
  );
}

// ── APP LAYOUT ────────────────────────────────────────────────────────────────
function AppLayout({appUser,onLogout}:{appUser:AppUser;onLogout:()=>void}) {
  const [tab,setTab]=useState("dashboard");
  const isAdmin=appUser.member.role==="admin";
  const [leads,setLeads]=useState<Lead[]>([
    {id:"1",workspace_id:appUser.workspace.id,name:"María Velázquez",role:"Founder",company:"StartupMX",score:10,temp:"Warm",stage:"Calificado",next_action:"Call hoy",created_at:"2026-05-20"},
    {id:"2",workspace_id:appUser.workspace.id,name:"Agencia Scale MX",role:"CEO",company:"Scale MX",score:9,temp:"Hot",stage:"Contactado",last_action:"Contactado",created_at:"2026-05-19"},
    {id:"3",workspace_id:appUser.workspace.id,name:"Camila Torres",role:"Coach",company:"Self",score:9,temp:"Warm",stage:"Nuevo",next_action:"DM LinkedIn",created_at:"2026-05-20"},
    {id:"4",workspace_id:appUser.workspace.id,name:"Diego Ramírez",role:"CMO",company:"Fintech SA",score:7,temp:"Frío",stage:"Propuesta",last_action:"Propuesta enviada",created_at:"2026-05-18"},
    {id:"5",workspace_id:appUser.workspace.id,name:"Laura Gómez",role:"Growth Lead",company:"EdTech",score:8,temp:"Warm",stage:"Calificado",next_action:"Follow-up",created_at:"2026-05-17"},
  ]);
  const [members]=useState<Member[]>([
    {id:"m1",workspace_id:appUser.workspace.id,user_id:appUser.supabaseUser.id,role:"admin",display_name:appUser.member.display_name||"Admin"},
    {id:"m2",workspace_id:appUser.workspace.id,user_id:"user2",role:"member",display_name:"Colaborador 1"},
  ]);
  const [selLead,setSelLead]=useState<Lead|null>(null);
  const [addOpen,setAddOpen]=useState(false);

  const views: Record<string,React.ReactNode> = {
    dashboard: <Dashboard leads={leads} />,
    pipeline:  <Pipeline leads={leads} onLeadClick={setSelLead} />,
    closer:    <VistaCloser leads={leads} onLeadClick={setSelLead} />,
    buscador:  <Prospector onAddLead={l=>setLeads(p=>[l,...p])} />,
    generar:   <RedaccionIA leads={leads} />,
    email:     <EmailMarketing isAdmin={isAdmin} workspaceId={appUser.workspace.id} />,
    cadence:   <Cadences isAdmin={isAdmin} workspaceId={appUser.workspace.id} />,
    inbox:     <Inbox leads={leads} />,
    qualify:   <QualifyGate leads={leads} onScoreUpdate={(id,s)=>setLeads(p=>p.map(l=>l.id===id?{...l,score:s}:l))} />,
    metrics:   <Metrics leads={leads} isAdmin={isAdmin} />,
    knowledge: <Knowledge isAdmin={isAdmin} workspaceId={appUser.workspace.id} />,
    team:      isAdmin?<TeamManagement workspace={appUser.workspace} members={members} onInvite={(email,role)=>console.log("invite",email,role)} />:null,
    settings:  isAdmin?<ApiSettings workspaceId={appUser.workspace.id} />:null,
  };

  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden"}}>
      <Sidebar active={tab} onChange={setTab} appUser={appUser} leadsCount={leads.length} workspaces={[appUser.workspace]} onWorkspaceChange={()=>{}} />
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <TopBar activeTab={tab} onAddLead={()=>setAddOpen(true)} onLogout={onLogout} />
        <main style={{flex:1,overflow:"hidden"}}>{views[tab]||views["dashboard"]}</main>
      </div>
      {selLead&&<LeadDetail lead={selLead} onClose={()=>setSelLead(null)} onUpdate={l=>setLeads(p=>p.map(x=>x.id===l.id?l:x))} />}
      <AddLeadModal open={addOpen} onClose={()=>setAddOpen(false)} onAdd={l=>setLeads(p=>[l,...p])} />
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function CRMApp() {
  const [appUser,setAppUser]=useState<AppUser|null>(null);

  useEffect(()=>{
    // Check existing session
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){
        supabase.from("workspace_members").select("*,workspaces(*)").eq("user_id",session.user.id).single().then(({data})=>{
          if(data){
            const m:Member={id:data.id,workspace_id:data.workspace_id,user_id:data.user_id,role:data.role,display_name:data.display_name};
            setAppUser({supabaseUser:session.user,member:m,workspace:data.workspaces as Workspace});
          }
        });
      }
    });
  },[]);

  async function handleLogout(){
    await supabase.auth.signOut();
    setAppUser(null);
  }

  return (
    <ToastProvider>
      {appUser
        ?<AppLayout appUser={appUser} onLogout={handleLogout} />
        :<AuthScreen onAuth={(u,m,w)=>setAppUser({supabaseUser:u,member:m,workspace:w})} />
      }
    </ToastProvider>
  );
}
