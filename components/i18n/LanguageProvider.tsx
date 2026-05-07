"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  LANGUAGES,
  htmlLangFor,
  isLang,
  type Lang,
  type LanguageEntry,
} from "@/lib/i18n/languages";
import { DICTIONARIES, type Dictionary } from "@/lib/i18n/dictionary";

export { LANGUAGES };
export type { Lang, LanguageEntry };

const LANG_COOKIE = "lang";
const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type LanguageContextValue = {
  lang: Lang;
  setLang: (next: Lang) => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyLang(next: Lang) {
  document.documentElement.lang = htmlLangFor(next);
}

function writeLangCookie(next: Lang) {
  document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=${LANG_COOKIE_MAX_AGE}; samesite=lax`;
}

function readLangCookie(): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LANG_COOKIE}=`));
  return match ? decodeURIComponent(match.split("=")[1] ?? "") : null;
}

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    if (readLangCookie()) return;
    const stored =
      (typeof window !== "undefined" && localStorage.getItem("lang")) || null;
    if (isLang(stored)) {
      writeLangCookie(stored);
      if (stored !== lang) {
        applyLang(stored);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLangState(stored);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setLang(next: Lang) {
    applyLang(next);
    localStorage.setItem("lang", next);
    writeLangCookie(next);
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
