# app/api/views/ — AGENTS.md Mirror

This file mirrors the sibling `CLAUDE.md` guidance for agents that read `AGENTS.md`. Treat `CLAUDE.md` as the source material; the content below preserves the current guide.

## Source

@CLAUDE.md

---

# app/api/views/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/app/api/views/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Page-view counter API. `GET /api/views?path=<p>` reads the current count and
`POST /api/views` with `{ path }` increments it.

## Files

- `route.ts` - Validates path input with `viewPathSchema` / `viewBodySchema`, delegates reads and writes to `lib/views.ts`, and returns `{ path, count }`.

## Key Conventions

- Runtime is `nodejs`.
- Valid paths must match `^/[a-z0-9/_-]*$` and be 200 characters or shorter.
- Query strings and fragments are not valid path values.
- Keep DB logic in `lib/views.ts`.
