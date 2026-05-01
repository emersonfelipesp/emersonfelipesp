"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Mode = "light" | "dark";

type ThemeContextValue = {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("dark");

  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      (localStorage.getItem("theme") as Mode | null)) || null;
    const initial: Mode =
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    apply(initial);
    setModeState(initial);
  }, []);

  function apply(next: Mode) {
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
  }

  function setMode(next: Mode) {
    apply(next);
    localStorage.setItem("theme", next);
    setModeState(next);
  }

  function toggle() {
    setMode(mode === "dark" ? "light" : "dark");
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
