import { useState, useEffect, useContext, createContext, useCallback, useMemo } from "react";

const FONT_LINK = document.createElement("link");
FONT_LINK.rel = "stylesheet";
FONT_LINK.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap";
document.head.appendChild(FONT_LINK);

const STAGES = ["Nuevo", "Contactado", "Respondio", "Call", "Cerrado"];
const STAGE_COLORS={Nuevo:{text:"text-zinc-400",dot:"bg-zinc-500",ring:"border-zinc-700"},Contactado:{text:"text-blue-400",dot:"bg-blue-500",ring:"border-blue-500/30"},Respondio:{text:"text-purple-400",dot:"bg-purple-500",ring:"border-purple-500/30"},Call:{text:"text-amber-400",dot:"bg-amber-500",ring:"border-amber-500/30"},Cerrado:{text:"text-emerald-400",dot:"bg-emerald-500",ring:"border-emerald-500/30"}};

const DAILY_LIMITS = {
  "LinkedIn DM":20,
  "Instagram DM":30,
  "WhatsApp":40,
  "Email Frío":80,
  "Twitter/X":50,
  "TikTok DM":20,
  "Telegram":60,
  "Facebook DM":25,
  "Discord DM":30,
  "Reddit DM":15,
  "Skool DM":40,
  "Llamada":50,
};

const APIFY_ACTORS = [
 {id:"search_linkedin",actorId:"2SyF0bVxmgGr8IYMO",label:"LinkedIn Search",icon:"💼",source:"LinkedIn",warmSignal:false,score:8,desc:"Busca perfiles por keywor",category:"LinkedIn"},
 {id:"linkedin_post_comments",actorId:"r9iXzRJd7gLGFTFQC",label:"Comentarios Post LinkedIn",icon:"💬",source:"LinkedIn Post",warmSignal:true,score:10,desc:"Extrae comentaristas warm",category:"LinkedIn"},
 {id:"email_finder_linkedin",actorId:"blitzapi/buscador-de-correo",label:"Buscador de Emails (LI)",icon:"📧",source:"LinkedIn",warmSignal:false,score:7,desc:"Correos verificados desde",category:"LinkedIn"},
 { id: "instagram_profiles", actorId: "coderx/API-para-extraer-perf",label: "Instagram Profiles", icon: "📸", source: "Instagram", warmSignal: true, score: 9, desc: "Seguidores e interacciones en Instagram", category: "Instagram" },
 {id:"instagram_scraper",actorId:"afanasenko/instagram-profile",label:"Instagram Pro (engagement)",icon:"🔥",source:"Instagram",warmSignal:true,score:9,desc:"Filtra por interacción y ",category:"Instagram"},
 {id:"tiktok_emails",actorId:"scraper-mind/tiktok-email-sc",label:"TikTok Email Scraper",icon:"🎵",source:"TikTok",warmSignal:true,score:8,desc:"Emails desde perfiles Tik",category:"TikTok"},
 {id:"tiktok_comments",actorId:"clockworks/tiktok-scraper",label:"TikTok Comments",icon:"💬",source:"TikTok",warmSignal:true,score:9,desc:"Comentaristas de videos v",category:"TikTok"},
 {id:"youtube_comments",actorId:"apidojo/extractor-de-comenta",label:"YouTube Comments",icon:"▶️",source:"YouTube",warmSignal:true,score:8,desc:"Comentaristas de videos d",category:"YouTube"},
 {id:"twitter_users",actorId:"apidojo/twitter-user-scraper",label:"Twitter/X Users",icon:"🐦",source:"Twitter/X",warmSignal:true,score:7,desc:"Usuarios por búsqueda en ",category:"Twitter/X"},
 {id:"facebook_ads",actorId:"dz_omar/facebook-ads-scraper",label:"Facebook Ads Spy",icon:"📊",source:"Facebook Ads",warmSignal:true,score:8,desc:"Creatividades y segmentac",category:"Facebook"},
 { id: "facebook_groups", actorId: "apify/facebook-groups-scraper",label: "Facebook Groups Members", icon: "👥", source: "Facebook Groups", warmSignal: true, score: 8, desc: "Miembros de grupos de nicho en Facebook", category: "Facebook" },
 {id:"google_maps",actorId:"nwua9Gu5YrADL7ZDj",label:"Google Maps Leads",icon:"📍",source:"Google Maps",warmSignal:false,score:7,desc:"Negocios locales con telé",category:"Negocios"},
 {id:"website_leads",actorId:"apify/analizador-de-clientes",label:"Website Lead Finder",icon:"🌐",source:"Web",warmSignal:false,score:7,desc:"Email y teléfono desde cu",category:"Negocios"},
 {id:"storeleads",actorId:"saswave/extractor-de-leads-d",label:"Store Leads (eCommerce)",icon:"🏪",source:"eCommerce",warmSignal:false,score:7,desc:"Leads de tiendas online p",category:"Negocios"},
 {id:"reddit_posts",actorId:"trudax/reddit-scraper",label:"Reddit Posts & Comments",icon:"🟠",source:"Reddit",warmSignal:true,score:8,desc:"Usuarios activos en subre",category:"Comunidades"},
 {id:"skool_members",actorId:"apify/skool-scraper",label:"Skool Members",icon:"🎓",source:"Skool",warmSignal:true,score:9,desc:"Miembros de comunidades S",category:"Comunidades"},
 {id:"whatsapp_validator",actorId:"vtrdev/validador-de-numero-d",label:"WhatsApp Validator",icon:"✅",source:"WhatsApp",warmSignal:false,score:6,desc:"Verifica números activos ",category:"Enriquecimiento"},
 {id:"apollo_enrichment",actorId:"curious_coder/apollo-scraper",label:"Apollo.io Enriquecimiento",icon:"🔬",source:"Apollo",warmSignal:false,score:8,desc:"Enriquece leads con email",category:"Enriquecimiento"},
 {id:"podcast_guests",actorId:"apify/podcast-guest-finder",label:"Podcast Guest Finder",icon:"🎙",source:"Podcast",warmSignal:true,score:9,desc:"Speakers de podcasts de t",category:"Referral"},
 {id:"meta_leads",actorId:"apify/facebook-lead-ads",label:"Meta Ads Leads (FB+IG)",icon:"🎯",source:"Meta Ads",warmSignal:true,score:9,desc:"Leads de formularios nati",category:"Ads",origin:"ads"},
 {id:"google_ads_leads",actorId:"apify/google-ads-leads",label:"Google Ads Leads",icon:"🔍",source:"Google Ads",warmSignal:true,score:9,desc:"Leads de búsqueda activa ",category:"Ads",origin:"ads"},
 {id:"tiktok_ads_leads",actorId:"apify/tiktok-lead-gen",label:"TikTok Ads Lead Gen",icon:"🎶",source:"TikTok Ads",warmSignal:true,score:8,desc:"Formularios nativos TikTo",category:"Ads",origin:"ads"},
 {id:"linkedin_ads_leads",actorId:"apify/linkedin-lead-gen",label:"LinkedIn Lead Gen Forms",icon:"🏢",source:"LinkedIn Ads",warmSignal:true,score:10,desc:"Lead más calificado — res",category:"Ads",origin:"ads"},
 {id:"youtube_ads_leads",actorId:"apify/youtube-vsl-leads",label:"YouTube VSL Leads",icon:"📺",source:"YouTube Ads",warmSignal:true,score:8,desc:"Ya vieron tu VSL — llegar",category:"Ads",origin:"ads"},
];

const ACTOR_CATEGORIES = [...new Set(APIFY_ACTORS.map(a => a.category))];

