# prisma/migrations/ — AGENTS.md Mirror

This file mirrors the sibling `CLAUDE.md` guidance for agents that read `AGENTS.md`. Treat `CLAUDE.md` as the source material; the content below preserves the current guide.

## Source

@CLAUDE.md

---

# prisma/migrations/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/prisma/migrations/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Prisma-managed SQL migration history. These files describe how existing
databases reach the current schema; they are not hand-authored documentation.

## Files

- `20260501231043_init/migration.sql` - Initial schema. Created `ContactMessage`, `PageView`, `GitHubStatsCache`, and `Sample`.
- `20260505120000_drop_unused_cache_and_sample/migration.sql` - Drops the old `GitHubStatsCache` and `Sample` tables after GitHub data moved to committed snapshots and the scaffold sample row was removed.
- `migration_lock.toml` - Prisma migration provider lock.

## Key Conventions

- Do not edit existing migration SQL manually.
- Generate new migrations with Prisma when `schema.prisma` changes.
- Deploy migrations with `pnpm exec prisma migrate deploy`.
- The current application schema is documented in `prisma/CLAUDE.md`; older migration files may mention tables that no longer exist.
