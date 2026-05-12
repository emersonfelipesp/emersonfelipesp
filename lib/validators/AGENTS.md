# lib/validators/ — AGENTS.md Mirror

This file mirrors the sibling `CLAUDE.md` guidance for agents that read `AGENTS.md`. Treat `CLAUDE.md` as the source material; the content below preserves the current guide.

## Source

@CLAUDE.md

---

# lib/validators/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/lib/validators/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Zod 4 schemas for validating user input before it reaches the database.

## Files

- `contact.ts` - `contactSchema` validates `name`, lowercases/validates `email`, and validates `message` length for `/api/contact`.
- `views.ts` - `viewPathSchema` and `viewBodySchema` validate page-view paths for `/api/views`.

## Key Conventions

- Use `safeParse`, not `parse`, in route handlers.
- Return structured validation errors instead of throwing on user input.
- Add a schema here before adding a new mutating endpoint.
- Schema field names must match client JSON body keys exactly.
