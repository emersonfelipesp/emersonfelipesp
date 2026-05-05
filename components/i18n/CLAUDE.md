# components/i18n/

## Purpose
Client‑side language selector. Mirrors the three‑axis pattern of `components/theme/`: a context provider wraps the app, a dropdown toggle lets the user pick a language, and a pre‑paint inline script in `app/layout.tsx` syncs `<html lang>` before first paint to avoid FOUC. Persists the user's choice in `localStorage["lang"]`.

## Files

- `LanguageProvider.tsx` — React context provider (`"use client"`). Reads `localStorage["lang"]` on mount, sets `document.documentElement.lang` (BCP‑47: `en` / `pt-BR`), and exposes `{ lang, setLang, t }` where `t` is the dictionary object for the current language.
- `LanguageToggle.tsx` — Accessible listbox dropdown (`"use client"`) styled identically to `ThemeToggle`. Compact form `[en]`/`[pt-br]`; expanded form `--lang=<code> ▾`.

## Key Conventions

- Source of truth for language codes/labels lives in `lib/i18n/languages.ts`; copy keys live in `lib/i18n/dictionary.ts`.
- Localized profile/featured copy lives in `lib/i18n/profile.ts` (re‑shapes `content/profile.ts`).
- `LanguageProvider` must wrap the app inside `ThemeProvider` in `app/layout.tsx`.
- Adding a new language: append to `LANGUAGES` in `lib/i18n/languages.ts` and add a matching `Dictionary` entry in `lib/i18n/dictionary.ts`. Strings only — TypeScript files are UTF‑8 by default, so accented characters (`ç ã é í ó ú â ê ô õ`) work without configuration.
