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
3. VALIDAR ENCAJE: "Quizás acerté. En general [su situación] trae [problema]. ¿Te sirve si te muestro en 15min?"
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

  // Parche para evitar bucles de estado infinitos
  useEffect(() => { if (profile) storage.set(wsKey(activeWsId, "profile"), profile); }, [profile, activeWsId]);
  useEffect(() => { if (leads && leads.length > 0) storage.set(wsKey(activeWsId, "leads"), leads); }, [leads, activeWsId]);
  useEffect(() => { if (templates) storage.set(wsKey(activeWsId, "templates"), templates); }, [templates, activeWsId]);
  useEffect(() => { if (cadences) storage.set(wsKey(activeWsId, "cadences"), cadences); }, [cadences, activeWsId]);
  useEffect(() => { if (inbox) storage.set(wsKey(activeWsId, "inbox"), inbox); }, [inbox, activeWsId]);
  useEffect(() => { if (workspaces && workspaces.length > 0) storage.set("closer_workspaces", workspaces); }, [workspaces]);
  useEffect(() => { storage.set("closer_active_ws", activeWsId); }, [activeWsId]);

  const switchWorkspace = useCallback((newId) => {
    setActiveWsId(newId);
    const nextProfile = storage.get(wsKey(newId, "profile"), null);
    const nextLeads = storage.get(wsKey(newId, "leads"), []);
    const nextTemplates = storage.get(wsKey(newId, "templates"), DEFAULT_TEMPLATES);
    const nextCadences = storage.get(wsKey(newId, "cadences"), DEFAULT_CADENCES);
    const nextInbox = storage.get(wsKey(newId, "inbox"), []);

    setProfile(nextProfile);
    setLeads(nextLeads.length ? nextLeads : MOCK_LEADS);
    setTemplates(nextTemplates);
    setCadences(nextCadences);
    setInbox(nextInbox);
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
  const runRes = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${token}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...inputParams, maxItems: 10 }), });
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
  mapResults: (items, actor) => items.map((item) => ({ name: item.fullName || item.name || item.username || item.displayName || "Sin nombre", role: item.headline || item.jobTitle || item.bio || "Sin rol", source: actor.source, data: item.profileUrl || item.url || item.text || item.email || JSON.stringify(item).slice(0, 120), email: item.email || item.emails?.[0] || "", captureMethod: actor.label, warmSignal: actor.warmSignal, score: actor.score, })),
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

  const generateOutreach = useCallback((ctx, platform) => call(() => aiService.call(`Sos un Growth Operator B2B experto en prospección no invasiva. ${base}\n${HUMAN_WRITING_RULES}\nAPLICÁ el test del respeto en cada mensaje. Usá la estructura de 4 pasos de Félix Fernández.\nDEVUELVE JSON: { "score": 8, "leadMagnet": "qué ofrecer como CTA mínima (no pedir call larga)", "msg1": "APERTURA: observación específica del prospecto + pregunta abierta de cómo lo manejan (max 60 palabras)", "msg2": "follow-up 48hs: validar encaje si respondió, o recordatorio suave si no (max 50 palabras)", "msg3": "breakup empático: sin presión, dejando puerta abierta (max 40 palabras)" }`, `Plataforma: ${platform}\nContexto del lead: ${ctx}`, profile?.apiKey)), [call, profile, base]);
  const analyzeReply = useCallback((ctx, reply) => call(() => aiService.call(`Analiza la objeción B2B con inteligencia emocional. ${base}\n${HUMAN_WRITING_RULES}\nDEVUELVE JSON: { "intent": "tipo de objeción o señal detectada", "advice": "táctica concreta para el setter", "suggestedReply": "respuesta humana < 60 palabras", "riskLevel": "alta|media|baja" }`, `Contexto del lead: ${ctx}\nRespuesta recibida: "${reply}"`, profile?.apiKey)), [call, profile, base]);
  const generateIcebreaker = useCallback((info) => call(() => aiService.call(`Sos experto en social selling B2B hiperpersonalizado. ${base}\n${HUMAN_WRITING_RULES}\nTÉCNICA FÉLIX: el primer mensaje debe partir de una observación MUY específica y real del prospecto (algo que viste en su perfil, contenido o empresa), no de tu producto. Aplicá el test del respeto.\nDEVUELVE JSON: { "hook": "observación específica real del prospecto (qué viste exactamente)", "context": "conexión entre esa observación y una tendencia de su sector/mercado", "opener": "mensaje completo siguiendo estructura Félix: observación → insight de mercado → 1 sola pregunta (max 75 palabras)", "tip": "qué canal y momento usar para que no suene a spam" }`, `Info del lead: ${info}`, profile?.apiKey)), [call, profile, base]);
  const qualifyLead = useCallback((info) => call(() => aiService.call(`Sos experto en calificación BANT para high-ticket B2B. ${base}\nDEVUELVE JSON: { "score": 8, "bant": { "budget": "...", "authority": "...", "need": "...", "timeline": "..." }, "redFlags": ["..."], "nextAction": "acción concreta en 24hs", "priority": "alta|media|baja", "recommendedPlatform": "LinkedIn DM|WhatsApp|Email Frío" }`, `Info del lead: ${info}`, profile?.apiKey)), [call, profile, base]);
  const generateNoShowReminder = useCallback((leadName, callTime, platform) => call(() => aiService.call(`Generá mensajes de confirmación y recordatorio para evitar no-shows en calls de ventas B2B. ${base}\n${HUMAN_WRITING_RULES}\nDEVUELVE JSON: { "reminder24h": "mensaje de recordatorio 24hs antes (< 50 palabras)", "reminder1h": "mensaje 1 hora antes muy corto (< 30 palabras)", "postNoShow": "mensaje si no se presentó sin avisar (empático, no agresivo)" }`, `Lead: ${leadName}\nHorario de call: ${callTime}\nPlataforma: ${platform}`, profile?.apiKey)), [call, profile, base]);
  const generateCadenceStep = useCallback((leadCtx, step, previousMessages) => call(() => aiService.call(`Sos un Growth Operator B2B experto en cadencias multicanal de alto ticket.\n${base}\n${HUMAN_WRITING_RULES}\nDEVUELVE JSON: { "subject": "asunto si es email (null si no aplica)", "message": "mensaje listo para enviar < 80 palabras", "tip": "consejo táctico de timing específico para este canal en este día de la secuencia" }`, `Lead: ${leadCtx}\nDía ${step.day} de la cadencia\nCanal: ${step.channel}\nObjetivo de este paso: ${step.action}\nMensajes anteriores enviados: ${previousMessages || "ninguno todavía"}`, profile?.apiKey)), [call, profile, base]);
  const qualifyGate = useCallback((answers) => call(() => aiService.call(`Sos experto en calificación BANT para high-ticket. Analiza las respuestas del formulario de pre-calificación.\n${base}\nDEVUELVE JSON: { "qualified": true|false, "score": 8, "reason": "por qué sí/no califica", "bant": { "budget": "análisis", "authority": "análisis", "need": "análisis", "timeline": "análisis" }, "recommendedAction": "qué hacer en las próximas 2hs", "redFlags": ["..."] }`, `Respuestas del formulario de pre-calificación:\n${Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join("\n")}`, profile?.apiKey)), [call, profile, base]);
  const generateCallScript = useCallback((lead) => call(() => aiService.call(`Sos un closer B2B experto en ventas consultivas de alto ticket. ${base}\n${HUMAN_WRITING_RULES}\nDEVUELVE JSON: { "opener": "cómo abrir los primeros 30 segundos (no genérico)", "situationQ": "pregunta de situación para entender el contexto", "problemQ": "pregunta que expone el problema real", "implicationQ": "pregunta que amplifica las consecuencias", "needQ": "pregunta que hace que el lead se venda solo", "bridge": "cómo transicionar de diagnóstico a propuesta en 2 oraciones", "pitch": "propuesta de valor en menos de 60 segundos personalizada para este lead", "closingQ": "pregunta de cierre directa sin presión", "objectionHandlers": { "precio": "respuesta", "tiempo": "respuesta", "necesito_pensarlo": "respuesta" } }`, `Lead: ${lead.name} (${lead.role})\nOrigen: ${lead.origin || "outbound"}\nDolor identificado: ${lead.handoff?.painPoints || "No especificado"}\nPresupuesto: ${lead.handoff?.budget || "No especificado"}\nTimeline: ${lead.handoff?.timeline || "No especificado"}\nContexto previo: ${lead.handoff?.context || lead.data}\nScore: ${lead.score}/10`, profile?.apiKey)), [call, profile, base]);
  const handleObjection = useCallback((objection, leadCtx) => call(() => aiService.call(`Sos un closer B2B experto en manejo de objeciones para ventas high-ticket. ${base}\n${HUMAN_WRITING_RULES}\nDEVUELVE JSON: { "type": "tipo real de objeción detrás de lo que dijeron", "root": "causa raíz psicológica real de esta objeción", "response": "respuesta directa < 60 palabras que valida y redirige", "followUp": "pregunta para continuar la conversación tras manejar la objeción", "riskLevel": "alta|media|baja", "tip": "táctica específica de cierre para este perfil" }`, `Objeción recibida: "${objection}"\nContexto del lead: ${leadCtx}`, profile?.apiKey)), [call, profile, base]);
  const generateAdsResponse = useCallback((lead) => call(() => aiService.call(`Sos un setter experto en respuesta inmediata a leads de publicidad pagada. La velocidad es crítica: responder en menos de 5 minutos aumenta la conversión 3x. ${base}\n${HUMAN_WRITING_RULES}\nDEVUELVE JSON: { "immediateMsg": "primer mensaje a enviar en los próximos 5 minutos (ultra corto, confirmar interés)", "qualifyMsg": "segundo mensaje con 2 preguntas de calificación rápida", "callBookMsg": "tercer mensaje para agendar call (con link o propuesta de horario)", "urgencyTip": "por qué responder ahora y no en 1 hora" }`, `Lead de ads: ${lead.name} (${lead.role})\nCampaña: ${lead.adCampaign || "No especificada"}\nFuente: ${lead.source}\nContexto: ${lead.data}`, profile?.apiKey)), [call, profile, base]);
  const generate5ActSequence = useCallback((leadCtx, platform) => call(() => aiService.call(`Sos setter B2B. 5 ACTOS: A1=Reciprocidad específica max40p. A2=Ego up+gap max30p. A3=CTA mínima costo cero max20p. A4=2-3 preguntas SPIN de implicación (consecuencias, no el problema). A5=Solución con placeholder [DOLOR_QUE_EL_NOMBRO]\nDEVUELVE JSON: {"act1":"","act2":"","act3":"","act4_questions":["","",""],"act4_intro":"","act5":"con [DOLOR_QUE_EL_NOMBRO]","act5_anchors":["precio","tiempo","visibilidad"],"painSignals":["",""],"redFlags":[""]}`, `Lead: ${leadCtx}\nPlataforma: ${platform}`, profile?.apiKey)), [call, profile, base]);

  return { generateOutreach, analyzeReply, generateIcebreaker, qualifyLead, generateNoShowReminder, generateCadenceStep, qualifyGate, generateCallScript, handleObjection, generateAdsResponse, generate5ActSequence, isProcessing, error };
}

const T = { gold: "#C9A84C", goldMuted: "rgba(201,168,76,.15)", goldBorder: "rgba(201,168,76,.25)", navy: "#0A0F1E", navySurface: "#0D1424", surface: "rgba(255,255,255,.03)", surfaceHover: "rgba(255,255,255,.055)", border: "rgba(255,255,255,.07)", borderHover: "rgba(201,168,76,.3)", emerald: "#10b981", emeraldMuted: "rgba(16,185,129,.12)" };
const FM = "'DM Mono',monospace";
const FS = "'DM Sans',sans-serif";
const FP = "'Playfair Display',serif";

