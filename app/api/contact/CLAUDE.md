# app/api/contact/

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
