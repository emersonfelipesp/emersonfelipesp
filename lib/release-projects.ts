export type ReleaseProject = {
  slug: string;
  name: string;
  fullName: string;
  palette: "netbox" | "proxmox" | "mixed";
  tagline: string;
  projectPath: string;
  repoUrl: string;
  releasesUrl: string;
};

export const RELEASE_PROJECTS = [
  {
    slug: "netbox-proxbox",
    name: "netbox-proxbox",
    fullName: "emersonfelipesp/netbox-proxbox",
    palette: "netbox",
    tagline:
      "NetBox plugin that synchronizes Proxmox infrastructure into NetBox via a FastAPI backend.",
    projectPath: "/netbox-proxbox",
    repoUrl: "https://github.com/emersonfelipesp/netbox-proxbox",
    releasesUrl: "https://github.com/emersonfelipesp/netbox-proxbox/releases",
  },
  {
    slug: "proxbox-api",
    name: "proxbox-api",
    fullName: "emersonfelipesp/proxbox-api",
    palette: "mixed",
    tagline:
      "FastAPI orchestrator that bridges Proxmox VE and NetBox for the Proxbox suite.",
    projectPath: "/proxbox-api",
    repoUrl: "https://github.com/emersonfelipesp/proxbox-api",
    releasesUrl: "https://github.com/emersonfelipesp/proxbox-api/releases",
  },
  {
    slug: "netbox-sdk",
    name: "netbox-sdk",
    fullName: "emersonfelipesp/netbox-sdk",
    palette: "netbox",
    tagline:
      "Modern NetBox toolkit: async SDK, Typer CLI, and Textual TUI for infrastructure automation.",
    projectPath: "/netbox-sdk",
    repoUrl: "https://github.com/emersonfelipesp/netbox-sdk",
    releasesUrl: "https://github.com/emersonfelipesp/netbox-sdk/releases",
  },
  {
    slug: "proxmox-sdk",
    name: "proxmox-sdk",
    fullName: "emersonfelipesp/proxmox-sdk",
    palette: "proxmox",
    tagline:
      "Schema-driven FastAPI SDK for the Proxmox VE API with generated endpoints and mock/real modes.",
    projectPath: "/proxmox-sdk",
    repoUrl: "https://github.com/emersonfelipesp/proxmox-sdk",
    releasesUrl: "https://github.com/emersonfelipesp/proxmox-sdk/releases",
  },
] as const satisfies readonly ReleaseProject[];

export function getReleaseProject(slug: string): ReleaseProject | null {
  return RELEASE_PROJECTS.find((project) => project.slug === slug) ?? null;
}

export function releaseListPath(slug: string): string {
  return `/${slug}/releases`;
}

export function releaseDetailPath(slug: string, tag: string): string {
  const encodedTag = tag
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${releaseListPath(slug)}/${encodedTag}`;
}
