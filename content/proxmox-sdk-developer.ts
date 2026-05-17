import type { DeveloperContent } from "./types";
import { proxmoxSdk } from "./proxmox-sdk";
import { PROJECTS } from "@/lib/project-registry";

const project = PROJECTS["proxmox-sdk"];

export const proxmoxSdkDeveloper: DeveloperContent = {
  slug: project.slug,
  name: project.name,
  fullName: project.fullName,
  palette: project.palette,
  tagline:
    "Developer guide — the codegen pipeline, dual mock/real backends, and the integration boundary that downstream stacks depend on.",
  banner: proxmoxSdk.banner,
  sections: [
    { id: "intro", label: "intro" },
    { id: "architecture", label: "architecture" },
    { id: "integrations", label: "integrations" },
    { id: "contributing", label: "contributing" },
    { id: "e2e", label: "e2e" },
    { id: "links", label: "links" },
  ],
  intro: [
    "proxmox-sdk is a schema-driven Python toolkit. It mirrors the Proxmox VE 8.1 REST surface as 646 typed endpoints, runs in either a mock or a real-proxy mode, and exposes the result as both an in-process SDK and an optional FastAPI server.",
    "This page documents the codegen pipeline that produces the schema, the pluggable backend layer that lets every endpoint resolve against mock data or a real cluster, the contribution workflow, and the integration boundary that downstream stacks (proxbox-api, netbox-proxbox) lean on instead of running their own E2E.",
  ],
  architecture: {
    bullets: [
      "Single Python package proxmox_sdk. Three runtime modes: full FastAPI server (proxmox_sdk/main.py — mock or real proxy), standalone mock-only entrypoint (proxmox_sdk/mock_main.py — used by the netbox-proxbox + proxbox-api E2E stacks), and pure SDK (no server).",
      "Standalone SDK: proxmox_sdk/sdk/api.py is ProxmoxSDK (async). proxmox_sdk/sdk/sync.py wraps it synchronously. proxmox_sdk/sdk/resource.py adds attribute-based resource navigation.",
      "Pluggable backends in proxmox_sdk/sdk/backends/: https.py (aiohttp, real Proxmox), mock.py (in-memory), local.py (pvesh CLI), ssh_paramiko.py and openssh.py (two SSH transports).",
      "Mock layer: proxmox_sdk/mock/ uses SharedMemoryMockStore (shared-lock, file-backed) and proxmox_sdk/mock/routes.py registers CRUD handlers from the OpenAPI schema dynamically at startup. State can be reset with reset_state() between tests.",
      "Generated artifacts: proxmox_sdk/generated/ (646 endpoints, ~5.2 MB OpenAPI schema, Pydantic models). Pre-generated for Proxmox VE 8.1.",
      "Codegen pipeline: proxmox_sdk/proxmox_codegen/crawler.py (Playwright crawls the official Proxmox API Viewer), normalises output, and proxmox_codegen/pipeline.py emits openapi.json + pydantic_models.py. Triggered manually or via the rate-limited /codegen/generate endpoint (CODEGEN_API_KEY required).",
      "CLI / TUI: proxmox_sdk/proxmox_cli/ ships proxmox, pbx, and proxmox-cli entry points; pbx tui launches the Textual UI. Themes: proxmox_cli/themes/themes.py (DARK, LIGHT, MONOKAI).",
      "Rate limiting: SlowAPI on every public route (in-process; works without Redis).",
    ],
  },
  integrations: [
    {
      target: "Proxmox VE / PMG / PBS",
      protocol: "HTTPS",
      library: "aiohttp via backends/https.py",
      notes:
        "Auth: API token (auth/token.py) or password/ticket+TOTP (auth/ticket.py). Used in real-proxy mode.",
    },
    {
      target: "Proxmox host (local)",
      protocol: "exec",
      library: "pvesh wrapper (backends/local.py)",
      notes: "Direct CLI invocation when running on a Proxmox node.",
    },
    {
      target: "Proxmox host (over SSH)",
      protocol: "SSH",
      library: "Paramiko (ssh_paramiko.py) or openssh-wrapper (openssh.py)",
      notes: "Two interchangeable SSH transports.",
    },
    {
      target: "proxbox-api",
      protocol: "imported",
      library: "downstream consumer",
      notes:
        "proxbox-api pins proxmox-sdk==0.0.3.post1; netbox-proxbox's E2E stack pulls one of the per-service image tags (latest-pve, latest-pbs, latest-pdm) of this repo as its proxmox-e2e-mock container, one per matrix cell.",
    },
  ],
  contributing: {
    devInstall: "uv sync",
    checks: [
      {
        label: "install hooks",
        cmd: "uv run pre-commit install --hook-type pre-commit --hook-type pre-push",
      },
      { label: "lint", cmd: "uv run ruff check ." },
      { label: "format", cmd: "uv run ruff format --check ." },
      { label: "type check", cmd: "uv run ty check proxmox_sdk tests" },
      { label: "syntax compile", cmd: "uv run python -m compileall proxmox_sdk" },
      {
        label: "tests with coverage",
        cmd: "uv run pytest -n auto --cov=proxmox_sdk --cov-report=term-missing tests",
      },
    ],
    codeStyle: [
      "Linter: ruff (select E4/E7/E9/F/I/ANN201/D103/W).",
      "Formatter: ruff format.",
      "Type checker: ty.",
      "Codegen output (proxmox_sdk/generated/) is regenerated, not edited.",
    ],
    issuesUrl: "https://github.com/emersonfelipesp/proxmox-sdk/issues",
  },
  e2e: {
    framework:
      "pytest + pytest-xdist + pytest-cov. Integration boundary covered via tests/cli/integration/test_backend_integration.py exercising the CLI-to-SDK bridge against the mock server.",
    intro: [
      "proxmox-sdk has no dedicated tests/e2e/ directory — the CLI integration suite plus the published service-tagged Docker images (latest-pve, latest-pbs, latest-pdm) act as the E2E boundary. Downstream stacks (netbox-proxbox, proxbox-api) consume those tags and run the cross-stack E2E in parallel.",
      "v0.0.5 added Proxmox Datacenter Manager (PDM) support alongside the existing Proxmox VE and Proxmox Backup Server surfaces, so each Docker tag serves a different OpenAPI schema while sharing the same mock plumbing.",
      "The CI pipeline lints, type-checks, runs tests with coverage, and rebuilds the service-tagged Docker variants (raw / nginx / granian × pve / pbs / pdm) on every main and testing push.",
    ],
    commands: [
      {
        label: "tests with coverage",
        cmd: "uv run pytest -n auto --cov=proxmox_sdk --cov-report=term-missing tests",
      },
      {
        label: "CLI integration only",
        cmd: "uv run pytest tests/cli/integration",
      },
    ],
    coverage: [
      "Spec files: tests/cli/integration/test_backend_integration.py (CLI ↔ SDK bridge against mock server).",
      "CI jobs: lint, syntax, test, docker-images (raw / nginx / granian variants × pve / pbs / pdm service tags pushed on every main / testing commit).",
      "Cross-stack E2E: the latest-{pve,pbs,pdm} tags are pulled by netbox-proxbox's e2e-docker.yml and proxbox-api's ci.yml as the proxmox-e2e-mock container — one tag per matrix cell, proving the published images are consumable end-to-end.",
    ],
    ciWorkflow: ".github/workflows/ci.yml",
    ciWorkflowUrl:
      "https://github.com/emersonfelipesp/proxmox-sdk/blob/main/.github/workflows/ci.yml",
  },
  links: {
    repo: "https://github.com/emersonfelipesp/proxmox-sdk",
    docs: "https://emersonfelipesp.github.io/proxmox-sdk/",
    issues: "https://github.com/emersonfelipesp/proxmox-sdk/issues",
  },
};
