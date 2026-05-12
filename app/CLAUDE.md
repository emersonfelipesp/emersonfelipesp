# app/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/app/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Next.js App Router root. Contains every page route, API route segment, the root
layout, global CSS, sitemap, error boundaries, generated icon, and Open Graph
image.

## Files

- `layout.tsx` - Root layout. Sets metadata, theme and language pre-paint scripts, structured data, `ThemeProvider`, `LanguageProvider`, `TopNav`, and `Footer`.
- `page.tsx` - Homepage (`/`). Uses the `mixed` palette, increments page views, and renders localized profile/home content.
- `sitemap.ts` - Static route sitemap plus release URLs derived from committed GitHub snapshots.
- `opengraph-image.tsx` - Dynamic OG image generated with `next/og`. It intentionally uses inline styles because this runs outside the normal app CSS pipeline.
- `globals.css` - Tailwind v4 `@theme`, semantic color variables, palette blocks, named theme blocks, animations, and release-markdown styles.
- `error.tsx` / `global-error.tsx` - App Router error boundaries.
- `icon.tsx` - Generated favicon/icon.

## Routes

- `/netbox-proxbox`, `/proxbox-api`, `/netbox-sdk`, `/proxmox-sdk` - Showcase page server shells. Each increments its own view row, loads static release/repo data with `loadProjectShellData()`, and passes that data into the matching client content component.
- `/<project>/developer` - Developer-guide server shells for every allowlisted project. They load `content/*-developer.ts`, increment views, and pass static release/repo data to `<ProjectDeveloperContent />`.
- `/[project]/releases` and `/[project]/releases/[...tag]` - Allowlisted release index/detail pages backed by `public/github-data` snapshots. See `[project]/releases/CLAUDE.md`.
- `/api/contact` and `/api/views` - Node.js API routes. See `api/CLAUDE.md`.

## Key Conventions

- Showcase and developer pages export `dynamic = "force-dynamic"` so page views increment per request.
- Pages set `data-palette` on the outermost page div through their client content component, not on `<html>`.
- Project routes and release routes must use `lib/project-registry.ts` / `lib/project-shell.ts`; do not duplicate project slug lists.
- Metadata may use English baseline strings for SEO, but visible user-facing copy must flow through `content/` and `lib/i18n/`.
- Hex literals belong in `globals.css` or generated image files only, not normal components.
