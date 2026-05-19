import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// ─── TIPOS ────────────────────────────────────────────────────────────────────
export type Plan = "growth" | "pro" | "agency" | "trial";

export interface Workspace {
  id: string;
  name: string;
  plan: Plan;
  owner_user_id: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  workspace: Workspace | null;
  plan: Plan;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  canAccess: (feature: Feature) => boolean;
}

// ─── FEATURE FLAGS POR PLAN ───────────────────────────────────────────────────
type Feature =
  | "whatsapp"
  | "sms"
  | "voice_dialer"
  | "email_campaigns"
  | "sequences"
  | "multiple_workspaces"
  | "ai_messages"
  | "closer_view"
  | "cadences"
  | "api_access"
  | "email_marketing";

const PLAN_FEATURES: Record<Plan, Feature[]> = {
  trial:  ["whatsapp", "ai_messages", "email_campaigns", "email_marketing"],
  growth: ["whatsapp", "ai_messages", "email_campaigns", "email_marketing"],
  pro: ["whatsapp", "sms", "voice_dialer", "email_campaigns", "sequences", "ai_messages", "closer_view", "cadences", "email_marketing"],
  agency: ["whatsapp", "sms", "voice_dialer", "email_campaigns", "sequences", "multiple_workspaces", "ai_messages", "closer_view", "cadences", "api_access", "email_marketing"],
};

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar workspace del usuario
  const loadWorkspace = async (userId: string) => {
    const { data } = await supabase
      .from("workspace_members")
      .select("workspace_id, workspaces(id, name, plan, owner_user_id)")
      .eq("user_id", userId)
      .single();

    if (data?.workspaces) {
      const ws = Array.isArray(data.workspaces) ? data.workspaces[0] : data.workspaces;
      setWorkspace(ws as Workspace);
    }
  };

  useEffect(() => {
    // Sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadWorkspace(session.user.id);
      setLoading(false);
    });

    // Listener de cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadWorkspace(session.user.id);
        } else {
          setWorkspace(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { error: error.message };
    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setWorkspace(null);
  };

  const plan: Plan = (workspace?.plan as Plan) || "trial";

  const canAccess = (feature: Feature): boolean =>
    PLAN_FEATURES[plan].includes(feature);

  return (
    <AuthContext.Provider value={{
      user, session, workspace, plan, loading,
      signIn, signUp, signOut, canAccess,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
