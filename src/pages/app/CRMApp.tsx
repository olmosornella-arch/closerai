// CloserAI - CRMApp v4 - Full Stack Edition
// Supabase Auth + Roles + API Keys + Metricas + Email + Cadencias + Knowledge + Prospector v5 (14 fuentes)
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
  // ── IA ────────────────────────────────────────────────────────────────────
  {
    key:"anthropic", label:"Anthropic (Claude)", category:"ia",
    placeholder:"sk-ant-api03-...",
    desc:"Genera secuencias de email, califica leads y redacta mensajes personalizados.",
    how:"Ir a console.anthropic.com → API Keys → Create Key. Copiar y pegar acá.",
    usedFor:["Generar secuencias con IA","Calificar leads","Redacción asistida"],
    docsUrl:"https://console.anthropic.com/settings/keys",
    required: false,
  },
  {
    key:"openai", label:"OpenAI (GPT)", category:"ia",
    placeholder:"sk-proj-...",
    desc:"Alternativa a Claude para generación de contenido.",
    how:"Ir a platform.openai.com → API Keys → Create new secret key.",
    usedFor:["Generación de mensajes","Análisis de respuestas"],
    docsUrl:"https://platform.openai.com/api-keys",
    required: false,
  },
  {
    key:"groq", label:"Groq (Llama 3 — Gratis)", category:"ia",
    placeholder:"gsk_...",
    desc:"Llama 3.3 70B ultra rápido. Plan gratuito generoso.",
    how:"Ir a console.groq.com → API Keys → Create API Key.",
    usedFor:["Generación rápida de mensajes","Alternativa gratuita a Claude"],
    docsUrl:"https://console.groq.com/keys",
    required: false,
  },

  // ── Email ─────────────────────────────────────────────────────────────────
  {
    key:"resend", label:"Resend", category:"email",
    placeholder:"re_xxxxxxxxxxxxxxxxxxxx",
    desc:"Envío de emails desde tu dominio propio. 3,000 emails/mes gratis. Mejor deliverability que Gmail para outreach.",
    how:"1. Ir a resend.com → Sign up gratis\n2. Agregar y verificar tu dominio (comuniofficial.com) en DNS → 5 min\n3. API Keys → Create API Key → copiar acá\n4. El email se envía DESDE tu dominio, no desde resend.com",
    usedFor:["Campañas de email outreach","Secuencias multi-paso","Envío masivo a leads"],
    docsUrl:"https://resend.com/api-keys",
    required: false,
    badge:"Recomendado",
  },
  {
    key:"gmail_user", label:"Gmail — Usuario", category:"email",
    placeholder:"tuemail@gmail.com",
    desc:"Tu dirección de Gmail para enviar emails. Límite: ~500/día.",
    how:"Solo ingresá tu email de Gmail completo. También necesitás configurar gmail_pass con un App Password.",
    usedFor:["Envío de emails via Gmail","Alternativa a Resend para volumen bajo"],
    docsUrl:"https://myaccount.google.com/security",
    required: false,
  },
  {
    key:"gmail_pass", label:"Gmail — App Password", category:"email",
    placeholder:"xxxx xxxx xxxx xxxx",
    desc:"Contraseña de aplicación de Google (NO tu contraseña de Gmail). Se genera en tu cuenta de Google.",
    how:"1. Ir a myaccount.google.com → Seguridad\n2. Activar verificación en 2 pasos (obligatorio)\n3. Buscar 'Contraseñas de aplicación'\n4. Seleccionar 'Correo' y tu dispositivo → Generar\n5. Copiar los 16 caracteres acá\nNOTA: Las credenciales de Gmail corren en Supabase Edge Functions — nunca llegan al browser.",
    usedFor:["Auth del servidor de Gmail","Usado junto con gmail_user"],
    docsUrl:"https://myaccount.google.com/apppasswords",
    required: false,
  },
  {
    key:"sendgrid", label:"SendGrid", category:"email",
    placeholder:"SG.xxxxxxxxxxxxxxxxxxxxxxxx",
    desc:"Plataforma de email masivo. 100 emails/día gratis forever. Ideal para volumen alto.",
    how:"1. Ir a sendgrid.com → Create Account\n2. Settings → API Keys → Create API Key (Full Access)\n3. Copiar acá",
    usedFor:["Emails masivos (+10k/mes)","Alternativa enterprise a Resend"],
    docsUrl:"https://app.sendgrid.com/settings/api_keys",
    required: false,
  },

  // ── WhatsApp ──────────────────────────────────────────────────────────────
  {
    key:"whatsapp_token", label:"WhatsApp — Token de acceso", category:"whatsapp",
    placeholder:"EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    desc:"Token de la Meta WhatsApp Cloud API. Permite enviar mensajes de texto a leads que tengan WhatsApp.",
    how:"1. Ir a developers.facebook.com → My Apps → Crear App → Business\n2. Agregar producto 'WhatsApp'\n3. WhatsApp → API Setup → copiar el 'Temporary access token' (o generar permanente)\n4. Verificar número de teléfono sender\nREQUISITO: Cuenta de Meta Business verificada",
    usedFor:["Campañas WhatsApp","Mensajes de seguimiento","Outreach directo"],
    docsUrl:"https://developers.facebook.com/docs/whatsapp/cloud-api/get-started",
    required: false,
    badge:"Requiere cuenta Business",
  },
  {
    key:"whatsapp_phone_id", label:"WhatsApp — Phone Number ID", category:"whatsapp",
    placeholder:"123456789012345",
    desc:"ID del número de WhatsApp Business desde el que se envían los mensajes. Se obtiene en el mismo panel de Meta.",
    how:"En developers.facebook.com → tu App → WhatsApp → API Setup → copiar 'Phone number ID' (número bajo 'From')",
    usedFor:["Identificar el número sender de WhatsApp"],
    docsUrl:"https://developers.facebook.com/docs/whatsapp/cloud-api/get-started",
    required: false,
  },

  // ── SMS ───────────────────────────────────────────────────────────────────
  {
    key:"twilio_sid", label:"Twilio — Account SID", category:"sms",
    placeholder:"ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    desc:"ID de tu cuenta Twilio. Permite enviar SMS a cualquier número del mundo.",
    how:"1. Ir a twilio.com → Sign up (trial gratis con $15 de crédito)\n2. Console → Account Info → copiar 'Account SID'\nNOTE: Con trial solo podés enviar a números verificados. Para producción, actualizá el plan.",
    usedFor:["Campañas SMS","Mensajes de seguimiento por texto"],
    docsUrl:"https://console.twilio.com/",
    required: false,
  },
  {
    key:"twilio_token", label:"Twilio — Auth Token", category:"sms",
    placeholder:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    desc:"Token de autenticación de Twilio. Va siempre junto al Account SID.",
    how:"En twilio.com → Console → Account Info → copiar 'Auth Token' (hacé click en el ojo para verlo)",
    usedFor:["Auth de Twilio para SMS"],
    docsUrl:"https://console.twilio.com/",
    required: false,
  },
  {
    key:"twilio_from", label:"Twilio — Número sender", category:"sms",
    placeholder:"+14155550000",
    desc:"Tu número de Twilio desde el que se envían los SMS. Formato E.164 con + adelante.",
    how:"En twilio.com → Phone Numbers → Manage → Active Numbers → copiar el número en formato +1XXXXXXXXXX",
    usedFor:["Número de origen de los SMS enviados"],
    docsUrl:"https://console.twilio.com/us1/develop/phone-numbers/manage/incoming",
    required: false,
  },

  // ── LinkedIn ──────────────────────────────────────────────────────────────
  {
    key:"phantombuster", label:"Phantombuster", category:"linkedin",
    placeholder:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    desc:"Automatización de LinkedIn DMs. ADVERTENCIA: riesgo de restricción de cuenta. Usá con moderación.",
    how:"1. Ir a phantombuster.com → Sign up\n2. Dashboard → API → copiar API Key\nUSO: CloserAI genera el mensaje, Phantombuster lo envía via scraper",
    usedFor:["LinkedIn DMs automatizados (riesgo)","Alternativa: copiar/pegar asistido"],
    docsUrl:"https://phantombuster.com/",
    required: false,
    badge:"⚠ Riesgo de ban",
  },

  // ── Prospección ───────────────────────────────────────────────────────────
  {
    key:"apify", label:"Apify", category:"prospect",
    placeholder:"apify_api_xxxxxxxxxxxxxxxxxxxx",
    desc:"Scraping de LinkedIn, Instagram, Facebook y Google Maps para extraer leads con email y teléfono.",
    how:"1. Ir a apify.com → Sign up (free tier: $5 créditos/mes)\n2. Settings → Integrations → API tokens → Create token\n3. Copiar acá",
    usedFor:["Prospector de leads (todas las fuentes)","Enriquecimiento de contactos"],
    docsUrl:"https://console.apify.com/account/integrations",
    required: false,
  },
  {
    key:"apollo", label:"Apollo.io", category:"prospect",
    placeholder:"xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    desc:"Base de datos B2B con 275M+ contactos verificados. Emails y teléfonos directos.",
    how:"1. Ir a apollo.io → Sign up (plan gratis: 50 contactos/mes)\n2. Settings → Integrations → API → copiar API Key",
    usedFor:["Búsqueda de contactos B2B","Enriquecimiento de leads","Verificación de emails"],
    docsUrl:"https://developer.apollo.io/",
    required: false,
  },

  // ── Agendado ──────────────────────────────────────────────────────────────
  {
    key:"calendly_url", label:"Calendly — URL pública", category:"meet",
    placeholder:"https://calendly.com/tu-usuario/30min",
    desc:"Tu link de Calendly para que leads agenden calls directamente desde los mensajes.",
    how:"En calendly.com → copiá la URL de tu evento (ej: calendly.com/justin/30min)",
    usedFor:["Link de agendado en emails","CTA de cierre en WhatsApp/SMS"],
    docsUrl:"https://calendly.com/",
    required: false,
  },
  {
    key:"cal_url", label:"Cal.com — URL pública", category:"meet",
    placeholder:"https://cal.com/tu-usuario/30min",
    desc:"Alternativa open-source a Calendly. Auto-hosteable.",
    how:"En cal.com → tu evento → copiar el link público",
    usedFor:["Link de agendado en mensajes"],
    docsUrl:"https://cal.com/",
    required: false,
  },

  // ── Automatización ────────────────────────────────────────────────────────
  {
    key:"n8n", label:"n8n — Webhook", category:"auto",
    placeholder:"https://tu-n8n.app/webhook/xxxxxxxx",
    desc:"Tu webhook de n8n para disparar flujos automáticos cuando un lead responde o cambia de estado.",
    how:"En n8n → nuevo flujo → nodo Webhook → copiar la URL del webhook de producción",
    usedFor:["Automatizar seguimiento","Notificaciones al equipo","Integrar con CRM externo"],
    docsUrl:"https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/",
    required: false,
  },
  {
    key:"make", label:"Make.com — Webhook", category:"auto",
    placeholder:"https://hook.eu1.make.com/xxxxxxxx",
    desc:"Webhook de Make (ex-Integromat) para automatizaciones avanzadas.",
    how:"En Make → nuevo escenario → módulo Webhooks → Custom Webhook → copiar URL",
    usedFor:["Automatización multi-paso","Integración con 1000+ apps"],
    docsUrl:"https://www.make.com/en/help/tools/webhooks",
    required: false,
  },
  {
    key:"telegram_bot", label:"Telegram — Bot Token", category:"auto",
    placeholder:"7123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    desc:"Token de tu bot de Telegram para recibir alertas cuando un lead responde.",
    how:"1. Abrir Telegram → buscar @BotFather\n2. /newbot → elegir nombre → copiar el token que te da",
    usedFor:["Alertas de respuestas de leads","Notificaciones de campañas"],
    docsUrl:"https://core.telegram.org/bots/tutorial",
    required: false,
  },
  {
    key:"telegram_chat", label:"Telegram — Chat ID", category:"auto",
    placeholder:"123456789",
    desc:"Tu Chat ID de Telegram donde el bot envía las alertas.",
    how:"1. Con tu bot creado, escribirle cualquier mensaje\n2. Abrir: https://api.telegram.org/bot{TU_TOKEN}/getUpdates\n3. Copiar el 'id' dentro de 'chat'",
    usedFor:["Destino de las alertas del bot"],
    docsUrl:"https://core.telegram.org/bots/api#getting-updates",
    required: false,
  },
];

