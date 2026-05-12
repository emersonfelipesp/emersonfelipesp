# app/api/contact/ — AGENTS.md Mirror

This file mirrors the sibling `CLAUDE.md` guidance for agents that read `AGENTS.md`. Treat `CLAUDE.md` as the source material; the content below preserves the current guide.

## Source

@CLAUDE.md

---

# app/api/contact/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/app/api/contact/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Handles `POST /api/contact`. Validates contact form payloads and persists
messages to the database.

## Files

- `route.ts` - Parses JSON, validates with `contactSchema`, returns `400 { error: "invalid_json" }` for malformed JSON, `422 { error, fields, issues }` for validation failures, creates `ContactMessage`, and returns `201 { ok: true, id }`.

## Key Conventions

- Runtime is `nodejs`.
- Schema import: `import { contactSchema } from "@/lib/validators/contact"`.
- Use `safeParse`, not `parse`.
- Do not write to the database until validation succeeds.