const MOCK_LEADS = [
  { id:1, name:"Lucas Ferreira", role:"CTO", source:"LinkedIn", data:"https://linkedin.com/in/lucasdev", stage:"Nuevo", score:8, captureMethod:"LinkedIn Search", warmSignal:false, notes:[], createdAt:Date.now()-86400000*5, followUpDate:null, handoff:null, email:"", ticket:500, tags:["SaaS","Tech"], activityLog:[], origin:"outbound", callResult:null, adCampaign:"" },
  { id:2, name:"Agencia Scale MX", role:"CEO", source:"Instagram DM", data:'Comentó: "Me interesa el framework"', stage:"Contactado", score:9, captureMethod:"Comentarios Post LinkedIn", warmSignal:true, notes:[{text:"Muy interesado en IA",ts:Date.now()-86400000*2}], createdAt:Date.now()-86400000*8, followUpDate:null, handoff:null, email:"", ticket:800, tags:["Agencia","LATAM"], activityLog:[{action:"Contactado vía Instagram",ts:Date.now()-86400000*7}], origin:"inbound", callResult:null, adCampaign:"" },
  { id:3, name:"María Velázquez", role:"Founder", source:"WhatsApp", data:"Pidió acceso a la comunidad privada.", stage:"Call", score:10, captureMethod:"Inbound", warmSignal:true, notes:[{text:"Call agendada",ts:Date.now()-86400000}], createdAt:Date.now()-86400000*12, followUpDate:new Date(Date.now()+86400000).toISOString().split("T")[0], handoff:{painPoints:"Sin sistema de prospección",decisionMakers:"Ella+socio",timeline:"Este mes",budget:"$300-500/mes",context:"Inbound warm",callTime:"",callPlatform:"Google Meet"}, email:"maria@velazquez.com", ticket:400, tags:["Founder","Inbound"], activityLog:[{action:"Inbound via WhatsApp",ts:Date.now()-86400000*11}], origin:"inbound", callResult:null, adCampaign:"" },
  { id:4, name:"Daniela Romero", role:"CMO", source:"Twitter/X", data:"Comentó sobre automatización de ventas", stage:"Cerrado", score:9, captureMethod:"Reddit Posts", warmSignal:true, notes:[{text:"¡Cerrada!",ts:Date.now()-3600000}], createdAt:Date.now()-86400000*15, followUpDate:null, handoff:null, email:"daniela@romero.co", ticket:350, tags:["CMO","Warm"], activityLog:[{action:"Cerrado ✓",ts:Date.now()-3600000}], origin:"inbound", callResult:{outcome:"closed",notes:"Objeción precio resuelta",ts:Date.now()-3600000}, adCampaign:"" },
  { id:5, name:"Camila Torres", role:"Coach", source:"Meta Ads", data:"Formulario campaña 'Sistematizá tu Prospección'", stage:"Nuevo", score:9, captureMethod:"Meta Ads Leads (FB+IG)", warmSignal:true, notes:[], createdAt:Date.now()-3600000*2, followUpDate:null, handoff:null, email:"camila@torrescoach.com", ticket:500, tags:["Coach","Ads"], activityLog:[{action:"Lead vía Meta Ads",ts:Date.now()-3600000*2}], origin:"ads", callResult:null, adCampaign:"Sistematizá tu Prospección — IG Story" },
];

const DEFAULT_PROFILE = {
  name: "Ornella Vanina Olmos",
  role: "Growth Operator & Tech Talent Scout",
  niche: "Agencias B2B y Startups de LATAM",
  valueProp: "Sistematizo la adquisición de clientes con IA.",
  socialProof: "Ayudé a 3 agencias B2B a conseguir clientes en EE.UU. en 30 días.",
  funnelType: "Comunidad Privada (Skool)",
  funnelUrl: "https://skool.com/tu-comunidad",
  leadMagnetType: "Mini-auditoría gratuita de prospección",
  voiceStyle: "directo, como WhatsApp con un colega",
  writingTone: "conversacional",
  sentenceLength: "cortas",
  usesEmoji: false,
  usesHumor: true,
  avoidWords: "básicamente,literalmente,en definitiva,espero que este mensaje",
  signaturePhrase: "",
  writingSample1: "",
  writingSample2: "",
  writingSample3: "",
  originStory: "",
  dreamClientDescription: "",
  apifyToken: "",
  apiKey: "",
};

const DEFAULT_TEMPLATES = [
  { id:1, name:"Apertura LinkedIn (Observación específica)", platform:"LinkedIn DM", text:"Hola [nombre], vi tu contenido sobre [tema exacto del post/video].\n\nAl buscarte en Instagram no encontré perfil de [empresa]. Otras [tipo de empresa] en España están llevando su mejor contenido a redes donde hay menos saturación.\n\nSupongo que ya lo tendrás controlado, pero ¿cómo lo están manejando en [empresa]?" },
  { id:2, name:"Apertura Cold Call B2B (Félix 4 pasos)", platform:"Llamada", text:"1. Apertura: Hola, soy [nombre] de [empresa]. La verdad es que no hemos hablado antes, pero como vi [observación específica de su empresa/rol] pensé que quizás podrías ayudarme con una pregunta. ¿Tienes un momento?\n\n2. Contexto: En general vemos que muchos [rol] están viendo [problema del sector], por lo que desarrollamos [solución]. ¿Cómo lo están haciendo en [empresa]... [opción A], [opción B] o [opción C]?\n\n3. Validar: Ah, entiendo. Tal vez acerté al llamar. ¿Te sirve si te muestro en 15 min cómo lo resuelven otros [sector] con [solución]?" },
  { id:3, name:"Follow-up sin respuesta (quita presión)", platform:"WhatsApp", text:"[Nombre], quedé con las ganas de escuchar cómo lo manejan en [empresa].\n\nQuizás no es el momento o ya lo tienen resuelto — si es así, perfecto.\n\n¿Sigue siendo relevante o prefiero dejarlo aquí?" },
  { id:4, name:"Breakup empático (deja puerta abierta)", platform:"WhatsApp", text:"Asumo que esto no encaja ahora mismo. Cierro por acá.\n\nSi en algún momento cambia algo con [tema], acá estoy." },
  { id:5, name:"Validar encaje post-respuesta", platform:"LinkedIn DM", text:"Ah, entiendo. Entonces tal vez acerté al escribirte.\n\nEn general quienes [su situación] suelen encontrar [problema]. No sé si será tu caso.\n\n¿Te sirve si te muestro en 15-20 min cómo lo resuelven otros [tipo empresa] con [mi solución]? Si encaja vemos cómo trabajar juntos, y si no te llevás un par de ideas." },
];

const CALL_OUTCOMES=[{id:"closed",label:"Cerrado ✓",color:"#10b981"},{id:"follow_up",label:"Follow-up acordado",color:"#C9A84C"},{id:"no_show",label:"No-show",color:"#f87171"},{id:"not_fit",label:"No califica",color:"#71717a"},{id:"lost_price",label:"Perdido-precio",color:"#f87171"},{id:"lost_timing",label:"Perdido-timing",color:"#fb923c"},{id:"lost_trust",label:"Perdido-confianza",color:"#f87171"},{id:"ghosted",label:"Ghosteó post-call",color:"#52525b"}];

const OBJECTION_BANK=["No tengo tiempo","Es caro / sin presupuesto","Ya tengo algo similar","Consulto con mi socio","Mándame más info","No es el momento","¿Cómo sé que funciona?","Necesito pensarlo","No entiendo cómo funciona","Dame unos días"];

const CADENCE_CHANNELS = ["LinkedIn DM", "Email Frío", "WhatsApp", "Instagram DM", "Twitter/X", "Llamada", "TikTok DM", "Telegram", "Facebook DM", "Discord DM", "Skool DM"];
const CADENCE_CHANNEL_ICONS = { "LinkedIn DM": "💼", "Email Frío": "📧", "WhatsApp": "💬", "Instagram DM": "📸", "Twitter/X": "🐦", "Llamada": "📞", "TikTok DM": "🎵", "Telegram": "✈️", "Facebook DM": "👥", "Discord DM": "🎮", "Skool DM": "🎓" };

