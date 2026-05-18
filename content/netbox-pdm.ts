import { PROJECTS } from "@/lib/project-registry";

const project = PROJECTS["netbox-pdm"];

export const netboxPdm = {
  slug: project.slug,
  name: project.name,
  fullName: project.fullName,
  palette: project.palette,
  tagline:
    "NetBox plugin for Proxmox Datacenter Manager — models PDM nodes, remote clusters, subscriber views, and SDN topology.",
  description: [
    "netbox-pdm brings Proxmox Datacenter Manager (PDM) awareness into NetBox, mapping the multi-cluster topology managed by PDM into structured DCIM objects.",
    "PDM nodes, remote cluster registrations, subscriber assignments, and scheduled tasks are all surfaced in NetBox alongside the rest of your infrastructure inventory.",
  ],
  features: [
    "PDM node discovery and status tracking",
    "Remote cluster registration and subscriber view mapping",
    "Scheduled task visibility per PDM node",
    "SDN zone and VNET topology modeled as NetBox objects",
    "Links PDM objects to existing Proxmox cluster records",
    "Read-only discovery — never mutates resources on PDM",
    "REST API for all plugin models",
  ],
  stack: [
    "NetBox plugin (Django / Python 3.12+)",
    "Proxmox Datacenter Manager API integration",
    "netbox-proxbox (companion plugin for cluster context)",
  ],
  install: {
    primary: "pip install netbox-pdm",
    note: "Requires a running Proxmox Datacenter Manager instance and netbox-proxbox for cluster context.",
  },
  meta: {
    license: "Apache-2.0",
    netbox: "4.6.x",
    python: "3.12+",
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
