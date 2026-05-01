export const proxmoxSdk = {
  slug: "proxmox-sdk",
  name: "proxmox-sdk",
  fullName: "emersonfelipesp/proxmox-sdk",
  palette: "proxmox" as const,
  tagline:
    "Schema-driven FastAPI SDK for the Proxmox API — generated, dual-mode, OpenAPI-first.",
  description: [
    "proxmox-sdk is a FastAPI package that mirrors the Proxmox VE API as a fully typed OpenAPI surface, with 646 endpoints generated from Proxmox VE 8.1.",
    "It runs in two modes out of the box: a mock mode (default) with auto-generated CRUD data so you can develop without a real cluster, and a real mode that proxies validated requests to a live Proxmox host.",
  ],
  features: [
    "646 pre-generated Proxmox VE 8.1 endpoints with full OpenAPI schema",
    "Dual mode: mock (default) for development, real for production",
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
    note: "Then visit /docs on the running app for live OpenAPI / Swagger.",
  },
  meta: {
    license: "MIT",
    python: "3.10+",
    latestRelease: "alpha",
    stars: 1,
    forks: 0,
  },
  links: {
    repo: "https://github.com/emersonfelipesp/proxmox-sdk",
    docs: "https://emersonfelipesp.github.io/proxmox-sdk/",
  },
  banner: String.raw`
   ___                              ___ ___  _  __
  | _ \_ _ _____ ___ __  _____ __  / __|   \| |/ /
  |  _/ '_/ _ \ \ / /  \/ _ \ \ /  \__ \ |) | ' <
  |_| |_| \___/_\_\_/\_\___/_\_\   |___/___/|_|\_\
   o p e n a p i  ·  f a s t a p i  ·  m o c k + r e a l
`,
};
