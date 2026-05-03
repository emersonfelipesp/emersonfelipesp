# lib/validators/

## Purpose
Zod 4 schemas for validating all user-supplied input before it reaches the database. Every API route and server action must use `safeParse` from a schema here — never bypass validation, even for seemingly safe payloads.

## Files

- `contact.ts` — Exports `contactSchema`: validates `name` (non-empty string), `email` (valid email format via `z.string().email()`), and `message` (string with a minimum length). Used in `app/api/contact/route.ts`.

## Key Conventions

- Use `safeParse`, not `parse` — routes must return structured error responses, not throw.
- When adding a new mutating API endpoint, add a matching schema file here first.
- Schema field names must match the JSON body keys sent by the client exactly.
