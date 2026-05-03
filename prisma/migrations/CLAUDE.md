# prisma/migrations/

## Purpose
Auto-generated SQL migration history managed by `prisma migrate`. Records every schema change as a timestamped, versioned SQL file. Never edit these files manually — always use `prisma migrate dev` or `prisma migrate deploy`.

## Files

- `migration_lock.toml` — Locks the Prisma migration engine to the `sqlite` provider. Do not change this manually.
- `20260501231043_init/migration.sql` — Initial migration. Creates all four tables: `ContactMessage`, `PageView`, `GitHubStatsCache`, `Sample` with their columns and constraints.

## Key Conventions

- New migrations are generated automatically by `prisma migrate dev` when `schema.prisma` changes.
- Manually editing SQL in migration files will cause Prisma's checksum validation to fail.
- Deploy migrations in production with `prisma migrate deploy` (not `dev`).