const API_CATEGORIES = [
  {id:"email",     label:"Email",      icon:"✉",  desc:"Enviá campañas de email a tus leads"},
  {id:"whatsapp",  label:"WhatsApp",   icon:"💬", desc:"Mensajes directos via Meta Cloud API"},
  {id:"sms",       label:"SMS",        icon:"📱", desc:"SMS masivos via Twilio"},
  {id:"linkedin",  label:"LinkedIn",   icon:"🔵", desc:"DMs asistidos o automatizados"},
  {id:"ia",        label:"IA",         icon:"✦",  desc:"Genera mensajes y califica leads con IA"},
  {id:"prospect",  label:"Prospección",icon:"◉",  desc:"Scrapers para encontrar leads y emails"},
  {id:"meet",      label:"Agendado",   icon:"◈",  desc:"Links de Calendly / Cal.com"},
  {id:"auto",      label:"Automatización",icon:"⚙",desc:"n8n, Make, Telegram webhooks"},
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

// ── OUTREACH HUB (Email · WhatsApp · SMS) ────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
// CLOSERAI — OUTREACH HUB v4
// Canales: Email (Resend/Gmail SMTP) · WhatsApp (Meta Cloud API) · SMS (Twilio)
// Multi-campaña por lead · Baja/pausa por lead · Snapshot anti-borrado
// API keys SOLO en localStorage — nunca en código ni .env ni GitHub
// ══════════════════════════════════════════════════════════════════════════════

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface CampaignStep {
  id: string; campaign_id: string; workspace_id: string;
  step_number: number; delay_days: number;
  channel: "email"|"whatsapp"|"sms";
  subject: string; body: string;
  ai_generated: boolean; status: "active"|"skip";
}
interface CampaignLead {
  id: string; campaign_id: string; workspace_id: string; lead_id?: string;
  lead_name: string; lead_email: string; lead_phone?: string;
  lead_company?: string; lead_niche?: string; lead_audience?: number;
  status: "pending"|"in_progress"|"completed"|"unsubscribed"|"bounced"|"paused";
  current_step: number; added_at: string;
}
interface OutreachCampaign {
  id: string; workspace_id: string; name: string;
  channel: "email"|"whatsapp"|"sms"|"multi";
  status: "draft"|"active"|"paused"|"completed";
  sent_count: number; open_count: number; reply_count: number;
  created_at: string;
}

// ─── Leer API key desde localStorage (NUNCA de .env) ─────────────────────────
function getKey(wsId: string, svc: string): string|null {
  try { const r = localStorage.getItem(`closer_apikeys_${wsId}`); return r ? JSON.parse(r)[svc]||null : null; }
  catch { return null; }
}

// ─── Detectar proveedor de email configurado ─────────────────────────────────
function detectEmailProvider(wsId: string): "resend"|"gmail"|"none" {
  if (getKey(wsId,"resend"))       return "resend";
  if (getKey(wsId,"gmail_user") && getKey(wsId,"gmail_pass")) return "gmail";
  return "none";
}

// ─── Renderizar variables dinámicas ──────────────────────────────────────────
function renderVars(text: string, lead: CampaignLead): string {
  const aud  = lead.lead_audience || 100000;
  const miem = Math.round(aud * 0.005);
  const proj = `$${(miem * 20).toLocaleString("en-US")}`;
  return text
    .replace(/\[Nombre\]/gi,     lead.lead_name?.split(" ")[0] || "")
    .replace(/\[Empresa\]/gi,    lead.lead_company || "")
    .replace(/\[nicho\]/gi,      lead.lead_niche || "tu nicho")
    .replace(/\[audiencia\]/gi,  aud.toLocaleString("en-US"))
    .replace(/\[proyeccion\]/gi, proj);
}

// ─── HTML inline Gmail-compatible ────────────────────────────────────────────
function buildHtml(body: string, lead: CampaignLead, fromName: string, fromEmail: string): string {
  const aud  = lead.lead_audience || 100000;
  const miem = Math.round(aud * 0.005);
  const proj = `$${(miem * 20).toLocaleString("en-US")}`;
  const hasProj = body.toLowerCase().includes("[proyeccion]") || body.includes("proyecci");
  const rendered = renderVars(body, lead);
  const paras = rendered.split("\n\n")
    .map(p => `<p style="margin:0 0 18px 0;font-family:Georgia,serif;font-size:15px;line-height:1.7;color:#1a1a1a;">${p.replace(/\n/g,"<br>")}</p>`)
    .join("");
  const ecuacion = hasProj ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9f9f7;border-left:3px solid #1a1a1a;padding:14px 18px;margin:0 0 20px 0;">
      <tr><td>
        <p style="font-size:11px;color:#888;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 10px 0;font-family:Arial,sans-serif;">Proyección conservadora</p>
        <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:13px;color:#555;">
          <strong style="color:#0a0a0a;">${aud.toLocaleString("en-US")}</strong> seg × <strong style="color:#0a0a0a;">0.5%</strong> × <strong style="color:#0a0a0a;">$20/mes</strong>
        </p>
        <p style="margin:6px 0 0 0;font-family:Georgia,serif;font-size:22px;font-weight:700;color:#0a0a0a;">${proj} <span style="font-size:14px;font-weight:400;color:#555;">/ mes</span></p>
        <p style="margin:4px 0 0 0;font-family:Arial,sans-serif;font-size:12px;color:#888;">${miem.toLocaleString("en-US")} miembros pagos estimados</p>
      </td></tr>
    </table>` : "";
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="max-width:560px;padding:0;">
    ${paras}${ecuacion}
    <p style="margin:28px 0 0 0;padding-top:18px;border-top:1px solid #e8e8e8;font-size:12px;color:#999;font-family:Arial,sans-serif;">
      <strong style="color:#1a1a1a;">${fromName}</strong><br>
      <a href="mailto:${fromEmail}" style="color:#1a1a1a;text-decoration:none;">${fromEmail}</a>
    </p>
  </td></tr></table>`;
}

// ─── Enviar email vía Resend ──────────────────────────────────────────────────
async function sendViaResend(key: string, to: string, subject: string, html: string, text: string, fromName: string, fromEmail: string): Promise<string> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {"Content-Type":"application/json","Authorization":`Bearer ${key}`},
    body: JSON.stringify({from:`${fromName} <${fromEmail}>`, to:[to], subject, html, text, reply_to: fromEmail}),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message||"Resend error"); }
  const d = await res.json();
  return d.id;
}

// ─── Enviar email vía Gmail SMTP (relay a través de backend edge function) ────
// NOTA: Gmail SMTP directo desde el browser está bloqueado por CORS.
// El flujo correcto es: CloserAI → Supabase Edge Function → nodemailer/Gmail SMTP
// La Edge Function lee GMAIL_USER y GMAIL_PASS de sus secrets (no en frontend)
async function sendViaGmail(supabaseUrl: string, supabaseKey: string, to: string, subject: string, html: string, text: string, fromName: string, fromEmail: string): Promise<string> {
  const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
    method: "POST",
    headers: {"Content-Type":"application/json","Authorization":`Bearer ${supabaseKey}`},
    body: JSON.stringify({to, subject, html, text, fromName, fromEmail}),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error||"Gmail edge fn error"); }
  const d = await res.json();
  return d.messageId || "gmail-sent";
}

// ─── Enviar WhatsApp vía Meta Cloud API ──────────────────────────────────────
async function sendViaWhatsApp(token: string, phoneNumberId: string, to: string, body: string): Promise<string> {
  // 'to' debe ser número en formato E.164 sin + (ej: 5491155550000)
  const phone = to.replace(/\D/g,"");
  const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {"Content-Type":"application/json","Authorization":`Bearer ${token}`},
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type:    "individual",
      to:                phone,
      type:              "text",
      text:              {preview_url: false, body},
    }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message||"WhatsApp error"); }
  const d = await res.json();
  return d.messages?.[0]?.id || "wa-sent";
}

// ─── Enviar SMS vía Twilio ────────────────────────────────────────────────────
async function sendViaTwilio(sid: string, token: string, to: string, body: string, from: string): Promise<string> {
  const creds = btoa(`${sid}:${token}`);
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {"Content-Type":"application/x-www-form-urlencoded","Authorization":`Basic ${creds}`},
    body: new URLSearchParams({To: to, From: from, Body: body}).toString(),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message||"Twilio error"); }
  const d = await res.json();
  return d.sid;
}

