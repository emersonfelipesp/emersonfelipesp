export type Palette = "netbox" | "proxmox" | "mixed";
export type ProjectActionIcon = "github" | "pypi" | "docker";

export type ProjectSlug =
  | "netbox-proxbox"
  | "proxbox-api"
  | "netbox-sdk"
  | "proxmox-sdk";

export type ProjectViewKind =
  | "showcase"
  | "developer"
  | "releases"
  | "roadmap";

export type ProjectRegistryEntry = {
  slug: ProjectSlug;
  name: string;
  fullName: string;
  palette: Palette;
  tagline: string;
  projectPath: string;
  developerPath: string;
  releasesUrl: string;
  repoUrl: string;
  starsHref: string;
  actions: readonly { icon: ProjectActionIcon; href: string }[];
};

export const PROJECTS = {
  "netbox-proxbox": {
    slug: "netbox-proxbox",
    name: "netbox-proxbox",
    fullName: "emersonfelipesp/netbox-proxbox",
    palette: "netbox",
    tagline:
      "NetBox plugin that synchronizes Proxmox infrastructure into NetBox via a FastAPI backend.",
    projectPath: "/netbox-proxbox",
    developerPath: "/netbox-proxbox/developer",
    repoUrl: "https://github.com/emersonfelipesp/netbox-proxbox",
    releasesUrl: "https://github.com/emersonfelipesp/netbox-proxbox/releases",
    starsHref: "https://github.com/emersonfelipesp/netbox-proxbox/stargazers",
    actions: [
      {
        icon: "github",
        href: "https://github.com/emersonfelipesp/netbox-proxbox",
      },
      { icon: "pypi", href: "https://pypi.org/project/netbox-proxbox/" },
    ],
  },
  "proxbox-api": {
    slug: "proxbox-api",
    name: "proxbox-api",
    fullName: "emersonfelipesp/proxbox-api",
    palette: "mixed",
    tagline:
      "FastAPI orchestrator that bridges Proxmox VE and NetBox for the Proxbox suite.",
    projectPath: "/proxbox-api",
    developerPath: "/proxbox-api/developer",
    repoUrl: "https://github.com/emersonfelipesp/proxbox-api",
    releasesUrl: "https://github.com/emersonfelipesp/proxbox-api/releases",
    starsHref: "https://github.com/emersonfelipesp/proxbox-api/stargazers",
    actions: [
      { icon: "github", href: "https://github.com/emersonfelipesp/proxbox-api" },
      { icon: "pypi", href: "https://pypi.org/project/proxbox-api/" },
      {
        icon: "docker",
        href: "https://hub.docker.com/r/emersonfelipesp/proxbox-api",
      },
    ],
  },
  "netbox-sdk": {
    slug: "netbox-sdk",
    name: "netbox-sdk",
    fullName: "emersonfelipesp/netbox-sdk",
    palette: "netbox",
    tagline:
      "Modern NetBox toolkit: async SDK, Typer CLI, and Textual TUI for infrastructure automation.",
    projectPath: "/netbox-sdk",
    developerPath: "/netbox-sdk/developer",
    repoUrl: "https://github.com/emersonfelipesp/netbox-sdk",
    releasesUrl: "https://github.com/emersonfelipesp/netbox-sdk/releases",
    starsHref: "https://github.com/emersonfelipesp/netbox-sdk/stargazers",
    actions: [
      { icon: "github", href: "https://github.com/emersonfelipesp/netbox-sdk" },
      { icon: "pypi", href: "https://pypi.org/project/netbox-sdk/" },
    ],
  },
  "proxmox-sdk": {
    slug: "proxmox-sdk",
    name: "proxmox-sdk",
    fullName: "emersonfelipesp/proxmox-sdk",
    palette: "proxmox",
    tagline:
      "Schema-driven FastAPI SDK for the Proxmox VE API with generated endpoints and mock/real modes.",
    projectPath: "/proxmox-sdk",
    developerPath: "/proxmox-sdk/developer",
    repoUrl: "https://github.com/emersonfelipesp/proxmox-sdk",
    releasesUrl: "https://github.com/emersonfelipesp/proxmox-sdk/releases",
    starsHref: "https://github.com/emersonfelipesp/proxmox-sdk/stargazers",
    actions: [
      { icon: "github", href: "https://github.com/emersonfelipesp/proxmox-sdk" },
      { icon: "pypi", href: "https://pypi.org/project/proxmox-sdk/" },
      {
        icon: "docker",
        href: "https://hub.docker.com/r/emersonfelipesp/proxmox-sdk",
      },
    ],
  },
} as const satisfies Record<ProjectSlug, ProjectRegistryEntry>;

export const PROJECT_SLUGS = Object.keys(PROJECTS) as ProjectSlug[];

export const PROJECT_LIST = PROJECT_SLUGS.map((slug) => PROJECTS[slug]);

export type ProjectRouteInfo = {
  slug: ProjectSlug;
  view: ProjectViewKind;
};

export function isProjectSlug(slug: string): slug is ProjectSlug {
  return Object.hasOwn(PROJECTS, slug);
}

export function getProject(slug: string): ProjectRegistryEntry | null {
  return isProjectSlug(slug) ? PROJECTS[slug] : null;
}

export function getProjectFromPath(pathname: string): ProjectRouteInfo | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  const slug = parts[0];
  if (!isProjectSlug(slug)) return null;

  const second = parts[1];
  let view: ProjectViewKind = "showcase";
  if (second === "developer") view = "developer";
  else if (second === "releases") view = "releases";
  else if (second === "roadmap") view = "roadmap";
  return { slug, view };
}

export function releaseListPath(slug: ProjectSlug | string): string {
  return `/${slug}/releases`;
}

export function roadmapPath(slug: ProjectSlug | string): string | null {
  return isProjectSlug(slug) ? `/${slug}/roadmap` : null;
}

export function releaseDetailPath(
  slug: ProjectSlug | string,
  tag: string,
): string {
  const encodedTag = tag
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${releaseListPath(slug)}/${encodedTag}`;
}
