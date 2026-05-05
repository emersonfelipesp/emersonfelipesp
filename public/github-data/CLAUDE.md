# public/github-data/

## Purpose

Committed GitHub release and repository snapshots. The app reads these files at
runtime to render project release dropdowns, local release pages, and static
repo summaries without live GitHub requests.

## Files

- `<slug>.json` - One snapshot per project in `PROJECT_LIST`. Each includes `syncedAt`, `fullName`, optional `stars` / `forks`, and normalized releases.
- `manifest.json` - Sync status for all repos processed by `scripts/sync-github-data.ts`.

## Key Conventions

- Regenerate with `pnpm github:sync`.
- The sync workflow commits diffs from `.github/workflows/sync-github-data.yml`.
- Do not edit snapshot JSON by hand except for emergency recovery with clear review context.
- Keep snapshot slugs aligned with `lib/project-registry.ts`.
