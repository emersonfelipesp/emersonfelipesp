import { PROJECTS } from "@/lib/project-registry";

const project = PROJECTS["netbox-ceph"];

export const netboxCeph = {
  slug: project.slug,
  name: project.name,
  fullName: project.fullName,
  palette: project.palette,
  tagline:
    "NetBox plugin for Ceph — maps clusters, OSDs, storage pools, monitors, and CRUSH topology into NetBox DCIM.",
  description: [
    "netbox-ceph integrates Ceph distributed storage clusters into NetBox, giving your DCIM complete visibility into your storage infrastructure alongside the servers and VMs it backs.",
    "OSDs, storage pools, monitors, and CRUSH rules are discovered and linked to physical hosts and Proxmox clusters already managed in NetBox.",
  ],
  features: [
    "Ceph cluster health and status tracking in NetBox",
    "OSD inventory with device mapping to physical hosts",
    "Storage pool modeling: replication factor, usage, PGs",
    "Monitor and manager daemon visibility",
    "CRUSH rule and failure domain documentation",
    "Links Ceph objects to existing DCIM host records",
    "Read-only discovery — never mutates Ceph resources",
    "REST API for all plugin models",
  ],
  stack: [
    "NetBox plugin (Django / Python 3.12+)",
    "Ceph REST API / `ceph` CLI integration",
    "Proxmox Ceph API (optional, for Proxmox-hosted clusters)",
  ],
  install: {
    primary: "pip install netbox-ceph",
    note: "Requires access to a Ceph cluster via REST API or admin socket.",
  },
  meta: {
    license: "Apache-2.0",
    netbox: "4.6.x",
    python: "3.12+",
  },
  links: {
    repo: project.repoUrl,
    "Ceph Documentation": "https://docs.ceph.com/",
    "netbox-proxbox": "https://emersonfelipesp.com/netbox-proxbox",
  },
  banner: String.raw`
   ___          _
  / __| ___ _ _| |_
 | (__ / -_) '_| ' \
  \___\___|_| |_||_|
   n e t b o x  ⇄  c e p h
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
