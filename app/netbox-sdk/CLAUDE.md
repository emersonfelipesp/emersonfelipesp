# app/netbox-sdk/

## Purpose
Project showcase page for the NetBox SDK — a Python async library with a CLI and TUI for interacting with NetBox. Uses the `netbox` palette. All copy comes from `content/netbox-sdk.ts`.

## Files

- `page.tsx` — Server shell. Exports `metadata` + `dynamic = "force-dynamic"`, awaits `getNetboxSdkMeta()` and `incrementView()`, then renders `<NetboxSdkContent liveMeta={liveMeta} />`. The page body, palette, and section assembly live in the client component (so they can react to the language toggle).
- `components/project/NetboxSdkContent.tsx` — Client (`"use client"`) component holding the JSX (`ProjectHero`, overview, `FeatureList`, stack, `InstallSnippet`, `RepoStatsCard`, links). Sources content from `getNetboxSdk(lang)` and section headings from `t.project.sections.*`.

## Key Conventions

- No screenshot gallery on this page (unlike `netbox-proxbox`).
- `export const dynamic = "force-dynamic"` required.
- Palette `netbox` — verify light/dark after style changes.
