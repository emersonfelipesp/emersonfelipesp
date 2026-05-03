# app/api/

## Purpose
Next.js API route handlers. All routes run on the `nodejs` runtime (not edge) to allow Prisma/SQLite access. Every handler validates input with Zod `safeParse` before touching the database — no exceptions.

## Subdirectories

- `contact/` — `POST /api/contact`: persists contact form submissions (see `contact/CLAUDE.md`)
- `views/` — `GET /api/views` and `POST /api/views`: page-view counter (see `views/CLAUDE.md`)

## Key Conventions

- Always set `export const runtime = "nodejs"` in route files — the edge runtime cannot use Prisma.
- Return `422` with `{ issues }` on Zod validation failure; never silently swallow bad input.
- New mutating endpoints must have a matching Zod schema added under `lib/validators/`.
