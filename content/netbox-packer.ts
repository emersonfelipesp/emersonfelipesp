import { PROJECTS } from "@/lib/project-registry";

const project = PROJECTS["netbox-packer"];

export const netboxPacker = {
  slug: project.slug,
  name: project.name,
  fullName: project.fullName,
  palette: project.palette,
  tagline:
    "NetBox plugin for HashiCorp Packer — links image builds, template versions, and artifact metadata to NetBox virtual machine records.",
  description: [
    "netbox-packer connects HashiCorp Packer build pipelines to NetBox, creating a traceable link between golden image templates and the virtual machines that run them.",
    "Packer templates, build runs, artifact versions, and platform metadata are stored in NetBox and associated with the VM records managed by netbox-proxbox.",
  ],
  features: [
    "Packer template registry with version tracking",
    "Build run history: status, duration, artifact output",
    "Artifact version linked to NetBox VM and platform records",
    "Builder and provisioner metadata documentation",
    "Image ancestry: which VM was built from which template version",
    "REST API for all plugin models",
    "Webhook-ready for CI/CD pipeline integration",
  ],
  stack: [
    "NetBox plugin (Django / Python 3.12+)",
    "HashiCorp Packer HCL2 template parsing",
    "netbox-proxbox (companion plugin for VM context)",
  ],
  install: {
    primary: "pip install netbox-packer",
    note: "Requires netbox-proxbox for VM context. Packer builds push metadata via the plugin REST API.",
  },
  meta: {
    license: "Apache-2.0",
    netbox: "4.6.x",
    python: "3.12+",
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
