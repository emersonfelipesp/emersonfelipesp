# CLAUDE.md — emersonfelipesp.com (v2)

This file is the source of truth for any AI/dev work on this repo. The site is a Next.js portfolio + project pages for Emerson Felipe with a deliberate **terminal / CLI / NetDevOps** aesthetic. Stick to the rules below.

---

## 1. Stack (locked versions)

| Area     | Tool                | Version  |
| -------- | ------------------- | -------- |
| Runtime  | Node.js             | 22.x     |
| Framework| Next.js             | 16.2.4   |
| UI       | React               | 19.2     |
| Lang     | TypeScript          | 6.0      |
| Styling  | Tailwind CSS        | 4.2      |
| Validation | Zod                | 4.x      |
| ORM      | Prisma              | 7.x      |
| Database | SQLite (dev) / Turso libSQL (prod) | — |

Do not silently bump these. If a bump is required, raise it with the user first.

---

## 2. Routes & palettes

| Route              | Purpose                                  | Palette  |
| ------------------ | ---------------------------------------- | -------- |
| `/`                | Profile, bio, featured projects, contact | `mixed`  |
| `/netbox-proxbox`  | NetBox-Proxmox integration plugin info   | `netbox` |
| `/netbox-sdk`      | NetBox SDK + CLI + TUI info              | `netbox` |
| `/proxmox-sdk`     | FastAPI schema-driven Proxmox SDK info   | `proxmox`|

The palette is set on each page's root `<div data-palette="...">`. Every page **must** support both light and dark modes — use the toggle in the top nav to verify.

---

## 3. Design language — terminal / CLI

Everything looks and reads like a terminal session. Specifically:

- **Monospace only.** `--font-mono` is the only font family used site-wide.
- **Prompts** open every interactive section (`<TypedCommand command="..." />` from `components/terminal/`). Format: `user@host:cwd$ command`.
- **Window chrome** (`<TerminalWindow title="~/path">`) wraps marketing/banner content with a tty title bar and stoplight dots.
- **ASCII banners** (`<AsciiBanner art={...} />`) replace traditional hero images. Each project ships its own banner in its `content/*.ts` file.
- **Box-drawing characters** (`├─`, `└─`, `│`, `›`) and `[bracketed]` chips are preferred over generic icons.
- **Blinking cursor** (`<BlinkingCursor />`) for the hero only — don't over-use.
- **No emoji** in scaffolded UI or code. Emoji is acceptable only in user-authored text passed through `content/*.ts`.

---

## 4. Theming rules

Three axes drive every color:

1. **Light vs dark** — toggled via a `class="dark"` on `<html>` by `components/theme/ThemeProvider.tsx`. Persisted in `localStorage`. A pre-paint inline script in `app/layout.tsx` prevents FOUC.
2. **Palette per route** — a `data-palette` attribute on the page's root element (`netbox` | `proxmox` | `mixed`). The CSS variables in `app/globals.css` are scoped to `[data-palette="..."]` and `.dark [data-palette="..."]`.
3. **Named theme override** — a `data-theme="<name>"` attribute on `<html>` selects one of 8 named themes ported from the source projects (netbox-sdk's TUI + proxmox-sdk's CLI): `netbox-dark`, `netbox-light`, `dracula`, `tokyo-night`, `onedark-pro`, `proxmox-dark`, `proxmox-light`, `monokai`. When `data-theme` is set, the per-route `[data-palette]` overrides do **not** apply (CSS guard `html:not([data-theme]) [data-palette="..."]`). When `data-theme` is unset, behavior is exactly the existing light/dark + per-route palette.

The `localStorage["theme"]` key holds one of 10 string values: `default-light`, `default-dark`, or any of the 8 named themes. The two `default-*` entries map to the original light/dark + palette behavior.

**Hard rules:**

