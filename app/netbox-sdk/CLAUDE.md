# app/netbox-sdk/

## Purpose
Project showcase page for the NetBox SDK — a Python async library with a CLI and TUI for interacting with NetBox. Uses the `netbox` palette. All copy comes from `content/netbox-sdk.ts`.

## Files

- `page.tsx` — Sets `data-palette="netbox"`, exports `metadata`, force-dynamic. Assembles: `ProjectHero`, overview section, `FeatureList`, tech stack list, `InstallSnippet`, `RepoStatsCard`, and links.

## Key Conventions

- No screenshot gallery on this page (unlike `netbox-proxbox`).
- `export const dynamic = "force-dynamic"` required.
- Palette `netbox` — verify light/dark after style changes.
