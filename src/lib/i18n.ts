// ─────────────────────────────────────────────────────────────────────────────
// i18n — Detección de idioma + hook
// Auto-detecta según el browser. El usuario puede cambiarlo en Settings.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { COPY, Lang } from "./plans";

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof COPY["es"];
} | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("closer_lang") as Lang;
    if (saved) return saved;
    const browser = navigator.language.toLowerCase();
    return browser.startsWith("es") ? "es" : "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("closer_lang", l);
  };

  const t = COPY[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang debe usarse dentro de LangProvider");
  return ctx;
};
