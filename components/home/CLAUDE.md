# components/home/

## Purpose
Components used exclusively on the homepage (`/`). They consume structured data from `content/profile.ts` and are not reused on project pages.

## Files

- `ProfileCard.tsx` — Renders the developer bio card in terminal style: name, role, location, email, and social links (GitHub, LinkedIn, etc.) as `[bracketed]` chips.
- `FeaturedProjectsGrid.tsx` — 3-column responsive grid of project cards. Each card links to a project route and displays the project name, tagline, and tech tags from `profile.featuredProjects`.
- `ProjectsArchitecture.tsx` — Client component (`"use client"`). Terminal-styled diagram showing how the projects fit together (`netbox` → `netbox-proxbox` → `proxbox-api` → `netbox-sdk` / `proxmox-sdk` → respective REST APIs). Each node is a `<button>` (or `<a>` when linking to a project page) with a tooltip describing the project, shown on hover/focus. Tooltip strings live in `t.home.architecture.nodes` (bilingual). The fork under `proxbox-api` is rendered as a small inline SVG so it stays aligned with the two SDK columns at any width. The three nodes that reference upstream brands (`netbox`, `netbox · REST API`, `proxmox · REST API`) render the actual brand logos via the `BrandLogo` helper instead of plain text: NetBox swaps between `/logos/netbox-bright-teal.svg` (dark mode) and `/logos/netbox-dark-teal.svg` (light mode); Proxmox uses the inline-SVG `ProxmoxLogo` component so its monochrome wordmark can pick up the foreground color via `currentColor`.
- `ProxmoxLogo.tsx` — Inline-SVG React component for the Proxmox wordmark + brand mark. The monochrome "PROX"/"MO" letterforms and the hexagonal brand mark use `currentColor` (sourced from the SVG's outer `fill="currentColor"`); the orange "X" letterforms and orange swap arrows preserve the brand `#e57000` verbatim. Used by `ProjectsArchitecture.tsx`'s `BrandLogo` helper. See `public/logos/CLAUDE.md` for why this lives as a component instead of a static SVG.
- `SkillsBlock.tsx` — Displays skill categories (languages, frameworks, databases, platforms, vendors, domains) from `profile.skills` as terminal-output-style lists.
- `ContactForm.tsx` — Client component (`"use client"`). Controlled form that POSTs `{ name, email, message }` to `/api/contact`. Shows inline success or error state after submission.

## Key Conventions

- All data sourced from `content/profile.ts` — do not hardcode strings here.
- `ContactForm` is the only client component in this folder; the others are server components.
