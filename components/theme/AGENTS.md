# components/theme/ — AGENTS.md Mirror

This file mirrors the sibling `CLAUDE.md` guidance for agents that read `AGENTS.md`. Treat `CLAUDE.md` as the source material; the content below preserves the current guide.

## Source

@CLAUDE.md

---

# components/theme/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/components/theme/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Client-side theme system. It manages light/dark, named theme overrides, and
`localStorage["theme"]`; route palettes are handled by page roots through
`data-palette`.

## Files

- `theme-definitions.ts` - Shared source for the 10 valid theme ids, default theme, and derived valid/dark/named arrays used by both `app/layout.tsx` and the client UI.
- `ThemeProvider.tsx` - React context provider. Reads stored theme, updates `document.documentElement.classList` / `data-theme`, persists changes, and exposes `{ theme, setTheme }`.
- `ThemeToggle.tsx` - Custom keyboard-accessible listbox dropdown. Full mode shows `--theme=<id>`; compact mode uses the condensed button rendered by the component.

## Key Conventions

- `ThemeProvider` wraps the app in `app/layout.tsx`.
- FOUC is prevented by the inline pre-paint script in `app/layout.tsx`; `ThemeProvider` handles the React state layer.
- Adding a theme requires both a full CSS variable block in `app/globals.css` and an entry in `theme-definitions.ts`.
- Components should use semantic Tailwind tokens only; hex values belong in `globals.css`.
