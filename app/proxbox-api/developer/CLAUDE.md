# app/proxbox-api/developer/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/app/proxbox-api/developer/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Developer-facing companion page for `/proxbox-api`. Documents FastAPI
orchestration, SDK boundaries, contribution workflow, GitHub Actions CI, and the
multi-mode E2E matrix. Uses the `mixed` palette from the content file.

## Files

- `page.tsx` - Server shell. Imports `proxboxApiDeveloper`, exports metadata and `dynamic = "force-dynamic"`, increments `/proxbox-api/developer`, loads `loadProjectShellData("proxbox-api")`, and renders `<ProjectDeveloperContent base={...} githubUrl={...} releases={...} repo={...} />`.

## Key Conventions

- English prose lives in `content/proxbox-api-developer.ts`; pt-br localization lives in `lib/i18n/developer.ts`.
- The CI section is rendered from the optional `DeveloperContent.ci` object; keep it aligned with the MkDocs pages `proxbox-api/docs/development/ci-e2e-workflows.md` and `proxbox-api/docs/pt-BR/development/ci-e2e-workflows.md`.
- `ProjectDeveloperContent` suppresses `SideTOC` on the mixed palette to match the proxbox-api showcase.
- View switching back to `/proxbox-api` is handled by `<ProjectViewToggle>` in `TopNav`.