- **Never write hex literals in components.** Use semantic Tailwind utilities only: `bg-bg`, `bg-surface`, `bg-surface-2`, `text-fg`, `text-muted`, `border-border`, `text-accent`, `text-accent-2`, `text-success`, `text-warn`, `text-danger`. These resolve via the `--color-*` mappings in `app/globals.css` (backed by `--bg`, `--accent`, etc. CSS vars).
- To add a new palette: extend `app/globals.css` with a new `html:not([data-theme]) [data-palette="X"]` and matching `html:not([data-theme]).dark [data-palette="X"]` block. Don't touch component code.
- To add a new named theme: append a single `[data-theme="X"]` block in `app/globals.css` (defining all 11 semantic vars), then add it to the `THEMES` table in `components/theme/ThemeProvider.tsx` and the `VALID_THEMES`/`DARK_THEMES`/`NAMED_THEMES` arrays in `app/layout.tsx`.
- **Tailwind v4 is CSS-first.** Do not create a `tailwind.config.ts`. All theming lives in `@theme { ... }` and the `:root`/`[data-palette]`/`[data-theme]` blocks in `globals.css`.
- The PostCSS plugin is `@tailwindcss/postcss` — wired in `postcss.config.mjs`. Don't add a different one.

---

## 5. Brand color reference

These are the source-of-truth hex values. They live in `app/globals.css` only — components never reference them directly.

### NetBox (used on `/netbox-proxbox`, `/netbox-sdk`)

| Token       | Light       | Dark        |
| ----------- | ----------- | ----------- |
| `--bg`      | `#f7f5f0`   | `#001423`   |
| `--fg`      | `#001423`   | `#e6f7f4`   |
| `--accent`  | `#00857d`   | `#00f2d4`   |
| `--accent-2`| `#1f4788`   | `#58a6ff`   |

### Proxmox (used on `/proxmox-sdk`)

| Token       | Light       | Dark        |
| ----------- | ----------- | ----------- |
| `--bg`      | `#f7f5f0`   | `#0d0d0d`   |
| `--fg`      | `#1a1a1a`   | `#f5f5f5`   |
| `--accent`  | `#e57000`   | `#ff8a1f`   |
| `--accent-2`| `#ad4f00`   | `#e57000`   |

### Mixed (used on `/`)

A creative blend — NetBox teal (`#00f2d4`) + Proxmox orange (`#e57000`) as `--accent` and `--accent-2`. Dark bg `#07101a`. Use both accents intentionally to reinforce the "I work with both worlds" message.

### 5b. Named themes (`data-theme`)

These 8 themes are global overrides ported from the source projects' theme catalogs. When any is active, the per-route `[data-palette]` overrides above are bypassed — `dracula` looks like dracula on every route. Defined as `[data-theme="..."]` blocks in `app/globals.css`.

| Theme            | Origin                                                   | Dark  | `--bg`    | `--fg`    | `--accent` | `--accent-2` |
| ---------------- | -------------------------------------------------------- | ----- | --------- | --------- | ---------- | ------------ |
| `netbox-dark`    | netbox-sdk TUI (`netbox_tui/themes/netbox-dark.json`)    | yes   | `#001423` | `#E2E8F0` | `#00F2D4`  | `#00857D`    |
| `netbox-light`   | netbox-sdk TUI (`netbox-light.json`)                     | no    | `#F9FAFB` | `#111827` | `#00857D`  | `#00F2D4`    |
| `dracula`        | netbox-sdk TUI (`dracula.json`)                          | yes   | `#282A36` | `#F8F8F2` | `#BD93F9`  | `#6272A4`    |
| `tokyo-night`    | netbox-sdk TUI (`tokyo-night.json`)                      | yes   | `#1A1B26` | `#A9B1D6` | `#7AA2F7`  | `#BB9AF7`    |
| `onedark-pro`    | netbox-sdk TUI (`onedark-pro.json`)                      | yes   | `#282C34` | `#ABB2BF` | `#61AFEF`  | `#C678DD`    |
| `proxmox-dark`   | proxmox-sdk CLI (`proxmox_cli/themes/themes.py` `DARK`)  | yes   | `#0d0d0d` | `#F5F5F5` | `#00DD00`  | `#00DDFF`    |
| `proxmox-light`  | proxmox-sdk CLI (`themes.py` `LIGHT`)                    | no    | `#f7f5f0` | `#1A1A1A` | `#008800`  | `#0088FF`    |
| `monokai`        | proxmox-sdk CLI (`themes.py` `MONOKAI`)                  | yes   | `#272822` | `#F8F8F2` | `#A1EFE4`  | `#F92672`    |

