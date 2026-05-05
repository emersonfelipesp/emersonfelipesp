import type { SectionAction } from "@/components/nav/SectionNav";

export type ProjectShellSlug =
  | "netbox-proxbox"
  | "proxbox-api"
  | "netbox-sdk"
  | "proxmox-sdk";

export const PROJECT_SLUGS = [
  "netbox-proxbox",
  "proxbox-api",
  "netbox-sdk",
  "proxmox-sdk",
] as const satisfies readonly ProjectShellSlug[];

export type ProjectViewKind = "showcase" | "developer" | "releases";

export type ProjectShellMeta = {
  slug: ProjectShellSlug;
  name: string;
  fullName: string;
  starsHref: string;
  actions: readonly Omit<SectionAction, "label">[];
};

const meta: Record<ProjectShellSlug, ProjectShellMeta> = {
  "netbox-proxbox": {
    slug: "netbox-proxbox",
    name: "netbox-proxbox",
    fullName: "emersonfelipesp/netbox-proxbox",
    starsHref: "https://github.com/emersonfelipesp/netbox-proxbox/stargazers",
    actions: [
      { icon: "github", href: "https://github.com/emersonfelipesp/netbox-proxbox" },
      { icon: "pypi", href: "https://pypi.org/project/netbox-proxbox/" },
    ],
  },
  "proxbox-api": {
    slug: "proxbox-api",
    name: "proxbox-api",
    fullName: "emersonfelipesp/proxbox-api",
    starsHref: "https://github.com/emersonfelipesp/proxbox-api/stargazers",
    actions: [
      { icon: "github", href: "https://github.com/emersonfelipesp/proxbox-api" },
      { icon: "pypi", href: "https://pypi.org/project/proxbox-api/" },
      { icon: "docker", href: "https://hub.docker.com/r/emersonfelipesp/proxbox-api" },
    ],
  },
  "netbox-sdk": {
    slug: "netbox-sdk",
    name: "netbox-sdk",
    fullName: "emersonfelipesp/netbox-sdk",
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
    starsHref: "https://github.com/emersonfelipesp/proxmox-sdk/stargazers",
    actions: [
      { icon: "github", href: "https://github.com/emersonfelipesp/proxmox-sdk" },
      { icon: "pypi", href: "https://pypi.org/project/proxmox-sdk/" },
      { icon: "docker", href: "https://hub.docker.com/r/emersonfelipesp/proxmox-sdk" },
    ],
  },
};

export function getProjectShellMeta(slug: string): ProjectShellMeta | null {
  return (PROJECT_SLUGS as readonly string[]).includes(slug)
    ? meta[slug as ProjectShellSlug]
    : null;
}

export function isProjectSlug(slug: string): slug is ProjectShellSlug {
  return (PROJECT_SLUGS as readonly string[]).includes(slug);
}

export type ProjectRouteInfo = {
  slug: ProjectShellSlug;
  view: ProjectViewKind;
};

export function getProjectFromPath(pathname: string): ProjectRouteInfo | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  const slug = parts[0];
  if (!isProjectSlug(slug)) return null;

  const second = parts[1];
  let view: ProjectViewKind = "showcase";
  if (second === "developer") view = "developer";
  else if (second === "releases") view = "releases";
  return { slug, view };
}

