export type SectionLink = {
  id: string;
  label: string;
};

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
  install: { primary: string; note?: string };
  links: Record<string, string>;
};
