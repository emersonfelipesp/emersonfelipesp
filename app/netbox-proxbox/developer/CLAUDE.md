# app/netbox-proxbox/developer/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/app/netbox-proxbox/developer/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Developer-facing companion page for `/netbox-proxbox`. Documents plugin
architecture, proxbox-api integration, contribution workflow, GitHub Actions CI,
and the Docker E2E matrix. Uses the `netbox` palette from the content file.

## Files

- `page.tsx` - Server shell. Imports `netboxProxboxDeveloper`, exports metadata and `dynamic = "force-dynamic"`, increments `/netbox-proxbox/developer`, loads `loadProjectShellData("netbox-proxbox")`, and renders `<ProjectDeveloperContent base={...} githubUrl={...} releases={...} repo={...} />`.

## Key Conventions

- English prose lives in `content/netbox-proxbox-developer.ts`; pt-br localization lives in `lib/i18n/developer.ts`.
- The CI section is rendered from the optional `DeveloperContent.ci` object; keep it aligned with the MkDocs page `netbox-proxbox/docs/developer/ci-e2e-workflows.md`.
- View switching back to `/netbox-proxbox` is handled by `<ProjectViewToggle>` in `TopNav`.
- Release dropdowns and star counts come from committed GitHub snapshots through the project shell data loader.
