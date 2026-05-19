import { createContext, useContext, useState, ReactNode } from "react";
import { translations, Lang, Translations } from "@/lib/i18n";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextType | null>(null);

function detectLang(): Lang {
  // 1. Persistido por el usuario
  const saved = localStorage.getItem("closer_lang");
  if (saved === "es" || saved === "en") return saved;
  // 2. Idioma del navegador
  const browser = navigator.language.slice(0, 2).toLowerCase();
  return browser === "es" ? "es" : "en";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("closer_lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang debe usarse dentro de LangProvider");
  return ctx;
};
