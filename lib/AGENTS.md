# lib/ — AGENTS.md Mirror

This file mirrors the sibling `CLAUDE.md` guidance for agents that read `AGENTS.md`. Treat `CLAUDE.md` as the source material; the content below preserves the current guide.

## Source

@CLAUDE.md

---

# lib/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/lib/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Server utilities, registries, static data readers, database helpers,
localization helpers, and validators. Keep Node-only code out of client bundles.

## Files

- `project-registry.ts` - Shared project metadata source. Defines `PROJECTS`, `PROJECT_LIST`, `ProjectSlug`, palettes, project actions, route helpers, and route parsing.
- `project-shell-meta.ts` - Compatibility wrapper over `project-registry.ts` for project shell callers.
- `project-shell.ts` - Loads static release summaries and repo summaries for project pages via `loadProjectShellData(slug)`.
- `release-projects.ts` - Compatibility wrapper exporting `RELEASE_PROJECTS`, `getReleaseProject()`, and release path helpers from the registry.
- `github.ts` - Reads committed `public/github-data/<slug>.json` snapshots, validates them with Zod, and returns release/repo summary data.
- `db.ts` - Prisma singleton. Uses libSQL when `TURSO_URL` is set, otherwise better-sqlite3 with the resolved SQLite file path.
- `database-url.ts` - Resolves Prisma `file:` URLs to absolute filenames for runtime, migrations, and seed scripts.
- `views.ts` - `incrementView(path)` and `readView(path)` wrappers over `PageView`.
- `netbox-sdk-meta.ts` - Reads committed `public/netbox-sdk-fixtures/netbox-sdk-metadata.json` and returns netbox-sdk compatibility metadata, falling back at call sites when unavailable.
- `i18n/` - Dictionaries and localized content. See `i18n/CLAUDE.md`.
- `validators/` - Zod input schemas. See `validators/CLAUDE.md`.

## Key Conventions

- Browser-safe helpers may be imported by client components only if they do not touch `fs`, Prisma, environment-only secrets, or Node-only APIs.
- Always import the shared Prisma singleton from `db.ts`; never instantiate `PrismaClient` in app code outside seed/migration tooling.
- GitHub data is static JSON at runtime. Do not reintroduce DB-backed GitHub cache models or browser-side GitHub fetches.
- Any new project must be registered first in `project-registry.ts`, then localized and wired into content/page surfaces.
