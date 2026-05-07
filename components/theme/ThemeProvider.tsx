"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import {
  DEFAULT_THEME,
  THEME_INDEX,
  THEMES,
  isTheme,
  type Theme,
  type ThemeEntry,
} from "./theme-definitions";

export { THEMES };
export type { Theme, ThemeEntry };

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(next: Theme) {
  const entry = THEME_INDEX[next];
  if (!entry) return;
  const root = document.documentElement;
  if (entry.group === "named") root.setAttribute("data-theme", next);
  else root.removeAttribute("data-theme");
  root.classList.toggle("dark", entry.dark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored =
      (typeof window !== "undefined" && localStorage.getItem("theme")) || null;
    return isTheme(stored) ? stored : DEFAULT_THEME;
  });

  useEffect(() => {
    applyTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sync DOM on mount; subsequent changes go through setTheme

  function setTheme(next: Theme) {
    localStorage.setItem("theme", next);

    const apply = () => {
      applyTheme(next);
      flushSync(() => setThemeState(next));
    };

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startViewTransition = document.startViewTransition?.bind(document);

    if (reduceMotion || !startViewTransition) {
      apply();
      return;
    }

    const transition = startViewTransition(apply);
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: ["inset(0 0 100% 0)", "inset(0)"] },
          {
            pseudoElement: "::view-transition-new(root)",
            duration: 600,
            easing: "ease-in-out",
          },
        );
      })
      .catch(() => {});
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
