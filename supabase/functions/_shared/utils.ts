// supabase/functions/_shared/utils.ts
// Utilidades compartidas por todas las Edge Functions

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── CORS ────────────────────────────────────────────────────────────────────
export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

export const corsResponse = () => new Response("ok", { headers: CORS });

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

export const err = (msg: string, status = 400) =>
  json({ error: msg }, status);

// ── SUPABASE ADMIN ──────────────────────────────────────────────────────────
export const supabaseAdmin = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );

// ── AUTH HELPERS ────────────────────────────────────────────────────────────
export async function getWorkspace(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;

  const sb = supabaseAdmin();
  const { data: { user } } = await sb.auth.getUser(token);
  if (!user) return null;

  const { data } = await sb
    .from("workspace_members")
    .select("workspace_id, role, workspaces(id, name, plan, owner_user_id)")
    .eq("user_id", user.id)
    .single();

  if (!data?.workspaces) return null;
  const ws = Array.isArray(data.workspaces) ? data.workspaces[0] : data.workspaces;
  return { ...ws, member_role: data.role, user_id: user.id };
}

// ── ENCRYPTION (AES-256-GCM) ────────────────────────────────────────────────
const ENC_KEY = () => Deno.env.get("ENCRYPTION_KEY") || "dev-key-32-chars-exactly-padded!";

export async function encrypt(text: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(ENC_KEY().substring(0, 32)),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(text)
  );
  const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.byteLength);
  return btoa(String.fromCharCode(...combined));
}

export async function decrypt(encoded: string): Promise<string> {
  const combined = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(ENC_KEY().substring(0, 32)),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new TextDecoder().decode(decrypted);
}

// ── GET DECRYPTED KEY ────────────────────────────────────────────────────────
export async function getDecryptedKey(
  workspaceId: string,
  provider: string
): Promise<{ key: string; secret?: string; config?: Record<string, string> } | null> {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("workspace_integrations")
    .select("encrypted_key, encrypted_secret, config_json")
    .eq("workspace_id", workspaceId)
    .eq("provider", provider)
    .single();

  if (!data) return null;

  const key    = await decrypt(data.encrypted_key);
  const secret = data.encrypted_secret ? await decrypt(data.encrypted_secret) : undefined;
  return { key, secret, config: data.config_json };
}
