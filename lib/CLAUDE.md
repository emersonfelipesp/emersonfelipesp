# lib/

## Purpose
Server-side utility functions and business logic shared across API routes and page data-fetching. Nothing in this folder should be imported from client components — these are Node.js-only helpers that may use Prisma, the GitHub API, or other server resources.

## Files

- `db.ts` — Exports a Prisma Client singleton. The singleton pattern prevents multiple DB connections during Next.js hot-module reloading in development. Import `db` from here everywhere — never instantiate `PrismaClient` directly.
- `github.ts` — `getRepoStats(owner: string, repo: string)`: calls the GitHub REST API for repository metadata (stars, forks, primary language, latest release tag). Caches results in the `GitHubStatsCache` table with a 6-hour TTL to avoid rate limits. Returns `null` on any fetch failure — callers must handle the null case gracefully.
- `views.ts` — `incrementView(path: string)` and `readView(path: string)`: thin helpers over `db.pageView` for reading and incrementing page-view counters. Used by both API routes and page components.
- `validators/` — Zod schemas for input validation (see `validators/CLAUDE.md`).

## Key Conventions

- Always import `db` from `lib/db.ts` — never `new PrismaClient()` elsewhere.
- `github.ts` caches via DB, not in-memory — safe across serverless function invocations.
- Never import from `lib/` in `"use client"` components; it will bundle Node-only code into the browser.
