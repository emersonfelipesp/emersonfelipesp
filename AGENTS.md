# AGENTS.md — emersonfelipesp Agent Index

> **Purpose:** Single entry point for AI coding agents. Project context lives in
> `CLAUDE.md` files. This file indexes them only; it does not duplicate their
> content. Always read the relevant `CLAUDE.md` before editing code in that area.

---

## Quick Start

| What you need | Go here |
|---|---|
| Repo-wide architecture, stack, design rules, commands | [CLAUDE.md](CLAUDE.md) |
| Next.js App Router pages, layout, globals | [app/CLAUDE.md](app/CLAUDE.md) |
| API routes and server entry points | [app/api/CLAUDE.md](app/api/CLAUDE.md) |
| Reusable React components | [components/CLAUDE.md](components/CLAUDE.md) |
| Page copy and project metadata | [content/CLAUDE.md](content/CLAUDE.md) |
| Server utilities and validators | [lib/CLAUDE.md](lib/CLAUDE.md) |
| Prisma schema, seed, migrations | [prisma/CLAUDE.md](prisma/CLAUDE.md) |
| Static public assets | [public/CLAUDE.md](public/CLAUDE.md) |

---

## CLAUDE.md Index

Read the nearest scoped guide for the code you are changing.

- [CLAUDE.md](CLAUDE.md)
- [app/CLAUDE.md](app/CLAUDE.md)
- [app/api/CLAUDE.md](app/api/CLAUDE.md)
- [app/api/contact/CLAUDE.md](app/api/contact/CLAUDE.md)
- [app/api/views/CLAUDE.md](app/api/views/CLAUDE.md)
- [app/netbox-proxbox/CLAUDE.md](app/netbox-proxbox/CLAUDE.md)
- [app/netbox-sdk/CLAUDE.md](app/netbox-sdk/CLAUDE.md)
- [app/proxmox-sdk/CLAUDE.md](app/proxmox-sdk/CLAUDE.md)
- [components/CLAUDE.md](components/CLAUDE.md)
- [components/home/CLAUDE.md](components/home/CLAUDE.md)
- [components/nav/CLAUDE.md](components/nav/CLAUDE.md)
- [components/project/CLAUDE.md](components/project/CLAUDE.md)
- [components/project/sims/CLAUDE.md](components/project/sims/CLAUDE.md)
- [components/terminal/CLAUDE.md](components/terminal/CLAUDE.md)
- [components/theme/CLAUDE.md](components/theme/CLAUDE.md)
- [content/CLAUDE.md](content/CLAUDE.md)
- [lib/CLAUDE.md](lib/CLAUDE.md)
- [lib/validators/CLAUDE.md](lib/validators/CLAUDE.md)
- [prisma/CLAUDE.md](prisma/CLAUDE.md)
- [prisma/migrations/CLAUDE.md](prisma/migrations/CLAUDE.md)
- [public/CLAUDE.md](public/CLAUDE.md)
- [public/netbox-proxbox/CLAUDE.md](public/netbox-proxbox/CLAUDE.md)
- [public/netbox-proxbox/screenshots/CLAUDE.md](public/netbox-proxbox/screenshots/CLAUDE.md)
- [scripts/CLAUDE.md](scripts/CLAUDE.md)

## Agent Rules

1. Read [CLAUDE.md](CLAUDE.md) before starting any code change in this repo.
2. Before editing a file, read the nearest applicable `CLAUDE.md` for that path.
3. **Real-mock rule:** any CLI or TUI output string rendered by this site must come from a fixture written by `scripts/sync-netbox-sdk-fixtures.ts` (sourced from netbox-sdk's docgen pipeline). Never hand-author terminal output. See top-level [CLAUDE.md](CLAUDE.md) §13 and [components/project/sims/CLAUDE.md](components/project/sims/CLAUDE.md).
4. Treat `CLAUDE.md` files as the source of truth for implementation context; keep this file as an index.
5. Preserve the locked stack, terminal/CLI design language, theming rules, Zod validation rule, and Prisma/database constraints from [CLAUDE.md](CLAUDE.md).
6. If a new `CLAUDE.md` is added, update this index in the same change.
