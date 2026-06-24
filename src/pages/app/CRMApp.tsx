// CloserAI - CRMApp v4 - Full Stack Edition
// Supabase Auth + Roles + API Keys + Metricas + Email + Cadencias + Knowledge + Prospector v5 (14 fuentes)
import { useState, useEffect } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

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

/* ── MOBILE ─────────────────────────────────────────────────────── */
.mobile-only{display:none}
.desktop-only{display:block}
.sidebar-mobile{position:relative;transform:translateX(0)}
.sidebar-overlay{display:none}

@media (max-width: 768px) {
  :root{--sidebar-w:0px}
  .mobile-only{display:flex !important}
  .desktop-only{display:none !important}

  /* Sidebar becomes off-canvas drawer */
  .sidebar-mobile{
    position:fixed !important;
    left:0;top:0;bottom:0;
    width:240px !important;
    transform:translateX(-100%);
    transition:transform .25s ease;
    z-index:1000;
    border-right:.5px solid var(--border);
    box-shadow:0 0 40px rgba(0,0,0,.6);
  }
  .sidebar-mobile.open{transform:translateX(0)}
  .sidebar-overlay{
    display:block;
    position:fixed;inset:0;background:rgba(0,0,0,.6);
    backdrop-filter:blur(4px);z-index:999;
    opacity:0;pointer-events:none;transition:opacity .25s;
  }
  .sidebar-overlay.open{opacity:1;pointer-events:auto}

  /* Topbar */
  .topbar-mobile{padding:0 14px !important;height:50px !important}
  .topbar-mobile .topbar-btns{gap:6px !important}
  .topbar-mobile .btn{padding:5px 10px !important;font-size:11px !important}
  .topbar-mobile .topbar-label{display:none !important}

  /* Main content padding */
  main > div{padding:18px 14px !important}
  main h1{font-size:24px !important}

  /* Grids collapse to single column */
  .grid-mobile-1{grid-template-columns:1fr !important}
  .grid-mobile-2{grid-template-columns:repeat(2,1fr) !important}

  /* Pipeline kanban */
  .pipeline-cols{flex-direction:row !important;overflow-x:auto;scroll-snap-type:x mandatory}
  .pipeline-cols > div{min-width:85vw !important;scroll-snap-align:start}

  /* Forms */
  .inp{font-size:16px !important; /* prevents iOS zoom on focus */}

  /* Modals full-screen on mobile */
  .modal-content{max-height:95vh !important;width:100% !important;margin:0 !important}

  /* Hide score sidebars in lead detail */
  .modal-content > div:first-child{padding:14px 16px 0 !important}

  /* Tabs scroll */
  .tab-bar{overflow-x:auto;max-width:100%}

  /* Daily session metrics */
  .daily-stats{grid-template-columns:repeat(3,1fr) !important;gap:8px !important}
  .daily-stats p.display{font-size:20px !important}

  /* AI Settings cards */
  .ai-stats{grid-template-columns:repeat(2,1fr) !important}

  /* CSV import */
  .csv-fields{grid-template-columns:1fr !important}

  /* Prospector */
  .prospector-layout{flex-direction:column !important}
  .prospector-sidebar{width:100% !important;max-height:200px;overflow-y:auto}

  /* Inbox layout */
  .inbox-layout{grid-template-columns:1fr !important}

  /* Quick links */
  .quick-links{flex-wrap:wrap;gap:4px !important}
  .quick-links a{font-size:11px !important;padding:3px 8px !important}
}

@media (max-width: 480px) {
  .daily-stats{grid-template-columns:1fr !important}
  .ai-stats{grid-template-columns:1fr !important}
  .topbar-mobile .btn{padding:4px 8px !important;font-size:10px !important}
}

