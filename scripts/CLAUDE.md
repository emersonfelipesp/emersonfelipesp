# scripts/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/scripts/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Build/support helpers run with `tsx`. These scripts are not part of the Next.js
client bundle.

## Files

- `sync-netbox-sdk-fixtures.ts` - Imports netbox-sdk docgen artifacts, generated TUI simulation SVGs, live demo command output, metadata, and prompt flow into `public/netbox-sdk-fixtures/`.
- `sync-github-data.ts` - Fetches GitHub release snapshots and repo stats for every `PROJECT_LIST` entry and writes `public/github-data/<slug>.json` plus `manifest.json`.

## Behavior

`sync-netbox-sdk-fixtures.ts`:

- Source checkout is resolved at `../../netbox-sdk` relative to this repo.
- If the source checkout is missing but committed fixtures are complete, it warns and exits 0.
- If required source files or committed fallback fixtures are missing, it exits 1.
- It runs `uv run nbx demo dcim devices list` in the netbox-sdk checkout and fails on command errors.
- It writes a manifest with source repo, source commit, timestamp, and copied/generated files.

`sync-github-data.ts`:

- Uses `GITHUB_TOKEN` when present.
- Fetches all releases, latest tag, stars, forks, assets, source archive links, authors, raw release body, and GitHub-rendered release HTML.
- Keeps existing per-repo snapshot files when GitHub fetches fail, unless no fallback file exists.
- Writes `manifest.json` and exits non-zero if any repo fails without fallback data.

## Key Conventions

- Run explicitly with `pnpm fixtures:sync` or `pnpm github:sync`; these are not `predev` or `prebuild` hooks.
- Do not synthesize terminal output by hand. Fixture content must trace back to netbox-sdk.
- Keep project iteration based on `lib/project-registry.ts` / `lib/release-projects.ts`, not duplicated arrays.
