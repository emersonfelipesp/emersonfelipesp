# components/home/

## Purpose

Homepage-only components for `/`. They consume localized profile/home data from
`content/profile.ts` through `lib/i18n/profile.ts` and shared labels from
`lib/i18n/dictionary.ts`.

## Files

- `HomeContent.tsx` - Client wrapper for the localized homepage composition.
- `ProfileCard.tsx` - Terminal-style developer bio card with identity, contact, and social links.
- `FeaturedProjectsGrid.tsx` - Responsive project card grid sourced from featured profile data.
- `ProjectsArchitecture.tsx` - Client diagram showing how NetBox, netbox-proxbox, proxbox-api, netbox-sdk, proxmox-sdk, and REST APIs relate. Tooltip strings are bilingual.
- `ProxmoxLogo.tsx` - Inline Proxmox SVG used so monochrome portions can inherit `currentColor` on dark backgrounds.
- `SkillsBlock.tsx` - Skill category lists.
- `ContactForm.tsx` - Client form that posts `{ name, email, message }` to `/api/contact` and shows success/error state.

## Key Conventions

- Do not hardcode visible copy in these components; use profile/i18n data.
- `HomeContent`, `ProjectsArchitecture`, and `ContactForm` are client components.
- Brand logos are handled by `ProjectsArchitecture.tsx` and `ProxmoxLogo.tsx`; see `public/logos/CLAUDE.md`.
- Contact payload shape must stay aligned with `lib/validators/contact.ts`.
