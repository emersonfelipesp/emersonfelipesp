# components/theme/

## Purpose
Full theme system for the site. Manages three axes: light/dark (`class="dark"` on `<html>`), per-route palette (`data-palette` on the page div — handled by pages, not here), and named theme overrides (`data-theme` on `<html>`). Persists the user's choice in `localStorage["theme"]`.

## Files

- `ThemeProvider.tsx` — React context provider (`"use client"`). Reads `localStorage["theme"]` on mount, sets `class="dark"` and/or `data-theme` on `document.documentElement`, and exposes `{ theme, setTheme }` to descendants. Defines the 11 valid theme IDs: `default-light`, `default-dark`, `netbox-dark`, `netbox-light`, `dracula`, `tokyo-night`, `onedark-pro`, `proxmox-dark`, `proxmox-light`, `monokai`.
- `ThemeToggle.tsx` — Accessible dropdown (`"use client"`) that lists all theme options and calls `setTheme()` from context. Uses keyboard-navigable `<select>` or custom listbox.

## Key Conventions

- `ThemeProvider` wraps the entire app in `app/layout.tsx` — it must remain high in the tree.
- FOUC is prevented by a separate inline `<script>` in `app/layout.tsx` that runs synchronously before paint — `ThemeProvider` handles the React state layer only.
- Adding a new theme: add the CSS block to `app/globals.css`, add it to the `THEMES` array in `ThemeProvider.tsx`, and add it to `VALID_THEMES`/`DARK_THEMES`/`NAMED_THEMES` in `app/layout.tsx`.
