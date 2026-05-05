# app/proxmox-sdk/developer/

## Purpose
Developer-facing companion page for `/proxmox-sdk`. Documents the
codegen pipeline (Playwright crawler → OpenAPI → Pydantic), the
pluggable backend layer (https / mock / local / ssh), and the
integration boundary that proxbox-api and netbox-proxbox depend on.
Palette inherits from the content file (`proxmox`).

## Files

- `page.tsx` — Server shell. Imports `proxmoxSdkDeveloper` from
  `content/proxmox-sdk-developer.ts`, awaits
  `incrementView('/proxmox-sdk/developer')`, then renders
  `<ProjectDeveloperContent base={...} githubUrl={...} />`.

## Key Conventions

- Source of truth for prose lives in `content/proxmox-sdk-developer.ts`
  (English). pt-br localization comes from `lib/i18n/developer.ts`.
- `export const dynamic = "force-dynamic"` is required for the page-view
  counter.
- Tabs to `/proxmox-sdk` (showcase) are rendered by
  `ProjectDeveloperContent` via `<ProjectViewTabs slug="proxmox-sdk" />`.
