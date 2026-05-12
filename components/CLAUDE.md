# components/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/components/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Reusable React/TSX components, organized by feature domain. Components are
server components by default; add `"use client"` only when state, effects,
browser APIs, routing hooks, or DOM interaction require it.

## Subdirectories

- `home/` - Homepage-specific profile, skills, architecture, featured projects, and contact components.
- `i18n/` - Client-side language provider and language dropdown.
- `nav/` - Top navigation, section navigation, project view switcher, release dropdowns, and shared action icons.
- `project/` - Project showcase/developer/release page building blocks and fixture-backed demos.
- `terminal/` - Terminal aesthetic primitives.
- `theme/` - Theme provider, theme definitions, and theme dropdown.

## Key Conventions

- Never write hex literals in normal components. Use semantic Tailwind utilities backed by `app/globals.css`.
- No emoji in component markup.
- User-facing copy should come from `content/` or `lib/i18n/`, not hardcoded strings, except stable command labels and non-visible accessibility glue.
- Do not import Node-only `lib/` modules into client components unless the module is browser-safe. Registry and i18n helpers are safe; DB/filesystem helpers are not.
- Project pages should use shared wrappers in `components/project/ProjectSections.tsx` where possible to keep navigation, badges, repo stats, and section chrome consistent.
