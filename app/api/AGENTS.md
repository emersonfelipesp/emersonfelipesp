# app/api/ — AGENTS.md Mirror

This file mirrors the sibling `CLAUDE.md` guidance for agents that read `AGENTS.md`. Treat `CLAUDE.md` as the source material; the content below preserves the current guide.

## Source

@CLAUDE.md

---

# app/api/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/app/api/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Next.js API route handlers. Routes run on the `nodejs` runtime so they can use
Prisma and SQLite/libSQL adapters. Every handler validates input with Zod
`safeParse` before touching the database.

## Subdirectories

- `contact/` - `POST /api/contact`, persists contact form submissions.
- `views/` - `GET /api/views` and `POST /api/views`, reads/increments page-view counters.

## Key Conventions

- Set `export const runtime = "nodejs"` in route files.
- Return `400` for malformed JSON and `422` with structured validation details for bad input.
- New mutating endpoints require a matching schema under `lib/validators/`.
- Do not import browser-only helpers into API routes.
