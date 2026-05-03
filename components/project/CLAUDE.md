# components/project/

## Purpose
Reusable building blocks for composing project showcase pages. Each page under `app/*/` assembles a subset of these components, passing data from its matching `content/*.ts` file. Components are server-rendered by default.

## Files

- `ProjectHero.tsx` — Page header: renders the project's ASCII banner via `<AsciiBanner>`, project title, tagline, and a `<BadgeRow>` of version/license metadata.
- `BadgeRow.tsx` — Horizontal strip of `[bracketed]` tech/version chips. Accepts an array of badge objects from `content/*.ts`.
- `FeatureList.tsx` — Bulleted list of project features, styled as terminal output lines with `›` prefix.
- `InstallSnippet.tsx` — Single-command install block with a copy-to-clipboard button. Wraps `<CodeSnippet>` with a fixed language of `bash`.
- `CodeSnippet.tsx` — Generic syntax-highlighted code block. Accepts `language` and `code` props. Uses monospace styling; no external syntax highlighter library.
- `RepoStatsCard.tsx` — Displays live GitHub stats (stars, forks, language, latest release tag) fetched via `lib/github.ts` (6h cache). Shows `---` placeholders on fetch failure.
- `ScreenshotGallery.tsx` — Responsive grid of project screenshots. Clicking any image opens `<Lightbox>`.
- `Screenshot.tsx` — Individual screenshot with filename caption. Client component — handles click → open lightbox.
- `Lightbox.tsx` — Full-screen image modal overlay. Client component with keyboard (Escape) dismiss support.
- `StepList.tsx` — Numbered installation or configuration steps rendered as terminal output blocks.
- `SectionHeading.tsx` — Section title with a `#` or `$` terminal-prompt prefix decoration.

## Key Conventions

- `ScreenshotGallery`, `Screenshot`, and `Lightbox` are client components; the rest are server components.
- No hardcoded project content — all strings come from `content/*.ts` props.
