// src/lib/aiClient.ts
// Cliente del frontend para conectarse al FastAPI backend
// Reemplaza las llamadas directas a OpenRouter desde el browser
// Beneficio: las API keys nunca salen del servidor

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── TIPOS ─────────────────────────────────────────────────────────────────────

export type ModelId =
  | "claude-sonnet"   // anthropic/claude-3.5-sonnet — mejor razonamiento
  | "claude-haiku"    // anthropic/claude-3-haiku    — rápido y barato
  | "gemini-pro"      // google/gemini-pro-1.5        — muy bueno
  | "gemini-flash"    // google/gemini-flash-1.5      — más barato
  | "gemini-2-flash"  // google/gemini-2.0-flash-exp  — experimental
  | "gpt-4o"          // openai/gpt-4o
  | "gpt-4o-mini";    // openai/gpt-4o-mini

export interface UserProfile {
  role:           string;
  niche:          string;
  valueProp:      string;
  socialProof:    string;
  funnelType:     string;
  funnelUrl:      string;
  leadMagnetType: string;
  voiceStyle:     string;
  apiKey?:        string; // key del usuario para BYOK (opcional)
}

export interface LeadCtx {
  name:       string;
  role:       string;
  source:     string;
  data:       string;
  score?:     number;
  notes?:     string;
  handoff?:   Record<string, string>;
  adCampaign?: string;
  origin?:    string;
}

export interface ModelConfig {
  model?:       ModelId;
  temperature?: number;
  max_tokens?:  number;
}

// ── HELPER BASE ───────────────────────────────────────────────────────────────

async function callAPI<T = unknown>(
  endpoint: string,
  body: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  return res.json();
}

// ── CLIENTE PRINCIPAL ─────────────────────────────────────────────────────────

