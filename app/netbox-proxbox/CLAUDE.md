# app/netbox-proxbox/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/app/netbox-proxbox/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Showcase route for the `netbox-proxbox` NetBox plugin. Uses the `netbox`
palette and renders localized content from `content/netbox-proxbox.ts` via
`lib/i18n/projects.ts`.

## Files

- `page.tsx` - Server shell. Exports metadata and `dynamic = "force-dynamic"`, increments `/${p.slug}`, loads static release/repo data with `loadProjectShellData("netbox-proxbox")`, and renders `<NetboxProxboxContent releases={...} repo={...} />`.
- `developer/` - Developer-facing companion route. See `developer/CLAUDE.md`.

## Key Conventions

- The client page body lives in `components/project/NetboxProxboxContent.tsx`.
- Screenshots are sourced from `public/netbox-proxbox/screenshots/`; filenames and groups come from content/i18n data.
- Project navigation, actions, stars, and releases are shared through `ProjectNavigation` / `SectionNav`.
- View switching to `/netbox-proxbox/developer` is handled by the global `<ProjectViewToggle>` in `TopNav`.
