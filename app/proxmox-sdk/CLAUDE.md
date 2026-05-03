# app/proxmox-sdk/

## Purpose
Project showcase page for the Proxmox SDK — a schema-driven FastAPI-based Python library for the Proxmox API. Uses the `proxmox` palette (orange accent). All copy comes from `content/proxmox-sdk.ts`.

## Files

- `page.tsx` — Sets `data-palette="proxmox"`, exports `metadata`, force-dynamic. Assembles: `ProjectHero`, overview section, `FeatureList`, tech stack list, `InstallSnippet`, `RepoStatsCard`, and links.

## Key Conventions

- This is the only page using `data-palette="proxmox"` (orange brand colors).
- `export const dynamic = "force-dynamic"` required.
- Verify both light and dark proxmox palette variants after style changes.
