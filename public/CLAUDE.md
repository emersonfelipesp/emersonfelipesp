# public/

## Purpose
Static assets served directly by Next.js at the root URL path (e.g., `public/foo.png` → `/foo.png`). No build processing is applied. Currently used exclusively for project screenshot images.

## Subdirectories

- `netbox-proxbox/` — Assets for the NetBox-Proxmox plugin project page (see `netbox-proxbox/CLAUDE.md`)

## Key Conventions

- Files in `public/` are publicly accessible by URL — do not place secrets, private keys, or sensitive data here.
- Image filenames must be stable — they are referenced by string in `content/netbox-proxbox.ts` and rendered by `ScreenshotGallery`.
- Next.js serves these with long-lived cache headers in production; bust cache by renaming files when content changes significantly.