const DEFAULT_CADENCES = [
  {
  id:1,name:"High-Ticket B2B",steps:[
  {day:1,channel:"LinkedIn DM",action:"Pattern interrupt + lead magnet",template:"msg1"},
  {day:3,channel:"Email Frío",action:"Value-first: caso de estudio",template:"msg1"},
  {day:5,channel:"LinkedIn DM",action:"Follow-up con CTA diferente",template:"msg2"},
  {day:7,channel:"WhatsApp",action:"Mensaje ultra corto",template:"msg2"},
  {day:10,channel:"Email Frío",action:"Breakup email",template:"msg3"},
  ]
  },
  {
  id:2,name:"Warm Inbound",steps:[
  {day:1,channel:"Instagram DM",action:"Responder + pregunta abierta",template:"msg1"},
  {day:2,channel:"Instagram DM",action:"Compartir lead magnet",template:"msg1"},
  {day:4,channel:"WhatsApp",action:"Transición a WhatsApp + call",template:"msg2"},
  {day:6,channel:"WhatsApp",action:"Confirmar o breakup",template:"msg3"},
  ]
  },
  {
  id:3,name:"Ads Lead — Velocidad Máxima",steps:[
  {day:0,channel:"WhatsApp",action:"Respuesta inmediata <5min: confirmar + 2 preguntas",template:"msg1"},
  {day:0,channel:"Llamada",action:"Llamada mismo día si confirmó",template:"msg1"},
  {day:1,channel:"WhatsApp",action:"Seguimiento con caso de uso si no contestó",template:"msg2"},
  {day:2,channel:"Email Frío",action:"Email: prueba social + CTA call",template:"msg2"},
  {day:3,channel:"WhatsApp",action:"Breakup corto",template:"msg3"},
  ]
  },
  {
  id:4,name:"Post-Call Follow-up",steps:[
  {day:0,channel:"WhatsApp",action:"Post-call: resumen + próximo paso",template:"msg1"},
  {day:1,channel:"Email Frío",action:"Propuesta o link de pago",template:"msg1"},
  {day:3,channel:"WhatsApp",action:"Check-in: ¿lo revisaste?",template:"msg2"},
  {day:5,channel:"WhatsApp",action:"Cierre de objeción o breakup",template:"msg3"},
  ]
  },
];

const WARM_SIGNAL_TYPES=[{id:"commented_post",label:"Comentó en post",score:10,icon:"💬"},{id:"opened_email",label:"Abrió email",score:7,icon:"📧"},{id:"visited_funnel",label:"Visitó embudo",score:8,icon:"🌐"},{id:"reacted_story",label:"Reaccionó a historia",score:9,icon:"🔥"},{id:"dm_inbound",label:"Escribió primero",score:10,icon:"📩"},{id:"liked_content",label:"Dio like",score:6,icon:"❤️"},{id:"shared_post",label:"Compartió contenido",score:9,icon:"🔁"},{id:"viewed_profile",label:"Vio perfil LI",score:7,icon:"👁"}];

const HUMAN_WRITING_RULES = `MÉTODO FÉLIX FERNÁNDEZ + HORMOZI — TEST DEL RESPETO:
Antes de cada mensaje: "¿Lo escribiría igual si supiera que esta persona es brillante?" Si NO → reescribir. NUNCA asumir problema — preguntar primero.

ESTRUCTURA 4 PASOS:
1. APERTURA: Observación MUY específica y real del prospecto (no del producto). Max 40p.
2. CONTEXTO+PREGUNTA: Observación de mercado de su sector + 1 sola pregunta con 2-3 opciones.
3. VALIDAR ENCAJE: "Quizás acerté. En general [su situation] trae [problema]. ¿Te sirve si te muestro en 15min?"
4. CTA MÍNIMA: Un recurso. Sin presión. Sin call larga en primer mensaje.

PROHIBIDO: revolucionario, potenciar, optimizar, transformar, sinergia, disruptivo, solución integral. "Tu empresa necesita...", "Seguramente tenés problemas con...", cualquier frase que asuma que el prospecto hace algo mal.

ESTILO: Max 80 palabras. Párrafos 1-2 líneas. Una sola pregunta. Frases de baja presión: "quizás ya lo tenés controlado", "no sé si será tu caso". Sin emojis corporativos. WhatsApp con colega competente.

SEÑALES DE IA A EVITAR: Empieza con "espero que estés bien". Habla del producto antes de preguntar. Asume el dolor. Más de una CTA.`;

const storage = {
  get: (key, fb) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  remove: (key) => { try { localStorage.removeItem(key); } catch {} },
};

const dailyActions = {
  getKey: (wsId) => `closer_daily_${wsId}_${new Date().toDateString()}`,
  get: (wsId) => storage.get(dailyActions.getKey(wsId), {}),
  increment: (wsId, platform) => {
  const d = dailyActions.get(wsId);
  d[platform] = (d[platform] || 0) + 1;
  storage.set(dailyActions.getKey(wsId), d);
  return d[platform];
  },
  count: (wsId, platform) => dailyActions.get(wsId)[platform] || 0,
  limitReached: (wsId, platform) => dailyActions.count(wsId, platform) >= (DAILY_LIMITS[platform] || 30),
};

const WS_COLORS=[{bg:"rgba(201,168,76,.12)",border:"rgba(201,168,76,.3)",dot:"#C9A84C"},{bg:"rgba(16,185,129,.1)",border:"rgba(16,185,129,.28)",dot:"#10b981"},{bg:"rgba(99,102,241,.1)",border:"rgba(99,102,241,.28)",dot:"#818cf8"},{bg:"rgba(236,72,153,.1)",border:"rgba(236,72,153,.28)",dot:"#f472b6"},{bg:"rgba(14,165,233,.1)",border:"rgba(14,165,233,.28)",dot:"#38bdf8"},{bg:"rgba(249,115,22,.1)",border:"rgba(249,115,22,.28)",dot:"#fb923c"}];

const wsKey = (wsId, suffix) => `closer_ws_${wsId}_${suffix}`;

function migrateIfNeeded() {
  const alreadyMigrated = storage.get("closer_migrated_v9", false);
  if (alreadyMigrated) return;

  const oldProfile = storage.get("closer_profile", null);
  const oldLeads  = storage.get("closer_leads",  []);
  const oldTpls  = storage.get("closer_templates", []);
  const oldCads  = storage.get("closer_cadences",  []);
  const oldInbox  = storage.get("closer_inbox",  []);

  const ws1 = { id: "ws_1", name: "Principal", colorIdx: 0, emoji: "⚡", createdAt: Date.now() };
  storage.set("closer_workspaces", [ws1]);
  storage.set("closer_active_ws", "ws_1");
  storage.set(wsKey("ws_1", "profile"),  oldProfile || null);
  storage.set(wsKey("ws_1", "leads"),  oldLeads.length ? oldLeads : MOCK_LEADS);
  storage.set(wsKey("ws_1", "templates"), oldTpls.length  ? oldTpls  : DEFAULT_TEMPLATES);
  storage.set(wsKey("ws_1", "cadences"),  oldCads.length  ? oldCads  : DEFAULT_CADENCES);
  storage.set(wsKey("ws_1", "inbox"),  oldInbox);
  storage.set("closer_migrated_v9", true);

  ["closer_profile","closer_leads","closer_templates","closer_cadences","closer_inbox"].forEach(storage.remove);
}

migrateIfNeeded();

const GlobalContext = createContext();

