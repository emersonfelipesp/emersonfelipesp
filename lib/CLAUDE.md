# lib/

## Purpose
Server-side utility functions and business logic shared across API routes and page data-fetching. Nothing in this folder should be imported from client components — these are Node.js-only helpers that may use Prisma, the GitHub API, or other server resources.

## Files

- `db.ts` — Exports a Prisma Client singleton. The singleton pattern prevents multiple DB connections during Next.js hot-module reloading in development. Import `db` from here everywhere — never instantiate `PrismaClient` directly.
- `database-url.ts` — Resolves Prisma-style SQLite `file:` URLs to the same database file used by migrations and seed scripts.
- `github.ts` — Reads committed GitHub release snapshots from
  `public/github-data/<slug>.json` for project release dropdowns and
  `/[project]/releases[/tag]` pages. Also keeps `getRepoStats(fullName)` for
  DB-cached live repository metadata when needed elsewhere.
- `release-projects.ts` — Allowlisted project/repository registry for local
  release routes and the GitHub snapshot sync script.
- `views.ts` — `incrementView(path: string)` and `readView(path: string)`: thin helpers over `db.pageView` for reading and incrementing page-view counters. Used by both API routes and page components.
- `netbox-sdk-meta.ts` — `getNetboxSdkMeta()`: reads `public/netbox-sdk-fixtures/netbox-sdk-metadata.json` (written by `scripts/sync-netbox-sdk-fixtures.ts` from the local netbox-sdk's `pyproject.toml` and `netbox_sdk/typed_versions/`) and returns the netbox compatibility list, python lower bound, and latest release tag rendered in `<BadgeRow>`. Returns `null` on any read or parse failure — callers must fall back to the static `content/netbox-sdk.ts` `meta` block.
- `validators/` — Zod schemas for input validation (see `validators/CLAUDE.md`).

## Key Conventions

- Always import `db` from `lib/db.ts` — never `new PrismaClient()` elsewhere.
- `github.ts` caches via DB, not in-memory — safe across serverless function invocations.
- Never import from `lib/` in `"use client"` components; it will bundle Node-only code into the browser.
