# lib/i18n/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/lib/i18n/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Localization source for the site. English baseline content lives in `content/`;
this folder provides shared UI dictionaries and pt-br localized data used by
client content wrappers.

## Files

- `languages.ts` - Supported language ids and HTML language values. Current ids: `en`, `pt-br`.
- `dictionary.ts` - Shared navigation, project chrome, release labels, developer labels, homepage labels, and contact form labels.
- `profile.ts` - Localized profile/homepage data and featured project taglines.
- `projects.ts` - Localizes showcase content and section labels. Imports per-project pt-br modules from `projects/`.
- `projects/netbox-sdk.ts`, `projects/proxbox-api.ts`, `projects/proxmox-sdk.ts` - Split pt-br showcase content modules for larger projects.
- `developer.ts` - Localizes developer-guide content for all four project slugs.

## Key Conventions

- Keep translation keys structurally parallel with the English content they localize.
- Do not translate command text, flags, package names, repo names, code identifiers, or brand names.
- When content changes in `content/`, update this folder in the same patch.
- `DICTIONARIES` is shared UI chrome; long page body translations belong in `profile.ts`, `projects.ts`, `projects/*`, or `developer.ts`.