function Toast({ message, type }) {
  const c = { success: "border-[rgba(201,168,76,.3)] bg-[rgba(201,168,76,.06)] text-[#C9A84C]", error: "border-red-500/30 bg-red-500/5 text-red-400", info: "border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.04)] text-zinc-300", warn: "border-amber-500/30 bg-amber-500/5 text-amber-400" };
  const icons = { success: "◆", error: "✕", info: "◈", warn: "△" };
  return (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-2xl shadow-2xl text-xs font-medium animate-slideUp max-w-xs tracking-wide ${c[type] || c.info}`}>
  <span className="opacity-60">{icons[type] || "◈"}</span>{message}
  </div>
  );
}

function Badge({ children, color = "zinc", glow = false }) {
  const c = { zinc: "bg-white/5 text-zinc-400 border-white/10", emerald: `bg-emerald-500/10 text-emerald-400 border-emerald-500/20${glow ? " shadow-[0_0_10px_rgba(16,185,129,.2)]" : ""}`, gold: `bg-[rgba(201,168,76,.1)] text-[#C9A84C] border-[rgba(201,168,76,.25)]${glow ? " shadow-[0_0_10px_rgba(201,168,76,.15)]" : ""}`, blue: "bg-blue-500/8 text-blue-400 border-blue-500/15", purple: "bg-purple-500/8 text-purple-400 border-purple-500/15", amber: "bg-amber-500/8 text-amber-400 border-amber-500/15", red: "bg-red-500/8 text-red-400 border-red-500/15" };
  return <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border tracking-wider uppercase ${c[color]}`} style={{fontFamily:FM}}>{children}</span>;
}

function Btn({ children, onClick, disabled, variant = "primary", size = "md", className = "" }) {
  const v = { primary: "text-[#0A0F1E] font-bold border border-[rgba(201,168,76,.6)] shadow-[0_0_20px_rgba(201,168,76,.15),inset_0_1px_0_rgba(255,255,255,.1)]", secondary: "bg-white/5 hover:bg-white/8 text-zinc-300 border border-white/8 hover:border-white/15", ghost: "bg-transparent hover:bg-white/4 text-zinc-400 hover:text-zinc-200", danger: "bg-red-500/8 hover:bg-red-500/15 text-red-400 border border-red-500/15", amber: "bg-amber-500/8 hover:bg-amber-500/15 text-amber-400 border border-amber-500/15" };
  const s = { xs: "text-[10px] px-2.5 py-1", sm: "text-xs px-3.5 py-1.5", md: "text-sm px-5 py-2.5", lg: "text-sm px-7 py-3.5" };
  return <button onClick={onClick} disabled={disabled} className={`rounded-lg transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed tracking-wide ${v[variant]} ${s[size]} ${className}`} style={variant === "primary" ? { background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)", fontFamily:FS } : { fontFamily:FS }}>{children}</button>;
}

function Field({ label, value, onChange, placeholder, type = "text", multiline = false, hint }) {
  const cls = "w-full border rounded-lg px-3.5 py-2.5 text-sm placeholder-zinc-700 outline-none transition-all duration-200";
  const style = { background: "rgba(255,255,255,.02)", borderColor: "rgba(255,255,255,.07)", color: "#e4e4e7", fontFamily:FS };
  return (
  <div className="space-y-1.5">
  {label && <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.12em]" style={{fontFamily:FM}}>{label}</label>}
  {multiline ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={`${cls} focus:border-[rgba(201,168,76,.4)] focus:ring-1 focus:ring-[rgba(201,168,76,.15)] resize-none`} style={style} /> : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${cls} focus:border-[rgba(201,168,76,.4)] focus:ring-1 focus:ring-[rgba(201,168,76,.15)]`} style={style} />}
  {hint && <p className="text-[10px] text-zinc-600 leading-relaxed">{hint}</p>}
  </div>
  );
}

function Spinner({ label = "Procesando..." }) {
  return (
  <div className="flex items-center gap-2.5" style={{color:T.gold}}>
  <div className="w-3.5 h-3.5 border border-[rgba(201,168,76,.3)] border-t-[#C9A84C] rounded-full animate-spin" />
  <span className="text-xs tracking-wider" style={{fontFamily:FM}}>{label}</span>
  </div>
  );
}

function ErrBox({ message }) {
  if (!message) return null;
  return (
  <div className="border border-red-500/15 rounded-lg px-3.5 py-3 text-xs text-red-400 flex items-start gap-2" style={{background:"rgba(239,68,68,.04)",fontFamily:FS}}>
  <span className="opacity-60 mt-0.5">△</span><span className="leading-relaxed">{message}</span>
  </div>
  );
}

