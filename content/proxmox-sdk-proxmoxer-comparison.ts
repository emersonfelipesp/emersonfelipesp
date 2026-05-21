import type { ComparisonContent } from "./types";
import { PROJECTS } from "@/lib/project-registry";
import { proxmoxSdk } from "./proxmox-sdk";

const project = PROJECTS["proxmox-sdk"];

export const proxmoxerComparison: ComparisonContent = {
  slug: project.slug,
  name: "proxmoxer vs proxmox-sdk",
  fullName: project.fullName,
  palette: project.palette,
  tagline: "Side-by-side comparison of two Python libraries for the Proxmox API.",
  banner: proxmoxSdk.banner,
  sections: [
    { id: "overview", label: "overview" },
    { id: "libraries", label: "libraries" },
    { id: "comparison", label: "comparison" },
    { id: "when-to-choose", label: "when to choose" },
    { id: "install", label: "install" },
    { id: "links", label: "links" },
  ],
  intro: [
    "proxmoxer is the established Python library for the Proxmox VE/PBS/PMG API. It has been the go-to choice since 2012, is production-proven across thousands of deployments, and underpins major automation tooling including the Ansible Proxmox collection and several Terraform providers.",
    "proxmox-sdk is a newer library (2024, pre-release) that takes a different approach: it generates its API surface directly from the Proxmox API Viewer schema, ships a full FastAPI server alongside the Python SDK, and defaults to an in-memory mock mode so you can develop without a live cluster.",
    "Both libraries support the same Proxmox authentication methods and backend transports. The right choice depends on your use case — the sections below lay out the trade-offs without embellishment.",
  ],
  libraryA: {
    name: "proxmoxer",
    description: [
      "A thin, hand-written Python wrapper around the Proxmox REST API. Returns raw Python dicts (or the exact JSON your Proxmox node sends). Designed to be minimal: the main dependency for HTTPS access is the requests library.",
      "proxmoxer is sync-first. Unofficial async wrappers exist in the community but are not part of the upstream package. It has no mock mode — every call targets a real Proxmox endpoint.",
      "Its breadth covers Proxmox VE, Proxmox Backup Server, and Proxmox Datacenter Manager. The API surface is hand-maintained, which means it rarely breaks but can lag behind new Proxmox endpoints.",
    ],
    bestFor: [
      "Existing Ansible, Terraform, or shell-script automation that already uses proxmoxer",
      "Simple scripts that need minimal dependencies in a production codebase",
      "Projects where raw dict responses are fine and typing is not required",
      "Environments where you always have a real Proxmox cluster to test against",
    ],
  },
  libraryB: {
    name: "proxmox-sdk",
    description: [
      "A code-generated Python SDK built from the Proxmox API Viewer schema. The same package ships a full FastAPI server (with Swagger UI at /docs), a CLI (pbx), and a Textual TUI — but the core SDK is usable standalone without any of those extras.",
      "proxmox-sdk defaults to mock mode: an in-memory FastAPI server that responds to all 675 PVE 9.2 endpoints with auto-generated CRUD data. Switching to real mode proxies validated requests to a live Proxmox node.",
      "Responses are Pydantic models, not raw dicts. The schema is refreshed weekly via a GitHub Actions workflow that detects API drift automatically. proxmox-sdk is pre-release (alpha) with low adoption and an API surface that may change between versions.",
    ],
    bestFor: [
      "Building a service or API layer on top of Proxmox that needs an OpenAPI surface",
      "Developing and testing locally without a live Proxmox cluster (mock mode)",
      "Projects that benefit from typed, Pydantic-validated Proxmox responses",
      "Workflows that want a ready-made CLI or TUI for Proxmox operations",
    ],
  },
  table: [
    { aspect: "type", a: "Python library", b: "Python library + FastAPI server", winner: "draw" },
    { aspect: "first release", a: "2012", b: "2024", winner: "a" },
    { aspect: "maturity", a: "production, widely adopted", b: "alpha, low adoption", winner: "a" },
    { aspect: "license", a: "BSD-2-Clause", b: "MIT", winner: "draw" },
    { aspect: "python", a: "2.7 / 3.x", b: "3.11+", winner: "a" },
    { aspect: "response format", a: "raw dict / JSON", b: "Pydantic models", winner: "b" },
    { aspect: "mock / offline dev", a: "no", b: "yes (default mode)", winner: "b" },
    { aspect: "OpenAPI schema", a: "no", b: "yes — 675 ops, PVE 9.2", winner: "b" },
    { aspect: "FastAPI server", a: "no", b: "yes (optional)", winner: "b" },
    { aspect: "Swagger UI /docs", a: "no", b: "yes", winner: "b" },
    { aspect: "code generation", a: "no (hand-written)", b: "yes (Playwright + pipeline)", winner: "draw" },
    { aspect: "schema auto-sync", a: "no", b: "yes — weekly GitHub Actions", winner: "b" },
    { aspect: "auth: API token", a: "yes", b: "yes", winner: "draw" },
    { aspect: "auth: password + ticket", a: "yes", b: "yes", winner: "draw" },
    { aspect: "auth: OTP / TOTP", a: "yes", b: "yes", winner: "draw" },
    { aspect: "backend: HTTPS", a: "yes", b: "yes", winner: "draw" },
    { aspect: "backend: SSH (Paramiko)", a: "yes", b: "yes", winner: "draw" },
    { aspect: "backend: SSH (openssh)", a: "yes", b: "yes", winner: "draw" },
    { aspect: "backend: pvesh CLI", a: "yes", b: "yes", winner: "draw" },
    { aspect: "async support", a: "third-party only", b: "yes (native asyncio)", winner: "b" },
    { aspect: "rate limiting", a: "no", b: "yes (SlowAPI)", winner: "b" },
    { aspect: "CLI", a: "no", b: "yes — pbx / proxmox-cli", winner: "b" },
    { aspect: "TUI", a: "no", b: "yes (Textual)", winner: "b" },
    { aspect: "Docker images", a: "no", b: "yes (raw / nginx / granian)", winner: "b" },
    { aspect: "deps footprint", a: "minimal (requests / paramiko)", b: "heavy (FastAPI, Pydantic, aiohttp)", winner: "a" },
    { aspect: "ecosystem adoption", a: "very high", b: "very low (new)", winner: "a" },
    { aspect: "Ansible collection", a: "yes (community.general)", b: "no", winner: "a" },
    { aspect: "Terraform provider", a: "yes (telmate/proxmox)", b: "no", winner: "a" },
  ],
  verdict: [
    "If you need a library that works in production today, proxmoxer is the right choice. It has been battle-tested for over a decade, integrates with the broader Ansible and Terraform ecosystem, and adds almost no dependency weight to your project.",
    "If you are building a new service that exposes Proxmox functionality through an API, or if you want to develop without a live Proxmox cluster, proxmox-sdk is worth evaluating. Its mock server, typed responses, and OpenAPI surface provide a different developer experience than proxmoxer — one aimed at service developers rather than script authors.",
    "The two libraries are not mutually exclusive. proxmoxer handles direct Python-to-Proxmox calls; proxmox-sdk targets the layer above that, where you need an HTTP service front-end, auto-generated docs, or typed models for downstream consumers.",
  ],
  install: {
    a: "pip install proxmoxer",
    b: "pip install proxmox-sdk",
  },
  links: {
    "proxmoxer · PyPI": "https://pypi.org/project/proxmoxer/",
    "proxmoxer · GitHub": "https://github.com/proxmoxer/proxmoxer",
    "proxmox-sdk · PyPI": "https://pypi.org/project/proxmox-sdk/",
    "proxmox-sdk · GitHub": project.repoUrl,
    "proxmox-sdk · docs": "https://emersonfelipesp.github.io/proxmox-sdk/",
    "Ansible community.general": "https://docs.ansible.com/ansible/latest/collections/community/general/proxmox_module.html",
  },
};