function GlobalProvider({ children }) {
  const [workspaces, setWorkspaces] = useState(() => storage.get("closer_workspaces", []));
  const [activeWsId, setActiveWsId] = useState(() => storage.get("closer_active_ws", workspaces[0]?.id || "ws_1"));

  const [profile,  setProfile]  = useState(() => storage.get(wsKey(activeWsId, "profile"),  null));
  const [leads,  setLeads]  = useState(() => { const s = storage.get(wsKey(activeWsId, "leads"), []); return s.length ? s : MOCK_LEADS; });
  const [templates, setTemplates] = useState(() => storage.get(wsKey(activeWsId, "templates"), DEFAULT_TEMPLATES));
  const [cadences,  setCadences]  = useState(() => storage.get(wsKey(activeWsId, "cadences"),  DEFAULT_CADENCES));
  const [inbox,  setInbox]  = useState(() => storage.get(wsKey(activeWsId, "inbox"),  []));
  const [toast,  setToast]  = useState(null);

  useEffect(() => { storage.set(wsKey(activeWsId, "profile"),  profile);  }, [profile,  activeWsId]);
  useEffect(() => { storage.set(wsKey(activeWsId, "leads"),  leads);  }, [leads,  activeWsId]);
  useEffect(() => { storage.set(wsKey(activeWsId, "templates"), templates); }, [templates, activeWsId]);
  useEffect(() => { storage.set(wsKey(activeWsId, "cadences"),  cadences);  }, [cadences,  activeWsId]);
  useEffect(() => { storage.set(wsKey(activeWsId, "inbox"),  inbox);  }, [inbox,  activeWsId]);
  useEffect(() => { storage.set("closer_workspaces", workspaces); }, [workspaces]);
  useEffect(() => { storage.set("closer_active_ws",  activeWsId); }, [activeWsId]);

  const switchWorkspace = useCallback((newId) => {
  setActiveWsId(newId);
  setProfile(  storage.get(wsKey(newId, "profile"),  null));
  setLeads(  () => { const s = storage.get(wsKey(newId, "leads"), []); return s.length ? s : MOCK_LEADS; });
  setTemplates( storage.get(wsKey(newId, "templates"), DEFAULT_TEMPLATES));
  setCadences(  storage.get(wsKey(newId, "cadences"),  DEFAULT_CADENCES));
  setInbox(  storage.get(wsKey(newId, "inbox"),  []));
  }, []);

  const createWorkspace = useCallback((name, emoji = "🚀", colorIdx = 0) => {
  const newId = `ws_${Date.now()}`;
  const ws = { id: newId, name, emoji, colorIdx, createdAt: Date.now() };
  storage.set(wsKey(newId, "profile"),  null);
  storage.set(wsKey(newId, "leads"),  []);
  storage.set(wsKey(newId, "templates"), DEFAULT_TEMPLATES);
  storage.set(wsKey(newId, "cadences"),  DEFAULT_CADENCES);
  storage.set(wsKey(newId, "inbox"),  []);
  setWorkspaces(p => [...p, ws]);
  switchWorkspace(newId);
  return newId;
  }, [switchWorkspace]);

  const updateWorkspace = useCallback((id, changes) => {
  setWorkspaces(p => p.map(w => w.id === id ? { ...w, ...changes } : w));
  }, []);

  const deleteWorkspace = useCallback((id) => {
  const remaining = workspaces.filter(w => w.id !== id);
  if (!remaining.length) return;
  ["profile","leads","templates","cadences","inbox"].forEach(k => storage.remove(wsKey(id, k)));
  setWorkspaces(remaining);
  if (activeWsId === id) switchWorkspace(remaining[0].id);
  }, [workspaces, activeWsId, switchWorkspace]);

  const showToast = useCallback((msg, type = "success") => {
  setToast({ message: msg, type, id: Date.now() });
  setTimeout(() => setToast(null), 4000);
  }, []);

  const completeOnboarding = useCallback((data) => setProfile(data), []);

  const addLead = useCallback((lead) => {
  setLeads(p => [{ ...lead, id: Date.now(), stage: "Nuevo", score: lead.score || 7, notes: [], createdAt: Date.now(), followUpDate: null, handoff: null, email: lead.email || "", ticket: lead.ticket || 0, tags: lead.tags || [], activityLog: [{ action: `Agregado vía ${lead.captureMethod || lead.source}`, ts: Date.now() }], origin: lead.origin || (lead.source?.toLowerCase().includes("ads") ? "ads" : "outbound"), callResult: null, adCampaign: lead.adCampaign || "" }, ...p]);
  showToast(`Lead "${lead.name}" agregado al pipeline`);
  }, [showToast]);

  const updateLeadStage = useCallback((id, newStage) => {
  setLeads(p => p.map(l => l.id === id ? { ...l, stage: newStage, activityLog: [...(l.activityLog || []), { action: `Movido a ${newStage}`, ts: Date.now() }] } : l));
  }, []);

  const updateLead = useCallback((id, changes) => {
  setLeads(p => p.map(l => l.id === id ? { ...l, ...changes } : l));
  }, []);

  const addTag = useCallback((id, tag) => {
  setLeads(p => p.map(l => l.id === id ? { ...l, tags: [...new Set([...(l.tags || []), tag])] } : l));
  }, []);

  const removeTag = useCallback((id, tag) => {
  setLeads(p => p.map(l => l.id === id ? { ...l, tags: (l.tags || []).filter(t => t !== tag) } : l));
  }, []);

  const deleteLead = useCallback((id) => {
  setLeads(p => p.filter(l => l.id !== id));
  showToast("Lead eliminado", "error");
  }, [showToast]);

  const addNote = useCallback((id, text) => {
  setLeads(p => p.map(l => l.id === id ? { ...l, notes: [...(l.notes || []), { text, ts: Date.now() }] } : l));
  showToast("Nota guardada");
  }, [showToast]);

  const addTemplate  = useCallback((tpl) => { setTemplates(p => [...p, { ...tpl, id: Date.now() }]); showToast("Template guardado"); }, [showToast]);
  const deleteTemplate = useCallback((id) => setTemplates(p => p.filter(t => t.id !== id)), []);
  const addCadence  = useCallback((c) => setCadences(p => [...p, { ...c, id: Date.now() }]), []);
  const deleteCadence = useCallback((id) => setCadences(p => p.filter(c => c.id !== id)), []);

  const addInboxItem = useCallback((item) => {
  setInbox(p => [{ ...item, id: Date.now(), ts: Date.now(), analyzed: false, reply: null }, ...p]);
  showToast("Respuesta agregada al inbox");
  }, [showToast]);

  const updateInboxItem = useCallback((id, changes) => {
  setInbox(p => p.map(i => i.id === id ? { ...i, ...changes } : i));
  }, []);

  const deleteInboxItem = useCallback((id) => setInbox(p => p.filter(i => i.id !== id)), []);

  const addWarmSignal = useCallback((leadId, signal) => {
  setLeads(p => p.map(l => {
  if (l.id !== leadId) return l;
  const signals = [...(l.warmSignals || []), { ...signal, ts: Date.now() }];
  const newScore = Math.min(10, Math.max(l.score, signal.score));
  return { ...l, warmSignals: signals, warmSignal: true, score: newScore };
  }));
  showToast("Señal warm registrada — score actualizado");
  }, [showToast]);

  const activeWorkspace = workspaces.find(w => w.id === activeWsId) || workspaces[0];

  return (
  <GlobalContext.Provider value={{
  workspaces, activeWsId, activeWorkspace,
  switchWorkspace, createWorkspace, updateWorkspace, deleteWorkspace,
  profile, leads, templates, cadences, inbox,
  completeOnboarding, addLead, updateLeadStage, updateLead, deleteLead, addNote,
  addTemplate, deleteTemplate, addCadence, deleteCadence,
  addInboxItem, updateInboxItem, deleteInboxItem, addWarmSignal,
  addTag, removeTag, showToast,
  }}>
  {children}
  {toast && <Toast key={toast.id} message={toast.message} type={toast.type} />}
  </GlobalContext.Provider>
  );
}

const apifyService = {
  run: async (actorId, inputParams, token) => {
  if (!token) throw new Error("Falta el APIFY_TOKEN. Configuralo en Ajustes.");

  const runRes = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${token}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ...inputParams, maxItems: 10 }),
  });
  if (!runRes.ok) throw new Error(`Apify error ${runRes.status}`);
  const { data: run } = await runRes.json();

  let status = "RUNNING";
  let attempts = 0;
  while ((status === "RUNNING" || status === "READY") && attempts < 30) {
  await new Promise((r) => setTimeout(r, 3000));
  const st = await fetch(`https://api.apify.com/v2/actor-runs/${run.id}?token=${token}`);
  const { data } = await st.json();
  status = data.status;
  attempts++;
  }
  if (status !== "SUCCEEDED") throw new Error("El actor de Apify no completó exitosamente.");

  const res = await fetch(`https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items?token=${token}&limit=10`);
  return await res.json();
  },

  mapResults: (items, actor) => items.map((item) => ({
  name: item.fullName || item.name || item.username || item.displayName || "Sin nombre",
  role: item.headline || item.jobTitle || item.bio || "Sin rol",
  source: actor.source,
  data: item.profileUrl || item.url || item.text || item.email || JSON.stringify(item).slice(0, 120),
  email: item.email || item.emails?.[0] || "",
  captureMethod: actor.label,
  warmSignal: actor.warmSignal,
  score: actor.score,
  })),

  mock: (actor) => [{ name: "Lead Demo "+actor.label, role: "Manager", source: actor.source, data: "Demo: "+actor.desc, email: "", captureMethod: actor.label, warmSignal: actor.warmSignal, score: actor.score }],
};

const aiService = {
  call: async (system, user, apiKey) => {
  if (!apiKey) throw new Error("Falta la API Key de OpenRouter. Configuralo en Ajustes.");
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
  body: JSON.stringify({
  model: "anthropic/claude-3.5-sonnet",
  messages: [{ role: "system", content: system }, { role: "user", content: user }],
  response_format: { type: "json_object" },
  }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error?.message || `Error ${res.status}`); }
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content.replace(/```json\n?|```/g, "").trim());
  },
};