function ScoreBar({ score }) {
  const isHigh = score >= 9; const isMid = score >= 7;
  const barColor = isHigh ? "linear-gradient(90deg, #10b981, #34d399)" : isMid ? "linear-gradient(90deg, #C9A84C, #E8C96A)" : "linear-gradient(90deg, #52525b, #71717a)";
  return (
  <div className="flex items-center gap-2.5">
  <div className="flex-1 rounded-full h-px overflow-hidden" style={{background:"rgba(255,255,255,.06)"}}>
  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score * 10}%`, background: barColor }} />
  </div>
  <span className="text-[10px] font-medium w-8 text-right" style={{color:isHigh ? T.emerald :isMid ? T.gold :"#71717a",fontFamily:FM}}>{score}/10</span>
  </div>
  );
}

function Modal({ title, onClose, children, size = "md" }) {
  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };
  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(7,10,20,.88)"}} onClick={onClose}>
  <div className={`w-full ${widths[size]} flex flex-col max-h-[90vh] rounded-2xl border shadow-2xl`} style={{background:"linear-gradient(145deg,#0D1424 0%,#080D1A 100%)",borderColor:"rgba(201,168,76,.15)",boxShadow:"0 0 60px rgba(0,0,0,.8),0 0 0 1px rgba(201,168,76,.08)"}} onClick={(e) => e.stopPropagation()}>
  <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{borderColor:"rgba(255,255,255,.05)"}}>
  <h3 className="font-semibold text-zinc-100 text-sm tracking-wide" style={{fontFamily:FP}}>{title}</h3>
  <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 transition-all text-xs">✕</button>
  </div>
  <div className="overflow-y-auto custom-scrollbar flex-1 p-6">{children}</div>
  </div>
  </div>
  );
}

function AntiBanMeter({ platform }) {
  const { activeWsId } = useContext(GlobalContext);
  const used = dailyActions.count(activeWsId, platform);
  const limit = DAILY_LIMITS[platform] || 30;
  const pct = Math.min((used / limit) * 100, 100);
  const isAlert = pct >= 90; const isMid = pct >= 70;
  const barColor = isAlert ? "#ef4444" : isMid ? T.gold : T.emerald;
  return (
  <div className="rounded-lg px-3.5 py-2.5 space-y-1.5 border" style={{background:"rgba(255,255,255,.02)",borderColor:"rgba(255,255,255,.06)"}}>
  <div className="flex items-center justify-between">
  <span className="text-[10px] text-zinc-600 tracking-wider uppercase" style={{fontFamily:FM}}>Cuota diaria · {platform}</span>
  <span className="text-[10px] font-medium" style={{color:barColor,fontFamily:FM}}>{used}/{limit}</span>
  </div>
  <div className="h-px rounded-full overflow-hidden" style={{background:"rgba(255,255,255,.05)"}}><div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: barColor }} /></div>
  {isAlert && <p className="text-[10px] text-red-400 tracking-wide">Límite crítico — pausar para evitar baneo.</p>}
  </div>
  );
}

function HandoffModal({ lead, onSave, onCancel }) {
  const [form, setForm] = useState({ painPoints: lead.handoff?.painPoints || "", decisionMakers: lead.handoff?.decisionMakers || "", timeline: lead.handoff?.timeline || "", budget: lead.handoff?.budget || "", context: lead.handoff?.context || "", callTime: lead.handoff?.callTime || "", callPlatform: lead.handoff?.callPlatform || "Google Meet", });
  const u = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const isValid = form.painPoints && form.decisionMakers && form.timeline;
  return (
  <Modal title="📋 Handoff obligatorio — Traspaso a Call" onClose={onCancel} size="lg">
  <div className="space-y-4">
  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400">Para mover este lead a "Call" necesitás completar el handoff. Esto asegura que el closer tenga todo el contexto para no arruinar el cierre.</div>
  <div className="grid grid-cols-2 gap-3"><Field label="Puntos de dolor identificados *" value={form.painPoints} onChange={u("painPoints")} placeholder="¿Qué problema confesó el lead?" multiline /><Field label="Tomadores de decisión *" value={form.decisionMakers} onChange={u("decisionMakers")} placeholder="¿Quién toma la decisión final?" multiline /></div>
  <div className="grid grid-cols-2 gap-3"><Field label="Timeline / Urgencia *" value={form.timeline} onChange={u("timeline")} placeholder="¿Cuándo quiere resolver esto?" /><Field label="Presupuesto estimado" value={form.budget} onChange={u("budget")} placeholder="Rango que mencionó o estimado" /></div>
  <Field label="Contexto del trato" value={form.context} onChange={u("context")} placeholder="Objeciones anticipadas, qué resonó en la conversación previa..." multiline />
  <div className="grid grid-cols-2 gap-3"><Field label="Fecha y hora de la call" value={form.callTime} onChange={u("callTime")} type="datetime-local" />
  <div className="space-y-1.5"><label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Plataforma de call</label><select value={form.callPlatform} onChange={(e) => setForm((p) => ({ ...p, callPlatform: e.target.value }))} className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 appearance-none">{["Google Meet", "Zoom", "WhatsApp Video", "Teams", "Otro"].map((o) => <option key={o}>{o}</option>)}</select></div></div>
  <div className="flex gap-3 pt-2"><Btn variant="secondary" onClick={onCancel} className="flex-1">Cancelar</Btn><Btn onClick={() => onSave(form)} disabled={!isValid} className="flex-1">✓ Confirmar Handoff → Call</Btn></div>
  </div>
  </Modal>
  );
}

function NoShowPanel({ lead }) {
  const { generateNoShowReminder, isProcessing, error } = useAI();
  const { showToast, activeWsId } = useContext(GlobalContext);
  const [reminders, setReminders] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleGenerate = async () => {
  const callTime = lead.handoff?.callTime ? new Date(lead.handoff.callTime).toLocaleString("es-AR") : "horario acordado";
  const r = await generateNoShowReminder(lead.name, callTime, lead.handoff?.callPlatform || "Meet");
  if (r) setReminders(r);
  };

  const copy = (text, key) => { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000); showToast("Mensaje copiado"); dailyActions.increment(activeWsId, lead.handoff?.callPlatform === "WhatsApp Video" ? "WhatsApp" : "WhatsApp"); };

  if (!lead.handoff?.callTime) return <div className="text-xs text-zinc-500 bg-zinc-950/60 rounded-lg p-3 border border-white/5">Completá el handoff con fecha de call para activar los recordatorios anti-noshow.</div>;

  return (
  <div className="space-y-3">
  <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3"><p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">📅 Call agendada</p><p className="text-xs text-zinc-300">{new Date(lead.handoff.callTime).toLocaleString("es-AR")} via {lead.handoff.callPlatform}</p></div>
  <Btn variant="amber" onClick={handleGenerate} disabled={isProcessing} className="w-full">{isProcessing ? "Generando..." : "🛡 Generar Mensajes Anti-NoShow con IA"}</Btn>
  <ErrBox message={error} />
  {reminders && (
  <div className="space-y-2.5">
  {[["reminder24h", "📅 Recordatorio 24hs antes"], ["reminder1h", "⏰ Recordatorio 1hs antes"], ["postNoShow", "👻 Si no se presentó"]].map(([key, label]) => reminders[key] && (
  <div key={key} className="bg-zinc-950/60 border border-white/5 rounded-xl p-3 space-y-2">
  <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{label}</span><button onClick={() => copy(reminders[key], key)} className="text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors">{copied === key ? "✓ Copiado" : "Copiar"}</button></div>
  <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">{reminders[key]}</p>
  </div>
  ))}
  </div>
  )}
  </div>
  );
}

function LeadDetailModal({ lead, onClose }) {
  const { addNote, updateLead, showToast } = useContext(GlobalContext);
  const { generateIcebreaker, qualifyLead, isProcessing, error } = useAI();
  const [noteText, setNoteText] = useState("");
  const [tab, setTab] = useState("notas");
  const [aiResult, setAiResult] = useState(null);
  const [followUpDate, setFollowUpDate] = useState(lead.followUpDate || "");

  const handleAddNote = () => { if (!noteText.trim()) return; addNote(lead.id, noteText.trim()); setNoteText(""); };
  const handleIcebreaker = async () => { setAiResult(null); const r = await generateIcebreaker(`${lead.name}, ${lead.role}, Fuente: ${lead.source}, Contexto: ${lead.data}, Notas: ${(lead.notes || []).map((n) => n.text).join(", ")}`); if (r) setAiResult({ type: "icebreaker", data: r }); };
  const handleQualify = async () => { setAiResult(null); const r = await qualifyLead(`${lead.name}, ${lead.role}, Fuente: ${lead.source}, Contexto: ${lead.data}, Score actual: ${lead.score}, Notas: ${(lead.notes || []).map((n) => n.text).join(", ")}`); if (r) { setAiResult({ type: "qualify", data: r }); updateLead(lead.id, { score: r.score }); showToast("Score actualizado con IA"); } };
  const handleFollowUp = () => { updateLead(lead.id, { followUpDate }); showToast("Follow-up guardado"); };
  const formatTs = (ts) => new Date(ts).toLocaleDateString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  const tabs = [["notas", "Notas"], ["followup", "Follow-up"], ["noshow", "Anti-NoShow"], ["warm", "Warm"], ["tags", "Tags & ROI"], ["ia", "IA"]];

  return (
  <Modal title={`${lead.name} · ${lead.role}`} onClose={onClose} size="lg">
  <div className="space-y-4">
  <div className="flex flex-wrap gap-2 items-center"><Badge color={lead.warmSignal ? "emerald" : "zinc"} glow={lead.warmSignal}>{lead.warmSignal ? "🔥 WARM" : "COLD"}</Badge><Badge color="blue">{lead.stage}</Badge><Badge color="zinc">{lead.source}</Badge>{lead.email && <Badge color="purple">📧 {lead.email}</Badge>}</div>
  <ScoreBar score={lead.score} />
  {lead.handoff && (
  <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3 space-y-1.5"><p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">✓ Handoff completado</p><div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">{[["Dolor", lead.handoff.painPoints], ["Decisor", lead.handoff.decisionMakers], ["Timeline", lead.handoff.timeline], ["Budget", lead.handoff.budget]].map(([k, v]) => v && (<div key={k}><span className="text-zinc-600">{k}: </span><span className="text-zinc-300">{v}</span></div>))}</div></div>
  )}
  <div className="flex gap-0.5 bg-zinc-950/60 p-1 rounded-lg flex-wrap">{tabs.map(([id, label]) => (<button key={id} onClick={() => setTab(id)} className={`flex-1 min-w-fit text-[10px] py-1.5 px-2 rounded-md font-medium transition-all ${tab === id ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}>{label}</button>))}</div>
  {tab === "notas" && (
  <div className="space-y-3"><div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">{(lead.notes || []).length === 0 ? <p className="text-xs text-zinc-600 text-center py-4">Sin notas aún</p> : [...(lead.notes || [])].reverse().map((n, i) => (<div key={i} className="bg-zinc-950/60 border border-white/5 rounded-lg p-3"><p className="text-xs text-zinc-300 leading-relaxed">{n.text}</p><p className="text-[10px] text-zinc-600 mt-1.5">{formatTs(n.ts)}</p></div>))}</div><div className="flex gap-2"><input value={noteText} onChange={(e) => setNoteText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddNote()} placeholder="Agregar nota... (Enter)" className="flex-1 text-xs bg-zinc-950 border border-white/5 rounded-lg px-3 py-2 text-zinc-200 placeholder-zinc-600 outline-none focus:border-emerald-500/50" /><Btn size="sm" onClick={handleAddNote} disabled={!noteText.trim()}>+</Btn></div></div>
  )}
  {tab === "followup" && (
  <div className="space-y-3"><Field label="Fecha de follow-up" value={followUpDate} onChange={setFollowUpDate} type="date" />{lead.followUpDate && <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-3 text-xs text-amber-400">🗓 Programado: {new Date(lead.followUpDate).toLocaleDateString("es-AR")}</div>}<Btn onClick={handleFollowUp} disabled={!followUpDate} className="w-full">Guardar Follow-up</Btn></div>
  )}
  {tab === "noshow" && <NoShowPanel lead={lead} />}
  {tab === "warm" && <WarmSignalPanel lead={lead} />}
  {tab === "tags" && <TagsRoiPanel lead={lead} />}
  {tab === "ia" && (
  <div className="space-y-3">
  <div className="grid grid-cols-2 gap-2">{[["❄️", "Icebreaker", "Primer mensaje hiperpersonalizado", handleIcebreaker], ["🎯", "Calificar BANT", "Análisis de potencial y prioridad", handleQualify]].map(([icon, title, desc, fn]) => (<button key={title} onClick={fn} disabled={isProcessing} className="bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl p-3 text-left transition-all disabled:opacity-40"><div className="text-xl mb-1">{icon}</div><div className="text-xs font-bold text-zinc-200">{title}</div><div className="text-[10px] text-zinc-500 mt-0.5">{desc}</div></button>))}</div>
  {isProcessing && <div className="flex justify-center py-3"><Spinner /></div>}<ErrBox message={error} />
  {aiResult?.type === "icebreaker" && (
  <div className="space-y-2.5">
  <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3"><p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mb-1">Hook</p><p className="text-xs text-zinc-200 font-medium">"{aiResult.data.hook}"</p></div>
  <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-4 space-y-2"><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">Mensaje completo</p><p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{aiResult.data.opener}</p></div>
  <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-2.5"><p className="text-[10px] text-blue-400">💡 {aiResult.data.tip}</p></div>
  </div>
  )}
  {aiResult?.type === "qualify" && (
  <div className="space-y-2.5">
  <div className="flex items-center gap-2 flex-wrap"><Badge color={aiResult.data.priority === "alta" ? "emerald" : aiResult.data.priority === "media" ? "amber" : "zinc"}>{aiResult.data.priority?.toUpperCase()}</Badge><Badge color="emerald">Score: {aiResult.data.score}/10</Badge>{aiResult.data.recommendedPlatform && <Badge color="blue">→ {aiResult.data.recommendedPlatform}</Badge>}</div>
  <div className="grid grid-cols-2 gap-2">{Object.entries(aiResult.data.bant || {}).map(([k, v]) => (<div key={k} className="bg-zinc-950/60 border border-white/5 rounded-lg p-2.5"><p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-0.5">{k}</p><p className="text-[11px] text-zinc-300">{v}</p></div>))}</div>
  {aiResult.data.redFlags?.length > 0 && (<div className="bg-red-500/5 border border-red-500/15 rounded-lg p-2.5"><p className="text-[10px] text-red-400 font-bold mb-1">⚠ Red Flags</p>{aiResult.data.redFlags.map((f, i) => <p key={i} className="text-[11px] text-zinc-400">• {f}</p>)}</div>)}
  <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-2.5"><p className="text-[10px] text-emerald-400 font-bold mb-0.5">Siguiente acción en 24hs</p><p className="text-[11px] text-zinc-300">{aiResult.data.nextAction}</p></div>
  </div>
  )}
  </div>
  )}
  </div>
  </Modal>
  );
}

function LeadCard({ lead, onMove, onDelete, onOpen }) {
  const currentIdx = STAGES.indexOf(lead.stage);
  const today = new Date().toDateString();
  const hasFollowUp = lead.followUpDate && new Date(lead.followUpDate) >= new Date(today);
  const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date(today);
  const hasHandoff = !!lead.handoff;
  const isWarm = lead.warmSignal;

  return (
  <div className="lead-card-hover group rounded-xl border cursor-pointer flex flex-col gap-3 p-4" style={{background:"linear-gradient(145deg,rgba(255,255,255,.028) 0%,rgba(255,255,255,.012) 100%)",borderColor:isWarm ? "rgba(201,168,76,.18)" :"rgba(255,255,255,.06)"}} onClick={() => onOpen(lead)}>
  <div className="flex justify-between items-start gap-2"><div className="min-w-0"><h4 className="text-sm font-semibold text-zinc-100 truncate" style={{fontFamily:FS,letterSpacing:"0.01em"}}>{lead.name}</h4><p className="text-[10px] text-zinc-600 truncate mt-0.5">{lead.role}</p></div>{isWarm ? <Badge color="gold" glow>WARM</Badge> : <span className="text-[10px] font-medium" style={{color:"#52525b",fontFamily:FM}}>{lead.score}/10</span>}</div>
  <ScoreBar score={lead.score} />
  <div className="flex flex-wrap gap-1.5"><Badge color="blue">{lead.source}</Badge>{lead.origin === "ads" && <Badge color="purple">ADS</Badge>}{lead.origin === "inbound" && <Badge color="gold">INBOUND</Badge>}{lead.captureMethod && lead.captureMethod !== lead.source && <Badge color="zinc">{lead.captureMethod}</Badge>}{(lead.notes || []).length > 0 && <Badge color="zinc">{lead.notes.length} nota{lead.notes.length > 1 ? "s" : ""}</Badge>}{hasHandoff && <Badge color="emerald">Handoff ✓</Badge>}</div>
  <div className="text-[10px] text-zinc-600 px-3 py-2 rounded-lg truncate" style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.04)",fontFamily:FM}}>{lead.data?.startsWith("http") ? lead.data : lead.data}</div>
  {(hasFollowUp || isOverdue) && (<div className="text-[10px] px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5" style={isOverdue ? { background: "rgba(239,68,68,.04)", borderColor: "rgba(239,68,68,.12)", color: "#f87171" } : { background: "rgba(201,168,76,.05)", borderColor: T.goldBorder, color: T.gold }}>{isOverdue ? "△ Vencido:" : "◈"} {new Date(lead.followUpDate).toLocaleDateString("es-AR")}</div>)}
  <div className="flex items-center justify-between pt-1.5 border-t" style={{borderColor:"rgba(255,255,255,.04)"}} onClick={(e) => e.stopPropagation()}><button onClick={(e) => { e.stopPropagation(); onMove(lead.id, currentIdx - 1); }} disabled={currentIdx === 0} className="text-zinc-700 hover:text-zinc-400 disabled:opacity-0 transition-colors text-xs px-1 py-0.5">←</button><button onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }} className="opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-red-400 transition-all text-[10px] p-1">✕</button><button onClick={(e) => { e.stopPropagation(); onMove(lead.id, currentIdx + 1); }} disabled={currentIdx === STAGES.length - 1} className="text-zinc-700 hover:text-zinc-400 disabled:opacity-0 transition-colors text-xs px-1 py-0.5">→</button></div>
  </div>
  );
}

