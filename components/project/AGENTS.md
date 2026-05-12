# components/project/ — AGENTS.md Mirror

This file mirrors the sibling `CLAUDE.md` guidance for agents that read `AGENTS.md`. Treat `CLAUDE.md` as the source material; the content below preserves the current guide.

## Source

@CLAUDE.md

---

# components/project/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/components/project/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Reusable building blocks for showcase pages, developer guide pages, local
release pages, repo stat surfaces, screenshots, and fixture-backed CLI/TUI
demos.

## Files

- `ProjectSections.tsx` - Shared showcase section wrappers: `ProjectNavigation`, `ProjectHeroWindow`, overview/features/stack/install/repo/links sections, and `SectionDivider`.
- `ProjectHero.tsx` - ASCII banner, project slug, tagline, and description.
- `BadgeRow.tsx` - `[label=value]` metadata chips.
- `FeatureList.tsx`, `StepList.tsx`, `SectionHeading.tsx` - Terminal-styled list/step/heading primitives.
- `CodeSnippet.tsx`, `InstallSnippet.tsx`, `use-copy-snippet.ts` - Copyable command/code surfaces.
- `RepoStatsCard.tsx` - Static repo summary display. Data comes from `public/github-data` via page/server props, not live client fetches.
- `ReleasePages.tsx` - Client content for `/[project]/releases` and `/[project]/releases/[...tag]`; uses localized UI labels while preserving GitHub-authored release HTML.
- `ProjectDeveloperContent.tsx` - Client content for every developer guide; localizes via `getDeveloperContent()`, shows shared section navigation/actions/releases, and suppresses `SideTOC` on the mixed palette.
- `NetboxProxboxContent.tsx`, `ProxboxApiContent.tsx`, `NetboxSdkContent.tsx`, `ProxmoxSdkContent.tsx` - Client wrappers for each showcase page. They read the active language, get localized project content, and receive static `releases` / `repo` props from server shells.
- `IntegrationsArchitecture.tsx` - Proxbox integration map used by the proxbox-api showcase.
- `ScreenshotGallery.tsx`, `Screenshot.tsx`, `Lightbox.tsx` - Screenshot grid and modal viewer.
- `RoadmapDiagramOverlay.tsx` - Fullscreen overlay around the roadmap SVG with mouse-wheel + button zoom and drag-to-pan.
- `InstallSimulator.tsx`, `DemoCommandRunner.tsx`, `DemoInitRunner.tsx`, `DemoDevicesListRunner.tsx`, `DemoTuiRunner.tsx` - Interactive netbox-sdk demo runners.
- `sims/` - Fixture-backed CLI/TUI simulation internals.

## Key Conventions

- No hardcoded project prose in components. Showcase source starts in `content/*.ts`; pt-br data lives under `lib/i18n/`.
- Project pages should pass static shell data from `loadProjectShellData()` into content components; do not fetch GitHub from the browser.
- `RepoStatsCard` receives numbers/labels as props and should remain presentation-only.
- `ScreenshotGallery`, `Screenshot`, `Lightbox`, demo runners, release pages, project content wrappers, and developer content are client components.
- Real-mock rule: CLI/TUI output strings must come from `public/netbox-sdk-fixtures/`, loaded through `components/project/sims/useFixture.ts`.
