# prisma/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/prisma/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Database schema, migration history, and seed script for the site. SQLite is used
locally; production switches to Turso/libSQL through `lib/db.ts` when `TURSO_URL`
is configured.

## Files

- `schema.prisma` - Current runtime schema:
  - `ContactMessage` - contact form submissions.
  - `PageView` - per-path view counters.
- `seed.ts` - Creates initial `PageView` rows for `/`, `/netbox-proxbox`, `/proxbox-api`, `/netbox-sdk`, and `/proxmox-sdk`.
- `migrations/` - SQL migration history. See `migrations/CLAUDE.md`.

## Key Conventions

- Never commit `*.db` files.
- Use `pnpm exec prisma migrate dev` when intentionally creating a new migration during development.
- Use `pnpm exec prisma migrate deploy` in CI/production setup.
- Run `pnpm exec prisma generate` before `pnpm typecheck` when generated Prisma types may be missing.
- Seed with `pnpm db:seed`; inspect local data with `pnpm db:studio`.
- Do not re-add runtime cache/scaffold models unless the app code genuinely needs them.