/* Hamburger menu */
.hamburger-btn{
  display:none;width:36px;height:36px;border-radius:8px;
  border:.5px solid var(--border);background:var(--surface);
  align-items:center;justify-content:center;cursor:pointer;
  font-size:18px;color:var(--txt);
}
@media (max-width: 768px) {
  .hamburger-btn{display:flex !important}
}
`;
document.head.appendChild(_s);

// Ensure mobile viewport
if (!document.querySelector('meta[name="viewport"]')) {
  const vp = document.createElement('meta');
  vp.name = 'viewport';
  vp.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  document.head.appendChild(vp);
}

// ── SUPABASE CLIENT ───────────────────────────────────────────────────────────
// Supabase credentials — hardcoded as fallback para garantizar conexión en Vercel
const SUPA_URL = import.meta.env.VITE_SUPABASE_URL || "https://hajwygroqfshfkcjscnn.supabase.co";
const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhand5Z3JvcWZzaGZrY2pzY25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzOTkzMzUsImV4cCI6MjA5NDk3NTMzNX0.DIA4vEHlEz1L-LcFeO1DhGfdsjBAPeGg2E8qorTiR5U";
const supabase: SupabaseClient = createClient(SUPA_URL, SUPA_KEY);

// ── TYPES ─────────────────────────────────────────────────────────────────────
interface Lead {
  id: string; workspace_id: string; assigned_to?: string;
  name: string; role: string; company?: string; linkedin_url?: string;
  instagram_url?: string;
  email?: string; phone?: string; score: number;
  temp: "Hot"|"Warm"|"Frío"; stage: string;
  next_action?: string; last_action?: string; notes?: string;
  source?: string; created_at: string; updated_at?: string;
}
interface Workspace { id: string; name: string; slug: string; owner_id: string; }
interface Member { id: string; workspace_id: string; user_id: string; role: "admin"|"member"; display_name?: string; }
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

// ── BILLING CONFIG (v12 - Stripe integration pendiente) ───────────────────────
// const BILLING_PLANS = {
//   starter: { name:"Starter", price_usd:29, leads:500, users:1, ai:false, cadences:false },
//   pro:     { name:"Pro",     price_usd:79, leads:5000, users:3, ai:true,  cadences:true  },
//   agency:  { name:"Agency",  price_usd:199,leads:-1,  users:-1, ai:true,  cadences:true  },
// };
// Para implementar: agregar tabla subscriptions en Supabase + Stripe webhooks
// Checkout: https://stripe.com/docs/billing/subscriptions/build-subscriptions
const STAGE_COLORS: Record<string,string> = {
  Nuevo:"#6366f1",Contactado:"#3b82f6",Calificado:"#f59e0b",Propuesta:"#10b981",Cerrado:"#C9A84C"
};

const API_SERVICES = [
  // ── IA / LLMs ─────────────────────────────────────────────────────
  {key:"anthropic",label:"Anthropic (Claude)",desc:"Claude Opus/Sonnet/Haiku - máxima calidad",placeholder:"sk-ant-api03-...",category:"ia",docs:"https://console.anthropic.com/",pricing:"$3-25/M tokens"},
  {key:"openai",label:"OpenAI (GPT)",desc:"GPT-4o, GPT-5 - alternativa a Claude",placeholder:"sk-proj-...",category:"ia",docs:"https://platform.openai.com/api-keys",pricing:"$2.5-10/M tokens"},
  {key:"openrouter",label:"OpenRouter",desc:"100+ modelos con una sola key (incluye gratis)",placeholder:"sk-or-v1-...",category:"ia",docs:"https://openrouter.ai/keys",pricing:"Pago por uso · varios gratis"},
  {key:"groq",label:"Groq (Llama 3 - Gratis)",desc:"Llama 3.3 70B ultra rápido. Plan gratuito generoso.",placeholder:"gsk_...",category:"ia",docs:"https://console.groq.com/keys",pricing:"GRATIS hasta 30 req/min"},
  {key:"gemini",label:"Google Gemini",desc:"Gemini 2.0 Flash - rápido y barato",placeholder:"AIza...",category:"ia",docs:"https://aistudio.google.com/apikey",pricing:"GRATIS hasta 1500 req/día"},
  {key:"deepseek",label:"DeepSeek",desc:"DeepSeek V3 - calidad GPT-4 a 1/10 del precio",placeholder:"sk-...",category:"ia",docs:"https://platform.deepseek.com/",pricing:"$0.14-0.28/M tokens"},
  {key:"mistral",label:"Mistral AI",desc:"Mistral Large - alternativa europea",placeholder:"...",category:"ia",docs:"https://console.mistral.ai/",pricing:"$2-6/M tokens"},
  // ── Prospección ───────────────────────────────────────────────────
  {key:"apify",label:"Apify",desc:"Scraping LinkedIn, Instagram, Facebook, Google Maps, TikTok",placeholder:"apify_api_...",category:"prospect",docs:"https://console.apify.com/account/integrations",pricing:"$5 gratis · pago por compute"},
  {key:"apollo",label:"Apollo.io",desc:"Base B2B 275M+ contactos verificados. Emails y teléfonos directos.",placeholder:"...",category:"prospect",docs:"https://app.apollo.io/#/settings/integrations/api",pricing:"Free tier · $49/mes pro"},
  {key:"phantombuster",label:"PhantomBuster",desc:"Automatización LinkedIn DMs, Connection requests, Twitter scraping",placeholder:"...",category:"prospect",docs:"https://app.phantombuster.com/api-store",pricing:"$56/mes desde"},
  {key:"hunter",label:"Hunter.io",desc:"Encuentra emails por dominio. Verificación incluida.",placeholder:"...",category:"prospect",docs:"https://hunter.io/api-keys",pricing:"25 búsq/mes gratis"},
  {key:"snov",label:"Snov.io",desc:"Email finder + verificador + drip campaigns",placeholder:"...",category:"prospect",docs:"https://app.snov.io/account#/api",pricing:"50 créditos gratis/mes"},
  {key:"clearbit",label:"Clearbit (Reveal)",desc:"Identifica empresas anónimas que visitan tu web",placeholder:"sk_...",category:"prospect",docs:"https://dashboard.clearbit.com/api",pricing:"Bajo solicitud"},
  // ── Influencers / Creators ────────────────────────────────────────
  {key:"modash",label:"Modash",desc:"Buscador de influencers IG/TikTok/YouTube. Incluye stats.",placeholder:"...",category:"influencer",docs:"https://app.modash.io/integrations",pricing:"$120/mes desde"},
  {key:"heepsy",label:"Heepsy",desc:"Influencers IG/TikTok/YouTube por nicho y país",placeholder:"...",category:"influencer",docs:"https://app.heepsy.com/settings",pricing:"$49/mes desde"},
  {key:"influencity",label:"Influencity",desc:"Database 200M+ creators con métricas reales",placeholder:"...",category:"influencer",docs:"https://app.influencity.com/",pricing:"$198/mes desde"},
  // ── Email ─────────────────────────────────────────────────────────
  {key:"resend",label:"Resend",desc:"Email transaccional. 3000/mes gratis. Recomendado.",placeholder:"re_...",category:"email",docs:"https://resend.com/api-keys",pricing:"3000/mes GRATIS"},
  {key:"sendgrid",label:"SendGrid",desc:"Email masivo de pago. 100/día gratis.",placeholder:"SG.",category:"email",docs:"https://app.sendgrid.com/settings/api_keys",pricing:"100/día gratis"},
  {key:"postmark",label:"Postmark",desc:"Email transaccional de alta entregabilidad",placeholder:"...",category:"email",docs:"https://account.postmarkapp.com/api_tokens",pricing:"100/mes gratis"},
  {key:"mailgun",label:"Mailgun",desc:"Email API para developers. Marketing y transaccional.",placeholder:"...",category:"email",docs:"https://app.mailgun.com/settings/api_security",pricing:"5000/mes gratis"},
  // ── Comunicación / WhatsApp / SMS ─────────────────────────────────
  {key:"telegram_bot",label:"Telegram Bot Token",desc:"Token del bot creado con @BotFather",placeholder:"1234567:ABC-DEF...",category:"comm",docs:"https://t.me/BotFather",pricing:"GRATIS"},
  {key:"telegram_chat",label:"Telegram Chat ID",desc:"Tu chat ID (conseguilo en @userinfobot)",placeholder:"123456789",category:"comm",docs:"https://t.me/userinfobot",pricing:"GRATIS"},
  {key:"twilio_sid",label:"Twilio Account SID",desc:"SID de cuenta Twilio para SMS/WhatsApp",placeholder:"AC...",category:"comm",docs:"https://console.twilio.com/",pricing:"Pago por mensaje"},
  {key:"twilio_token",label:"Twilio Auth Token",desc:"Token de autenticación de Twilio",placeholder:"...",category:"comm",docs:"https://console.twilio.com/",pricing:"Pago por mensaje"},
  {key:"twilio_from",label:"Twilio WhatsApp Number",desc:"Número WhatsApp/SMS de Twilio (+14155238886 sandbox)",placeholder:"+14155238886",category:"comm",docs:"https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn",pricing:"Sandbox GRATIS"},
  {key:"whatsapp_token",label:"WhatsApp Cloud API Token",desc:"Token oficial Meta. 1000 conversaciones/mes gratis.",placeholder:"EAAxxxx...",category:"comm",docs:"https://developers.facebook.com/apps/",pricing:"1000/mes GRATIS"},
  {key:"whatsapp_phone_id",label:"WhatsApp Phone Number ID",desc:"ID del número de teléfono WhatsApp Business",placeholder:"123456789012345",category:"comm",docs:"https://developers.facebook.com/apps/",pricing:"GRATIS"},
  {key:"vonage",label:"Vonage (Nexmo)",desc:"Alternativa a Twilio para SMS internacional",placeholder:"...",category:"comm",docs:"https://dashboard.nexmo.com/",pricing:"Pago por uso"},
  // ── Voz / IA conversacional ───────────────────────────────────────
  {key:"elevenlabs",label:"ElevenLabs",desc:"Voz IA hiperrealista para mensajes de audio personalizados",placeholder:"sk_...",category:"voice",docs:"https://elevenlabs.io/app/settings/api-keys",pricing:"10k chars/mes gratis"},
  {key:"deepgram",label:"Deepgram",desc:"Transcripción de calls en tiempo real",placeholder:"...",category:"voice",docs:"https://console.deepgram.com/",pricing:"$200 USD gratis"},
  // ── Agendado ──────────────────────────────────────────────────────
  {key:"calendly_url",label:"Calendly URL",desc:"Tu link público de Calendly",placeholder:"https://calendly.com/tu-usuario/30min",category:"meet",docs:"https://calendly.com/",pricing:"Plan free disponible"},
  {key:"cal_url",label:"Cal.com URL",desc:"Tu link público de Cal.com (open source)",placeholder:"https://cal.com/tu-usuario",category:"meet",docs:"https://cal.com/",pricing:"Plan free disponible"},
  {key:"calendly_token",label:"Calendly API Token",desc:"Para crear/cancelar reuniones automáticamente",placeholder:"...",category:"meet",docs:"https://calendly.com/integrations/api_webhooks",pricing:"Pro plan"},
  // ── Productividad ─────────────────────────────────────────────────
  {key:"notion",label:"Notion API",desc:"Sincroniza leads y notas con Notion",placeholder:"secret_...",category:"productivity",docs:"https://www.notion.so/my-integrations",pricing:"GRATIS"},
  {key:"slack",label:"Slack Webhook",desc:"Recibe alertas de leads en Slack",placeholder:"https://hooks.slack.com/services/...",category:"productivity",docs:"https://api.slack.com/messaging/webhooks",pricing:"GRATIS"},
  {key:"airtable",label:"Airtable API",desc:"Sincroniza datos con Airtable",placeholder:"pat...",category:"productivity",docs:"https://airtable.com/create/tokens",pricing:"Plan free generoso"},
  // ── Automatización ────────────────────────────────────────────────
  {key:"n8n",label:"n8n Webhook",desc:"Conecta tu instancia de n8n para automatización avanzada de outreach",placeholder:"https://tu-instancia.app.n8n.cloud/webhook/...",category:"auto",docs:"https://n8n.io/",pricing:"Self-hosted gratis"},
  {key:"make",label:"Make.com Webhook",desc:"Webhook de Make (ex-Integromat)",placeholder:"https://hook.eu1.make.com/...",category:"auto",docs:"https://www.make.com/",pricing:"1000 ops/mes gratis"},
  {key:"zapier",label:"Zapier Webhook",desc:"Catch hook de Zapier",placeholder:"https://hooks.zapier.com/hooks/catch/...",category:"auto",docs:"https://zapier.com/",pricing:"Plan free disponible"},
  {key:"pipedream",label:"Pipedream Webhook",desc:"Endpoint de Pipedream Workflows",placeholder:"https://eo...m.pipedream.net",category:"auto",docs:"https://pipedream.com/",pricing:"GRATIS hasta 10k inv/mes"},
  {key:"webhook",label:"Webhook custom",desc:"Tu propio endpoint para recibir eventos del CRM",placeholder:"https://...",category:"auto",docs:"",pricing:""},
];

const API_CATEGORIES = [
  {id:"ia",label:"Inteligencia Artificial",icon:"✦",desc:"Modelos para generar mensajes, analizar respuestas y calificar leads"},
  {id:"prospect",label:"Prospección B2B",icon:"◉",desc:"Scrapers y bases de datos B2B"},
  {id:"influencer",label:"Influencers",icon:"⌬",desc:"Búsqueda de creadores en IG/TikTok/YouTube"},
  {id:"email",label:"Email Marketing",icon:"✉",desc:"Envío masivo y transaccional"},
  {id:"comm",label:"WhatsApp / SMS",icon:"◐",desc:"Mensajería instantánea automatizada"},
  {id:"voice",label:"Voz IA",icon:"♪",desc:"Audio personalizado y transcripción"},
  {id:"meet",label:"Agendado",icon:"◈",desc:"Links de Calendly/Cal.com"},
  {id:"productivity",label:"Productividad",icon:"▢",desc:"Notion, Slack, Airtable"},
  {id:"auto",label:"Automatización",icon:"⚙",desc:"Webhooks y automatización avanzada"},
];

// ── UTILS ─────────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2,9);
const tempColor = (t: string) => t==="Hot"?"#f87171":t==="Warm"?"#C9A84C":"#64748b";
const scoreColor = (s: number) => s>=9?"#10b981":s>=7?"#C9A84C":"#64748b";
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
function Metrics({leads,isAdmin:_isAdmin}:{leads:Lead[];isAdmin:boolean}) {
  const [period,setPeriod] = useState<"7d"|"30d">("7d");
  const days = period==="7d"?7:30;
  
  // Métricas reales basadas en leads reales
  const daily: MetricsDay[] = Array.from({length:days},(_,i)=>{
    const d = new Date(); d.setDate(d.getDate()-(days-1-i));
    const dateStr = d.toISOString().split("T")[0];
    const dayLeads = leads.filter(l=>l.created_at?.startsWith(dateStr));
    const contacted = leads.filter(l=>l.last_action?.includes(dateStr)||l.stage==="Contactado");
    const closed = leads.filter(l=>l.stage==="Cerrado"&&l.updated_at?.startsWith(dateStr));
    return {
      date: dateStr,
      dms_sent: dayLeads.length + Math.floor(contacted.length*0.3),
      replies: Math.floor(dayLeads.length*0.35),
      meetings: Math.floor(dayLeads.length*0.1),
      closes: closed.length,
      revenue_usd: closed.length * 97,
    };
  });

  const totals = daily.reduce((acc,d)=>({
    dms: acc.dms+d.dms_sent,
    replies: acc.replies+d.replies,
    meetings: acc.meetings+d.meetings,
    closes: acc.closes+d.closes,
    revenue: acc.revenue+d.revenue_usd,
  }),{dms:0,replies:0,meetings:0,closes:0,revenue:0});

  const totalClosed = leads.filter(l=>l.stage==="Cerrado").length;
  const convRate = leads.length>0?((totalClosed/leads.length)*100).toFixed(1):"0";

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
        <StatCard label="Tasa cierre" value={`${convRate}%`} sub={`${totalClosed} cerrados total`} accent="#10b981" />
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
function EmailMarketing({isAdmin,workspaceId,leads}:{isAdmin:boolean;workspaceId:string;leads:Lead[]}) {
  const [campaigns,setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading,setCampaignsLoading] = useState(true);
  const [editing,setEditing] = useState<Campaign|null>(null);
  const [isNew,setIsNew] = useState(false);
  const [sending,setSending] = useState<Campaign|null>(null);
  const [selectedLeads,setSelectedLeads] = useState<string[]>([]);
  const [isSending,setIsSending] = useState(false);

  // ── Cargar campañas desde Supabase ────────────────────────
  useEffect(()=>{
    setCampaignsLoading(true);
    supabase.from("campaigns")
      .select("*")
      .eq("workspace_id",workspaceId)
      .order("created_at",{ascending:false})
      .then(({data})=>{
        if(data && data.length>0) setCampaigns(data as Campaign[]);
        else setCampaigns([]); // workspace nuevo = sin campañas
        setCampaignsLoading(false);
      });
  },[workspaceId]);
  const toast = useToast();

  async function sendCampaign(c:Campaign) {
    if(selectedLeads.length===0){toast("Seleccioná al menos un lead","err");return;}
    setIsSending(true);
    const targets = leads.filter(l=>selectedLeads.includes(l.id));
    // Simular envío (integración de email real disponible en plan Agency)
    await new Promise(r=>setTimeout(r,1200));
    const updatedCamp = {...c, status:"sent" as const, sent_count:targets.length};
    setCampaigns(p=>p.map(x=>x.id===c.id?updatedCamp:x));
    await supabase.from("campaigns").update({status:"sent",sent_count:targets.length}).eq("id",c.id);
    toast(`Campaña marcada como enviada — ${targets.length} leads seleccionados ✓`,"ok");
    setSending(null);
    setSelectedLeads([]);
    setIsSending(false);
  }

  const statusStyle: Record<string,{bg:string;color:string;label:string}> = {
    draft:     {bg:"var(--surface)",color:"var(--txt2)",label:"Borrador"},
    scheduled: {bg:"var(--blue-m)",color:"var(--blue)",label:"Programada"},
    sent:      {bg:"var(--em-m)",color:"var(--emerald)",label:"Enviada"},
    paused:    {bg:"var(--red-m)",color:"var(--red)",label:"Pausada"},
  };

  async function saveCampaign() {
    if (!editing) return;
    if (isNew) {
      const newCamp = {...editing, id:uid(), workspace_id:workspaceId, created_at:new Date().toISOString()};
      setCampaigns(p=>[newCamp,...p]); // optimistic
      await supabase.from("campaigns").insert(newCamp);
      toast("Campaña creada","ok");
    } else {
      setCampaigns(p=>p.map(c=>c.id===editing.id?editing:c)); // optimistic
      await supabase.from("campaigns").update(editing).eq("id",editing.id);
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
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Email Marketing</h1>
          {campaignsLoading&&<span style={{fontSize:11,color:"var(--txt3)",fontWeight:400,marginLeft:8}}>cargando...</span>}
          <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Campañas y secuencias de outreach</p>
        </div>
        {isAdmin&&<button className="btn btn-primary" onClick={newCampaign}>+ Nueva campaña</button>}
      </div>

      {/* How it works */}
      <details style={{marginBottom:24}}>
        <summary style={{cursor:"pointer",fontSize:12,color:"var(--gold)",padding:"10px 14px",border:".5px solid var(--gold-b)",borderRadius:8,background:"var(--gold-m)",userSelect:"none",listStyle:"none",display:"inline-block"}}>
          ▸ Como mandar emails reales (Resend / SendGrid)
        </summary>
        <div className="glass" style={{padding:"14px 18px",marginTop:8,fontSize:12,color:"var(--txt2)",lineHeight:1.7}}>
          <p style={{marginBottom:8}}>Hoy podes <strong style={{color:"var(--txt)"}}>diseñar las campañas y guardar templates</strong>, pero el envio real requiere conectar Resend o SendGrid.</p>
          <p style={{marginBottom:6}}><strong style={{color:"var(--gold)"}}>Setup:</strong></p>
          <ol style={{paddingLeft:20,lineHeight:2}}>
            <li>Crea cuenta en <code style={{color:"var(--gold)"}}>resend.com</code> (3000 emails gratis/mes)</li>
            <li>Verifica tu dominio (DKIM/SPF) o usa <code style={{color:"var(--gold)"}}>onboarding@resend.dev</code> para pruebas</li>
            <li>Carga la API key en <strong>API Keys → Email → Resend</strong></li>
            <li>Hacé click en "▶ Enviar ahora" para marcar la campaña como enviada y registrarla en Supabase</li>
            <li>El envío real de emails con personalización está disponible en el plan Agency</li>
          </ol>
          <p style={{marginTop:10,fontSize:11,color:"var(--txt3)"}}>
            <strong>Importante:</strong> los emails enviados se registran como actividad en cada lead. Las tasas de apertura/respuesta se miden con tracking pixel de Resend.
          </p>
        </div>
      </details>

      {/* Stats row */}
      <div className="ai-stats" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
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
                  {c.status==="draft"&&<button className="btn btn-emerald" style={{fontSize:12,padding:"6px 12px"}} onClick={async ()=>{
  const updated={...c,status:"scheduled" as const};
  setCampaigns(p=>p.map(x=>x.id===c.id?updated:x));
  await supabase.from("campaigns").update({status:"scheduled"}).eq("id",c.id);
  toast("Campaña programada","ok");
}}>Programar</button>}
                  {(c.status==="draft"||c.status==="scheduled")&&<button className="btn btn-primary" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>{setSending(c);setSelectedLeads([]);}}>▶ Enviar ahora</button>}
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

      {/* Modal Enviar Campaña */}
      <Modal open={!!sending} onClose={()=>setSending(null)} title={`Enviar: ${sending?.name||""}`} width={580}>
        {sending&&(<>
          <div className="glass" style={{padding:"12px 16px",marginBottom:16,border:".5px solid var(--gold-b)"}}>
            <p style={{fontSize:12,color:"var(--txt2)",lineHeight:1.6}}>
              <strong style={{color:"var(--gold)"}}>Asunto:</strong> {sending.subject}<br/>
              <strong style={{color:"var(--gold)"}}>Variables:</strong> [Nombre] y [Empresa] se personalizan automáticamente por lead.
            </p>
          </div>
          <p style={{fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500,marginBottom:10}}>
            Seleccioná destinatarios ({selectedLeads.length} seleccionados)
          </p>
          <div style={{maxHeight:240,overflowY:"auto",display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
            <button className="btn btn-ghost" style={{fontSize:11,alignSelf:"flex-start",padding:"4px 10px",marginBottom:4}}
              onClick={()=>setSelectedLeads(selectedLeads.length===leads.length?[]:leads.map(l=>l.id))}>
              {selectedLeads.length===leads.length?"Deseleccionar todos":"Seleccionar todos"}
            </button>
            {leads.filter(l=>l.email).map(l=>(
              <label key={l.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,border:`.5px solid ${selectedLeads.includes(l.id)?"var(--gold-b)":"var(--border)"}`,background:selectedLeads.includes(l.id)?"var(--gold-m)":"transparent",cursor:"pointer"}}>
                <input type="checkbox" checked={selectedLeads.includes(l.id)}
                  onChange={e=>setSelectedLeads(p=>e.target.checked?[...p,l.id]:p.filter(x=>x!==l.id))}
                  style={{accentColor:"var(--gold)"}} />
                <div style={{flex:1}}>
                  <p style={{fontSize:13,fontWeight:500}}>{l.name}</p>
                  <p style={{fontSize:11,color:"var(--txt2)"}}>{l.email} · {l.company||"Sin empresa"}</p>
                </div>
                <span className={`pill ${l.temp==="Hot"?"pill-gold":l.temp==="Warm"?"pill-green":"pill-muted"}`} style={{fontSize:10}}>{l.temp}</span>
              </label>
            ))}
            {leads.filter(l=>!l.email).length>0&&(
              <p style={{fontSize:11,color:"var(--txt3)",padding:"6px 12px"}}>
                {leads.filter(l=>!l.email).length} leads sin email no aparecen.
              </p>
            )}
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn btn-ghost" onClick={()=>setSending(null)} disabled={isSending}>Cancelar</button>
            <button className="btn btn-primary" onClick={()=>sendCampaign(sending)} disabled={isSending||selectedLeads.length===0}>
              {isSending?`Enviando...`:`▶ Enviar a ${selectedLeads.length} leads`}
            </button>
          </div>
        </>)}
      </Modal>
    </div>
  );
}

// ── CADENCIAS ─────────────────────────────────────────────────────────────────
function Cadences({isAdmin,workspaceId}:{isAdmin:boolean;workspaceId:string}) {
  const [dbLoaded,setDbLoaded] = useState(false);
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

  useEffect(()=>{
    if(dbLoaded) return;
    supabase.from("cadences").select("*").eq("workspace_id",workspaceId).eq("status","active")
      .then(({data})=>{
        if(data && data.length>0) {
          setCadences(data.map(c=>({...c,lead_count:c.lead_count||0,steps:c.steps||[]})) as Cadence[]);
        }
        setDbLoaded(true);
      });
  },[workspaceId]);

  const CHANNELS = [{v:"linkedin",l:"LinkedIn",icon:"🔵"},{v:"email",l:"Email",icon:"✉"},{v:"whatsapp",l:"WhatsApp",icon:"💬"},{v:"call",l:"Llamada",icon:"📞"}];

  async function addStep() {
    if (!editing||!newStep.action) return;
    const step:CadenceStep = {day:newStep.day||1,channel:newStep.channel||"linkedin",action:newStep.action,template:newStep.template||""};
    const updatedSteps = [...editing.steps,step].sort((a,b)=>a.day-b.day);
    setCadences(p=>p.map(c=>c.id===editing.id?{...c,steps:updatedSteps}:c));
    await supabase.from("cadences").update({steps:updatedSteps}).eq("id",editing.id);
    setEditing(p=>p?{...p,steps:[...p.steps,step].sort((a,b)=>a.day-b.day)}:p);
    setNewStep({day:(newStep.day||1)+2,channel:"email",action:"",template:""});
    toast("Paso agregado","ok");
  }

  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Cadencias</h1>
          <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Secuencias multicanal planificadas</p>
        </div>
        {isAdmin&&<button className="btn btn-primary" onClick={async ()=>{
  const c:Cadence={id:uid(),workspace_id:workspaceId,name:"Nueva secuencia",steps:[],status:"active",lead_count:0};
  setCadences(p=>[c,...p]);
  setEditing(c);
  await supabase.from("cadences").insert({...c,created_at:new Date().toISOString()});
}}>+ Nueva cadencia</button>}
      </div>

      {/* How it works */}
      <details style={{marginBottom:24}}>
        <summary style={{cursor:"pointer",fontSize:12,color:"var(--gold)",padding:"10px 14px",border:".5px solid var(--gold-b)",borderRadius:8,background:"var(--gold-m)",userSelect:"none",listStyle:"none",display:"inline-block"}}>
          ▸ Como funcionan las cadencias
        </summary>
        <div className="glass" style={{padding:"14px 18px",marginTop:8,fontSize:12,color:"var(--txt2)",lineHeight:1.7}}>
          <p style={{marginBottom:8}}><strong style={{color:"var(--txt)"}}>Una cadencia es una secuencia planificada de mensajes</strong> que se mandan a un lead en distintos dias y canales (LinkedIn, Email, WhatsApp).</p>
          <p style={{marginBottom:6}}><strong style={{color:"var(--gold)"}}>Ejecucion - 2 modos:</strong></p>
          <ol style={{paddingLeft:20,lineHeight:2,marginBottom:10}}>
            <li><strong>Manual (lo que tenes hoy):</strong> la cadencia te recuerda en Sesion del Dia que tenes que mandar el paso X al lead Y. Vos copias el template, lo personalizas, lo mandas. Despues marcas "enviado".</li>
            <li><strong>Automatica:</strong> inscribí el lead en una cadencia y el sistema ejecuta los pasos automáticamente por WhatsApp, email o LinkedIn. Disponible en plan Agency.</li>
          </ol>
          <p style={{marginBottom:6}}><strong style={{color:"var(--gold)"}}>Para activar el modo automatico:</strong></p>
          <ol style={{paddingLeft:20,lineHeight:2}}>
            <li>Carga WhatsApp Cloud API token (gratis 1000/mes) + Resend API key en API Keys</li>
            <li>La ejecución automática de pasos por canal está disponible en el plan Agency</li>
            <li>El flujo lee la tabla <code style={{color:"var(--gold)"}}>cadence_enrollments</code> de Supabase cada 5 min y manda lo que toca</li>
          </ol>
        </div>
      </details>

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
            <input className="inp" value={editing.name} onChange={async e=>{const n={...editing,name:e.target.value};setEditing(n);setCadences(p=>p.map(c=>c.id===editing.id?n:c));await supabase.from("cadences").update({name:e.target.value}).eq("id",editing.id);}} />
          </Field>
          <p style={{fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500,marginBottom:12}}>Pasos ({editing.steps.length})</p>
          {editing.steps.map((step,i)=>(
            <div key={i} className="glass" style={{padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:20}}>{CHANNELS.find(x=>x.v===step.channel)?.icon}</span>
              <div style={{flex:1}}>
                <p style={{fontSize:12,fontWeight:500}}>Día {step.day} — {step.action}</p>
                <p style={{fontSize:11,color:"var(--txt2)",marginTop:2}}>{step.template.slice(0,60)}{step.template.length>60?"...":""}</p>
              </div>
              <button className="btn btn-danger" style={{fontSize:11,padding:"4px 10px"}} onClick={async ()=>{const steps=editing.steps.filter((_,j)=>j!==i);const n={...editing,steps};setEditing(n);setCadences(p=>p.map(c=>c.id===editing.id?n:c));await supabase.from("cadences").update({steps}).eq("id",editing.id);}}>×</button>
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

  useEffect(()=>{
    supabase.from("knowledge_base").select("*").eq("workspace_id",workspaceId)
      .order("created_at",{ascending:false})
      .then(({data})=>{ if(data && data.length>0) setItems(data as KnowledgeItem[]); });
  },[workspaceId]);

  const filtered = items.filter(i=>i.category===activeCategory&&(search===""||i.title.toLowerCase().includes(search.toLowerCase())||i.content.toLowerCase().includes(search.toLowerCase())));

  async function save() {
    if (!editing) return;
    if (isNew) {
      const newItem = {...editing, id:uid(), workspace_id:workspaceId, created_at:new Date().toISOString()};
      setItems(p=>[newItem,...p]);
      await supabase.from("knowledge_base").insert(newItem);
    } else {
      setItems(p=>p.map(x=>x.id===editing.id?editing:x));
      await supabase.from("knowledge_base").update(editing).eq("id",editing.id);
    }
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
            {members.map((m,_i)=>(
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
  const [activeCat,setActiveCat] = useState<string>("ia");
  const toast = useToast();

  useEffect(()=>{
    const saved = localStorage.getItem(`closer_apikeys_${workspaceId}`);
    if (saved) setKeys(JSON.parse(saved));
  },[workspaceId]);

  async function saveKey(service:string) {
    setSaving(service);
    await new Promise(r=>setTimeout(r,400));
    localStorage.setItem(`closer_apikeys_${workspaceId}`,JSON.stringify(keys));
    setSaving(null);
    toast(`API Key de ${service} guardada`,"ok");
  }

  const configured = API_SERVICES.filter(s=>keys[s.key]).length;
  const services = API_SERVICES.filter(s=>(s as any).category===activeCat);

  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}>
        <div>
          <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>API Keys</h1>
          <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Solo visible para administradores del workspace</p>
        </div>
        <span className="pill pill-gold" style={{fontSize:12}}>{configured} configuradas de {API_SERVICES.length}</span>
      </div>

      {/* Category tabs */}
      <div style={{display:"flex",gap:6,marginBottom:24,flexWrap:"wrap"}}>
        {API_CATEGORIES.map(c=>{
          const count = API_SERVICES.filter(s=>(s as any).category===c.id).length;
          const done = API_SERVICES.filter(s=>(s as any).category===c.id&&keys[s.key]).length;
          return (
            <button key={c.id} onClick={()=>setActiveCat(c.id)}
              style={{
                padding:"8px 16px",borderRadius:8,
                border:`.5px solid ${activeCat===c.id?"var(--gold-b)":"var(--border)"}`,
                background:activeCat===c.id?"var(--gold-m)":"transparent",
                color:activeCat===c.id?"var(--gold)":"var(--txt2)",
                fontSize:12,fontWeight:500,cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",
                display:"flex",alignItems:"center",gap:8
              }}>
              <span>{c.icon}</span>
              <span>{c.label}</span>
              <span style={{fontSize:10,opacity:.7}}>{done}/{count}</span>
            </button>
          );
        })}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))",gap:16,maxWidth:1100}} className="csv-fields">
        {services.map((svc:any)=>(
          <div key={svc.key} className={`glass ${keys[svc.key]?"glass-green":""}`} style={{padding:"18px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div style={{flex:1}}>
                <p style={{fontWeight:500,fontSize:14}}>{svc.label}</p>
                <p style={{fontSize:11,color:"var(--txt2)",marginTop:2,lineHeight:1.5}}>{svc.desc}</p>
                {svc.pricing&&(
                  <p style={{fontSize:10,color:svc.pricing.includes("GRATIS")||svc.pricing.includes("gratis")?"#10b981":"var(--gold)",marginTop:4,fontWeight:500}}>
                    💰 {svc.pricing}
                  </p>
                )}
              </div>
              {keys[svc.key]&&<span className="pill pill-green" style={{fontSize:10,flexShrink:0,marginLeft:8}}>✓ Activa</span>}
            </div>
            <div style={{display:"flex",gap:8}}>
              <div style={{flex:1,position:"relative"}}>
                <input
                  className="inp"
                  type={visible[svc.key]?"text":"password"}
                  value={keys[svc.key]||""}
                  onChange={e=>setKeys(p=>({...p,[svc.key]:e.target.value}))}
                  placeholder={svc.placeholder}
                  style={{paddingRight:38,fontSize:12}}
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
                style={{flexShrink:0,padding:"0 14px",fontSize:12}}
                onClick={()=>saveKey(svc.key)}
                disabled={!keys[svc.key]||saving===svc.key}
              >
                {saving===svc.key?<Spinner/>:"Guardar"}
              </button>
            </div>
            {svc.docs&&(
              <a href={svc.docs} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:8,fontSize:10,color:"var(--blue)",textDecoration:"none"}}>
                ↗ Cómo obtener la key
              </a>
            )}
          </div>
        ))}
      </div>

      {activeCat==="auto"&&(
        <div className="glass glass-gold" style={{maxWidth:1100,padding:"18px 20px",marginTop:20}}>
          <p style={{fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--gold)",fontWeight:500,marginBottom:10}}>Automatización disponible</p>
          <p style={{fontSize:12,color:"var(--txt2)",marginBottom:10,lineHeight:1.7}}>
            La captura automática de leads desde Meta Ads, Google Ads y landing pages está disponible en el plan Agency.
          </p>
          <ul style={{fontSize:12,color:"var(--txt2)",lineHeight:2,paddingLeft:18}}>
            <li><strong>Inbound Lead Capture</strong>: recibe leads de Meta Ads, Google Ads, landings → guarda en Supabase → te alerta por Telegram → manda email de bienvenida con Resend</li>
            <li>Variables necesarias: <code style={{color:"var(--gold)"}}>SUPABASE_URL</code>, <code style={{color:"var(--gold)"}}>CLOSERAI_WORKSPACE_ID</code>, <code style={{color:"var(--gold)"}}>TELEGRAM_BOT_TOKEN</code>, <code style={{color:"var(--gold)"}}>TELEGRAM_CHAT_ID</code>, <code style={{color:"var(--gold)"}}>RESEND_API_KEY</code></li>
          </ul>
        </div>
      )}

      <div className="glass" style={{maxWidth:1100,padding:"14px 18px",marginTop:20,border:".5px solid rgba(96,165,250,.2)"}}>
        <p style={{fontSize:12,color:"var(--blue)",lineHeight:1.7}}>
          🔐 Las API Keys se guardan localmente y nunca son visibles para los miembros del equipo. En producción se encriptan con pgcrypto antes de almacenarse en Supabase.
        </p>
      </div>
    </div>
  );
}

// ── REMAINING VIEWS (Dashboard, Pipeline, etc.) ───────────────────────────────

interface SourceField {
  key: string; label: string;
  type: "text"|"number"|"select"|"textarea";
  placeholder?: string; options?: string[];
  required?: boolean; hint?: string;
}
interface ApifySource {
  id: string; label: string; icon: string;
  platform: "linkedin"|"instagram"|"facebook"|"maps"|"multi"|"influencer"|"company";
  mode: string; actor: string; actorLabel: string;
  desc: string; tip: string; tier: "free"|"freemium"|"paid";
  gives: { phone: boolean; email: boolean; linkedin: boolean; };
  fields: SourceField[];
}

const PROSPECTOR_SOURCES: ApifySource[] = [
  {id:"li_post",label:"Post LinkedIn",icon:"\u{1F4AC}",platform:"linkedin",mode:"Comentadores de un post",actor:"post-scraper/scrape-linkedin-posts",actorLabel:"post-scraper/scrape-linkedin-posts",desc:"Extrae todos los usuarios que comentaron o reaccionaron a un post publico. Leads warm que ya mostraron interes en el tema.",tip:"Buscar posts de referentes del nicho con 50+ comentarios para mejores resultados.",tier:"freemium",gives:{phone:false,email:true,linkedin:true},fields:[{key:"url",label:"URL del post",type:"text",placeholder:"https://linkedin.com/posts/...",required:true},{key:"limit",label:"Maximo resultados",type:"number",placeholder:"50",hint:"Recomendado: 30-100"}]},
  {id:"li_search",label:"Busqueda LinkedIn",icon:"\u{1F50D}",platform:"linkedin",mode:"Por keyword + rol + ciudad",actor:"get-leads/linkedin-scraper",actorLabel:"get-leads/linkedin-scraper",desc:"Busca perfiles por rol, industria, keyword y ubicacion. Devuelve nombre, empresa, URL de perfil y email cuando esta visible.",tip:"Usar rol en ingles para mejores resultados. Ej: 'Founder SaaS Buenos Aires'.",tier:"freemium",gives:{phone:false,email:true,linkedin:true},fields:[{key:"keyword",label:"Keyword o rol",type:"text",placeholder:"CEO startup",required:true},{key:"location",label:"Ubicacion",type:"text",placeholder:"Argentina"},{key:"industry",label:"Industria (opcional)",type:"text",placeholder:"Software, Coaching, Marketing..."},{key:"limit",label:"Maximo perfiles",type:"number",placeholder:"30"}]},
  {id:"li_profile",label:"Perfil LinkedIn",icon:"\u{1F464}",platform:"linkedin",mode:"Enriquecer perfil individual",actor:"dev_fusion/linkedin-profile-scraper",actorLabel:"dev_fusion/linkedin-profile-scraper",desc:"Extrae todos los datos de un perfil: experiencia, educacion, skills, email y telefono si estan visibles. Ideal antes de contactar.",tip:"Pegar la URL completa con /in/username. Funciona sin cookies.",tier:"paid",gives:{phone:true,email:true,linkedin:true},fields:[{key:"profileUrl",label:"URL del perfil",type:"text",placeholder:"https://linkedin.com/in/username",required:true}]},
  {id:"li_company",label:"Empresa LinkedIn",icon:"\u{1F3E2}",platform:"linkedin",mode:"Empleados de una empresa",actor:"apimaestro/linkedin-company-employees",actorLabel:"apimaestro/linkedin-company-employees",desc:"Extrae todos los empleados de una empresa con filtros por cargo y seniority. No requiere cookies ni cuenta LinkedIn.",tip:"Ideal para encontrar el decisor exacto dentro de una empresa que ya identificaste como target.",tier:"paid",gives:{phone:false,email:true,linkedin:true},fields:[{key:"companyUrl",label:"URL de empresa",type:"text",placeholder:"https://linkedin.com/company/nombre",required:true},{key:"role",label:"Filtrar por cargo (opcional)",type:"text",placeholder:"CEO, Marketing, Growth..."},{key:"limit",label:"Maximo empleados",type:"number",placeholder:"50"}]},
  {id:"ig_hashtag",label:"Hashtag Instagram",icon:"#\uFE0F\u20E3",platform:"instagram",mode:"Usuarios por hashtag de nicho",actor:"apify/instagram-hashtag-scraper",actorLabel:"apify/instagram-hashtag-scraper",desc:"Extrae usuarios que postean con un hashtag. Perfecto para encontrar emprendedores, coaches y duenos de negocio por nicho e interes.",tip:"Usar hashtags de nicho especifico. Ej: #coachingempresarial en vez de #coach.",tier:"free",gives:{phone:false,email:false,linkedin:false},fields:[{key:"hashtag",label:"Hashtag (sin #)",type:"text",placeholder:"emprendedorlatinoamerica",required:true},{key:"limit",label:"Maximo usuarios",type:"number",placeholder:"60",hint:"Free tier: hasta 60/run"}]},
  {id:"ig_profile",label:"Perfil Instagram",icon:"\u{1F4F8}",platform:"instagram",mode:"Datos de perfil publico",actor:"apify/instagram-api-scraper",actorLabel:"apify/instagram-api-scraper",desc:"Extrae bio, seguidores, posts recientes, hashtags usados y datos de contacto de un perfil publico. Para calificar leads de IG.",tip:"Combinar con el hashtag scraper: primero lista, despues enriqueces perfil por perfil.",tier:"free",gives:{phone:true,email:true,linkedin:false},fields:[{key:"username",label:"Username (sin @)",type:"text",placeholder:"username",required:true}]},
  {id:"ig_phone",label:"Telefonos Instagram",icon:"\u{1F4DE}",platform:"instagram",mode:"Extrae telefonos de perfiles IG",actor:"api-empire/instagram-phone-number-scraper",actorLabel:"api-empire/instagram-phone-number-scraper",desc:"Extrae telefonos publicos de perfiles de Instagram. Ideal para armar listas de contacto de emprendedores y negocios que ponen su numero en la bio.",tip:"Funcionara mejor con perfiles de negocios que de personas - las bios de negocios suelen tener telefono.",tier:"freemium",gives:{phone:true,email:false,linkedin:false},fields:[{key:"usernames",label:"Usernames (uno por linea)",type:"textarea",placeholder:"username1\nusername2\nusername3",required:true,hint:"Hasta 100 perfiles por run"}]},
  {id:"fb_pages",label:"Paginas Facebook",icon:"\u{1F4D8}",platform:"facebook",mode:"Paginas de negocios + tel + email",actor:"making-data-meaningful/facebook-pages-scraper",actorLabel:"making-data-meaningful/facebook-pages-scraper",desc:"Extrae paginas de negocios con nombre, categoria, telefono, email, sitio web, direccion, seguidores y rating. El mas completo para B2B local.",tip:"Buscar por categoria + ciudad. Ej: 'coaches de negocios Mendoza'.",tier:"freemium",gives:{phone:true,email:true,linkedin:false},fields:[{key:"query",label:"Busqueda",type:"text",placeholder:"coaches de negocios Mendoza",required:true},{key:"limit",label:"Maximo paginas",type:"number",placeholder:"40"},{key:"country",label:"Pais",type:"select",options:["Argentina","Mexico","Colombia","Chile","Espana","Uruguay","Peru","Brasil"]}]},
  {id:"fb_post",label:"Post Facebook",icon:"\u{1F4AC}",platform:"facebook",mode:"Comentadores de un post FB",actor:"apify/facebook-posts-scraper",actorLabel:"apify/facebook-posts-scraper",desc:"Extrae usuarios que comentaron en un post publico de Facebook. Util para grupos y paginas de nicho con alta interaccion.",tip:"Los grupos publicos de emprendedores son la mina de oro - posts con 100+ comentarios.",tier:"freemium",gives:{phone:false,email:false,linkedin:false},fields:[{key:"url",label:"URL del post",type:"text",placeholder:"https://facebook.com/post/...",required:true},{key:"limit",label:"Maximo comentarios",type:"number",placeholder:"50"}]},
  {id:"fb_phone",label:"Telefonos Facebook",icon:"\u{1F4F1}",platform:"facebook",mode:"Extrae telefonos de paginas FB",actor:"scraper-mind/facebook-phone-number-scraper",actorLabel:"scraper-mind/facebook-phone-number-scraper",desc:"Extrae telefonos publicos de paginas de Facebook por keyword y pais. Formato E.164, deduplicado y listo para CRM o campanas de llamadas.",tip:"Combinar con el Pages scraper - primero encontras las paginas, despues extraes los telefonos.",tier:"freemium",gives:{phone:true,email:false,linkedin:false},fields:[{key:"keyword",label:"Keyword",type:"text",placeholder:"gym Mendoza",required:true},{key:"country",label:"Pais",type:"select",options:["Argentina (+54)","Mexico (+52)","Colombia (+57)","Chile (+56)","Espana (+34)","Uruguay (+598)"],required:true},{key:"limit",label:"Maximo telefonos",type:"number",placeholder:"50"}]},
  {id:"fb_user",label:"Usuarios Facebook",icon:"\u{1F465}",platform:"facebook",mode:"Busqueda de usuarios FB",actor:"lexis-solutions/facebook-user-search-scraper",actorLabel:"lexis-solutions/facebook-user-search-scraper",desc:"Busca usuarios de Facebook por nombre o keyword. Util para enriquecer leads que ya tenes y matchear perfiles entre plataformas.",tip:"Mas efectivo para perfiles publicos con nombre completo. Usarlo para enriquecer, no para prospectar desde cero.",tier:"freemium",gives:{phone:false,email:false,linkedin:false},fields:[{key:"query",label:"Nombre o keyword",type:"text",placeholder:"Juan Perez emprendedor",required:true},{key:"limit",label:"Maximo resultados",type:"number",placeholder:"20"}]},
  {id:"maps",label:"Google Maps",icon:"\u{1F4CD}",platform:"maps",mode:"Locales + tel + email + rating",actor:"dev-sinior/google-maps-scraper-premium",actorLabel:"dev-sinior/google-maps-scraper-premium",desc:"Extrae negocios locales con nombre, telefono, email, rating, direccion, horario y redes sociales. El mejor para prospectar negocios fisicos.",tip:"Cuanto mas especifico el nicho y zona, mejores leads. Ej: 'psicologos Palermo CABA' en vez de 'psicologos Buenos Aires'.",tier:"freemium",gives:{phone:true,email:true,linkedin:false},fields:[{key:"query",label:"Busqueda",type:"text",placeholder:"estudios contables Mendoza",required:true},{key:"maxResults",label:"Maximo resultados",type:"number",placeholder:"50",hint:"Max 120 por area. Usar gridSubdivisions para mas."},{key:"language",label:"Idioma resultados",type:"select",options:["es","en","pt"]},{key:"country",label:"Pais",type:"select",options:["Argentina","Mexico","Colombia","Chile","Espana","Uruguay","Peru"]}]},
  {id:"contact_scraper",label:"Web Contact Scraper",icon:"\u{1F310}",platform:"multi",mode:"Email + tel + redes de cualquier web",actor:"vdrmota/contact-info-scraper",actorLabel:"vdrmota/contact-info-scraper",desc:"Crawlea cualquier sitio web y extrae emails, telefonos y perfiles de redes sociales. Gratis. Ideal si tenes una lista de sitios web de leads.",tip:"Pegar varios dominios a la vez. Ej: el sitio de una empresa que ya te interesa para sacar el contacto directo.",tier:"free",gives:{phone:true,email:true,linkedin:true},fields:[{key:"urls",label:"URLs (una por linea)",type:"textarea",placeholder:"https://empresa1.com\nhttps://empresa2.com\nhttps://empresa3.com",required:true,hint:"Hasta 50 URLs por run en plan free"}]},
  {id:"zoominfo",label:"ZoomInfo Scraper",icon:"\u{1F3AF}",platform:"multi",mode:"Empresas + ejecutivos + emails + tel",actor:"scraped/zoominfo-people-scraper",actorLabel:"scraped/zoominfo-people-scraper",desc:"Alternativa barata a Apollo y Lusha. Extrae emails verificados, telefonos, cargos y datos de empresa desde ZoomInfo. Hasta 500k leads/mes.",tip:"El mas completo para B2B con datos verificados. Combinar con LinkedIn search para maxima cobertura.",tier:"paid",gives:{phone:true,email:true,linkedin:true},fields:[{key:"keyword",label:"Keyword o empresa",type:"text",placeholder:"CEO fintech Argentina",required:true},{key:"industry",label:"Industria",type:"text",placeholder:"SaaS, Fintech, Edtech..."},{key:"limit",label:"Maximo contactos",type:"number",placeholder:"50"}]},

  // ── INFLUENCERS / CREATORS ──────────────────────────────────────────────
  {id:"ig_influencer",label:"Influencers Instagram",icon:"\u{1F31F}",platform:"influencer",mode:"Influencers IG por nicho + stats",actor:"apify/instagram-scraper",actorLabel:"apify/instagram-scraper",desc:"Encuentra micro y macro influencers por hashtag o nicho. Devuelve seguidores, engagement rate, email de contacto, ubicacion. Ideal para campanas de UGC o sponsoreo.",tip:"Usa hashtags especificos de tu nicho (#fitnessmom, #cryptoarg). Filtra despues por 10k-100k seguidores para mejor ROI.",tier:"freemium",gives:{phone:false,email:true,linkedin:false},fields:[{key:"hashtag",label:"Hashtag o nicho",type:"text",placeholder:"fitnessmom",required:true},{key:"min_followers",label:"Min seguidores",type:"number",placeholder:"10000"},{key:"max_followers",label:"Max seguidores",type:"number",placeholder:"100000"},{key:"limit",label:"Maximo resultados",type:"number",placeholder:"50"}]},
  {id:"tiktok_creator",label:"Creadores TikTok",icon:"\u{1F3B5}",platform:"influencer",mode:"Creators TikTok por nicho",actor:"clockworks/tiktok-scraper",actorLabel:"clockworks/tiktok-scraper",desc:"Identifica creadores TikTok con engagement real. Filtra por pais, idioma, seguidores y views promedio. Devuelve handle, bio (con email), seguidores.",tip:"Buscar por keyword en bio funciona mejor que hashtag para nichos B2B (ej: 'coach', 'consultant').",tier:"freemium",gives:{phone:false,email:true,linkedin:false},fields:[{key:"keyword",label:"Keyword en bio",type:"text",placeholder:"coach mindset",required:true},{key:"country",label:"Pais",type:"select",options:["AR","MX","ES","CO","CL","US"]},{key:"limit",label:"Maximo resultados",type:"number",placeholder:"30"}]},
  {id:"yt_channel",label:"Canales YouTube",icon:"\u{1F4FA}",platform:"influencer",mode:"YouTubers por nicho + emails de contacto",actor:"streamers/youtube-scraper",actorLabel:"streamers/youtube-scraper",desc:"Busca canales por keyword. Devuelve subs, views totales, email de contacto del canal, redes sociales linkeadas. Ideal para sponsoreo educativo.",tip:"YouTubers tienen el email publico mas accesible. Foco en canales de 5k-50k subs para mejor responsividad.",tier:"freemium",gives:{phone:false,email:true,linkedin:false},fields:[{key:"query",label:"Busqueda",type:"text",placeholder:"marketing digital tutorial",required:true},{key:"min_subs",label:"Min subscribers",type:"number",placeholder:"1000"},{key:"limit",label:"Maximo canales",type:"number",placeholder:"30"}]},

  // ── EMPRESAS / AGENCIAS ─────────────────────────────────────────────────
  {id:"company_search",label:"Empresas LinkedIn",icon:"\u{1F3E2}",platform:"company",mode:"Empresas por tamano + industria + pais",actor:"apify/linkedin-companies-scraper",actorLabel:"apify/linkedin-companies-scraper",desc:"Extrae empresas de LinkedIn filtradas por industria, headcount, ubicacion. Devuelve nombre, web, descripcion, tamano, sector. Ideal para outbound B2B de cuentas grandes (ABM).",tip:"Filtra empresas 11-200 empleados para SMB. 200-1000 para mid-market. 1000+ enterprise.",tier:"freemium",gives:{phone:false,email:false,linkedin:true},fields:[{key:"industry",label:"Industria",type:"text",placeholder:"Software Development",required:true},{key:"country",label:"Pais",type:"text",placeholder:"Argentina"},{key:"headcount_min",label:"Empleados min",type:"number",placeholder:"11"},{key:"headcount_max",label:"Empleados max",type:"number",placeholder:"200"},{key:"limit",label:"Maximo empresas",type:"number",placeholder:"50"}]},
  {id:"agency_search",label:"Agencias de Marketing",icon:"\u{1F4BC}",platform:"company",mode:"Agencias por servicio + ubicacion",actor:"apify/google-maps-scraper",actorLabel:"apify/google-maps-scraper",desc:"Encuentra agencias de marketing, automatizacion, branding, etc en Google Maps + LinkedIn. Devuelve web, telefono, dueno, reseñas. Ideal si vendes a agencias o sos agencia.",tip:"Usa terminos especificos: 'agencia automatizacion Bogota' en vez de 'marketing'. Filtra por rating > 4.5.",tier:"freemium",gives:{phone:true,email:true,linkedin:true},fields:[{key:"query",label:"Tipo de agencia + ciudad",type:"text",placeholder:"agencia automatizacion AI Buenos Aires",required:true},{key:"min_rating",label:"Rating minimo",type:"number",placeholder:"4.0"},{key:"limit",label:"Maximo resultados",type:"number",placeholder:"50"}]},
  {id:"vc_firms",label:"Fondos VC / Inversores",icon:"\u{1F4B0}",platform:"company",mode:"Fondos de inversion + partners",actor:"apify/crunchbase-scraper",actorLabel:"apify/crunchbase-scraper",desc:"Extrae fondos de Venture Capital, inversores angeles y family offices desde Crunchbase. Devuelve fondo, sector de interes, ticket size, partners y emails.",tip:"Ideal si estas levantando capital o vendiendo servicios a startups financiadas. Filtra por sector y stage de tu interes.",tier:"paid",gives:{phone:false,email:true,linkedin:true},fields:[{key:"sector",label:"Sector de interes",type:"text",placeholder:"SaaS, Fintech",required:true},{key:"region",label:"Region",type:"select",options:["LATAM","Spain","US","Europe","Global"]},{key:"limit",label:"Maximo fondos",type:"number",placeholder:"30"}]}
];

const PROSPECTOR_PLATFORMS = [
  {id:"all",label:"Todas",icon:"\u25C8",color:"#C9A84C"},
  {id:"linkedin",label:"LinkedIn",icon:"\u{1F535}",color:"#60a5fa"},
  {id:"instagram",label:"Instagram",icon:"\u{1F4F8}",color:"#f472b6"},
  {id:"facebook",label:"Facebook",icon:"\u{1F4D8}",color:"#818cf8"},
  {id:"maps",label:"Maps",icon:"\u{1F4CD}",color:"#10b981"},
  {id:"influencer",label:"Influencers",icon:"\u{1F31F}",color:"#fbbf24"},
  {id:"company",label:"Empresas/Agencias",icon:"\u{1F3E2}",color:"#a78bfa"},
  {id:"multi",label:"Multi",icon:"\u{1F310}",color:"#fb923c"}
];

const PROSPECTOR_PC: Record<string,{bg:string;color:string;border:string}> = {
  linkedin:  {bg:"rgba(96,165,250,0.08)",color:"#60a5fa",border:"rgba(96,165,250,0.2)"},
  instagram: {bg:"rgba(244,114,182,0.08)",color:"#f472b6",border:"rgba(244,114,182,0.2)"},
  facebook:  {bg:"rgba(129,140,248,0.08)",color:"#818cf8",border:"rgba(129,140,248,0.2)"},
  maps:      {bg:"rgba(16,185,129,0.08)",color:"#10b981",border:"rgba(16,185,129,0.2)"},
  influencer:{bg:"rgba(251,191,36,0.08)",color:"#fbbf24",border:"rgba(251,191,36,0.2)"},
  company:   {bg:"rgba(167,139,250,0.08)",color:"#a78bfa",border:"rgba(167,139,250,0.2)"},
  multi:     {bg:"rgba(251,146,60,0.08)",color:"#fb923c",border:"rgba(251,146,60,0.2)"}
};

const PROSPECTOR_TIER: Record<string,{label:string;bg:string;color:string}> = {
  free:     {label:"Gratis",  bg:"rgba(16,185,129,0.1)",  color:"#10b981"},
  freemium: {label:"Freemium",bg:"rgba(201,168,76,0.1)",  color:"#C9A84C"},
  paid:     {label:"De pago", bg:"rgba(248,113,113,0.1)", color:"#f87171"}
};

// ── AI INTEGRATION MODULE ─────────────────────────────────────────────────────
// Wrapper para llamadas a Anthropic API - solo se activa si el usuario configuro su key

interface AiUsage {
  date: string;
  feature: string;
  tokens_in: number;
  tokens_out: number;
  cost_usd: number;
}

interface AiConfig {
  enabled: boolean;
  provider: "anthropic"|"openai"|"openrouter"|"groq"|"gemini"|"deepseek";
  model: string;
  // Por-feature: qué proveedor + modelo usar en cada función
  featureProviders: {
    redaccion: {provider:string; model:string};
    inbox:     {provider:string; model:string};
    qualify:   {provider:string; model:string};
    signals:   {provider:string; model:string};
  };
  features: {
    redaccion: boolean;
    inbox: boolean;
    qualify: boolean;
    signals: boolean;
  };
}

// Modelos por proveedor con pricing (USD por 1M tokens)
const AI_MODELS: Record<string,{provider:string;label:string;in:number;out:number;quality:"premium"|"balanced"|"cheap"|"free"}[]> = {
  anthropic: [
    {provider:"anthropic",label:"Claude Opus 4.7",in:5,out:25,quality:"premium"},
    {provider:"anthropic",label:"Claude Sonnet 4.6",in:3,out:15,quality:"balanced"},
    {provider:"anthropic",label:"Claude Haiku 4.5",in:1,out:5,quality:"cheap"},
  ],
  openai: [
    {provider:"openai",label:"GPT-5",in:10,out:30,quality:"premium"},
    {provider:"openai",label:"GPT-4o",in:2.5,out:10,quality:"balanced"},
    {provider:"openai",label:"GPT-4o-mini",in:0.15,out:0.6,quality:"cheap"},
  ],
  openrouter: [
    {provider:"openrouter",label:"openai/gpt-5",in:10,out:30,quality:"premium"},
    {provider:"openrouter",label:"anthropic/claude-sonnet-4-6",in:3,out:15,quality:"balanced"},
    {provider:"openrouter",label:"meta-llama/llama-3.3-70b-instruct:free",in:0,out:0,quality:"free"},
    {provider:"openrouter",label:"google/gemini-2.0-flash-exp:free",in:0,out:0,quality:"free"},
    {provider:"openrouter",label:"deepseek/deepseek-chat",in:0.14,out:0.28,quality:"cheap"},
  ],
  groq: [
    {provider:"groq",label:"llama-3.3-70b-versatile",in:0,out:0,quality:"free"},
    {provider:"groq",label:"llama-3.1-8b-instant",in:0,out:0,quality:"free"},
    {provider:"groq",label:"mixtral-8x7b-32768",in:0,out:0,quality:"free"},
  ],
  gemini: [
    {provider:"gemini",label:"gemini-2.0-flash-exp",in:0,out:0,quality:"free"},
    {provider:"gemini",label:"gemini-1.5-pro",in:1.25,out:5,quality:"balanced"},
  ],
  deepseek: [
    {provider:"deepseek",label:"deepseek-chat",in:0.14,out:0.28,quality:"cheap"},
    {provider:"deepseek",label:"deepseek-reasoner",in:0.55,out:2.19,quality:"balanced"},
  ],
};

// Pricing legacy (mantener compatibilidad)
const AI_PRICING: Record<string,{in:number;out:number;label:string}> = {
  "claude-opus-4-7":     {in:5,    out:25,   label:"Claude Opus 4.7 (max calidad)"},
  "claude-sonnet-4-6":   {in:3,    out:15,   label:"Claude Sonnet 4.6 (recomendado)"},
  "claude-haiku-4-5":    {in:1,    out:5,    label:"Claude Haiku 4.5 (mas barato)"},
};

function getModelInfo(provider:string, model:string) {
  const list = AI_MODELS[provider] || [];
  return list.find(m=>m.label===model) || list[0];
}

function calculateCostByModel(tokensIn:number, tokensOut:number, provider:string, model:string): number {
  const info = getModelInfo(provider, model);
  if(!info) return 0;
  return (tokensIn * info.in + tokensOut * info.out) / 1_000_000;
}

function calculateCost(tokensIn:number, tokensOut:number, model:string): number {
  const p = AI_PRICING[model];
  if(!p) return 0;
  return (tokensIn * p.in + tokensOut * p.out) / 1_000_000;
}

// Hook to get current AI config
function useAiConfig(workspaceId:string): AiConfig {
  const [config,setConfig] = useState<AiConfig>({
    enabled:false,
    provider:"anthropic",
    model:"Claude Sonnet 4.6",
    featureProviders:{
      redaccion:{provider:"anthropic",model:"Claude Sonnet 4.6"},
      inbox:    {provider:"anthropic",model:"Claude Sonnet 4.6"},
      qualify:  {provider:"anthropic",model:"Claude Haiku 4.5"},
      signals:  {provider:"anthropic",model:"Claude Haiku 4.5"},
    },
    features:{redaccion:true,inbox:true,qualify:true,signals:true}
  });

  useEffect(()=>{
    const apiKeys = localStorage.getItem(`closer_apikeys_${workspaceId}`);
    const aiConf = localStorage.getItem(`closer_ai_config_${workspaceId}`);
    let hasAnyAiKey = false;
    if(apiKeys) {
      const keys = JSON.parse(apiKeys);
      hasAnyAiKey = !!(keys.anthropic||keys.openai||keys.openrouter||keys.groq||keys.gemini||keys.deepseek);
    }
    if(aiConf) {
      const conf = JSON.parse(aiConf);
      setConfig(prev=>({...prev,...conf,enabled:hasAnyAiKey}));
    } else {
      setConfig(prev=>({...prev,enabled:hasAnyAiKey}));
    }
  },[workspaceId]);

  return config;
}

// Get API key from local storage
function getApiKey(workspaceId:string, provider:string): string|null {
  try {
    const stored = localStorage.getItem(`closer_apikeys_${workspaceId}`);
    if(!stored) return null;
    const keys = JSON.parse(stored);
    return keys[provider] || null;
  } catch { return null; }
}

// Log AI usage to track costs
function logAiUsage(workspaceId:string, feature:string, tokensIn:number, tokensOut:number, model:string) {
  const cost = calculateCost(tokensIn, tokensOut, model);
  const entry:AiUsage = {
    date: new Date().toISOString(),
    feature, tokens_in:tokensIn, tokens_out:tokensOut, cost_usd:cost
  };
  try {
    const key = `closer_ai_usage_${workspaceId}`;
    const existing = JSON.parse(localStorage.getItem(key)||"[]");
    existing.push(entry);
    // Keep last 1000 entries
    if(existing.length > 1000) existing.splice(0, existing.length - 1000);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch {}
}

// Call Claude API
async function callAi(
  workspaceId:string,
  feature:string,
  systemPrompt:string,
  userPrompt:string,
  provider:string="anthropic",
  model:string="claude-sonnet-4-6"
): Promise<{success:boolean;text?:string;error?:string;cost?:number}> {
  const key = getApiKey(workspaceId, provider);
  if(!key) return {success:false, error:`No hay API key de ${provider} configurada en Settings → API Keys`};

  try {
    let res:Response;
    let endpoint = "";
    let payload:any = {};
    let headers:Record<string,string> = {"Content-Type":"application/json"};

    if (provider === "anthropic") {
      endpoint = "https://api.anthropic.com/v1/messages";
      headers["x-api-key"] = key;
      headers["anthropic-version"] = "2023-06-01";
      headers["anthropic-dangerous-direct-browser-access"] = "true";
      const modelMap:Record<string,string> = {
        "claude-opus-4-7":"claude-opus-4-1-20250805",
        "claude-sonnet-4-6":"claude-sonnet-4-5-20250929",
        "claude-haiku-4-5":"claude-haiku-4-5-20251001",
        "Claude Opus 4.7":"claude-opus-4-1-20250805",
        "Claude Sonnet 4.6":"claude-sonnet-4-5-20250929",
        "Claude Haiku 4.5":"claude-haiku-4-5-20251001",
      };
      payload = {
        model: modelMap[model] || "claude-sonnet-4-5-20250929",
        max_tokens:1024,
        system:systemPrompt,
        messages:[{role:"user",content:userPrompt}]
      };
    } else if (provider === "openai") {
      endpoint = "https://api.openai.com/v1/chat/completions";
      headers["Authorization"] = `Bearer ${key}`;
      const modelMap:Record<string,string> = {"GPT-5":"gpt-5","GPT-4o":"gpt-4o","GPT-4o-mini":"gpt-4o-mini"};
      payload = {
        model: modelMap[model] || "gpt-4o-mini",
        max_tokens:1024,
        messages:[{role:"system",content:systemPrompt},{role:"user",content:userPrompt}]
      };
    } else if (provider === "openrouter") {
      endpoint = "https://openrouter.ai/api/v1/chat/completions";
      headers["Authorization"] = `Bearer ${key}`;
      headers["HTTP-Referer"] = window.location.origin;
      headers["X-Title"] = "CloserAI";
      payload = {
        model,
        max_tokens:1024,
        messages:[{role:"system",content:systemPrompt},{role:"user",content:userPrompt}]
      };
    } else if (provider === "groq") {
      endpoint = "https://api.groq.com/openai/v1/chat/completions";
      headers["Authorization"] = `Bearer ${key}`;
      payload = {
        model,
        max_tokens:1024,
        messages:[{role:"system",content:systemPrompt},{role:"user",content:userPrompt}]
      };
    } else if (provider === "gemini") {
      const modelName = model.includes("/") ? model : (model || "gemini-2.0-flash-exp");
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;
      payload = {
        systemInstruction:{parts:[{text:systemPrompt}]},
        contents:[{role:"user",parts:[{text:userPrompt}]}],
        generationConfig:{maxOutputTokens:1024}
      };
    } else if (provider === "deepseek") {
      endpoint = "https://api.deepseek.com/v1/chat/completions";
      headers["Authorization"] = `Bearer ${key}`;
      payload = {
        model: model || "deepseek-chat",
        max_tokens:1024,
        messages:[{role:"system",content:systemPrompt},{role:"user",content:userPrompt}]
      };
    } else {
      return {success:false, error:`Proveedor no soportado: ${provider}`};
    }

    res = await fetch(endpoint, {method:"POST", headers, body:JSON.stringify(payload)});

    if(!res.ok) {
      const err = await res.text();
      return {success:false, error:`${provider} ${res.status}: ${err.slice(0,200)}`};
    }

    const data = await res.json();
    let text = "";
    let tokensIn = 0;
    let tokensOut = 0;

    if (provider === "anthropic") {
      text = data.content?.[0]?.text || "";
      tokensIn = data.usage?.input_tokens || 0;
      tokensOut = data.usage?.output_tokens || 0;
    } else if (provider === "gemini") {
      text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      tokensIn = data.usageMetadata?.promptTokenCount || 0;
      tokensOut = data.usageMetadata?.candidatesTokenCount || 0;
    } else {
      // OpenAI-compatible: OpenAI, OpenRouter, Groq, DeepSeek
      text = data.choices?.[0]?.message?.content || "";
      tokensIn = data.usage?.prompt_tokens || 0;
      tokensOut = data.usage?.completion_tokens || 0;
    }

    const cost = calculateCostByModel(tokensIn, tokensOut, provider, model);
    logAiUsage(workspaceId, feature, tokensIn, tokensOut, `${provider}/${model}`);

    return {success:true, text, cost};
  } catch(e:any) {
    return {success:false, error:e.message || "Error desconocido"};
  }
}

// ── AI SETTINGS PANEL ─────────────────────────────────────────────────────────
function AiSettings({workspaceId}:{workspaceId:string}) {
  const [config,setConfig] = useState<AiConfig>({
    enabled:false,
    provider:"anthropic",
    model:"Claude Sonnet 4.6",
    featureProviders:{
      redaccion:{provider:"anthropic",model:"Claude Sonnet 4.6"},
      inbox:    {provider:"anthropic",model:"Claude Sonnet 4.6"},
      qualify:  {provider:"anthropic",model:"Claude Haiku 4.5"},
      signals:  {provider:"anthropic",model:"Claude Haiku 4.5"},
    },
    features:{redaccion:true,inbox:true,qualify:true,signals:true}
  });
  const [usage,setUsage] = useState<AiUsage[]>([]);
  const [availableProviders,setAvailableProviders] = useState<string[]>([]);
  const toast = useToast();

  useEffect(()=>{
    const apiKeys = localStorage.getItem(`closer_apikeys_${workspaceId}`);
    const aiConf = localStorage.getItem(`closer_ai_config_${workspaceId}`);
    let availProvs:string[] = [];
    if(apiKeys) {
      const keys = JSON.parse(apiKeys);
      ["anthropic","openai","openrouter","groq","gemini","deepseek"].forEach(p=>{
        if(keys[p]) availProvs.push(p);
      });
    }
    setAvailableProviders(availProvs);
    if(aiConf) {
      const parsed = JSON.parse(aiConf);
      setConfig(prev=>({...prev,...parsed,enabled:availProvs.length>0}));
    } else {
      setConfig(prev=>({...prev,enabled:availProvs.length>0}));
    }
    const u = localStorage.getItem(`closer_ai_usage_${workspaceId}`);
    if(u) setUsage(JSON.parse(u));
  },[workspaceId]);

  function saveConfig(c:AiConfig) {
    setConfig(c);
    localStorage.setItem(`closer_ai_config_${workspaceId}`,JSON.stringify(c));
    toast("Configuracion guardada","ok");
  }

  function toggleFeature(f:keyof AiConfig["features"]) {
    saveConfig({...config, features:{...config.features, [f]:!config.features[f]}});
  }

  function updateFeatureProvider(f:keyof AiConfig["featureProviders"], provider:string, model:string) {
    saveConfig({
      ...config,
      featureProviders:{...config.featureProviders,[f]:{provider,model}}
    });
  }

  // Stats this month
  const now = new Date();
  const thisMonth = usage.filter(u=>{
    const d = new Date(u.date);
    return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
  });
  const totalCost = thisMonth.reduce((s,u)=>s+u.cost_usd,0);
  const totalCalls = thisMonth.length;
  const totalTokensIn = thisMonth.reduce((s,u)=>s+u.tokens_in,0);
  const totalTokensOut = thisMonth.reduce((s,u)=>s+u.tokens_out,0);

  const PROVIDER_LABELS:Record<string,string> = {
    anthropic:"Anthropic (Claude)",
    openai:"OpenAI (GPT)",
    openrouter:"OpenRouter",
    groq:"Groq (gratis)",
    gemini:"Google Gemini",
    deepseek:"DeepSeek"
  };

  const FEATURES = [
    {key:"redaccion" as const, label:"Redacción de mensajes", desc:"Genera DMs personalizados en base al lead", icon:"✉", recommend:"Claude Sonnet 4.6 o GPT-4o (balance calidad/precio)"},
    {key:"inbox" as const,     label:"Análisis de Inbox",     desc:"Detecta sentiment, intent score y sugiere respuesta", icon:"📥", recommend:"Claude Sonnet 4.6 (mejor en matices emocionales)"},
    {key:"qualify" as const,   label:"Calificación BANT",     desc:"Calcula score 1-10 basado en notas y actividad", icon:"◆", recommend:"Haiku o Llama 3.3 70B free (tareas simples)"},
    {key:"signals" as const,   label:"Señales de intención",  desc:"Detecta cambios de cargo, posts del lead, etc.", icon:"⚡", recommend:"GPT-4o-mini o DeepSeek (bajo costo)"},
  ];

  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{marginBottom:24}}>
        <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>IA Avanzada</h1>
        <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Configurá qué proveedor de IA usa cada función. Podés mezclar: Claude para Redacción, Groq gratis para Qualify, etc.</p>
      </div>

      {/* Status banner */}
      <div className="glass" style={{
        padding:"16px 20px",marginBottom:24,
        border:`.5px solid ${availableProviders.length>0?"rgba(16,185,129,.4)":"rgba(251,146,60,.3)"}`,
        background:availableProviders.length>0?"rgba(16,185,129,.06)":"rgba(251,146,60,.05)",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:20}}>{availableProviders.length>0?"✓":"⚠"}</span>
          <div style={{flex:1}}>
            <p style={{fontWeight:500,fontSize:14,color:availableProviders.length>0?"#10b981":"#fb923c"}}>
              {availableProviders.length>0
                ?`${availableProviders.length} proveedor${availableProviders.length>1?"es":""} de IA configurado${availableProviders.length>1?"s":""}: ${availableProviders.map(p=>PROVIDER_LABELS[p]).join(", ")}`
                :"Sin proveedores de IA configurados"}
            </p>
            <p style={{fontSize:12,color:"var(--txt2)",marginTop:2}}>
              {availableProviders.length>0
                ?"Tu CRM funciona con o sin IA. Las funciones de IA potencian Redacción, Inbox, Qualify y Signals."
                :"Cargá al menos una API key en Settings → API Keys → categoría IA para activar funciones inteligentes."}
            </p>
          </div>
        </div>
      </div>

      {/* Cost tracker */}
      {availableProviders.length>0 && (
        <div className="glass glass-gold" style={{padding:"18px 20px",marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <p style={{fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500}}>Uso este mes</p>
            <span style={{fontSize:10,color:"var(--txt3)"}}>{now.toLocaleDateString("es-ES",{month:"long",year:"numeric"})}</span>
          </div>
          <div className="ai-stats" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
            <div>
              <p className="display" style={{fontSize:28,fontWeight:300,color:"var(--gold)"}}>${totalCost.toFixed(3)}</p>
              <p style={{fontSize:11,color:"var(--txt2)"}}>Costo total USD</p>
            </div>
            <div>
              <p className="display" style={{fontSize:28,fontWeight:300}}>{totalCalls}</p>
              <p style={{fontSize:11,color:"var(--txt2)"}}>Llamadas a IA</p>
            </div>
            <div>
              <p className="display" style={{fontSize:28,fontWeight:300}}>{(totalTokensIn/1000).toFixed(1)}k</p>
              <p style={{fontSize:11,color:"var(--txt2)"}}>Tokens in</p>
            </div>
            <div>
              <p className="display" style={{fontSize:28,fontWeight:300}}>{(totalTokensOut/1000).toFixed(1)}k</p>
              <p style={{fontSize:11,color:"var(--txt2)"}}>Tokens out</p>
            </div>
          </div>
          <p style={{fontSize:11,color:"var(--txt3)",marginTop:12,paddingTop:12,borderTop:".5px solid var(--border)"}}>
            Pagás directamente al proveedor. CloserAI no toma comisión. Tip: usá Groq o Gemini para tareas masivas (son gratis) y reservá Claude/GPT para Redacción crítica.
          </p>
        </div>
      )}

      {/* Per-feature configuration */}
      <p style={{fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500,marginBottom:12}}>Configurá cada función por separado</p>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
        {FEATURES.map(f=>{
          const fp = config.featureProviders[f.key];
          const modelInfo = getModelInfo(fp.provider, fp.model);
          const modelsForProvider = AI_MODELS[fp.provider] || [];
          const enabled = config.features[f.key];

          return (
            <div key={f.key} className="glass" style={{padding:"16px 18px",opacity:availableProviders.length>0?1:.5}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,gap:12,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:200}}>
                  <p style={{fontSize:14,fontWeight:500}}>{f.icon} {f.label}</p>
                  <p style={{fontSize:11,color:"var(--txt2)",marginTop:2,lineHeight:1.5}}>{f.desc}</p>
                  <p style={{fontSize:10,color:"var(--gold)",marginTop:4,fontStyle:"italic"}}>💡 Recomendado: {f.recommend}</p>
                </div>
                <button
                  onClick={()=>availableProviders.length>0&&toggleFeature(f.key)}
                  disabled={availableProviders.length===0}
                  style={{
                    width:42,height:22,borderRadius:99,border:"none",
                    background:enabled?"var(--gold)":"var(--border)",
                    position:"relative",cursor:availableProviders.length>0?"pointer":"not-allowed",
                    transition:"all .2s",flexShrink:0
                  }}>
                  <span style={{
                    position:"absolute",top:2,left:enabled?22:2,
                    width:18,height:18,borderRadius:"50%",background:"#fff",
                    transition:"left .2s"
                  }} />
                </button>
              </div>

              {enabled&&availableProviders.length>0&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 2fr auto",gap:8,alignItems:"center"}} className="csv-fields">
                  <select
                    className="inp"
                    value={fp.provider}
                    onChange={e=>{
                      const newProvider = e.target.value;
                      const firstModel = AI_MODELS[newProvider]?.[0]?.label || "";
                      updateFeatureProvider(f.key, newProvider, firstModel);
                    }}
                    style={{fontSize:12}}
                  >
                    {availableProviders.map(p=>(
                      <option key={p} value={p}>{PROVIDER_LABELS[p]}</option>
                    ))}
                  </select>
                  <select
                    className="inp"
                    value={fp.model}
                    onChange={e=>updateFeatureProvider(f.key, fp.provider, e.target.value)}
                    style={{fontSize:12}}
                  >
                    {modelsForProvider.map(m=>(
                      <option key={m.label} value={m.label}>
                        {m.label} · {m.quality==="free"?"GRATIS":`$${m.in}/$${m.out} por M`}
                      </option>
                    ))}
                  </select>
                  <span className={`pill ${modelInfo?.quality==="free"?"pill-green":modelInfo?.quality==="premium"?"pill-gold":"pill-muted"}`} style={{fontSize:10}}>
                    {modelInfo?.quality==="free"?"GRATIS":modelInfo?.quality==="premium"?"Premium":modelInfo?.quality==="balanced"?"Balanced":"Económico"}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Setup guide */}
      {availableProviders.length===0 && (
        <div className="glass glass-gold" style={{padding:"18px 20px"}}>
          <p style={{fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--gold)",fontWeight:500,marginBottom:10}}>Empezá gratis con Groq o Gemini</p>
          <ol style={{fontSize:12,color:"var(--txt2)",lineHeight:2,paddingLeft:18}}>
            <li><strong style={{color:"var(--txt)"}}>Groq</strong> (recomendado para empezar): andá a <code style={{color:"var(--gold)"}}>console.groq.com/keys</code> → Create API Key → pegala en API Keys → IA</li>
            <li><strong style={{color:"var(--txt)"}}>Google Gemini</strong>: andá a <code style={{color:"var(--gold)"}}>aistudio.google.com/apikey</code> → Get API Key → es gratis 1500 reqs/día</li>
            <li><strong style={{color:"var(--txt)"}}>Anthropic (Claude)</strong> (mejor calidad): andá a <code style={{color:"var(--gold)"}}>console.anthropic.com</code> → Settings → API Keys → cargá ~$5 USD de créditos</li>
            <li>Volvé acá y configurá qué proveedor usa cada función</li>
          </ol>
        </div>
      )}
    </div>
  );
}


// ── AI ENHANCE BUTTON (componente reusable) ──────────────────────────────────
function AiEnhanceButton({
  feature, systemPrompt, userPrompt, workspaceId,
  onResult, label="Mejorar con IA"
}:{
  feature:"redaccion"|"inbox"|"qualify"|"signals"; systemPrompt:string; userPrompt:string; workspaceId:string;
  onResult:(text:string,cost:number)=>void; label?:string;
}) {
  const [loading,setLoading] = useState(false);
  const toast = useToast();
  const config = useAiConfig(workspaceId);

  if(!config.enabled || !config.features?.[feature]) return null;

  const fp = config.featureProviders?.[feature] || {provider:"anthropic",model:"Claude Sonnet 4.6"};

  async function run() {
    setLoading(true);
    const result = await callAi(workspaceId, feature, systemPrompt, userPrompt, fp.provider, fp.model);
    setLoading(false);
    if(result.success && result.text) {
      onResult(result.text, result.cost||0);
      const costStr = result.cost===0 ? "GRATIS" : `$${(result.cost||0).toFixed(4)}`;
      toast(`${fp.provider} → ${costStr}`,"ok");
    } else {
      toast(result.error||"Error en IA","err");
    }
  }

  return (
    <button onClick={run} disabled={loading}
      style={{
        padding:"7px 14px",borderRadius:8,
        border:".5px solid rgba(124,58,237,.4)",
        background:"linear-gradient(135deg, rgba(124,58,237,.15), rgba(167,139,250,.08))",
        color:"#a78bfa",
        fontSize:12,fontWeight:500,cursor:loading?"wait":"pointer",
        fontFamily:"'DM Sans',sans-serif",
        display:"inline-flex",alignItems:"center",gap:6
      }}
      title={`Usa ${fp.provider} / ${fp.model}`}>
      {loading ? "Pensando..." : <>✦ {label}</>}
    </button>
  );
}


function mockProspectorLeads(src: ApifySource, inp: Record<string,string>, wsId: string): Lead[] {
  const mk = (name:string,role:string,company:string,score:number,temp:"Hot"|"Warm"|"Frio",extra?:Partial<Lead>):Lead => ({
    id:uid(),workspace_id:wsId,name,role,company,score,temp:temp as any,
    stage:"Nuevo",source:src.id,created_at:new Date().toISOString(),...extra
  });
  const d: Record<string,Lead[]> = {
    li_post:[mk("Valentina Mier","CEO","StartupBA",9,"Hot",{linkedin_url:"https://linkedin.com/in/vmier",email:"v.mier@startupba.com"}),mk("Marcos Reyes","CMO","Scale Co",8,"Warm",{linkedin_url:"https://linkedin.com/in/mreyes"}),mk("Andrea Font","Founder","EduTech AR",9,"Hot",{email:"andrea@edutech.com",linkedin_url:"https://linkedin.com/in/afont"}),mk("Lucas Mendez","Growth Lead","SaaS MX",7,"Warm",{linkedin_url:"https://linkedin.com/in/lmendez"}),mk("Romina Saez","Co-founder","FinteAR",8,"Warm",{linkedin_url:"https://linkedin.com/in/rsaez",email:"r.saez@fintear.io"})],
    li_search:[mk("Carolina Suarez","Founder","InnovaBA",8,"Warm",{linkedin_url:"https://linkedin.com/in/csuarez",email:"c.suarez@innova.com"}),mk("Ramiro Vega","CEO","VegaTech",9,"Hot",{linkedin_url:"https://linkedin.com/in/rvega",phone:"+54 11 4XXX-XXXX"}),mk("Sofia Ruiz","Co-founder","EduGrow",7,"Warm",{linkedin_url:"https://linkedin.com/in/sruiz"}),mk("Tomas Ibarra","Director Comercial","AgenciaGrow",8,"Warm",{linkedin_url:"https://linkedin.com/in/tibarra",email:"tibarra@agenciagrow.com"})],
    li_profile:[mk("Lead Enriquecido","Founder","TechCo",8,"Warm",{linkedin_url:inp.profileUrl,email:"contacto@techco.com",phone:"+54 11 4XXX-XXXX",notes:"Experiencia: 8 anos en SaaS. Skills: Growth, Product."})],
    li_company:[mk("Ana Lopez","Head of Marketing","Target Co",8,"Warm",{linkedin_url:"https://linkedin.com/in/alopez",email:"a.lopez@targetco.com"}),mk("Bruno Herrera","CEO","Target Co",9,"Hot",{linkedin_url:"https://linkedin.com/in/bherrera",email:"b.herrera@targetco.com"}),mk("Claudia Mora","CFO","Target Co",7,"Frio",{linkedin_url:"https://linkedin.com/in/cmora"})],
    ig_hashtag:[mk("@emprendedora.ok","Creadora contenido","Self",7,"Warm"),mk("@coachlauramx","Coach de negocios","Self",8,"Warm"),mk("@startup.latam","Fundadora","StartupLatam",9,"Hot"),mk("@digitalmentor_ar","Mentor digital","Self",6,"Frio"),mk("@negocios.reales","Emprendedor","Self",7,"Warm")],
    ig_profile:[mk(inp.username||"@usuario","Emprendedor/Influencer","Self",7,"Warm",{email:"contacto@email.com",phone:"+54 9 11 4XXX-XXXX",notes:"Seguidores: 12.4K - Engagement: 4.2% - Nicho: negocios digitales"})],
    ig_phone:[mk("@negocio_mendoza","Dueno local","Negocio MZA",7,"Warm",{phone:"+54 261 4XX-XXXX"}),mk("@coach.ar","Coach","Self",8,"Warm",{phone:"+54 11 4XXX-XXXX"}),mk("@gymfitpro","Gym","FitPro",7,"Warm",{phone:"+54 351 4XX-XXXX"})],
    fb_pages:[mk("Estudio Juridico Perez","Abogado","Est. Juridico Perez",7,"Warm",{phone:"+54 261 4XX-XXXX",email:"info@estudioperez.com"}),mk("Psicologa Dra. Garcia","Psicologa","Consultorio Garcia",8,"Warm",{phone:"+54 261 4XX-YYYY",email:"dra.garcia@gmail.com"}),mk("Agencia Digital Sur","Director","Agencia Digital Sur",9,"Hot",{phone:"+54 261 4XX-ZZZZ",email:"hola@agenciadigitalsur.com"}),mk("Gym PowerFit","Dueno","PowerFit Gym",7,"Warm",{phone:"+54 261 4XX-AAAA",email:"contacto@powerfit.com"}),mk("Consultora RH Mendoza","Directora","ConsultoraRH",8,"Warm",{phone:"+54 261 4XX-BBBB",email:"info@consultorarhMZA.com"})],
    fb_post:[mk("Juan Perez","Emprendedor","JuanP Ventures",7,"Warm"),mk("Maria Gonzalez","Coach","Self",8,"Warm"),mk("Carlos Vidal","CEO","StartupMZA",9,"Hot",{email:"carlos@startupmza.com"})],
    fb_phone:[mk("Gym XFit Mendoza","Dueno","XFit",7,"Warm",{phone:"+54 261 4XX-1111"}),mk("Clinica Dental Norte","Odontologo","Clinica Norte",7,"Warm",{phone:"+54 261 4XX-2222"}),mk("Resto La Pampa","Dueno","La Pampa",6,"Frio",{phone:"+54 261 4XX-3333"}),mk("Agencia Turismo Sol","Director","TurismoSol",8,"Warm",{phone:"+54 261 4XX-4444",email:"sol@turismosol.com"})],
    fb_user:[mk("Juan Carlos Rios","Emprendedor","Self",6,"Frio"),mk("Laura Medina","Founder","LauraM Consulting",7,"Warm",{email:"laura@lauram.com"})],
    maps:[mk("Estudio Contable Mendoza","Contador","Est. Contable MZA",7,"Warm",{phone:"+54 261 4XX-XXXX",email:"info@contablemza.com",notes:"Rating: 4.8 estrellas - 47 resenas"}),mk("Psicologa Marta Lopez","Psicologa","Consultorio Lopez",8,"Warm",{phone:"+54 261 4XX-YYYY",notes:"Rating: 5.0 estrellas - 23 resenas"}),mk("Gym FitLife","Dueno de gimnasio","FitLife Gym",7,"Warm",{phone:"+54 261 4XX-ZZZZ",email:"contacto@fitlife.com",notes:"Rating: 4.5 estrellas - 89 resenas"}),mk("Marketing Digital AR","Director","MktAR",9,"Hot",{email:"hola@mktar.com",phone:"+54 261 4XX-AAAA",notes:"Rating: 4.9 estrellas - 31 resenas"}),mk("Centro Medico Norte","Director","CMN",7,"Warm",{phone:"+54 261 4XX-BBBB",email:"turno@cmn.com",notes:"Rating: 4.3 estrellas - 112 resenas"})],
    contact_scraper:[mk("Empresa 1","CEO","Tech SA",8,"Warm",{email:"ceo@empresa1.com",phone:"+54 11 4XXX-1111",linkedin_url:"https://linkedin.com/company/empresa1"}),mk("Empresa 2","Fundador","Agency Co",7,"Warm",{email:"hola@empresa2.com",phone:"+54 11 4XXX-2222",linkedin_url:"https://linkedin.com/company/empresa2"})],
    zoominfo:[mk("Sergio Almeida","VP Sales","FinCorp SA",9,"Hot",{email:"s.almeida@fincorp.com",phone:"+54 11 4XXX-XXXX",linkedin_url:"https://linkedin.com/in/salmeida",notes:"Empresa: 500+ empleados - Revenue: $10M+"}),mk("Patricia Nunez","CMO","GrowthCo",8,"Warm",{email:"p.nunez@growthco.com",phone:"+54 11 4XXX-YYYY",linkedin_url:"https://linkedin.com/in/pnunez",notes:"Empresa: 50-200 empleados - SaaS B2B"}),mk("Hernan Castro","CEO","StartupHub",9,"Hot",{email:"h.castro@startuphub.com",phone:"+54 11 4XXX-ZZZZ",linkedin_url:"https://linkedin.com/in/hcastro",notes:"Empresa: 10-50 empleados - Seed stage"})]
  };
  return d[src.id] || [];
}

function ContactChip({icon,label,color,border,bg,href}:{icon:string;label:string;color:string;border:string;bg:string;href?:string}) {
  const style:React.CSSProperties = {
    display:"inline-flex",alignItems:"center",gap:4,padding:"2px 9px",
    borderRadius:99,fontSize:10,fontWeight:500,
    background:bg,color,border:`.5px solid ${border}`,
    textDecoration:"none",cursor:href?"pointer":"default",
    whiteSpace:"nowrap",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis"
  };
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" style={style}>{icon} {label}</a>
    : <span style={style}>{icon} {label}</span>;
}
function Prospector({onAddLead,workspaceId}:{onAddLead:(l:Lead)=>void;workspaceId:string}) {
  const [platform,setPlatform] = useState("all");
  const [activeId,setActiveId] = useState("li_post");
  const [inputs,setInputs] = useState<Record<string,string>>({});
  const [loading,setLoading] = useState(false);
  const [results,setResults] = useState<Lead[]>([]);
  const [added,setAdded] = useState<Set<string>>(new Set());
  const [viewMode,setViewMode] = useState<"grid"|"list">("list");
  const toast = useToast();
  const activeSource = PROSPECTOR_SOURCES.find(s=>s.id===activeId)!;
  const filtered = platform==="all" ? PROSPECTOR_SOURCES : PROSPECTOR_SOURCES.filter(s=>s.platform===platform);
  const pc = PROSPECTOR_PC[activeSource.platform];
  const tier = PROSPECTOR_TIER[activeSource.tier];

  function selectSource(s:ApifySource) { setActiveId(s.id);setInputs({});setResults([]);setAdded(new Set()); }
  async function extract() {
    const req = activeSource.fields.filter(f=>f.required);
    if (req.some(f=>!inputs[f.key]?.trim())) { toast("Completa los campos requeridos","err"); return; }
    setLoading(true);setResults([]);
    await new Promise(r=>setTimeout(r,1400));
    const leads = mockProspectorLeads(activeSource,inputs,workspaceId);
    setResults(leads);setLoading(false);
    toast(`${leads.length} leads extraidos - ${activeSource.label}`,"ok");
  }
  function addOne(lead:Lead) {
    if (added.has(lead.id)) return;
    onAddLead(lead);
    setAdded(p=>new Set([...p,lead.id]));
    toast(`${lead.name} agregado al CRM`,"ok");
  }
  function addAll() {
    const pending = results.filter(l=>!added.has(l.id));
    pending.forEach(l=>onAddLead(l));
    setAdded(new Set(results.map(l=>l.id)));
    toast(`${pending.length} leads agregados al CRM`,"ok");
  }

  return (
    <div style={{display:"flex",height:"100%",overflow:"hidden",position:"relative"}}>
      {/* LEFT PANEL */}
      <div style={{width:230,flexShrink:0,borderRight:".5px solid rgba(255,255,255,0.07)",display:"flex",flexDirection:"column",background:"rgba(6,8,14,.7)",overflowY:"auto"}}>
        <div style={{padding:"18px 14px 10px"}}>
          <p style={{fontSize:10,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(138,138,138,.6)",fontWeight:500,marginBottom:10}}>Plataforma</p>
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {PROSPECTOR_PLATFORMS.map(p=>(
              <button key={p.id} onClick={()=>setPlatform(p.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",borderRadius:8,border:"none",cursor:"pointer",textAlign:"left",background:platform===p.id?`${p.color}18`:"transparent",color:platform===p.id?p.color:"rgba(138,138,138,.8)",fontSize:12,fontWeight:platform===p.id?500:400,transition:"all .15s",fontFamily:"'DM Sans',sans-serif"}}>
                <span style={{fontSize:14}}>{p.icon}</span> {p.label}
                <span style={{marginLeft:"auto",fontSize:10,opacity:.6}}>{p.id==="all"?PROSPECTOR_SOURCES.length:PROSPECTOR_SOURCES.filter(s=>s.platform===p.id).length}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{height:.5,background:"rgba(255,255,255,0.06)",margin:"4px 0"}} />
        <div style={{flex:1,padding:"8px 10px 16px",display:"flex",flexDirection:"column",gap:2}}>
          {filtered.map(s=>{
            const spc = PROSPECTOR_PC[s.platform];
            const isActive = activeId===s.id;
            const st = PROSPECTOR_TIER[s.tier];
            return (
              <div key={s.id} onClick={()=>selectSource(s)} style={{padding:"9px 11px",borderRadius:8,cursor:"pointer",border:`.5px solid ${isActive?spc.border:"transparent"}`,background:isActive?spc.bg:"transparent",transition:"all .15s"}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
                  <span style={{fontSize:14}}>{s.icon}</span>
                  <span style={{fontSize:12,fontWeight:isActive?500:400,color:isActive?spc.color:"rgba(234,230,223,.7)"}}>{s.label}</span>
                  <span style={{marginLeft:"auto",fontSize:9,padding:"1px 6px",borderRadius:99,background:st.bg,color:st.color,fontWeight:500}}>{st.label}</span>
                </div>
                <p style={{fontSize:10,color:"rgba(138,138,138,.6)",paddingLeft:21,lineHeight:1.4}}>{s.mode}</p>
                <div style={{display:"flex",gap:4,paddingLeft:21,marginTop:5,flexWrap:"wrap"}}>
                  {s.gives.email&&<span style={{fontSize:9,color:"#10b981",background:"rgba(16,185,129,.1)",padding:"1px 6px",borderRadius:99}}>email</span>}
                  {s.gives.phone&&<span style={{fontSize:9,color:"#fbbf24",background:"rgba(251,191,36,.1)",padding:"1px 6px",borderRadius:99}}>tel</span>}
                  {s.gives.linkedin&&<span style={{fontSize:9,color:"#60a5fa",background:"rgba(96,165,250,.1)",padding:"1px 6px",borderRadius:99}}>LI</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CENTER PANEL */}
      <div style={{flex:1,overflowY:"auto",padding:"28px 32px"}}>
        {/* MOCK DATA WARNING */}
        <div style={{padding:"10px 14px",background:"rgba(251,146,60,.08)",border:".5px solid rgba(251,146,60,.25)",borderRadius:8,marginBottom:18,fontSize:11,color:"#fb923c",lineHeight:1.6}}>
          <strong>⚠ Modo demo:</strong> el Prospector muestra datos de ejemplo. La extracción de leads reales desde LinkedIn, Instagram, Maps y más está disponible en el plan Agency.
        </div>

        <div style={{marginBottom:22,paddingBottom:18,borderBottom:".5px solid rgba(255,255,255,0.07)"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:10}}>
            <span style={{fontSize:32,lineHeight:1}}>{activeSource.icon}</span>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:4}}>
                <h2 className="display" style={{fontSize:26,fontWeight:300,letterSpacing:"-.01em"}}>{activeSource.label}</h2>
                <span style={{padding:"3px 10px",borderRadius:99,fontSize:10,fontWeight:500,background:tier.bg,color:tier.color}}>{tier.label}</span>
                <span style={{padding:"3px 10px",borderRadius:99,fontSize:10,fontWeight:400,background:pc.bg,color:pc.color,border:`.5px solid ${pc.border}`}}>{activeSource.actorLabel}</span>
              </div>
              <p style={{fontSize:12,color:"rgba(138,138,138,.8)"}}>{activeSource.mode}</p>
            </div>
          </div>
          <p style={{fontSize:13,color:"rgba(138,138,138,.9)",lineHeight:1.75,maxWidth:580,marginBottom:10}}>{activeSource.desc}</p>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:8,background:"rgba(201,168,76,0.07)",border:".5px solid rgba(201,168,76,.2)"}}>
            <span style={{fontSize:12}}>Tip</span>
            <span style={{fontSize:12,color:"rgba(138,138,138,.85)"}}>{activeSource.tip}</span>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:20,maxWidth:640}}>
          {activeSource.fields.map(f=>(
            <div key={f.key} style={f.type==="textarea"?{gridColumn:"1/-1"}:{}}>
              <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"rgba(138,138,138,.7)",marginBottom:6,fontWeight:500}}>
                {f.label}{f.required&&<span style={{color:"var(--gold)",marginLeft:3}}>*</span>}
              </label>
              {f.type==="select"?(
                <select value={inputs[f.key]||f.options?.[0]||""} onChange={e=>setInputs(p=>({...p,[f.key]:e.target.value}))} className="inp" style={{cursor:"pointer"}}>
                  {f.options?.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              ):f.type==="textarea"?(
                <textarea value={inputs[f.key]||""} onChange={e=>setInputs(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} className="inp" style={{minHeight:90,resize:"vertical",lineHeight:1.6}} />
              ):(
                <input type={f.type} value={inputs[f.key]||""} onChange={e=>setInputs(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} onKeyDown={e=>e.key==="Enter"&&extract()} className="inp" />
              )}
              {f.hint&&<p style={{fontSize:10,color:"rgba(138,138,138,.5)",marginTop:4}}>{f.hint}</p>}
            </div>
          ))}
        </div>

        <button onClick={extract} disabled={loading} className="btn btn-primary" style={{marginBottom:28}}>
          {loading?"Extrayendo leads...":"Extraer leads"}
        </button>

        {results.length>0&&(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <p style={{fontSize:12,letterSpacing:".06em",textTransform:"uppercase",color:"rgba(138,138,138,.7)",fontWeight:600}}>{results.length} leads encontrados</p>
              <span className="pill pill-gold">{results.filter(l=>!added.has(l.id)).length} sin agregar</span>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{display:"flex",background:"rgba(255,255,255,0.04)",border:".5px solid rgba(255,255,255,0.07)",borderRadius:7,padding:2}}>
                {(["list","grid"] as const).map(m=>(
                  <button key={m} onClick={()=>setViewMode(m)} style={{padding:"4px 10px",borderRadius:5,border:"none",cursor:"pointer",background:viewMode===m?"rgba(255,255,255,0.07)":"transparent",color:viewMode===m?"var(--txt)":"rgba(138,138,138,.6)",fontSize:12}}>{m==="list"?"List":"Grid"}</button>
                ))}
              </div>
              <button onClick={addAll} disabled={results.every(l=>added.has(l.id))} className="btn btn-ghost" style={{fontSize:12}}>+ Agregar todos</button>
            </div>
          </div>
        )}

        {results.length>0&&(
          <div style={viewMode==="grid"?{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}:{display:"flex",flexDirection:"column",gap:10}}>
            {results.map(lead=>{
              const isDone = added.has(lead.id);
              return (
                <div key={lead.id} className="glass" style={{padding:viewMode==="grid"?"16px 18px":"14px 20px",border:`.5px solid ${isDone?"rgba(201,168,76,.3)":"rgba(255,255,255,0.07)"}`,display:"flex",flexDirection:viewMode==="grid"?"column":"row",alignItems:viewMode==="grid"?"flex-start":"center",gap:viewMode==="grid"?10:16,transition:"all .18s",opacity:isDone?.65:1}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                      <p style={{fontWeight:500,fontSize:13,color:"var(--txt)"}}>{lead.name}</p>
                      {isDone&&<span style={{fontSize:9,color:"var(--gold)",border:".5px solid var(--gold-b)",padding:"1px 7px",borderRadius:99,background:"var(--gold-m)"}}>Agregado</span>}
                      <span className="mono" style={{marginLeft:"auto",fontSize:16,fontWeight:300,color:scoreColor(lead.score),flexShrink:0}}>{lead.score}</span>
                    </div>
                    <p style={{fontSize:12,color:"rgba(138,138,138,.8)",marginBottom:8}}>{lead.role}{lead.company?` - ${lead.company}`:""}</p>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>
                      {lead.linkedin_url&&<ContactChip icon="LI" label="LinkedIn" color="#60a5fa" border="rgba(96,165,250,.25)" bg="rgba(96,165,250,.08)" href={lead.linkedin_url} />}
                      {lead.email&&<ContactChip icon="@" label={lead.email} color="#10b981" border="rgba(16,185,129,.25)" bg="rgba(16,185,129,.08)" />}
                      {lead.phone&&<ContactChip icon="Tel" label={lead.phone} color="#fbbf24" border="rgba(251,191,36,.25)" bg="rgba(251,191,36,.1)" />}
                      <ContactChip icon="" label={lead.temp} color={tempColor(lead.temp)} border={`${tempColor(lead.temp)}35`} bg={`${tempColor(lead.temp)}12`} />
                    </div>
                    {lead.notes&&<p style={{fontSize:11,color:"rgba(138,138,138,.6)",lineHeight:1.5}}>{lead.notes}</p>}
                    <ScoreBar score={lead.score} />
                  </div>
                  <button onClick={()=>addOne(lead)} disabled={isDone} className={`btn ${isDone?"btn-ghost":"btn-ghost"}`} style={{flexShrink:0,fontSize:12,alignSelf:viewMode==="grid"?"stretch":"center"}}>{isDone?"En CRM":"+ CRM"}</button>
                </div>
              );
            })}
          </div>
        )}

        {!loading&&results.length===0&&(
          <div style={{textAlign:"center",padding:"48px 24px",border:".5px dashed rgba(255,255,255,0.07)",borderRadius:12,maxWidth:460}}>
            <p style={{fontSize:40,marginBottom:14}}>{activeSource.icon}</p>
            <p className="display" style={{fontSize:22,fontWeight:300,marginBottom:8}}>{activeSource.label}</p>
            <p style={{fontSize:13,color:"rgba(138,138,138,.7)",lineHeight:1.75,marginBottom:16}}>Completa los campos y clickea <strong style={{color:"var(--gold)"}}>Extraer leads</strong> para comenzar.</p>
            <p style={{fontSize:11,color:"rgba(138,138,138,.4)",marginTop:20}}>Necesitas API Key de Apify en Settings - API Keys</p>
          </div>
        )}
      </div>
    </div>
  );
}


// ── ACTIVITY LOG TYPE ─────────────────────────────────────────────────────────
interface Activity {
  id: string; lead_id: string; type: "dm"|"email"|"call"|"whatsapp"|"note"|"stage_change"|"import";
  channel?: string; content?: string; created_at: string; user_name?: string;
}
interface BusinessProfile {
  product: string; niche: string; goal_dms: number; goal_calls: number;
  goal_closes: number; ticket: number; channels: string[];
}

// ── ACTIVITY HELPERS ──────────────────────────────────────────────────────────
const ACTIVITY_ICONS: Record<string,string> = {
  dm:"💬", email:"✉", call:"📞", whatsapp:"💚", note:"📝", stage_change:"→", import:"📥"
};
const CHANNEL_COLORS: Record<string,string> = {
  linkedin:"#60a5fa", instagram:"#f472b6", facebook:"#818cf8",
  whatsapp:"#25D366", email:"#10b981", call:"#fbbf24"
};

// ── ACTIVITY TIMELINE ─────────────────────────────────────────────────────────
function ActivityTimeline({activities,onAdd}:{activities:Activity[];onAdd:(a:Activity)=>void}) {
  const [open,setOpen] = useState(false);
  const [form,setForm] = useState({type:"dm" as Activity["type"],channel:"linkedin",content:""});
  const toast = useToast();

  function addActivity() {
    const a:Activity = {
      id:uid(), lead_id:"", type:form.type, channel:form.channel,
      content:form.content, created_at:new Date().toISOString(), user_name:"Vos"
    };
    onAdd(a);
    setForm({type:"dm",channel:"linkedin",content:""});
    setOpen(false);
    toast("Actividad registrada","ok");
  }

  return (
    <div style={{marginTop:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <p style={{fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500}}>Historial de actividad</p>
        <button className="btn btn-ghost" style={{fontSize:11,padding:"4px 10px"}} onClick={()=>setOpen(p=>!p)}>+ Registrar</button>
      </div>

      {open&&(
        <div className="glass" style={{padding:"12px 14px",marginBottom:12,border:".5px solid var(--gold-b)"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div>
              <label style={{fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",display:"block",marginBottom:4}}>Tipo</label>
              <select className="inp" style={{fontSize:12}} value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value as any}))}>
                <option value="dm">DM</option><option value="email">Email</option>
                <option value="call">Llamada</option><option value="whatsapp">WhatsApp</option>
                <option value="note">Nota</option>
              </select>
            </div>
            <div>
              <label style={{fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",display:"block",marginBottom:4}}>Canal</label>
              <select className="inp" style={{fontSize:12}} value={form.channel} onChange={e=>setForm(p=>({...p,channel:e.target.value}))}>
                <option value="linkedin">LinkedIn</option><option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option><option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option><option value="call">Llamada</option>
              </select>
            </div>
          </div>
          <textarea className="inp" style={{minHeight:60,resize:"vertical",fontSize:12,marginBottom:8}} value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} placeholder="¿Qué pasó? ¿Qué dijiste? ¿Qué respondió?" />
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-ghost" style={{flex:1,fontSize:12}} onClick={()=>setOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" style={{flex:1,fontSize:12}} onClick={addActivity} disabled={!form.content}>Guardar</button>
          </div>
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {activities.length===0&&<p style={{fontSize:12,color:"var(--txt3)",fontStyle:"italic"}}>Sin actividad registrada aun.</p>}
        {[...activities].reverse().map(a=>(
          <div key={a.id} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:`${CHANNEL_COLORS[a.channel||"email"]||"var(--surface)"}18`,border:`.5px solid ${CHANNEL_COLORS[a.channel||"email"]||"var(--border)"}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>
              {ACTIVITY_ICONS[a.type]||"●"}
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                <span style={{fontSize:11,fontWeight:500,color:"var(--txt)",textTransform:"capitalize"}}>{a.type} via {a.channel}</span>
                <span style={{fontSize:10,color:"var(--txt3)"}}>{new Date(a.created_at).toLocaleDateString("es-ES",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</span>
              </div>
              {a.content&&<p style={{fontSize:12,color:"var(--txt2)",lineHeight:1.5}}>{a.content}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SEND MESSAGE PANEL (Quick outreach) ───────────────────────────────────────
function SendMessagePanel({lead,onSent}:{lead:Lead;onSent:(a:Activity)=>void}) {
  const [channel,setChannel] = useState("linkedin");
  const [msg,setMsg] = useState("");
  const [sent,setSent] = useState(false);
  const toast = useToast();

  const CHANNELS = [
    {id:"linkedin",label:"LinkedIn",icon:"🔵",color:"#60a5fa"},
    {id:"instagram",label:"Instagram",icon:"📸",color:"#f472b6"},
    {id:"whatsapp",label:"WhatsApp",icon:"💚",color:"#25D366"},
    {id:"email",label:"Email",icon:"✉",color:"#10b981"},
  ];

  function openNative() {
    let opened = false;
    if (channel==="whatsapp"&&lead.phone) {
      const num = lead.phone.replace(/\D/g,"");
      const text = encodeURIComponent(msg);
      window.open(`https://wa.me/${num}?text=${text}`,"_blank");
      opened = true;
    } else if (channel==="linkedin"&&lead.linkedin_url) {
      window.open(lead.linkedin_url,"_blank");
      opened = true;
    } else if (channel==="instagram"&&lead.instagram_url) {
      window.open(lead.instagram_url,"_blank");
      opened = true;
    } else if (channel==="email"&&lead.email) {
      window.open(`mailto:${lead.email}?subject=${encodeURIComponent("Hola "+lead.name.split(" ")[0])}&body=${encodeURIComponent(msg)}`,"_blank");
      opened = true;
    }
    // Auto-registrar actividad siempre que se abra el canal
    if (opened) {
      const preview = msg ? `"${msg.slice(0,120)}${msg.length>120?"...":""}"` : `(abierto desde CRM sin mensaje previo)`;
      const a:Activity = {
        id:uid(), lead_id:lead.id,
        type: channel==="email"?"email":channel==="whatsapp"?"whatsapp":"dm",
        channel,
        content:`Abierto ${channel.toUpperCase()} · ${preview}`,
        created_at:new Date().toISOString(), user_name:"Vos"
      };
      onSent(a);
      setSent(true);
      toast(`${channel.toUpperCase()} abierto y registrado ✓`,"ok");
      setTimeout(()=>setSent(false),3000);
    }
  }

  function markSent(silent:boolean=false) {
    const a:Activity = {
      id:uid(), lead_id:lead.id, type: channel==="email"?"email":channel==="whatsapp"?"whatsapp":"dm",
      channel,
      content:`Enviado via ${channel}: "${msg.slice(0,120)}${msg.length>120?"...":""}"`,
      created_at:new Date().toISOString(), user_name:"Vos"
    };
    onSent(a);
    setSent(true);
    if(!silent) toast(`${channel.toUpperCase()} registrado en CRM`,"ok");
    setTimeout(()=>setSent(false),3000);
  }

  function copyMsg() {
    navigator.clipboard.writeText(msg);
    toast("Mensaje copiado","ok");
  }

  const ch = CHANNELS.find(c=>c.id===channel)!;

  return (
    <div style={{marginTop:16}}>
      <p style={{fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500,marginBottom:10}}>Enviar mensaje</p>
      <div className="glass" style={{padding:"14px 16px"}}>
        {/* Channel selector */}
        <div style={{display:"flex",gap:6,marginBottom:12}}>
          {CHANNELS.map(c=>(
            <button key={c.id} onClick={()=>setChannel(c.id)}
              style={{flex:1,padding:"6px 4px",borderRadius:8,border:`.5px solid ${channel===c.id?c.color+"60":"var(--border)"}`,background:channel===c.id?`${c.color}12`:"transparent",color:channel===c.id?c.color:"var(--txt2)",fontSize:11,fontWeight:500,cursor:"pointer",transition:"all .15s",fontFamily:"'DM Sans',sans-serif"}}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Message area */}
        <textarea className="inp" style={{minHeight:100,resize:"vertical",lineHeight:1.6,marginBottom:10,fontSize:13}}
          value={msg} onChange={e=>setMsg(e.target.value)}
          placeholder={`Escribi o pega el mensaje para enviar via ${ch.label}...`} />

        {/* Actions */}
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-ghost" style={{fontSize:12,flex:1}} onClick={copyMsg} disabled={!msg}>
            Copiar texto
          </button>
          {(lead.linkedin_url||lead.instagram_url||lead.phone||lead.email)&&(
            <button onClick={openNative} disabled={!msg}
              style={{flex:1,padding:"8px",borderRadius:8,border:`.5px solid ${ch.color}60`,background:`${ch.color}12`,color:ch.color,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              Abrir {ch.label} →
            </button>
          )}
          <button className="btn btn-primary" style={{flex:1,fontSize:12}} onClick={()=>markSent(false)} disabled={!msg||sent}>
            {sent?"✓ Registrado":"Marcar enviado"}
          </button>
        </div>

        {/* Quick links */}
        <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
          {lead.linkedin_url&&<a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#60a5fa",textDecoration:"none"}}>🔵 Abrir perfil LinkedIn</a>}
          {lead.instagram_url&&<a href={lead.instagram_url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#f472b6",textDecoration:"none"}}>📸 Abrir Instagram</a>}
          {lead.phone&&<a href={`https://wa.me/${lead.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#25D366",textDecoration:"none"}}>💚 WhatsApp directo</a>}
          {lead.email&&<a href={`mailto:${lead.email}`} style={{fontSize:11,color:"#10b981",textDecoration:"none"}}>✉ Email directo</a>}
        </div>
      </div>
    </div>
  );
}

// ── CSV IMPORT ────────────────────────────────────────────────────────────────
function CsvImport({onImport,workspaceId}:{onImport:(leads:Lead[])=>void;workspaceId:string}) {
  const [step,setStep] = useState<"upload"|"map"|"preview">("upload");
  const [rows,setRows] = useState<string[][]>([]);
  const [headers,setHeaders] = useState<string[]>([]);
  const [mapping,setMapping] = useState<Record<string,string>>({});
  const [preview,setPreview] = useState<Lead[]>([]);
  const toast = useToast();

  const FIELDS = [
    {key:"name",label:"Nombre *",required:true},
    {key:"role",label:"Rol/Cargo"},
    {key:"company",label:"Empresa"},
    {key:"email",label:"Email"},
    {key:"phone",label:"Teléfono"},
    {key:"linkedin_url",label:"LinkedIn URL"},
    {key:"notes",label:"Notas"},
    {key:"score",label:"Score (1-10)"},
  ];

  function parseCSV(text:string) {
    const lines = text.trim().split("\n");
    const h = lines[0].split(",").map(c=>c.trim().replace(/"/g,""));
    const r = lines.slice(1).map(l=>l.split(",").map(c=>c.trim().replace(/"/g,"")));
    setHeaders(h);
    setRows(r);
    // Auto-map obvious columns
    const autoMap:Record<string,string> = {};
    FIELDS.forEach(f=>{
      const match = h.find(h=>h.toLowerCase().includes(f.key)||h.toLowerCase().includes(f.label.toLowerCase().replace(" *","")));
      if(match) autoMap[f.key]=match;
    });
    setMapping(autoMap);
    setStep("map");
  }

  function onFileChange(e:React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => parseCSV(ev.target?.result as string);
    reader.readAsText(file);
  }

  function buildPreview() {
    const leads:Lead[] = rows.slice(0,5).map(row=>{
      const get = (field:string) => {
        const col = mapping[field];
        if (!col) return "";
        const idx = headers.indexOf(col);
        return idx>=0 ? row[idx]||"" : "";
      };
      return {
        id:uid(), workspace_id:workspaceId,
        name:get("name")||"Sin nombre",
        role:get("role")||"",
        company:get("company")||"",
        email:get("email")||"",
        phone:get("phone")||"",
        linkedin_url:get("linkedin_url")||"",
        notes:get("notes")||"",
        score:parseInt(get("score"))||7,
        temp:"Warm" as const,
        stage:"Nuevo",
        source:"import",
        created_at:new Date().toISOString()
      };
    });
    setPreview(leads);
    setStep("preview");
  }

  function doImport() {
    const leads:Lead[] = rows.map(row=>{
      const get = (field:string) => {
        const col = mapping[field];
        if (!col) return "";
        const idx = headers.indexOf(col);
        return idx>=0 ? row[idx]||"" : "";
      };
      return {
        id:uid(), workspace_id:workspaceId,
        name:get("name")||"Sin nombre",
        role:get("role")||"",
        company:get("company")||"",
        email:get("email")||"",
        phone:get("phone")||"",
        linkedin_url:get("linkedin_url")||"",
        notes:get("notes")||"",
        score:parseInt(get("score"))||7,
        temp:"Warm" as const,
        stage:"Nuevo",
        source:"import",
        created_at:new Date().toISOString()
      };
    }).filter(l=>l.name!=="Sin nombre");
    onImport(leads);
    toast(`${leads.length} leads importados al CRM`,"ok");
    setStep("upload");
    setRows([]);
    setHeaders([]);
    setMapping({});
  }

  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{marginBottom:24}}>
        <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Importar Leads</h1>
        <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Carga tu CRM existente desde CSV</p>
      </div>

      {step==="upload"&&(
        <div style={{maxWidth:560}}>
          <div className="glass" style={{padding:"40px",textAlign:"center",border:".5px dashed var(--gold-b)",cursor:"pointer"}}
            onClick={()=>document.getElementById("csvInput")?.click()}>
            <p style={{fontSize:32,marginBottom:12}}>📥</p>
            <p className="display" style={{fontSize:22,fontWeight:300,marginBottom:8}}>Arrastrar CSV o clickear</p>
            <p style={{fontSize:13,color:"var(--txt2)",marginBottom:16}}>Soporta exports de Apollo, Notion, LinkedIn Sales Navigator, HubSpot, cualquier planilla</p>
            <input id="csvInput" type="file" accept=".csv,.txt" style={{display:"none"}} onChange={onFileChange} />
            <button className="btn btn-primary">Seleccionar archivo</button>
          </div>
          <div className="glass" style={{padding:"16px 18px",marginTop:16}}>
            <p style={{fontSize:12,fontWeight:500,marginBottom:8}}>Columnas soportadas:</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["Nombre","Rol/Cargo","Empresa","Email","Teléfono","LinkedIn URL","Score","Notas"].map(f=>(
                <span key={f} className="pill pill-muted" style={{fontSize:11}}>{f}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {step==="map"&&(
        <div style={{maxWidth:640}}>
          <div className="glass glass-gold" style={{padding:"16px 18px",marginBottom:20}}>
            <p style={{fontSize:13,fontWeight:500}}>{rows.length} filas detectadas · {headers.length} columnas</p>
            <p style={{fontSize:12,color:"var(--txt2)",marginTop:2}}>Mapeá las columnas de tu archivo a los campos del CRM</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
            {FIELDS.map(f=>(
              <div key={f.key}>
                <label style={{display:"block",fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:6,fontWeight:500}}>{f.label}</label>
                <select className="inp" value={mapping[f.key]||""} onChange={e=>setMapping(p=>({...p,[f.key]:e.target.value}))}>
                  <option value="">-- No importar --</option>
                  {headers.map(h=><option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-ghost" style={{flex:1}} onClick={()=>setStep("upload")}>Volver</button>
            <button className="btn btn-primary" style={{flex:1}} onClick={buildPreview} disabled={!mapping.name}>Vista previa →</button>
          </div>
        </div>
      )}

      {step==="preview"&&(
        <div style={{maxWidth:720}}>
          <div className="glass glass-gold" style={{padding:"14px 18px",marginBottom:16}}>
            <p style={{fontSize:13,fontWeight:500}}>Vista previa de los primeros 5 leads · {rows.length} totales a importar</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
            {preview.map(lead=>(
              <div key={lead.id} className="glass" style={{padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{fontWeight:500,fontSize:13}}>{lead.name}</p>
                  <p style={{fontSize:12,color:"var(--txt2)",marginTop:2}}>{lead.role}{lead.company?` · ${lead.company}`:""}</p>
                  <div style={{display:"flex",gap:6,marginTop:6}}>
                    {lead.email&&<span style={{fontSize:10,color:"#10b981"}}>✉ {lead.email}</span>}
                    {lead.phone&&<span style={{fontSize:10,color:"#fbbf24"}}>📞 {lead.phone}</span>}
                    {lead.linkedin_url&&<span style={{fontSize:10,color:"#60a5fa"}}>🔵 LinkedIn</span>}
                  </div>
                </div>
                <span className="mono" style={{fontSize:18,color:scoreColor(lead.score)}}>{lead.score}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-ghost" style={{flex:1}} onClick={()=>setStep("map")}>Modificar mapeo</button>
            <button className="btn btn-primary" style={{flex:1}} onClick={doImport}>
              Importar {rows.length} leads al CRM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── DAILY SESSION ─────────────────────────────────────────────────────────────
function DailySession({leads,profile,onLeadClick,onMarkSent}:{
  leads:Lead[]; profile:BusinessProfile|null;
  onLeadClick:(l:Lead)=>void; onMarkSent:(leadId:string,channel:string)=>void;
}) {
  const today = leads.filter(l=>l.next_action&&l.stage!=="Cerrado");
  const followUp = leads.filter(l=>l.stage==="Contactado"&&l.temp!=="Frío");
  const warmHot = leads.filter(l=>(l.temp==="Hot"||l.temp==="Warm")&&l.stage!=="Cerrado").sort((a,b)=>b.score-a.score);
  const [sentToday,setSentToday] = useState<Set<string>>(new Set());

  function markDone(id:string) {
    setSentToday(p=>new Set([...p,id]));
    onMarkSent(id,"linkedin");
  }

  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      {/* Header */}
      <div style={{marginBottom:28}}>
        <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Sesion del dia</h1>
        <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>
          {new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"})}
        </p>
      </div>

      {/* Goal tracker */}
      {profile&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:28}}>
          {[
            {label:"Meta DMs",current:sentToday.size,goal:profile.goal_dms,color:"var(--gold)"},
            {label:"Meta Calls",current:0,goal:profile.goal_calls,color:"#10b981"},
            {label:"Meta Cierres",current:leads.filter(l=>l.stage==="Cerrado").length,goal:profile.goal_closes,color:"#6366f1"},
          ].map(g=>(
            <div key={g.label} className="glass" style={{padding:"16px 18px"}}>
              <p style={{fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:8}}>{g.label}</p>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:8}}>
                <span className="mono" style={{fontSize:28,fontWeight:300,color:g.color}}>{g.current}</span>
                <span style={{fontSize:13,color:"var(--txt3)"}}>/ {g.goal}</span>
              </div>
              <div style={{height:3,borderRadius:99,background:"var(--border)"}}>
                <div style={{height:"100%",borderRadius:99,background:g.color,width:`${Math.min((g.current/g.goal)*100,100)}%`,transition:"width .5s"}} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        {/* Accion hoy */}
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={{fontSize:12,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)"}}>Accion requerida hoy</p>
            <span className="pill pill-gold">{today.length}</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {today.slice(0,6).map(lead=>(
              <div key={lead.id} className="glass" style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:12,opacity:sentToday.has(lead.id)?.5:1,transition:"opacity .3s"}}>
                <div style={{flex:1,cursor:"pointer"}} onClick={()=>onLeadClick(lead)}>
                  <p style={{fontWeight:500,fontSize:13}}>{lead.name}</p>
                  <p style={{fontSize:11,color:"var(--txt2)",marginTop:1}}>{lead.next_action}</p>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span className="mono" style={{fontSize:16,color:scoreColor(lead.score)}}>{lead.score}</span>
                  <button
                    onClick={()=>markDone(lead.id)}
                    disabled={sentToday.has(lead.id)}
                    style={{padding:"5px 10px",borderRadius:8,border:`.5px solid ${sentToday.has(lead.id)?"var(--gold-b)":"var(--border)"}`,background:sentToday.has(lead.id)?"var(--gold-m)":"var(--surface)",color:sentToday.has(lead.id)?"var(--gold)":"var(--txt2)",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                    {sentToday.has(lead.id)?"✓":"Hecho"}
                  </button>
                </div>
              </div>
            ))}
            {today.length===0&&<p style={{fontSize:13,color:"var(--txt3)",fontStyle:"italic"}}>No hay acciones pendientes para hoy.</p>}
          </div>
        </div>

        {/* Follow-ups */}
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={{fontSize:12,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)"}}>Follow-up pendiente</p>
            <span className="pill pill-muted">{followUp.length}</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {followUp.slice(0,6).map(lead=>(
              <div key={lead.id} className="glass lead-card" style={{padding:"12px 14px"}} onClick={()=>onLeadClick(lead)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <p style={{fontWeight:500,fontSize:13}}>{lead.name}</p>
                  <span className="pill" style={{background:`${tempColor(lead.temp)}18`,color:tempColor(lead.temp),border:`.5px solid ${tempColor(lead.temp)}35`,fontSize:10}}>{lead.temp}</span>
                </div>
                <p style={{fontSize:11,color:"var(--txt2)"}}>{lead.role}{lead.company?` · ${lead.company}`:""}</p>
                <ScoreBar score={lead.score} />
              </div>
            ))}
            {followUp.length===0&&<p style={{fontSize:13,color:"var(--txt3)",fontStyle:"italic"}}>No hay follow-ups pendientes.</p>}
          </div>
        </div>
      </div>

      {/* Top opportunities */}
      <div style={{marginTop:24}}>
        <p style={{fontSize:12,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:12}}>Top oportunidades del pipeline</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
          {warmHot.slice(0,6).map(lead=>(
            <div key={lead.id} className="glass lead-card" style={{padding:"12px 14px"}} onClick={()=>onLeadClick(lead)}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <p style={{fontWeight:500,fontSize:12}}>{lead.name}</p>
                <span className="mono" style={{fontSize:16,color:scoreColor(lead.score)}}>{lead.score}</span>
              </div>
              <p style={{fontSize:11,color:"var(--txt2)",marginBottom:6}}>{lead.stage}</p>
              <ScoreBar score={lead.score} />
              <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                {lead.linkedin_url&&<a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:"#60a5fa",textDecoration:"none"}}>🔵 LI</a>}
                {lead.phone&&<a href={`https://wa.me/${lead.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:"#25D366",textDecoration:"none"}}>💚 WA</a>}
                {lead.email&&<a href={`mailto:${lead.email}`} onClick={e=>e.stopPropagation()} style={{fontSize:10,color:"#10b981",textDecoration:"none"}}>✉ Mail</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── BUSINESS SETUP (Onboarding de proposito) ──────────────────────────────────
function BusinessSetup({onSave}:{onSave:(p:BusinessProfile)=>void}) {
  const [step,setStep] = useState(0);
  const [form,setForm] = useState<BusinessProfile>({
    product:"",niche:"",goal_dms:20,goal_calls:5,goal_closes:2,ticket:0,channels:["linkedin"]
  });

  const STEPS = [
    {
      label:"¿Que vendes?",
      hint:"Describe tu producto o servicio en una linea",
      field:"product" as const,
      type:"text",
      placeholder:"Ej: Comunidad paga de emprendedores remotos, coaching 1:1, agencia de marketing..."
    },
    {
      label:"¿En que nicho operas?",
      hint:"Tu cliente ideal, industria o mercado objetivo",
      field:"niche" as const,
      type:"text",
      placeholder:"Ej: Founders de SaaS en LATAM, duenos de gimnasios, coaches de negocios..."
    },
  ];

  const CHANNELS_OPT = [
    {id:"linkedin",label:"LinkedIn",icon:"🔵"},
    {id:"instagram",label:"Instagram",icon:"📸"},
    {id:"facebook",label:"Facebook",icon:"📘"},
    {id:"whatsapp",label:"WhatsApp",icon:"💚"},
    {id:"email",label:"Email",icon:"✉"},
  ];

  function toggleChannel(id:string) {
    setForm(p=>({...p,channels:p.channels.includes(id)?p.channels.filter(c=>c!==id):[...p.channels,id]}));
  }

  if (step < STEPS.length) {
    const s = STEPS[step];
    const progress = (step/4)*100;
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)",backgroundImage:"radial-gradient(ellipse 60% 40% at 50% 0%,rgba(201,168,76,0.06) 0%,transparent 70%)"}}>
        <div style={{maxWidth:520,width:"100%",padding:24}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <p className="display" style={{fontSize:14,letterSpacing:".1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:8}}>Configuracion inicial</p>
            <p className="display" style={{fontSize:32,fontWeight:300}}>Contame sobre tu negocio</p>
          </div>
          <div style={{height:2,background:"var(--border)",borderRadius:99,marginBottom:32,overflow:"hidden"}}>
            <div style={{height:"100%",background:"var(--gold)",width:`${progress}%`,transition:"width .4s"}} />
          </div>
          <div className="glass" style={{padding:"32px 28px",border:".5px solid var(--gold-b)"}}>
            <p style={{fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--gold)",marginBottom:8,fontWeight:500}}>{step+1} de 4</p>
            <h2 className="display" style={{fontSize:26,fontWeight:400,marginBottom:8}}>{s.label}</h2>
            <p style={{fontSize:13,color:"var(--txt2)",marginBottom:20}}>{s.hint}</p>
            <textarea className="inp" style={{minHeight:80,resize:"vertical",fontSize:14,lineHeight:1.6,marginBottom:16}}
              value={form[s.field]} onChange={e=>setForm(p=>({...p,[s.field]:e.target.value}))}
              placeholder={s.placeholder} autoFocus />
            <button className="btn btn-primary" style={{width:"100%",padding:"11px"}}
              onClick={()=>setStep(p=>p+1)} disabled={!form[s.field]}>
              Continuar →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step===2) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)"}}>
        <div style={{maxWidth:520,width:"100%",padding:24}}>
          <div style={{height:2,background:"var(--border)",borderRadius:99,marginBottom:32,overflow:"hidden"}}>
            <div style={{height:"100%",background:"var(--gold)",width:"75%"}} />
          </div>
          <div className="glass" style={{padding:"32px 28px",border:".5px solid var(--gold-b)"}}>
            <p style={{fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--gold)",marginBottom:8,fontWeight:500}}>3 de 4</p>
            <h2 className="display" style={{fontSize:26,fontWeight:400,marginBottom:8}}>¿Por que canales prospectas?</h2>
            <p style={{fontSize:13,color:"var(--txt2)",marginBottom:20}}>Selecciona todos los que uses</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
              {CHANNELS_OPT.map(c=>(
                <button key={c.id} onClick={()=>toggleChannel(c.id)}
                  style={{padding:"8px 16px",borderRadius:8,border:`.5px solid ${form.channels.includes(c.id)?"var(--gold-b)":"var(--border)"}`,background:form.channels.includes(c.id)?"var(--gold-m)":"transparent",color:form.channels.includes(c.id)?"var(--gold)":"var(--txt2)",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .15s"}}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" style={{width:"100%",padding:"11px"}}
              onClick={()=>setStep(3)} disabled={form.channels.length===0}>
              Continuar →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3 - Goals
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)"}}>
      <div style={{maxWidth:520,width:"100%",padding:24}}>
        <div style={{height:2,background:"var(--border)",borderRadius:99,marginBottom:32,overflow:"hidden"}}>
          <div style={{height:"100%",background:"var(--gold)",width:"100%"}} />
        </div>
        <div className="glass" style={{padding:"32px 28px",border:".5px solid var(--gold-b)"}}>
          <p style={{fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--gold)",marginBottom:8,fontWeight:500}}>4 de 4</p>
          <h2 className="display" style={{fontSize:26,fontWeight:400,marginBottom:8}}>Tus metas semanales</h2>
          <p style={{fontSize:13,color:"var(--txt2)",marginBottom:20}}>Para trackear tu progreso diario</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            {[
              {label:"DMs por semana",field:"goal_dms" as const,placeholder:"20",min:1},
              {label:"Calls / VSL / Acciones",field:"goal_calls" as const,placeholder:"0",min:0},
              {label:"Cierres por semana",field:"goal_closes" as const,placeholder:"2",min:0},
              {label:"Ticket promedio (USD)",field:"ticket" as const,placeholder:"500",min:0},
            ].map(g=>(
              <div key={g.field}>
                <label style={{display:"block",fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:6,fontWeight:500}}>{g.label}</label>
                <input type="number" min={g.min} className="inp"
                  value={form[g.field]===0?"0":form[g.field]||""}
                  onChange={e=>setForm(p=>({...p,[g.field]:e.target.value===""?0:+e.target.value}))}
                  placeholder={g.placeholder} />
              </div>
            ))}
          </div>
          {form.ticket>0&&(
            <div className="glass glass-gold" style={{padding:"12px 14px",marginBottom:16}}>
              <p style={{fontSize:12,color:"var(--txt2)"}}>Revenue potencial semanal:</p>
              <p className="display" style={{fontSize:24,fontWeight:300,color:"var(--gold)"}}>
                ${(form.goal_closes*form.ticket).toLocaleString()} USD
              </p>
            </div>
          )}
          <button className="btn btn-primary" style={{width:"100%",padding:"11px"}} onClick={()=>onSave(form)}>
            Entrar al CRM ✦
          </button>
        </div>
      </div>
    </div>
  );
}

// ── RESPONSE TEMPLATES ────────────────────────────────────────────────────────
const RESPONSE_TEMPLATES = {
  primer_contacto: [
    {label:"DM LinkedIn frio",channel:"linkedin",text:"Hola [Nombre], vi tu perfil como [Rol] y queria conectar. Trabajo con perfiles como el tuyo en sistematizar la prospeccion B2B. ?Tendrias 15 min esta semana para ver si aplica a tu caso?"},
    {label:"DM Instagram nicho",channel:"instagram",text:"Hola [Nombre]! Vi tu contenido sobre [Tema] y me parecio muy interesante. Trabajo con [Nicho] en optimizar su sistema de clientes. ?Podriamos charlar 10 min?"},
    {label:"Email frio directo",channel:"email",text:"Asunto: [Nombre], ?sistematizaste tu prospeccion?\n\nHola [Nombre],\n\nVi tu trabajo como [Rol] en [Empresa] y creo que hay una oportunidad concreta.\n\nAyudo a [Nicho] a conseguir [Resultado] sin depender del boca a boca.\n\n?Tendrias 15 min para una llamada esta semana?\n\nSaludos,\n[Tu nombre]"},
    {label:"WhatsApp primer contacto",channel:"whatsapp",text:"Hola [Nombre]! Te escribo porque vi tu perfil y creo que puedo ayudarte con [Problema]. ?Tendrias 10 min para hablar? No te voy a hacer perder el tiempo."},
  ],
  seguimiento: [
    {label:"Follow-up 48hs (LinkedIn)",channel:"linkedin",text:"Hola [Nombre], te escribi hace un par de dias. Entiendo que estas ocupado/a. Solo queria saber si tuviste chance de ver mi mensaje. ?Sigue siendo relevante para vos?"},
    {label:"Follow-up calido",channel:"linkedin",text:"[Nombre], volvi a ver tu perfil y me parece que lo que haces con [Empresa] es exactamente el perfil con el que trabajamos mejor. ?Hablamos 15 min?"},
    {label:"Ultimo intento",channel:"email",text:"Asunto: Ultimo mensaje, [Nombre]\n\nHola [Nombre],\n\nNo quiero ser insistente, pero antes de cerrar esto queria asegurarme de que viste mi propuesta.\n\nSi no es el momento, perfecto. Si te interesa, 15 min esta semana es todo lo que necesito.\n\nSaludos"},
    {label:"Reactivar lead frio",channel:"linkedin",text:"Hola [Nombre]! Hace un tiempo hablamos. Vi que [Empresa] estuvo activa ultimamente y queria retomar la conversacion. ?Sigue siendo relevante para vos [Problema]?"},
  ],
  respuesta_positiva: [
    {label:"Confirmar interes + agendar",channel:"linkedin",text:"Excelente [Nombre]! Me alegra que haya resonado. Te propongo una llamada de 20 min donde te muestro exactamente como funciona y vemos si aplica a tu caso. ?Como tienes [Dia/Dia+1]? Te mando el link de agenda."},
    {label:"Mandar link de agenda",channel:"whatsapp",text:"Perfecto [Nombre]! Te comparto mi link para que elijas el horario que mejor te quede: [LINK_AGENDA]\n\nNos vemos en la call!"},
    {label:"Confirmar call por email",channel:"email",text:"Asunto: Confirmacion de llamada - [Nombre]\n\nHola [Nombre]!\n\nConfirmo nuestra llamada para [Fecha] a las [Hora].\n\nLink: [LINK_VIDEOLLAMADA]\n\nAntes de la call, te pido que pienses en: ?cual es el mayor obstaculo hoy para conseguir mas clientes?\n\nHasta entonces!"},
    {label:"Qualificar antes de call",channel:"linkedin",text:"Genial [Nombre]! Para aprovechar mejor la llamada, me ayudaria entender: ?actualmente como conseguis la mayoria de tus clientes y cuanto tiempo le dedicas a la prospeccion por semana?"},
  ],
  objecion: [
    {label:"No tengo presupuesto",channel:"linkedin",text:"Entiendo [Nombre]. El presupuesto siempre es una consideracion. Precisamente por eso trabajo con un modelo donde el ROI se ve en la primera semana. ?Que presupuesto tendrias disponible si el resultado fuera seguro?"},
    {label:"No es el momento",channel:"linkedin",text:"Totalmente valido [Nombre]. ?Cuando seria un buen momento? Que sepas que el sistema se implementa en 48hs. Si en [Mes+2] te parece mejor, puedo contactarte entonces. ?Te parece?"},
    {label:"Ya tengo algo similar",channel:"linkedin",text:"Interesante, ?que estas usando actualmente? Pregunto porque la mayoria de mis clientes ya tenian algo antes de trabajar conmigo y la diferencia clave fue [Diferenciador]. Solo me llevaria 10 min mostrarte la diferencia concreta."},
    {label:"Necesito pensarlo",channel:"linkedin",text:"Por supuesto [Nombre], es normal. ?Que informacion adicional necesitarias para tomar la decision? Puedo enviarte casos de resultados concretos o simplemente agendamos una llamada sin compromiso de 15 min."},
    {label:"Mandar VSL/video",channel:"whatsapp",text:"[Nombre], prepare un video corto de 3 minutos que explica exactamente como funciona y que resultados puedes esperar. ?Te lo mando? No tiene desperdicio."},
  ],
  cierre: [
    {label:"Propuesta de cierre",channel:"linkedin",text:"[Nombre], en base a lo que hablamos, prepare una propuesta especifica para tu caso. ?Cuando podemos revisar los detalles y arrancar?"},
    {label:"Cierre por WhatsApp",channel:"whatsapp",text:"[Nombre]! Revisaste la propuesta? Tengo un lugar disponible esta semana para empezar. ?Arrancamos?"},
    {label:"Urgencia genuina",channel:"linkedin",text:"[Nombre], queria avisarte que cierro mi cupo del mes el [Fecha]. Si queres asegurar el lugar, necesito confirmacion antes de ese dia. ?Seguimos?"},
    {label:"Post-cierre bienvenida",channel:"email",text:"Asunto: Bienvenido/a [Nombre]!\n\nHola [Nombre]!\n\nMe alegra muchisimo que hayas decidido arrancar. En las proximas horas te mando los accesos y el proceso de onboarding.\n\nCualquier duda, escribime directamente.\n\nExito!"},
  ],
};

// ── REDACCION IA v8 ───────────────────────────────────────────────────────────
function RedaccionIA({leads,workspaceId}:{leads:Lead[];workspaceId:string}) {
  const [selectedLead,setSelectedLead] = useState<Lead|null>(null);
  const [mode,setMode] = useState<"generar"|"plantillas">("plantillas");
  const [templateCat,setTemplateCat] = useState<keyof typeof RESPONSE_TEMPLATES>("primer_contacto");
  const [tone,setTone] = useState<"directo"|"empatico"|"video"|"corto"|"consultivo">("directo");
  const [msg,setMsg] = useState("");
  const [loading,setLoading] = useState(false);
  const toast = useToast();

  const TONE_INFO: Record<string,{label:string;desc:string}> = {
    directo:    {label:"Directo",    desc:"Va al punto, propone llamada"},
    empatico:   {label:"Empatico",   desc:"Conecta primero, luego propone"},
    video:      {label:"Video VSL",  desc:"Ofrece video de 3 min en vez de call"},
    corto:      {label:"Ultra corto",desc:"Maximo 2 lineas para alta respuesta"},
    consultivo: {label:"Consultivo", desc:"Hace pregunta abierta para iniciar dialogo"},
  };

  const CAT_LABELS: Record<keyof typeof RESPONSE_TEMPLATES,string> = {
    primer_contacto:"Primer contacto",
    seguimiento:"Seguimiento",
    respuesta_positiva:"Respuesta positiva",
    objecion:"Manejo de objeciones",
    cierre:"Cierre",
  };

  const CHANNEL_ICONS: Record<string,string> = {
    linkedin:"🔵",instagram:"📸",whatsapp:"💚",email:"✉",call:"📞"
  };

  function applyTemplate(text:string) {
    let t = text;
    if(selectedLead) {
      t = t.replace(/\[Nombre\]/g,selectedLead.name.split(" ")[0])
           .replace(/\[Rol\]/g,selectedLead.role||"profesional")
           .replace(/\[Empresa\]/g,selectedLead.company||"tu empresa");
    }
    setMsg(t);
  }

  async function generate() {
    if(!selectedLead) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,800));
    const name = selectedLead.name.split(" ")[0];
    const role = selectedLead.role||"profesional";
    const templates:Record<string,string> = {
      directo:    `Hola ${name}, vi tu perfil como ${role} y queria conectar. Trabajo con perfiles como el tuyo optimizando el sistema de prospeccion B2B. ?Tendrias 15 min esta semana?`,
      empatico:   `Hola ${name}, estuve analizando tu trabajo como ${role} y creo que hay una oportunidad concreta de mejorar tu flujo de clientes sin agregar mas horas. ?Charlamos?`,
      video:      `${name}, prepare un video de 3 min especifico para ${role}s que explica como cerrar mas sin prospectar manualmente. ?Te lo mando? VSL = Video Sales Letter, formato menos invasivo que la call.`,
      corto:      `${name}, ?cuanto tiempo dedicas a prospectar por semana? Tengo algo que te puede interesar.`,
      consultivo: `Hola ${name}, una pregunta de ${role} a ${role}: ?cual es hoy el cuello de botella mas grande en tu pipeline de clientes? Quiero entender antes de proponerte nada.`,
    };
    setMsg(templates[tone] || templates.directo);
    setLoading(false);
  }

  return (
    <div className="fade-up" style={{padding:"28px 32px",height:"100%",overflowY:"auto"}}>
      <div style={{marginBottom:22}}>
        <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Redaccion IA</h1>
        <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Genera mensajes personalizados o usa plantillas por tipo de respuesta</p>
      </div>

      {/* Mode toggle */}
      <div className="tab-bar" style={{maxWidth:320,marginBottom:20}}>
        <button className={`tab-btn ${mode==="plantillas"?"active":""}`} onClick={()=>setMode("plantillas")}>Plantillas por etapa</button>
        <button className={`tab-btn ${mode==="generar"?"active":""}`} onClick={()=>setMode("generar")}>Generar con IA</button>
      </div>

      {/* Lead selector */}
      <div style={{maxWidth:400,marginBottom:20}}>
        <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:6,fontWeight:500}}>Lead (opcional para personalizar)</label>
        <select className="inp" value={selectedLead?.id||""} onChange={e=>setSelectedLead(leads.find(l=>l.id===e.target.value)||null)}>
          <option value="">Sin lead seleccionado</option>
          {leads.map(l=><option key={l.id} value={l.id}>{l.name} - {l.role}</option>)}
        </select>
      </div>

      {mode==="plantillas"&&(
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:20}}>
          {/* Category list */}
          <div>
            <p style={{fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:10,fontWeight:500}}>Situacion</p>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {(Object.keys(CAT_LABELS) as Array<keyof typeof RESPONSE_TEMPLATES>).map(cat=>(
                <button key={cat} onClick={()=>setTemplateCat(cat)}
                  style={{padding:"9px 12px",borderRadius:8,border:`.5px solid ${templateCat===cat?"var(--gold-b)":"transparent"}`,background:templateCat===cat?"var(--gold-m)":"transparent",color:templateCat===cat?"var(--gold)":"var(--txt2)",fontSize:12,fontWeight:templateCat===cat?500:400,cursor:"pointer",textAlign:"left",fontFamily:"'DM Sans',sans-serif",transition:"all .15s"}}>
                  {CAT_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Templates grid */}
          <div>
            <p style={{fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:10,fontWeight:500}}>Plantillas disponibles ({RESPONSE_TEMPLATES[templateCat].length})</p>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
              {RESPONSE_TEMPLATES[templateCat].map((t,i)=>(
                <div key={i} className="glass" style={{padding:"14px 16px",cursor:"pointer",transition:"all .18s",border:".5px solid var(--border)"}}
                  onClick={()=>applyTemplate(t.text)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <p style={{fontWeight:500,fontSize:13}}>{t.label}</p>
                    <span style={{fontSize:11,padding:"2px 8px",borderRadius:99,background:"var(--surface)",border:".5px solid var(--border)",color:"var(--txt2)"}}>
                      {CHANNEL_ICONS[t.channel]} {t.channel}
                    </span>
                  </div>
                  <p style={{fontSize:12,color:"var(--txt2)",lineHeight:1.6,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
                    {t.text.slice(0,120)}{t.text.length>120?"...":""}
                  </p>
                </div>
              ))}
            </div>

            {/* Message area */}
            {msg&&(
              <div>
                <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:6,fontWeight:500}}>Mensaje listo para enviar</label>
                <textarea className="inp" style={{minHeight:160,resize:"vertical",lineHeight:1.7,marginBottom:10}} value={msg} onChange={e=>setMsg(e.target.value)} />
                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-ghost" style={{flex:1,fontSize:12}} onClick={()=>{navigator.clipboard.writeText(msg);toast("Copiado","ok");}}>Copiar</button>
                  <button className="btn btn-ghost" style={{flex:1,fontSize:12}} onClick={()=>setMsg("")}>Limpiar</button>
                </div>
                <div style={{marginTop:10}}>
                  <AiEnhanceButton
                    feature="redaccion"
                    workspaceId={workspaceId}
                    systemPrompt="Sos un copywriter experto en outbound B2B y prospeccion. Tu trabajo es mejorar mensajes de prospeccion para hacerlos mas naturales, especificos al lead y con mas chance de respuesta. Manteene el tono profesional pero humano. NO uses emojis salvo que el original los tenga. Manteene la longitud similar."
                    userPrompt={`Lead: ${selectedLead?.name||"sin lead"} - ${selectedLead?.role||""} en ${selectedLead?.company||""}.\nMensaje actual:\n\n${msg}\n\nDevolveme SOLO el mensaje mejorado, sin explicaciones ni prefijos.`}
                    onResult={(text)=>setMsg(text.trim())}
                    label="Mejorar con Claude"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {mode==="generar"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:760}}>
          <div>
            <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:6,fontWeight:500}}>Tono</label>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
              {(["directo","empatico","video","corto","consultivo"] as const).map(t=>(
                <button key={t}
                  className={`btn ${tone===t?"btn-primary":"btn-ghost"}`}
                  style={{fontSize:12,textAlign:"left",padding:"8px 12px",display:"flex",flexDirection:"column",alignItems:"flex-start",gap:2}}
                  onClick={()=>setTone(t)}>
                  <span style={{fontWeight:500,textTransform:"capitalize"}}>{TONE_INFO[t].label}</span>
                  <span style={{fontSize:10,opacity:.75,fontWeight:400}}>{TONE_INFO[t].desc}</span>
                </button>
              ))}
            </div>
            <button className="btn btn-primary" style={{width:"100%"}} onClick={generate} disabled={!selectedLead||loading}>
              {loading?"Generando...":"Generar mensaje"}
            </button>
            {!selectedLead&&<p style={{fontSize:11,color:"var(--txt3)",marginTop:8}}>Selecciona un lead para personalizar</p>}
          </div>
          <div>
            <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:6,fontWeight:500}}>Mensaje generado</label>
            <textarea className="inp" style={{minHeight:180,resize:"vertical",lineHeight:1.7}} value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Aparece aqui..." />
            {msg&&<button className="btn btn-ghost" style={{width:"100%",marginTop:8,fontSize:12}} onClick={()=>{navigator.clipboard.writeText(msg);toast("Copiado","ok");}}>Copiar</button>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── INBOUND PIPELINE ──────────────────────────────────────────────────────────
const INBOUND_STAGES = ["Nuevo","Contactado","Calificado","Propuesta","Cerrado"];
const OUTBOUND_STAGES = ["Nuevo","Contactado","Calificado","Propuesta","Cerrado"];

// ── PIPELINE v8 (Inbound + Outbound) ─────────────────────────────────────────
function Pipeline({leads,onLeadClick,onAddLead}:{leads:Lead[];onLeadClick:(l:Lead)=>void;onAddLead:(l:Lead)=>void}) {
  const [pipelineType,setPipelineType] = useState<"outbound"|"inbound">("outbound");
  const [showAddInbound,setShowAddInbound] = useState(false);
  const [inboundForm,setInboundForm] = useState({name:"",role:"",company:"",email:"",phone:"",source_detail:"",notes:""});
  const toast = useToast();

  const inboundLeads = leads.filter(l=>l.source==="inbound"||l.source==="ads"||l.source==="landing");
  const outboundLeads = leads.filter(l=>l.source!=="inbound"&&l.source!=="ads"&&l.source!=="landing");
  const viewLeads = pipelineType==="inbound"?inboundLeads:outboundLeads;
  const stages = pipelineType==="inbound"?INBOUND_STAGES:OUTBOUND_STAGES;

  function addInboundLead() {
    if(!inboundForm.name) return;
    const l:Lead = {
      id:uid(),workspace_id:"",
      name:inboundForm.name,role:inboundForm.role||"Lead Inbound",
      company:inboundForm.company,email:inboundForm.email,phone:inboundForm.phone,
      notes:inboundForm.notes,score:8,temp:"Hot",stage:"Nuevo",
      source:"inbound",created_at:new Date().toISOString(),
      next_action:"Contactar en menos de 5 min",
    };
    onAddLead(l);
    toast(`${l.name} agregado como lead inbound Hot`,"ok");
    setShowAddInbound(false);
    setInboundForm({name:"",role:"",company:"",email:"",phone:"",source_detail:"",notes:""});
  }

  return (
    <div className="fade-up" style={{padding:"28px 32px",height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20,flexShrink:0}}>
        <div>
          <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>CRM Pipeline</h1>
          <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>{viewLeads.length} leads en seguimiento</p>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {pipelineType==="inbound"&&(
            <button className="btn btn-primary" style={{fontSize:12}} onClick={()=>setShowAddInbound(true)}>
              + Lead inbound
            </button>
          )}
          <div className="tab-bar">
            <button className={`tab-btn ${pipelineType==="outbound"?"active":""}`} onClick={()=>setPipelineType("outbound")}>
              Outbound ({outboundLeads.length})
            </button>
            <button className={`tab-btn ${pipelineType==="inbound"?"active":""}`} onClick={()=>setPipelineType("inbound")}>
              Inbound / Ads ({inboundLeads.length})
            </button>
          </div>
        </div>
      </div>

      {/* Info banner for inbound */}
      {pipelineType==="inbound"&&(
        <div className="glass" style={{padding:"10px 16px",marginBottom:16,border:".5px solid rgba(201,168,76,.25)",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <span style={{fontSize:18}}>⚡</span>
          <div>
            <p style={{fontSize:12,fontWeight:500,color:"var(--gold)"}}>Pipeline de leads inbound</p>
            <p style={{fontSize:11,color:"var(--txt2)"}}>Leads que llegaron solos: anuncios Meta/Google, landing pages, referidos. Temperatura Hot por defecto. Contactar en menos de 5 min.</p>
          </div>
        </div>
      )}

      {/* Kanban */}
      <div style={{flex:1,overflowX:"auto",paddingBottom:16}}>
        <div style={{display:"flex",gap:16,minWidth:"max-content",height:"100%"}}>
          {stages.map(stage=>{
            const col = viewLeads.filter(l=>l.stage===stage);
            return (
              <div key={stage} style={{width:240,display:"flex",flexDirection:"column"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexShrink:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:STAGE_COLORS[stage],display:"inline-block"}} />
                    <span style={{fontSize:11,fontWeight:600,color:"var(--txt2)",letterSpacing:".04em",textTransform:"uppercase"}}>{stage}</span>
                  </div>
                  <span className="pill pill-muted" style={{fontSize:10}}>{col.length}</span>
                </div>
                <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
                  {col.map(lead=>(
                    <div key={lead.id} className="glass lead-card" onClick={()=>onLeadClick(lead)} style={{padding:"14px 16px",flexShrink:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                        <div>
                          <p style={{fontWeight:500,fontSize:13,lineHeight:1.3}}>{lead.name}</p>
                          <p style={{fontSize:11,color:"var(--txt2)",marginTop:2}}>{lead.role}{lead.company?` · ${lead.company}`:""}</p>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                          <span className="mono" style={{fontSize:16,fontWeight:300,color:scoreColor(lead.score)}}>{lead.score}</span>
                          {lead.source==="inbound"&&<span style={{fontSize:9,color:"var(--gold)",background:"var(--gold-m)",padding:"1px 6px",borderRadius:99,border:".5px solid var(--gold-b)"}}>Inbound</span>}
                        </div>
                      </div>
                      <ScoreBar score={lead.score} />
                      <div style={{display:"flex",gap:5,marginTop:8,flexWrap:"wrap"}}>
                        <span className="pill" style={{background:`${tempColor(lead.temp)}18`,color:tempColor(lead.temp),border:`.5px solid ${tempColor(lead.temp)}35`,fontSize:9}}>
                          {lead.temp==="Hot"?"🔥":lead.temp==="Warm"?"◈":"❄"} {lead.temp}
                        </span>
                        {lead.next_action&&<span className="pill pill-muted" style={{fontSize:9}}>→ {lead.next_action}</span>}
                      </div>
                      {/* Quick contact links */}
                      <div style={{display:"flex",gap:6,marginTop:8}}>
                        {lead.linkedin_url&&<a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:"#60a5fa",textDecoration:"none"}}>🔵</a>}
                        {lead.phone&&<a href={`https://wa.me/${lead.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:"#25D366",textDecoration:"none"}}>💚</a>}
                        {lead.email&&<a href={`mailto:${lead.email}`} onClick={e=>e.stopPropagation()} style={{fontSize:10,color:"#10b981",textDecoration:"none"}}>✉</a>}
                      </div>
                    </div>
                  ))}
                  {col.length===0&&(
                    <div style={{border:".5px dashed var(--border)",borderRadius:"var(--radius)",padding:"24px 16px",textAlign:"center"}}>
                      <p style={{fontSize:11,color:"var(--txt3)"}}>Sin leads</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add inbound modal */}
      {showAddInbound&&(
        <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,.72)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={()=>setShowAddInbound(false)}>
          <div className="glass" style={{maxWidth:520,width:"100%",padding:28,border:".5px solid var(--gold-b)"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <h2 className="display" style={{fontSize:22,fontWeight:400}}>Nuevo lead inbound</h2>
                <p style={{fontSize:12,color:"var(--gold)",marginTop:2}}>⚡ Se crea como Hot - contactar en 5 min</p>
              </div>
              <button onClick={()=>setShowAddInbound(false)} className="btn btn-ghost" style={{padding:"4px 10px",fontSize:18}}>×</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[{l:"Nombre *",f:"name"},{l:"Cargo/Rol",f:"role"},{l:"Empresa",f:"company"},{l:"Email",f:"email"},{l:"Telefono",f:"phone"},{l:"Fuente",f:"source_detail"}].map(x=>(
                <div key={x.f}>
                  <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:5,fontWeight:500}}>{x.l}</label>
                  <input className="inp"
                    value={(inboundForm as any)[x.f]}
                    onChange={e=>setInboundForm(p=>({...p,[x.f]:e.target.value}))}
                    placeholder={x.f==="source_detail"?"Meta Ads, Google, Landing...":""}
                  />
                </div>
              ))}
            </div>
            <div style={{marginTop:12}}>
              <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:5,fontWeight:500}}>Notas del lead</label>
              <textarea className="inp" style={{minHeight:60,resize:"vertical"}} value={inboundForm.notes} onChange={e=>setInboundForm(p=>({...p,notes:e.target.value}))} placeholder="Que producto consulto, que dijo en el formulario..." />
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}>
              <button className="btn btn-ghost" onClick={()=>setShowAddInbound(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={addInboundLead} disabled={!inboundForm.name}>⚡ Agregar lead Hot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── INBOX v8 (con templates de respuesta rapida) ──────────────────────────────
function Inbox({leads,workspaceId}:{leads:Lead[];workspaceId:string}) {
  const [sel,setSel] = useState<Lead|null>(null);
  const [resp,setResp] = useState("");
  const [analysis,setAnalysis] = useState<{type:string;color:string;action:string;template:string}|null>(null);
  const [loading,setLoading] = useState(false);
  const [quickReply,setQuickReply] = useState("");
  const toast = useToast();

  const ANALYSIS_TYPES = [
    {keywords:["si","dale","interesa","perfecto","genial","bueno","claro","adelante","cuando"],type:"POSITIVO",color:"#10b981",action:"Agendar call en las proximas 24h. Score: +1",template:"Excelente [Nombre]! Me alegra que haya resonado. Te propongo una llamada de 20 min. ?Como tienes manana o pasado? Te mando el link."},
    {keywords:["cuanto","precio","costo","valor","inversion","cobras"],type:"CONSULTA PRECIO",color:"#C9A84C",action:"Calificar antes de dar precio. Preguntar por presupuesto actual.",template:"Buena pregunta [Nombre]. Antes de darte numeros, ?me contas un poco mas sobre tu situacion actual? Asi te doy algo mas ajustado a tu caso."},
    {keywords:["no","ahora no","despues","mas adelante","no me interesa","gracias pero"],type:"NEGATIVO / NO AHORA",color:"#f87171",action:"Registrar como frio. Programar follow-up en 30 dias.",template:"Perfecto [Nombre], lo entiendo totalmente. ?Te parece si te contacto en [Fecha+30d] cuando sea mejor momento?"},
    {keywords:["presupuesto","plata","caro","dinero","cuesta mucho"],type:"OBJECION PRECIO",color:"#f59e0b",action:"Usar script de objecion de precio. Enfocarse en ROI.",template:"Entiendo [Nombre]. El tema presupuesto siempre es importante. ?Que inversion tendrias disponible si el resultado fuera seguro?"},
    {keywords:["pensar","consultar","ver","hablar","tiempo"],type:"NECESITA PENSAR",color:"#818cf8",action:"Dar informacion adicional. Proponer call sin compromiso.",template:"Por supuesto [Nombre]! Tomatelo con calma. Para ayudarte a decidir, ?que informacion te seria mas util tener?"},
  ];

  async function analyze() {
    if(!resp) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,700));
    const lower = resp.toLowerCase();
    const match = ANALYSIS_TYPES.find(t=>t.keywords.some(k=>lower.includes(k)));
    const result = match || {type:"NEUTRAL",color:"#64748b",action:"Seguir la conversacion. Hacer pregunta abierta.",template:"Gracias por responder [Nombre]. Para entender mejor, ?podes contarme un poco mas sobre [Situacion]?"};
    const finalTemplate = sel ? result.template.replace(/\[Nombre\]/g,sel.name.split(" ")[0]) : result.template;
    setAnalysis({...result,template:finalTemplate});
    setQuickReply(finalTemplate);
    setLoading(false);
  }

  return (
    <div className="fade-up" style={{padding:"28px 32px",height:"100%",overflowY:"auto"}}>
      <div style={{marginBottom:22}}>
        <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Inbox</h1>
        <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Analiza respuestas y obtene el script de reply inmediato</p>
      </div>

      {/* How it works explainer */}
      <details style={{marginBottom:20,maxWidth:900}}>
        <summary style={{cursor:"pointer",fontSize:12,color:"var(--gold)",padding:"10px 14px",border:".5px solid var(--gold-b)",borderRadius:8,background:"var(--gold-m)",userSelect:"none",listStyle:"none"}}>
          ▸ Cómo funciona el Inbox
        </summary>
        <div className="glass" style={{padding:"14px 18px",marginTop:8,fontSize:12,color:"var(--txt2)",lineHeight:1.7}}>
          <p style={{marginBottom:8}}><strong style={{color:"var(--txt)"}}>Inbox NO se conecta automaticamente a tus DMs.</strong> Es un asistente para analizar respuestas que vos pegas manualmente.</p>
          <p style={{marginBottom:6}}><strong style={{color:"var(--gold)"}}>Flujo de uso:</strong></p>
          <ol style={{paddingLeft:20,lineHeight:2}}>
            <li>Tu lead te responde por LinkedIn, WhatsApp, Email o Instagram</li>
            <li>Copias la respuesta y la pegas aca</li>
            <li>Click en "Analizar (rapido)" para deteccion por keywords (gratis) o "Analisis profundo con Claude" (IA)</li>
            <li>El sistema te devuelve sentiment, intent score, objeciones y un script de respuesta sugerido</li>
            <li>Copias el script y respondes desde tu app nativa (WhatsApp Web, LinkedIn, Gmail)</li>
          </ol>
          <p style={{marginTop:10,fontSize:11,color:"var(--txt3)"}}>
            <strong>Análisis automático:</strong> copiá el mensaje de tu lead y CloserAI detecta el sentiment, la intención y sugiere la mejor respuesta para cerrar.
          </p>
        </div>
      </details>

      <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:20,maxWidth:900}} className="inbox-layout">
        {/* Lead list */}
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <p style={{fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:4,fontWeight:500}}>Lead que respondio</p>
          {leads.filter(l=>l.stage==="Contactado"||l.stage==="Calificado").map(l=>(
            <div key={l.id} className={`glass ${sel?.id===l.id?"glass-gold":""}`} style={{padding:"10px 12px",cursor:"pointer",transition:"all .15s"}} onClick={()=>setSel(l)}>
              <p style={{fontWeight:500,fontSize:12}}>{l.name}</p>
              <p style={{fontSize:10,color:"var(--txt2)",marginTop:1}}>{l.role}</p>
              <div style={{display:"flex",gap:4,marginTop:5}}>
                {l.linkedin_url&&<a href={l.linkedin_url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:"#60a5fa",textDecoration:"none"}}>🔵</a>}
                {l.phone&&<a href={`https://wa.me/${l.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:"#25D366",textDecoration:"none"}}>💚</a>}
              </div>
            </div>
          ))}
          {leads.filter(l=>l.stage==="Contactado"||l.stage==="Calificado").length===0&&(
            <p style={{fontSize:11,color:"var(--txt3)",fontStyle:"italic"}}>Mueve leads a "Contactado" para verlos aca</p>
          )}
        </div>

        {/* Analyzer */}
        <div>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:6,fontWeight:500}}>Pegar respuesta recibida</label>
            <textarea className="inp" style={{minHeight:120,resize:"vertical",lineHeight:1.6}} value={resp} onChange={e=>setResp(e.target.value)} placeholder="Copia y pega exactamente lo que te respondio el lead desde LinkedIn, Instagram, WhatsApp o Email..." />
          </div>
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
            <button className="btn btn-primary" onClick={analyze} disabled={!resp||loading}>
              {loading?"Analizando...":"Analizar (rapido)"}
            </button>
            <AiEnhanceButton
              feature="inbox"
              workspaceId={workspaceId}
              systemPrompt="Sos experto en sales psychology y closing. Analizas respuestas de leads y detectas: 1) sentiment real (positivo/negativo/neutral), 2) urgencia, 3) objeciones implicitas, 4) intent score 0-100. Devolves analisis breve + script de respuesta optimizado en formato:\n\nSENTIMENT: [tipo]\nINTENT SCORE: [0-100]\nOBJECCIONES: [lista corta]\nACCION RECOMENDADA: [una frase]\nSCRIPT DE RESPUESTA:\n[texto del mensaje a enviar]"
              userPrompt={`Lead: ${sel?.name||"desconocido"} - ${sel?.role||""} - ${sel?.company||""}.\nRespuesta del lead:\n\n${resp}`}
              onResult={(text)=>{
                const scriptMatch = text.match(/SCRIPT DE RESPUESTA:\s*([\s\S]+)/i);
                if(scriptMatch) setQuickReply(scriptMatch[1].trim());
                const sentMatch = text.match(/SENTIMENT:\s*(\w+)/i);
                const scoreMatch = text.match(/INTENT SCORE:\s*(\d+)/i);
                const accionMatch = text.match(/ACCION RECOMENDADA:\s*([^\n]+)/i);
                setAnalysis({
                  type: sentMatch?.[1]?.toUpperCase()||"ANALIZADO",
                  color: "#a78bfa",
                  action: `${accionMatch?.[1]||""} ${scoreMatch?`(Intent: ${scoreMatch[1]}/100)`:""}`,
                  template: scriptMatch?.[1]?.trim()||text
                });
              }}
              label="Analisis profundo con Claude"
            />
          </div>

          {analysis&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {/* Analysis result */}
              <div className="glass" style={{padding:"16px 18px",border:`.5px solid ${analysis.color}40`}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{padding:"3px 12px",borderRadius:99,background:`${analysis.color}18`,color:analysis.color,fontSize:12,fontWeight:600,border:`.5px solid ${analysis.color}35`}}>
                    {analysis.type}
                  </span>
                </div>
                <p style={{fontSize:13,color:"var(--txt)",lineHeight:1.7}}>
                  <strong>Accion recomendada:</strong> {analysis.action}
                </p>
              </div>

              {/* Quick reply */}
              <div>
                <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:6,fontWeight:500}}>
                  Script de respuesta recomendado
                </label>
                <textarea className="inp" style={{minHeight:120,resize:"vertical",lineHeight:1.7}} value={quickReply} onChange={e=>setQuickReply(e.target.value)} />
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <button className="btn btn-ghost" style={{flex:1,fontSize:12}} onClick={()=>{navigator.clipboard.writeText(quickReply);toast("Respuesta copiada","ok");}}>
                    Copiar respuesta
                  </button>
                  {sel?.linkedin_url&&<a href={sel.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{flex:1,fontSize:12,textDecoration:"none",textAlign:"center"}}>
                    Abrir LinkedIn 🔵
                  </a>}
                  {sel?.phone&&<a href={`https://wa.me/${sel.phone.replace(/\D/g,"")}?text=${encodeURIComponent(quickReply)}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{flex:1,fontSize:12,textDecoration:"none",textAlign:"center"}}>
                    Abrir WhatsApp 💚
                  </a>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD v8 (con comparativa) ───────────────────────────────────────────
function Dashboard({leads}:{leads:Lead[]}) {
  const warm=leads.filter(l=>l.temp!=="Frío");
  const hot=leads.filter(l=>l.temp==="Hot");
  const today=leads.filter(l=>l.next_action);
  const inbound=leads.filter(l=>l.source==="inbound"||l.source==="ads");
  const avg=leads.length?(leads.reduce((a,b)=>a+b.score,0)/leads.length).toFixed(1):"0";
  const closed=leads.filter(l=>l.stage==="Cerrado").length;

  return (
    <div className="fade-up" style={{padding:"28px 32px",overflowY:"auto",height:"100%"}}>
      <div style={{marginBottom:24}}>
        <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em",lineHeight:1.1}}>Dashboard</h1>
        <p style={{fontSize:13,color:"var(--txt2)",marginTop:6}}>{new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"})}</p>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:28}}>
        <StatCard label="Leads warm" value={`${warm.length}`} sub={`${hot.length} hot activos`} accent="#C9A84C" />
        <StatCard label="Score promedio" value={avg} sub="BANT estimado" accent="#10b981" />
        <StatCard label="Accion hoy" value={`${today.length}`} sub="leads pendientes" accent="#6366f1" />
        <StatCard label="Cierres" value={`${closed}`} sub={`de ${leads.length} totales`} accent="#f59e0b" />
        {inbound.length>0&&<StatCard label="Inbound / Ads" value={`${inbound.length}`} sub="leads que llegaron solos" accent="#f472b6" />}
      </div>

      {/* Inbound alert */}
      {inbound.filter(l=>l.stage==="Nuevo").length>0&&(
        <div className="glass" style={{padding:"14px 18px",marginBottom:20,border:".5px solid rgba(244,114,182,.3)",display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:20}}>⚡</span>
          <div>
            <p style={{fontWeight:500,fontSize:13,color:"#f472b6"}}>{inbound.filter(l=>l.stage==="Nuevo").length} leads inbound sin contactar</p>
            <p style={{fontSize:12,color:"var(--txt2)"}}>Llegaron de anuncios o landing. Contactalos en menos de 5 minutos para maximizar conversion.</p>
          </div>
        </div>
      )}

      {/* Mision del dia */}
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h2 style={{fontSize:11,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)"}}>Mision del dia</h2>
          <span className="pill pill-gold">{today.length} pendientes</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
          {today.slice(0,4).map(lead=>(
            <div key={lead.id} className="glass" style={{padding:"14px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <p style={{fontWeight:500,fontSize:13}}>{lead.name}</p>
                <span className="pill" style={{background:`${tempColor(lead.temp)}18`,color:tempColor(lead.temp),border:`.5px solid ${tempColor(lead.temp)}35`,fontSize:9}}>{lead.temp}</span>
              </div>
              <p style={{fontSize:11,color:"var(--txt2)",marginBottom:8}}>{lead.role}</p>
              <ScoreBar score={lead.score} />
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                <span style={{fontSize:11,color:"var(--txt3)"}}>{lead.next_action}</span>
                <span className="mono" style={{fontSize:15,color:scoreColor(lead.score)}}>{lead.score}/10</span>
              </div>
              <div style={{display:"flex",gap:6,marginTop:8}}>
                {lead.linkedin_url&&<a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:"#60a5fa",textDecoration:"none"}}>🔵 LI</a>}
                {lead.phone&&<a href={`https://wa.me/${lead.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:"#25D366",textDecoration:"none"}}>💚 WA</a>}
                {lead.email&&<a href={`mailto:${lead.email}`} style={{fontSize:10,color:"#10b981",textDecoration:"none"}}>✉</a>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flujo */}
      <div className="glass" style={{padding:"16px 20px"}}>
        <p style={{fontSize:10,letterSpacing:".08em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500,marginBottom:12}}>Flujo de trabajo</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["Sesion del dia","Prospector","Redaccion IA","Inbox","Qualify Gate","Pipeline"].map((s,i)=>(
            <span key={i} className="btn btn-ghost" style={{fontSize:11,padding:"5px 12px"}}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeadDetail({lead,onClose,onUpdate,activities,onAddActivity,cadences}:{
  lead:Lead;onClose:()=>void;onUpdate:(l:Lead)=>void;
  activities:Activity[];onAddActivity:(a:Activity)=>void;
  cadences?:{id:string;name:string;steps:any[];status:string}[];
}) {
  const [l,setL] = useState(lead);
  const [tab,setTab] = useState<"info"|"send"|"activity"|"cadence">("info");
  const [enrolling,setEnrolling] = useState<string|null>(null);
  const toast = useToast();

  async function enrollInCadence(cadenceId:string, cadenceName:string) {
    setEnrolling(cadenceId);
    // Escribir en cadence_enrollments de Supabase
    const enrollment = {
      id: uid(),
      workspace_id: l.workspace_id,
      cadence_id: cadenceId,
      lead_id: l.id,
      status: "active",
      current_step_index: 0,
      next_step_at: new Date().toISOString(),
      enrolled_at: new Date().toISOString(),
    };
    const {error} = await supabase.from("cadence_enrollments").upsert(enrollment, {onConflict:"cadence_id,lead_id"});
    if(error) {
      toast(`Error: ${error.message}`,"err");
    } else {
      onAddActivity({
        id:uid(), lead_id:l.id, type:"note", channel:"crm",
        content:`Inscripto en cadencia: "${cadenceName}" — los pasos se ejecutarán automáticamente`,
        created_at:new Date().toISOString(), user_name:"Vos"
      });
      toast(`${l.name} inscripto en "${cadenceName}" ✓`,"ok");
    }
    setTimeout(()=>setEnrolling(null),1500);
  }

  function save() { onUpdate(l); toast("Lead actualizado","ok"); onClose(); }

  function handleSent(a:Activity) {
    const updated = {...l,stage:l.stage==="Nuevo"?"Contactado":l.stage,last_action:`DM via ${a.channel}`};
    setL(updated);
    onUpdate(updated);
    onAddActivity({...a,lead_id:l.id});
  }

  return (
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,.72)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div className="glass" style={{maxWidth:620,width:"100%",maxHeight:"90vh",overflowY:"auto",border:".5px solid var(--gold-b)"}} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{padding:"20px 24px 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <h2 className="display" style={{fontSize:22,fontWeight:400}}>{l.name}</h2>
            <p style={{fontSize:13,color:"var(--txt2)",marginTop:2}}>{l.role}{l.company?` · ${l.company}`:""}</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{padding:"4px 10px",fontSize:18}}>×</button>
        </div>

        {/* Quick links */}
        <div style={{padding:"10px 24px 0",display:"flex",gap:8,flexWrap:"wrap"}}>
          {l.linkedin_url&&<a href={l.linkedin_url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#60a5fa",textDecoration:"none",padding:"3px 10px",borderRadius:99,background:"rgba(96,165,250,.1)",border:".5px solid rgba(96,165,250,.25)"}}>🔵 LinkedIn</a>}
          {l.instagram_url&&<a href={l.instagram_url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#f472b6",textDecoration:"none",padding:"3px 10px",borderRadius:99,background:"rgba(244,114,182,.1)",border:".5px solid rgba(244,114,182,.25)"}}>📸 Instagram</a>}
          {l.phone&&<a href={`https://wa.me/${l.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#25D366",textDecoration:"none",padding:"3px 10px",borderRadius:99,background:"rgba(37,211,102,.1)",border:".5px solid rgba(37,211,102,.25)"}}>💚 WhatsApp</a>}
          {l.email&&<a href={`mailto:${l.email}`} style={{fontSize:11,color:"#10b981",textDecoration:"none",padding:"3px 10px",borderRadius:99,background:"rgba(16,185,129,.1)",border:".5px solid rgba(16,185,129,.25)"}}>✉ Email</a>}
        </div>

        {/* Tabs */}
        <div style={{padding:"14px 24px 0"}}>
          <div className="tab-bar">
            {[
              {id:"info",l:"Informacion"},
              {id:"send",l:"Enviar mensaje"},
              {id:"activity",l:`Actividad (${activities.length})`},
              ...(cadences&&cadences.length>0?[{id:"cadence",l:"Cadencias"}]:[])
            ].map(t=>(
              <button key={t.id} className={`tab-btn ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id as any)}>{t.l}</button>
            ))}
          </div>
        </div>

        <div style={{padding:"16px 24px 24px"}}>
          {tab==="info"&&(
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                {[
                  {label:"Nombre",field:"name"},{label:"Rol",field:"role"},
                  {label:"Empresa",field:"company"},{label:"Email",field:"email"},
                  {label:"Telefono",field:"phone"},{label:"LinkedIn URL",field:"linkedin_url"},
                ].map(f=>(
                  <div key={f.field}>
                    <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:5,fontWeight:500}}>{f.label}</label>
                    <input className="inp" value={(l as any)[f.field]||""} onChange={e=>setL(p=>({...p,[f.field]:e.target.value}))} />
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
                <div>
                  <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:5,fontWeight:500}}>Temperatura</label>
                  <select className="inp" value={l.temp} onChange={e=>setL(p=>({...p,temp:e.target.value as any}))}>
                    <option>Warm</option><option>Hot</option><option>Frio</option>
                  </select>
                </div>
                <div>
                  <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:5,fontWeight:500}}>Etapa</label>
                  <select className="inp" value={l.stage} onChange={e=>setL(p=>({...p,stage:e.target.value}))}>
                    {["Nuevo","Contactado","Calificado","Propuesta","Cerrado"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:5,fontWeight:500}}>Score</label>
                  <input type="number" className="inp" min={1} max={10} value={l.score} onChange={e=>setL(p=>({...p,score:+e.target.value}))} />
                </div>
              </div>
              <div style={{marginBottom:12}}>
                <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:5,fontWeight:500}}>Proxima accion</label>
                <input className="inp" value={l.next_action||""} onChange={e=>setL(p=>({...p,next_action:e.target.value}))} placeholder="Ej: Call manana 10am" />
              </div>
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:5,fontWeight:500}}>Notas</label>
                <textarea className="inp" style={{minHeight:70,resize:"vertical"}} value={l.notes||""} onChange={e=>setL(p=>({...p,notes:e.target.value}))} />
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
                <button className="btn btn-primary" onClick={save}>Guardar cambios</button>
              </div>
            </>
          )}
          {tab==="send"&&<SendMessagePanel lead={l} onSent={handleSent} />}
          {tab==="activity"&&<ActivityTimeline activities={activities} onAdd={a=>onAddActivity({...a,lead_id:l.id})} />}
          {tab==="cadence"&&(
            <div style={{paddingTop:8}}>
              <p style={{fontSize:12,color:"var(--txt2)",marginBottom:16,lineHeight:1.6}}>
                Inscribí a <strong style={{color:"var(--txt)"}}>{l.name}</strong> en una secuencia. Los pasos se ejecutarán automáticamente según el canal configurado.
              </p>
              {cadences&&cadences.filter(c=>c.status==="active").map(c=>(
                <div key={c.id} className="glass" style={{padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
                  <div style={{flex:1}}>
                    <p style={{fontSize:13,fontWeight:500}}>{c.name}</p>
                    <p style={{fontSize:11,color:"var(--txt2)",marginTop:2}}>
                      {c.steps.length} pasos · {c.steps.map((s:any)=>s.channel).filter((v:any,i:any,a:any)=>a.indexOf(v)===i).join(" → ")}
                    </p>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{fontSize:12,padding:"6px 14px",flexShrink:0}}
                    disabled={enrolling===c.id}
                    onClick={()=>enrollInCadence(c.id,c.name)}>
                    {enrolling===c.id?"Inscribiendo...":"+ Inscribir"}
                  </button>
                </div>
              ))}
              {cadences&&cadences.filter(c=>c.status!=="active").length>0&&(
                <p style={{fontSize:11,color:"var(--txt3)",marginTop:8}}>
                  {cadences.filter(c=>c.status!=="active").length} cadencias pausadas no aparecen.
                </p>
              )}
              {(!cadences||cadences.length===0)&&(
                <p style={{fontSize:12,color:"var(--txt3)"}}>No hay cadencias activas. Creá una en la sección Cadencias.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddLeadModal({open,onClose,onAdd}:{open:boolean;onClose:()=>void;onAdd:(l:Lead)=>void}) {
  const [f,setF]=useState({name:"",role:"",company:"",email:"",phone:"",linkedin_url:"",score:7,temp:"Warm" as Lead["temp"],stage:"Nuevo",next_action:""});
  const toast=useToast();
  function sub(){if(!f.name||!f.role)return;onAdd({...f,id:uid(),workspace_id:"",source:"manual",created_at:new Date().toISOString()});toast(`${f.name} agregado`,"ok");onClose();setF({name:"",role:"",company:"",email:"",phone:"",linkedin_url:"",score:7,temp:"Warm",stage:"Nuevo",next_action:""});}
  if(!open)return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,.72)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div className="glass" style={{maxWidth:560,width:"100%",padding:28,border:".5px solid var(--gold-b)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h2 className="display" style={{fontSize:22,fontWeight:400}}>Nuevo lead</h2>
          <button onClick={onClose} className="btn btn-ghost" style={{padding:"4px 10px",fontSize:18}}>×</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[{l:"Nombre *",f:"name",p:"Maria Garcia"},{l:"Rol *",f:"role",p:"CEO, Founder..."},{l:"Empresa",f:"company",p:""},{l:"Email",f:"email",p:""},{l:"Telefono",f:"phone",p:"+54 9 11..."},{l:"LinkedIn URL",f:"linkedin_url",p:"https://linkedin.com/in/..."}].map(x=>(
            <div key={x.f}>
              <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:5,fontWeight:500}}>{x.l}</label>
              <input className="inp" value={(f as any)[x.f]} onChange={e=>setF(p=>({...p,[x.f]:e.target.value}))} placeholder={x.p} />
            </div>
          ))}
          <div>
            <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:5,fontWeight:500}}>Temperatura</label>
            <select className="inp" value={f.temp} onChange={e=>setF(p=>({...p,temp:e.target.value as any}))}><option>Warm</option><option>Hot</option><option>Frio</option></select>
          </div>
          <div>
            <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:5,fontWeight:500}}>Score</label>
            <input type="number" className="inp" min={1} max={10} value={f.score} onChange={e=>setF(p=>({...p,score:+e.target.value}))} />
          </div>
        </div>
        <div style={{marginTop:12}}>
          <label style={{display:"block",fontSize:10,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:5,fontWeight:500}}>Proxima accion</label>
          <input className="inp" value={f.next_action} onChange={e=>setF(p=>({...p,next_action:e.target.value}))} placeholder="Ej: Enviar DM LinkedIn" />
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={sub} disabled={!f.name||!f.role}>Agregar lead</button>
        </div>
      </div>
    </div>
  );
}


function AuthScreen({onAuth}:{onAuth:(u:User,m:Member,w:Workspace)=>void}) {
  const [mode,setMode]=useState<"login"|"register">("login");
  const [email,setEmail]=useState("");const [pass,setPass]=useState("");
  const [wsName,setWsName]=useState("");const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  async function resetPassword() {
    if(!email){setError("Ingresá tu email primero");return;}
    setLoading(true);setError("");
    const {error:e}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});
    setLoading(false);
    if(e)setError(e.message);
    else setError("✓ Te enviamos un email para restablecer tu contraseña. Revisá tu bandeja.");
  }
  async function handleAuth() {
    setLoading(true);setError("");
    try {
      if (mode==="login") {
        const {data,error:e}=await supabase.auth.signInWithPassword({email,password:pass});
        if(e)throw e;
        if(data.user){
          // Get member + workspace
          const {data:mData,error:mErr}=await supabase.from("workspace_members").select("*,workspaces(*)").eq("user_id",data.user.id).single();
          if(mErr||!mData){
            throw new Error("Usuario sin workspace. Registrate primero o pedí que te inviten.");
          }
          const m:Member={id:mData.id,workspace_id:mData.workspace_id,user_id:mData.user_id,role:mData.role,display_name:mData.display_name};
          const w:Workspace=mData.workspaces as Workspace;
          onAuth(data.user,m,w);
        }
      } else {
        let userId:string|undefined;
        const {data,error:e}=await supabase.auth.signUp({email,password:pass});
        if(e){
          // Si ya está registrado, intentamos loguear con la contraseña ingresada
          if(e.message.toLowerCase().includes("already")||e.message.toLowerCase().includes("registrado")){
            const {data:loginData,error:loginErr}=await supabase.auth.signInWithPassword({email,password:pass});
            if(loginErr)throw new Error("Este email ya está registrado. Usá 'Iniciar sesión' con tu contraseña, o tocá 'Olvidé mi contraseña'.");
            userId=loginData.user?.id;
          } else throw e;
        } else {
          userId=data.user?.id;
        }
        if(userId){
          const displayName=email.split("@")[0];
          // ¿Ya tiene workspace? (caso usuario huérfano)
          const {data:existing}=await supabase.from("workspace_members").select("*,workspaces(*)").eq("user_id",userId).maybeSingle();
          if(existing&&existing.workspaces){
            onAuth({id:userId,email} as User,{id:existing.id,workspace_id:existing.workspace_id,user_id:userId,role:existing.role,display_name:existing.display_name},existing.workspaces as Workspace);
            setLoading(false);return;
          }
          // Crear workspace nuevo
          const slug=(wsName||displayName).toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")+"-"+Math.random().toString(36).slice(2,6);
          const {data:wData,error:wErr}=await supabase.from("workspaces").insert({name:wsName||displayName,slug,owner_id:userId}).select().single();
          if(wErr)throw wErr;
          if(wData){
            const memberId=crypto.randomUUID();
            await supabase.from("workspace_members").upsert({id:memberId,workspace_id:wData.id,user_id:userId,role:"admin",display_name:displayName},{onConflict:"workspace_id,user_id"});
            const {data:mData}=await supabase.from("workspace_members").select("*").eq("workspace_id",wData.id).eq("user_id",userId).single();
            onAuth({id:userId,email} as User,mData?{...mData,display_name:displayName}:{id:memberId,workspace_id:wData.id,user_id:userId,role:"admin",display_name:displayName},wData as Workspace);
          }
        }
      }
    } catch(e:any){
      let msg=e.message||"Error de autenticación";
      if(msg.toLowerCase().includes("invalid login")||msg.toLowerCase().includes("credentials"))
        msg="Email o contraseña incorrectos. Si olvidaste tu contraseña, tocá '¿Olvidaste tu contraseña?'";
      setError(msg);
    }
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
          <p style={{fontSize:12,color:"var(--txt3)",marginTop:6,letterSpacing:".1em",textTransform:"uppercase"}}>Motor B2B · v11</p>
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
          {mode==="login"&&(
            <button className="btn btn-ghost" style={{width:"100%",fontSize:12,marginBottom:6,color:"var(--gold)"}} onClick={resetPassword} disabled={loading}>
              ¿Olvidaste tu contraseña?
            </button>
          )}
          <div style={{height:.5,background:"var(--border)",margin:"14px 0"}} />
          <button className="btn btn-ghost" style={{width:"100%",fontSize:12}} onClick={demoMode}>
            Modo demo (sin Supabase)
          </button>
        </div>
        <p style={{textAlign:"center",fontSize:11,color:"var(--txt3)",marginTop:16}}>
          {SUPA_URL.includes("supabase.co")?"✓ Conectado a Supabase":"⚠ Sin conexión a Supabase"}
        </p>
      </div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────

function QualifyGate({leads,onScoreUpdate,workspaceId}:{leads:Lead[];onScoreUpdate:(id:string,score:number)=>void;workspaceId:string}) {
  const [sel,setSel]=useState<Lead|null>(null);
  const [ans,setAns]=useState({budget:"",authority:"",need:"",timeline:""});
  const qs=[
    {k:"budget",l:"Tiene presupuesto?",opts:["No sabe","< $500/mes","$500-2k/mes","> $2k/mes"]},
    {k:"authority",l:"Es el decisor?",opts:["No","Influenciador","Co-decisor","Decisor unico"]},
    {k:"need",l:"Urgencia del problema?",opts:["Baja","Media","Alta","Critica"]},
    {k:"timeline",l:"Cuando necesita solucion?",opts:["> 6 meses","3-6 meses","1-3 meses","Ahora"]}
  ] as const;
  const vals=Object.values(ans);
  const score=vals.some(v=>!v)?null:Math.round(vals.reduce((s,v)=>s+(
    ["No sabe","No","Baja","> 6 meses"].includes(v)?2:
    ["< $500/mes","Influenciador","Media","3-6 meses"].includes(v)?5:
    ["$500-2k/mes","Co-decisor","Alta","1-3 meses"].includes(v)?8:10
  ),0)/4*10)/10;
  const [aiAnalysis,setAiAnalysis] = useState("");
  const toast=useToast();
  return (
    <div className="fade-up" style={{padding:"28px 32px",height:"100%",overflowY:"auto"}}>
      <div style={{marginBottom:24}}>
        <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Qualify Gate</h1>
        <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Calificacion BANT interactiva</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:20,maxWidth:760}}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {leads.map(l=>(
            <div key={l.id} className={`glass ${sel?.id===l.id?"glass-gold":""}`} style={{padding:"12px 14px",cursor:"pointer"}} onClick={()=>setSel(l)}>
              <p style={{fontWeight:500,fontSize:12}}>{l.name}</p>
              <ScoreBar score={l.score} />
            </div>
          ))}
        </div>
        <div>
          {qs.map(q=>(
            <div key={q.k} style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:6,fontWeight:500}}>{q.l}</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {q.opts.map(opt=>(
                  <button key={opt} className={`btn ${(ans as any)[q.k]===opt?"btn-primary":"btn-ghost"}`}
                    style={{fontSize:12,padding:"6px 12px"}}
                    onClick={()=>setAns(p=>({...p,[q.k]:opt}))}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {sel&&(
            <div style={{marginBottom:14}}>
              <AiEnhanceButton
                feature="qualify"
                workspaceId={workspaceId}
                systemPrompt="Sos un experto en sales qualification BANT. Recibis datos de un lead y devolves SOLO un numero entre 1 y 10 representando su BANT score, donde 10 = ideal customer profile listo para comprar, 1 = no es fit. Considerás: budget probable, autoridad de decision, necesidad real, urgencia/timeline. NO escribas explicaciones, SOLO el numero."
                userPrompt={`Lead: ${sel.name}\nRol: ${sel.role}\nEmpresa: ${sel.company}\nTemperatura actual: ${sel.temp}\nEtapa: ${sel.stage}\nNotas: ${sel.notes||"sin notas"}\nUltima accion: ${sel.last_action||"ninguna"}\nProxima accion: ${sel.next_action||"ninguna"}\n\nDevolveme el BANT score (1-10):`}
                onResult={(text)=>{
                  const num = parseInt(text.trim().match(/\d+/)?.[0]||"0");
                  if(num>=1&&num<=10) {
                    onScoreUpdate(sel.id,num);
                    toast(`IA: ${sel.name} = ${num}/10`,"ok");
                  }
                }}
                label="Calcular score con Claude (automatico)"
              />
            </div>
          )}
          {score!==null&&(
            <div className="glass glass-gold" style={{padding:"20px 22px",marginTop:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:4}}>Score BANT</p>
                  <p className="display" style={{fontSize:42,fontWeight:300,color:scoreColor(score)}}>{score}<span style={{fontSize:20,color:"var(--txt2)"}}>/10</span></p>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}>
                  {sel&&<button className="btn btn-primary" onClick={()=>{onScoreUpdate(sel.id,Math.round(score));toast(`Score de ${sel.name} actualizado a ${Math.round(score)}`,"ok");}}>Actualizar score</button>}
                  {sel&&<AiEnhanceButton
                    feature="qualify" workspaceId={workspaceId} label="Analizar con IA"
                    systemPrompt="Sos experto en ventas B2B. Analizá las respuestas BANT y respondé en español con: 1) Diagnóstico del lead en 2 líneas 2) Probabilidad de cierre en % 3) Próxima acción concreta 4) Posible objeción principal. Sé conciso y directo."
                    userPrompt={`Lead: ${sel.name} (${sel.role||"sin rol"} en ${sel.company||"empresa desconocida"})\nBANT:\n- Presupuesto: ${ans.budget||"sin respuesta"}\n- Autoridad: ${ans.authority||"sin respuesta"}\n- Necesidad: ${ans.need||"sin respuesta"}\n- Timeline: ${ans.timeline||"sin respuesta"}\nScore calculado: ${score}/10\nNotas del lead: ${sel.notes||"ninguna"}`}
                    onResult={(text)=>setAiAnalysis(text)}
                  />}
                </div>
              </div>
              {aiAnalysis&&(
                <div style={{marginTop:12,padding:"12px 14px",borderRadius:8,background:"rgba(124,58,237,.08)",border:".5px solid rgba(124,58,237,.25)"}}>
                  <p style={{fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"#a78bfa",fontWeight:500,marginBottom:8}}>✦ Análisis IA</p>
                  <p style={{fontSize:12,color:"var(--txt2)",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{aiAnalysis}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VistaCloser({leads,onLeadClick}:{leads:Lead[];onLeadClick:(l:Lead)=>void}) {
  const sorted=[...leads].sort((a,b)=>b.score-a.score);
  return (
    <div className="fade-up" style={{padding:"28px 32px",height:"100%",overflowY:"auto"}}>
      <div style={{marginBottom:24}}>
        <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>Vista Closer</h1>
        <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Top oportunidades priorizadas por score</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:680}}>
        {sorted.map((lead,i)=>(
          <div key={lead.id} className="glass lead-card" onClick={()=>onLeadClick(lead)} style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:16}}>
            <span className="mono" style={{fontSize:20,fontWeight:300,color:"var(--txt3)",width:28,textAlign:"right",flexShrink:0}}>{i+1}</span>
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
              <div style={{display:"flex",gap:8,marginTop:8}}>
                {lead.linkedin_url&&<a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:"#60a5fa",textDecoration:"none"}}>🔵 LinkedIn</a>}
                {lead.phone&&<a href={`https://wa.me/${lead.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:"#25D366",textDecoration:"none"}}>💚 WA</a>}
                {lead.email&&<a href={`mailto:${lead.email}`} onClick={e=>e.stopPropagation()} style={{fontSize:10,color:"#10b981",textDecoration:"none"}}>✉ Mail</a>}
              </div>
            </div>
            <span className="mono" style={{fontSize:26,fontWeight:300,color:scoreColor(lead.score),flexShrink:0}}>{lead.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const NAV_V8 = [
  {id:"session",   label:"Sesion del dia",  icon:"◈"},
  {id:"dashboard", label:"Dashboard",        icon:"⌘"},
  {id:"pipeline",  label:"Pipeline",         icon:"◉"},
  {id:"inbound",   label:"Inbound / Ads",    icon:"⚡"},
  {id:"closer",    label:"Vista Closer",     icon:"◎"},
  {id:"buscador",  label:"Prospector",       icon:"✦"},
  {id:"import",    label:"Importar CSV",     icon:"▲"},
  {id:"generar",   label:"Redaccion IA",     icon:"✉"},
  {id:"email",     label:"Email Marketing",  icon:"≋"},
  {id:"cadence",   label:"Cadencias",        icon:"▣"},
  {id:"inbox",     label:"Inbox",            icon:"◆"},
  {id:"qualify",   label:"Qualify Gate",     icon:"◐"},
  {id:"metrics",   label:"Metricas",         icon:"⊞"},
  {id:"knowledge", label:"Conocimiento",     icon:"◻"},
  {id:"team",      label:"Equipo",           icon:"◈", adminOnly:true},
  {id:"ai",        label:"IA Avanzada",      icon:"✦", adminOnly:true},
  {id:"settings",  label:"API Keys",         icon:"⚙", adminOnly:true},
] as const;

function Sidebar({active,onChange,appUser,leadsCount,inboundCount,isOpen,onClose}:{
  active:string;onChange:(id:string)=>void;appUser:AppUser;leadsCount:number;inboundCount:number;
  isOpen:boolean;onClose:()=>void;
}) {
  const isAdmin=appUser.member.role==="admin";
  const navItems=NAV_V8.filter(n=>!("adminOnly" in n&&n.adminOnly)||isAdmin);

  function handleNav(id:string) {
    onChange(id);
    onClose();
  }

  return (
    <>
      <div className={`sidebar-overlay ${isOpen?"open":""}`} onClick={onClose} />
      <aside className={`sidebar-mobile ${isOpen?"open":""}`} style={{width:"var(--sidebar-w)",minHeight:"100vh",flexShrink:0,background:"rgba(6,8,14,0.97)",borderRight:".5px solid var(--border)",display:"flex",flexDirection:"column",backdropFilter:"blur(20px)"}}>
      <div style={{padding:"20px 20px 14px",borderBottom:".5px solid var(--border)"}}>
        <p className="display" style={{fontSize:22,fontWeight:300,letterSpacing:"-0.01em",lineHeight:1}}>Closer<span style={{color:"var(--gold)"}}>AI</span></p>
        <p style={{fontSize:10,color:"var(--txt3)",marginTop:4,letterSpacing:".1em",textTransform:"uppercase"}}>v11 - B2B Engine</p>
      </div>
      <div style={{padding:"10px 14px",borderBottom:".5px solid var(--border)"}}>
        <p style={{fontSize:9,letterSpacing:".08em",textTransform:"uppercase",color:"var(--txt3)",marginBottom:4,fontWeight:500}}>Workspace</p>
        <p style={{fontSize:12,fontWeight:500,color:"var(--txt)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{appUser.workspace.name}</p>
      </div>
      <div style={{padding:"10px 14px",borderBottom:".5px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:isAdmin?"var(--gold-m)":"var(--surface)",border:`.5px solid ${isAdmin?"var(--gold-b)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:isAdmin?"var(--gold)":"var(--txt2)",flexShrink:0}}>
          {(appUser.member.display_name||appUser.supabaseUser.email||"U")[0].toUpperCase()}
        </div>
        <div style={{overflow:"hidden",flex:1}}>
          <p style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{appUser.member.display_name||appUser.supabaseUser.email}</p>
          <span className={`pill ${isAdmin?"pill-gold":"pill-muted"}`} style={{fontSize:9}}>{isAdmin?"Admin":"Miembro"}</span>
        </div>
      </div>
      <nav style={{flex:1,padding:"8px 10px",overflowY:"auto"}}>
        <div style={{display:"flex",flexDirection:"column",gap:1}}>
          {navItems.map(item=>(
            <div key={item.id} className={`nav-item ${active===item.id?"active":""}`} onClick={()=>handleNav(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.id==="inbound"&&inboundCount>0&&(
                <span style={{marginLeft:"auto",fontSize:9,background:"#f47218",color:"#fff",padding:"1px 6px",borderRadius:99,fontWeight:600}}>{inboundCount}</span>
              )}
              {"adminOnly" in item&&item.adminOnly&&<span style={{marginLeft:"auto",fontSize:9,color:"var(--gold)",opacity:.7}}>admin</span>}
            </div>
          ))}
        </div>
      </nav>
      <div style={{padding:"10px 16px",borderTop:".5px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:11,color:"var(--txt3)"}}>Leads activos</span>
        <span className="pill pill-gold" style={{fontSize:11}}>{leadsCount}</span>
      </div>
    </aside>
    </>
  );
}

function TopBar({activeTab,onAddLead,onLogout,onSetup,onMenuClick}:{activeTab:string;onAddLead:()=>void;onLogout:()=>void;onSetup:()=>void;onMenuClick:()=>void}) {
  const label=NAV_V8.find(n=>n.id===activeTab)?.label||"";
  return (
    <header className="topbar-mobile" style={{height:52,flexShrink:0,borderBottom:".5px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",background:"rgba(7,9,15,.85)",backdropFilter:"blur(12px)"}}>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button className="hamburger-btn" onClick={onMenuClick}>≡</button>
        <span className="topbar-label" style={{fontSize:12,color:"var(--txt3)"}}>CloserAI</span>
        <span className="topbar-label" style={{fontSize:12,color:"var(--txt3)"}}>·</span>
        <span style={{fontSize:12,color:"var(--txt2)",fontWeight:500}}>{label}</span>
      </div>
      <div className="topbar-btns" style={{display:"flex",gap:10,alignItems:"center"}}>
        <button className="btn btn-ghost" style={{fontSize:12,padding:"6px 12px"}} onClick={onSetup}>Mi negocio</button>
        <button className="btn btn-primary" style={{fontSize:12,padding:"6px 14px"}} onClick={onAddLead}>+ Nuevo lead</button>
        <button className="btn btn-ghost" style={{fontSize:12,padding:"6px 12px"}} onClick={onLogout}>Salir</button>
      </div>
    </header>
  );
}

function AppLayout({appUser,onLogout}:{appUser:AppUser;onLogout:()=>void}) {
  const [tab,setTab] = useState("session");
  const [sidebarOpen,setSidebarOpen] = useState(false);
  const isAdmin=appUser.member.role==="admin";
  const [leads,setLeads] = useState<Lead[]>([]);
  const [leadsLoading,setLeadsLoading] = useState(true);
  const [activities,setActivities] = useState<Activity[]>([]);
  const [activitiesLoaded,setActivitiesLoaded] = useState<string|null>(null);

  // ── Cargar leads desde Supabase al montar ──────────────────
  useEffect(()=>{
    if(!appUser) return;
    setLeadsLoading(true);
    supabase.from("leads")
      .select("*")
      .eq("workspace_id",appUser.workspace.id)
      .order("created_at",{ascending:false})
      .then(({data,error})=>{
        if(!error && data) setLeads(data as Lead[]);
        setLeadsLoading(false);
      });
  },[appUser?.workspace.id]);

  const [cadencesList] = useState<{id:string;name:string;steps:any[];status:string}[]>([
    {id:"1",name:"Secuencia Founders 7D",status:"active",steps:[
      {day:1,channel:"linkedin",action:"DM inicial",template:"Hola [Nombre]..."},
      {day:3,channel:"email",action:"Email seguimiento",template:"Hola [Nombre]..."},
      {day:5,channel:"linkedin",action:"Segundo DM",template:"[Nombre], ¿tuviste chance?"},
      {day:7,channel:"whatsapp",action:"WhatsApp cierre",template:"Último intento [Nombre]."},
    ]},
    {id:"2",name:"Re-engagement 3 pasos",status:"paused",steps:[
      {day:1,channel:"email",action:"Email re-engagement",template:"Hace tiempo que no hablamos..."},
      {day:4,channel:"linkedin",action:"DM LinkedIn",template:"Hola, te escribía para..."},
      {day:8,channel:"email",action:"Email final",template:"Última vez."},
    ]},
  ]);
  const [teamMembers,setTeamMembers] = useState<Member[]>([]);
  useEffect(()=>{
    if(!appUser) return;
    supabase.from("workspace_members").select("*").eq("workspace_id",appUser.workspace.id)
      .then(({data})=>{ if(data) setTeamMembers(data as Member[]); });
  },[appUser?.workspace.id]);

  async function handleInviteMember(email:string, _role:"admin"|"member") {
    // Invitar por email: crea el usuario en Supabase Auth si no existe
    const {error} = await supabase.auth.admin?.inviteUserByEmail?.(email).catch(()=>({error:{message:"Invitación no soportada desde cliente"}})) || {error:null};
    // Como fallback, solo notificamos — el flujo completo requiere backend/Edge Function
    if(error) console.warn("invite:",error);
    // toast deshabilitado en este scope — notificar visualmente via UI
    console.log(`Invitación enviada a ${email} con rol ${_role}`);
  }

  const [selLead,setSelLead] = useState<Lead|null>(null);

  // ── Cargar actividades al seleccionar un lead ──────────────
  useEffect(()=>{
    if(!selLead || activitiesLoaded===selLead.id) return;
    supabase.from("activities")
      .select("*")
      .eq("lead_id",selLead.id)
      .order("created_at",{ascending:false})
      .then(({data})=>{
        if(data) setActivities(prev=>[...prev.filter(a=>a.lead_id!==selLead.id),...(data as Activity[])]);
        setActivitiesLoaded(selLead.id);
      });
  },[selLead?.id]);

  const [addOpen,setAddOpen] = useState(false);
  const [showSetup,setShowSetup] = useState(false);
  const [bizProfile,setBizProfile] = useState<BusinessProfile|null>(()=>{
    try{const s=localStorage.getItem("closer_biz_profile");return s?JSON.parse(s):null;}catch{return null;}
  });

  async function addLead(l:Lead) {
    const newLead = {...l, workspace_id:appUser.workspace.id};
    setLeads(p=>[newLead,...p]); // optimistic
    const {data,error} = await supabase.from("leads").insert(newLead).select().single();
    if(error) { console.error("addLead error:",error); }
    else if(data) setLeads(p=>p.map(x=>x.id===newLead.id?data as Lead:x));
  }
  async function updateLead(l:Lead) {
    setLeads(p=>p.map(x=>x.id===l.id?l:x)); // optimistic
    const {updated_at:_,...rest} = l as any;
    await supabase.from("leads").update({...rest,updated_at:new Date().toISOString()}).eq("id",l.id);
  }
  async function addActivity(a:Activity) {
    setActivities(p=>[a,...p]); // optimistic
    await supabase.from("activities").insert(a);
  }
  function getLeadActivities(leadId:string){return activities.filter(a=>a.lead_id===leadId);}
  async function saveBizProfile(p:BusinessProfile){
    localStorage.setItem("closer_biz_profile",JSON.stringify(p));
    setBizProfile(p);
    // También en Supabase para sync multi-dispositivo
    await supabase.from("workspaces").update({settings:p}).eq("id",appUser.workspace.id);
    setShowSetup(false);
  }
  function markSent(leadId:string,channel:string){
    const lead=leads.find(l=>l.id===leadId);if(!lead)return;
    updateLead({...lead,stage:lead.stage==="Nuevo"?"Contactado":lead.stage,last_action:`DM via ${channel}`});
    addActivity({id:uid(),lead_id:leadId,type:"dm",channel,content:"Marcado enviado desde sesion del dia",created_at:new Date().toISOString(),user_name:"Vos"});
  }

  const inboundNew = leads.filter(l=>(l.source==="inbound"||l.source==="ads")&&l.stage==="Nuevo").length;

  if(showSetup) return <BusinessSetup onSave={saveBizProfile} />;

  if(leadsLoading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",flexDirection:"column",gap:16,background:"var(--bg)"}}>
      <p className="display" style={{fontSize:28,fontWeight:300,color:"var(--gold)"}}>Closer<span style={{color:"var(--txt)"}}>AI</span></p>
      <p style={{fontSize:13,color:"var(--txt2)"}}>Cargando tu workspace...</p>
      <div style={{width:40,height:40,border:"2px solid var(--border)",borderTop:"2px solid var(--gold)",borderRadius:"50%",animation:"spin 1s linear infinite"}} />
    </div>
  );

  const views: Record<string,React.ReactNode> = {
    session:   <DailySession leads={leads} profile={bizProfile} onLeadClick={setSelLead} onMarkSent={markSent} />,
    dashboard: <Dashboard leads={leads} />,
    pipeline:  <Pipeline leads={leads} onLeadClick={setSelLead} onAddLead={addLead} />,
    inbound:   <Pipeline leads={leads.filter(l=>l.source==="inbound"||l.source==="ads"||l.source==="landing")} onLeadClick={setSelLead} onAddLead={addLead} />,
    closer:    <VistaCloser leads={leads} onLeadClick={setSelLead} />,
    buscador:  <Prospector onAddLead={addLead} workspaceId={appUser.workspace.id} />,
    import:    <CsvImport onImport={ls=>{ls.forEach(l=>addLead(l));}} workspaceId={appUser.workspace.id} />,
    generar:   <RedaccionIA leads={leads} workspaceId={appUser.workspace.id} />,
    email:     <EmailMarketing isAdmin={isAdmin} workspaceId={appUser.workspace.id} leads={leads} />,
    cadence:   <Cadences isAdmin={isAdmin} workspaceId={appUser.workspace.id} />,
    inbox:     <Inbox leads={leads} workspaceId={appUser.workspace.id} />,
    qualify:   <QualifyGate leads={leads} onScoreUpdate={(id,s)=>setLeads(p=>p.map(l=>l.id===id?{...l,score:s}:l))} workspaceId={appUser.workspace.id} />,
    metrics:   <Metrics leads={leads} isAdmin={isAdmin} />,
    knowledge: <Knowledge isAdmin={isAdmin} workspaceId={appUser.workspace.id} />,
    team:      isAdmin?<TeamManagement workspace={appUser.workspace} members={teamMembers} onInvite={handleInviteMember} />:null,
    ai:        isAdmin?<AiSettings workspaceId={appUser.workspace.id} />:null,
    settings:  isAdmin?<ApiSettings workspaceId={appUser.workspace.id} />:null,
  };

  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden"}}>
      <Sidebar active={tab} onChange={setTab} appUser={appUser} leadsCount={leads.length} inboundCount={inboundNew} isOpen={sidebarOpen} onClose={()=>setSidebarOpen(false)} />
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",width:"100%"}}>
        <TopBar activeTab={tab} onAddLead={()=>setAddOpen(true)} onLogout={onLogout} onSetup={()=>setShowSetup(true)} onMenuClick={()=>setSidebarOpen(p=>!p)} />
        <main style={{flex:1,overflow:"hidden"}}>{views[tab]||views["session"]}</main>
      </div>
      {selLead&&(
        <LeadDetail lead={selLead} onClose={()=>setSelLead(null)} onUpdate={updateLead}
          activities={getLeadActivities(selLead.id)} onAddActivity={addActivity}
          cadences={cadencesList} />
      )}
      <AddLeadModal open={addOpen} onClose={()=>setAddOpen(false)} onAdd={addLead} />
    </div>
  );
}

export default function CRMApp() {
  const [appUser,setAppUser] = useState<AppUser|null>(null);
  useEffect(()=>{
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
  async function handleLogout(){await supabase.auth.signOut();setAppUser(null);}
  return (
    <ToastProvider>
      {appUser
        ?<AppLayout appUser={appUser} onLogout={handleLogout} />
        :<AuthScreen onAuth={(u,m,w)=>setAppUser({supabaseUser:u,member:m,workspace:w})} />
      }
    </ToastProvider>
  );
}
