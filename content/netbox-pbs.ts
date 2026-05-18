import { PROJECTS } from "@/lib/project-registry";

const project = PROJECTS["netbox-pbs"];

export const netboxPbs = {
  slug: project.slug,
  name: project.name,
  fullName: project.fullName,
  palette: project.palette,
  tagline:
    "NetBox plugin for Proxmox Backup Server — tracks datastores, backup jobs, verification schedules, and retention policies.",
  description: [
    "netbox-pbs integrates Proxmox Backup Server (PBS) inventory into NetBox, giving your DCIM a complete picture of your backup infrastructure alongside the VMs and nodes it protects.",
    "Datastores, backup jobs, tape drives, and pruning schedules are discovered automatically and linked to the Proxmox clusters and virtual machines already managed by netbox-proxbox.",
  ],
  features: [
    "Automatic discovery of PBS datastores and their usage metrics",
    "Backup job tracking: status, schedule, last run, and next run",
    "Verification job and garbage collection schedule visibility",
    "Retention policy modeling per datastore",
    "Links PBS objects to existing Proxmox cluster and VM records",
    "Read-only discovery — never mutates resources on PBS",
    "REST API for all plugin models",
  ],
  stack: [
    "NetBox plugin (Django / Python 3.12+)",
    "Proxmox Backup Server API integration",
    "netbox-proxbox (companion plugin for VM and cluster context)",
  ],
  install: {
    primary: "pip install netbox-pbs",
    note: "Requires a running Proxmox Backup Server instance and netbox-proxbox for cluster context.",
  },
  meta: {
    license: "Apache-2.0",
    netbox: "4.6.x",
    python: "3.12+",
  },
  links: {
    repo: project.repoUrl,
    "netbox-proxbox": "https://emersonfelipesp.com/netbox-proxbox",
    "Proxmox Backup Server Docs": "https://pbs.proxmox.com/docs/",
  },
  banner: String.raw`
   ___  ___  ___
  | _ \| _ )/ __|
  |  _/| _ \\__ \
  |_|  |___/|___/
   n e t b o x  ⇄  p b s
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
