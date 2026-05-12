# CLAUDE.md - emersonfelipesp.com — AGENTS.md Mirror

This file mirrors the sibling `CLAUDE.md` guidance for agents that read `AGENTS.md`. Treat `CLAUDE.md` as the source material; the content below preserves the current guide.

## Source

@CLAUDE.md

---

# CLAUDE.md - emersonfelipesp.com

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

This file is the source of truth for AI/dev work on this repo. The site is a
Next.js portfolio and project documentation surface for Emerson Felipe with a
deliberate terminal / CLI / NetDevOps aesthetic.

## 1. Stack

| Area | Tool | Version |
|---|---|---|
| Runtime | Node.js | 22.x |
| Package manager | pnpm | 10.33.2 |
| Framework | Next.js | 16.2.4 |
| UI | React | 19.2 |
| Language | TypeScript | 6.0 |
| Styling | Tailwind CSS | 4.2 |
| Validation | Zod | 4.x |
| ORM | Prisma | 7.x |
| Database | SQLite dev / Turso libSQL prod | - |

Do not silently bump these. If a bump is required, raise it with the user first.

## 2. Routes And Project Registry

Project metadata is centralized in `lib/project-registry.ts`. Use `PROJECTS`,
`PROJECT_LIST`, `getProject()`, `getProjectFromPath()`, `releaseListPath()`,
and `releaseDetailPath()` instead of duplicating slugs, GitHub repo names, or
project action URLs.

| Route | Purpose | Palette |
|---|---|---|
| `/` | Profile, bio, architecture diagram, featured projects, contact | `mixed` |
| `/netbox-proxbox` | NetBox plugin showcase | `netbox` |
| `/proxbox-api` | FastAPI backend showcase | `mixed` |
| `/netbox-sdk` | NetBox SDK / CLI / TUI showcase | `netbox` |
| `/proxmox-sdk` | Proxmox SDK showcase | `proxmox` |
| `/<project>/developer` | Developer guide for each allowlisted project | project palette |
| `/<project>/releases` | Local release index from committed GitHub snapshots | project palette |
| `/<project>/releases/[...tag]` | Local release detail, including slash-containing tags | project palette |

The palette is set on each page's root `<div data-palette="...">`. Every page
must support light and dark modes.

## 3. Design Language

- Monospace only. `--font-mono` is the only font family used site-wide.
- Use `<TypedCommand command="..." />` to introduce major terminal-style sections.
- Use `<TerminalWindow title="~/path">` for tty-framed hero/banner surfaces.
- Use `<AsciiBanner art={...} />` through project/profile content rather than hero images.
- Prefer box-drawing characters and bracketed labels over generic iconography.
- Keep UI text-first. Do not add emoji in code or scaffolded UI.
- Do not hardcode project copy in pages or components; import content from `content/` or localized wrappers in `lib/i18n/`.

## 4. Theming And Language

Three axes drive color:

1. Light/dark toggles `class="dark"` on `<html>`.
2. Per-route palette uses `data-palette` on the page root.
3. Named theme override uses `data-theme="<name>"` on `<html>`.

Theme source of truth:

- `components/theme/theme-definitions.ts` holds all 10 theme ids: `default-light`, `default-dark`, `netbox-dark`, `netbox-light`, `dracula`, `tokyo-night`, `onedark-pro`, `proxmox-dark`, `proxmox-light`, `monokai`.
- `app/layout.tsx` injects the pre-paint theme script and imports theme constants from `theme-definitions.ts`.
- `components/theme/ThemeProvider.tsx` owns React state and `localStorage["theme"]`.
- All semantic CSS variables and all hex literals live in `app/globals.css`.

Language source of truth:

- `lib/i18n/languages.ts` currently supports `en` and `pt-br`.
- `app/layout.tsx` injects a pre-paint language script that sets `<html lang>`.
- `components/i18n/LanguageProvider.tsx` owns React state and `localStorage["lang"]`.
- Shared labels live in `lib/i18n/dictionary.ts`; profile/project/developer translations live in sibling files under `lib/i18n/`.

Hard rules:

- Never write hex literals in components. Use semantic Tailwind utilities such as `bg-bg`, `bg-surface`, `text-fg`, `text-muted`, `border-border`, `text-accent`, `text-accent-2`, `text-success`, `text-warn`, and `text-danger`.
- Tailwind v4 is CSS-first. Do not create `tailwind.config.ts`.
- To add a named theme, update `app/globals.css` and `components/theme/theme-definitions.ts`.
- To add a language, update `lib/i18n/languages.ts`, `lib/i18n/dictionary.ts`, and the relevant localized content files.

## 5. Data, Prisma, And Validation

- Local dev uses `DATABASE_URL="file:./dev.db"`.
- Production uses Turso/libSQL when `TURSO_URL` is set. `lib/db.ts` switches to `@prisma/adapter-libsql`; otherwise it uses `@prisma/adapter-better-sqlite3`.
- `lib/database-url.ts` resolves Prisma-style SQLite `file:` URLs to the same file used by migrations and seed scripts.
- Current models in `prisma/schema.prisma`: `ContactMessage` and `PageView`.
- Historical migrations include the initial tables and `20260505120000_drop_unused_cache_and_sample`, which removes the old `GitHubStatsCache` and `Sample` tables.
- Never commit `*.db` files.
- Every API route, server action, or server entry point accepting user input must validate with Zod 4 `safeParse` before touching the database. Schemas live in `lib/validators/`.