function useAI() {
  const { profile } = useContext(GlobalContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(async (fn) => {
  setIsProcessing(true); setError(null);
  try { return await fn(); }
  catch (e) { setError(e.message); return null; }
  finally { setIsProcessing(false); }
  }, []);

  const base = `QUIÉN ERES: ${profile?.role} especializado en ${profile?.niche}.
PROPUESTA: ${profile?.valueProp}
PRUEBA SOCIAL: ${profile?.socialProof}
EMBUDO: ${profile?.funnelType} → ${profile?.funnelUrl}
LEAD MAGNET: ${profile?.leadMagnetType || "Mini-auditoría gratuita"}
ESTILO DE VOZ: ${profile?.voiceStyle || "directo, como WhatsApp con un colega"}`;

  const generateOutreach = useCallback((ctx, platform) => call(() =>
  aiService.call(
  `Sos un Growth Operator B2B experto en prospección no invasiva. ${base}\n${HUMAN_WRITING_RULES}\nAPLICÁ el test del respeto en cada mensaje. Usá la estructura de 4 pasos de Félix Fernández.\nDEVUELVE JSON: { "score": 8, "leadMagnet": "qué ofrecer como CTA mínima (no pedir call larga)", "msg1": "APERTURA: observación específica del prospecto + pregunta abierta de cómo lo manejan (max 60 palabras)", "msg2": "follow-up 48hs: validar encaje si respondió, o recordatorio suave si no (max 50 palabras)", "msg3": "breakup empático: sin presión, dejando puerta abierta (max 40 palabras)" }`,
  `Plataforma: ${platform}\nContexto del lead: ${ctx}`,
  profile?.apiKey
  )
  ), [call, profile, base]);

  const analyzeReply = useCallback((ctx, reply) => call(() =>
  aiService.call(
  `Analiza la objeción B2B con inteligencia emocional. ${base}\n${HUMAN_WRITING_RULES}\nDEVUELVE JSON: { "intent": "tipo de objeción o señal detectada", "advice": "táctica concreta para el setter", "suggestedReply": "respuesta humana < 60 palabras", "riskLevel": "alta|media|baja" }`,
  `Contexto del lead: ${ctx}\nRespuesta recibida: "${reply}"`,
  profile?.apiKey
  )
  ), [call, profile, base]);

  const generateIcebreaker = useCallback((info) => call(() =>
  aiService.call(
  `Sos experto en social selling B2B hiperpersonalizado. ${base}\n${HUMAN_WRITING_RULES}\nTÉCNICA FÉLIX: el primer mensaje debe partir de una observación MUY específica y real del prospecto (algo que viste en su perfil, contenido o empresa), no de tu producto. Aplicá el test del respeto.\nDEVUELVE JSON: { "hook": "observación específica real del prospecto (qué viste exactamente)", "context": "conexión entre esa observación y una tendencia de su sector/mercado", "opener": "mensaje completo siguiendo estructura Félix: observación → insight de mercado → 1 sola pregunta (max 75 palabras)", "tip": "qué canal y momento usar para que no suene a spam" }`,
  `Info del lead: ${info}`,
  profile?.apiKey
  )
  ), [call, profile, base]);

  const qualifyLead = useCallback((info) => call(() =>
  aiService.call(
  `Sos experto en calificación BANT para high-ticket B2B. ${base}\nDEVUELVE JSON: { "score": 8, "bant": { "budget": "...", "authority": "...", "need": "...", "timeline": "..." }, "redFlags": ["..."], "nextAction": "acción concreta en 24hs", "priority": "alta|media|baja", "recommendedPlatform": "LinkedIn DM|WhatsApp|Email Frío" }`,
  `Info del lead: ${info}`,
  profile?.apiKey
  )
  ), [call, profile, base]);

  const generateNoShowReminder = useCallback((leadName, callTime, platform) => call(() =>
  aiService.call(
  `Generá mensajes de confirmación y recordatorio para evitar no-shows en calls de ventas B2B. ${base}\n${HUMAN_WRITING_RULES}\nDEVUELVE JSON: { "reminder24h": "mensaje de recordatorio 24hs antes (< 50 palabras)", "reminder1h": "mensaje 1 hora antes muy corto (< 30 palabras)", "postNoShow": "mensaje si no se presentó sin avisar (empático, no agresivo)" }`,
  `Lead: ${leadName}\nHorario de call: ${callTime}\nPlataforma: ${platform}`,
  profile?.apiKey
  )
  ), [call, profile, base]);

  const generateCadenceStep = useCallback((leadCtx, step, previousMessages) => call(() =>
  aiService.call(
  `Sos un Growth Operator B2B experto en cadencias multicanal de alto ticket.\n${base}\n${HUMAN_WRITING_RULES}\nDEVUELVE JSON: { "subject": "asunto si es email (null si no aplica)", "message": "mensaje listo para enviar < 80 palabras", "tip": "consejo táctico de timing específico para este canal en este día de la secuencia" }`,
  `Lead: ${leadCtx}\nDía ${step.day} de la cadencia\nCanal: ${step.channel}\nObjetivo de este paso: ${step.action}\nMensajes anteriores enviados: ${previousMessages || "ninguno todavía"}`,
  profile?.apiKey
  )
  ), [call, profile, base]);

  const qualifyGate = useCallback((answers) => call(() =>
  aiService.call(
  `Sos experto en calificación BANT para high-ticket. Analiza las respuestas del formulario de pre-calificación.\n${base}\nDEVUELVE JSON: { "qualified": true|false, "score": 8, "reason": "por qué sí/no califica", "bant": { "budget": "análisis", "authority": "análisis", "need": "análisis", "timeline": "análisis" }, "recommendedAction": "qué hacer en las próximas 2hs", "redFlags": ["..."] }`,
  `Respuestas del formulario de pre-calificación:\n${Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join("\n")}`,
  profile?.apiKey
  )
  ), [call, profile, base]);

  const generateCallScript = useCallback((lead) => call(() =>
  aiService.call(
  `Sos un closer B2B experto en ventas consultivas de alto ticket. ${base}\n${HUMAN_WRITING_RULES}\nDEVUELVE JSON: { "opener": "cómo abrir los primeros 30 segundos (no genérico)", "situationQ": "pregunta de situación para entender el contexto", "problemQ": "pregunta que expone el problema real", "implicationQ": "pregunta que amplifica las consecuencias", "needQ": "pregunta que hace que el lead se venda solo", "bridge": "cómo transicionar de diagnóstico a propuesta en 2 oraciones", "pitch": "propuesta de valor en menos de 60 segundos personalizada para este lead", "closingQ": "pregunta de cierre directa sin presión", "objectionHandlers": { "precio": "respuesta", "tiempo": "respuesta", "necesito_pensarlo": "respuesta" } }`,
  `Lead: ${lead.name} (${lead.role})\nOrigen: ${lead.origin || "outbound"}\nDolor identificado: ${lead.handoff?.painPoints || "No especificado"}\nPresupuesto: ${lead.handoff?.budget || "No especificado"}\nTimeline: ${lead.handoff?.timeline || "No especificado"}\nContexto previo: ${lead.handoff?.context || lead.data}\nScore: ${lead.score}/10`,
  profile?.apiKey
  )
  ), [call, profile, base]);

  const handleObjection = useCallback((objection, leadCtx) => call(() =>
  aiService.call(
  `Sos un closer B2B experto en manejo de objeciones para ventas high-ticket. ${base}\n${HUMAN_WRITING_RULES}\nDEVUELVE JSON: { "type": "tipo real de objeción detrás de lo que dijeron", "root": "causa raíz psicológica real de esta objeción", "response": "respuesta directa < 60 palabras que valida y redirige", "followUp": "pregunta para continuar la conversación tras manejar la objeción", "riskLevel": "alta|media|baja", "tip": "táctica específica de cierre para este perfil" }`,
  `Objeción recibida: "${objection}"\nContexto del lead: ${leadCtx}`,
  profile?.apiKey
  )
  ), [call, profile, base]);

  const generateAdsResponse = useCallback((lead) => call(() =>
  aiService.call(
  `Sos un setter experto en respuesta inmediata a leads de publicidad pagada. La velocidad es crítica: responder en menos de 5 minutos aumenta la conversión 3x. ${base}\n${HUMAN_WRITING_RULES}\nDEVUELVE JSON: { "immediateMsg": "primer mensaje a enviar en los próximos 5 minutos (ultra corto, confirmar interés)", "qualifyMsg": "segundo mensaje con 2 preguntas de calificación rápida", "callBookMsg": "tercer mensaje para agendar call (con link o propuesta de horario)", "urgencyTip": "por qué responder ahora y no en 1 hora" }`,
  `Lead de ads: ${lead.name} (${lead.role})\nCampaña: ${lead.adCampaign || "No especificada"}\nFuente: ${lead.source}\nContexto: ${lead.data}`,
  profile?.apiKey
  )
  ), [call, profile, base]);
  const generate5ActSequence = useCallback((leadCtx, platform) => call(() =>
  aiService.call(
  `Sos setter B2B. 5 ACTOS: A1=Reciprocidad específica max40p. A2=Ego up+gap max30p. A3=CTA mínima costo cero max20p. A4=2-3 preguntas SPIN de implicación (consecuencias, no el problema). A5=Solución con placeholder [DOLOR_QUE_EL_NOMBRO]
DEVUELVE JSON: {"act1":"","act2":"","act3":"","act4_questions":["","",""],"act4_intro":"","act5":"con [DOLOR_QUE_EL_NOMBRO]","act5_anchors":["precio","tiempo","visibilidad"],"painSignals":["",""],"redFlags":[""]}`,
  `Lead: ${leadCtx}\nPlataforma: ${platform}`,
  profile?.apiKey
  )
  ), [call, profile, base]);

  return { generateOutreach, analyzeReply, generateIcebreaker, qualifyLead, generateNoShowReminder, generateCadenceStep, qualifyGate, generateCallScript, handleObjection, generateAdsResponse, generate5ActSequence, isProcessing, error };
}

const T = {
  gold: "#C9A84C",
  goldMuted: "rgba(201,168,76,.15)",
  goldBorder: "rgba(201,168,76,.25)",
  navy: "#0A0F1E",
  navySurface: "#0D1424",
  surface: "rgba(255,255,255,.03)",
  surfaceHover: "rgba(255,255,255,.055)",
  border: "rgba(255,255,255,.07)",
  borderHover: "rgba(201,168,76,.3)",
  emerald: "#10b981",
  emeraldMuted: "rgba(16,185,129,.12)",
};
const FM = "'DM Mono',monospace";
const FS = "'DM Sans',sans-serif";
const FP = "'Playfair Display',serif";

function Toast({ message, type }) {
  const c = {
  success: "border-[rgba(201,168,76,.3)] bg-[rgba(201,168,76,.06)] text-[#C9A84C]",
  error: "border-red-500/30 bg-red-500/5 text-red-400",
  info: "border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.04)] text-zinc-300",
  warn: "border-amber-500/30 bg-amber-500/5 text-amber-400"
  };
  const icons = { success: "◆", error: "✕", info: "◈", warn: "△" };
  return (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-2xl shadow-2xl text-xs font-medium animate-slideUp max-w-xs tracking-wide ${c[type] || c.info}`}>
  <span className="opacity-60">{icons[type] || "◈"}</span>{message}
  </div>
  );
}

function Badge({ children, color = "zinc", glow = false }) {
  const c = {
  zinc: "bg-white/5 text-zinc-400 border-white/10",
  emerald: `bg-emerald-500/10 text-emerald-400 border-emerald-500/20${glow ? " shadow-[0_0_10px_rgba(16,185,129,.2)]" : ""}`,
  gold: `bg-[rgba(201,168,76,.1)] text-[#C9A84C] border-[rgba(201,168,76,.25)]${glow ? " shadow-[0_0_10px_rgba(201,168,76,.15)]" : ""}`,
  blue: "bg-blue-500/8 text-blue-400 border-blue-500/15",
  purple: "bg-purple-500/8 text-purple-400 border-purple-500/15",
  amber: "bg-amber-500/8 text-amber-400 border-amber-500/15",
  red: "bg-red-500/8 text-red-400 border-red-500/15",
  };
  return (
  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border tracking-wider uppercase ${c[color]}`} style={{fontFamily:FM}}>
  {children}
  </span>
  );
}

function Btn({ children, onClick, disabled, variant = "primary", size = "md", className = "" }) {
  const v = {
  primary: "text-[#0A0F1E] font-bold border border-[rgba(201,168,76,.6)] shadow-[0_0_20px_rgba(201,168,76,.15),inset_0_1px_0_rgba(255,255,255,.1)]",
  secondary: "bg-white/5 hover:bg-white/8 text-zinc-300 border border-white/8 hover:border-white/15",
  ghost: "bg-transparent hover:bg-white/4 text-zinc-400 hover:text-zinc-200",
  danger: "bg-red-500/8 hover:bg-red-500/15 text-red-400 border border-red-500/15",
  amber: "bg-amber-500/8 hover:bg-amber-500/15 text-amber-400 border border-amber-500/15",
  };
  const s = { xs: "text-[10px] px-2.5 py-1", sm: "text-xs px-3.5 py-1.5", md: "text-sm px-5 py-2.5", lg: "text-sm px-7 py-3.5" };
  const isPrimary = variant === "primary";
  return (
  <button onClick={onClick} disabled={disabled}
  className={`rounded-lg transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed tracking-wide ${v[variant]} ${s[size]} ${className}`}
  style={isPrimary ? { background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)", fontFamily:FS } : { fontFamily:FS }}>
  {children}
  </button>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", multiline = false, hint }) {
  const cls = "w-full border rounded-lg px-3.5 py-2.5 text-sm placeholder-zinc-700 outline-none transition-all duration-200";
  const style = { background: "rgba(255,255,255,.02)", borderColor: "rgba(255,255,255,.07)", color: "#e4e4e7", fontFamily:FS };
  const focusStyle = "focus:border-[rgba(201,168,76,.4)] focus:ring-1 focus:ring-[rgba(201,168,76,.15)]";
  return (
  <div className="space-y-1.5">
  {label && <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.12em]" style={{fontFamily:FM}}>{label}</label>}
  {multiline
  ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={`${cls} ${focusStyle} resize-none`} style={style} />
  : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${cls} ${focusStyle}`} style={style} />}
  {hint && <p className="text-[10px] text-zinc-600 leading-relaxed">{hint}</p>}
  </div>
  );
}

