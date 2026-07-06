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
    "proxmox-sdk is a FastAPI package that mirrors the Proxmox VE API as a fully typed OpenAPI surface, with 675 endpoints generated from Proxmox VE 9.2.",
    "It runs in two modes out of the box: a mock mode (default) with auto-generated CRUD data so you can develop without a real cluster, and a real mode that proxies validated requests to a live Proxmox host.",
    "Beyond the server it ships a standalone async + sync Python SDK (ProxmoxSDK / SyncProxmoxSDK) with API-token and password/ticket authentication, a bring-your-own aiohttp session option, typed Ceph / PBS / PDM service clients, and an automated weekly schema-update workflow that detects upstream API drift and opens a PR.",
  ],
  features: [
    "675 pre-generated Proxmox VE 9.2 endpoints with full OpenAPI schema (9.1.11 retained)",
    "Standalone async + sync Python SDK (ProxmoxSDK / SyncProxmoxSDK) — no server required",
    "Dual mode: mock (default) for development, real for production",
    "Reliable password/ticket auth (API-prefixed ticket URL + unquoted PVEAuthCookie) plus API-token auth with TOTP",
    "Bring-your-own aiohttp session (session=) — reuse your connection pool, timeouts, tracing, or proxy",
    "Typed Ceph / PBS / PDM service clients on top of the transport backends",
    "Security hardening: SSRF-guarded download checksum discovery, credential redaction in logs, quoted SSH commands",
    "Automated weekly schema sync — detects upstream API drift and opens a PR automatically",
    "Multi-version CI matrix: latest, 9.2, and 9.1.11 each tested on every commit",
    "Per-version mock state isolation (PROXMOX_MOCK_STATE_NAMESPACE) — safe for parallel runs",
    "Per-service Docker tags: latest-pve, latest-pbs (Backup Server), latest-pdm (Datacenter Manager)",
    "Real API proxy with request/response validation",
    "Code generation: crawls the Proxmox API Viewer into OpenAPI",
    "FastAPI-generated Swagger UI at /docs",
    "Optional CLI / TUI extras with in-app view switching",
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
    latestRelease: "v0.0.13",
    stars: 2,
    forks: 0,
  },
  links: {
    repo: project.repoUrl,
    docs: "https://emersonfelipesp.com/proxmox-sdk/docs/",
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