export const aiClient = {

  // ─ 1. Outreach ─────────────────────────────────────────────────────────────
  outreach: (profile: UserProfile, lead: LeadCtx, platform: string, cfg?: ModelConfig, style: string = 'felix') =>
    callAPI("/ai/outreach", { profile, lead, platform, style, model_cfg: cfg || {}, user_api_key: profile.apiKey }),

  // ─ 2. Icebreaker ───────────────────────────────────────────────────────────
  icebreaker: (profile: UserProfile, lead: LeadCtx, cfg?: ModelConfig) =>
    callAPI("/ai/icebreaker", { profile, lead, model_cfg: cfg || {}, user_api_key: profile.apiKey }),

  // ─ 3. Analizar respuesta ───────────────────────────────────────────────────
  analyzeReply: (profile: UserProfile, lead: LeadCtx, reply: string, cfg?: ModelConfig) =>
    callAPI("/ai/analyze-reply", { profile, lead, reply, model_cfg: cfg || {}, user_api_key: profile.apiKey }),

  // ─ 4. Calificar lead ───────────────────────────────────────────────────────
  qualifyLead: (profile: UserProfile, lead: LeadCtx, cfg?: ModelConfig) =>
    callAPI("/ai/qualify-lead", { profile, lead, model_cfg: cfg || {}, user_api_key: profile.apiKey }),

  // ─ 5. Anti-noshow ──────────────────────────────────────────────────────────
  antiNoShow: (profile: UserProfile, leadName: string, callTime: string, platform: string, cfg?: ModelConfig) =>
    callAPI("/ai/anti-noshow", { profile, lead_name: leadName, call_time: callTime, platform, model_cfg: cfg || {} }),

  // ─ 6. Script de llamada ────────────────────────────────────────────────────
  callScript: (profile: UserProfile, lead: LeadCtx, cfg?: ModelConfig) =>
    callAPI("/ai/call-script", { profile, lead, model_cfg: cfg || {}, user_api_key: profile.apiKey }),

  // ─ 7. Manejo de objeciones ─────────────────────────────────────────────────
  objection: (profile: UserProfile, objection: string, lead: LeadCtx, cfg?: ModelConfig) =>
    callAPI("/ai/objection", { profile, objection, lead, model_cfg: cfg || {}, user_api_key: profile.apiKey }),

  // ─ 8. Secuencia 5 Actos ────────────────────────────────────────────────────
  fiveAct: (profile: UserProfile, lead: LeadCtx, platform: string, cfg?: ModelConfig) =>
    callAPI("/ai/five-act", { profile, lead, platform, style, model_cfg: cfg || {}, user_api_key: profile.apiKey }),

  // ─ 9. Respuesta ads ────────────────────────────────────────────────────────
  adsResponse: (profile: UserProfile, lead: LeadCtx, cfg?: ModelConfig) =>
    callAPI("/ai/ads-response", { profile, lead, model_cfg: cfg || {}, user_api_key: profile.apiKey }),

  // ─ 10. Paso de cadencia ────────────────────────────────────────────────────
  cadenceStep: (
    profile: UserProfile,
    lead: LeadCtx,
    day: number, channel: string, action: string,
    previousMessages = "",
    cfg?: ModelConfig,
  ) => callAPI("/ai/cadence-step", {
    profile, lead, day, channel, action,
    previous_messages: previousMessages,
    model_cfg: cfg || {},
    user_api_key: profile.apiKey,
  }),

  // ─ 11. Qualify Gate ────────────────────────────────────────────────────────
  qualifyGate: (profile: UserProfile, answers: Record<string, string>, cfg?: ModelConfig) =>
    callAPI("/ai/qualify-gate", { profile, answers, model_cfg: cfg || {} }),

  // ─ 12. Test del Respeto ────────────────────────────────────────────────────
  respectTest: (profile: UserProfile, message: string, cfg?: ModelConfig) =>
    callAPI("/ai/respect-test", { profile, message, model_cfg: cfg || {} }),

  // ─ 13. AGENTE Prospector (LangGraph) ───────────────────────────────────────
  agentProspect: (profile: UserProfile, leadContext: string, platform: string) =>
    callAPI("/agent/prospect", {
      profile, lead_context: leadContext, platform,
      user_api_key: profile.apiKey, max_steps: 5,
    }),

  // ─ 14. AGENTE Cadencia (LangGraph) ─────────────────────────────────────────
  agentCadence: (
    profile: UserProfile,
    leadContext: string,
    days: number,
    channels: string[],
    previousHistory = "",
  ) => callAPI("/agent/cadence", {
    profile, lead_context: leadContext, days, channels,
    previous_history: previousHistory,
    user_api_key: profile.apiKey,
  }),

  // ─ 15. AGENTE Análisis de conversación (LangGraph) ─────────────────────────
  agentAnalyze: (
    profile: UserProfile,
    conversationHistory: Array<{ role: string; content: string }>,
    leadContext: string,
  ) => callAPI("/agent/analyze-conversation", {
    profile, conversation_history: conversationHistory,
    lead_context: leadContext, user_api_key: profile.apiKey,
  }),

  // ─ MEMORIA ─────────────────────────────────────────────────────────────────
  memory: {
    add:       (leadId: string, workspace: string, role: string, content: string, metadata = {}) =>
      callAPI("/memory/add", { lead_id: leadId, workspace, role, content, metadata }),

    get:       (leadId: string, workspace: string, limit = 20) =>
      callAPI("/memory/get", { lead_id: leadId, workspace, limit }),

    summarize: (leadId: string, workspace: string, limit = 20) =>
      callAPI("/memory/summarize", { lead_id: leadId, workspace, limit }),

    clear:     (leadId: string, workspace: string) =>
      fetch(`${API_URL}/memory/clear/${workspace}/${leadId}`, { method: "DELETE" }),
  },

  // ─ MODELOS ─────────────────────────────────────────────────────────────────
  getModels: () => fetch(`${API_URL}/ai/models`).then(r => r.json()),


// ─ EMAIL MARKETING ─────────────────────────────────────────────────────────
  email: {
    // Genera secuencias completas: welcome, nurturing, launch, reengagement, hormozi, story, cold
    sequence: (profile: any, sequenceType: string, topic = "", targetAudience = "", model?: string, userApiKey?: string) =>
      callAPI("/email/sequence", { profile, sequence_type: sequenceType, topic, target_audience: targetAudience, model, user_api_key: userApiKey }),

    // Genera lead magnet con principios de Hormozi
    leadMagnet: (profile: any, leadType: string, problemToSolve = "", model?: string) =>
      callAPI("/email/lead-magnet", { profile, lead_type: leadType, problem_to_solve: problemToSolve, model }),

    // Recomienda el embudo óptimo según el perfil del negocio
    funnelRecommendation: (profile: any, priceRange: string, opts: any = {}, model?: string) =>
      callAPI("/email/funnel-recommendation", { profile, price_range: priceRange, ...opts, model }),

    // Genera story emails: origin, hero_journey, storybrand, micro_story, case_study
    story: (profile: any, storyType: string, protagonist = "", topic = "", model?: string) =>
      callAPI("/email/story", { profile, story_type: storyType, protagonist, topic, model }),

    // Analiza y ranquea subject lines
    analyzeSubjects: (subjectLines: string[], audience = "", objective = "", model?: string) =>
      callAPI("/email/analyze-subjects", { subject_lines: subjectLines, audience, objective, model }),

    // Lista todos los frameworks disponibles
    getFrameworks: () => fetch(`${API_URL}/email/frameworks`).then(r => r.json()),
  },


  // ─ RAG / BASE DE CONOCIMIENTO ──────────────────────────────────────────────
  rag: {
    // Subir PDF/TXT al índice de conocimiento
    upload: (file: File, workspace: string, docName?: string) => {
      const form = new FormData();
      form.append("file", file);
      form.append("workspace", workspace);
      if (docName) form.append("doc_name", docName);
      return fetch(`${API_URL}/rag/upload`, { method: "POST", body: form }).then(r => r.json());
    },
    // Buscar semánticamente en los documentos indexados
    search: (query: string, workspace: string, topK = 5) =>
      callAPI("/rag/search", { query, workspace, top_k: topK, threshold: 0.7 }),
    // Listar documentos del workspace
    list: (workspace: string) =>
      fetch(`${API_URL}/rag/documents/${workspace}`).then(r => r.json()),
    // Eliminar un documento
    delete: (docId: string, workspace: string) =>
      callAPI("/rag/document", { doc_id: docId, workspace }),
    // Obtener el SQL de setup para pgvector
    setupSQL: () =>
      fetch(`${API_URL}/rag/setup-sql`).then(r => r.json()),
  },

  // ─ HEALTH ──────────────────────────────────────────────────────────────────
  health: () => fetch(`${API_URL}/health/full`).then(r => r.json()),
};

