# scripts/

## Purpose
Build-time helpers run via `tsx`. Not part of the Next.js bundle.

## Files

- `sync-netbox-sdk-fixtures.ts` — Imports artifacts from
  `/root/nms/netbox-sdk` (or whichever local checkout sits at
  `../../netbox-sdk` relative to this folder) into
  `public/netbox-sdk-fixtures/`. Runs as a `predev` and `prebuild` hook
  so CLI/TUI output strings shown on `/netbox-sdk` always trace back to
  netbox-sdk's docgen pipeline.

- `sync-github-data.ts` — Fetches full GitHub release snapshots for every
  project in `lib/release-projects.ts` and writes one
  `public/github-data/<slug>.json` per repo (plus a sibling `manifest.json`).
  Each release includes metadata, author, raw body, GitHub-rendered HTML,
  assets, download counts, and source archive links. Honors `GITHUB_TOKEN`
  for the authenticated rate limit. **Not** a `predev` / `prebuild` hook —
  release data is a once-per-deploy artifact updated by
  `.github/workflows/sync-github-data.yml` on a 6-hour cron + manual +
  `repository_dispatch:[refresh-github-data]` triggers, which commits
  any diff back to `main`. The committed JSON is the source of truth for
  project release dropdowns and `/[project]/releases[/tag]` pages.

## Behavior

- **Source missing, fixtures present**: warn and exit 0 (Vercel build OK).
- **Source missing, fixtures missing**: exit 1, hard-fail the build.
- **Source present**: copy each entry in `COPIES`, run
  `uv run nbx demo dcim devices list` against `SOURCE_REPO` and write
  the captured stdout to `demo-devices-list.json` (with `demo`
  stripped from the recorded `argv` so the website trailer reads
  `nbx dcim devices list`), derive `netbox-sdk-metadata.json` from
  `pyproject.toml` (release, python lower bound) plus the
  `netbox_sdk/typed_versions/v*_*.py` listing (NetBox compatibility
  array, sorted newest first), regenerate `demo-init-flow.json` from
  `netbox_cli/demo.py` regex, write a `manifest.json` with the source
  repo HEAD SHA.
- Idempotent — overwrites destination files every run. The live
  `nbx demo dcim devices list` step hard-fails the build if the CLI
  errors or returns a non-zero exit code.

`sync-github-data.ts` failure modes:

- **Network OK**: writes a fresh `public/github-data/<slug>.json` per
  repo and updates `manifest.json`.
- **Network fails / non-2xx, file already exists**: warns and keeps the
  existing snapshot (don't clobber known-good data with empty).
- **Network fails / non-2xx, file missing**: exits 1 — the initial seed
  has to succeed.

## Extending

To add a fixture: append a `[srcPath, dstName]` pair to `COPIES`. Source
paths are relative to the netbox-sdk repo root.

To regenerate the synthesized prompt flow: edit the regex anchors in
`sync-netbox-sdk-fixtures.ts` to match the new `typer.prompt` /
`typer.echo` lines in `netbox_cli/demo.py`.

## Rule

This folder enforces the workspace's "real-mock documentation" rule
(see top-level `CLAUDE.md` §13 and `AGENTS.md`). Do not add scripts
here that synthesize terminal output by hand.
