# app/netbox-sdk/developer/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/app/netbox-sdk/developer/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Developer-facing companion page for `/netbox-sdk`. Documents package
boundaries, the OpenAPI-driven dynamic CLI, Textual TUI architecture, and
headless E2E/testing surfaces. Uses the `netbox` palette from the content file.

## Files

- `page.tsx` - Server shell. Imports `netboxSdkDeveloper`, exports metadata and `dynamic = "force-dynamic"`, increments `/netbox-sdk/developer`, loads `loadProjectShellData("netbox-sdk")`, and renders `<ProjectDeveloperContent base={...} githubUrl={...} releases={...} repo={...} />`.

## Key Conventions

- English prose lives in `content/netbox-sdk-developer.ts`; pt-br localization lives in `lib/i18n/developer.ts`.
- View switching back to `/netbox-sdk` is handled by `<ProjectViewToggle>` in `TopNav`.
- Keep any CLI/TUI examples on this page consistent with the fixture-backed real-mock rule.