## 6. Static External Data

GitHub repo and release data is static at runtime:

- `scripts/sync-github-data.ts` fetches release snapshots and repo stars/forks for every `PROJECT_LIST` entry.
- Snapshots are committed under `public/github-data/<slug>.json`; `manifest.json` records sync status.
- `lib/github.ts` reads and validates those files with Zod and returns release summaries, full snapshots, and static repo summaries.
- `.github/workflows/sync-github-data.yml` refreshes the snapshots every 6 hours, manually, or through `repository_dispatch: refresh-github-data`.

No component should fetch GitHub directly in the browser. Project pages receive `releases` and `repo` from `loadProjectShellData()`.

## 7. Real-Mock Rule For CLI/TUI Output

Any string rendered as CLI or TUI output must originate from netbox-sdk's real capture pipeline.

- Website fixtures live in `public/netbox-sdk-fixtures/`.
- `scripts/sync-netbox-sdk-fixtures.ts` imports artifacts from the local `/root/nms/netbox-sdk` checkout and writes the committed fixture set.
- Run it explicitly with `pnpm fixtures:sync`; it is not a `predev` or `prebuild` hook.
- Simulators load fixture files through `components/project/sims/useFixture.ts`.
- Simulated user input may be typed by the website, but prompt labels, output, echo lines, screenshots, and TUI states must be fixture-backed.

If the source checkout is missing but committed fixtures are complete, the sync script warns and exits 0. If both are missing, it hard-fails.

## 8. Running Locally

```bash
./install.sh           # menu: dev / prod / setup
./install.sh dev       # install + migrate + seed + next dev
./install.sh prod      # install + migrate + seed + build + next start
./install.sh setup     # install + migrate + seed only
```

Manual setup:

```bash
pnpm install
cp .env.example .env
pnpm exec prisma migrate deploy
pnpm exec prisma generate
pnpm db:seed
pnpm dev
```

Useful scripts:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test:e2e
pnpm fixtures:sync
pnpm github:sync
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

`pnpm typecheck` requires a generated Prisma client first. `pnpm build` runs
`prisma generate && next build`.

## 9. E2E Tests

Playwright uses Chromium only, split into `desktop-chromium` (`Desktop Chrome`)
and `mobile-chromium` (`Pixel 5`) projects. `playwright.config.ts` runs
`pnpm exec prisma migrate deploy` and launches `pnpm exec next start` on
`127.0.0.1:3100`; it does not use the dev server. API-only specs run on the
desktop project only; UI specs run on both desktop and mobile. CI runs the two
projects as parallel matrix jobs on `push` and `pull_request` for `main`.

Current suites under `e2e/`:

- `smoke`: homepage, showcases, and developer pages load.
- `navigation`: top navigation routes.
- `theme`: dark/light persistence.
- `language`: English / pt-br language toggle and persistence.
- `contact`: contact form behavior.
- `api`: contact persistence and page-view API.
- `releases`: local release index/detail pages and release dropdown.
- `responsive`: desktop/mobile layout checks, nav controls, and overflow guards.
- `netbox-sdk-tui`: fixture-backed TUI modal states and hotspots.

## 10. Deployment

- Target runtime: Vercel-style Next.js build/runtime.
- The `CNAME` file is preserved for `emersonfelipesp.com`.
- DNS cutover is the user's call.
- Build command: `pnpm build`.
- Env vars: `TURSO_URL`, `TURSO_TOKEN`, optionally `GITHUB_TOKEN` for sync jobs.

The GitHub Pages workflow still exists to deploy the profile root plus
netbox-sdk docs artifacts when used, but the app itself is authored as a
Next.js site.

## 11. File Map

```text
app/
  layout.tsx                         # root layout, theme/lang bootstrap, nav, footer
  page.tsx                           # homepage (mixed)
  <project>/page.tsx                 # showcase server shells
  <project>/developer/page.tsx       # developer guide server shells
  [project]/releases/page.tsx        # allowlisted release index
  [project]/releases/[...tag]/page.tsx
  api/contact/route.ts               # POST contact form
  api/views/route.ts                 # GET/POST page views
  globals.css                        # Tailwind v4 and all semantic vars
components/
  home/                              # homepage components
  i18n/                              # LanguageProvider and LanguageToggle
  nav/                               # TopNav, SectionNav, project shell actions
  project/                           # project page sections, simulators, release pages
  terminal/                          # terminal primitives
  theme/                             # ThemeProvider and ThemeToggle
content/
  profile.ts                         # English profile source
  <project>.ts                       # English showcase content
  <project>-developer.ts             # English developer guide content
lib/
  project-registry.ts                # shared project metadata source
  project-shell.ts                   # release/repo data loader for project pages
  github.ts                          # static GitHub snapshot readers
  i18n/                              # dictionaries and translations
  validators/                        # Zod schemas
prisma/
  schema.prisma                      # ContactMessage, PageView
  seed.ts                            # initial PageView rows
public/
  github-data/                       # committed GitHub release/repo snapshots
  netbox-sdk-fixtures/               # committed CLI/TUI fixtures
  netbox-proxbox/screenshots/        # plugin screenshots
scripts/
  sync-github-data.ts
  sync-netbox-sdk-fixtures.ts
```

## 12. Folder Documentation

Each major folder has a scoped `CLAUDE.md`. Keep [AGENTS.md](AGENTS.md) in
sync whenever a guide is added or removed.
