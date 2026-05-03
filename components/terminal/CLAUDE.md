# components/terminal/

## Purpose
The core UI primitives that establish the CLI/terminal aesthetic across the entire site. Every page section uses at least one of these components. They are intentionally thin wrappers — styling via semantic Tailwind utilities, no inline hex.

## Files

- `TerminalWindow.tsx` — Wrapper that adds a macOS-style title bar with stoplight dots (red/yellow/green) and a path label. Wraps any content in tty window chrome. Server component.
- `TypedCommand.tsx` — Animated typewriter effect for a command prompt line. Format: `user@host:cwd$ command`. Used to open every major page section. Client component (animation via `useEffect`).
- `Prompt.tsx` — Static (non-animated) command prompt prefix. Used when the full typewriter animation is not needed. Server component.
- `OutputBlock.tsx` — Renders terminal stdout-style output: monospace, muted color, preserves whitespace. Server component.
- `AsciiBanner.tsx` — Renders ASCII art strings passed as a `art` prop, preserving exact whitespace with `<pre>`. Server component.
- `BlinkingCursor.tsx` — A `█` block that blinks via CSS animation. Used only in the homepage hero section — do not scatter throughout the site.

## Key Conventions

- `TypedCommand` and `BlinkingCursor` are client components; the rest are server components.
- `AsciiBanner` must use a `<pre>` tag (or equivalent whitespace-preserve CSS) to keep ASCII art columns intact.
- `BlinkingCursor` is intentionally limited to one hero use — overuse breaks the aesthetic.
