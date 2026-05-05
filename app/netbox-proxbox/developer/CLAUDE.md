# app/netbox-proxbox/developer/

## Purpose
Developer-facing companion page for `/netbox-proxbox`. Documents the
plugin's architecture, integrations with `proxbox-api`, contribution
workflow, and the Docker E2E matrix. Palette inherits from the content
file (`netbox`).

## Files

- `page.tsx` — Server shell. Imports `netboxProxboxDeveloper` from
  `content/netbox-proxbox-developer.ts`, awaits
  `incrementView('/netbox-proxbox/developer')`, then renders
  `<ProjectDeveloperContent base={...} githubUrl={...} />`.

## Key Conventions

- Source of truth for prose lives in `content/netbox-proxbox-developer.ts`
  (English). pt-br localization comes from `lib/i18n/developer.ts`.
- `export const dynamic = "force-dynamic"` is required for the page-view
  counter.
- Tabs to `/netbox-proxbox` (showcase) are rendered by
  `ProjectDeveloperContent` via `<ProjectViewTabs slug="netbox-proxbox" />`.
