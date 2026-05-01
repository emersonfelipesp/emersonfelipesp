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

Two orthogonal axes drive every color:

1. **Light vs dark** — toggled via a `class="dark"` on `<html>` by `components/theme/ThemeProvider.tsx`. Persisted in `localStorage`. A pre-paint inline script in `app/layout.tsx` prevents FOUC.
2. **Palette per route** — a `data-palette` attribute on the page's root element (`netbox` | `proxmox` | `mixed`). The CSS variables in `app/globals.css` are scoped to `[data-palette="..."]` and `.dark [data-palette="..."]`.

**Hard rules:**

- **Never write hex literals in components.** Use semantic Tailwind utilities only: `bg-bg`, `bg-surface`, `bg-surface-2`, `text-fg`, `text-muted`, `border-border`, `text-accent`, `text-accent-2`, `text-success`, `text-warn`, `text-danger`. These resolve via the `--color-*` mappings in `app/globals.css` (backed by `--bg`, `--accent`, etc. CSS vars).
- To add a new palette: extend `app/globals.css` with a new `[data-palette="X"]` and matching `.dark [data-palette="X"]` block. Don't touch component code.
- **Tailwind v4 is CSS-first.** Do not create a `tailwind.config.ts`. All theming lives in `@theme { ... }` and the `:root`/`[data-palette]` blocks in `globals.css`.
- The PostCSS plugin is `@tailwindcss/postcss` — wired in `postcss.config.mjs`. Don't add a different one.

---

## 5. Brand color reference

These are the source-of-truth hex values. They live in `app/globals.css` only — components never reference them directly.

### NetBox (used on `/netbox-proxbox`, `/netbox-sdk`)

| Token       | Light       | Dark        |
| ----------- | ----------- | ----------- |
| `--bg`      | `#ffffff`   | `#001423`   |
| `--fg`      | `#001423`   | `#e6f7f4`   |
| `--accent`  | `#00857d`   | `#00f2d4`   |
| `--accent-2`| `#1f4788`   | `#58a6ff`   |

### Proxmox (used on `/proxmox-sdk`)

| Token       | Light       | Dark        |
| ----------- | ----------- | ----------- |
| `--bg`      | `#ffffff`   | `#0d0d0d`   |
| `--fg`      | `#1a1a1a`   | `#f5f5f5`   |
| `--accent`  | `#e57000`   | `#ff8a1f`   |
| `--accent-2`| `#ad4f00`   | `#e57000`   |

### Mixed (used on `/`)

A creative blend — NetBox teal (`#00f2d4`) + Proxmox orange (`#e57000`) as `--accent` and `--accent-2`. Dark bg `#07101a`. Use both accents intentionally to reinforce the "I work with both worlds" message.

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
npm install
cp .env.example .env      # only the first time
npx prisma migrate deploy
npx prisma generate
npx tsx prisma/seed.ts
npm run dev               # next dev (Turbopack)
```

**Prod (optimized build):**

```bash
./install.sh prod         # interactive installer, picks prod mode
# or by hand:
npm install
cp .env.example .env
npx prisma migrate deploy
npx prisma generate
npm run build             # = prisma generate && next build
npm run start             # serves the .next build on :3000
```

`./install.sh` (no arg) shows an interactive menu; `./install.sh setup` runs install + migrate + seed without booting a server. The script checks Node ≥ 20, creates `.env` if missing, and pretty-prints each step.

## 9. Deployment

- Target: **Vercel**. The `CNAME` file (`emersonfelipesp.com`) is preserved so the domain DNS can be repointed from GitHub Pages to Vercel without losing the apex.
- DNS cutover is the user's call — don't touch it.
- Build command on Vercel: `npm run build` (runs `prisma generate && next build`).
- Set env vars on Vercel: `TURSO_URL`, `TURSO_TOKEN`, optionally `GITHUB_TOKEN` (raises GitHub API rate limit for `lib/github.ts`).

---

## 10. Conventions & don'ts

**Do**
- Use `<TypedCommand>` to introduce every section so the page reads like a terminal session.
- Cache GitHub responses (already done via `GitHubStatsCache` table + 6h staleness in `lib/github.ts`).
- Keep `content/*.ts` as the single source of truth for project copy. Pages are pure presentation.
- Use `data-palette` on the page's outermost `<div>`, not on `<html>`.

**Don't**
- Don't add a `tailwind.config.ts` — Tailwind v4 is CSS-first.
- Don't reference hex literals or named colors in components.
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
