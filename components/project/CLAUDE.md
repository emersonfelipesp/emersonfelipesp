# components/project/

## Purpose
Reusable building blocks for composing project showcase pages. Each page under `app/*/` assembles a subset of these components, passing data from its matching `content/*.ts` file. Components are server-rendered by default.

## Files

- `ProjectHero.tsx` — Page header: renders the project's ASCII banner via `<AsciiBanner>`, project title, tagline, and a `<BadgeRow>` of version/license metadata.
- `BadgeRow.tsx` — Horizontal strip of `[bracketed]` tech/version chips. Accepts an array of badge objects from `content/*.ts`.
- `FeatureList.tsx` — Bulleted list of project features, styled as terminal output lines with `›` prefix.
- `InstallSnippet.tsx` — Single-command install block with a copy-to-clipboard button. Wraps `<CodeSnippet>` with a fixed language of `bash`.
- `InstallSimulator.tsx` — Client component that streams a fake terminal trace of an installer script, driven by a `SimStep[]` (see `content/types.ts`). Owns the `Run it!` / `stop` / `replay` button, a collapse/expand arrow toggle, and a 10-frame braille spinner; respects `prefers-reduced-motion`. Pages render it standalone (e.g., directly under the project hero). After the install trace finishes, three demo-tip rows are rendered. Only `nbx demo tui` is a clickable button (it opens a modal). The `nbx init` and `nbx dcim devices list` rows are non-interactive labels — their dedicated runners are `DemoInitRunner` and `DemoDevicesListRunner`.
- `DemoCommandRunner.tsx` — Shared client chrome/state for standalone demo commands (`Run it!` / `stop` / `replay`, collapse/expand, prompt row). Dedicated runners pass only the command text and fixture-backed body.
- `DemoInitRunner.tsx` — Client component. Standalone `Run it!` / `stop` / `replay` surface for the `nbx init` demo (the underlying flow still authenticates against demo.netbox.dev — `demo` is hidden from the displayed command), with the same outer chrome as `InstallSimulator` plus a collapse/expand arrow. Wraps `sims/DemoInitTrace` for the streamed body. Mounted directly below the install simulator on the netbox-sdk page.
- `DemoDevicesListRunner.tsx` — Client component. Same standalone pattern as `DemoInitRunner` but for `nbx dcim devices list`. Wraps `sims/DemoDevicesList` (line-by-line streamed rendering of stdout captured live from `nbx demo dcim devices list`; `demo` is stripped from the fixture's `argv` so the trailer matches the displayed command). Mounted directly below `DemoInitRunner`.
- `DemoTuiRunner.tsx` — Client component. Standalone `nbx tui` prompt row with the same `Run it!` treatment as the other demo rows. Opens `sims/DemoTuiModal`, which renders generated TUI simulation SVG states and fixture-defined hotspots.
- `sims/` — Per-command sub-simulations driven entirely by `public/netbox-sdk-fixtures/*` (see `sims/CLAUDE.md`). No hand-authored CLI/TUI strings allowed in this folder.
- `CodeSnippet.tsx` — Generic syntax-highlighted code block. Accepts `language` and `code` props. Uses monospace styling; no external syntax highlighter library.
- `RepoStatsCard.tsx` — Displays live GitHub stats (stars, forks, language, latest release tag) fetched via `lib/github.ts` (6h cache). Shows `---` placeholders on fetch failure.
- `ScreenshotGallery.tsx` — Responsive grid of project screenshots. Clicking any image opens `<Lightbox>`.
- `Screenshot.tsx` — Individual screenshot with filename caption. Client component — handles click → open lightbox.
- `Lightbox.tsx` — Full-screen image modal overlay. Client component with keyboard (Escape) dismiss support.
- `StepList.tsx` — Numbered installation or configuration steps rendered as terminal output blocks.
- `SectionHeading.tsx` — Section title with a `#` or `$` terminal-prompt prefix decoration.
- `NetboxSdkContent.tsx` — Client wrapper (`"use client"`) for the `/netbox-sdk` page body. Reads `lang` via `useLanguage()`, calls `getNetboxSdk(lang)` from `lib/i18n/projects.ts`, and accepts a server-fetched `liveMeta` prop (from `getNetboxSdkMeta()`).
- `NetboxProxboxContent.tsx` — Client wrapper (`"use client"`) for the `/netbox-proxbox` page body. Sources content from `getNetboxProxbox(lang)` and pulls localized section headings, StepList titles, configure intro, and section dividers from `t.project.sections.*` / `t.project.proxbox.*`.
- `ProxmoxSdkContent.tsx` — Client wrapper (`"use client"`) for the `/proxmox-sdk` page body. Sources content from `getProxmoxSdk(lang)`.
- `ReleasePages.tsx` — Client wrappers for `/[project]/releases` and
  `/[project]/releases/[tag]`. They receive server-read GitHub snapshot data
  and use `useLanguage()` only for local UI labels; release note content
  remains GitHub-authored.

## Key Conventions

- `ScreenshotGallery`, `Screenshot`, and `Lightbox` are client components; the rest are server components.
- No hardcoded project content — all strings come from `content/*.ts` props.
- **Real-mock rule (binding):** any CLI or TUI output string rendered by these components must come from a fixture under `public/netbox-sdk-fixtures/` written by `scripts/sync-netbox-sdk-fixtures.ts`. Hand-authored terminal output is forbidden in this folder. See top-level `CLAUDE.md` §13 and `sims/CLAUDE.md`.
