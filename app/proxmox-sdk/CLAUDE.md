# app/proxmox-sdk/

## Purpose
Project showcase page for the Proxmox SDK — a schema-driven FastAPI-based Python library for the Proxmox API. Uses the `proxmox` palette (orange accent). All copy comes from `content/proxmox-sdk.ts`.

## Files

- `page.tsx` — Server shell. Exports `metadata` + `dynamic = "force-dynamic"`, awaits `incrementView()`, then renders `<ProxmoxSdkContent />`. The page body, palette, and section assembly live in the client component (so they can react to the language toggle).
- `components/project/ProxmoxSdkContent.tsx` — Client (`"use client"`) component holding the JSX (`ProjectHero`, overview, `FeatureList`, stack, `InstallSnippet`, `RepoStatsCard`, links). Sources content from `getProxmoxSdk(lang)`.

## Key Conventions

- This is the only page using `data-palette="proxmox"` (orange brand colors).
- `export const dynamic = "force-dynamic"` required.
- Verify both light and dark proxmox palette variants after style changes.
