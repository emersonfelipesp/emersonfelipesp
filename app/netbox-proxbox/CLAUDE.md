# app/netbox-proxbox/

## Purpose
Project showcase page for the `netbox-proxbox` plugin — a NetBox + Proxmox synchronisation tool. Uses the `netbox` palette. All copy and metadata come from `content/netbox-proxbox.ts`; the page is purely presentational.

## Files

- `page.tsx` — Sets `data-palette="netbox"`, exports Next.js `metadata` from `content/netbox-proxbox.ts`, force-dynamic renders to track views. Assembles: `ProjectHero` (ASCII banner + badges), overview section, `FeatureList`, installation `StepList` (3 install paths), configuration `CodeSnippet`, `ScreenshotGallery` (25 PNGs from `public/netbox-proxbox/screenshots/`), `RepoStatsCard`, and links.

## Key Conventions

- Screenshots are sourced from `public/netbox-proxbox/screenshots/` — filenames must match the array in `content/netbox-proxbox.ts`.
- `export const dynamic = "force-dynamic"` is required for the page-view counter.
- Palette is `netbox` — verify both light and dark modes after any style changes.
