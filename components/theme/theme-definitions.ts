export const THEMES = [
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
] as const;

export type ThemeEntry = (typeof THEMES)[number];
export type Theme = ThemeEntry["name"];

export const DEFAULT_THEME: Theme = "default-dark";

export const THEME_INDEX: Record<string, ThemeEntry> = Object.fromEntries(
  THEMES.map((theme) => [theme.name, theme]),
);

export const VALID_THEMES = THEMES.map((theme) => theme.name);
export const DARK_THEMES = THEMES.filter((theme) => theme.dark).map(
  (theme) => theme.name,
);
export const NAMED_THEMES = THEMES.filter((theme) => theme.group === "named").map(
  (theme) => theme.name,
);

export function isTheme(value: string | null): value is Theme {
  return value !== null && value in THEME_INDEX;
}
