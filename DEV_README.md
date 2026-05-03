# emersonfelipesp.com — Developer Docs

> For the public profile, see [README.md](./README.md).

Source of [emersonfelipesp.com](https://emersonfelipesp.com).

A Next.js 16 + Tailwind 4 + Prisma 7 site with a terminal / NetDevOps aesthetic. Hosts a profile homepage and three dedicated pages for the open-source projects I maintain:

- [`/netbox-proxbox`](https://emersonfelipesp.com/netbox-proxbox) — NetBox plugin syncing Proxmox infrastructure into NetBox.
- [`/netbox-sdk`](https://emersonfelipesp.com/netbox-sdk) — Modern NetBox toolkit: SDK + CLI + TUI.
- [`/proxmox-sdk`](https://emersonfelipesp.com/proxmox-sdk) — Schema-driven FastAPI SDK for the Proxmox API.

## Quick start

The fastest path is the interactive installer:

```bash
./install.sh           # menu: pick dev / prod / setup
./install.sh dev       # install + run dev server (hot reload)
./install.sh prod      # install + build + start production server
./install.sh setup     # install + migrate + seed only (no server)
./install.sh --help
```

It checks prerequisites, copies `.env` from `.env.example` if missing, installs deps, runs `prisma migrate deploy`, seeds, then boots the chosen mode on <http://localhost:3000>.

### Run by hand

**Development (hot reload):**

```bash
pnpm install
cp .env.example .env
npx prisma migrate deploy
npx prisma generate
npx tsx prisma/seed.ts
pnpm run dev
```

**Production (optimized build):**

```bash
pnpm install
cp .env.example .env
npx prisma migrate deploy
npx prisma generate
pnpm run build      # prisma generate + next build
pnpm run start      # serves the .next build on :3000
```

Both modes serve on <http://localhost:3000>. For prod-on-Vercel, see [`CLAUDE.md`](./CLAUDE.md) §6 for the libSQL/Turso swap.

## Stack

Next.js 16.2.4 · React 19.2 · TypeScript 6.0 · Tailwind CSS 4.2 · Zod 4 · Prisma 7 · SQLite

See [`CLAUDE.md`](./CLAUDE.md) for design rules, theming model, brand colors, and contribution conventions.

## License

MIT.
