# public/netbox-proxbox/screenshots/ — AGENTS.md Mirror

This file mirrors the sibling `CLAUDE.md` guidance for agents that read `AGENTS.md`. Treat `CLAUDE.md` as the source material; the content below preserves the current guide.

## Source

@CLAUDE.md

---

# public/netbox-proxbox/screenshots/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/public/netbox-proxbox/screenshots/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

PNG screenshots of the netbox-proxbox plugin UI. The showcase page renders them
through `ScreenshotGallery` using content/i18n screenshot groups.

## Contents

Views covered include dashboard, clusters, nodes, virtual machines, containers,
storage, snapshots, backups, replications, task history, endpoint lists, and
detail/settings screens.

## Key Conventions

- All files are PNG format.
- Filenames use kebab-case and should describe the plugin view.
- When adding, removing, or renaming screenshots, update the screenshot data in `content/netbox-proxbox.ts` and pt-br localized data in `lib/i18n/projects.ts`.
- Broken image paths render as empty images, so verify the gallery after changes.