// ── SELECTOR DE MODELO ────────────────────────────────────────────────────────
// Para el Settings panel — muestra los modelos disponibles con precios

export const MODEL_OPTIONS: Array<{ id: ModelId; label: string; cost: string; best_for: string }> = [
  { id: "gemini-flash",  label: "Gemini Flash 1.5",  cost: "Gratis",          best_for: "Icebreakers, cadencias, anti-noshow" },
  { id: "gemini-2-flash",label: "Gemini 2.0 Flash",  cost: "Gratis",          best_for: "Experimental — más rápido aún" },
  { id: "claude-haiku",  label: "Claude Haiku",       cost: "$0.003/1K tokens", best_for: "Calificación, qualify gate" },
  { id: "gemini-pro",    label: "Gemini Pro 1.5",     cost: "$0.002/1K tokens", best_for: "Outreach, mensajes complejos" },
  { id: "gpt-4o-mini",   label: "GPT-4o Mini",        cost: "$0.001/1K tokens", best_for: "Balance general" },
  { id: "claude-sonnet", label: "Claude 3.5 Sonnet",  cost: "$0.015/1K tokens", best_for: "Scripts, objeciones, análisis complejos" },
  { id: "gpt-4o",        label: "GPT-4o",             cost: "$0.010/1K tokens", best_for: "Alternativa a Claude Sonnet" },
];
