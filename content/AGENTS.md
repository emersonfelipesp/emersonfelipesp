# content/ — AGENTS.md Mirror

This file mirrors the sibling `CLAUDE.md` guidance for agents that read `AGENTS.md`. Treat `CLAUDE.md` as the source material; the content below preserves the current guide.

## Source

@CLAUDE.md

---

# content/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/content/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

English source content for profile, showcase pages, and developer guide pages.
Pages and components are presentational; they should not hardcode project prose
or metadata that belongs here or in `lib/project-registry.ts`.

## Files

- `profile.ts` - Homepage profile source: identity, bio, skills, socials, featured projects, company link, and homepage ASCII banner.
- `types.ts` - Shared content shapes for project showcase content, developer content, sections, metadata, and simulator steps.
- `netbox-proxbox.ts`, `proxbox-api.ts`, `netbox-sdk.ts`, `proxmox-sdk.ts` - English showcase content for each project. Registry-backed fields such as slug/name/repo/palette should come from `PROJECTS`.
- `netbox-proxbox-developer.ts`, `proxbox-api-developer.ts`, `netbox-sdk-developer.ts`, `proxmox-sdk-developer.ts` - English developer guide content for each project.

## Key Conventions

- Project identity, GitHub repo, route paths, release URLs, palette, and project actions belong in `lib/project-registry.ts`; content files should import and reuse that metadata.
- All user-facing English strings added here require matching pt-br translations under `lib/i18n/` in the same change.
- ASCII banner strings use raw/template literals. Preserve whitespace exactly.
- Commands, package names, CLI flags, repo names, ASN values, brand names, and code identifiers are not translated.
- `content/types.ts` should stay structural and framework-light; avoid coupling it to rendering components.
