# public/netbox-sdk-fixtures/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/public/netbox-sdk-fixtures/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Committed fixture set for netbox-sdk CLI/TUI demos on `/netbox-sdk`. These files
are the only allowed source for terminal output strings and TUI state images
rendered by the website.

## Files

- `demo-init-help.json`, `demo-tui-help.json` - netbox-sdk docgen capture JSON.
- `demo-devices-list.json` - Captured stdout from `nbx demo dcim devices list`, with displayed argv rewritten to omit `demo`.
- `demo-init-flow.json` - Prompt labels and success line extracted from `netbox_cli/demo.py`.
- `netbox-sdk-metadata.json` - netbox-sdk version, Python lower bound, and supported NetBox versions.
- `tui-main-netbox-*.svg` - Static TUI screenshots.
- `tui-simulation/main-browser.json` and sibling SVGs - Interactive TUI states and hotspots.
- `manifest.json` - Source repo, source commit, sync timestamp, and file list.

## Key Conventions

- Regenerate with `pnpm fixtures:sync`.
- Do not hand-author CLI/TUI output in components or fixtures.
- If a fixture shape changes, update `components/project/sims/` and Playwright coverage in the same change.
- Keep generated SVG/JSON files committed so production builds work without the sibling netbox-sdk checkout.
