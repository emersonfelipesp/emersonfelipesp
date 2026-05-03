# components/home/

## Purpose
Components used exclusively on the homepage (`/`). They consume structured data from `content/profile.ts` and are not reused on project pages.

## Files

- `ProfileCard.tsx` — Renders the developer bio card in terminal style: name, role, location, email, and social links (GitHub, LinkedIn, etc.) as `[bracketed]` chips.
- `FeaturedProjectsGrid.tsx` — 3-column responsive grid of project cards. Each card links to a project route and displays the project name, tagline, and tech tags from `profile.featuredProjects`.
- `SkillsBlock.tsx` — Displays skill categories (languages, frameworks, databases, platforms, vendors, domains) from `profile.skills` as terminal-output-style lists.
- `ContactForm.tsx` — Client component (`"use client"`). Controlled form that POSTs `{ name, email, message }` to `/api/contact`. Shows inline success or error state after submission.

## Key Conventions

- All data sourced from `content/profile.ts` — do not hardcode strings here.
- `ContactForm` is the only client component in this folder; the others are server components.
