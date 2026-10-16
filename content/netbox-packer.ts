import { PROJECTS } from "@/lib/project-registry";

const project = PROJECTS["netbox-packer"];

export const netboxPacker = {
  slug: project.slug,
  name: project.name,
  fullName: project.fullName,
  palette: project.palette,
  tagline:
    "NetBox plugin scaffold for read-only HashiCorp Packer artifact inventory through proxbox-api.",
  description: [
    "netbox-packer is a sibling of netbox-proxbox for future image-build inventory covering Proxmox templates, appliance images, and network OS golden images.",
    "The released v0.0.2.post1 package contains the scaffold and installation glue plus release-packaging fixes. Image-inventory models and HCP Packer synchronization are not part of this release.",
  ],
  features: [
    "Plugin scaffold and NetBox installation glue",
    "Reuses netbox-proxbox endpoint resolution and job conventions when installed",
    "Optional HCP Packer organization and project settings",
    "Read-only boundary — all build operations remain in Packer or HCP Packer",
    "Image-inventory models and HCP Packer synchronization are planned for later releases",
  ],
  stack: [
    "NetBox plugin (Django / Python 3.12+)",
    "proxbox-api backend with Packer-aware endpoints",
    "netbox-proxbox >=0.0.16",
  ],
  install: {
    primary: "pip install netbox-packer",
    note: "Requires netbox-proxbox and a reachable proxbox-api backend with Packer-aware endpoints.",
  },
  meta: {
    license: "Apache-2.0",
    netbox: "4.5.x – 4.6.x",
    python: "3.12+",
    latestRelease: "v0.0.2.post1",
  },
  links: {
    repo: project.repoUrl,
    "HashiCorp Packer Docs": "https://developer.hashicorp.com/packer/docs",
    "netbox-proxbox": "https://emersonfelipesp.com/netbox-proxbox",
  },
  banner: String.raw`
   ___          _
  | _ \__ _ ___| |_____ _ _
  |  _/ _ |/ __| / / -_) '_|
  |_| \__,|\__|_\_\___|_|
   n e t b o x  <-> p a c k e r
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
