# lib/validators/

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
