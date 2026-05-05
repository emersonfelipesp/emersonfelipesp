# content/

## Purpose
Single source of truth for all page copy and project metadata. Pages are purely presentational — they import and render these data structures. No hardcoded strings should appear in `app/*/page.tsx` or component files.

## Files

- `profile.ts` — Homepage data object: developer name, role, location, bio, skills (organised by category: languages, frameworks, databases, platforms, vendors, domains), social links, featured projects array (name, tagline, route, tech tags), and the ASCII banner art string for the homepage hero.
- `netbox-proxbox.ts` — Metadata for the NetBox-Proxmox plugin: title, tagline, description, feature list, tech stack, installation steps (3 paths), configuration snippets, GitHub repo coordinates, screenshot filename list, badge data, and ASCII banner art.
- `netbox-sdk.ts` — Metadata for the NetBox SDK (Python async library + CLI + TUI): same data shape as above (minus screenshots).
- `proxmox-sdk.ts` — Metadata for the Proxmox FastAPI SDK: same data shape as above.

## Key Conventions

- All content files export a single typed constant (e.g., `export const netboxProxbox = { ... }`).
- ASCII banner strings use template literals — preserve exact whitespace; do not auto-format.
- If copy changes are needed (taglines, features, install commands), edit here only — never in page or component files.
- Adding a new project: create a new `<slug>.ts` file here, add the route to `app/<slug>/page.tsx`, and reference the project in `profile.featuredProjects`.
- **Bilingual rule:** every user-facing string added here must have a matching pt-br translation in `lib/i18n/profile.ts` (or the appropriate sibling under `lib/i18n/`). See top-level [CLAUDE.md](../CLAUDE.md) §14.
