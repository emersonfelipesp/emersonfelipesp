# app/

## Purpose
Next.js App Router root. Contains every page route, the root layout, global CSS, and all API route segments. This is the entry point for every URL the site serves — pages live as `page.tsx` files inside named subdirectories, API handlers as `route.ts` files under `api/`.

## Files

- `layout.tsx` — Root layout applied to all routes. Sets site metadata (title, OpenGraph), injects a pre-paint inline script to prevent FOUC by reading `localStorage["theme"]` before first render, wraps all children with `ThemeProvider`, and renders `TopNav` + the terminal-style footer.
- `page.tsx` — Homepage (`/`). Sets `data-palette="mixed"`, force-dynamic renders (to track page views), and composes `AsciiBanner`, `ProfileCard`, `FeaturedProjectsGrid`, `SkillsBlock`, and `ContactForm` using data from `content/profile.ts`.
- `[project]/releases/` — Allowlisted dynamic release index/detail routes
  backed by committed `public/github-data` snapshots, not live browser fetches.
- `globals.css` — The only place hex literals may live. Defines Tailwind v4 `@theme` block, all 11 semantic CSS variables (`--bg`, `--surface`, `--surface-2`, `--fg`, `--muted`, `--border`, `--accent`, `--accent-2`, `--success`, `--warn`, `--danger`) for every palette (`netbox`, `proxmox`, `mixed`) in both light and dark, plus all 8 named `[data-theme]` blocks.

## Subdirectories

- `api/` — Next.js API route handlers (see `api/CLAUDE.md`)
- `netbox-proxbox/` — Project showcase page for the NetBox-Proxmox plugin (see its `CLAUDE.md`)
- `netbox-sdk/` — Project showcase page for the NetBox SDK (see its `CLAUDE.md`)
- `proxmox-sdk/` — Project showcase page for the Proxmox SDK (see its `CLAUDE.md`)

## Key Conventions

- All pages set `export const dynamic = "force-dynamic"` to enable per-request page-view tracking via `incrementView()`.
- `data-palette` is set on each page's outermost `<div>`, never on `<html>`.
- Never write hex literals in components — only in `globals.css`.
- To add a new route: create `app/<slug>/page.tsx`, add a `content/<slug>.ts` data file, and register the route in `lib/views.ts` seed list.
