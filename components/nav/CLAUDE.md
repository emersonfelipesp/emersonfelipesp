# components/nav/

## Purpose
Navigation components. `TopNav` is the primary site navigation rendered by the root layout on every page.

## Files

- `TopNav.tsx` — Sticky top navigation bar. Shows the site title and links to all four routes (`/`, `/netbox-proxbox`, `/netbox-sdk`, `/proxmox-sdk`). Collapses to a compact mode when the user scrolls down (uses `IntersectionObserver` or scroll listener — client component).
- `SectionNav.tsx` — In-page jump navigation for long pages. Renders anchor links to named sections (whoami, projects, skills, contact) used on the homepage.

## Key Conventions

- `TopNav` is a client component (`"use client"`) due to scroll-detection state.
- Active route highlighting uses Next.js `usePathname()`.
