# app/proxbox-api/developer/

## Purpose
Developer-facing companion page for `/proxbox-api`. Documents the
FastAPI factory, route layers, sync workflow, contribution workflow,
and the multi-mode E2E matrix. Palette inherits from the content file
(`mixed`) — `<SideTOC>` is intentionally suppressed by
`ProjectDeveloperContent` for the mixed palette to mirror the showcase
page.

## Files

- `page.tsx` — Server shell. Imports `proxboxApiDeveloper` from
  `content/proxbox-api-developer.ts`, awaits
  `incrementView('/proxbox-api/developer')`, then renders
  `<ProjectDeveloperContent base={...} githubUrl={...} />`.

## Key Conventions

- Source of truth for prose lives in `content/proxbox-api-developer.ts`
  (English). pt-br localization comes from `lib/i18n/developer.ts`.
- `export const dynamic = "force-dynamic"` is required for the page-view
  counter.
- Tabs to `/proxbox-api` (showcase) are rendered by
  `ProjectDeveloperContent` via `<ProjectViewTabs slug="proxbox-api" />`.
