import { PROJECTS } from "@/lib/project-registry";

const project = PROJECTS["netbox-pdm"];

export const netboxPdm = {
  slug: project.slug,
  name: project.name,
  fullName: project.fullName,
  palette: project.palette,
  tagline:
    "NetBox plugin scaffold for read-only Proxmox Datacenter Manager inventory through proxbox-api.",
  description: [
    "netbox-pdm is a sibling of netbox-proxbox for future read-only PDM inventory: remotes, views, and SDN-adjacent state through proxbox-api.",
    "The released v0.0.1 package ships the plugin scaffold and NetBox installation glue. Model and synchronization views are not part of this release.",
  ],
  features: [
    "Plugin scaffold and NetBox installation glue",
    "Reuses netbox-proxbox endpoint resolution and job conventions when installed",
    "Falls back to proxbox_api_url and proxbox_api_key plugin settings",
    "Read-only boundary — all mutations remain in PDM",
    "Model and synchronization views are planned for later releases",
  ],
  stack: [
    "NetBox plugin (Django / Python 3.12+)",
    "proxbox-api backend with PDM-aware endpoints",
    "netbox-proxbox >=0.0.16",
  ],
  install: {
    primary: "pip install netbox-pdm",
    note: "Requires a running Proxmox Datacenter Manager instance and netbox-proxbox for cluster context.",
  },
  meta: {
    license: "Apache-2.0",
    netbox: "4.5.8 – 4.6.x",
    python: "3.12+",
    latestRelease: "v0.0.1",
  },
  links: {
    repo: project.repoUrl,
    "netbox-proxbox": "https://emersonfelipesp.com/netbox-proxbox",
    "Proxmox PDM Docs": "https://pve.proxmox.com/pve-docs/pdm-admin-guide.html",
  },
  banner: String.raw`
   ___  ___  __  __
  | _ \|   \|  \/  |
  |  _/| |) | |\/| |
  |_|  |___/|_|  |_|
   n e t b o x  ⇄  p d m
`,
  sections: [
    { id: "overview", label: "overview" },
    { id: "features", label: "features" },
    { id: "stack", label: "stack" },
    { id: "install", label: "install" },
    { id: "repo", label: "repo" },
    { id: "links", label: "links" },
  ],
} as const;
