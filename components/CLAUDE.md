# components/

## Purpose
All reusable React/TSX components, organized into five subdirectories by feature domain. No component file lives directly in this folder — every component belongs to a subdirectory. Components are server components by default; add `"use client"` only when browser APIs or React state/effects are needed.

## Subdirectories

- `terminal/` — Core UI primitives establishing the CLI aesthetic (see `terminal/CLAUDE.md`)
- `theme/` — Theme provider and toggle dropdown (see `theme/CLAUDE.md`)
- `nav/` — Top navigation and section navigation (see `nav/CLAUDE.md`)
- `project/` — Project showcase page building blocks (see `project/CLAUDE.md`)
- `home/` — Homepage-specific components (see `home/CLAUDE.md`)

## Key Conventions

- Never write hex literals — use semantic Tailwind utilities only: `bg-bg`, `bg-surface`, `bg-surface-2`, `text-fg`, `text-muted`, `border-border`, `text-accent`, `text-accent-2`, `text-success`, `text-warn`, `text-danger`.
- No emoji in component markup — text-first aesthetic.
- Client components (`"use client"`) may not be imported directly from server components without the directive; Next.js will error.
