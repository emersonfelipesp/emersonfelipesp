# emersonfelipesp.com

Source of [emersonfelipesp.com](https://emersonfelipesp.com).

A Next.js 16 + Tailwind 4 + Prisma 7 site with a terminal / NetDevOps aesthetic. Hosts a profile homepage and three dedicated pages for the open-source projects I maintain:

- [`/netbox-proxbox`](https://emersonfelipesp.com/netbox-proxbox) — NetBox plugin syncing Proxmox infrastructure into NetBox.
- [`/netbox-sdk`](https://emersonfelipesp.com/netbox-sdk) — Modern NetBox toolkit: SDK + CLI + TUI.
- [`/proxmox-sdk`](https://emersonfelipesp.com/proxmox-sdk) — Schema-driven FastAPI SDK for the Proxmox API.

## Quick start

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Then open <http://localhost:3000>.

## Stack

Next.js 16.2.4 · React 19.2 · TypeScript 6.0 · Tailwind CSS 4.2 · Zod 4 · Prisma 7 · SQLite

See [`CLAUDE.md`](./CLAUDE.md) for design rules, theming model, brand colors, and contribution conventions.

## License

MIT.
