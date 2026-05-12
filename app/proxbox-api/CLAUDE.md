# app/proxbox-api/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/app/proxbox-api/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Showcase route for `proxbox-api`, the FastAPI backend that connects
netbox-proxbox, netbox-sdk, and proxmox-sdk. Uses the `mixed` palette.

## Files

- `page.tsx` - Server shell. Exports metadata and `dynamic = "force-dynamic"`, increments `/${p.slug}`, loads static release/repo data with `loadProjectShellData("proxbox-api")`, and renders `<ProxboxApiContent releases={...} repo={...} />`.
- `developer/` - Developer-facing companion route. See `developer/CLAUDE.md`.

## Key Conventions

- The client page body lives in `components/project/ProxboxApiContent.tsx`.
- Integration cards and the architecture diagram must stay consistent with `content/proxbox-api.ts` and localized pt-br data in `lib/i18n/projects/proxbox-api.ts`.
- The mixed palette intentionally suppresses the side table of contents in this route.
- View switching to `/proxbox-api/developer` is handled by the global `<ProjectViewToggle>` in `TopNav`.
