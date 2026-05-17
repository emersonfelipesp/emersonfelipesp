import type { ProjectContent } from "./types";
import { PROJECTS } from "@/lib/project-registry";

const project = PROJECTS["proxmox-sdk"];

export const proxmoxSdk: ProjectContent = {
  slug: project.slug,
  name: project.name,
  fullName: project.fullName,
  palette: project.palette,
  tagline:
    "Schema-driven FastAPI SDK for the Proxmox API — generated, dual-mode, OpenAPI-first.",
  description: [
    "proxmox-sdk is a FastAPI package that mirrors the Proxmox VE API as a fully typed OpenAPI surface, with 646 endpoints generated from Proxmox VE 8.1.",
    "It runs in two modes out of the box: a mock mode (default) with auto-generated CRUD data so you can develop without a real cluster, and a real mode that proxies validated requests to a live Proxmox host.",
    "v0.0.5 split the mock surface across three dedicated Docker tags — latest-pve, latest-pbs, latest-pdm — so Proxmox VE, Proxmox Backup Server and Proxmox Datacenter Manager can each be exercised in parallel by downstream consumers (proxbox-api, netbox-proxbox).",
  ],
  features: [
    "646 pre-generated Proxmox VE 8.1 endpoints with full OpenAPI schema",
    "Dual mode: mock (default) for development, real for production",
    "Per-service Docker tags: latest-pve, latest-pbs (Backup Server), latest-pdm (Datacenter Manager)",
    "Auto-generated mock data with in-memory CRUD operations",
    "Real API proxy with request/response validation",
    "Code generation: crawls the Proxmox API Viewer into OpenAPI",
    "Multi-version support, with 'latest' mapped to the official viewer",
    "FastAPI-generated Swagger UI at /docs",
    "Optional CLI / TUI extras",
  ],
  stack: [
    "Python",
    "FastAPI",
    "OpenAPI 3.0",
    "Pydantic",
  ],
  install: {
    primary: "pip install proxmox-sdk",
    note: "Then visit /docs on the running app for live OpenAPI / Swagger. For Docker, pull emersonfelipesp/proxmox-sdk:latest-{pve,pbs,pdm} per service surface.",
  },
  meta: {
    license: "MIT",
    python: "3.11+",
    latestRelease: "v0.0.5",
    stars: 1,
    forks: 0,
  },
  links: {
    repo: project.repoUrl,
    docs: "https://emersonfelipesp.github.io/proxmox-sdk/",
  },
  banner: String.raw`
   ___                              ___ ___  _  __
  | _ \_ _ _____ ___ __  _____ __  / __|   \| |/ /
  |  _/ '_/ _ \ \ / /  \/ _ \ \ /  \__ \ |) | ' <
  |_| |_| \___/_\_\_/\_\___/_\_\   |___/___/|_|\_\
   o p e n a p i  ·  f a s t a p i  ·  m o c k + r e a l
`,
  sections: [
    { id: "overview", label: "overview" },
    { id: "features", label: "features" },
    { id: "stack", label: "stack" },
    { id: "install", label: "install" },
    { id: "repo", label: "repo" },
    { id: "links", label: "links" },
  ],
};
