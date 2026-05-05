# app/netbox-proxbox/

## Purpose
Project showcase page for the `netbox-proxbox` plugin — a NetBox + Proxmox synchronisation tool. Uses the `netbox` palette. All copy and metadata come from `content/netbox-proxbox.ts`; the page is purely presentational.

## Files

- `page.tsx` — Server shell. Exports `metadata` (English baseline for SEO) + `dynamic = "force-dynamic"`, awaits `incrementView()`, then renders `<NetboxProxboxContent />`. The page body, palette, and section assembly live in the client component (so they can react to the language toggle).
- `components/project/NetboxProxboxContent.tsx` — Client (`"use client"`) component holding the JSX (`ProjectHero`, overview, `FeatureList`, installation `StepList` × 3, configuration `StepList` × 2, `ScreenshotGallery`, `RepoStatsCard`, links). Section headings, StepList titles, the configure intro, and the `// screenshots` / `// repo` dividers come from `t.project.sections.*` / `t.project.proxbox.*`. All translatable copy comes from `getNetboxProxbox(lang)`.

## Key Conventions

- Screenshots are sourced from `public/netbox-proxbox/screenshots/` — filenames must match the array in `content/netbox-proxbox.ts`.
- `export const dynamic = "force-dynamic"` is required for the page-view counter.
- Palette is `netbox` — verify both light and dark modes after any style changes.
