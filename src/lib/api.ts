// ─────────────────────────────────────────────────────────────────────────────
// API Service Layer
// Todas las llamadas a APIs externas van por las Edge Functions de Supabase.
// Las API keys del cliente NUNCA tocan el frontend — viven encriptadas en el backend.
// ─────────────────────────────────────────────────────────────────────────────

import { callEdgeFunction } from "./supabase";

// ─── TIPOS ────────────────────────────────────────────────────────────────────
export type Channel = "whatsapp" | "sms" | "email";
export type Provider = "resend" | "evolution" | "twilio";

export interface SendMessageParams {
  channel: Channel;
  to: string;
  message: string;
  contactId?: string;
  subject?: string;
  instanceName?: string;
  delay?: number;
}

export interface SendMessageResult {
  success: boolean;
  channel: Channel;
  to: string;
  providerId?: string;
  cost: number;
  error?: string;
}

export interface SaveKeysParams {
  provider: Provider;
  key: string;
  secret?: string;
  config?: Record<string, string>;
}

export interface VerifyKeysResult {
  success: boolean;
  provider: Provider;
  message?: string;
  error?: string;
  hint?: string;
  details?: Record<string, unknown>;
}

export interface TwilioTokenResult {
  token: string;
  identity: string;
  expiresIn: number;
}

export interface EnrollSequenceParams {
  sequenceId: string;
  contactId: string;
  startNow?: boolean;
}

// ─── MENSAJERÍA ───────────────────────────────────────────────────────────────
export const api = {
  // Enviar un mensaje (WA / SMS / Email)
  sendMessage: (params: SendMessageParams) =>
    callEdgeFunction<SendMessageResult>("send-message", params),

  // Envío masivo con delay anti-ban
  sendBulk: async (
    channel: Channel,
    contacts: Array<{ id: string; phone?: string; email?: string; name: string }>,
    message: string,
    delayMs = 1200
  ): Promise<SendMessageResult[]> => {
    const results: SendMessageResult[] = [];
    for (const contact of contacts) {
      const to = channel === "email" ? contact.email! : contact.phone!;
      const personalizedMsg = message.replace(/\[nombre\]/gi, contact.name);
      const result = await api.sendMessage({
        channel,
        to,
        message: personalizedMsg,
        contactId: contact.id,
        delay: delayMs,
      });
      results.push(result);
    }
    return results;
  },

  // ─── BYOK KEYS ──────────────────────────────────────────────────────────────
  saveKeys: (params: SaveKeysParams) =>
    callEdgeFunction<{ success: boolean; message: string }>("save-keys", params),

  verifyKeys: (provider: Provider, testPhone?: string) =>
    callEdgeFunction<VerifyKeysResult>("verify-keys", { provider, testPhone }),

  // ─── TWILIO VOICE ───────────────────────────────────────────────────────────
  getTwilioToken: () =>
    callEdgeFunction<TwilioTokenResult>("twilio-token", undefined, "GET"),

  // ─── WHATSAPP ───────────────────────────────────────────────────────────────
  createWAInstance: (instanceName: string) =>
    callEdgeFunction("wa-connect", { instanceName, action: "create" }),

  getWAQR: (instanceName: string) =>
    callEdgeFunction<{ qr?: string; status: string }>("wa-connect", {
      instanceName,
      action: "qr",
    }),

  getWAStatus: (instanceName: string) =>
    callEdgeFunction<{ status: string; phone?: string }>("wa-connect", {
      instanceName,
      action: "status",
    }),

  // ─── SECUENCIAS ─────────────────────────────────────────────────────────────
  enrollSequence: (params: EnrollSequenceParams) =>
    callEdgeFunction<{
      success: boolean;
      enrollmentId: string;
      firstRunAt: string;
      message: string;
    }>("enroll-sequence", params),
};