Note: the proxmox-sdk Python `ColorTheme` only defines accent-family colors. For `proxmox-dark`/`proxmox-light` the `--bg`/`--surface`/`--border` were synthesized to mirror the existing `[data-palette="proxmox"]` chrome (so those two themes look like the existing brand-aligned proxmox routes, just with the CLI's bright-green primary instead of brand orange). For `monokai`, canonical Monokai chrome.

---

## 6. Prisma + database

- Local dev: `DATABASE_URL="file:./dev.db"` (already in `.env`). Migrate with `npm run db:migrate`. Seed with `npm run db:seed`.
- Models live in `prisma/schema.prisma`: `ContactMessage`, `PageView`, `GitHubStatsCache`, `Sample`.
- Production on Vercel: Vercel's filesystem is ephemeral, so **swap to libSQL/Turso** before deploying:
  1. Provision a Turso DB.
  2. Install `@libsql/client` and `@prisma/adapter-libsql`.
  3. In `lib/db.ts`, instantiate `PrismaClient` with `{ adapter: new PrismaLibSQL({ url: process.env.TURSO_URL!, authToken: process.env.TURSO_TOKEN! }) }`.
  4. Set `TURSO_URL` and `TURSO_TOKEN` as Vercel env vars; remove `DATABASE_URL` for prod.
- **Never commit `*.db` files.** They are in `.gitignore`. Use Prisma Studio (`npm run db:studio`) to inspect.
- The Prisma client is a singleton in `lib/db.ts` to avoid exhausting connections in dev (Next.js HMR).

---

## 7. Validation rule

Every API route, server action, and any other server entry point that accepts user input **must** validate with Zod 4 (`safeParse`) before touching the database. See `lib/validators/contact.ts` and `app/api/contact/route.ts` for the pattern.

If you add a new mutating endpoint, add a matching schema under `lib/validators/`.

---

## 8. Running locally

There are two supported run modes — both boot on <http://localhost:3000>.

**Dev (hot reload):**

```bash
./install.sh dev          # interactive installer, picks dev mode
# or by hand:
pnpm install
cp .env.example .env      # only the first time
pnpm exec prisma migrate deploy
pnpm exec prisma generate
pnpm db:seed
pnpm dev                  # next dev (Turbopack)
```

**Prod (optimized build):**

```bash
./install.sh prod         # interactive installer, picks prod mode
# or by hand:
pnpm install
cp .env.example .env
pnpm exec prisma migrate deploy
pnpm exec prisma generate
pnpm build                # = prisma generate && next build
pnpm start                # serves the .next build on :3000
```

`./install.sh` (no arg) shows an interactive menu; `./install.sh setup` runs install + migrate + seed without booting a server. The script checks Node ≥ 20, creates `.env` if missing, and pretty-prints each step.

---

## 8b. Quality checks

```bash
pnpm lint          # ESLint via eslint.config.js (flat-config, extends eslint-config-next)
pnpm typecheck     # tsc --noEmit — must run pnpm exec prisma generate first or types are missing
```

**E2E tests (Playwright, Chromium only):**

```bash
# Install browsers once
pnpm exec playwright install --with-deps chromium

# Full suite — requires a production build on :3000
pnpm build && pnpm start &
pnpm test:e2e

# Single spec file
pnpm exec playwright test e2e/smoke.spec.ts

# Filter by test name
pnpm exec playwright test --grep "theme toggle"
```

`playwright.config.ts` launches `pnpm start` (prod build) as the web server — not the dev server.
Locally, `reuseExistingServer: true` so a running `pnpm start` is reused automatically.
`e2e/` contains four suites: `smoke` (all four routes load), `navigation` (nav links), `theme` (toggle + localStorage persistence), `contact` (form submit → success message).

---

## 9. Deployment

- Target: **Vercel**. The `CNAME` file (`emersonfelipesp.com`) is preserved so the domain DNS can be repointed from GitHub Pages to Vercel without losing the apex.
- DNS cutover is the user's call — don't touch it.
- Build command on Vercel: `pnpm build` (runs `prisma generate && next build`).
- Set env vars on Vercel: `TURSO_URL`, `TURSO_TOKEN`, optionally `GITHUB_TOKEN` (raises GitHub API rate limit for `lib/github.ts`).

---

## 10. Conventions & don'ts

**Do**
- Use `<TypedCommand>` to introduce every section so the page reads like a terminal session.
- Cache GitHub responses (already done via `GitHubStatsCache` table + 6h staleness in `lib/github.ts`).
- Keep `content/*.ts` as the single source of truth for project copy. Pages are pure presentation.
- Use `data-palette` on the page's outermost `<div>`, not on `<html>`.
- Run `pnpm typecheck` after any structural change — `pnpm exec prisma generate` must have run first or tsc will error on the missing Prisma client types.

**Don't**
- Don't add a `tailwind.config.ts` — Tailwind v4 is CSS-first.
- Don't reference hex literals or named colors in components. Hex literals belong in `app/globals.css` only — inside `:root`, `.dark`, the `[data-palette]` blocks, or the `[data-theme]` blocks. Each `[data-theme]` block must define all 11 semantic vars (`--bg`, `--surface`, `--surface-2`, `--fg`, `--muted`, `--border`, `--accent`, `--accent-2`, `--success`, `--warn`, `--danger`).
- Don't add emoji in code/UI; the look is intentionally text-first.
- Don't import client components from server components without a `"use client"` directive at the top of the client file.
- Don't bypass Zod validation, even for "obviously safe" payloads.
- Don't reintroduce the old static `index.html` / `marked` setup; the README is now in `content/profile.ts`.

---

## 11. File map (quick reference)

```
app/
  layout.tsx               # root layout, theme bootstrap, nav, footer
  page.tsx                 # homepage (palette: mixed)
  netbox-proxbox/page.tsx  # palette: netbox
  netbox-sdk/page.tsx      # palette: netbox
  proxmox-sdk/page.tsx     # palette: proxmox
  api/contact/route.ts     # POST contact form (Zod-validated → DB)
  api/views/route.ts       # GET / POST page-view counter
  globals.css              # Tailwind v4 + all palette CSS vars
components/
  terminal/                # TerminalWindow, Prompt, TypedCommand, etc.
  theme/                   # ThemeProvider, ThemeToggle
  nav/TopNav.tsx
  project/                 # ProjectHero, FeatureList, InstallSnippet, RepoStatsCard, BadgeRow
  home/                    # ProfileCard, SkillsBlock, FeaturedProjectsGrid, ContactForm
content/
  profile.ts               # bio, skills, socials, banner ASCII
  netbox-proxbox.ts        # project copy + meta
  netbox-sdk.ts
  proxmox-sdk.ts
lib/
  db.ts                    # Prisma singleton
  github.ts                # cached repo-stats fetcher
  views.ts                 # page-view helpers
  validators/contact.ts    # Zod schema
prisma/
  schema.prisma            # ContactMessage, PageView, GitHubStatsCache, Sample
  seed.ts                  # creates initial PageView rows + Sample row
```

---

## 12. Folder documentation

Each folder and subfolder has a `CLAUDE.md` with a purpose summary, file-by-file descriptions, and folder-specific conventions.

| Folder | CLAUDE.md | One-line summary |
|--------|-----------|------------------|
| `app/` | [app/CLAUDE.md](app/CLAUDE.md) | Next.js App Router root — pages, layouts, global CSS |
| `app/api/` | [app/api/CLAUDE.md](app/api/CLAUDE.md) | API route handlers; nodejs runtime, Zod-validated |
| `app/api/contact/` | [app/api/contact/CLAUDE.md](app/api/contact/CLAUDE.md) | `POST /api/contact` — persists contact form submissions |
| `app/api/views/` | [app/api/views/CLAUDE.md](app/api/views/CLAUDE.md) | `GET/POST /api/views` — page-view counter |
| `app/netbox-proxbox/` | [app/netbox-proxbox/CLAUDE.md](app/netbox-proxbox/CLAUDE.md) | NetBox-Proxmox plugin showcase page (palette: netbox) |
| `app/netbox-sdk/` | [app/netbox-sdk/CLAUDE.md](app/netbox-sdk/CLAUDE.md) | NetBox SDK showcase page (palette: netbox) |
| `app/proxmox-sdk/` | [app/proxmox-sdk/CLAUDE.md](app/proxmox-sdk/CLAUDE.md) | Proxmox SDK showcase page (palette: proxmox) |
| `components/` | [components/CLAUDE.md](components/CLAUDE.md) | All reusable React/TSX components, grouped by domain |
| `components/home/` | [components/home/CLAUDE.md](components/home/CLAUDE.md) | Homepage-specific components (ProfileCard, ContactForm, etc.) |
| `components/nav/` | [components/nav/CLAUDE.md](components/nav/CLAUDE.md) | TopNav and SectionNav |
| `components/project/` | [components/project/CLAUDE.md](components/project/CLAUDE.md) | Project page building blocks (hero, features, gallery, stats) |
| `components/project/sims/` | [components/project/sims/CLAUDE.md](components/project/sims/CLAUDE.md) | Demo-command simulators driven by netbox-sdk docgen fixtures |
| `components/terminal/` | [components/terminal/CLAUDE.md](components/terminal/CLAUDE.md) | CLI aesthetic primitives (TerminalWindow, TypedCommand, etc.) |
| `components/theme/` | [components/theme/CLAUDE.md](components/theme/CLAUDE.md) | ThemeProvider and ThemeToggle — three-axis theme system |
| `lib/` | [lib/CLAUDE.md](lib/CLAUDE.md) | Server-side utilities: DB singleton, GitHub cache, view helpers |
| `lib/validators/` | [lib/validators/CLAUDE.md](lib/validators/CLAUDE.md) | Zod schemas for all user input validation |
| `prisma/` | [prisma/CLAUDE.md](prisma/CLAUDE.md) | Schema, seed script, SQLite dev / Turso prod |
| `prisma/migrations/` | [prisma/migrations/CLAUDE.md](prisma/migrations/CLAUDE.md) | Auto-generated SQL migration history — do not edit manually |
| `content/` | [content/CLAUDE.md](content/CLAUDE.md) | Single source of truth for all page copy and project metadata |
| `public/` | [public/CLAUDE.md](public/CLAUDE.md) | Static assets served at root URL |
| `public/netbox-proxbox/` | [public/netbox-proxbox/CLAUDE.md](public/netbox-proxbox/CLAUDE.md) | Assets for the netbox-proxbox project page |
| `public/netbox-proxbox/screenshots/` | [public/netbox-proxbox/screenshots/CLAUDE.md](public/netbox-proxbox/screenshots/CLAUDE.md) | 25 PNG screenshots of the plugin UI |
| `scripts/` | [scripts/CLAUDE.md](scripts/CLAUDE.md) | Build-time helpers (e.g. netbox-sdk fixture sync) |

---

## 13. Real-mock rule for CLI/TUI documentation

Any string rendered on a project page that purports to be CLI or TUI
output **must** originate from netbox-sdk's docgen capture pipeline.
Concretely:

- The website ships a fixture set at `public/netbox-sdk-fixtures/`,
  written by `scripts/sync-netbox-sdk-fixtures.ts` from the local
  `/root/nms/netbox-sdk` checkout. The script runs as a `predev` and
  `prebuild` hook.
- All rendered CLI/TUI output strings must be loaded from those
  fixtures at runtime (via `components/project/sims/useFixture.ts`)
  — never hardcoded.
- The only exception is **simulated user input** (the characters typed
  at a prompt). Even there, the prompt label and the success/echo
  lines must come from a fixture.
- Adding a new simulator: see `components/project/sims/CLAUDE.md`.
- Adding a new netbox-sdk capture: extend
  `/root/nms/netbox-sdk/netbox_cli/docgen_specs.py` and regenerate
  `docs/generated/raw/`. The sync script picks it up automatically
  once added to its `COPIES` table.

If a fixture is missing in CI, the build hard-fails. This is intentional
— the rule is enforced at build time, not by convention.
