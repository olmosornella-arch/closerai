// src/pages/app/KnowledgePage.tsx
// Subí PDFs propios (libros, casos de éxito, guías) y la IA los usa como contexto
// Requiere RAG router en FastAPI + pgvector en Supabase

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const API_URL = (import.meta.env as any).VITE_API_URL || "http://localhost:8000";
const T = { gold:"#C9A84C", goldBg:"rgba(201,168,76,.08)", goldBorder:"rgba(201,168,76,.22)", bg:"#07090F", card:"#0D0F17", muted:"#52525b" };
const FM = "'DM Mono',monospace";
const FS = "'DM Sans',sans-serif";
const FP = "'Playfair Display',serif";

interface Doc { doc_id: string; doc_name: string; chunks: number; created_at: string; }
interface SearchResult { doc_id: string; doc_name: string; content: string; similarity: number; }

export function KnowledgePage() {
  const { workspace, user } = useAuth();
  const wsId = workspace?.id || user?.id || "local";
  const [docs, setDocs] = useState<Doc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const loadDocs = async () => {
    try {
      const res = await fetch(`${API_URL}/rag/documents/${wsId}`);
      if (res.ok) { const data = await res.json(); setDocs(data.documents || []); }
    } catch { /* backend offline */ }
  };

  useEffect(() => { loadDocs(); }, [wsId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(`Procesando ${file.name}...`);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("workspace", wsId);
    formData.append("doc_name", file.name.replace(/\.[^.]+$/, ""));

    try {
      const res = await fetch(`${API_URL}/rag/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setUploadProgress(`✓ ${data.processed} chunks procesados de "${data.doc_name}"`);
        showToast(`✓ ${data.doc_name} subido — ${data.processed} chunks indexados`);
        await loadDocs();
      } else {
        setUploadProgress(`Error: ${data.detail || "Error desconocido"}`);
      }
    } catch {
      setUploadProgress("Error: verificá que el backend esté corriendo (npm run dev en closerAI_api)");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true); setResults([]);
    try {
      const res = await fetch(`${API_URL}/rag/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, workspace: wsId, top_k: 5, threshold: 0.7 }),
      });
      const data = await res.json();
      setResults(data.results || []);
      if (!data.results?.length) showToast("Sin resultados — probá otra búsqueda");
    } catch {
      showToast("Error al buscar — verificá el backend");
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await fetch(`${API_URL}/rag/document`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_id: docId, workspace: wsId }),
      });
      setDocs(docs.filter(d => d.doc_id !== docId));
      showToast("Documento eliminado");
    } catch { showToast("Error al eliminar"); }
  };

  const getSetupSQL = async () => {
    try {
      const res = await fetch(`${API_URL}/rag/setup-sql`);
      const data = await res.json();
      navigator.clipboard.writeText(data.sql);
      showToast("✓ SQL copiado — pegalo en Supabase → SQL Editor");
    } catch { showToast("Error al obtener SQL"); }
  };

  return (
    <div className="p-4 space-y-5 max-w-3xl mx-auto" style={{ fontFamily: FS }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 text-xs px-4 py-3 rounded-xl"
          style={{ background: "#10b981", color: "#fff", fontFamily: FM }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100" style={{ fontFamily: FP }}>Base de Conocimiento</h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Subí PDFs propios — la IA los usa como contexto al generar mensajes y emails
        </p>
      </div>

      {/* Setup hint */}
      <div className="rounded-xl border p-3 flex items-start gap-3"
        style={{ background: T.goldBg, borderColor: T.goldBorder }}>
        <span style={{ color: T.gold, flexShrink: 0 }}>💡</span>
        <div className="text-xs leading-relaxed" style={{ color: T.gold }}>
          <strong>Setup requerido:</strong> Activar pgvector en Supabase antes de subir documentos.{" "}
          <button onClick={getSetupSQL} className="underline font-bold">Copiar SQL de setup →</button>
          {" "}Ejecutarlo en Supabase → SQL Editor. Solo se hace una vez.
        </div>
      </div>

      {/* Upload area */}
      <div
        className="rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all"
        style={{ borderColor: "rgba(255,255,255,.08)", background: "rgba(255,255,255,.01)" }}
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={async e => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file && fileRef.current) {
            const dt = new DataTransfer();
            dt.items.add(file);
            fileRef.current.files = dt.files;
            handleUpload({ target: fileRef.current } as any);
          }
        }}
      >
        <input ref={fileRef} type="file" className="hidden"
          accept=".pdf,.txt,.md" onChange={handleUpload} />

        {uploading ? (
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto"
              style={{ borderColor: `${T.gold} transparent ${T.gold} ${T.gold}` }} />
            <p className="text-xs" style={{ color: T.gold, fontFamily: FM }}>{uploadProgress}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-3xl">📄</p>
            <p className="text-sm font-semibold text-zinc-300">
              Arrastrá un PDF o hacé click para seleccionar
            </p>
            <p className="text-xs text-zinc-600">PDF, TXT o MD · Máximo 10MB</p>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {["$100M Leads","Casos de éxito","Guías de ventas","Scripts propios"].map(tag => (
                <span key={tag} className="text-[10px] px-2 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,.04)", color: "#71717a", fontFamily: FM }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Documents list */}
      {docs.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-600" style={{ fontFamily: FM }}>
            {docs.length} documento{docs.length !== 1 ? "s" : ""} indexado{docs.length !== 1 ? "s" : ""}
          </p>
          {docs.map(doc => (
            <div key={doc.doc_id}
              className="flex items-center gap-3 rounded-xl border px-4 py-3"
              style={{ background: "rgba(255,255,255,.02)", borderColor: "rgba(255,255,255,.06)" }}>
              <span className="text-lg">📗</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-200 truncate">{doc.doc_name}</p>
                <p className="text-[10px] text-zinc-600" style={{ fontFamily: FM }}>
                  {doc.chunks} chunks · {new Date(doc.created_at).toLocaleDateString("es-AR")}
                </p>
              </div>
              <button onClick={() => handleDelete(doc.doc_id)}
                className="text-[10px] px-3 py-1.5 rounded-lg transition-all flex-shrink-0"
                style={{ color: "#f87171", background: "rgba(239,68,68,.08)" }}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      {docs.length === 0 && !uploading && (
        <p className="text-xs text-zinc-600 text-center py-2">
          Sin documentos aún — subí tu primer PDF arriba
        </p>
      )}

      {/* Semantic search */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-600" style={{ fontFamily: FM }}>
          Búsqueda semántica
        </p>
        <div className="flex gap-2">
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="¿Qué buscar en tus documentos? (ej: cómo manejar objeción de precio)"
            className="flex-1 text-sm rounded-xl px-4 py-2.5 text-zinc-300 outline-none"
            style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}
          />
          <button onClick={handleSearch} disabled={searching || !query.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0"
            style={{
              background: searching ? "rgba(255,255,255,.05)" : `linear-gradient(135deg,${T.gold},#E8C96A)`,
              color: searching ? "#52525b" : "#07090F",
            }}>
            {searching ? "..." : "Buscar"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className="rounded-xl border overflow-hidden"
                style={{ background: "rgba(255,255,255,.02)", borderColor: "rgba(255,255,255,.06)" }}>
                <div className="px-4 py-2 border-b flex items-center justify-between"
                  style={{ borderColor: "rgba(255,255,255,.06)", background: "rgba(255,255,255,.03)" }}>
                  <p className="text-[10px] font-bold text-zinc-500" style={{ fontFamily: FM }}>
                    {r.doc_name}
                  </p>
                  <span className="text-[10px]" style={{ color: T.gold, fontFamily: FM }}>
                    {Math.round(r.similarity * 100)}% relevante
                  </span>
                </div>
                <p className="px-4 py-3 text-xs text-zinc-400 leading-relaxed">{r.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
