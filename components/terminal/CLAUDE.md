# components/terminal/

## Workspace Context

This file lives at `/root/personal-context/emersonfelipesp/components/terminal/CLAUDE.md` inside the `personal-context` workspace.
Workspace guidance: `/root/personal-context/CLAUDE.md`.
Per-repo deep-dive: `/root/personal-context/claude-reference/emersonfelipesp.md`.
Submodule layout and cross-repo links: `/root/personal-context/claude-reference/dependency-map.md`.

---

## Purpose

Core primitives for the CLI/terminal aesthetic. They are intentionally small
wrappers around semantic Tailwind utilities and shared CSS.

## Files

- `TerminalWindow.tsx` - TTY-style frame with title bar and path label.
- `TypedCommand.tsx` - Animated command prompt line. Client component.
- `Prompt.tsx` - Static prompt prefix.
- `OutputBlock.tsx` - Preformatted terminal output block.
- `AsciiBanner.tsx` - Renders ASCII art while preserving whitespace.
- `BlinkingCursor.tsx` - Blinking block cursor for limited hero use. Client component.

## Key Conventions

- `TypedCommand` and `BlinkingCursor` are client components; the rest are server components.
- Preserve ASCII banner whitespace with `<pre>` or equivalent CSS.
- Do not put fixture-like CLI output here; command output demos belong in `components/project/sims/`.
- Avoid inline hex colors.
