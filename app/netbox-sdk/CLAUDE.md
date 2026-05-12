# app/netbox-sdk/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/app/netbox-sdk/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Showcase route for `netbox-sdk`, the Python async SDK with CLI and Textual TUI.
Uses the `netbox` palette and renders localized content from
`content/netbox-sdk.ts` via `lib/i18n/projects.ts`.

## Files

- `page.tsx` - Server shell. Exports metadata and `dynamic = "force-dynamic"`, concurrently reads `getNetboxSdkMeta()`, increments `/${p.slug}`, loads static release/repo data with `loadProjectShellData("netbox-sdk")`, and renders `<NetboxSdkContent liveMeta={...} releases={...} repo={...} />`.
- `developer/` - Developer-facing companion route. See `developer/CLAUDE.md`.

## Key Conventions

- The client page body lives in `components/project/NetboxSdkContent.tsx`.
- NetBox compatibility and Python/release metadata should prefer `getNetboxSdkMeta()` from committed fixtures, falling back to static content metadata when unavailable.
- CLI/TUI demos must stay fixture-backed through `public/netbox-sdk-fixtures/`.
- View switching to `/netbox-sdk/developer` is handled by the global `<ProjectViewToggle>` in `TopNav`.