// ... (Resto del código idéntico y limpio, el bloque repetido ya fue eliminado)

function WorkspaceSwitcher() {
  const { workspaces, activeWsId, activeWorkspace, switchWorkspace, createWorkspace, updateWorkspace, deleteWorkspace } = useContext(GlobalContext);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🚀");
  const newColorIdx = 0;
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const EMOJIS = ["🚀","💼","🎯","🔥","⚡","🌎","📈","🏆","💡","🎪","🛒","🤖"];

  const handleCreate = () => {
  if (!newName.trim()) return;
  createWorkspace(newName.trim(), newEmoji, newColorIdx);
  setNewName(""); setNewEmoji("🚀"); setCreating(false); setOpen(false);
  };

  const ws = activeWorkspace;
  const color = WS_COLORS[ws?.colorIdx ?? 0];

  return (
  <div className="relative px-3 pt-4 pb-3" style={{borderBottom:"1px solid rgba(255,255,255,.05)"}}>
  <button onClick={() => setOpen(o => !o)}
  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all"
  style={{background:open?color.bg:"rgba(255,255,255,.02)",border:`1px solid ${open?color.border:"rgba(255,255,255,.06)"}`}}>
  <span className="text-base flex-shrink-0">{ws?.emoji || "⚡"}</span>
  <div className="flex-1 text-left min-w-0">
  <p className="text-xs font-semibold text-zinc-200 truncate" style={{fontFamily:"'DM Sans',sans-serif"}}>{ws?.name || "Workspace"}</p>
  <p className="text-[9px] tracking-widest uppercase" style={{color:"rgba(201,168,76,.45)",fontFamily:"'DM Mono',monospace"}}>{workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}</p>
  </div>
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{color:"rgba(113,113,122,.5)",flexShrink:0,transform:open ? "rotate(180deg)" :"none",transition:"transform 0.2s"}}>
  <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
  </button>

  {open && (
  <div className="absolute left-3 right-3 top-full mt-1.5 rounded-xl border shadow-2xl z-50 overflow-hidden animate-fadeIn"
  style={{background:"#0A0F1E",borderColor:"rgba(201,168,76,.15)",boxShadow:"0 20px 60px rgba(0,0,0,.8)"}}>

  <div className="p-1.5 space-y-0.5 max-h-52 overflow-y-auto custom-scrollbar">
  {workspaces.map((w) => {
  const c = WS_COLORS[w.colorIdx ?? 0];
  const isActive = w.id === activeWsId;
  return (
  <div key={w.id} className="flex items-center gap-2 px-2.5 py-2 rounded-lg group/ws transition-all"
  style={{ background: isActive ? c.bg : "transparent", border: `1px solid ${isActive ? c.border : "transparent"}`, cursor: "pointer" }}
  onClick={() => { if (!editingId) { switchWorkspace(w.id); setOpen(false); } }}>
  <span className="text-sm">{w.emoji}</span>
  {editingId === w.id ? (
  <input autoFocus value={editName} onChange={e => setEditName(e.target.value)}
  onKeyDown={e => { if (e.key === "Enter") { updateWorkspace(w.id, { name: editName }); setEditingId(null); } if (e.key === "Escape") setEditingId(null); }}
  className="flex-1 text-xs bg-transparent outline-none text-zinc-200 border-b border-zinc-600 pb-0.5"
  onClick={e => e.stopPropagation()} style={{fontFamily:"'DM Sans',sans-serif"}} />
  ) : (
  <span className="flex-1 text-xs font-medium truncate" style={{color:isActive ? "#e4e4e7" :"#71717a",fontFamily:"'DM Sans',sans-serif"}}>{w.name}</span>
  )}
  {isActive && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:c.dot}} />}
  <div className="flex gap-1 opacity-0 group-hover/ws:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
  <button onClick={() => { setEditingId(w.id); setEditName(w.name); }}
  className="text-[9px] text-zinc-700 hover:text-zinc-400 px-1 py-0.5 rounded transition-colors">✎</button>
  {workspaces.length > 1 && (
  <button onClick={() => { if (window.confirm(`¿Eliminar "${w.name}"?`)) deleteWorkspace(w.id); }}
  className="text-[9px] text-zinc-700 hover:text-red-400 px-1 py-0.5 rounded transition-colors">✕</button>
  )}
  </div>
  </div>
  );
  })}
  </div>

  <div style={{borderTop:"1px solid rgba(255,255,255,.05)"}} />

  {creating ? (
  <div className="p-3 space-y-2.5">
  <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
  placeholder="Nombre del workspace..." onKeyDown={e => e.key === "Enter" && handleCreate()}
  className="w-full text-xs bg-transparent border-b outline-none pb-1.5 text-zinc-200 placeholder-zinc-700"
  style={{borderColor:"rgba(201,168,76,.3)",fontFamily:"'DM Sans',sans-serif"}} />
  <div className="flex gap-1 flex-wrap">
  {EMOJIS.map(e => (
  <button key={e} onClick={() => setNewEmoji(e)}
  className="text-sm w-7 h-7 rounded-lg flex items-center justify-center transition-all"
  style={{ background: newEmoji === e ? "rgba(201,168,76,.15)" : "rgba(255,255,255,.04)", border: `1px solid ${newEmoji === e ? "rgba(201,168,76,.3)" : "transparent"}` }}>
  {e}
  </button>
  ))}
  </div>
  <div className="flex gap-2">
  <button onClick={() => setCreating(false)} className="flex-1 text-[10px] text-zinc-600 hover:text-zinc-400 py-1.5 transition-colors">Cancelar</button>
  <button onClick={handleCreate} disabled={!newName.trim()}
  className="flex-1 text-[10px] font-semibold py-1.5 rounded-lg disabled:opacity-30 transition-all"
  style={{background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#07090F"}}>
  Crear
  </button>
  </div>
  </div>
  ) : (
  <button onClick={() => setCreating(true)}
  className="w-full text-left px-3.5 py-2.5 text-[10px] font-medium tracking-wide transition-colors"
  style={{color:"rgba(201,168,76,.6)",fontFamily:"'DM Mono',monospace"}}>
  + Nuevo workspace
  </button>
  )}
  </div>
  )}
  </div>
  );
}

