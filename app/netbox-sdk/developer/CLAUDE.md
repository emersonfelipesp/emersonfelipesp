# app/netbox-sdk/developer/

## Purpose
Developer-facing companion page for `/netbox-sdk`. Documents the
three-package import boundary, the OpenAPI-driven dynamic CLI, and the
headless Textual pilot E2E harness. Palette inherits from the content
file (`netbox`).

## Files

- `page.tsx` — Server shell. Imports `netboxSdkDeveloper` from
  `content/netbox-sdk-developer.ts`, awaits
  `incrementView('/netbox-sdk/developer')`, then renders
  `<ProjectDeveloperContent base={...} githubUrl={...} />`.

## Key Conventions

- Source of truth for prose lives in `content/netbox-sdk-developer.ts`
  (English). pt-br localization comes from `lib/i18n/developer.ts`.
- `export const dynamic = "force-dynamic"` is required for the page-view
  counter.
- Tabs to `/netbox-sdk` (showcase) are rendered by
  `ProjectDeveloperContent` via `<ProjectViewTabs slug="netbox-sdk" />`.
