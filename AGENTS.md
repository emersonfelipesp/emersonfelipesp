# AGENTS.md - emersonfelipesp Agent Index

Purpose: single entry point for AI coding agents. Project context lives in
`CLAUDE.md` files. This file indexes them only; always read the relevant
`CLAUDE.md` before editing code in that area.

## Quick Start

| What you need | Go here |
|---|---|
| Repo-wide stack, routes, design rules, commands | [CLAUDE.md](CLAUDE.md) |
| Next.js App Router pages, layouts, sitemap, OG image | [app/CLAUDE.md](app/CLAUDE.md) |
| API routes and server entry points | [app/api/CLAUDE.md](app/api/CLAUDE.md) |
| Shared React component domains | [components/CLAUDE.md](components/CLAUDE.md) |
| Showcase/developer copy and metadata | [content/CLAUDE.md](content/CLAUDE.md) |
| Server utilities, project registry, GitHub snapshots | [lib/CLAUDE.md](lib/CLAUDE.md) |
| Prisma schema, seed, migrations | [prisma/CLAUDE.md](prisma/CLAUDE.md) |
| Static assets, release snapshots, fixtures | [public/CLAUDE.md](public/CLAUDE.md) |
| Build-time sync helpers | [scripts/CLAUDE.md](scripts/CLAUDE.md) |

## CLAUDE.md Index

Read the nearest scoped guide for the code you are changing.

- [CLAUDE.md](CLAUDE.md)
- [app/CLAUDE.md](app/CLAUDE.md)
- [app/api/CLAUDE.md](app/api/CLAUDE.md)
- [app/api/contact/CLAUDE.md](app/api/contact/CLAUDE.md)
- [app/api/views/CLAUDE.md](app/api/views/CLAUDE.md)
- [app/[project]/releases/CLAUDE.md](app/[project]/releases/CLAUDE.md)
- [app/netbox-proxbox/CLAUDE.md](app/netbox-proxbox/CLAUDE.md)
- [app/netbox-proxbox/developer/CLAUDE.md](app/netbox-proxbox/developer/CLAUDE.md)
- [app/netbox-sdk/CLAUDE.md](app/netbox-sdk/CLAUDE.md)
- [app/netbox-sdk/developer/CLAUDE.md](app/netbox-sdk/developer/CLAUDE.md)
- [app/proxbox-api/CLAUDE.md](app/proxbox-api/CLAUDE.md)
- [app/proxbox-api/developer/CLAUDE.md](app/proxbox-api/developer/CLAUDE.md)
- [app/proxmox-sdk/CLAUDE.md](app/proxmox-sdk/CLAUDE.md)
- [app/proxmox-sdk/developer/CLAUDE.md](app/proxmox-sdk/developer/CLAUDE.md)
- [components/CLAUDE.md](components/CLAUDE.md)
- [components/home/CLAUDE.md](components/home/CLAUDE.md)
- [components/i18n/CLAUDE.md](components/i18n/CLAUDE.md)
- [components/nav/CLAUDE.md](components/nav/CLAUDE.md)
- [components/project/CLAUDE.md](components/project/CLAUDE.md)
- [components/project/sims/CLAUDE.md](components/project/sims/CLAUDE.md)
- [components/terminal/CLAUDE.md](components/terminal/CLAUDE.md)
- [components/theme/CLAUDE.md](components/theme/CLAUDE.md)
- [content/CLAUDE.md](content/CLAUDE.md)
- [lib/CLAUDE.md](lib/CLAUDE.md)
- [lib/i18n/CLAUDE.md](lib/i18n/CLAUDE.md)
- [lib/validators/CLAUDE.md](lib/validators/CLAUDE.md)
- [prisma/CLAUDE.md](prisma/CLAUDE.md)
- [prisma/migrations/CLAUDE.md](prisma/migrations/CLAUDE.md)
- [public/CLAUDE.md](public/CLAUDE.md)
- [public/github-data/CLAUDE.md](public/github-data/CLAUDE.md)
- [public/logos/CLAUDE.md](public/logos/CLAUDE.md)
- [public/netbox-proxbox/CLAUDE.md](public/netbox-proxbox/CLAUDE.md)
- [public/netbox-proxbox/screenshots/CLAUDE.md](public/netbox-proxbox/screenshots/CLAUDE.md)
- [public/netbox-sdk-fixtures/CLAUDE.md](public/netbox-sdk-fixtures/CLAUDE.md)
- [scripts/CLAUDE.md](scripts/CLAUDE.md)

## Agent Rules

1. Read [CLAUDE.md](CLAUDE.md) before starting any code change in this repo.
2. Before editing a file, read the nearest applicable `CLAUDE.md` for that path.
3. Keep project metadata in `lib/project-registry.ts` as the shared source for project shell routes, actions, release routes, and static GitHub data lookups.
4. Keep user-facing copy bilingual. English lives in `content/`; Brazilian Portuguese lives in `lib/i18n/` and must change in the same patch.
5. Any CLI or TUI output rendered by the site must come from committed fixtures under `public/netbox-sdk-fixtures/`, written by `scripts/sync-netbox-sdk-fixtures.ts`. Never hand-author terminal output.
6. GitHub release/stars data shown in the UI comes from committed `public/github-data/*.json` snapshots written by `scripts/sync-github-data.ts`; do not add browser-side live GitHub fetches.
7. Preserve the locked stack, terminal/CLI design language, theming rules, Zod validation rule, and Prisma/database constraints from [CLAUDE.md](CLAUDE.md).
8. If a new `CLAUDE.md` is added, update this index in the same change.
