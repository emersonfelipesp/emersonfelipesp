import type { Palette } from "@/lib/project-registry";

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
  palette: Palette;
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

export type DeveloperIntegration = {
  target: string;
  protocol: string;
  library: string;
  notes?: string;
};

export type DeveloperCheck = {
  label: string;
  cmd: string;
};

export type DeveloperWorkflow = {
  name: string;
  trigger: string;
  purpose: string;
};

export type DeveloperContent = {
  slug: string;
  name: string;
  fullName: string;
  palette: Palette;
  tagline: string;
  banner: string;
  sections: readonly SectionLink[];
  intro: readonly string[];
  architecture: {
    bullets: readonly string[];
  };
  integrations: readonly DeveloperIntegration[];
  contributing: {
    devInstall: string;
    checks: readonly DeveloperCheck[];
    codeStyle: readonly string[];
    issuesUrl: string;
  };
  ci?: {
    intro: readonly string[];
    workflows: readonly DeveloperWorkflow[];
    notes?: readonly string[];
  };
  e2e: {
    framework: string;
    intro: readonly string[];
    commands: readonly DeveloperCheck[];
    coverage: readonly string[];
    ciWorkflow?: string;
    ciWorkflowUrl?: string;
  };
  links: Record<string, string>;
};
