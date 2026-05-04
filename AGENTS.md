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

Every `CLAUDE.md` in this repository is listed below.

| File | Covers |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Repo-wide guide: locked stack, routes, terminal design language, theming, Prisma/database, validation, local commands, deployment, conventions |
| [app/CLAUDE.md](app/CLAUDE.md) | Next.js App Router root: layout, pages, global CSS, route-level conventions |
| [app/api/CLAUDE.md](app/api/CLAUDE.md) | API route handlers and server entry point conventions |
| [app/api/contact/CLAUDE.md](app/api/contact/CLAUDE.md) | Contact form API route and Zod-validated persistence flow |
| [app/api/views/CLAUDE.md](app/api/views/CLAUDE.md) | Page-view counter API route |
| [app/netbox-proxbox/CLAUDE.md](app/netbox-proxbox/CLAUDE.md) | NetBox-Proxbox project page |
| [app/netbox-sdk/CLAUDE.md](app/netbox-sdk/CLAUDE.md) | NetBox SDK project page |
| [app/proxmox-sdk/CLAUDE.md](app/proxmox-sdk/CLAUDE.md) | Proxmox SDK project page |
| [components/CLAUDE.md](components/CLAUDE.md) | Shared React component structure and conventions |
| [components/home/CLAUDE.md](components/home/CLAUDE.md) | Homepage-specific components |
| [components/nav/CLAUDE.md](components/nav/CLAUDE.md) | Top navigation and section navigation components |
| [components/project/CLAUDE.md](components/project/CLAUDE.md) | Project page building blocks |
| [components/terminal/CLAUDE.md](components/terminal/CLAUDE.md) | Terminal aesthetic primitives |
| [components/theme/CLAUDE.md](components/theme/CLAUDE.md) | Theme provider, theme toggle, and theme selection behavior |
| [content/CLAUDE.md](content/CLAUDE.md) | Single source of truth for profile and project copy |
| [lib/CLAUDE.md](lib/CLAUDE.md) | Server-side utilities: database, GitHub cache, page views |
| [lib/validators/CLAUDE.md](lib/validators/CLAUDE.md) | Zod schemas for user input validation |
| [prisma/CLAUDE.md](prisma/CLAUDE.md) | Prisma schema, seed script, SQLite dev, Turso production notes |
| [prisma/migrations/CLAUDE.md](prisma/migrations/CLAUDE.md) | SQL migration history; generated migration files |
| [public/CLAUDE.md](public/CLAUDE.md) | Static assets served from the public root |
| [public/netbox-proxbox/CLAUDE.md](public/netbox-proxbox/CLAUDE.md) | Static assets for the NetBox-Proxbox project page |
| [public/netbox-proxbox/screenshots/CLAUDE.md](public/netbox-proxbox/screenshots/CLAUDE.md) | NetBox-Proxbox screenshot assets |

---

## Agent Rules

1. Read [CLAUDE.md](CLAUDE.md) before starting any code change in this repo.
2. Before editing a file, read the nearest applicable `CLAUDE.md` for that path.
3. Treat `CLAUDE.md` files as the source of truth for implementation context; keep this file as an index.
4. Preserve the locked stack, terminal/CLI design language, theming rules, Zod validation rule, and Prisma/database constraints from [CLAUDE.md](CLAUDE.md).
5. If a new `CLAUDE.md` is added, update this index in the same change.
