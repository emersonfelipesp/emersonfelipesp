# app/api/views/

## Purpose
Page-view counter API. `GET /api/views?path=<p>` returns the current count for a path; `POST /api/views` with `{ path }` increments it. Used internally by every page's `incrementView()` call at render time.

## Files

- `route.ts` — GET: reads `path` query param, validates with Zod regex `^/[a-z0-9/_-]*$` (max 200 chars), calls `readView(path)`, returns `{ path, count }`. POST: reads `path` from JSON body, same validation, calls `incrementView(path)`, returns updated `{ path, count }`.

## Key Conventions

- Path validation regex is intentionally strict — only lowercase slugs, no query strings or fragments.
- Delegates all DB logic to `lib/views.ts` helpers (`readView`, `incrementView`).
- Runtime is `nodejs`.