// ─── Generar secuencia con Claude ────────────────────────────────────────────
async function generateWithAI(key: string, campName: string, nicho: string, count: number, channel: string): Promise<any[]> {
  const channelHint = channel==="whatsapp" ? "WhatsApp (máx 160 chars, tono muy conversacional, sin formato HTML)"
                    : channel==="sms"       ? "SMS (máx 140 chars, directo, sin saludos)"
                    : "Email frío (máx 80 palabras, estilo humano, variables [Nombre][nicho][audiencia][proyeccion])";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: 2000,
      messages:[{role:"user",content:
        `Secuencia de ${count} mensajes outreach frío para "${campName}", nicho "${nicho}", canal: ${channelHint}.
Escalá urgencia entre pasos. Respondé SOLO JSON sin markdown:
[{"step":1,"delay_days":0,"subject":"...","body":"..."},{"step":2,"delay_days":3,"subject":"...","body":"..."}]
Para whatsapp/sms, "subject" puede ir vacío.`
      }]
    })
  });
  const d = await res.json();
  return JSON.parse((d.content?.[0]?.text||"[]").replace(/```json|```/g,"").trim());
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════════
function EmailMarketing({isAdmin, workspaceId}: {isAdmin:boolean; workspaceId:string}) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [campaigns,    setCampaigns]    = useState<OutreachCampaign[]>([]);
  const [steps,        setSteps]        = useState<Record<string,CampaignStep[]>>({});
  const [campLeads,    setCampLeads]    = useState<Record<string,CampaignLead[]>>({});
  const [crmLeads,     setCrmLeads]     = useState<Lead[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [activeCamp,   setActiveCamp]   = useState<OutreachCampaign|null>(null);
  const [activeTab,    setActiveTab]    = useState<"steps"|"leads"|"stats">("steps");
  // modales
  const [newCampModal, setNewCampModal] = useState(false);
  const [editStep,     setEditStep]     = useState<CampaignStep|null>(null);
  const [isNewStep,    setIsNewStep]    = useState(false);
  const [showLeadPick, setShowLeadPick] = useState(false);
  const [showMoveModal,setShowMoveModal]= useState<CampaignLead|null>(null);
  // form nueva campaña
  const [nc,           setNc]           = useState({name:"",nicho:"",channel:"email" as "email"|"whatsapp"|"sms"|"multi",steps:3});
  const [generatingAI, setGeneratingAI] = useState(false);
  // envío
  const [sending,      setSending]      = useState<string|null>(null);
  const [selectedLeads,setSelectedLeads]= useState<string[]>([]);
  // config envío
  const [fromName,     setFromName]     = useState("Justin Jimenez");
  const [fromEmail,    setFromEmail]    = useState("justin@comuniofficial.com");
  const [showConfig,   setShowConfig]   = useState(false);

  const toast         = useToast();
  const emailProvider = detectEmailProvider(workspaceId);
  const resendKey     = getKey(workspaceId,"resend");
  const anthropicKey  = getKey(workspaceId,"anthropic");
  const waToken       = getKey(workspaceId,"whatsapp_token");
  const waPhoneId     = getKey(workspaceId,"whatsapp_phone_id");
  const twilioSid     = getKey(workspaceId,"twilio_sid");
  const twilioToken   = getKey(workspaceId,"twilio_token");
  const twilioFrom    = getKey(workspaceId,"twilio_from");

  const CHANNEL_META: Record<string,{label:string;icon:string;color:string}> = {
    email:    {label:"Email",    icon:"✉",  color:"var(--blue)"},
    whatsapp: {label:"WhatsApp", icon:"💬", color:"var(--emerald)"},
    sms:      {label:"SMS",      icon:"📱", color:"var(--gold)"},
    multi:    {label:"Multi",    icon:"⚡", color:"var(--txt2)"},
  };

  // ── Cargar todo desde Supabase ─────────────────────────────────────────────
  useEffect(() => { loadAll(); }, [workspaceId]);

  async function loadAll() {
    setLoading(true);
    try {
      const [cR,sR,lR,crR] = await Promise.all([
        supabase.from("campaigns").select("*").eq("workspace_id",workspaceId).order("created_at",{ascending:false}),
        supabase.from("campaign_steps").select("*").eq("workspace_id",workspaceId).order("step_number"),
        supabase.from("campaign_leads").select("*").eq("workspace_id",workspaceId).order("added_at",{ascending:false}),
        supabase.from("leads").select("*").eq("workspace_id",workspaceId).limit(400),
      ]);
      if (cR.data) setCampaigns(cR.data);
      if (sR.data) {
        const m: Record<string,CampaignStep[]> = {};
        sR.data.forEach((s:CampaignStep) => { if(!m[s.campaign_id]) m[s.campaign_id]=[]; m[s.campaign_id].push(s); });
        setSteps(m);
      }
      if (lR.data) {
        const m: Record<string,CampaignLead[]> = {};
        lR.data.forEach((l:CampaignLead) => { if(!m[l.campaign_id]) m[l.campaign_id]=[]; m[l.campaign_id].push(l); });
        setCampLeads(m);
      }
      if (crR.data) setCrmLeads(crR.data);
    } catch { toast("Error cargando campañas","error"); }
    setLoading(false);
  }

  // ── Crear campaña ──────────────────────────────────────────────────────────
  async function createCampaign(withAI: boolean) {
    if (!nc.name.trim()) return;
    setGeneratingAI(withAI);
    try {
      const {data:camp,error} = await supabase.from("campaigns")
        .insert({workspace_id:workspaceId,name:nc.name,channel:nc.channel,status:"draft",sent_count:0,open_count:0,reply_count:0})
        .select().single();
      if (error) throw error;
      setCampaigns(p=>[camp,...p]);

      if (withAI && anthropicKey && nc.nicho) {
        const aiSteps = await generateWithAI(anthropicKey, nc.name, nc.nicho, nc.steps, nc.channel);
        const rows = aiSteps.map(s=>({
          campaign_id:s.campaign_id||camp.id, workspace_id:workspaceId,
          step_number:s.step, delay_days:s.delay_days,
          channel: nc.channel==="multi"?"email":nc.channel,
          subject:s.subject||"", body:s.body||"",
          ai_generated:true, status:"active",
        })).map(r=>({...r,campaign_id:camp.id}));
        const {data:ss} = await supabase.from("campaign_steps").insert(rows).select();
        if (ss) setSteps(p=>({...p,[camp.id]:ss}));
        toast(`✅ Campaña con ${aiSteps.length} pasos generados por IA`,"ok");
      } else {
        toast("Campaña creada — agregá pasos","ok");
      }
      setActiveCamp(camp); setActiveTab("steps");
      setNewCampModal(false); setNc({name:"",nicho:"",channel:"email",steps:3});
    } catch(e:any) { toast("Error: "+e.message,"error"); }
    setGeneratingAI(false);
  }

  // ── Guardar paso ───────────────────────────────────────────────────────────
  async function saveStep() {
    if (!editStep || !activeCamp) return;
    try {
      if (isNewStep) {
        const {data,error} = await supabase.from("campaign_steps")
          .insert({...editStep,id:undefined,campaign_id:activeCamp.id,workspace_id:workspaceId})
          .select().single();
        if (error) throw error;
        setSteps(p=>({...p,[activeCamp.id]:[...(p[activeCamp.id]||[]),data].sort((a,b)=>a.step_number-b.step_number)}));
        toast("Paso agregado","ok");
      } else {
        await supabase.from("campaign_steps")
          .update({subject:editStep.subject,body:editStep.body,delay_days:editStep.delay_days,step_number:editStep.step_number,channel:editStep.channel})
          .eq("id",editStep.id);
        setSteps(p=>({...p,[activeCamp.id]:p[activeCamp.id].map(s=>s.id===editStep.id?editStep:s)}));
        toast("Paso guardado","ok");
      }
    } catch(e:any) { toast("Error: "+e.message,"error"); }
    setEditStep(null);
  }

  // ── Eliminar paso ──────────────────────────────────────────────────────────
  async function deleteStep(id:string) {
    if (!activeCamp) return;
    await supabase.from("campaign_steps").delete().eq("id",id);
    setSteps(p=>({...p,[activeCamp.id]:p[activeCamp.id].filter(s=>s.id!==id)}));
  }

  // ── Agregar leads (snapshot) ───────────────────────────────────────────────
  async function addLeads() {
    if (!activeCamp || selectedLeads.length===0) return;
    const existing = (campLeads[activeCamp.id]||[]).map(l=>l.lead_id);
    const rows = crmLeads
      .filter(l=>selectedLeads.includes(l.id) && !existing.includes(l.id))
      .map(l=>({
        campaign_id:activeCamp.id, workspace_id:workspaceId, lead_id:l.id,
        lead_name:l.name, lead_email:l.email||"", lead_phone:l.phone||"",
        lead_company:l.company||"", lead_niche:l.source||"",
        lead_audience:l.score?l.score*1000:0, status:"pending", current_step:0,
      }));
    if (!rows.length) { toast("Todos ya están en la campaña","warn"); return; }
    const {data,error} = await supabase.from("campaign_leads").insert(rows).select();
    if (error) { toast("Error: "+error.message,"error"); return; }
    setCampLeads(p=>({...p,[activeCamp.id]:[...(p[activeCamp.id]||[]),...(data||[])]}));
    setShowLeadPick(false); setSelectedLeads([]);
    toast(`✅ ${rows.length} leads agregados`,"ok");
  }

  // ── Cambiar estado de lead (pausa/baja/mover) ──────────────────────────────
  async function updateLeadStatus(leadId:string, newStatus: CampaignLead["status"]) {
    await supabase.from("campaign_leads").update({status:newStatus}).eq("id",leadId);
    setCampLeads(p=>{
      const updated: Record<string,CampaignLead[]> = {};
      Object.keys(p).forEach(cid=>{ updated[cid]=p[cid].map(l=>l.id===leadId?{...l,status:newStatus}:l); });
      return updated;
    });
    toast(`Lead ${newStatus==="unsubscribed"?"dado de baja":newStatus==="paused"?"pausado":"actualizado"}`,"ok");
  }

  // ── Mover lead a otra campaña ──────────────────────────────────────────────
  async function moveLeadToCampaign(campLeadId:string, toCampId:string) {
    const cl = Object.values(campLeads).flat().find(l=>l.id===campLeadId);
    if (!cl) return;
    // 1. Dar de baja de campaña actual
    await supabase.from("campaign_leads").update({status:"completed"}).eq("id",campLeadId);
    // 2. Agregar a la nueva campaña (snapshot)
    const {data} = await supabase.from("campaign_leads").insert({
      campaign_id:toCampId, workspace_id:workspaceId, lead_id:cl.lead_id,
      lead_name:cl.lead_name, lead_email:cl.lead_email, lead_phone:cl.lead_phone,
      lead_company:cl.lead_company, lead_niche:cl.lead_niche, lead_audience:cl.lead_audience,
      status:"pending", current_step:0,
    }).select().single();
    if (data) {
      setCampLeads(p=>({
        ...p,
        [cl.campaign_id]: p[cl.campaign_id].map(l=>l.id===campLeadId?{...l,status:"completed"}:l),
        [toCampId]: [...(p[toCampId]||[]),data],
      }));
    }
    setShowMoveModal(null);
    toast("Lead movido a la nueva campaña","ok");
  }

  // ── Enviar paso a todos los leads activos ──────────────────────────────────
  async function sendStep(step:CampaignStep) {
    if (!activeCamp) return;
    const targets = (campLeads[activeCamp.id]||[]).filter(
      l => l.status!=="unsubscribed" && l.status!=="bounced" && l.status!=="completed"
    );
    if (!targets.length) { toast("Sin leads activos","error"); return; }

    // Validar credenciales según canal
    if (step.channel==="email" && emailProvider==="none") { toast("Configurá Resend o Gmail en API Keys","error"); return; }
    if (step.channel==="whatsapp" && (!waToken||!waPhoneId))  { toast("Configurá WhatsApp Cloud API en API Keys","error"); return; }
    if (step.channel==="sms" && (!twilioSid||!twilioToken))   { toast("Configurá Twilio en API Keys","error"); return; }

    setSending(step.id);
    let ok=0; let fail=0;

    for (const cl of targets) {
      try {
        let providerId = "";

        if (step.channel==="email") {
          if (!cl.lead_email) { fail++; continue; }
          const subject = renderVars(step.subject, cl);
          const text    = renderVars(step.body, cl);
          const html    = buildHtml(step.body, cl, fromName, fromEmail);
          if (emailProvider==="resend" && resendKey) {
            providerId = await sendViaResend(resendKey, cl.lead_email, subject, html, text, fromName, fromEmail);
          } else if (emailProvider==="gmail") {
            providerId = await sendViaGmail(
              (import.meta as any).env?.VITE_SUPABASE_URL||"",
              (import.meta as any).env?.VITE_SUPABASE_ANON_KEY||"",
              cl.lead_email, subject, html, text, fromName, fromEmail
            );
          }
        }

        if (step.channel==="whatsapp") {
          if (!cl.lead_phone) { fail++; continue; }
          const body = renderVars(step.body, cl);
          providerId = await sendViaWhatsApp(waToken!, waPhoneId!, cl.lead_phone, body);
        }

        if (step.channel==="sms") {
          if (!cl.lead_phone) { fail++; continue; }
          const body = renderVars(step.body, cl);
          providerId = await sendViaTwilio(twilioSid!, twilioToken!, cl.lead_phone, body, twilioFrom||"");
        }

        ok++;
        // Registrar en historial
        supabase.from("campaign_messages").insert({
          campaign_id:activeCamp.id, campaign_lead_id:cl.id,
          step_id:step.id, workspace_id:workspaceId,
          channel:step.channel, to_address:step.channel==="email"?cl.lead_email:cl.lead_phone,
          subject:step.subject, body_preview:step.body.substring(0,200),
          status:"sent", provider_id:providerId,
        }).then(()=>{});
        // Actualizar estado del lead
        supabase.from("campaign_leads")
          .update({status:"in_progress",current_step:step.step_number})
          .eq("id",cl.id).then(()=>{});

        await new Promise(r=>setTimeout(r,200));
      } catch(e:any) {
        console.error("Send error:",e.message);
        fail++;
      }
    }

    await supabase.rpc("refresh_campaign_metrics",{p_campaign_id:activeCamp.id});
    await loadAll();
    setSending(null);
    if (fail===0) toast(`✅ ${ok} mensajes enviados — Paso ${step.step_number}`,"ok");
    else toast(`${ok} enviados · ${fail} fallaron`,"warn");
  }

  // ── UI helpers ─────────────────────────────────────────────────────────────
  const campSteps = activeCamp ? (steps[activeCamp.id]||[]) : [];
  const campLds   = activeCamp ? (campLeads[activeCamp.id]||[]) : [];
  const fmtPct = (n:number,d:number) => d===0?"0%":`${Math.round(n/d*100)}%`;

  // ─ Color canal
  const chColor = (ch:string) => CHANNEL_META[ch]?.color||"var(--txt2)";
  const chIcon  = (ch:string) => CHANNEL_META[ch]?.icon||"•";

  // ─ Canales disponibles
  const canSendEmail = emailProvider!=="none";
  const canSendWA    = !!(waToken && waPhoneId);
  const canSendSMS   = !!(twilioSid && twilioToken);

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="fade-up" style={{display:"flex",height:"100%",overflow:"hidden"}}>

      {/* ── Sidebar: lista campañas ── */}
      <div style={{width:240,flexShrink:0,borderRight:".5px solid var(--border)",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"20px 14px 12px",borderBottom:".5px solid var(--border)"}}>
          <p style={{fontSize:10,color:"var(--txt3)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>Outreach Hub</p>
          {/* Estado de proveedores */}
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:12}}>
            {[
              {label:"Email",  ok:canSendEmail, detail:emailProvider==="gmail"?"Gmail":emailProvider==="resend"?"Resend":"—"},
              {label:"WA",     ok:canSendWA,    detail:"Cloud API"},
              {label:"SMS",    ok:canSendSMS,   detail:"Twilio"},
            ].map(p=>(
              <span key={p.label} style={{
                fontSize:9,padding:"2px 7px",borderRadius:99,
                background:p.ok?"var(--em-m)":"var(--surface)",
                color:p.ok?"var(--emerald)":"var(--txt3)",
                border:`.5px solid ${p.ok?"rgba(16,185,129,.25)":"var(--border)"}`,
              }}>{p.ok?"✓":""} {p.label}</span>
            ))}
          </div>
          {isAdmin && (
            <button className="btn btn-primary" style={{width:"100%",fontSize:12}}
              onClick={()=>setNewCampModal(true)}>
              + Nueva campaña
            </button>
          )}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"8px 8px"}}>
          {loading ? <p style={{fontSize:12,color:"var(--txt3)",padding:"14px 8px"}}>Cargando...</p>
          : campaigns.length===0 ? <p style={{fontSize:12,color:"var(--txt3)",padding:"14px 8px"}}>Sin campañas</p>
          : campaigns.map(c=>{
            const meta = CHANNEL_META[c.channel]||CHANNEL_META.email;
            const active = activeCamp?.id===c.id;
            return (
              <div key={c.id}
                onClick={()=>{setActiveCamp(c);setActiveTab("steps");}}
                style={{
                  padding:"10px 11px",borderRadius:"var(--radius-sm)",cursor:"pointer",marginBottom:3,
                  background:active?"var(--gold-m)":"transparent",
                  border:`.5px solid ${active?"var(--gold-b)":"transparent"}`,
                  transition:"all .15s",
                }}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  <span style={{fontSize:12}}>{meta.icon}</span>
                  <p style={{fontSize:12,fontWeight:active?500:400,color:active?"var(--gold)":"var(--txt)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{c.name}</p>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:10,color:"var(--txt3)"}}>{(steps[c.id]||[]).length}p · {(campLeads[c.id]||[]).length}l</span>
                  <span style={{fontSize:9,padding:"1px 5px",borderRadius:99,background:c.status==="active"?"var(--em-m)":"var(--surface)",color:c.status==="active"?"var(--emerald)":"var(--txt3)"}}>{c.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Config envío */}
        <div style={{padding:"10px 12px",borderTop:".5px solid var(--border)"}}>
          <button className="btn btn-ghost" style={{width:"100%",fontSize:11,padding:"6px"}}
            onClick={()=>setShowConfig(true)}>
            ⚙ Remitente
          </button>
        </div>
      </div>

      {/* ── Panel principal ── */}
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {!activeCamp ? (
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10,color:"var(--txt3)"}}>
            <p style={{fontSize:28}}>⚡</p>
            <p style={{fontSize:13}}>Seleccioná una campaña</p>
            {!canSendEmail && !canSendWA && !canSendSMS && (
              <p style={{fontSize:11,color:"var(--red)",marginTop:8,textAlign:"center",maxWidth:280}}>
                ⚠ Sin proveedores conectados. Configurá Resend, Gmail, WhatsApp o Twilio en API Keys.
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{padding:"18px 24px 0",borderBottom:".5px solid var(--border)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <span style={{fontSize:16}}>{chIcon(activeCamp.channel)}</span>
                    <h2 className="display" style={{fontSize:20,fontWeight:300,letterSpacing:"-.01em"}}>{activeCamp.name}</h2>
                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:"var(--surface)",color:chColor(activeCamp.channel),border:`.5px solid ${chColor(activeCamp.channel)}40`}}>
                      {CHANNEL_META[activeCamp.channel]?.label}
                    </span>
                  </div>
                  <p style={{fontSize:11,color:"var(--txt3)"}}>{campSteps.length} pasos · {campLds.filter(l=>l.status!=="unsubscribed"&&l.status!=="completed").length} activos · {campLds.filter(l=>l.status==="unsubscribed").length} bajas</p>
                </div>
                {isAdmin && (
                  <div style={{display:"flex",gap:6}}>
                    <button className="btn btn-ghost" style={{fontSize:11,padding:"5px 11px"}}
                      onClick={()=>{setShowLeadPick(true);setSelectedLeads([]);}}>+ Leads</button>
                    <button className="btn btn-ghost" style={{fontSize:11,padding:"5px 11px"}}
                      onClick={()=>{setIsNewStep(true);setEditStep({id:"",campaign_id:activeCamp.id,workspace_id:workspaceId,step_number:campSteps.length+1,delay_days:campSteps.length===0?0:3,channel:activeCamp.channel==="multi"?"email":activeCamp.channel as any,subject:"",body:"",ai_generated:false,status:"active"});}}>+ Paso</button>
                  </div>
                )}
              </div>
              <div className="tab-bar" style={{width:260}}>
                {(["steps","leads","stats"] as const).map(t=>(
                  <button key={t} className={`tab-btn ${activeTab===t?"active":""}`} onClick={()=>setActiveTab(t)}>
                    {t==="steps"?"Secuencia":t==="leads"?"Leads":"Stats"}
                  </button>
                ))}
              </div>
            </div>

            <div style={{flex:1,overflowY:"auto",padding:"18px 24px"}}>

              {/* ── SECUENCIA ── */}
              {activeTab==="steps" && (
                campSteps.length===0 ? (
                  <div style={{textAlign:"center",padding:"36px 0",color:"var(--txt3)"}}>
                    <p style={{marginBottom:14,fontSize:13}}>Sin pasos. Generá con IA o agregá manualmente.</p>
                    {isAdmin && (
                      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                        {anthropicKey && <button className="btn btn-primary" style={{fontSize:12}} onClick={()=>setNewCampModal(true)}>✨ Generar con IA</button>}
                        <button className="btn btn-ghost" style={{fontSize:12}}
                          onClick={()=>{setIsNewStep(true);setEditStep({id:"",campaign_id:activeCamp.id,workspace_id:workspaceId,step_number:1,delay_days:0,channel:"email",subject:"",body:"",ai_generated:false,status:"active"});}}>
                          + Paso manual
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{display:"flex",flexDirection:"column",gap:0}}>
                    {campSteps.map((step,idx)=>{
                      const canSend = (step.channel==="email"&&canSendEmail)||(step.channel==="whatsapp"&&canSendWA)||(step.channel==="sms"&&canSendSMS);
                      const activeCount = campLds.filter(l=>l.status!=="unsubscribed"&&l.status!=="bounced"&&l.status!=="completed").length;
                      return (
                        <div key={step.id} style={{display:"flex",gap:0,marginBottom:0}}>
                          <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:36,flexShrink:0}}>
                            <div style={{width:26,height:26,borderRadius:"50%",background:"var(--gold-m)",border:".5px solid var(--gold-b)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:500,color:"var(--gold)"}}>
                              {step.step_number}
                            </div>
                            {idx<campSteps.length-1&&<div style={{width:1,flex:1,minHeight:20,background:"var(--border)",margin:"4px 0"}}/>}
                          </div>
                          <div className="glass" style={{flex:1,padding:"12px 16px",marginLeft:10,marginBottom:idx<campSteps.length-1?10:0}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5,flexWrap:"wrap"}}>
                                  <span style={{fontSize:13}}>{chIcon(step.channel)}</span>
                                  <span style={{fontSize:10,color:"var(--txt3)"}}>{step.delay_days===0?"Inmediato":`+${step.delay_days}d`}</span>
                                  {step.ai_generated && <span className="pill pill-gold" style={{fontSize:9}}>✨ IA</span>}
                                  {!canSend && <span style={{fontSize:9,color:"var(--red)"}}>Sin credencial</span>}
                                </div>
                                {step.subject && <p style={{fontWeight:500,fontSize:12,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{step.subject}</p>}
                                <p style={{fontSize:11,color:"var(--txt2)",lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{step.body?.substring(0,100)}...</p>
                              </div>
                              {isAdmin && (
                                <div style={{display:"flex",gap:5,flexShrink:0}}>
                                  <button className="btn btn-ghost" style={{fontSize:10,padding:"3px 8px"}}
                                    onClick={()=>{setIsNewStep(false);setEditStep(step);}}>Editar</button>
                                  <button className="btn btn-emerald"
                                    style={{fontSize:10,padding:"3px 10px",opacity:sending===step.id?0.6:1}}
                                    disabled={sending===step.id||!canSend||activeCount===0}
                                    onClick={()=>sendStep(step)}>
                                    {sending===step.id?"⟳":"▶"} {activeCount}
                                  </button>
                                  <button className="btn btn-danger" style={{fontSize:10,padding:"3px 7px"}}
                                    onClick={()=>deleteStep(step.id)}>✕</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {isAdmin && (
                      <button className="btn btn-ghost" style={{fontSize:11,marginTop:10,alignSelf:"flex-start"}}
                        onClick={()=>{setIsNewStep(true);setEditStep({id:"",campaign_id:activeCamp.id,workspace_id:workspaceId,step_number:campSteps.length+1,delay_days:3,channel:activeCamp.channel==="multi"?"email":activeCamp.channel as any,subject:"",body:"",ai_generated:false,status:"active"});}}>
                        + Agregar paso
                      </button>
                    )}
                  </div>
                )
              )}

              {/* ── LEADS ── */}
              {activeTab==="leads" && (
                campLds.length===0 ? (
                  <div style={{textAlign:"center",padding:"36px 0",color:"var(--txt3)"}}>
                    <p style={{marginBottom:12,fontSize:13}}>Sin leads en esta campaña.</p>
                    {isAdmin && <button className="btn btn-primary" style={{fontSize:12}} onClick={()=>{setShowLeadPick(true);setSelectedLeads([]);}}>+ Asignar leads</button>}
                  </div>
                ) : (
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {campLds.map(cl=>{
                      const stCol = {pending:"var(--txt3)",in_progress:"var(--blue)",completed:"var(--emerald)",unsubscribed:"var(--red)",bounced:"var(--red)",paused:"var(--gold)"}[cl.status]||"var(--txt3)";
                      const isActive = cl.status!=="unsubscribed"&&cl.status!=="completed"&&cl.status!=="bounced";
                      return (
                        <div key={cl.id} className="glass" style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:12,opacity:isActive?1:0.6}}>
                          <div style={{flex:1,minWidth:0}}>
                            <p style={{fontWeight:500,fontSize:12}}>{cl.lead_name}</p>
                            <p style={{fontSize:11,color:"var(--txt2)"}}>{cl.lead_email||cl.lead_phone} {cl.lead_niche&&`· ${cl.lead_niche}`}</p>
                          </div>
                          <div style={{textAlign:"right",flexShrink:0}}>
                            <p style={{fontSize:10,color:stCol,fontWeight:500}}>{cl.status}</p>
                            <p style={{fontSize:10,color:"var(--txt3)"}}>paso {cl.current_step}</p>
                          </div>
                          {isAdmin && isActive && (
                            <div style={{display:"flex",gap:4,flexShrink:0}}>
                              {/* Mover a otra campaña */}
                              <button className="btn btn-ghost" style={{fontSize:10,padding:"3px 8px"}}
                                title="Mover a otra campaña"
                                onClick={()=>setShowMoveModal(cl)}>↗</button>
                              {/* Pausar */}
                              <button className="btn btn-ghost" style={{fontSize:10,padding:"3px 8px"}}
                                onClick={()=>updateLeadStatus(cl.id, cl.status==="paused"?"pending":"paused")}>
                                {cl.status==="paused"?"▶":"⏸"}
                              </button>
                              {/* Dar de baja */}
                              <button className="btn btn-danger" style={{fontSize:10,padding:"3px 7px"}}
                                title="Dar de baja"
                                onClick={()=>updateLeadStatus(cl.id,"unsubscribed")}>✕</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {/* ── STATS ── */}
              {activeTab==="stats" && (
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
                  {[
                    {l:"Leads totales",   v:campLds.length,                                              c:"var(--gold)"},
                    {l:"Activos",         v:campLds.filter(l=>l.status==="in_progress"||l.status==="pending").length, c:"var(--blue)"},
                    {l:"Enviados",        v:activeCamp.sent_count,                                       c:"var(--txt)"},
                    {l:"Abiertos",        v:`${activeCamp.open_count} (${fmtPct(activeCamp.open_count,activeCamp.sent_count)})`, c:"var(--blue)"},
                    {l:"Respondieron",    v:`${activeCamp.reply_count} (${fmtPct(activeCamp.reply_count,activeCamp.sent_count)})`, c:"var(--emerald)"},
                    {l:"Completados",     v:campLds.filter(l=>l.status==="completed").length,            c:"var(--emerald)"},
                    {l:"Pausados",        v:campLds.filter(l=>l.status==="paused").length,               c:"var(--gold)"},
                    {l:"Bajas / Rebotes", v:campLds.filter(l=>l.status==="unsubscribed"||l.status==="bounced").length, c:"var(--red)"},
                  ].map(item=>(
                    <div key={item.l} className="glass" style={{padding:"14px 16px"}}>
                      <p style={{fontSize:10,color:"var(--txt3)",textTransform:"uppercase",letterSpacing:".04em",marginBottom:6}}>{item.l}</p>
                      <p className="mono" style={{fontSize:20,fontWeight:300,color:item.c}}>{item.v}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ════ MODALES ════ */}

      {/* Nueva campaña */}
      <Modal open={newCampModal} onClose={()=>setNewCampModal(false)} title="Nueva campaña" width={480}>
        <Field label="Nombre">
          <input className="inp" value={nc.name} onChange={e=>setNc(p=>({...p,name:e.target.value}))} placeholder="Outreach Influencers LATAM Q3"/>
        </Field>
        <Field label="Canal principal">
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {(["email","whatsapp","sms","multi"] as const).map(ch=>{
              const meta = CHANNEL_META[ch];
              const avail = ch==="email"?canSendEmail:ch==="whatsapp"?canSendWA:ch==="sms"?canSendSMS:true;
              return (
                <button key={ch}
                  className={`btn ${nc.channel===ch?"btn-primary":"btn-ghost"}`}
                  style={{fontSize:12,padding:"6px 14px",opacity:avail?1:0.45}}
                  onClick={()=>setNc(p=>({...p,channel:ch}))}>
                  {meta.icon} {meta.label} {!avail&&"(sin key)"}
                </button>
              );
            })}
          </div>
        </Field>
        <Field label="Nicho (para IA)">
          <input className="inp" value={nc.nicho} onChange={e=>setNc(p=>({...p,nicho:e.target.value}))} placeholder="finanzas, fitness, emprendimiento..."/>
        </Field>
        {anthropicKey && (
          <Field label={`Pasos de secuencia: ${nc.steps}`}>
            <input type="range" min={1} max={6} value={nc.steps} onChange={e=>setNc(p=>({...p,steps:Number(e.target.value)}))} style={{width:"100%"}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--txt3)",marginTop:3}}>
              {[1,2,3,4,5,6].map(n=><span key={n} style={{color:n===nc.steps?"var(--gold)":"inherit",fontWeight:n===nc.steps?600:400}}>{n}</span>)}
            </div>
          </Field>
        )}
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16,flexWrap:"wrap"}}>
          <button className="btn btn-ghost" onClick={()=>setNewCampModal(false)}>Cancelar</button>
          <button className="btn btn-ghost" disabled={!nc.name||generatingAI} onClick={()=>createCampaign(false)}>Crear vacía</button>
          {anthropicKey && <button className="btn btn-primary" disabled={!nc.name||!nc.nicho||generatingAI} onClick={()=>createCampaign(true)}>
            {generatingAI?"✨ Generando...":"✨ Crear con IA"}
          </button>}
        </div>
        {!anthropicKey && <p style={{fontSize:11,color:"var(--txt3)",marginTop:8,textAlign:"center"}}>Configurá Anthropic API Key para generación con IA.</p>}
      </Modal>

      {/* Editar paso */}
      <Modal open={!!editStep} onClose={()=>setEditStep(null)} title={isNewStep?"Agregar paso":"Editar paso"} width={580}>
        {editStep&&(<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <Field label="Paso #">
              <input className="inp" type="number" min={1} value={editStep.step_number}
                onChange={e=>setEditStep(p=>p?{...p,step_number:Number(e.target.value)}:p)}/>
            </Field>
            <Field label="Días de espera">
              <input className="inp" type="number" min={0} value={editStep.delay_days}
                onChange={e=>setEditStep(p=>p?{...p,delay_days:Number(e.target.value)}:p)} placeholder="0"/>
            </Field>
            <Field label="Canal">
              <select className="inp" value={editStep.channel} onChange={e=>setEditStep(p=>p?{...p,channel:e.target.value as any}:p)}>
                <option value="email">✉ Email</option>
                <option value="whatsapp">💬 WhatsApp</option>
                <option value="sms">📱 SMS</option>
              </select>
            </Field>
          </div>
          {editStep.channel==="email" && (
            <Field label="Asunto">
              <input className="inp" value={editStep.subject}
                onChange={e=>setEditStep(p=>p?{...p,subject:e.target.value}:p)}
                placeholder="Re: [Nombre], ¿y si centralizamos tu comunidad de [nicho]?"/>
            </Field>
          )}
          <Field label={editStep.channel==="email"?"Cuerpo (HTML se genera automático)":editStep.channel==="whatsapp"?"Mensaje WhatsApp (máx 1024 chars)":"SMS (máx 160 chars)"}>
            <textarea className="inp" style={{minHeight:editStep.channel==="email"?150:80,resize:"vertical",lineHeight:1.7}}
              value={editStep.body}
              onChange={e=>setEditStep(p=>p?{...p,body:e.target.value}:p)}
              placeholder={editStep.channel==="email"?"[Nombre],\n\nVi lo que estás construyendo con tu audiencia de [nicho]...":editStep.channel==="whatsapp"?"Hola [Nombre] 👋 Vi que tenés [audiencia] seguidores en [nicho]...":"[Nombre], tu comunidad puede generar [proyeccion]/mes. ¿Hablamos?"}/>
          </Field>
          <p style={{fontSize:10,color:"var(--txt3)",marginBottom:10}}>
            Variables: {["[Nombre]","[Empresa]","[nicho]","[audiencia]","[proyeccion]"].map(v=><code key={v} style={{color:"var(--gold)",marginRight:5}}>{v}</code>)}
          </p>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="btn btn-ghost" onClick={()=>setEditStep(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={saveStep}>Guardar</button>
          </div>
        </>)}
      </Modal>

      {/* Lead picker */}
      <Modal open={showLeadPick} onClose={()=>setShowLeadPick(false)} title="Asignar leads a la campaña" width={560}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <p style={{fontSize:12,color:"var(--txt2)"}}>{crmLeads.filter(l=>l.email||l.phone).length} leads disponibles</p>
          <div style={{display:"flex",gap:6}}>
            <button className="btn btn-ghost" style={{fontSize:10,padding:"3px 9px"}} onClick={()=>setSelectedLeads(crmLeads.filter(l=>l.email||l.phone).map(l=>l.id))}>Todos</button>
            <button className="btn btn-ghost" style={{fontSize:10,padding:"3px 9px"}} onClick={()=>setSelectedLeads([])}>Limpiar</button>
          </div>
        </div>
        <div style={{maxHeight:260,overflowY:"auto",display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
          {crmLeads.filter(l=>l.email||l.phone).map(lead=>{
            const sel = selectedLeads.includes(lead.id);
            const already = (campLeads[activeCamp?.id||""]||[]).some(cl=>cl.lead_id===lead.id && cl.status!=="completed");
            return (
              <div key={lead.id}
                onClick={()=>!already&&setSelectedLeads(p=>sel?p.filter(x=>x!==lead.id):[...p,lead.id])}
                style={{display:"flex",alignItems:"center",gap:10,padding:"8px 11px",borderRadius:"var(--radius-sm)",cursor:already?"default":"pointer",opacity:already?0.45:1,background:sel?"var(--gold-m)":"var(--surface)",border:`.5px solid ${sel?"var(--gold-b)":"var(--border)"}`}}>
                <div style={{width:14,height:14,borderRadius:3,flexShrink:0,background:sel?"var(--gold)":already?"var(--emerald)":"transparent",border:`.5px solid ${sel?"var(--gold)":already?"var(--emerald)":"var(--border-h)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#0a0800"}}>
                  {(sel||already)?"✓":""}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lead.name}</p>
                  <p style={{fontSize:10,color:"var(--txt2)"}}>{lead.email||lead.phone}</p>
                </div>
                {already&&<span style={{fontSize:9,color:"var(--emerald)"}}>ya asignado</span>}
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:".5px solid var(--border)"}}>
          <p style={{fontSize:12,color:"var(--txt2)"}}><strong style={{color:"var(--gold)"}}>{selectedLeads.length}</strong> seleccionados</p>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-ghost" onClick={()=>setShowLeadPick(false)}>Cancelar</button>
            <button className="btn btn-primary" disabled={selectedLeads.length===0} onClick={addLeads}>Asignar</button>
          </div>
        </div>
      </Modal>

      {/* Mover lead a otra campaña */}
      <Modal open={!!showMoveModal} onClose={()=>setShowMoveModal(null)} title="Mover lead a otra campaña" width={400}>
        {showMoveModal&&(
          <>
            <p style={{fontSize:13,color:"var(--txt2)",marginBottom:14}}>
              Moviendo <strong style={{color:"var(--txt)"}}>{showMoveModal.lead_name}</strong> — se marcará como completado en esta campaña.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {campaigns.filter(c=>c.id!==activeCamp?.id).map(c=>(
                <button key={c.id} className="btn btn-ghost"
                  style={{justifyContent:"flex-start",gap:8,fontSize:12,padding:"10px 14px"}}
                  onClick={()=>moveLeadToCampaign(showMoveModal.id,c.id)}>
                  <span>{chIcon(c.channel)}</span>
                  <span>{c.name}</span>
                  <span style={{marginLeft:"auto",fontSize:10,color:"var(--txt3)"}}>{(campLeads[c.id]||[]).length} leads</span>
                </button>
              ))}
              {campaigns.filter(c=>c.id!==activeCamp?.id).length===0&&(
                <p style={{fontSize:12,color:"var(--txt3)",textAlign:"center",padding:"16px 0"}}>No hay otras campañas disponibles.</p>
              )}
            </div>
          </>
        )}
      </Modal>

      {/* Config remitente */}
      <Modal open={showConfig} onClose={()=>setShowConfig(false)} title="Configuración de remitente" width={440}>
        <p style={{fontSize:12,color:"var(--txt2)",marginBottom:14}}>
          Nombre y email que aparecen en los emails enviados. Las credenciales van en API Keys.
        </p>
        <Field label="Nombre del remitente">
          <input className="inp" value={fromName} onChange={e=>setFromName(e.target.value)} placeholder="Justin Jimenez"/>
        </Field>
        <Field label="Email del remitente">
          <input className="inp" type="email" value={fromEmail} onChange={e=>setFromEmail(e.target.value)} placeholder="justin@comuniofficial.com"/>
        </Field>
        <div style={{marginTop:14,padding:12,background:"var(--surface)",borderRadius:"var(--radius-sm)",border:".5px solid var(--border)"}}>
          <p style={{fontSize:11,color:"var(--txt2)",marginBottom:8,fontWeight:500}}>Proveedores de email conectados:</p>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:10,width:60,color:"var(--txt3)"}}>Resend</span>
              <span style={{fontSize:11,color:resendKey?"var(--emerald)":"var(--red)"}}>{resendKey?"✓ Conectado — envío via API":"✗ Sin key"}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:10,width:60,color:"var(--txt3)"}}>Gmail</span>
              <span style={{fontSize:11,color:getKey(workspaceId,"gmail_user")?"var(--emerald)":"var(--red)"}}>
                {getKey(workspaceId,"gmail_user")?"✓ Conectado — via Supabase Edge Fn":"✗ Sin key (configurá gmail_user + gmail_pass)"}
              </span>
            </div>
          </div>
          <p style={{fontSize:10,color:"var(--txt3)",marginTop:10}}>
            Para Gmail: agregá <code style={{color:"var(--gold)"}}>gmail_user</code> y <code style={{color:"var(--gold)"}}>gmail_pass</code> en Configuración → API Keys. El envío corre en Supabase Edge Functions (las credenciales NUNCA llegan al browser).
          </p>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:14}}>
          <button className="btn btn-primary" onClick={()=>{setShowConfig(false);toast("Remitente guardado","ok");}}>Guardar</button>
        </div>
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


// ── COMPONENTE API SETTINGS COMPLETO ─────────────────────────────────────────
function ApiSettings({workspaceId}:{workspaceId:string}) {
  const [keys,      setKeys]      = useState<Record<string,string>>({});
  const [visible,   setVisible]   = useState<Record<string,boolean>>({});
  const [saving,    setSaving]    = useState<string|null>(null);
  const [activeCat, setActiveCat] = useState("email");
  const [expanded,  setExpanded]  = useState<string|null>(null);
  const toast = useToast();

  useEffect(()=>{
    const saved = localStorage.getItem(`closer_apikeys_${workspaceId}`);
    if (saved) setKeys(JSON.parse(saved));
  },[workspaceId]);

  function saveKey(service:string) {
    setSaving(service);
    setTimeout(()=>{
      localStorage.setItem(`closer_apikeys_${workspaceId}`,JSON.stringify(keys));
      setSaving(null);
      toast(`${service} guardado ✓`,"ok");
    },300);
  }

  function deleteKey(service:string) {
    const updated = {...keys};
    delete updated[service];
    setKeys(updated);
    localStorage.setItem(`closer_apikeys_${workspaceId}`,JSON.stringify(updated));
    toast(`${service} eliminado`,"ok");
  }

  const services   = API_SERVICES.filter(s=>s.category===activeCat);
  const configured = API_SERVICES.filter(s=>keys[s.key]).length;

  // Status global por canal de outreach
  const channelStatus = {
    email:    !!(keys["resend"] || (keys["gmail_user"] && keys["gmail_pass"])),
    whatsapp: !!(keys["whatsapp_token"] && keys["whatsapp_phone_id"]),
    sms:      !!(keys["twilio_sid"] && keys["twilio_token"] && keys["twilio_from"]),
    linkedin: !!(keys["phantombuster"]),
    ia:       !!(keys["anthropic"] || keys["openai"] || keys["groq"]),
  };

  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>

      {/* Header */}
      <div style={{marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}>
        <div>
          <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>API Keys</h1>
          <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Solo visible para administradores · Guardadas localmente en tu navegador</p>
        </div>
        <span className="pill pill-gold" style={{fontSize:12}}>{configured} / {API_SERVICES.length} configuradas</span>
      </div>

      {/* Status de canales de outreach */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:28}} className="daily-stats">
        {[
          {ch:"Email",    ok:channelStatus.email,    cat:"email",    icon:"✉",  detail:keys["resend"]?"Resend":keys["gmail_user"]?"Gmail":"—"},
          {ch:"WhatsApp", ok:channelStatus.whatsapp, cat:"whatsapp", icon:"💬", detail:channelStatus.whatsapp?"Cloud API":"sin key"},
          {ch:"SMS",      ok:channelStatus.sms,      cat:"sms",      icon:"📱", detail:channelStatus.sms?"Twilio":"sin key"},
          {ch:"LinkedIn", ok:channelStatus.linkedin, cat:"linkedin", icon:"🔵", detail:channelStatus.linkedin?"Phantombuster":"manual"},
          {ch:"IA",       ok:channelStatus.ia,       cat:"ia",       icon:"✦",  detail:keys["anthropic"]?"Claude":keys["openai"]?"GPT":keys["groq"]?"Groq":"sin key"},
        ].map(item=>(
          <div key={item.ch}
            onClick={()=>setActiveCat(item.cat)}
            className="glass"
            style={{
              padding:"12px 14px",cursor:"pointer",
              borderColor:item.ok?"rgba(16,185,129,.3)":activeCat===item.cat?"var(--gold-b)":"var(--border)",
              background:activeCat===item.cat?"var(--gold-m)":"var(--surface)",
            }}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
              <span style={{fontSize:16}}>{item.icon}</span>
              <span style={{
                fontSize:9,padding:"1px 6px",borderRadius:99,
                background:item.ok?"var(--em-m)":"var(--surface)",
                color:item.ok?"var(--emerald)":"var(--txt3)",
                border:`.5px solid ${item.ok?"rgba(16,185,129,.3)":"var(--border)"}`,
              }}>{item.ok?"✓ listo":"pendiente"}</span>
            </div>
            <p style={{fontSize:12,fontWeight:500,color:activeCat===item.cat?"var(--gold)":"var(--txt)"}}>{item.ch}</p>
            <p style={{fontSize:10,color:"var(--txt3)",marginTop:2}}>{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Tabs de categorías */}
      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
        {API_CATEGORIES.map(c=>{
          const total = API_SERVICES.filter(s=>s.category===c.id).length;
          const done  = API_SERVICES.filter(s=>s.category===c.id&&keys[s.key]).length;
          const active = activeCat===c.id;
          return (
            <button key={c.id} onClick={()=>setActiveCat(c.id)} style={{
              padding:"7px 14px",borderRadius:8,cursor:"pointer",
              border:`.5px solid ${active?"var(--gold-b)":"var(--border)"}`,
              background:active?"var(--gold-m)":"transparent",
              color:active?"var(--gold)":"var(--txt2)",
              fontSize:12,fontWeight:active?500:400,
              fontFamily:"'DM Sans',sans-serif",
              display:"flex",alignItems:"center",gap:6,
            }}>
              <span>{c.icon}</span>
              <span>{c.label}</span>
              <span style={{
                fontSize:9,padding:"1px 5px",borderRadius:99,
                background:done===total&&total>0?"var(--em-m)":"var(--surface)",
                color:done===total&&total>0?"var(--emerald)":"var(--txt3)",
              }}>{done}/{total}</span>
            </button>
          );
        })}
      </div>

      {/* Descripción de la categoría activa */}
      {(() => {
        const cat = API_CATEGORIES.find(c=>c.id===activeCat);
        return cat ? (
          <div style={{marginBottom:16,padding:"10px 14px",background:"var(--surface)",borderRadius:"var(--radius-sm)",border:".5px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:18}}>{cat.icon}</span>
            <div>
              <p style={{fontSize:12,fontWeight:500,color:"var(--txt)"}}>{cat.label}</p>
              <p style={{fontSize:11,color:"var(--txt2)"}}>{cat.desc}</p>
            </div>
          </div>
        ) : null;
      })()}

      {/* Cards de servicios */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:14,maxWidth:1100}} className="csv-fields">
        {services.map(svc=>{
          const hasKey  = !!keys[svc.key];
          const isExp   = expanded===svc.key;
          const howLines = svc.how.split("\n");
          const usedForList = svc.usedFor || [];
          return (
            <div key={svc.key}
              className={`glass ${hasKey?"glass-green":""}`}
              style={{padding:"16px 18px",transition:"all .2s"}}>

              {/* Header */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                    <p style={{fontWeight:500,fontSize:13}}>{svc.label}</p>
                    {hasKey && <span className="pill pill-green" style={{fontSize:9}}>✓ Activa</span>}
                    {(svc as any).badge && (
                      <span className="pill" style={{fontSize:9,
                        background:(svc as any).badge.includes("⚠")?"var(--red-m)":"var(--gold-m)",
                        color:(svc as any).badge.includes("⚠")?"var(--red)":"var(--gold)",
                        border:`.5px solid ${(svc as any).badge.includes("⚠")?"rgba(248,113,113,.2)":"var(--gold-b)"}`
                      }}>{(svc as any).badge}</span>
                    )}
                  </div>
                  <p style={{fontSize:11,color:"var(--txt2)",lineHeight:1.5}}>{svc.desc}</p>
                </div>
              </div>

              {/* Para qué sirve */}
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
                {usedForList.map((u:string,i:number)=>(
                  <span key={i} style={{fontSize:9,padding:"2px 7px",borderRadius:99,background:"var(--surface)",color:"var(--txt2)",border:".5px solid var(--border)"}}>
                    {u}
                  </span>
                ))}
              </div>

              {/* Input */}
              <div style={{display:"flex",gap:6,marginBottom:8}}>
                <div style={{flex:1,position:"relative"}}>
                  <input
                    className="inp"
                    type={visible[svc.key]?"text":"password"}
                    value={keys[svc.key]||""}
                    onChange={e=>setKeys(p=>({...p,[svc.key]:e.target.value}))}
                    placeholder={svc.placeholder}
                    style={{paddingRight:36,fontSize:12}}
                  />
                  <button
                    onClick={()=>setVisible(p=>({...p,[svc.key]:!p[svc.key]}))}
                    style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--txt3)",fontSize:12,padding:"2px 4px"}}>
                    {visible[svc.key]?"●":"○"}
                  </button>
                </div>
                <button
                  className="btn btn-primary"
                  style={{fontSize:11,padding:"0 14px",flexShrink:0,opacity:saving===svc.key?0.6:1}}
                  disabled={saving===svc.key||!keys[svc.key]}
                  onClick={()=>saveKey(svc.key)}>
                  {saving===svc.key?"...":"Guardar"}
                </button>
                {hasKey && (
                  <button className="btn btn-danger" style={{fontSize:11,padding:"0 10px",flexShrink:0}}
                    onClick={()=>deleteKey(svc.key)}>✕</button>
                )}
              </div>

              {/* Cómo obtenerla — expandible */}
              <div>
                <button
                  onClick={()=>setExpanded(isExp?null:svc.key)}
                  style={{background:"none",border:"none",cursor:"pointer",color:"var(--gold)",fontSize:11,padding:"0",display:"flex",alignItems:"center",gap:4,fontFamily:"'DM Sans',sans-serif"}}>
                  <span style={{fontSize:10,transition:"transform .2s",display:"inline-block",transform:isExp?"rotate(90deg)":"rotate(0)"}}>{isExp?"▼":"▶"}</span>
                  ¿Cómo obtenerla?
                  {(svc as any).docsUrl && <span style={{color:"var(--txt3)",fontSize:10}}>· docs</span>}
                </button>

                {isExp && (
                  <div style={{marginTop:10,padding:"10px 12px",background:"var(--bg2)",borderRadius:"var(--radius-sm)",border:".5px solid var(--border)"}}>
                    {howLines.map((line:string,i:number)=>(
                      <p key={i} style={{fontSize:11,color: line.startsWith("NOTA") || line.startsWith("NOTE") || line.startsWith("REQU") || line.startsWith("USO") || line.startsWith("ADVE") ? "var(--gold)" : line.match(/^\d\./) ? "var(--txt)" : "var(--txt2)",lineHeight:1.7,marginBottom:i<howLines.length-1?2:0}}>
                        {line}
                      </p>
                    ))}
                    {(svc as any).docsUrl && (
                      <a href={(svc as any).docsUrl} target="_blank" rel="noreferrer"
                        style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:8,fontSize:11,color:"var(--blue)",textDecoration:"none"}}>
                        Ir a la documentación oficial ↗
                      </a>
                    )}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Info de seguridad */}
      <div className="glass" style={{padding:"16px 20px",marginTop:24,maxWidth:760,border:".5px solid var(--gold-b)"}}>
        <p style={{fontSize:12,fontWeight:500,marginBottom:10}}>Seguridad de las API Keys</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {[
            {icon:"✓",text:"Guardadas en localStorage de tu navegador — nunca en servidores de CloserAI",c:"var(--emerald)"},
            {icon:"✓",text:"Nunca se suben a GitHub ni aparecen en el código fuente",c:"var(--emerald)"},
            {icon:"✓",text:"Solo los admins del workspace pueden verlas y editarlas",c:"var(--emerald)"},
            {icon:"✓",text:"Gmail y credenciales SMTP corren en Supabase Edge Functions (backend aislado)",c:"var(--emerald)"},
            {icon:"⚠",text:"Si borrás los datos del navegador, las keys se pierden — guardalas en un lugar seguro",c:"var(--gold)"},
            {icon:"⚠",text:"No compartas el acceso admin con personas de confianza limitada",c:"var(--gold)"},
          ].map((item,i)=>(
            <p key={i} style={{fontSize:11,color:"var(--txt2)",display:"flex",gap:6,lineHeight:1.5}}>
              <span style={{color:item.c,flexShrink:0}}>{item.icon}</span>
              {item.text}
            </p>
          ))}
        </div>
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
  platform: "linkedin"|"instagram"|"facebook"|"maps"|"multi";
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
  {id:"zoominfo",label:"ZoomInfo Scraper",icon:"\u{1F3AF}",platform:"multi",mode:"Empresas + ejecutivos + emails + tel",actor:"scraped/zoominfo-people-scraper",actorLabel:"scraped/zoominfo-people-scraper",desc:"Alternativa barata a Apollo y Lusha. Extrae emails verificados, telefonos, cargos y datos de empresa desde ZoomInfo. Hasta 500k leads/mes.",tip:"El mas completo para B2B con datos verificados. Combinar con LinkedIn search para maxima cobertura.",tier:"paid",gives:{phone:true,email:true,linkedin:true},fields:[{key:"keyword",label:"Keyword o empresa",type:"text",placeholder:"CEO fintech Argentina",required:true},{key:"industry",label:"Industria",type:"text",placeholder:"SaaS, Fintech, Edtech..."},{key:"limit",label:"Maximo contactos",type:"number",placeholder:"50"}]}
];

const PROSPECTOR_PLATFORMS = [
  {id:"all",label:"Todas",icon:"\u25C8",color:"#C9A84C"},
  {id:"linkedin",label:"LinkedIn",icon:"\u{1F535}",color:"#60a5fa"},
  {id:"instagram",label:"Instagram",icon:"\u{1F4F8}",color:"#f472b6"},
  {id:"facebook",label:"Facebook",icon:"\u{1F4D8}",color:"#818cf8"},
  {id:"maps",label:"Maps",icon:"\u{1F4CD}",color:"#10b981"},
  {id:"multi",label:"Multi",icon:"\u{1F310}",color:"#fb923c"}
];

const PROSPECTOR_PC: Record<string,{bg:string;color:string;border:string}> = {
  linkedin:  {bg:"rgba(96,165,250,0.08)",color:"#60a5fa",border:"rgba(96,165,250,0.2)"},
  instagram: {bg:"rgba(244,114,182,0.08)",color:"#f472b6",border:"rgba(244,114,182,0.2)"},
  facebook:  {bg:"rgba(129,140,248,0.08)",color:"#818cf8",border:"rgba(129,140,248,0.2)"},
  maps:      {bg:"rgba(16,185,129,0.08)",color:"#10b981",border:"rgba(16,185,129,0.2)"},
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
  provider: "anthropic"|"openai";
  model: string;
  features: {
    redaccion: boolean;
    inbox: boolean;
    qualify: boolean;
    signals: boolean;
  };
}

// Pricing per 1M tokens (USD) - actualizado mayo 2026
const AI_PRICING: Record<string,{in:number;out:number;label:string}> = {
  "claude-opus-4-7":     {in:5,    out:25,   label:"Claude Opus 4.7 (max calidad)"},
  "claude-sonnet-4-6":   {in:3,    out:15,   label:"Claude Sonnet 4.6 (recomendado)"},
  "claude-haiku-4-5":    {in:1,    out:5,    label:"Claude Haiku 4.5 (mas barato)"},
};

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
    model:"claude-sonnet-4-6",
    features:{redaccion:true,inbox:true,qualify:true,signals:true}
  });

  useEffect(()=>{
    const apiKeys = localStorage.getItem(`closer_apikeys_${workspaceId}`);
    const aiConf = localStorage.getItem(`closer_ai_config_${workspaceId}`);
    if(apiKeys && aiConf) {
      const keys = JSON.parse(apiKeys);
      const conf = JSON.parse(aiConf);
      setConfig({...conf,enabled:!!keys.anthropic||!!keys.openai});
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
async function callClaude(
  workspaceId:string,
  feature:string,
  systemPrompt:string,
  userPrompt:string,
  model:string="claude-sonnet-4-6"
): Promise<{success:boolean;text?:string;error?:string;cost?:number}> {
  const key = getApiKey(workspaceId, "anthropic");
  if(!key) return {success:false, error:"No hay API key de Anthropic configurada"};

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "x-api-key":key,
        "anthropic-version":"2023-06-01",
        "anthropic-dangerous-direct-browser-access":"true"
      },
      body:JSON.stringify({
        model: model==="claude-sonnet-4-6"?"claude-sonnet-4-5-20250929":
               model==="claude-opus-4-7"?"claude-opus-4-1-20250805":
               "claude-haiku-4-5-20251001",
        max_tokens:1024,
        system:systemPrompt,
        messages:[{role:"user",content:userPrompt}]
      })
    });

    if(!res.ok) {
      const err = await res.text();
      return {success:false, error:`API error: ${res.status} - ${err.slice(0,200)}`};
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || "";
    const tokensIn = data.usage?.input_tokens || 0;
    const tokensOut = data.usage?.output_tokens || 0;
    const cost = calculateCost(tokensIn, tokensOut, model);

    logAiUsage(workspaceId, feature, tokensIn, tokensOut, model);

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
    model:"claude-sonnet-4-6",
    features:{redaccion:true,inbox:true,qualify:true,signals:true}
  });
  const [usage,setUsage] = useState<AiUsage[]>([]);
  const [hasKey,setHasKey] = useState(false);
  const toast = useToast();

  useEffect(()=>{
    const apiKeys = localStorage.getItem(`closer_apikeys_${workspaceId}`);
    if(apiKeys) {
      const keys = JSON.parse(apiKeys);
      setHasKey(!!keys.anthropic);
    }
    const stored = localStorage.getItem(`closer_ai_config_${workspaceId}`);
    if(stored) setConfig({...JSON.parse(stored), enabled:!!apiKeys&&!!JSON.parse(apiKeys).anthropic});
    const u = localStorage.getItem(`closer_ai_usage_${workspaceId}`);
    if(u) setUsage(JSON.parse(u));
  },[workspaceId]);

  function saveConfig(c:AiConfig) {
    setConfig(c);
    localStorage.setItem(`closer_ai_config_${workspaceId}`,JSON.stringify(c));
    toast("Configuracion guardada","ok");
  }

  function toggleFeature(f:keyof AiConfig["features"]) {
    const newConfig = {...config, features:{...config.features, [f]:!config.features[f]}};
    saveConfig(newConfig);
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

  return (
    <div className="fade-up" style={{padding:"32px 36px",height:"100%",overflowY:"auto"}}>
      <div style={{marginBottom:28}}>
        <h1 className="display" style={{fontSize:36,fontWeight:300,letterSpacing:"-0.01em"}}>IA Avanzada</h1>
        <p style={{fontSize:13,color:"var(--txt2)",marginTop:4}}>Conecta tu API de Claude para mensajes hiperpersonalizados, analisis profundo y deteccion de senales</p>
      </div>

      {/* Status banner */}
      <div className="glass" style={{
        padding:"16px 20px",
        marginBottom:24,
        border:`.5px solid ${hasKey?"rgba(16,185,129,.4)":"rgba(251,146,60,.3)"}`,
        background:hasKey?"rgba(16,185,129,.06)":"rgba(251,146,60,.05)",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:20}}>{hasKey?"✓":"⚠"}</span>
          <div style={{flex:1}}>
            <p style={{fontWeight:500,fontSize:14,color:hasKey?"#10b981":"#fb923c"}}>
              {hasKey?"IA Avanzada ACTIVA":"IA Avanzada DESACTIVADA"}
            </p>
            <p style={{fontSize:12,color:"var(--txt2)",marginTop:2}}>
              {hasKey
                ?"Tu API key esta configurada. La app usara Claude para potenciar las funciones activadas."
                :"Cargá tu API key de Anthropic en Settings → API Keys para activar funciones de IA. El CRM funciona perfecto sin esto, pero la IA agrega un nivel mas."}
            </p>
          </div>
        </div>
      </div>

      {/* Cost tracker */}
      {hasKey && (
        <div className="glass glass-gold" style={{padding:"18px 20px",marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <p style={{fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500}}>Uso este mes</p>
            <span style={{fontSize:10,color:"var(--txt3)"}}>{now.toLocaleDateString("es-ES",{month:"long",year:"numeric"})}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
            <div>
              <p className="display" style={{fontSize:28,fontWeight:300,color:"var(--gold)"}}>${totalCost.toFixed(2)}</p>
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
            Vos pagas directamente a Anthropic. CloserAI no toma comision. Podes ver tus gastos en console.anthropic.com
          </p>
        </div>
      )}

      {/* Model selector */}
      <div className="glass" style={{padding:"18px 20px",marginBottom:24}}>
        <p style={{fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500,marginBottom:12}}>Modelo a usar</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {Object.entries(AI_PRICING).map(([id,p])=>(
            <label key={id} style={{
              display:"flex",alignItems:"center",gap:12,padding:"10px 14px",
              borderRadius:8,border:`.5px solid ${config.model===id?"var(--gold-b)":"var(--border)"}`,
              background:config.model===id?"var(--gold-m)":"transparent",
              cursor:"pointer",transition:"all .15s"
            }}>
              <input type="radio" checked={config.model===id} onChange={()=>saveConfig({...config,model:id})}
                style={{accentColor:"var(--gold)"}} />
              <div style={{flex:1}}>
                <p style={{fontSize:13,fontWeight:500}}>{p.label}</p>
                <p style={{fontSize:11,color:"var(--txt2)",marginTop:2}}>
                  ${p.in}/M input · ${p.out}/M output
                </p>
              </div>
              <span className="pill pill-muted" style={{fontSize:10}}>
                ~${((p.in*500 + p.out*300)/1_000_000).toFixed(3)}/mensaje
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Features toggles */}
      <div className="glass" style={{padding:"18px 20px",marginBottom:24}}>
        <p style={{fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--txt2)",fontWeight:500,marginBottom:14}}>Funciones que usan IA</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[
            {key:"redaccion" as const, label:"Redaccion IA", desc:"Boton 'Mejorar con IA' en Redaccion - genera mensajes hiperpersonalizados usando datos del lead"},
            {key:"inbox" as const, label:"Inbox - Analisis profundo", desc:"Detecta sentiment, urgencia, objeciones reales. Sugiere script de respuesta optimizado"},
            {key:"qualify" as const, label:"Qualify Gate - Score automatico", desc:"Calcula BANT score basado en notas y actividad del lead automaticamente"},
            {key:"signals" as const, label:"Senales de intencion", desc:"Detecta cambios de cargo, posts del lead, comentarios en competencia y otras senales de compra"},
          ].map(f=>(
            <div key={f.key} style={{
              display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
              borderRadius:8,border:".5px solid var(--border)",
              opacity:hasKey?1:.5
            }}>
              <div style={{flex:1}}>
                <p style={{fontSize:13,fontWeight:500}}>{f.label}</p>
                <p style={{fontSize:11,color:"var(--txt2)",marginTop:2}}>{f.desc}</p>
              </div>
              <button
                onClick={()=>hasKey&&toggleFeature(f.key)}
                disabled={!hasKey}
                style={{
                  width:42,height:22,borderRadius:99,border:"none",
                  background:config.features[f.key]?"var(--gold)":"var(--border)",
                  position:"relative",cursor:hasKey?"pointer":"not-allowed",
                  transition:"all .2s"
                }}>
                <span style={{
                  position:"absolute",top:2,left:config.features[f.key]?22:2,
                  width:18,height:18,borderRadius:"50%",background:"#fff",
                  transition:"left .2s"
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Setup guide */}
      {!hasKey && (
        <div className="glass glass-gold" style={{padding:"18px 20px"}}>
          <p style={{fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--gold)",fontWeight:500,marginBottom:10}}>Como activar la IA</p>
          <ol style={{fontSize:12,color:"var(--txt2)",lineHeight:2,paddingLeft:18}}>
            <li>Crea cuenta en <strong style={{color:"var(--txt)"}}>console.anthropic.com</strong></li>
            <li>Carga creditos (minimo $5 USD - te dura semanas con uso normal)</li>
            <li>Genera una API key en Settings → API Keys de Anthropic</li>
            <li>Pegala en CloserAI: <strong style={{color:"var(--txt)"}}>Settings → API Keys → Anthropic</strong></li>
            <li>Volve aqui y activa las funciones que quieras</li>
          </ol>
          <p style={{fontSize:11,color:"var(--txt3)",marginTop:14,paddingTop:12,borderTop:".5px solid var(--gold-b)"}}>
            Estimacion: setter promedio gasta ~$2-3 USD/mes en API. Mucho mas barato que Claude Pro ($20) o Max ($100).
          </p>
        </div>
      )}
    </div>
  );
}

// ── AI ENHANCE BUTTON (componente reusable) ──────────────────────────────────
function AiEnhanceButton({
  feature, systemPrompt, userPrompt, workspaceId, model="claude-sonnet-4-6",
  onResult, label="Mejorar con IA"
}:{
  feature:string; systemPrompt:string; userPrompt:string; workspaceId:string;
  model?:string; onResult:(text:string,cost:number)=>void; label?:string;
}) {
  const [loading,setLoading] = useState(false);
  const toast = useToast();
  const config = useAiConfig(workspaceId);

  if(!config.enabled) return null;

  async function run() {
    setLoading(true);
    const result = await callClaude(workspaceId, feature, systemPrompt, userPrompt, model);
    setLoading(false);
    if(result.success && result.text) {
      onResult(result.text, result.cost||0);
      toast(`IA: $${(result.cost||0).toFixed(4)}`,"ok");
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
      }}>
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
    if (channel==="whatsapp"&&lead.phone) {
      const num = lead.phone.replace(/\D/g,"");
      const text = encodeURIComponent(msg);
      window.open(`https://wa.me/${num}?text=${text}`,"_blank");
    } else if (channel==="linkedin"&&lead.linkedin_url) {
      window.open(lead.linkedin_url,"_blank");
    } else if (channel==="instagram"&&lead.instagram_url) {
      window.open(lead.instagram_url,"_blank");
    } else if (channel==="email"&&lead.email) {
      window.open(`mailto:${lead.email}?body=${encodeURIComponent(msg)}`,"_blank");
    }
  }

  function markSent() {
    const a:Activity = {
      id:uid(), lead_id:lead.id, type:"dm", channel,
      content:`Mensaje enviado: "${msg.slice(0,80)}${msg.length>80?"...":""}"`,
      created_at:new Date().toISOString(), user_name:"Vos"
    };
    onSent(a);
    setSent(true);
    toast(`DM via ${channel} registrado en el CRM`,"ok");
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
          <button className="btn btn-primary" style={{flex:1,fontSize:12}} onClick={markSent} disabled={!msg||sent}>
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
              {label:"DMs por semana",field:"goal_dms" as const,placeholder:"20"},
              {label:"Calls por semana",field:"goal_calls" as const,placeholder:"5"},
              {label:"Cierres por semana",field:"goal_closes" as const,placeholder:"2"},
              {label:"Ticket promedio (USD)",field:"ticket" as const,placeholder:"500"},
            ].map(g=>(
              <div key={g.field}>
                <label style={{display:"block",fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--txt2)",marginBottom:6,fontWeight:500}}>{g.label}</label>
                <input type="number" className="inp" value={form[g.field]||""} onChange={e=>setForm(p=>({...p,[g.field]:+e.target.value}))} placeholder={g.placeholder} />
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
  const [tone,setTone] = useState<"directo"|"empatico"|"vsl">("directo");
  const [msg,setMsg] = useState("");
  const [loading,setLoading] = useState(false);
  const toast = useToast();

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
    const templates = {
      directo:`Hola ${selectedLead.name.split(" ")[0]}, vi tu perfil como ${selectedLead.role} y queria conectar. Trabajo con perfiles como el tuyo optimizando el sistema de prospeccion B2B. ?Tendrias 15 min esta semana?`,
      empatico:`Hola ${selectedLead.name.split(" ")[0]} ? Estuve analizando tu trabajo como ${selectedLead.role} y creo que hay una oportunidad concreta de mejorar tu flujo de clientes sin agregar mas horas de trabajo. ?Charlamos?`,
      vsl:`${selectedLead.name.split(" ")[0]}, prepare un video de 3 min especifico para ${selectedLead.role}s que explica como cerrar mas sin prospectar manualmente. ?Te lo mando?`,
    };
    setMsg(templates[tone]);
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
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {(["directo","empatico","vsl"] as const).map(t=>(
                <button key={t} className={`btn ${tone===t?"btn-primary":"btn-ghost"}`} style={{flex:1,fontSize:12,textTransform:"capitalize"}} onClick={()=>setTone(t)}>{t}</button>
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

      <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:20,maxWidth:900}}>
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

function LeadDetail({lead,onClose,onUpdate,activities,onAddActivity}:{
  lead:Lead;onClose:()=>void;onUpdate:(l:Lead)=>void;
  activities:Activity[];onAddActivity:(a:Activity)=>void;
}) {
  const [l,setL] = useState(lead);
  const [tab,setTab] = useState<"info"|"send"|"activity">("info");
  const toast = useToast();

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
            {[{id:"info",l:"Informacion"},{id:"send",l:"Enviar mensaje"},{id:"activity",l:`Actividad (${activities.length})`}].map(t=>(
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
                {sel&&<button className="btn btn-primary" onClick={()=>{onScoreUpdate(sel.id,Math.round(score));toast(`Score de ${sel.name} actualizado a ${Math.round(score)}`,"ok");}}>Actualizar score</button>}
              </div>
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
        <p style={{fontSize:10,color:"var(--txt3)",marginTop:4,letterSpacing:".1em",textTransform:"uppercase"}}>v9 - B2B Engine</p>
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
  const [leads,setLeads] = useState<Lead[]>([
    {id:"1",workspace_id:appUser.workspace.id,name:"Maria Velazquez",role:"Founder",company:"StartupMX",score:10,temp:"Warm",stage:"Calificado",next_action:"Call hoy",linkedin_url:"https://linkedin.com/in/mvelazquez",email:"maria@startupmx.com",created_at:"2026-05-20"},
    {id:"2",workspace_id:appUser.workspace.id,name:"Agencia Scale MX",role:"CEO",company:"Scale MX",score:9,temp:"Hot",stage:"Contactado",last_action:"Contactado",phone:"+54 9 11 4444-5555",created_at:"2026-05-19"},
    {id:"3",workspace_id:appUser.workspace.id,name:"Camila Torres",role:"Coach",company:"Self",score:9,temp:"Warm",stage:"Nuevo",next_action:"DM LinkedIn",linkedin_url:"https://linkedin.com/in/camilatorres",created_at:"2026-05-20"},
    {id:"4",workspace_id:appUser.workspace.id,name:"Diego Ramirez",role:"CMO",company:"Fintech SA",score:7,temp:"Frío",stage:"Propuesta",last_action:"Propuesta enviada",email:"diego@fintech.com",created_at:"2026-05-18"},
    {id:"5",workspace_id:appUser.workspace.id,name:"Juan Ads Lead",role:"Emprendedor",company:"Self",score:8,temp:"Hot",stage:"Nuevo",source:"inbound",next_action:"Contactar en 5 min",phone:"+54 9 11 5555-6666",email:"juan@gmail.com",notes:"Lleno formulario Meta Ads - Quiere info sobre coaching",created_at:"2026-05-28"},
  ]);
  const [activities,setActivities] = useState<Activity[]>([]);
  const [selLead,setSelLead] = useState<Lead|null>(null);
  const [addOpen,setAddOpen] = useState(false);
  const [showSetup,setShowSetup] = useState(false);
  const [bizProfile,setBizProfile] = useState<BusinessProfile|null>(()=>{
    try{const s=localStorage.getItem("closer_biz_profile");return s?JSON.parse(s):null;}catch{return null;}
  });

  function addLead(l:Lead){setLeads(p=>[{...l,workspace_id:appUser.workspace.id},...p]);}
  function updateLead(l:Lead){setLeads(p=>p.map(x=>x.id===l.id?l:x));}
  function addActivity(a:Activity){setActivities(p=>[...p,a]);}
  function getLeadActivities(leadId:string){return activities.filter(a=>a.lead_id===leadId);}
  function saveBizProfile(p:BusinessProfile){localStorage.setItem("closer_biz_profile",JSON.stringify(p));setBizProfile(p);setShowSetup(false);}
  function markSent(leadId:string,channel:string){
    const lead=leads.find(l=>l.id===leadId);if(!lead)return;
    updateLead({...lead,stage:lead.stage==="Nuevo"?"Contactado":lead.stage,last_action:`DM via ${channel}`});
    addActivity({id:uid(),lead_id:leadId,type:"dm",channel,content:"Marcado enviado desde sesion del dia",created_at:new Date().toISOString(),user_name:"Vos"});
  }

  const inboundNew = leads.filter(l=>(l.source==="inbound"||l.source==="ads")&&l.stage==="Nuevo").length;

  if(showSetup) return <BusinessSetup onSave={saveBizProfile} />;

  const views: Record<string,React.ReactNode> = {
    session:   <DailySession leads={leads} profile={bizProfile} onLeadClick={setSelLead} onMarkSent={markSent} />,
    dashboard: <Dashboard leads={leads} />,
    pipeline:  <Pipeline leads={leads} onLeadClick={setSelLead} onAddLead={addLead} />,
    inbound:   <Pipeline leads={leads.filter(l=>l.source==="inbound"||l.source==="ads"||l.source==="landing")} onLeadClick={setSelLead} onAddLead={addLead} />,
    closer:    <VistaCloser leads={leads} onLeadClick={setSelLead} />,
    buscador:  <Prospector onAddLead={addLead} workspaceId={appUser.workspace.id} />,
    import:    <CsvImport onImport={ls=>{ls.forEach(l=>addLead(l));}} workspaceId={appUser.workspace.id} />,
    generar:   <RedaccionIA leads={leads} workspaceId={appUser.workspace.id} />,
    email:     <EmailMarketing isAdmin={isAdmin} workspaceId={appUser.workspace.id} />,
    cadence:   <Cadences isAdmin={isAdmin} workspaceId={appUser.workspace.id} />,
    inbox:     <Inbox leads={leads} workspaceId={appUser.workspace.id} />,
    qualify:   <QualifyGate leads={leads} onScoreUpdate={(id,s)=>setLeads(p=>p.map(l=>l.id===id?{...l,score:s}:l))} workspaceId={appUser.workspace.id} />,
    metrics:   <Metrics leads={leads} isAdmin={isAdmin} />,
    knowledge: <Knowledge isAdmin={isAdmin} workspaceId={appUser.workspace.id} />,
    team:      isAdmin?<TeamManagement workspace={appUser.workspace} members={[{id:"m1",workspace_id:appUser.workspace.id,user_id:appUser.supabaseUser.id,role:"admin",display_name:appUser.member.display_name||"Admin"}]} onInvite={()=>{}} />:null,
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
          activities={getLeadActivities(selLead.id)} onAddActivity={addActivity} />
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
