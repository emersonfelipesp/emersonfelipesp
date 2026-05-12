# components/nav/ — AGENTS.md Mirror

This file mirrors the sibling `CLAUDE.md` guidance for agents that read `AGENTS.md`. Treat `CLAUDE.md` as the source material; the content below preserves the current guide.

## Source

@CLAUDE.md

---

# components/nav/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/components/nav/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Navigation and project-shell controls. These components connect the global top
nav, in-page section nav, release dropdowns, GitHub/PyPI/Docker actions, and
showcase/developer view switching.

## Files

- `TopNav.tsx` - Sticky global navigation. Builds project links from `PROJECT_LIST`, reads localized labels from `useLanguage()`, shows `<ProjectViewToggle>` on showcase/developer routes, and updates `--topnav-h` for lower sticky bars.
- `SectionNav.tsx` - Sticky in-page section navigation with active-section tracking. Delegates action/star/release controls to `<NavActions>`.
- `SideTOC.tsx` - Desktop-only side table of contents for nested groups/steps within the active section.
- `ProjectShellBar.tsx` - Compact sticky action bar used by release pages; wraps `<NavActions>`.
- `NavActions.tsx` - Shared GitHub/PyPI/Docker icons, star count display, and `<ReleasesDropdown>` composition used by `SectionNav` and `ProjectShellBar`.
- `ProjectViewToggle.tsx` - Client listbox that switches between `/<slug>` and `/<slug>/developer`.
- `ReleasesDropdown.tsx` - Keyboard-accessible release selector. Navigates locally when `basePath` is provided; otherwise opens GitHub release URLs.
- `project-shell-labels.ts` - Maps registry action metadata to localized `SectionAction` labels.
- `use-scroll-compact.ts` - Shared scroll threshold hook for compact nav controls.
- `Footer.tsx` - Site footer rendered by the root layout.

## Key Conventions

- `TopNav`, `SectionNav`, `ProjectShellBar`, `ProjectViewToggle`, `ReleasesDropdown`, and `NavActions` are client components.
- Project route membership and action URLs must come from `lib/project-registry.ts`.
- Do not duplicate icon SVGs between action surfaces; add a new icon to `NavActions.tsx` and the `ProjectActionIcon` type if a new action kind is required.
- Keep release navigation local for allowlisted projects by passing `releasesBasePath`.
- Use `--topnav-h` for sticky offsets so wrapped/compact nav height changes do not overlap page content.
