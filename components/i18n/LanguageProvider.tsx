"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_LANG,
  LANGUAGES,
  htmlLangFor,
  isLang,
  type Lang,
  type LanguageEntry,
} from "@/lib/i18n/languages";
import { DICTIONARIES, type Dictionary } from "@/lib/i18n/dictionary";

export { LANGUAGES };
export type { Lang, LanguageEntry };

type LanguageContextValue = {
  lang: Lang;
  setLang: (next: Lang) => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyLang(next: Lang) {
  document.documentElement.lang = htmlLangFor(next);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored =
      (typeof window !== "undefined" && localStorage.getItem("lang")) || null;
    return isLang(stored) ? stored : DEFAULT_LANG;
  });

  useEffect(() => {
    applyLang(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setLang(next: Lang) {
    applyLang(next);
    localStorage.setItem("lang", next);
    setLangState(next);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: DICTIONARIES[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
