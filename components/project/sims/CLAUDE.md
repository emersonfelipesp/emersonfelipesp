# components/project/sims/

## Purpose
Client-side simulators for `nbx demo …` commands. Every output string they
display **must** originate from a fixture written by
`scripts/sync-netbox-sdk-fixtures.ts` from the local `netbox-sdk` repo.
This folder exists to enforce that boundary: nothing in here may
hand-author CLI/TUI output.

## Files

- `useFixture.ts` — Tiny `fetch("/netbox-sdk-fixtures/<name>")` hook with an
  in-module cache and an in-flight de-dupe map. Returns `null` while loading.
- `DemoInitTrace.tsx` — Replays the interactive `nbx demo init` prompt flow.
  Reads `demo-init-flow.json` (prompts + success line, both extracted from
  `netbox_cli/demo.py`). The character-by-character "typed" answers are the
  only synthesized strings; prompt labels and success line come from source.
  Accepts an optional `onDone` callback that fires when the trace lands on
  the success line (used by `DemoInitRunner` to flip its status to `done`).
- `DemoDevicesList.tsx` — Streams the captured stdout of
  `nbx dcim devices list --help` from `demo-devices-list-help.json` line by line
  inside a monospace `<pre>`. Currently a `--help` capture; will become a
  real listing once netbox-sdk's docgen adds a live capture. Accepts an
  optional `onDone` callback that fires when all lines are revealed (used
  by `DemoDevicesListRunner`). Respects `prefers-reduced-motion`.
- `DemoTuiModal.tsx` — Full-screen `role="dialog"` showing
  `tui-main-netbox-{dark|light}.svg`. Variant tracks
  `<html data-theme>` / `<html class="dark">` via `MutationObserver`. ESC
  closes; focus returns to the trigger.

## Fixture contract

Files under `public/netbox-sdk-fixtures/`:

| File | Source | Shape |
|---|---|---|
| `demo-init-help.json` | docgen capture `029-cli-demo-profile-nbx-demo-init-help.json` | `{ surface, section, title, argv, stdout_full, exit_code, ... }` |
| `demo-devices-list-help.json` | docgen capture `016-cli-dynamic-commands-nbx-dcim-devices-list-help.json` | same as above |
| `demo-tui-help.json` | docgen capture `037-tui-main-browser-nbx-demo-tui-help.json` | same as above |
| `tui-main-netbox-dark.svg` | `docs/assets/screenshots/tui-main-netbox-dark.svg` | Rich-rendered TUI screenshot |
| `tui-main-netbox-light.svg` | `docs/assets/screenshots/tui-main-netbox-light.svg` | Rich-rendered TUI screenshot |
| `demo-init-flow.json` | regex-extracted from `netbox_cli/demo.py` | `{ prompts: [{label, hidden, answer}], ok }` |
| `manifest.json` | `git rev-parse HEAD` of netbox-sdk + ISO timestamp | freshness proof |

## Adding a new sim

1. Identify the netbox-sdk artifact (capture JSON or screenshot SVG). If
   one does not exist, add a `CaptureSpec` to
   `/root/nms/netbox-sdk/netbox_cli/docgen_specs.py` and regenerate.
2. Add the source→destination pair to `COPIES` in
   `scripts/sync-netbox-sdk-fixtures.ts`.
3. Add a new `DemoXxx.tsx` component in this folder that consumes the
   fixture via `useFixture`.
4. Wire a `RUN_BY_CMD` entry in `InstallSimulator.tsx`.

## Hard rule

No file in this folder may contain CLI or TUI output strings as literal
constants. Any string that *looks* like terminal output must arrive at
runtime via `useFixture`. Reviewers should grep this folder for
`'$ '`, `'nbx '`, `'┌'`, `'│'`, `'╭'` and reject hits that aren't fixture
loaders.