function DailyMission({ onGoToPipeline }) {
  const { leads } = useContext(GlobalContext);
  const today = new Date().toDateString();
  const priority = useMemo(() => {
  return leads.filter((l) => {
  const dueToday = l.followUpDate && new Date(l.followUpDate).toDateString() === today;
  const overdue = l.followUpDate && new Date(l.followUpDate) < new Date(today);
  const warmHigh = l.warmSignal && l.score >= 8 && l.stage !== "Cerrado";
  const callToday = l.stage === "Call" && l.handoff?.callTime && new Date(l.handoff.callTime).toDateString() === today;
  return dueToday || overdue || warmHigh || callToday;
  }).sort((a, b) => b.score - a.score).slice(0, 6);
  }, [leads, today]);

  const urgencyLabel = (l) => {
  if (l.stage === "Call" && l.handoff?.callTime && new Date(l.handoff.callTime).toDateString() === today) return {label:"📞 Call HOY",color:"text-amber-400 bg-amber-500/10 border-amber-500/20"};
  if (l.followUpDate && new Date(l.followUpDate) < new Date(today)) return {label:"⚠ Vencido",color:"text-red-400 bg-red-500/10 border-red-500/20"};
  if (l.followUpDate && new Date(l.followUpDate).toDateString() === today) return {label:"🗓 Hoy",color:"text-amber-400 bg-amber-500/10 border-amber-500/20"};
  if (l.warmSignal && l.score >= 9) return {label:"🔥 Warm",color:"text-emerald-400 bg-emerald-500/10 border-emerald-500/20"};
  return {label:"⚡ Warm",color:"text-blue-400 bg-blue-500/10 border-blue-500/20"};
  };

  if (priority.length === 0) return (<div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 text-center"><p className="text-emerald-400 font-bold text-sm">✓ Sin tareas urgentes hoy</p><p className="text-xs text-zinc-500 mt-1">Agregá leads o programá follow-ups para el próximo ciclo.</p></div>);

  return (
  <div className="space-y-2.5">
  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Acción requerida hoy ({priority.length})</p>
  {priority.map((l) => {
  const urg = urgencyLabel(l);
  return (
  <button key={l.id} onClick={onGoToPipeline} className="w-full bg-zinc-900/60 hover:bg-zinc-800/60 border border-white/5 hover:border-white/10 rounded-xl p-3 text-left transition-all flex items-center gap-3">
  <div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><span className="text-sm font-semibold text-zinc-100">{l.name}</span><span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${urg.color}`}>{urg.label}</span></div><p className="text-[11px] text-zinc-500 truncate">{l.role} · {l.stage}</p></div>
  <ScoreBar score={l.score} />
  </button>
  );
  })}
  </div>
  );
}

function Dashboard({ setActiveTab, onStartSession }) {
  const { leads } = useContext(GlobalContext);

  const stats = useMemo(() => {
  const total = leads.length;
  const warm = leads.filter((l) => l.warmSignal).length;
  const closed = leads.filter((l) => l.stage === "Cerrado").length;
  const calls = leads.filter((l) => l.stage === "Call").length;
  const convRate = total > 0 ? ((closed / total) * 100).toFixed(0) : 0;
  const avgScore = total > 0 ? (leads.reduce((a, l) => a + (l.score || 0), 0) / total).toFixed(1) : 0;
  const bySource = leads.reduce((acc, l) => { acc[l.source] = (acc[l.source] || 0) + 1; return acc; }, {});
  const byStage = STAGES.map((s) => ({ stage: s, count: leads.filter((l) => l.stage === s).length }));
  const today = new Date().toDateString();
  const overdueFollowUps = leads.filter((l) => l.followUpDate && new Date(l.followUpDate) < new Date(today));
  const callsToday = leads.filter((l) => l.handoff?.callTime && new Date(l.handoff.callTime).toDateString() === today);
  const pipelineValue = leads.filter(l => l.stage !== "Cerrado").reduce((a, l) => a + (l.ticket || 0), 0);
  const closedValue  = leads.filter(l => l.stage === "Cerrado").reduce((a, l) => a + (l.ticket || 0), 0);
  const avgTicket = total > 0 ? Math.round(leads.reduce((a, l) => a + (l.ticket || 0), 0) / total) : 0;
  const allTags = leads.flatMap(l => l.tags || []);
  const byTag = allTags.reduce((acc, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});
  const recentActivity = leads.flatMap(l => (l.activityLog || []).map(a => ({ ...a, leadName: l.name, leadId: l.id }))).sort((a, b) => b.ts - a.ts).slice(0, 8);
  const sourceValue = leads.reduce((acc, l) => { if (!acc[l.source]) acc[l.source] = { total: 0, count: 0 }; acc[l.source].total += (l.ticket || 0); acc[l.source].count += 1; return acc; }, {});
  return { total, warm, closed, calls, convRate, avgScore, bySource, byStage, overdueFollowUps, callsToday, pipelineValue, closedValue, avgTicket, byTag, recentActivity, sourceValue };
  }, [leads]);

  const StatCard = ({ label, value, sub, color = "#e4e4e7" }) => (
  <div className="stat-card rounded-xl p-5 border" style={{background:"linear-gradient(145deg,rgba(255,255,255,.025) 0%,rgba(255,255,255,.01) 100%)",borderColor:"rgba(255,255,255,.07)"}}>
  <p className="text-[9px] text-zinc-600 uppercase tracking-[0.18em] mb-2" style={{fontFamily:FM}}>{label}</p>
  <p className="text-3xl font-black" style={{color,fontFamily:FP,letterSpacing:"-0.02em"}}>{value}</p>
  {sub && <p className="text-[10px] text-zinc-700 mt-1 tracking-wide">{sub}</p>}
  </div>
  );

  return (
  <div className="h-full overflow-y-auto custom-scrollbar">
  <div className="p-7 space-y-6 max-w-4xl">
  <div className="flex items-center justify-between">
  <div><h2 className="text-2xl font-bold text-white" style={{fontFamily:FP,letterSpacing:"-0.01em"}}>Dashboard</h2><p className="text-xs text-zinc-600 mt-1 tracking-wider capitalize" style={{fontFamily:FM}}>{new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</p></div>
  {stats.callsToday.length > 0 && (<div className="rounded-xl px-5 py-3 text-center" style={{ background: "rgba(201,168,76,.06)", border: `1px solid ${T.goldBorder}` }}><p className="font-black text-xl" style={{color:T.gold,fontFamily:FP}}>{stats.callsToday.length}</p><p className="text-[9px] tracking-[0.15em] uppercase mt-0.5" style={{color:"rgba(201,168,76,.5)",fontFamily:FM}}>Call{stats.callsToday.length > 1 ? "s" : ""} hoy</p></div>)}
  </div>

  <WorkflowBar leads={leads} setActiveTab={setActiveTab} onStartSession={onStartSession} />

  <div className="rounded-xl p-5 border" style={{background:"rgba(255,255,255,.02)",borderColor:"rgba(255,255,255,.06)"}}>
  <div className="flex items-center gap-2.5 mb-4"><div className="w-1.5 h-1.5 rounded-full" style={{background:T.gold}} /><p className="text-xs font-semibold text-zinc-300 tracking-wide uppercase" style={{fontFamily:FM,letterSpacing:"0.12em"}}>Misión del día</p></div>
  <DailyMission onGoToPipeline={() => setActiveTab("pipeline")} />
  </div>

  <div className="grid grid-cols-3 gap-3">
  <StatCard label="Valor pipeline activo" value={`$${stats.pipelineValue.toLocaleString()}`} color={T.gold} sub="leads no cerrados" />
  <StatCard label="Revenue cerrado" value={`$${stats.closedValue.toLocaleString()}`} color={T.emerald} sub={`${stats.closed} clientes`} />
  <StatCard label="Ticket promedio" value={`$${stats.avgTicket.toLocaleString()}`} color="#a78bfa" sub="por lead" />
  </div>

  <div className="grid grid-cols-3 gap-3">
  <StatCard label="Total Leads" value={stats.total} />
  <StatCard label="Tasa de Cierre" value={`${stats.convRate}%`} color={T.gold} sub={`${stats.closed} cerrados`} />
  <StatCard label="Score Promedio" value={stats.avgScore} color="#60a5fa" />
  </div>

  <div className="grid grid-cols-2 gap-4">
  <div className="rounded-xl p-5 border space-y-3" style={{background:"rgba(255,255,255,.02)",borderColor:"rgba(255,255,255,.06)"}}>
  <p className="text-[9px] text-zinc-600 uppercase tracking-[0.18em]" style={{fontFamily:FM}}>Embudo</p>
  {stats.byStage.map(({ stage, count }) => {
  const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
  const sc = STAGE_COLORS[stage];
  return (
  <div key={stage} className="flex items-center gap-2.5">
  <div className={`w-16 text-[10px] font-medium flex-shrink-0 ${sc.text}`} style={{fontFamily:FM}}>{stage}</div>
  <div className="flex-1 rounded-full h-px overflow-hidden" style={{background:"rgba(255,255,255,.05)"}}><div className={`h-full rounded-full ${sc.dot} transition-all duration-700`} style={{ width: `${pct}%` }} /></div>
  <span className="text-[9px] text-zinc-600 w-4 text-right" style={{fontFamily:FM}}>{count}</span>
  </div>
  );
  })}
  </div>

  <div className="rounded-xl p-5 border space-y-3" style={{background:"rgba(255,255,255,.02)",borderColor:"rgba(255,255,255,.06)"}}>
  <p className="text-[9px] text-zinc-600 uppercase tracking-[0.18em]" style={{fontFamily:FM}}>Fuentes · leads / valor avg</p>
  {Object.entries(stats.bySource).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([src, count]) => {
  const sv = stats.sourceValue[src] || { total: 0, count: 0 };
  const avgVal = sv.count > 0 ? Math.round(sv.total / sv.count) : 0;
  return (
  <div key={src} className="flex items-center gap-2.5">
  <div className="w-24 text-[10px] text-zinc-500 truncate flex-shrink-0" style={{fontFamily:FS}}>{src}</div>
  <div className="flex-1 rounded-full h-px overflow-hidden" style={{background:"rgba(255,255,255,.05)"}}><div className="h-full rounded-full transition-all duration-700" style={{ width: `${(count / Math.max(...Object.values(stats.bySource))) * 100}%`, background: `linear-gradient(90deg, ${T.gold}, #E8C96A)` }} /></div>
  <span className="text-[9px] text-zinc-600 w-4 text-right" style={{fontFamily:FM}}>{count}</span>
  {avgVal > 0 && <span className="text-[9px] w-12 text-right flex-shrink-0" style={{color:T.gold,fontFamily:FM}}>${avgVal}</span>}
  </div>
  );
  })}
  </div>
  </div>

  {Object.keys(stats.byTag).length > 0 && (
  <div className="rounded-xl p-5 border" style={{background:"rgba(255,255,255,.02)",borderColor:"rgba(255,255,255,.06)"}}>
  <p className="text-[9px] text-zinc-600 uppercase tracking-[0.18em] mb-3" style={{fontFamily:FM}}>Tags más frecuentes</p>
  <div className="flex flex-wrap gap-2">
  {Object.entries(stats.byTag).sort((a, b) => b[1] - a[1]).map(([tag, count]) => (
  <div key={tag} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border" style={{background:"rgba(201,168,76,.06)",borderColor:"rgba(201,168,76,.15)"}}><span className="text-[10px] font-medium" style={{color:T.gold,fontFamily:FS}}>{tag}</span><span className="text-[9px]" style={{color:"rgba(201,168,76,.4)",fontFamily:FM}}>{count}</span></div>
  ))}
  </div>
  </div>
  )}

  {stats.recentActivity.length > 0 && (
  <div className="rounded-xl p-5 border space-y-2" style={{background:"rgba(255,255,255,.02)",borderColor:"rgba(255,255,255,.06)"}}>
  <p className="text-[9px] text-zinc-600 uppercase tracking-[0.18em] mb-1" style={{fontFamily:FM}}>Actividad reciente</p>
  {stats.recentActivity.map((a, i) => (
  <div key={i} className="flex items-center justify-between gap-3">
  <div className="flex items-center gap-2.5 min-w-0"><div className="w-1 h-1 rounded-full flex-shrink-0" style={{background:"rgba(201,168,76,.5)"}} /><span className="text-[11px] text-zinc-500 truncate">{a.leadName}</span><span className="text-[11px] text-zinc-700 truncate">· {a.action}</span></div>
  <span className="text-[9px] flex-shrink-0" style={{color:"rgba(113,113,122,.5)",fontFamily:FM}}>{new Date(a.ts).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}</span>
  </div>
  ))}
  </div>
  )}

  {stats.overdueFollowUps.length > 0 && (
  <div className="rounded-xl p-4 space-y-2.5 border" style={{background:"rgba(239,68,68,.03)",borderColor:"rgba(239,68,68,.1)"}}>
  <p className="text-[9px] text-red-500 uppercase tracking-[0.18em]" style={{fontFamily:FM}}>△ Follow-ups vencidos</p>
  {stats.overdueFollowUps.map((l) => (
  <div key={l.id} className="flex items-center justify-between text-xs"><span className="text-zinc-400">{l.name} <span className="text-zinc-700">· {l.role}</span></span><span className="text-red-500 text-[10px]" style={{fontFamily:FM}}>{new Date(l.followUpDate).toLocaleDateString("es-AR")}</span></div>
  ))}
  </div>
  )}
  </div>
  </div>
  );
}

function Pipeline({ setActiveTab, onStartSession }) {
  const { leads, updateLeadStage, updateLead, deleteLead } = useContext(GlobalContext);
  const [selectedLead, setSelectedLead] = useState(null);
  const [handoffTarget, setHandoffTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [filterWarm, setFilterWarm] = useState(false);
  const [filterSource, setFilterSource] = useState("Todos");
  const [filterTag, setFilterTag] = useState("Todos");
  const [viewMode, setViewMode] = useState("kanban");

  const sources = useMemo(() => ["Todos", ...new Set(leads.map((l) => l.source))], [leads]);
  const allTags = useMemo(() => ["Todos", ...new Set(leads.flatMap(l => l.tags || []))], [leads]);

  const filtered = useMemo(() => leads.filter((l) => {
  const ms = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.role.toLowerCase().includes(search.toLowerCase());
  const mt = filterTag === "Todos" || (l.tags || []).includes(filterTag);
  return ms && (!filterWarm || l.warmSignal) && (filterSource === "Todos" || l.source === filterSource) && mt;
  }), [leads, search, filterWarm, filterSource, filterTag]);

  const handleMove = (id, newIdx) => {
  if (newIdx < 0 || newIdx >= STAGES.length) return;
  const newStage = STAGES[newIdx];
  if (newStage === "Call") {
  const lead = leads.find((l) => l.id === id);
  if (!lead?.handoff) { setHandoffTarget({ id, targetIdx: newIdx }); return; }
  }
  updateLeadStage(id, newStage);
  };

  const handleHandoffSave = (handoffData) => {
  if (!handoffTarget) return;
  updateLead(handoffTarget.id, { handoff: handoffData, stage: STAGES[handoffTarget.targetIdx] });
  setHandoffTarget(null);
  };

  const freshLead = selectedLead ? leads.find((l) => l.id === selectedLead.id) || selectedLead : null;

  const exportCSV = () => {
  const h = ["Nombre", "Rol", "Fuente", "Email", "Stage", "Score", "Warm", "Método", "Contexto", "Notas", "Follow-up", "Handoff-Dolor", "Handoff-Call"];
  const rows = leads.map((l) => [l.name, l.role, l.source, l.email || "", l.stage, l.score, l.warmSignal ? "Sí" : "No", l.captureMethod || "", (l.data || "").replace(/,/g, ";"), (l.notes || []).map((n) => n.text).join("|").replace(/,/g, ";"), l.followUpDate || "", (l.handoff?.painPoints || "").replace(/,/g, ";"), l.handoff?.callTime || ""].join(","));
  const blob = new Blob([[h.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `closerAI_${new Date().toISOString().split("T")[0]}.csv`; a.click();
  };

  return (
  <div className="h-full flex flex-col">
  <div className="px-7 pt-6 pb-4 border-b flex-shrink-0" style={{borderColor:"rgba(255,255,255,.05)"}}>
  <div className="flex items-center justify-between">
  <div><h2 className="text-2xl font-bold text-white" style={{fontFamily:FP,letterSpacing:"-0.01em"}}>CRM Pipeline</h2><p className="text-[10px] text-zinc-600 mt-1 tracking-wide" style={{fontFamily:FM}}>{filtered.length} de {leads.length} leads</p></div>
  <div className="flex items-center gap-2">
  <div className="flex rounded-lg border overflow-hidden" style={{borderColor:"rgba(255,255,255,.08)"}}>{[["kanban","▦"],["list","☰"]].map(([mode, icon]) => (<button key={mode} onClick={() => setViewMode(mode)} className="px-2.5 py-1.5 text-xs transition-all" style={{background:viewMode === mode ? "rgba(201,168,76,.12)" :"transparent",color:viewMode === mode ? T.gold :"#52525b"}}>{icon}</button>))}</div>
  <Btn variant="secondary" size="sm" onClick={exportCSV}>↓ CSV</Btn>
  </div>
  </div>
  <div className="flex gap-2 flex-wrap items-center mt-3">
  <div className="relative flex-1 min-w-36">
  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="w-full border rounded-lg pl-7 pr-3 py-1.5 text-xs text-zinc-300 placeholder-zinc-700 outline-none" style={{background:"rgba(255,255,255,.02)",borderColor:"rgba(255,255,255,.07)"}} />
  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-700 text-[10px]">◈</span>
  </div>
  <button onClick={() => setFilterWarm(!filterWarm)} className="text-[10px] font-semibold px-3 py-1.5 rounded-lg border transition-all tracking-wider" style={{background:filterWarm ? "rgba(201,168,76,.1)" :"transparent",borderColor:filterWarm ? "rgba(201,168,76,.3)" :"rgba(255,255,255,.07)",color:filterWarm ? T.gold :"#52525b"}}>WARM</button>
  <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="border rounded-lg px-2.5 py-1.5 text-[10px] outline-none cursor-pointer" style={{background:"#0A0F1E",borderColor:"rgba(255,255,255,.07)",color:"#71717a"}}>{sources.map((s) => <option key={s}>{s}</option>)}</select>
  <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)} className="border rounded-lg px-2.5 py-1.5 text-[10px] outline-none cursor-pointer" style={{background:"#0A0F1E",borderColor:"rgba(255,255,255,.07)",color:"#71717a"}}>{allTags.map((t) => <option key={t}>{t}</option>)}</select>
  </div>
  </div>

  {leads.length === 0 && <EmptyPipelineState setActiveTab={setActiveTab} onStartSession={onStartSession} />}

  {leads.length > 0 && viewMode === "kanban" && (
  <div className="flex-1 overflow-x-auto custom-scrollbar">
  <div className="flex gap-4 p-5 h-full min-w-max">
  {STAGES.map((stage) => {
  const stageLeads = filtered.filter((l) => l.stage === stage);
  const sc = STAGE_COLORS[stage];
  return (
  <div key={stage} className="w-60 flex flex-col gap-3 flex-shrink-0">
  <div className="flex items-center justify-between px-1">
  <div className="flex items-center gap-2"><div className={`w-1 h-4 rounded-full ${sc.dot}`} /><span className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${sc.text}`} style={{fontFamily:FM}}>{stage}</span>{stage === "Call" && <span className="text-[8px] tracking-wider" style={{color:T.gold,fontFamily:FM}}>handoff req.</span>}</div>
  <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{background:"rgba(255,255,255,.05)",color:"#52525b",fontFamily:FM}}>{stageLeads.length}</span>
  </div>
  <div className="space-y-3 overflow-y-auto custom-scrollbar min-h-24 max-h-[calc(100vh-260px)] pb-2">
  {stageLeads.length === 0 ? <div className="border-2 border-dashed rounded-xl h-20 flex items-center justify-center" style={{borderColor:"rgba(255,255,255,.04)"}}><span className="text-[10px] text-zinc-800">Sin leads</span></div> : stageLeads.map((lead) => <LeadCard key={lead.id} lead={lead} onMove={handleMove} onDelete={deleteLead} onOpen={setSelectedLead} />)}
  </div>
  </div>
  );
  })}
  </div>
  </div>
  )}

  {leads.length > 0 && viewMode === "list" && (
  <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
  <table className="w-full" style={{borderCollapse:"separate",borderSpacing:"0 3px"}}>
  <thead><tr>{["Nombre", "Rol", "Fuente", "Stage", "Score", "Ticket", "Tags", "Follow-up", ""].map((h) => (<th key={h} className="text-left px-3 py-2 text-[9px] uppercase tracking-[0.15em]" style={{color:"#52525b",fontFamily:FM,fontWeight:400}}>{h}</th>))}</tr></thead>
  <tbody>
  {filtered.sort((a, b) => b.score - a.score).map((lead) => {
  const sc = STAGE_COLORS[lead.stage];
  const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date();
  return (
  <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="cursor-pointer transition-all group/row" style={{background:"rgba(255,255,255,.018)"}}>
  <td className="px-3 py-2.5 rounded-l-lg"><div className="flex items-center gap-2">{lead.warmSignal && <div className="w-1 h-1 rounded-full flex-shrink-0" style={{background:T.gold}} />}<span className="text-xs font-medium text-zinc-200">{lead.name}</span></div></td>
  <td className="px-3 py-2.5 text-[11px] text-zinc-600">{lead.role}</td>
  <td className="px-3 py-2.5 text-[11px] text-zinc-500">{lead.source}</td>
  <td className="px-3 py-2.5"><span className={`text-[9px] font-semibold uppercase tracking-wider ${sc.text}`} style={{fontFamily:FM}}>{lead.stage}</span></td>
  <td className="px-3 py-2.5 text-[11px]" style={{color:lead.score >= 9 ? T.emerald :lead.score >= 7 ? T.gold :"#52525b",fontFamily:FM}}>{lead.score}/10</td>
  <td className="px-3 py-2.5 text-[11px]" style={{color:lead.ticket ? T.gold :"#3f3f46",fontFamily:FM}}>{lead.ticket ? `$${lead.ticket}` : "—"}</td>
  <td className="px-3 py-2.5"><div className="flex gap-1 flex-wrap">{(lead.tags || []).slice(0, 2).map(t => <span key={t} className="text-[8px] px-1.5 py-0.5 rounded-full" style={{background:"rgba(201,168,76,.08)",color:"rgba(201,168,76,.6)",fontFamily:FM}}>{t}</span>)}</div></td>
  <td className="px-3 py-2.5 text-[10px]" style={{color:isOverdue ? "#f87171" :"#52525b",fontFamily:FM}}>{lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString("es-AR", { day: "2-digit", month: "short" }) : "—"}</td>
  <td className="px-3 py-2.5 rounded-r-lg"><button onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }} className="opacity-0 group-hover/row:opacity-100 text-[10px] text-zinc-700 hover:text-red-400 transition-all">✕</button></td>
  </tr>
  );
  })}
  </tbody>
  </table>
  </div>
  )}

  {freshLead && <LeadDetailModal lead={freshLead} onClose={() => setSelectedLead(null)} />}
  {handoffTarget && <HandoffModal lead={leads.find((l) => l.id === handoffTarget.id) || {}} onSave={handleHandoffSave} onCancel={() => setHandoffTarget(null)} />}
  </div>
  );
}

function Buscador() {
  const { addLead, showToast, profile } = useContext(GlobalContext);
  const [selectedActor, setSelectedActor] = useState(APIFY_ACTORS[0]);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [manual, setManual] = useState({ name: "", role: "", source: "Manual", data: "", warmSignal: false, email: "", ticket: 0, tags: [] });
  const [filterCategory, setFilterCategory] = useState("Todos");

  const handleSearch = async () => {
  setIsLoading(true); setResults([]);
  try {
  let items;
  if (profile?.apifyToken) {
  const inputMap = { search_linkedin: { searchUrl: keyword }, linkedin_post_comments: { postUrl: keyword }, instagram_profiles: { username: keyword }, email_finder_linkedin: { profileUrls: [keyword] }, tiktok_emails: { searchQuery: keyword }, youtube_comments: { videoUrl: keyword }, website_leads: { website: keyword }, twitter_users: { searchTerms: [keyword] }, facebook_ads: { pageUrl: keyword }, storeleads: { searchUrl: keyword }, whatsapp_validator: { phoneNumbers: [keyword] }, instagram_scraper: { username: keyword } };
  items = await apifyService.run(selectedActor.actorId, inputMap[selectedActor.id] || { query: keyword }, profile.apifyToken);
  items = apifyService.mapResults(items, selectedActor);
  } else {
  await new Promise((r) => setTimeout(r, 1800));
  items = apifyService.mock(selectedActor);
  showToast("Modo demo — configurá tu Apify Token para extracción real", "info");
  }
  setResults(items);
  if (items.length > 0) showToast(`${items.length} lead(s) extraído(s) de ${selectedActor.label}`);
  else showToast("Sin resultados. Probá con otra keyword.", "warn");
  } catch (e) { showToast(e.message, "error"); } finally { setIsLoading(false); }
  };

  const handleAddManual = () => {
  if (!manual.name || !manual.data) return;
  addLead({ ...manual, score: manual.warmSignal ? 9 : 7 });
  setManual({ name: "", role: "", source: "Manual", data: "", warmSignal: false, email: "", ticket: 0, tags: [] });
  };

  return (
  <div className="h-full overflow-y-auto custom-scrollbar">
  <div className="p-6 space-y-5 max-w-2xl">
  <div><h2 className="text-lg font-bold text-zinc-100">Prospector con Apify</h2><p className="text-xs text-zinc-500 mt-0.5">{APIFY_ACTORS.length} actors disponibles · extracción multi-plataforma</p></div>

  <div className="flex gap-1 flex-wrap mb-3">
  {["Todos", ...ACTOR_CATEGORIES].map(cat => (<button key={cat} onClick={() => setFilterCategory(cat)} className="text-[9px] px-2.5 py-1 rounded-full border transition-all tracking-wider uppercase" style={{background:filterCategory === cat ? "rgba(201,168,76,.1)" :"transparent",borderColor:filterCategory === cat ? "rgba(201,168,76,.3)" :"rgba(255,255,255,.07)",color:filterCategory === cat ? T.gold :"#52525b",fontFamily:FM}}>{cat}</button>))}
  </div>

  <div className="grid grid-cols-2 gap-2">
  {APIFY_ACTORS.filter(a => filterCategory === "Todos" || a.category === filterCategory).map((actor) => (
  <button key={actor.id} onClick={() => setSelectedActor(actor)} className={`p-3 rounded-xl border text-left transition-all duration-200 ${selectedActor.id === actor.id ? "bg-emerald-500/10 border-emerald-500/30" : "bg-zinc-900/60 border-white/5 hover:border-white/10"}`}>
  <div className="flex items-center gap-2"><span className="text-base">{actor.icon}</span><div className="min-w-0"><div className={`text-xs font-bold truncate ${selectedActor.id === actor.id ? "text-emerald-400" : "text-zinc-300"}`}>{actor.label}</div><div className="text-[9px] text-zinc-600 truncate">{actor.desc}</div></div></div>
  {actor.warmSignal && <div className="mt-1.5"><Badge color="emerald">🔥 Warm</Badge></div>}
  </button>
  ))}
  </div>

  <div className="bg-zinc-900/60 border border-white/5 rounded-xl p-4 space-y-3">
  <div className="flex items-center justify-between"><p className="text-xs font-bold text-zinc-300">{selectedActor.icon} {selectedActor.label}</p><Badge color={selectedActor.warmSignal ? "emerald" : "zinc"}>Score base: {selectedActor.score}/10</Badge></div>
  <Field label="Keyword / URL / Username" value={keyword} onChange={setKeyword} placeholder={`Ej: "VP Sales Argentina" o URL del perfil/post`} />
  {!profile?.apifyToken && (<div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-2.5 text-[10px] text-amber-500">⚡ Sin Apify Token → modo demo. Configurá tu token en Ajustes para extracción real.</div>)}
  <Btn onClick={handleSearch} disabled={isLoading || !keyword.trim()} className="w-full">{isLoading ? `🔍 Extrayendo de ${selectedActor.label}...` : `🚀 Extraer Leads`}</Btn>
  </div>

  {isLoading && <div className="flex justify-center py-4"><Spinner label={`Ejecutando actor ${selectedActor.label}...`} /></div>}

  {results.length > 0 && (
  <div className="space-y-2">
  <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Resultados extraídos ({results.length})</p>
  {results.map((lead, i) => (
  <div key={i} className="bg-zinc-900/60 border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4">
  <div className="min-w-0 flex-1"><div className="flex items-center gap-2 flex-wrap"><span className="text-sm font-semibold text-zinc-100">{lead.name}</span>{lead.warmSignal && <Badge color="emerald" glow>🔥 WARM</Badge>}</div><p className="text-xs text-zinc-500">{lead.role} · {lead.source}</p>{lead.email && <p className="text-[10px] text-purple-400">📧 {lead.email}</p>}<p className="text-[11px] text-zinc-600 truncate">{lead.data}</p></div>
  <Btn size="sm" onClick={() => { addLead(lead); setResults((r) => r.filter((_, j) => j !== i)); }}>+ Pipeline</Btn>
  </div>
  ))}
  </div>
  )}

  <div className="bg-zinc-900/60 border border-white/5 rounded-xl p-4 space-y-3">
  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Carga manual</p>
  <div className="grid grid-cols-2 gap-3"><Field label="Nombre *" value={manual.name} onChange={(v) => setManual((f) => ({ ...f, name: v }))} placeholder="Nombre del lead" /><Field label="Rol" value={manual.role} onChange={(v) => setManual((f) => ({ ...f, role: v }))} placeholder="CEO, CTO..." /></div>
  <div className="grid grid-cols-2 gap-3"><Field label="Fuente" value={manual.source} onChange={(v) => setManual((f) => ({ ...f, source: v }))} placeholder="LinkedIn, WhatsApp..." /><Field label="Ticket estimado (USD)" value={manual.ticket} onChange={(v) => setManual((f) => ({ ...f, ticket: Number(v) }))} placeholder="500" type="number" /></div>
  <Field label="Contexto / URL *" value={manual.data} onChange={(v) => setManual((f) => ({ ...f, data: v }))} placeholder="URL o nota de contexto" multiline />
  <label className="flex items-center gap-2.5 cursor-pointer">
  <div onClick={() => setManual((f) => ({ ...f, warmSignal: !f.warmSignal }))} className={`w-9 h-5 rounded-full border transition-all relative flex-shrink-0 ${manual.warmSignal ? "bg-emerald-500/20 border-emerald-500/40" : "bg-zinc-800 border-white/10"}`}><div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all ${manual.warmSignal ? "left-4" : "left-0.5"}`} /></div>
  <span className="text-xs text-zinc-400">Warm signal detectada</span>
  </label>
  <Btn onClick={handleAddManual} disabled={!manual.name || !manual.data} className="w-full">✚ Agregar al Pipeline</Btn>
  </div>
  </div>
  </div>
  );
}

function Generar() {
  const { leads, templates, addTemplate, deleteTemplate, showToast, activeWsId } = useContext(GlobalContext);
  const { generateOutreach, analyzeReply, isProcessing, error } = useAI();
  const [tab, setTab] = useState("generar");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [customContext, setCustomContext] = useState("");
  const [platform, setPlatform] = useState("LinkedIn DM");
  const [result, setResult] = useState(null);
  const [copiedMsg, setCopiedMsg] = useState(null);
  const [newTpl, setNewTpl] = useState({ name: "", platform: "LinkedIn DM", text: "" });
  const [showNewTpl, setShowNewTpl] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyAnalysis, setReplyAnalysis] = useState(null);

  const selectedLead = leads.find((l) => l.id === Number(selectedLeadId));
  const PLATFORMS = Object.keys(DAILY_LIMITS);
  const limitReached = dailyActions.limitReached(activeWsId, platform);

  const handleGenerate = async () => {
  if (limitReached) { showToast(`Límite diario de ${platform} alcanzado. Pausá para evitar baneos.`, "warn"); return; }
  const ctx = selectedLead ? `${selectedLead.name} (${selectedLead.role}) — ${selectedLead.data}${selectedLead.handoff ? ` — Dolor: ${selectedLead.handoff.painPoints}` : ""}` : customContext;
  if (!ctx.trim()) return;
  const res = await generateOutreach(ctx, platform);
  if (res) { setResult(res); dailyActions.increment(activeWsId, platform); showToast(`Secuencia generada · ${dailyActions.count(activeWsId, platform)}/${DAILY_LIMITS[platform]} hoy en ${platform}`); }
  };

  const handleAnalyzeReply = async () => {
  if (!replyText.trim() || !selectedLead) return;
  const r = await analyzeReply(`${selectedLead.name}, ${selectedLead.role}: ${selectedLead.data}`, replyText);
  if (r) setReplyAnalysis(r);
  };

  const copy = (text, key) => { navigator.clipboard.writeText(text); setCopiedMsg(key); setTimeout(() => setCopiedMsg(null), 2000); dailyActions.increment(activeWsId, platform); showToast(`Copiado · ${dailyActions.count(activeWsId, platform)}/${DAILY_LIMITS[platform]} acciones hoy en ${platform}`); };

  const msgLabels = ["msg1", "msg2", "msg3"];
  const msgDescriptions = ["Primer contacto (Pattern Interrupt)", "Follow-up 48hs sin respuesta", "Breakup message"];

  return (
  <div className="h-full flex flex-col">
  <div className="px-6 pt-5 pb-0 border-b border-white/5">
  <div className="flex gap-1">
  {[["generar", "⚡ Redacción IA"], ["5actos", "🎯 Secuencia 5 Actos"], ["reply", "💬 Analizar Respuesta"], ["templates", "📚 Templates"]].map(([id, label]) => (<button key={id} onClick={() => setTab(id)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${tab === id ? "border-emerald-500 text-emerald-400" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}>{label}</button>))}
  </div>
  </div>

  <div className="flex-1 overflow-y-auto custom-scrollbar">
  {tab === "generar" && (
  <div className="p-6 space-y-5 max-w-2xl">
  <div className="bg-zinc-900/60 border border-white/5 rounded-xl p-4 space-y-4">
  <div className="space-y-1.5"><label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Lead del Pipeline</label><select value={selectedLeadId} onChange={(e) => setSelectedLeadId(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"><option value="">— Contexto manual —</option>{leads.map((l) => <option key={l.id} value={l.id}>{l.name} · {l.role} · {l.stage}</option>)}</select></div>
  {!selectedLeadId && <Field label="Contexto manual" value={customContext} onChange={setCustomContext} placeholder="Nombre, rol, empresa, señal de interés..." multiline />}
  <div className="space-y-1.5"><label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Plataforma</label><div className="flex flex-wrap gap-2">{PLATFORMS.map((p) => (<button key={p} onClick={() => setPlatform(p)} className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${platform === p ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-zinc-800 border-white/5 text-zinc-400 hover:border-white/10"}`}>{p}</button>))}</div></div>
  <AntiBanMeter platform={platform} />
  {limitReached ? (<div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400 font-semibold text-center">🚫 Límite diario de {platform} alcanzado ({DAILY_LIMITS[platform]} mensajes). Resumí mañana.</div>) : (<Btn onClick={handleGenerate} disabled={isProcessing || (!selectedLeadId && !customContext.trim())} className="w-full">{isProcessing ? "⚡ Generando..." : "⚡ Generar Secuencia Humanizada"}</Btn>)}
  <ErrBox message={error} />
  </div>

  {isProcessing && <div className="flex justify-center py-4"><Spinner /></div>}

  {result && !isProcessing && (
  <div className="space-y-3">
  <div className="flex items-center gap-3">
  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 flex items-center gap-1.5"><span className="text-emerald-400 font-black text-lg">{result.score}</span><span className="text-xs text-emerald-600">/10</span></div>
  {result.leadMagnet && (<div className="flex-1 bg-amber-500/5 border border-amber-500/15 rounded-xl px-3 py-2"><p className="text-[10px] text-amber-500 uppercase tracking-wider font-bold mb-0.5">Lead Magnet a ofrecer</p><p className="text-xs text-zinc-300">{result.leadMagnet}</p></div>)}
  </div>
  {msgLabels.map((key, i) => result[key] && (
  <div key={key} className="bg-zinc-900/60 border border-white/5 rounded-xl p-4 space-y-2">
  <div className="flex items-start justify-between gap-2"><div><span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Mensaje {i + 1}</span><span className="text-[10px] text-zinc-600">{msgDescriptions[i]}</span></div><div className="flex gap-2 flex-shrink-0"><button onClick={() => addTemplate({ name: `M${i + 1} generado - ${platform}`, platform, text: result[key] })} className="text-[10px] text-zinc-600 hover:text-purple-400 transition-colors">Guardar</button><button onClick={() => copy(result[key], key)} className="text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors font-medium">{copiedMsg === key ? "✓ Copiado" : "Copiar"}</button></div></div>
  <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{result[key]}</p>
  <RespectTestPanel text={result[key]} />
  </div>
  ))}
  </div>
  )}
  </div>
  )}

  {tab === "5actos" && <FiveActSequence leads={leads} />}

  {tab === "reply" && (
  <div className="p-6 space-y-4 max-w-2xl">
  <div className="bg-zinc-900/60 border border-white/5 rounded-xl p-4 space-y-4">
  <div className="space-y-1.5"><label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Lead que respondió</label><select value={selectedLeadId} onChange={(e) => setSelectedLeadId(e.target.value)} className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"><option value="">— Seleccioná un lead —</option>{leads.map((l) => <option key={l.id} value={l.id}>{l.name} · {l.stage}</option>)}</select></div>
  <Field label="Respuesta del lead *" value={replyText} onChange={setReplyText} placeholder="Pegá la respuesta exacta del prospecto..." multiline />
  <Btn onClick={handleAnalyzeReply} disabled={isProcessing || !replyText.trim() || !selectedLeadId} className="w-full">{isProcessing ? "🧠 Analizando intención..." : "🧠 Descodificar Intención y Objeción"}</Btn>
  <ErrBox message={error} />
  </div>

  {isProcessing && <div className="flex justify-center py-4"><Spinner label="Analizando con IA..." /></div>}

  {replyAnalysis && !isProcessing && (
  <div className="space-y-3">
  <div className="flex items-center gap-2 flex-wrap"><Badge color="purple">{replyAnalysis.intent}</Badge><Badge color={replyAnalysis.riskLevel === "alta" ? "red" : replyAnalysis.riskLevel === "media" ? "amber" : "emerald"}>Riesgo: {replyAnalysis.riskLevel}</Badge></div>
  <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-3"><p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">🎯 Táctica recomendada</p><p className="text-xs text-zinc-300">{replyAnalysis.advice}</p></div>
  <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-4 space-y-2"><div className="flex items-center justify-between"><span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Respuesta sugerida</span><button onClick={() => { navigator.clipboard.writeText(replyAnalysis.suggestedReply); showToast("Copiado"); }} className="text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors">Copiar</button></div><p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">"{replyAnalysis.suggestedReply}"</p></div>
  </div>
  )}
  </div>
  )}

  {tab === "templates" && (
  <div className="p-6 space-y-4 max-w-2xl">
  <div className="flex items-center justify-between"><p className="text-xs text-zinc-500">{templates.length} templates guardados</p><Btn size="sm" onClick={() => setShowNewTpl(!showNewTpl)}>{showNewTpl ? "Cancelar" : "+ Nuevo Template"}</Btn></div>
  {showNewTpl && (
  <div className="bg-zinc-900/60 border border-emerald-500/20 rounded-xl p-4 space-y-3">
  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Nuevo Template</p>
  <div className="grid grid-cols-2 gap-3"><Field label="Nombre" value={newTpl.name} onChange={(v) => setNewTpl((t) => ({ ...t, name: v }))} placeholder="Ej: Breakup email" /><div className="space-y-1.5"><label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Plataforma</label><select value={newTpl.platform} onChange={(e) => setNewTpl((t) => ({ ...t, platform: e.target.value }))} className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-emerald-500/50 appearance-none">{PLATFORMS.map((p) => <option key={p}>{p}</option>)}</select></div></div>
  <Field label="Mensaje (usá [nombre], [empresa], [link])" value={newTpl.text} onChange={(v) => setNewTpl((t) => ({ ...t, text: v }))} placeholder="Texto del template..." multiline />
  <Btn onClick={() => { if (!newTpl.name || !newTpl.text) return; addTemplate(newTpl); setNewTpl({ name: "", platform: "LinkedIn DM", text: "" }); setShowNewTpl(false); }} disabled={!newTpl.name || !newTpl.text} className="w-full">Guardar Template</Btn>
  </div>
  )}
  <div className="space-y-3">{templates.map((tpl) => <TemplateCard key={tpl.id} template={tpl} onDelete={deleteTemplate} onCopy={(t) => { navigator.clipboard.writeText(t.text); showToast("Template copiado"); dailyActions.increment(activeWsId, t.platform); }} />)}</div>
  </div>
  )}
  </div>
  </div>
  );
}

function RespectTestPanel({ text }) {
  if (!text || text.trim().length < 20) return null;
  const AI_PATTERNS = [ { pattern: /espero que est(és|es) bien/i, label: "Saludo vacío", severity: "high" }, { pattern: /tu empresa necesita/i, label: "Asume problema", severity: "high" }, { pattern: /seguramente est(á|a)s (teniendo|viendo)/i, label: "Asume dolor", severity: "high" }, { pattern: /muchas empresas (como|fallan)/i, label: "Generalización", severity: "high" }, { pattern: /(revolucionario|potenciar|optimizar|sinergia|disruptivo|solución integral)/i, label: "Prohibida", severity: "high" }, { pattern: /¿(te gustaría|quieres|deseas) (mejorar|optimizar|potenciar)/i, label: "CTA genérica", severity: "medium" }, { pattern: /somos líderes|somos expertos|contamos con/i, label: "Ego up", severity: "medium" }, { pattern: /[^.!?]{120,}/i, label: "Oración muy larga", severity: "medium" }, { pattern: /\?.*\?/s, label: "Varias preguntas", severity: "medium" } ];
  const issues = AI_PATTERNS.filter(p => p.pattern.test(text));
  const wordCount = text.trim().split(/\s+/).length;
  if (issues.length === 0 && wordCount <= 80) return (<div className="rounded-lg px-3 py-2 border flex items-center gap-2" style={{background:"rgba(16,185,129,.05)",borderColor:"rgba(16,185,129,.2)"}}><span style={{color:"#10b981",fontSize:11}}>✓</span><span className="text-[10px]" style={{color:"#10b981",fontFamily:FM}}>Pasa el test del respeto</span></div>);
  return (<div className="rounded-lg p-3 border space-y-2" style={{background:"rgba(239,68,68,.04)",borderColor:"rgba(239,68,68,.15)"}}><p className="text-[9px] font-semibold uppercase tracking-wider" style={{color:"#f87171",fontFamily:FM}}>△ Test del respeto — {issues.length} alerta{issues.length>1?"s":""}</p>{issues.map((issue,i) => (<div key={i} className="flex items-center gap-2"><span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{background:issue.severity==="high"?"rgba(239,68,68,.15)":issue.severity==="medium"?"rgba(201,168,76,.12)":"rgba(255,255,255,.05)",color:issue.severity==="high"?"#f87171":issue.severity==="medium"?"#C9A84C":"#71717a",fontFamily:FM}}>{issue.severity}</span><span className="text-[10px] text-zinc-400" style={{fontFamily:FS}}>{issue.label}</span></div>))}{wordCount > 80 && <p className="text-[10px]" style={{color:"#fb923c",fontFamily:FM}}>{wordCount} palabras — máximo: 80</p>}</div>);
}

function FiveActSequence({ leads }) {
  const { generate5ActSequence, isProcessing, error } = useAI();
  const { showToast, activeWsId } = useContext(GlobalContext);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [customCtx, setCustomCtx] = useState("");
  const [platform, setPlatform] = useState("LinkedIn DM");
  const [seq, setSeq] = useState(null);
  const [step, setStep] = useState(0);
  const [prospectReply, setProspectReply] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);
  const selectedLead = leads.find(l => l.id === Number(selectedLeadId));

  const copy = (text, key) => { navigator.clipboard.writeText(text); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 2000); dailyActions.increment(activeWsId, platform); showToast("Copiado — personalizá [DOLOR]"); };

  const handleGenerate = async () => {
  const ctx = selectedLead ? `${selectedLead.name} (${selectedLead.role}) — ${selectedLead.source} — ${selectedLead.data}` : customCtx;
  if (!ctx.trim()) return;
  const r = await generate5ActSequence(ctx, platform);
  if (r) { setSeq(r); setStep(1); }
  };

  const PLATS = ["LinkedIn DM","Instagram DM","WhatsApp","Email Frío","Twitter/X"];

  const MsgBox = ({ actNum, label, color, text, k }) => (
  <div className="rounded-xl border p-4 space-y-2" style={{background:"rgba(255,255,255,.02)",borderColor:`${color}25`}}>
  <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{background:`${color}15`,color,fontFamily:FM}}>ACTO {actNum}</span><span className="text-[10px] text-zinc-500" style={{fontFamily:FM}}>{label}</span></div><button onClick={() => copy(text, k)} className="text-[9px] transition-colors" style={{color:copiedKey===k?"#10b981":"#52525b",fontFamily:FM}}>{copiedKey===k?"✓ copiado":"copiar"}</button></div>
  <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap" style={{fontFamily:FS}}>{text}</p>
  </div>
  );

  return (
  <div className="p-6 space-y-5 max-w-2xl overflow-y-auto custom-scrollbar h-full">
  <div><h3 className="text-xl font-bold text-white" style={{fontFamily:FP}}>Secuencia Diagnóstico — 5 Actos</h3><p className="text-xs text-zinc-600 mt-1" style={{fontFamily:FM}}>Reciprocidad → Gap → Abrir puerta → Indagar dolor → Solución anclada</p></div>

  {step === 0 && (
  <div className="space-y-4">
  <div className="rounded-xl border p-4 space-y-3" style={{background:"rgba(255,255,255,.02)",borderColor:"rgba(255,255,255,.06)"}}>
  <div className="space-y-1.5"><label className="text-[10px] uppercase tracking-wider text-zinc-500" style={{fontFamily:FM}}>Lead del pipeline</label><select value={selectedLeadId} onChange={e => setSelectedLeadId(e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none appearance-none" style={{background:"rgba(255,255,255,.02)",borderColor:"rgba(255,255,255,.07)"}}><option value="">— Contexto manual —</option>{leads.map(l => <option key={l.id} value={l.id}>{l.name} · {l.role}</option>)}</select></div>
  {!selectedLeadId && <Field label="Contexto del prospecto *" value={customCtx} onChange={setCustomCtx} placeholder="Nombre, rol, empresa, observación..." multiline />}
  <div className="space-y-1.5"><label className="text-[10px] uppercase tracking-wider text-zinc-500" style={{fontFamily:FM}}>Canal</label><div className="flex flex-wrap gap-1.5">{PLATS.map(p=><button key={p} onClick={()=>setPlatform(p)} className="text-xs px-3 py-1.5 rounded-lg border transition-all" style={{background:platform===p?"rgba(201,168,76,.1)":"transparent",borderColor:platform===p?"rgba(201,168,76,.3)":"rgba(255,255,255,.07)",color:platform===p?"#C9A84C":"#52525b"}}>{p}</button>)}</div></div>
  </div>
  <Btn onClick={handleGenerate} disabled={isProcessing||(!selectedLeadId&&!customCtx.trim())} className="w-full">{isProcessing?"Generando secuencia...":"🎯 Generar Secuencia Diagnóstico — 5 Actos"}</Btn>
  <ErrBox message={error} />
  {isProcessing && <div className="flex justify-center py-3"><Spinner label="Construyendo los 5 actos..." /></div>}
  </div>
  )}

  {step >= 1 && seq && (
  <div className="space-y-3 animate-fadeIn">
  <div className="flex items-center justify-between"><p className="text-[9px] uppercase tracking-wider text-zinc-600" style={{fontFamily:FM}}>Fase 1 — Abrir la puerta</p><button onClick={() => { setSeq(null); setStep(0); setProspectReply(""); }} className="text-[9px] text-zinc-700 hover:text-zinc-400 transition-colors" style={{fontFamily:FM}}>← Regenerar</button></div>
  <MsgBox actNum={1} label="Reciprocidad específica" color="#C9A84C" text={seq.act1} k="act1" />
  <MsgBox actNum={2} label="Ego up + gap visible" color="#60a5fa" text={seq.act2} k="act2" />
  <MsgBox actNum={3} label="CTA mínima — abrir puerta" color="#10b981" text={seq.act3} k="act3" />
  {step === 1 && (
  <div className="rounded-xl border p-4 space-y-3" style={{background:"rgba(201,168,76,.05)",borderColor:"rgba(201,168,76,.2)"}}>
  <p className="text-xs font-semibold" style={{color:"#C9A84C",fontFamily:FM}}>Cuando responda "sí, contame más" → pegá su respuesta acá</p>
  <Field label="Respuesta del prospecto (opcional)" value={prospectReply} onChange={setProspectReply} placeholder="Pegá lo que respondió exactamente..." multiline />
  <Btn onClick={() => setStep(2)} className="w-full">→ Continuar a Indagación del Dolor</Btn>
  </div>
  )}
  </div>
  )}

  {step >= 2 && seq && (
  <div className="space-y-3 animate-fadeIn">
  <p className="text-[9px] uppercase tracking-wider text-zinc-600" style={{fontFamily:FM}}>Fase 2 — Indagar y cerrar</p>
  <div className="rounded-xl border p-4 space-y-3" style={{background:"rgba(255,255,255,.02)",borderColor:"rgba(167,130,250,.25)"}}>
  <div className="flex items-center gap-2"><span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{background:"rgba(167,130,250,.15)",color:"#a78bfa",fontFamily:FM}}>ACTO 4</span><span className="text-[10px] text-zinc-500" style={{fontFamily:FM}}>Indagación del dolor — SPIN</span></div>
  {seq.act4_intro && <p className="text-xs text-zinc-400 italic" style={{fontFamily:FS}}>{seq.act4_intro}</p>}
  <div className="space-y-2">{(seq.act4_questions||[]).map((q,i)=>(<div key={i} className="rounded-lg border p-3 flex items-start justify-between gap-2" style={{background:"rgba(167,130,250,.05)",borderColor:"rgba(167,130,250,.15)"}}><p className="text-xs text-zinc-200 flex-1" style={{fontFamily:FS}}>{q}</p><button onClick={()=>copy(q,`q${i}`)} className="text-[9px] flex-shrink-0 transition-colors" style={{color:copiedKey===`q${i}`?"#10b981":"#52525b",fontFamily:FM}}>{copiedKey===`q${i}`?"✓":"copiar"}</button></div>))}</div>
  </div>
  <MsgBox actNum={5} label="Solución anclada al dolor" color="#10b981" text={seq.act5} k="act5" />
  <div className="flex gap-2"><Btn variant="secondary" onClick={() => setStep(1)} className="flex-1">← Volver</Btn><Btn variant="secondary" onClick={() => { setSeq(null); setStep(0); setProspectReply(""); }} className="flex-1">Nueva secuencia</Btn></div>
  </div>
  )}
  </div>
  );
}

function WorkflowBar({ leads, setActiveTab, onStartSession }) {
  const steps = [
  { id:"capture", label:"Capturar leads", icon:"🎯", tab:"buscador", done: leads.length > 0, desc:"Prospector" },
  { id:"message", label:"Escribir mensaje", icon:"⚡", tab:"generar", done: leads.some(l=>l.stage==="Contactado"||l.stage==="Respondio"||l.stage==="Call"||l.stage==="Cerrado"), desc:"Redacción IA" },
  { id:"response", label:"Registrar respuesta", icon:"💬", tab:"inbox", done: leads.some(l=>(l.notes||[]).length>0), desc:"Inbox" },
  { id:"pipeline", label:"Mover en pipeline", icon:"📊", tab:"pipeline", done: leads.some(l=>l.stage!=="Nuevo"), desc:"Pipeline" },
  { id:"close", label:"Cerrar deal", icon:"✓", tab:"closer", done: leads.some(l=>l.stage==="Cerrado"), desc:"Vista Closer" },
  ];
  const currentStep = steps.findLastIndex(s => s.done);
  const nextStep = steps[currentStep + 1] || steps[4];

  return (
  <div className="rounded-xl border p-4 space-y-3" style={{background:"rgba(255,255,255,.02)",borderColor:"rgba(255,255,255,.06)"}}>
  <div className="flex items-center justify-between"><p className="text-[9px] uppercase tracking-[.18em] text-zinc-600" style={{fontFamily:FM}}>Flujo de trabajo</p><button onClick={onStartSession} className="text-[10px] font-semibold px-3 py-1 rounded-lg border transition-all" style={{background:"rgba(201,168,76,.08)",borderColor:"rgba(201,168,76,.25)",color:"#C9A84C",fontFamily:FM}}>▶ Sesión guiada</button></div>
  <div className="flex items-center gap-1">
  {steps.map((s, i) => {
  const isActive = i === currentStep + 1; const isDone = s.done;
  return (<button key={s.id} onClick={() => setActiveTab(s.tab)} className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-all" style={{background: isActive ? "rgba(201,168,76,.08)" : isDone ? "rgba(16,185,129,.05)" : "transparent", border: `1px solid ${isActive ? "rgba(201,168,76,.25)" : isDone ? "rgba(16,185,129,.15)" : "rgba(255,255,255,.04)"}` }}><span className="text-sm">{isDone ? "✓" : s.icon}</span><span className="text-[9px] text-center leading-tight hidden sm:block" style={{color:isDone ? "#10b981" :isActive ? "#C9A84C" :"#52525b",fontFamily:FM}}>{s.label}</span></button>);
  })}
  </div>
  {nextStep && !nextStep.done && (
  <button onClick={() => setActiveTab(nextStep.tab)} className="w-full text-left rounded-lg px-3 py-2 border transition-all flex items-center gap-2" style={{background:"rgba(201,168,76,.05)",borderColor:"rgba(201,168,76,.15)"}}><span className="text-sm">{nextStep.icon}</span><div><p className="text-[10px] font-semibold" style={{color:"#C9A84C",fontFamily:FM}}>Siguiente paso → {nextStep.label}</p><p className="text-[9px] text-zinc-600" style={{fontFamily:FS}}>{nextStep.desc}</p></div><span className="ml-auto text-zinc-700" style={{fontFamily:FM}}>→</span></button>
  )}
  </div>
  );
}

function SessionMode({ leads, onClose, setActiveTab }) {
  const { updateLeadStage } = useContext(GlobalContext);
  const [sessionStep, setSessionStep] = useState(0);
  const [selectedLead, setSelectedLead] = useState(null);
  const { generateOutreach, isProcessing } = useAI();
  const { showToast, activeWsId } = useContext(GlobalContext);
  const [generatedMsg, setGeneratedMsg] = useState(null);
  const [replyLogged, setReplyLogged] = useState(false);

  const newLeads = leads.filter(l => l.stage === "Nuevo");
  const SESSION_STEPS=[{id:"pick",title:"¿Con quién trabajás hoy?",desc:"Elegí el lead"},{id:"message",title:"Generá el mensaje",desc:"IA crea la secuencia"},{id:"send",title:"Enviá el mensaje",desc:"Copialo y envialo"},{id:"log",title:"¿Respondió?",desc:"Registrá la respuesta"},{id:"move",title:"Movelo en el pipeline",desc:"Actualizá la etapa"}];
  const current = SESSION_STEPS[sessionStep];

  const handleGenerateMsg = async () => {
  if (!selectedLead) return;
  const ctx = `${selectedLead.name} (${selectedLead.role}) — ${selectedLead.source} — ${selectedLead.data}`;
  const r = await generateOutreach(ctx, selectedLead.source?.includes("Instagram") ? "Instagram DM" : selectedLead.source?.includes("WhatsApp") ? "WhatsApp" : "LinkedIn DM");
  if (r) setGeneratedMsg(r);
  };

  const renderStep = () => {
  if (sessionStep === 0) return (
  <div className="space-y-3">
  {newLeads.length === 0 ? (
  <div className="rounded-xl border p-5 text-center space-y-3" style={{background:"rgba(201,168,76,.04)",borderColor:"rgba(201,168,76,.15)"}}><p className="text-sm text-zinc-400" style={{fontFamily:FS}}>Sin leads en "Nuevo" todavía.</p><Btn onClick={() => { onClose(); setActiveTab("buscador"); }}>→ Ir al Prospector</Btn></div>
  ) : (
  <>
  <p className="text-xs text-zinc-500" style={{fontFamily:FS}}>Leads sin contactar ({newLeads.length})</p>
  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
  {newLeads.sort((a,b)=>b.score-a.score).map(l=>(<button key={l.id} onClick={()=>setSelectedLead(l)} className="w-full text-left rounded-xl border p-3 transition-all" style={{background:selectedLead?.id===l.id?"rgba(201,168,76,.08)":"rgba(255,255,255,.02)",borderColor:selectedLead?.id===l.id?"rgba(201,168,76,.3)":"rgba(255,255,255,.06)"}}><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-zinc-100" style={{fontFamily:FS}}>{l.name}</p><p className="text-[10px] text-zinc-500" style={{fontFamily:FM}}>{l.role} · {l.source}</p></div><p className="text-sm font-black" style={{color:l.score>=9?"#10b981":"#C9A84C",fontFamily:FP}}>{l.score}/10</p></div></button>))}
  </div>
  <Btn onClick={()=>setSessionStep(1)} disabled={!selectedLead} className="w-full">Trabajar con {selectedLead?.name||"este lead"} →</Btn>
  </>
  )}
  </div>
  );
  if (sessionStep === 1) return (
  <div className="space-y-3">
  {selectedLead && <div className="rounded-lg border p-3" style={{background:"rgba(255,255,255,.02)",borderColor:"rgba(255,255,255,.06)"}}><p className="text-xs font-semibold text-zinc-200" style={{fontFamily:FS}}>{selectedLead.name}</p></div>}
  <div className="grid grid-cols-2 gap-2"><button onClick={handleGenerateMsg} disabled={isProcessing} className="rounded-xl border p-3 text-left transition-all" style={{background:"rgba(255,255,255,.02)",borderColor:"rgba(255,255,255,.06)"}}><p className="text-sm mb-1">⚡</p><p className="text-xs font-semibold text-zinc-200" style={{fontFamily:FS}}>Outreach rápido</p></button><button onClick={()=>{onClose();setActiveTab("generar");}} className="rounded-xl border p-3 text-left transition-all" style={{background:"rgba(201,168,76,.05)",borderColor:"rgba(201,168,76,.15)"}}><p className="text-sm mb-1">🎯</p><p className="text-xs font-semibold" style={{color:"#C9A84C",fontFamily:FS}}>5 Actos</p></button></div>
  {isProcessing && <Spinner label="Generando..." />}
  {generatedMsg && (
  <div className="rounded-xl border p-3.5 space-y-2" style={{background:"rgba(255,255,255,.02)",borderColor:"rgba(255,255,255,.06)"}}><p className="text-[9px] uppercase tracking-wider text-zinc-600" style={{fontFamily:FM}}>Primer mensaje</p><p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap" style={{fontFamily:FS}}>{generatedMsg.msg1}</p><div className="flex gap-2"><button onClick={()=>{navigator.clipboard.writeText(generatedMsg.msg1);showToast("Copiado");dailyActions.increment(activeWsId,"LinkedIn DM");}} className="text-[10px] font-semibold px-3 py-1 rounded-lg border" style={{background:"rgba(201,168,76,.08)",borderColor:"rgba(201,168,76,.25)",color:"#C9A84C",fontFamily:FM}}>Copiar</button><button onClick={()=>setSessionStep(2)} className="text-[10px] font-semibold px-3 py-1 rounded-lg border text-zinc-400" style={{borderColor:"rgba(255,255,255,.08)",fontFamily:FM}}>Ya lo envié →</button></div></div>
  )}
  {!generatedMsg && <Btn variant="secondary" onClick={()=>setSessionStep(0)} className="w-full">← Volver</Btn>}
  </div>
  );
  if (sessionStep === 2) return (<div className="space-y-4 text-center"><p className="text-3xl">📤</p><p className="text-sm font-semibold text-zinc-200" style={{fontFamily:FS}}>Enviaste el mensaje a {selectedLead?.name}</p><Btn onClick={()=>{if(selectedLead)updateLeadStage(selectedLead.id,"Contactado");setSessionStep(3);}} className="w-full">Marcar "Contactado" →</Btn></div>);
  if (sessionStep === 3) return (<div className="space-y-4"><p className="text-xs text-zinc-400 text-center" style={{fontFamily:FS}}>¿Respondió {selectedLead?.name}?</p><div className="grid grid-cols-2 gap-3"><button onClick={()=>{setReplyLogged(true);setSessionStep(4);}} className="rounded-xl border p-4 text-center space-y-1" style={{background:"rgba(16,185,129,.06)",borderColor:"rgba(16,185,129,.2)"}}><p className="text-xl">✓</p><p className="text-xs font-semibold" style={{color:"#10b981",fontFamily:FS}}>Sí respondió</p></button><button onClick={()=>setSessionStep(4)} className="rounded-xl border p-4 text-center space-y-1" style={{background:"rgba(255,255,255,.02)",borderColor:"rgba(255,255,255,.06)"}}><p className="text-xl">⏳</p><p className="text-xs font-semibold text-zinc-400" style={{fontFamily:FS}}>Todavía no</p></button></div>{replyLogged && <button onClick={()=>{onClose();setActiveTab("inbox");}} className="w-full text-[10px] py-2 rounded-lg border text-zinc-400" style={{borderColor:"rgba(255,255,255,.06)",fontFamily:FM}}>→ Ir al Inbox a pegar la respuesta</button>}</div>);
  return (<div className="text-center space-y-4"><p className="text-4xl">🎯</p><p className="text-lg font-bold text-white" style={{fontFamily:FP}}>Sesión completada</p><p className="text-xs text-zinc-500" style={{fontFamily:FS}}>{replyLogged?`${selectedLead?.name} respondió — revisá el inbox.`:`Programá follow-up de ${selectedLead?.name}.`}</p><div className="grid grid-cols-2 gap-2"><Btn variant="secondary" onClick={()=>{setSessionStep(0);setSelectedLead(null);setGeneratedMsg(null);setReplyLogged(false);}}>Nuevo lead</Btn><Btn onClick={onClose}>Cerrar</Btn></div></div>);
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(7,9,15,.92)"}} onClick={onClose}>
  <div className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden" style={{background:"linear-gradient(145deg,#0D1424,#080D1A)",borderColor:"rgba(201,168,76,.15)"}} onClick={e=>e.stopPropagation()}>
  <div className="px-6 py-4 border-b flex items-center justify-between" style={{borderColor:"rgba(255,255,255,.05)"}}><div><p className="text-[9px] uppercase tracking-[.15em] text-zinc-600" style={{fontFamily:FM}}>Sesión guiada · Paso {sessionStep+1}/{SESSION_STEPS.length}</p><p className="text-sm font-bold text-white mt-0.5" style={{fontFamily:FP}}>{current.title}</p><p className="text-[10px] text-zinc-500" style={{fontFamily:FM}}>{current.desc}</p></div><button onClick={onClose} className="text-zinc-600 hover:text-zinc-400 text-sm w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 transition-all">✕</button></div>
  <div className="flex h-0.5">{SESSION_STEPS.map((_,i) => (<div key={i} className="flex-1 transition-all duration-500" style={{background:i<=sessionStep ? "linear-gradient(90deg,#C9A84C,#E8C96A)" :"rgba(255,255,255,.05)"}} />))}</div>
  <div className="p-6">{renderStep()}</div>
  </div>
  </div>
  );
}

function EmptyPipelineState({ setActiveTab, onStartSession }) {
  return (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
  <div className="space-y-2"><p className="text-4xl">🎯</p><p className="text-xl font-bold text-white" style={{fontFamily:FP}}>Pipeline vacío</p><p className="text-sm text-zinc-500 max-w-xs" style={{fontFamily:FS}}>Todavía no cargaste ningún lead. Empezá capturando prospectos o cargando uno manualmente.</p></div>
  <div className="space-y-2 w-full max-w-xs"><Btn onClick={onStartSession} className="w-full">▶ Sesión guiada — te llevo de la mano</Btn><Btn variant="secondary" onClick={() => setActiveTab("buscador")} className="w-full">🎯 Ir al Prospector</Btn><Btn variant="secondary" onClick={() => setActiveTab("generar")} className="w-full">⚡ Generar un mensaje</Btn></div>
  </div>
  );
}
