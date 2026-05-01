"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { mode, toggle } = useTheme();
  const isDark = mode === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="border border-border px-2 py-1 text-xs hover:border-accent hover:text-accent transition-colors"
    >
      <span className="text-muted">--theme=</span>
      <span className={isDark ? "text-accent" : "text-muted"}>dark</span>
      <span className="text-muted">|</span>
      <span className={!isDark ? "text-accent" : "text-muted"}>light</span>
    </button>
  );
}
