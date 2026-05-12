# components/i18n/ — AGENTS.md Mirror

This file mirrors the sibling `CLAUDE.md` guidance for agents that read `AGENTS.md`. Treat `CLAUDE.md` as the source material; the content below preserves the current guide.

## Source

@CLAUDE.md

---

# components/i18n/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/components/i18n/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Client-side language selector. Mirrors the theme-provider pattern: a context
provider wraps the app, a dropdown lets users choose a language, and a pre-paint
script in `app/layout.tsx` sets `<html lang>` before first paint.

## Files

- `LanguageProvider.tsx` - React context provider. Reads `localStorage["lang"]`, sets `document.documentElement.lang`, and exposes `{ lang, setLang, t }`.
- `LanguageToggle.tsx` - Accessible listbox dropdown styled like `ThemeToggle`. Compact form shows `[en]` / `[pt-br]`; full form shows the localized `--lang=` label.

## Key Conventions

- Language ids and BCP-47 HTML language values live in `lib/i18n/languages.ts`.
- Shared chrome labels live in `lib/i18n/dictionary.ts`.
- Localized project/profile/developer content lives under `lib/i18n/`.
- `LanguageProvider` must stay inside `ThemeProvider` in `app/layout.tsx`.
- When adding a language, update all visible copy surfaces before shipping.
