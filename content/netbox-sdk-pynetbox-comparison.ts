import type { ComparisonContent } from "./types";
import { PROJECTS } from "@/lib/project-registry";
import { netboxSdk } from "./netbox-sdk";

const project = PROJECTS["netbox-sdk"];

export const netboxSdkPynetboxComparison: ComparisonContent = {
  slug: project.slug,
  name: "pynetbox vs netbox-sdk",
  fullName: project.fullName,
  palette: project.palette,
  tagline:
    "Side-by-side comparison of two Python libraries for the NetBox REST API.",
  banner: netboxSdk.banner,
  sections: [
    { id: "overview", label: "overview" },
    { id: "libraries", label: "libraries" },
    { id: "comparison", label: "comparison" },
    { id: "when-to-choose", label: "when to choose" },
    { id: "install", label: "install" },
    { id: "links", label: "links" },
  ],
  intro: [
    "pynetbox is the official Python client for the NetBox REST API, maintained by the netbox-community organization. It has been the go-to choice since 2017 — originally authored at DigitalOcean — and is the de facto standard for scripting against NetBox in Python.",
    "netbox-sdk is a newer library (2024, pre-release) built on an async runtime from the start. It ships a standalone SDK, an OpenAPI-driven CLI, and a Textual TUI inside a single package, and includes a local mock server for testing without a live NetBox instance.",
    "Both libraries talk to the same NetBox REST API. The right choice depends on whether your workflow is script-oriented and synchronous, or service-oriented and async. The sections below compare the two without exaggeration.",
  ],
  libraryA: {
    name: "pynetbox",
    description: [
      "A thin, synchronous Python wrapper around the NetBox REST API. Returns Record and RecordSet objects with ORM-like attribute access, .save(), and .delete() methods — so you can write device.name = 'foo'; device.save() without building a dict manually.",
      "pynetbox is sync-only (built on requests). It supports parallel pagination via threading=True, strict OpenAPI-backed filter validation, and a context manager for the NetBox branching plugin. No mock server is bundled — you stub requests with unittest.mock in tests.",
      "The library is maintained by the netbox-community GitHub organization and follows NetBox releases closely. NetBox compatibility is documented in a version matrix from 3.3 through 4.5.",
    ],
    bestFor: [
      "Scripts, Ansible playbooks, and automation that already use the NetBox community ecosystem",
      "Projects that prefer ORM-style .save()/.delete() over explicit API calls",
      "Environments requiring minimal runtime dependencies in production",
      "Workflows using the NetBox branching plugin via activate_branch()",
    ],
  },
  libraryB: {
    name: "netbox-sdk",
    description: [
      "An async SDK built on aiohttp, exposing three usage layers: a raw HTTP client, an async facade (api()), and a versioned typed client (typed_api()) that returns Pydantic models for NetBox 4.3–4.6. All three share the same runtime.",
      "The package ships optional extras: [cli] adds a Typer-based nbx CLI with OpenAPI-driven dynamic commands, [tui] adds a Textual-based terminal interface, and [mock] adds a local FastAPI mock server (nbx-mock) so you can develop and test without a live NetBox instance.",
      "netbox-sdk is pre-release (alpha, version 0.0.9) with low adoption. The API surface covers NetBox 4.3–4.6 and may change between releases. Python 3.11+ is required.",
    ],
    bestFor: [
      "Async applications and services that need native asyncio support",
      "Developing or testing locally without a live NetBox instance (mock server)",
      "Projects that want full type safety with Pydantic-validated NetBox responses",
      "Workflows that benefit from a ready-made CLI (nbx) or TUI for NetBox operations",
    ],
  },
  table: [
    { aspect: "type", a: "Python library", b: "Python library + CLI + TUI", winner: "draw" },
    { aspect: "first release", a: "2017", b: "2024", winner: "a" },
    { aspect: "maturity", a: "production, widely adopted", b: "alpha, low adoption", winner: "a" },
    { aspect: "license", a: "Apache 2.0", b: "Apache 2.0", winner: "draw" },
    { aspect: "python", a: "3.10+", b: "3.11+", winner: "a" },
    { aspect: "response format", a: "Record objects (ORM-like)", b: "raw JSON or Pydantic models", winner: "b" },
    { aspect: ".save() / .delete() on records", a: "yes", b: "no (call API methods directly)", winner: "a" },
    { aspect: "mock / offline dev", a: "no", b: "yes ([mock] extra)", winner: "b" },
    { aspect: "async support", a: "no (sync, requests)", b: "yes (aiohttp)", winner: "b" },
    { aspect: "parallel pagination", a: "yes (threading=True)", b: "yes (async concurrent)", winner: "draw" },
    { aspect: "NetBox branching", a: "yes (activate_branch())", b: "yes ([branching] extra)", winner: "draw" },
    { aspect: "filter validation", a: "yes (strict_filters=True)", b: "yes (bundled OpenAPI specs)", winner: "draw" },
    { aspect: "bundled OpenAPI specs", a: "no", b: "yes (4.3–4.6)", winner: "b" },
    { aspect: "CLI", a: "no", b: "yes — nbx ([cli] extra)", winner: "b" },
    { aspect: "TUI", a: "no", b: "yes (Textual, [tui] extra)", winner: "b" },
    { aspect: "deps footprint (base)", a: "minimal (requests, packaging)", b: "medium (aiohttp, pydantic, rich)", winner: "a" },
    { aspect: "deps footprint (full)", a: "minimal", b: "heavy (+FastAPI, Textual, Typer)", winner: "a" },
    { aspect: "NetBox compat range", a: "3.3–4.5", b: "4.3–4.6 (typed)", winner: "draw" },
    { aspect: "ecosystem adoption", a: "very high", b: "very low (new)", winner: "a" },
    { aspect: "community support", a: "netbox-community", b: "emersonfelipesp", winner: "a" },
  ],
  verdict: [
    "If you are writing scripts, Ansible playbooks, or any synchronous automation against NetBox today, pynetbox is the right choice. It is battle-tested since 2017, follows the NetBox release cadence, has minimal dependencies, and is maintained by the netbox-community organization.",
    "If you are building an async service or application that talks to NetBox, or if you need to develop and test locally without a live instance, netbox-sdk is worth evaluating. Its aiohttp runtime, Pydantic-typed responses, mock server, and optional CLI/TUI serve a different workflow than pynetbox.",
    "The two libraries are not in competition for the same use case. pynetbox targets scripting and synchronous automation; netbox-sdk targets async services and teams that want typed models, a development mock, or a terminal interface.",
  ],
  install: {
    a: "pip install pynetbox",
    b: "pip install netbox-sdk",
  },
  links: {
    "pynetbox · PyPI": "https://pypi.org/project/pynetbox/",
    "pynetbox · GitHub": "https://github.com/netbox-community/pynetbox",
    "pynetbox · docs": "https://pynetbox.readthedocs.io/",
    "netbox-sdk · PyPI": "https://pypi.org/project/netbox-sdk/",
    "netbox-sdk · GitHub": project.repoUrl,
  },
};