const NAV_SVG = {
  dashboard: "<rect x='1' y='1' width='5.5' height='5.5' rx='1' stroke='currentColor' strokeWidth='1.2'/><rect x='8.5' y='1' width='5.5' height='5.5' rx='1' stroke='currentColor' strokeWidth='1.2'/><rect x='1' y='8.5' width='5.5' height='5.5' rx='1' stroke='currentColor' strokeWidth='1.2'/><rect x='8.5' y='8.5' width='5.5' height='5.5' rx='1' stroke='currentColor' strokeWidth='1.2'/>",
  pipeline:  "<path d='M1 4h13M1 7.5h9M1 11h5.5' stroke='currentColor' strokeWidth='1.3' strokeLinecap='round'/>",
  buscador:  "<circle cx='6.5' cy='6.5' r='4.5' stroke='currentColor' strokeWidth='1.2'/><path d='M10.5 10.5L14 14' stroke='currentColor' strokeWidth='1.3' strokeLinecap='round'/>",
  generar:  "<path d='M7.5 1v2M7.5 12v2M1 7.5h2M12 7.5h2M3.2 3.2l1.4 1.4M10.4 10.4l1.4 1.4M3.2 11.8l1.4-1.4M10.4 4.6l1.4-1.4' stroke='currentColor' strokeWidth='1.2' strokeLinecap='round'/><circle cx='7.5' cy='7.5' r='2' stroke='currentColor' strokeWidth='1.2'/>",
  cadence:  "<circle cx='3' cy='3' r='1.5' stroke='currentColor' strokeWidth='1.2'/><circle cx='3' cy='7.5' r='1.5' stroke='currentColor' strokeWidth='1.2'/><circle cx='3' cy='12' r='1.5' stroke='currentColor' strokeWidth='1.2'/><path d='M4.5 3h7M4.5 7.5h5M4.5 12h3' stroke='currentColor' strokeWidth='1.2' strokeLinecap='round'/>",
  inbox:  "<path d='M1.5 4a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1h-10a1 1 0 01-1-1V4z' stroke='currentColor' strokeWidth='1.2'/><path d='M1.5 4l6 4.5L13.5 4' stroke='currentColor' strokeWidth='1.2' strokeLinecap='round'/>",
  qualify:  "<path d='M3 7.5l3 3 6-6' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round'/><circle cx='7.5' cy='7.5' r='6' stroke='currentColor' strokeWidth='1.2'/>",
  closer:  "<path d='M7.5 1L9.2 5.5H14L10.4 8.5L11.7 13L7.5 10.2L3.3 13L4.6 8.5L1 5.5H5.8L7.5 1Z' stroke='currentColor' strokeWidth='1.2' strokeLinejoin='round'/>",
};

function NavIcon({ id }) {
  const inner = NAV_SVG[id] || "";
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none" dangerouslySetInnerHTML={{ __html: inner }} />;
}

const NAV = [
  { id: "dashboard", label: "Dashboard" },
  { id: "pipeline",  label: "CRM Pipeline" },
  { id: "closer",   label: "Vista Closer" },
  { id: "buscador", label: "Prospector" },
  { id: "generar",  label: "Redacción IA" },
  { id: "email",    label: "Email Marketing" },
  { id: "cadence",  label: "Cadencias" },
  { id: "inbox",    label: "Inbox" },
  { id: "qualify",   label: "Qualify Gate" },
  { id: "knowledge", label: "Base Conocimiento" },
];

