# public/logos/

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
