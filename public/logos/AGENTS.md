# public/logos/ — AGENTS.md Mirror

This file mirrors the sibling `CLAUDE.md` guidance for agents that read `AGENTS.md`. Treat `CLAUDE.md` as the source material; the content below preserves the current guide.

## Source

@CLAUDE.md

---

# public/logos/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/public/logos/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Brand logo SVG assets used by the homepage architecture diagram to identify
upstream NetBox and Proxmox surfaces.

## Files

- `netbox-bright-teal.svg` - NetBox wordmark for dark backgrounds. Copied from upstream NetBox.
- `netbox-dark-teal.svg` - NetBox wordmark for light backgrounds. Copied from upstream NetBox.

The Proxmox logo is intentionally not stored here as a static SVG. It lives in
`components/home/ProxmoxLogo.tsx` so the monochrome wordmark can inherit
`currentColor` and stay legible in dark mode.

## Key Conventions

- Treat the NetBox SVGs as upstream brand assets. Do not edit their paths or colors.
- Switch light/dark NetBox variants in components with Tailwind visibility utilities.
- Do not add a static `proxmox.svg`; use `ProxmoxLogo.tsx`.
