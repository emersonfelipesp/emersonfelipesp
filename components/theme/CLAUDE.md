# components/theme/

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
