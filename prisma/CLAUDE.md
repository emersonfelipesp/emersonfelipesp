# prisma/

## Purpose
Database layer for the site. Defines the data models, manages migration history, and provides a seed script for initial setup. Uses SQLite locally (`dev.db`) and libSQL/Turso in production on Vercel (ephemeral filesystem makes SQLite impractical for prod).

## Files

- `schema.prisma` — Defines four models:
  - `ContactMessage` — stores contact form submissions (name, email, message, timestamp).
  - `PageView` — per-path view counter (path + count).
  - `GitHubStatsCache` — caches GitHub API responses per repo with a `fetchedAt` timestamp for TTL checks.
  - `Sample` — seed reference row; exists to verify the DB was seeded.
- `seed.ts` — Initialisation script run once on first setup (`npm run db:seed`). Creates a `PageView` row for each known route and a `Sample` row.

## Key Conventions

- Never commit `*.db` files — they are in `.gitignore`.
- Run `npm run db:migrate` (= `prisma migrate deploy`) after any schema change, and `npm run db:seed` for a fresh local DB.
- Use Prisma Studio (`npm run db:studio`) to inspect data locally.
- For production Vercel deployment, swap to libSQL adapter — see root `CLAUDE.md` section 6 for the exact steps.
- `prisma.config.ts` at the project root configures the Prisma CLI (schema path, migrations path, datasource).
