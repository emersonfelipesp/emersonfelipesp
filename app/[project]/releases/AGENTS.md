# app/[project]/releases/ — AGENTS.md Mirror

This file mirrors the sibling `CLAUDE.md` guidance for agents that read `AGENTS.md`. Treat `CLAUDE.md` as the source material; the content below preserves the current guide.

## Source

@CLAUDE.md

---

# app/[project]/releases/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/app/[project]/releases/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Dynamic, allowlisted local GitHub release pages. They render release indexes and
release details from committed JSON snapshots under `public/github-data/`; they
do not fetch GitHub at request time.

## Files

- `page.tsx` - `/<project>/releases`. Validates the project slug with `getReleaseProject()`, reads the project snapshot via `getGitHubSnapshot()`, increments the release-list view path, and renders `<ReleaseListContent />`.
- `[...tag]/page.tsx` - `/<project>/releases/<tag>`. Uses a catch-all segment so slash-containing tags round-trip correctly. Reads the same snapshot, finds the matching release, increments the encoded detail path, and renders `<ReleaseDetailContent />`.

## Key Conventions

- Only slugs in `lib/project-registry.ts` are valid. Unknown project slugs must call `notFound()`.
- Release URLs and canonical paths must use `releaseListPath()` and `releaseDetailPath()` from `lib/release-projects.ts` / `lib/project-registry.ts`.
- Release note HTML comes from the GitHub-rendered `bodyHtml` field in the snapshot. Do not add a client-side Markdown renderer.
- Local UI labels are localized through `t.project.releases`; GitHub-authored release content remains as authored upstream.
- Keep `dynamic = "force-dynamic"` so view counts update.
