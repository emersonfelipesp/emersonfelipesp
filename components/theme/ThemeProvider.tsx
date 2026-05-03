"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme =
  | "default-light"
  | "default-dark"
  | "netbox-dark"
  | "netbox-light"
  | "dracula"
  | "tokyo-night"
  | "onedark-pro"
  | "proxmox-dark"
  | "proxmox-light"
  | "monokai";

export type ThemeEntry = {
  name: Theme;
  label: string;
  dark: boolean;
  group: "default" | "named";
};

export const THEMES: readonly ThemeEntry[] = [
  { name: "default-light", label: "default-light", dark: false, group: "default" },
  { name: "default-dark", label: "default-dark", dark: true, group: "default" },
  { name: "netbox-dark", label: "netbox-dark", dark: true, group: "named" },
  { name: "netbox-light", label: "netbox-light", dark: false, group: "named" },
  { name: "dracula", label: "dracula", dark: true, group: "named" },
  { name: "tokyo-night", label: "tokyo-night", dark: true, group: "named" },
  { name: "onedark-pro", label: "onedark-pro", dark: true, group: "named" },
  { name: "proxmox-dark", label: "proxmox-dark", dark: true, group: "named" },
  { name: "proxmox-light", label: "proxmox-light", dark: false, group: "named" },
  { name: "monokai", label: "monokai", dark: true, group: "named" },
];

const THEME_INDEX: Record<string, ThemeEntry> = Object.fromEntries(
  THEMES.map((t) => [t.name, t]),
);

const DEFAULT_THEME: Theme = "default-dark";

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
    return stored && THEME_INDEX[stored] ? (stored as Theme) : DEFAULT_THEME;
  });

  useEffect(() => {
    applyTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sync DOM on mount; subsequent changes go through setTheme

  function setTheme(next: Theme) {
    applyTheme(next);
    localStorage.setItem("theme", next);
    setThemeState(next);
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
