export const LANGUAGES = [
  { code: "en", label: "en", htmlLang: "en" },
  { code: "pt-br", label: "pt-br", htmlLang: "pt-BR" },
] as const;

export type LanguageEntry = (typeof LANGUAGES)[number];
export type Lang = LanguageEntry["code"];

export const DEFAULT_LANG: Lang = "en";

export const LANGUAGE_INDEX: Record<string, LanguageEntry> = Object.fromEntries(
  LANGUAGES.map((entry) => [entry.code, entry]),
);

export const VALID_LANGS = LANGUAGES.map((entry) => entry.code);

export function isLang(value: string | null): value is Lang {
  return value !== null && value in LANGUAGE_INDEX;
}

export function htmlLangFor(code: Lang): string {
  return LANGUAGE_INDEX[code].htmlLang;
}
