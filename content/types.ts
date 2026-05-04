export type SectionLink = {
  id: string;
  label: string;
};

export type SimStep =
  | { kind: "banner"; lines: readonly string[]; tone?: "accent" | "success" }
  | { kind: "step"; text: string }
  | { kind: "info"; text: string }
  | { kind: "spinner"; label: string; ms: number; ok: string }
  | { kind: "warn"; text: string }
  | { kind: "blank" }
  | { kind: "tip"; cmd: string; comment?: string };

export type ProjectMeta = {
  license?: string;
  netbox?: string;
  proxmox?: string;
  python?: string;
  latestRelease?: string;
  stars?: number;
  forks?: number;
};

export type ProjectContent = {
  slug: string;
  name: string;
  fullName: string;
  palette: "netbox" | "proxmox";
  tagline: string;
  banner: string;
  sections: readonly SectionLink[];
  meta: ProjectMeta;
  description: readonly string[];
  features: readonly string[];
  stack: readonly string[];
  install: {
    primary: string;
    note?: string;
    runScript?: readonly SimStep[];
  };
  links: Record<string, string>;
};
