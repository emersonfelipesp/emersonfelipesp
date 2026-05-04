# components/theme/

## Purpose
Full theme system for the site. Manages three axes: light/dark (`class="dark"` on `<html>`), per-route palette (`data-palette` on the page div — handled by pages, not here), and named theme overrides (`data-theme` on `<html>`). Persists the user's choice in `localStorage["theme"]`.

## Files

- `theme-definitions.ts` — Pure shared source of truth for the 10 valid theme IDs, default theme, and derived valid/dark/named theme arrays used by both the server bootstrap script and client UI.
- `ThemeProvider.tsx` — React context provider (`"use client"`). Reads `localStorage["theme"]` on mount, sets `class="dark"` and/or `data-theme` on `document.documentElement`, and exposes `{ theme, setTheme }` to descendants.
- `ThemeToggle.tsx` — Accessible dropdown (`"use client"`) that lists all theme options and calls `setTheme()` from context. Uses keyboard-navigable `<select>` or custom listbox.

## Key Conventions

- `ThemeProvider` wraps the entire app in `app/layout.tsx` — it must remain high in the tree.
- FOUC is prevented by a separate inline `<script>` in `app/layout.tsx` that runs synchronously before paint — `ThemeProvider` handles the React state layer only.
- Adding a new theme: add the CSS block to `app/globals.css`, then add one entry to `THEMES` in `theme-definitions.ts`.
