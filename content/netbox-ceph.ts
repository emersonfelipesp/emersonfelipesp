import { PROJECTS } from "@/lib/project-registry";

const project = PROJECTS["netbox-ceph"];

export const netboxCeph = {
  slug: project.slug,
  name: project.name,
  fullName: project.fullName,
  palette: project.palette,
  tagline:
    "Read-only NetBox plugin for Proxmox-managed Ceph inventory through proxbox-api.",
  description: [
    "netbox-ceph v0.0.1 mirrors Proxmox-managed Ceph inventory through proxbox-api.",
    "It reuses netbox-proxbox backend context, branch lifecycle, endpoint relationships, and job conventions without writing back to Ceph.",
  ],
  features: [
    "Read-only Proxmox-managed Ceph inventory",
    "Shared netbox-proxbox backend context and endpoint relationships",
    "Shared branch lifecycle and job conventions",
    "No NetBox-to-Ceph write operations",
    "Direct Ceph Dashboard, Prometheus, RGW/S3, RBD, and external clusters remain out of scope",
  ],
  stack: [
    "NetBox plugin (Django / Python 3.12+)",
    "proxbox-api Proxmox Ceph surface",
    "netbox-proxbox >=0.0.16",
  ],
  install: {
    primary: "pip install netbox-ceph",
    note: "Requires netbox-proxbox and a proxbox-api backend with Proxmox-managed Ceph access.",
  },
  meta: {
    license: "Apache-2.0",
    netbox: "4.5.8 – 4.6.x",
    python: "3.12+",
    latestRelease: "v0.0.1",
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
