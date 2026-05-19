import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local\n" +
    "La app funciona en modo offline (localStorage). Para activar auth y sync, completar el .env.local"
  );
}

export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ─── Edge Function caller ──────────────────────────────────────────────────────
// Wrapper que agrega el JWT automáticamente a cada llamada
export async function callEdgeFunction<T = unknown>(
  fnName: string,
  body?: Record<string, unknown>,
  method: "POST" | "GET" = "POST"
): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch(`${supabaseUrl}/functions/v1/${fnName}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.access_token || supabaseAnonKey}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(error.error || `Error en ${fnName}`);
  }

  return res.json();
}

// ─── Helper: obtener workspace_id del usuario actual ───────────────────────────
export async function getUserWorkspaceId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .single();

  return data?.workspace_id || null;
}
