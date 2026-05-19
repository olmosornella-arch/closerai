// src/pages/app/MembersPage.tsx
// El owner invita setters y closers a su workspace
// Los miembros usan las APIs del owner — sin configuración extra

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { PLANS, isWithinLimit, UserRole, hasPermission } from "@/lib/plans";

const T = { gold: "#C9A84C", goldBg: "rgba(201,168,76,.08)", goldBorder: "rgba(201,168,76,.22)" };
const FM = "'DM Mono',monospace";
const FS = "'DM Sans',sans-serif";
const FP = "'Playfair Display',serif";

interface Member {
  id: string;
  user_id: string;
  role: UserRole;
  email: string;
  name: string;
  created_at: string;
}

export function MembersPage() {
  const { workspace, user } = useAuth();
  const { lang } = useLang();
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"setter" | "closer">("setter");
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const plan = workspace?.plan || "growth";
  const maxMembers = PLANS[plan as keyof typeof PLANS].limits.membersPerWorkspace;
  const canInviteMore = isWithinLimit(plan as any, "membersPerWorkspace", members.length);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadMembers = async () => {
    if (!workspace) return;
    setLoading(true);
    const { data } = await supabase
      .from("workspace_members")
      .select("id, user_id, role, created_at, profiles(email, name)")
      .eq("workspace_id", workspace.id);

    if (data) {
      setMembers(data.map((m: any) => ({
        id: m.id,
        user_id: m.user_id,
        role: m.role,
        email: m.profiles?.email || "",
        name: m.profiles?.name || m.profiles?.email || "Usuario",
        created_at: m.created_at,
      })));
    }
    setLoading(false);
  };

  useEffect(() => { loadMembers(); }, [workspace]);

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !workspace) return;
    if (!canInviteMore) {
      showToast(lang === "es" ? "Límite de usuarios alcanzado para tu plan" : "User limit reached for your plan", "error");
      return;
    }
    setInviting(true);
    try {
      // Buscar si el usuario existe
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", inviteEmail.trim())
        .single();

      if (!profile) {
        showToast(lang === "es" ? "El usuario debe tener una cuenta en CloserAI primero" : "User must have a CloserAI account first", "error");
        return;
      }

      // Agregar como miembro
      const { error } = await supabase
        .from("workspace_members")
        .insert({ workspace_id: workspace.id, user_id: profile.id, role: inviteRole });

      if (error) {
        if (error.code === "23505") showToast(lang === "es" ? "Este usuario ya está en el workspace" : "This user is already in the workspace", "error");
        else throw error;
      } else {
        showToast(lang === "es" ? `${inviteEmail} agregado como ${inviteRole}` : `${inviteEmail} added as ${inviteRole}`);
        setInviteEmail("");
        loadMembers();
      }
    } catch {
      showToast(lang === "es" ? "Error al invitar usuario" : "Error inviting user", "error");
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId: string, memberUserId: string) => {
    if (memberUserId === user?.id) {
      showToast(lang === "es" ? "No podés removerte a vos mismo" : "You can't remove yourself", "error");
      return;
    }
    await supabase.from("workspace_members").delete().eq("id", memberId);
    showToast(lang === "es" ? "Usuario removido" : "User removed");
    loadMembers();
  };

  const handleChangeRole = async (memberId: string, newRole: UserRole) => {
    await supabase.from("workspace_members").update({ role: newRole }).eq("id", memberId);
    showToast(lang === "es" ? "Rol actualizado" : "Role updated");
    loadMembers();
  };

  const roleColor: Record<UserRole, string> = {
    owner: T.gold,
    closer: "#10b981",
    setter: "#60a5fa",
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border text-xs font-medium animate-slide-up"
          style={{ background: toast.type === "success" ? T.goldBg : "rgba(239,68,68,.08)", borderColor: toast.type === "success" ? T.goldBorder : "rgba(239,68,68,.2)", color: toast.type === "success" ? T.gold : "#f87171", fontFamily: FM }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: FP }}>
          {lang === "es" ? "Equipo" : "Team"}
        </h2>
        <p className="text-xs text-zinc-600 mt-1" style={{ fontFamily: FM }}>
          {lang === "es"
            ? `${members.length} ${maxMembers === -1 ? "" : `/ ${maxMembers}`} usuarios · Plan ${plan}`
            : `${members.length} ${maxMembers === -1 ? "" : `/ ${maxMembers}`} users · ${plan} plan`}
        </p>
      </div>

      {/* Plan info */}
      <div className="rounded-xl border p-4 space-y-2" style={{ background: T.goldBg, borderColor: T.goldBorder }}>
        <p className="text-xs font-semibold" style={{ color: T.gold, fontFamily: FM }}>
          {lang === "es" ? "¿Cómo funciona el equipo?" : "How does the team work?"}
        </p>
        <p className="text-xs text-zinc-400" style={{ fontFamily: FS }}>
          {lang === "es"
            ? "El owner configura las APIs (Resend, Evolution, Twilio) una sola vez. Los setters y closers que invitás usan las mismas APIs automáticamente — sin configurar nada extra. El owner es quien paga el plan."
            : "The owner sets up the APIs (Resend, Evolution, Twilio) once. The setters and closers you invite use the same APIs automatically — no extra setup needed. The owner is the one who pays the plan."}
        </p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {(["owner", "closer", "setter"] as UserRole[]).map(role => (
            <div key={role} className="rounded-lg border p-2.5 space-y-1" style={{ background: "rgba(255,255,255,.03)", borderColor: "rgba(255,255,255,.06)" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: roleColor[role], fontFamily: FM }}>{role}</p>
              <p className="text-[10px] text-zinc-500" style={{ fontFamily: FS }}>
                {role === "owner" && (lang === "es" ? "Paga · Configura APIs · Administra" : "Pays · Sets up APIs · Manages")}
                {role === "closer" && (lang === "es" ? "Ve todos los leads · Cierra deals" : "Sees all leads · Closes deals")}
                {role === "setter" && (lang === "es" ? "Solo sus propios leads · Prospecta" : "Own leads only · Prospects")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Invite form */}
      {canInviteMore ? (
        <div className="rounded-xl border p-5 space-y-4" style={{ background: "rgba(255,255,255,.025)", borderColor: "rgba(255,255,255,.07)" }}>
          <p className="text-sm font-semibold text-zinc-300" style={{ fontFamily: FS }}>
            {lang === "es" ? "Invitar usuario" : "Invite user"}
          </p>
          <div className="flex gap-3">
            <input
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder={lang === "es" ? "email@ejemplo.com" : "email@example.com"}
              onKeyDown={e => e.key === "Enter" && handleInvite()}
              className="flex-1 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-700 outline-none"
              style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", fontFamily: FS }}
            />
            <select
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value as "setter" | "closer")}
              className="rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none"
              style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", fontFamily: FM }}
            >
              <option value="setter">Setter</option>
              <option value="closer">Closer</option>
            </select>
            <button
              onClick={handleInvite}
              disabled={inviting || !inviteEmail.trim()}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40"
              style={{ background: `linear-gradient(135deg,${T.gold},#E8C96A)`, color: "#07090F", fontFamily: FS }}
            >
              {inviting ? "..." : lang === "es" ? "Invitar" : "Invite"}
            </button>
          </div>
          <p className="text-[10px] text-zinc-600" style={{ fontFamily: FM }}>
            {lang === "es" ? "El usuario debe tener una cuenta en CloserAI para ser invitado." : "The user must have a CloserAI account to be invited."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border p-4 text-center space-y-2" style={{ background: "rgba(239,68,68,.06)", borderColor: "rgba(239,68,68,.18)" }}>
          <p className="text-sm font-semibold text-red-400" style={{ fontFamily: FS }}>
            {lang === "es" ? "Límite de usuarios alcanzado" : "User limit reached"}
          </p>
          <button
            className="text-xs px-4 py-2 rounded-lg font-semibold"
            style={{ background: T.goldBg, borderColor: T.goldBorder, color: T.gold, border: `1px solid ${T.goldBorder}`, fontFamily: FM }}
            onClick={() => window.location.href = "/upgrade"}
          >
            {lang === "es" ? "Subir de plan para agregar más →" : "Upgrade to add more →"}
          </button>
        </div>
      )}

      {/* Member list */}
      <div className="space-y-2">
        {loading ? (
          <p className="text-xs text-zinc-600 py-4 text-center" style={{ fontFamily: FM }}>
            {lang === "es" ? "Cargando..." : "Loading..."}
          </p>
        ) : members.map(member => (
          <div key={member.id} className="flex items-center justify-between gap-3 rounded-xl border p-4"
            style={{ background: "rgba(255,255,255,.025)", borderColor: "rgba(255,255,255,.07)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: `${roleColor[member.role]}15`, color: roleColor[member.role] }}>
                {member.name[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200" style={{ fontFamily: FS }}>{member.name}</p>
                <p className="text-[10px] text-zinc-600" style={{ fontFamily: FM }}>{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {member.user_id === user?.id ? (
                <span className="text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold"
                  style={{ background: T.goldBg, color: T.gold, border: `1px solid ${T.goldBorder}`, fontFamily: FM }}>
                  {lang === "es" ? "Vos" : "You"}
                </span>
              ) : (
                <>
                  <select
                    value={member.role}
                    onChange={e => handleChangeRole(member.id, e.target.value as UserRole)}
                    disabled={member.role === "owner"}
                    className="text-[10px] px-2 py-1 rounded-lg outline-none disabled:opacity-50"
                    style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color: roleColor[member.role], fontFamily: FM }}
                  >
                    <option value="setter">Setter</option>
                    <option value="closer">Closer</option>
                  </select>
                  <button
                    onClick={() => handleRemove(member.id, member.user_id)}
                    className="text-[10px] px-2 py-1 rounded-lg transition-all hover:opacity-80"
                    style={{ background: "rgba(239,68,68,.08)", color: "#f87171", fontFamily: FM }}>
                    ✕
                  </button>
                </>
              )}
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                style={{ background: `${roleColor[member.role]}15`, color: roleColor[member.role], fontFamily: FM }}>
                {member.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