function AppLayout() {
  const { profile, leads, inbox } = useContext(GlobalContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const [showSession, setShowSession] = useState(false);

  if (!profile) return <OnboardingWizard />;

  const today = new Date().toDateString();
  const overdueCount = leads.filter((l) => l.followUpDate && new Date(l.followUpDate) < new Date(today)).length;
  const callsTodayCount = leads.filter((l) => l.handoff?.callTime && new Date(l.handoff.callTime).toDateString() === today).length;
  const warmCount = leads.filter((l) => l.warmSignal && l.stage !== "Cerrado").length;
  const inboxPending = inbox.filter((i) => !i.analyzed).length;
  const adsUrgent = leads.filter(l => l.origin === "ads" && l.stage === "Nuevo" && (Date.now() - l.createdAt) < 3600000).length;
  const closerReady = leads.filter(l => l.stage === "Call" && l.handoff).length;

  return (
  <div className="min-h-screen flex" style={{background:"#07090F",fontFamily:FS,color:"#e4e4e7"}}>

  <aside className="w-56 flex flex-col flex-shrink-0 relative" style={{background:"linear-gradient(180deg,#0A0F1E 0%,#070A15 100%)",borderRight:"1px solid rgba(255,255,255,.05)"}}>

  <div className="px-5 pt-5 pb-4" style={{borderBottom:"1px solid rgba(255,255,255,.04)"}}>
  <div className="flex items-baseline gap-1">
  <span className="text-base font-black tracking-[0.15em] text-white uppercase" style={{fontFamily:FP,letterSpacing:"0.18em"}}>Closer</span>
  <span className="text-base font-black" style={{color:T.gold,fontFamily:FP}}>AI</span>
  </div>
  <p className="text-[9px] tracking-[0.2em] uppercase mt-0.5" style={{color:"rgba(201,168,76,.35)",fontFamily:FM}}>v9</p>
  </div>

  <WorkspaceSwitcher />

  <nav className="flex-1 px-3 py-4 space-y-0.5">
  {NAV.map(({ id, label }) => {
  const isActive = activeTab === id;
  return (
  <button key={id} onClick={() => setActiveTab(id)}
  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all duration-200 relative group"
  style={{
  background: isActive ? "rgba(201,168,76,.08)" : "transparent",
  color: isActive ? T.gold : "rgba(161,161,170,.7)",
  border: `1px solid ${isActive ? "rgba(201,168,76,.2)" : "transparent"}`,
  fontFamily:FS,
  fontWeight: isActive ? 600 : 400,
  letterSpacing: "0.02em",
  }}>
  <span className="transition-colors" style={{color:isActive ? T.gold :"rgba(113,113,122,.8)"}}>
  <NavIcon id={id} />
  </span>
  <span className="flex-1 text-left">{label}</span>
  {id === "pipeline" && overdueCount > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{background:"rgba(239,68,68,.12)",color:"#f87171",border:"1px solid rgba(239,68,68,.2)",fontFamily:FM}}>{overdueCount}</span>}
  {id === "pipeline" && overdueCount === 0 && leads.length > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{background:"rgba(255,255,255,.05)",color:"#71717a",fontFamily:FM}}>{leads.length}</span>}
  {id === "dashboard" && callsTodayCount > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(201,168,76,.12)", color: T.gold, border: `1px solid ${T.goldBorder}`, fontFamily:FM }}>{callsTodayCount}</span>}
  {id === "inbox" && inboxPending > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{background:"rgba(139,92,246,.12)",color:"#a78bfa",border:"1px solid rgba(139,92,246,.2)",fontFamily:FM}}>{inboxPending}</span>}
  {id === "closer" && closerReady > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(201,168,76,.12)", color: T.gold, border: `1px solid ${T.goldBorder}`, fontFamily:FM }}>{closerReady}</span>}
  {id === "buscador" && adsUrgent > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{background:"rgba(239,68,68,.15)",color:"#f87171",border:"1px solid rgba(239,68,68,.25)",fontFamily:FM}}>!</span>}
  </button>
  );
  })}
  </nav>

  <div className="px-3 py-3 space-y-1.5" style={{borderTop:"1px solid rgba(255,255,255,.04)"}}>
  {callsTodayCount > 0 && (
  <div className="px-3 py-2 rounded-lg" style={{ background: "rgba(201,168,76,.06)", border: `1px solid ${T.goldBorder}` }}>
  <span className="text-[10px] tracking-wider" style={{color:T.gold,fontFamily:FM}}>◆ {callsTodayCount} call{callsTodayCount > 1 ? "s" : ""} hoy</span>
  </div>
  )}
  {warmCount > 0 && (
  <div className="px-3 py-2 rounded-lg" style={{background:"rgba(16,185,129,.05)",border:"1px solid rgba(16,185,129,.15)"}}>
  <span className="text-[10px] tracking-wider" style={{color:T.emerald,fontFamily:FM}}>◆ {warmCount} leads warm</span>
  </div>
  )}
  {overdueCount > 0 && (
  <div className="px-3 py-2 rounded-lg" style={{background:"rgba(239,68,68,.05)",border:"1px solid rgba(239,68,68,.12)"}}>
  <span className="text-[10px] tracking-wider text-red-400" style={{fontFamily:FM}}>△ {overdueCount} vencido{overdueCount > 1 ? "s" : ""}</span>
  </div>
  )}

  <button onClick={() => setShowSession(true)}
    className="w-full px-3 py-2 rounded-lg text-[10px] font-semibold tracking-wider transition-all mt-1 border"
    style={{background:"rgba(201,168,76,.07)",borderColor:"rgba(201,168,76,.2)",color:"#C9A84C",fontFamily:FM}}>
    ▶ Sesión guiada
  </button>

  <button onClick={() => setShowSettings(true)}
  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all mt-1"
  style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)"}}
  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,.2)"; }}
  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,.05)"; }}>
  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
  style={{background:"linear-gradient(135deg,#C9A84C,#E8C96A)",color:"#07090F"}}>
  {profile.name?.[0]?.toUpperCase()}
  </div>
  <div className="text-left min-w-0 flex-1">
  <div className="text-[11px] font-medium text-zinc-300 truncate">{profile.name}</div>
  <div className="text-[9px] text-zinc-600 truncate tracking-wide">{profile.role}</div>
  </div>
  <svg width="11" height="11" viewBox="0 0 15 15" fill="none" style={{color:"rgba(113,113,122,.5)",flexShrink:0}}>
  <path d="M7.5 1a6.5 6.5 0 100 13A6.5 6.5 0 007.5 1zM6 7.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
  </button>
  </div>
  </aside>

  <main className="flex-1 relative overflow-hidden flex flex-col">
  <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse 60% 40% at 75% 10%,rgba(201,168,76,.025) 0%,transparent 70%),radial-gradient(ellipse 40% 60% at 15% 80%,rgba(16,185,129,.02) 0%,transparent 70%)",}} />
  {activeTab === "dashboard" && <Dashboard setActiveTab={setActiveTab} onStartSession={() => setShowSession(true)} />}
  {activeTab === "pipeline" && <Pipeline setActiveTab={setActiveTab} onStartSession={() => setShowSession(true)} />}
  {showSession && <SessionMode leads={leads} onClose={() => setShowSession(false)} setActiveTab={setActiveTab} />}
  {activeTab === "closer" && <CloserView />}
  {activeTab === "buscador" && <Buscador />}
  {activeTab === "generar" && <Generar />}
  {activeTab === "cadence" && <CadenceBuilder />}
  {activeTab === "inbox" && <Inbox />}
  {activeTab === "qualify" && <QualificationGate />}
  {activeTab === "email"     && <EmailMarketing />}
  {activeTab === "knowledge" && <KnowledgePageWrapper />}
  </main>

  {showSettings && <Settings onClose={() => setShowSettings(false)} />}

  <style>{`
  * { box-sizing: border-box; }
  ::selection { background: rgba(201,168,76,.2); color: #fff; }
  .custom-scrollbar::-webkit-scrollbar { width: 3px; height: 3px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,.08); border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(201,168,76,.3); }
  @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-slideUp { animation: slideUp 0.25s ease-out; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
  input[type="datetime-local"], input[type="date"] { color-scheme: dark; }
  select option { background: #0D1424; color: #e4e4e7; }
  .stat-card { transition: border-color 0.2s, box-shadow 0.2s; }
  .stat-card:hover { border-color: rgba(201,168,76,.2) !important; box-shadow: 0 0 20px rgba(201,168,76,.04); }
  .lead-card-hover { transition: border-color 0.2s, transform 0.2s; }
  .lead-card-hover:hover { border-color: rgba(201,168,76,.15) !important; transform: translateY(-1px); }
  `}</style>
  </div>
  );
}

export default function App() {
  return <GlobalProvider><AppLayout /></GlobalProvider>;
}
