# app/netbox-proxbox/community/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/app/netbox-proxbox/community/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Community thread proxy route for the `netbox-proxbox` plugin. Server-fetches the
first-post content from the Proxmox Forum thread and both Reddit posts
(r/Proxmox and r/Netbox) and renders them in the terminal aesthetic.

## Files

- `page.tsx` - Server shell. Exports metadata and `dynamic = "force-dynamic"`,
  calls `fetchCommunityPosts()` and `incrementView`, then renders
  `<NetboxProxboxCommunityContent data={...} />`.

## Key Conventions

- Fetch logic lives in `lib/community-fetch.ts`. The fetch timeout is 8 s.
  If any individual source fails, an error state is rendered for that card
  while the others still display.
- The Proxmox Forum uses HTML extraction (XenForo `bbWrapper`); Reddit uses
  the `.json` API endpoint.
- Markdown equivalent is served at `/md/netbox-proxbox/community` and
  rendered by `lib/markdown/community-pages.ts` (static links, no live fetch).
- The `?content=markdown` query parameter is honoured via
  `renderThemedMarkdownIfRequested` before the live fetch runs.
- This route is indexed in `app/sitemap.ts`, `lib/markdown/routes.ts`
  (routes kind `"community"`, `getLlmsTxt`, `getProjectLlmsTxt`), and the
  `next.config.ts` Markdown Accept-header rewrite.
