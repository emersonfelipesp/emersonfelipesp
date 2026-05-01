export const netboxProxbox = {
  slug: "netbox-proxbox",
  name: "netbox-proxbox",
  fullName: "N-Multifibra/netbox-proxbox",
  palette: "netbox" as const,
  tagline:
    "NetBox plugin that synchronizes Proxmox infrastructure into NetBox via a FastAPI backend.",
  description: [
    "netbox-proxbox keeps your DCIM in sync with real Proxmox clusters by streaming clusters, nodes, VMs, containers, storage, snapshots and backups straight into NetBox.",
    "It pairs a NetBox plugin (Django) with a dedicated FastAPI service called proxbox-api that does the heavy lifting and pushes progress live over Server-Sent Events.",
  ],
  features: [
    "Automatic sync: clusters, nodes, VMs, containers, storage, snapshots, backups",
    "Real-time progress via Server-Sent Events (SSE) streaming",
    "Granular per-VM and per-endpoint sync flags",
    "Live backend log viewer pulled from proxbox-api",
    "Endpoint configuration via CSV / JSON / YAML import & export",
    "Read-only discovery — never mutates resources on Proxmox",
    "Network interface and IP assignment tracking inside NetBox",
  ],
  stack: [
    "NetBox plugin (Django / Python 3.12+)",
    "proxbox-api (FastAPI backend)",
    "Server-Sent Events for streaming",
    "MkDocs Material for docs",
  ],
  install: {
    primary: "pip install netbox-proxbox",
    note: "Plus the proxbox-api backend (Docker image or standalone). See docs.",
  },
  meta: {
    license: "Apache-2.0",
    netbox: "4.6.x",
    python: "3.12+",
    proxmox: "7.x / 8.x",
    latestRelease: "v0.0.13.post4",
    stars: 539,
    forks: 62,
  },
  links: {
    repo: "https://github.com/N-Multifibra/netbox-proxbox",
    docs: "https://emersonfelipesp.github.io/netbox-proxbox/",
    backendRepo: "https://github.com/emersonfelipesp/proxbox-api",
  },
  banner: String.raw`
   ___              _
  | _ \_ _ _____ __| |__  _____ __
  |  _/ '_/ _ \ \ / '_ \/ _ \ \ /
  |_| |_| \___/_\_\_.__/\___/_\_\
   n e t b o x  ⇄  p r o x m o x
`,
};
