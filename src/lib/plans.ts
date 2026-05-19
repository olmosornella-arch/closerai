// ─────────────────────────────────────────────────────────────────────────────
// src/lib/plans.ts
// Estructura de planes, roles y límites — lista para conectar Stripe después
// NO tiene código de Stripe todavía — solo la lógica de negocio
// ─────────────────────────────────────────────────────────────────────────────

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export type PlanId = "growth" | "pro" | "agency";
export type UserRole = "owner" | "closer" | "setter";
export type BillingCycle = "monthly" | "annual";

export interface Plan {
  id: PlanId;
  name: string;
  price: { monthly: number; annual: number };
  // Límites del plan
  limits: {
    workspaces: number;        // cuántos workspaces puede crear el owner
    membersPerWorkspace: number; // setters + closers por workspace
    contactsPerWorkspace: number;
    sequencesPerWorkspace: number;
    messagesPerMonth: number;  // -1 = ilimitado
  };
  // Features disponibles
  features: {
    whatsapp: boolean;
    sms: boolean;
    voiceDialer: boolean;
    emailCampaigns: boolean;
    sequences: boolean;
    aiMessages: boolean;
    closerView: boolean;
    fiveActSystem: boolean;
    emailMarketing: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
    prioritySupport: boolean;
  };
}

// ─── DEFINICIÓN DE PLANES ─────────────────────────────────────────────────────
// Precios: $9 / $29 / $79 por mes
// NOTA: cuando conectes Stripe, agregás aquí los Price IDs de Stripe

export const PLANS: Record<PlanId, Plan> = {
  growth: {
    id: "growth",
    name: "Growth",
    price: { monthly: 9, annual: 7 },
    limits: {
      workspaces: 1,
      membersPerWorkspace: 1,     // solo el owner (setter solo)
      contactsPerWorkspace: 500,
      sequencesPerWorkspace: 2,
      messagesPerMonth: 500,
    },
    features: {
      whatsapp: true,
      sms: false,
      voiceDialer: false,
      emailCampaigns: true,
      sequences: false,           // secuencias manuales solo
      aiMessages: true,
      closerView: false,
      fiveActSystem: false,
      emailMarketing: true,
      apiAccess: false,
      whiteLabel: false,
      prioritySupport: false,
    },
  },

  pro: {
    id: "pro",
    name: "Pro",
    price: { monthly: 29, annual: 23 },
    limits: {
      workspaces: 3,
      membersPerWorkspace: 3,     // owner + 2 (un setter + un closer, por ej)
      contactsPerWorkspace: 2500,
      sequencesPerWorkspace: 10,
      messagesPerMonth: -1,       // ilimitado
    },
    features: {
      whatsapp: true,
      sms: true,
      voiceDialer: true,
      emailCampaigns: true,
      sequences: true,
      aiMessages: true,
      closerView: true,
      fiveActSystem: true,
      emailMarketing: true,
      apiAccess: false,
      whiteLabel: false,
      prioritySupport: true,
    },
  },

  agency: {
    id: "agency",
    name: "Agency",
    price: { monthly: 79, annual: 63 },
    limits: {
      workspaces: -1,             // ilimitado
      membersPerWorkspace: -1,    // ilimitado
      contactsPerWorkspace: -1,
      sequencesPerWorkspace: -1,
      messagesPerMonth: -1,
    },
    features: {
      whatsapp: true,
      sms: true,
      voiceDialer: true,
      emailCampaigns: true,
      sequences: true,
      aiMessages: true,
      closerView: true,
      fiveActSystem: true,
      emailMarketing: true,
      apiAccess: true,
      whiteLabel: true,
      prioritySupport: true,
    },
  },
};

// ─── ROLES Y PERMISOS ─────────────────────────────────────────────────────────
// El OWNER paga y configura las APIs — los demás usan las APIs del owner
// Un setter/closer invitado NO necesita configurar nada

export type Permission =
  | "manage_integrations"   // configurar Resend/Evolution/Twilio
  | "manage_members"        // invitar/remover setters y closers
  | "manage_billing"        // ver y cambiar el plan (solo owner)
  | "manage_sequences"      // crear y editar secuencias
  | "manage_workspace"      // cambiar nombre, configuración
  | "view_all_leads"        // ver leads de todos los miembros
  | "manage_own_leads"      // ver y editar solo sus propios leads
  | "send_messages"         // enviar WA/SMS/Email
  | "use_dialer"            // usar el dialer de voz
  | "use_ai"                // usar redacción con IA
  | "view_closer_view"      // acceder a la vista Closer
  | "export_data";          // exportar contactos y logs

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    "manage_integrations",
    "manage_members",
    "manage_billing",
    "manage_sequences",
    "manage_workspace",
    "view_all_leads",
    "manage_own_leads",
    "send_messages",
    "use_dialer",
    "use_ai",
    "view_closer_view",
    "export_data",
  ],
  closer: [
    "view_all_leads",       // el closer ve todos los leads para cerrar
    "manage_own_leads",
    "send_messages",
    "use_dialer",
    "use_ai",
    "view_closer_view",
  ],
  setter: [
    "manage_own_leads",     // el setter solo ve sus propios leads
    "send_messages",
    "use_ai",
  ],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasFeature(planId: PlanId, feature: keyof Plan["features"]): boolean {
  return PLANS[planId].features[feature];
}

export function isWithinLimit(
  planId: PlanId,
  limit: keyof Plan["limits"],
  current: number
): boolean {
  const max = PLANS[planId].limits[limit];
  return max === -1 || current < max;
}

export function getPlanPrice(planId: PlanId, cycle: BillingCycle): number {
  return PLANS[planId].price[cycle];
}

export function getAnnualSavings(planId: PlanId): number {
  const { monthly, annual } = PLANS[planId].price;
  return (monthly - annual) * 12;
}

// ─── STRIPE PRICE IDs (completar cuando conectes Stripe) ─────────────────────
// 1. Crear cuenta en stripe.com
// 2. Crear 3 productos (Growth, Pro, Agency) con precio mensual y anual
// 3. Copiar los Price IDs aquí
// 4. Agregar STRIPE_SECRET_KEY en las variables de entorno de Supabase

export const STRIPE_PRICE_IDS: Record<PlanId, { monthly: string; annual: string }> = {
  growth: {
    monthly: "price_COMPLETAR",   // ← pegar ID de Stripe
    annual:  "price_COMPLETAR",
  },
  pro: {
    monthly: "price_COMPLETAR",
    annual:  "price_COMPLETAR",
  },
  agency: {
    monthly: "price_COMPLETAR",
    annual:  "price_COMPLETAR",
  },
};

// ─── TRIAL ───────────────────────────────────────────────────────────────────

export const TRIAL_DAYS = 14;

export function isTrialActive(trialEndsAt: string | null): boolean {
  if (!trialEndsAt) return false;
  return new Date(trialEndsAt) > new Date();
}

export function trialDaysLeft(trialEndsAt: string | null): number {
  if (!trialEndsAt) return 0;
  const diff = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
