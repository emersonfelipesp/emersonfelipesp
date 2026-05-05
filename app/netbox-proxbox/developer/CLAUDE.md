# app/netbox-proxbox/developer/

## Purpose

Developer-facing companion page for `/netbox-proxbox`. Documents plugin
architecture, proxbox-api integration, contribution workflow, and the Docker E2E
matrix. Uses the `netbox` palette from the content file.

## Files

- `page.tsx` - Server shell. Imports `netboxProxboxDeveloper`, exports metadata and `dynamic = "force-dynamic"`, increments `/netbox-proxbox/developer`, loads `loadProjectShellData("netbox-proxbox")`, and renders `<ProjectDeveloperContent base={...} githubUrl={...} releases={...} repo={...} />`.

## Key Conventions

- English prose lives in `content/netbox-proxbox-developer.ts`; pt-br localization lives in `lib/i18n/developer.ts`.
- View switching back to `/netbox-proxbox` is handled by `<ProjectViewToggle>` in `TopNav`.
- Release dropdowns and star counts come from committed GitHub snapshots through the project shell data loader.
