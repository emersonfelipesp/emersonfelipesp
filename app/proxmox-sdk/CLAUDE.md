# app/proxmox-sdk/

## Purpose

Showcase route for `proxmox-sdk`, the schema-driven FastAPI/SDK surface for the
Proxmox VE API. Uses the `proxmox` palette.

## Files

- `page.tsx` - Server shell. Exports metadata and `dynamic = "force-dynamic"`, increments `/${p.slug}`, loads static release/repo data with `loadProjectShellData("proxmox-sdk")`, and renders `<ProxmoxSdkContent releases={...} repo={...} />`.
- `developer/` - Developer-facing companion route. See `developer/CLAUDE.md`.

## Key Conventions

- The client page body lives in `components/project/ProxmoxSdkContent.tsx`.
- Keep Proxmox branding on the `proxmox` palette and verify both light and dark variants after visual changes.
- Project navigation, actions, stars, and releases are shared through `ProjectNavigation` / `SectionNav`.
- View switching to `/proxmox-sdk/developer` is handled by the global `<ProjectViewToggle>` in `TopNav`.
