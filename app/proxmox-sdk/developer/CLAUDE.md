# app/proxmox-sdk/developer/

## Purpose

Developer-facing companion page for `/proxmox-sdk`. Documents code generation,
runtime backends, CLI/TUI boundaries, and integration expectations for downstream
projects. Uses the `proxmox` palette from the content file.

## Files

- `page.tsx` - Server shell. Imports `proxmoxSdkDeveloper`, exports metadata and `dynamic = "force-dynamic"`, increments `/proxmox-sdk/developer`, loads `loadProjectShellData("proxmox-sdk")`, and renders `<ProjectDeveloperContent base={...} githubUrl={...} releases={...} repo={...} />`.

## Key Conventions

- English prose lives in `content/proxmox-sdk-developer.ts`; pt-br localization lives in `lib/i18n/developer.ts`.
- View switching back to `/proxmox-sdk` is handled by `<ProjectViewToggle>` in `TopNav`.
- Keep generated-code guidance clear: generated proxmox-sdk artifacts are regenerated upstream, not edited in this site.
