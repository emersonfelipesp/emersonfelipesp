# app/api/contact/

## Purpose
Handles `POST /api/contact`. Validates the contact form payload with Zod, then writes a `ContactMessage` row to the database.

## Files

- `route.ts` — Parses the JSON body through `contactSchema` (`lib/validators/contact.ts`). Returns `422 { issues }` on failure. On success, calls `db.contactMessage.create()` and returns `201 { ok: true, id }`.

## Key Conventions

- Schema import: `import { contactSchema } from "@/lib/validators/contact"`.
- Uses `safeParse`, not `parse` — never throws on bad user input.
- Runtime is `nodejs` (set via `export const runtime`).
