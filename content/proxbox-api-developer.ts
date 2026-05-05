import type { DeveloperContent } from "./types";
import { proxboxApi } from "./proxbox-api";

export const proxboxApiDeveloper: DeveloperContent = {
  slug: "proxbox-api",
  name: "proxbox-api",
  fullName: "emersonfelipesp/proxbox-api",
  palette: "mixed",
  tagline:
    "Developer guide — FastAPI orchestration, SDK boundaries, contribution workflow and the Docker E2E matrix.",
  banner: proxboxApi.banner,
  sections: [
    { id: "intro", label: "intro" },
    { id: "architecture", label: "architecture" },
    { id: "integrations", label: "integrations" },
    { id: "contributing", label: "contributing" },
    { id: "e2e", label: "e2e" },
    { id: "links", label: "links" },
  ],
  intro: [
    "proxbox-api is the FastAPI service that bridges Proxmox VE and NetBox. It owns the sync workflow that the netbox-proxbox plugin triggers from inside NetBox and exposes REST + Server-Sent Events + WebSocket endpoints to stream live progress back.",
    "This page covers the layered architecture, what proxbox-api takes as a dependency vs. proxies at runtime, the contribution workflow, and the multi-mode E2E matrix that exercises every transport before a release ships.",
  ],
  architecture: {
    bullets: [
      "ASGI entrypoint: uvicorn proxbox_api.main:app. The app is assembled by proxbox_api.app.factory.create_app() — initializes the SQLite database (sqlmodel + aiosqlite), builds the default NetBox session, and registers the generated Proxmox proxy routes.",
      "Layers: routes/ (FastAPI routers — auth, dcim, extras, netbox, proxbox, proxmox, sync, virtualization) → services/sync/ (workflow orchestration) → schemas/ + enum/ (Pydantic 2 validation at every I/O boundary) → proxmox_to_netbox/ (transformation) → session/ (NetBox + Proxmox client factories as FastAPI dependencies).",
      "Sync runs stream Server-Sent Events plus optional WebSocket progress. /full-update/stream drives the complete chain: devices → storage → VMs → disks → backups → snapshots → interfaces → IPs → backup routines → replications.",
      "Auth: bcrypt-hashed API key in the X-Proxbox-API-Key header with brute-force lockout (proxbox_api/auth.py). Credentials at rest are Fernet-encrypted (PROXBOX_ENCRYPTION_KEY required in production).",
      "Persistence: SQLModel + aiosqlite for endpoint and key storage; no PostgreSQL dependency on the proxbox-api side.",
      "Concurrency knobs: PROXBOX_NETBOX_TIMEOUT (120s), PROXBOX_NETBOX_MAX_CONCURRENT (default 1, intentionally low), PROXBOX_VM_SYNC_MAX_CONCURRENCY, PROXBOX_NETBOX_GET_CACHE_TTL (60s GET cache, 0 disables), PROXBOX_RATE_LIMIT (60 req/min/IP via SlowAPI).",
      "Embedded admin UI: nextjs-ui/ — a Next.js frontend used to administer endpoints, separate build target.",
      "Generated proxy routes: proxbox_api/generated/ holds 646 typed Proxmox endpoints crawled from the Proxmox API Viewer. Do not edit by hand — regenerate from proxbox-api/proxmox_codegen/.",
    ],
  },
  integrations: [
    {
      target: "netbox-proxbox (NetBox plugin)",
      protocol: "HTTP REST + SSE + WebSocket (inbound)",
      library: "consumer — auth via X-Proxbox-API-Key",
      notes:
        "Every Full Update click in the plugin lands here as a request to /full-update/stream.",
    },
    {
      target: "NetBox REST API (write target)",
      protocol: "HTTP",
      library: "netbox-sdk==0.0.8.post1",
      notes:
        "Async aiohttp client sessions in proxbox_api/session/ + helpers in proxbox_api/netbox_rest.py. Cached GET layer (60s TTL) shared across the workflow.",
    },
    {
      target: "Proxmox VE (read source)",
      protocol: "HTTP",
      library: "proxmox-sdk==0.0.3.post1",
      notes:
        "Read-only — the workflow never POST/PUT/DELETEs back into Proxmox. Mock backend (MockBackend) used for fast tests.",
    },
    {
      target: "Next.js admin UI",
      protocol: "embedded",
      library: "nextjs-ui/ (separate build)",
      notes:
        "Manages bcrypt API keys, encrypted credentials and endpoint records via the same FastAPI surface.",
    },
  ],
  contributing: {
    devInstall: "uv sync --extra test --group dev",
    checks: [
      { label: "lint", cmd: "uv run ruff check ." },
      { label: "format", cmd: "uv run ruff format --check ." },
      {
        label: "syntax compile",
        cmd: "uv run python -m compileall proxbox_api tests",
      },
      {
        label: "type check (focused)",
        cmd: "uv run ty check proxbox_api/types proxbox_api/utils/retry.py proxbox_api/schemas/sync.py",
      },
      { label: "unit + integration", cmd: "uv run pytest tests" },
      {
        label: "Next.js admin UI",
        cmd: "cd nextjs-ui && npm run lint && npm run build",
      },
    ],
    codeStyle: [
      "Linter: ruff (select E4/E7/E9/F/I/ANN201/D103/W/C90, max complexity 10).",
      "Formatter: ruff format.",
      "Type checker: ty.",
      "PRs must include a passing run of all the checks above; the CI core job runs pytest tests/ -v --ignore=tests/e2e on every push and PR.",
    ],
    issuesUrl: "https://github.com/emersonfelipesp/proxbox-api/issues",
  },
  e2e: {
    framework:
      "pytest + pytest-asyncio + httpx.AsyncClient. Two marker modes — mock_backend (in-process, no HTTP) and mock_http (against a running proxmox-sdk container).",
    intro: [
      "The fast loop runs entirely in-process against MockBackend; no Docker, no network. The full loop spins up proxmox-sdk on 8006/8007 and a live NetBox container, and exercises every supported transport combination.",
      "A pre-publish E2E gate (e2e-pre-publish in publish-testpypi.yml) blocks any PyPI release whose matrix doesn't fully turn green.",
    ],
    commands: [
      { label: "all unit + integration", cmd: "uv run pytest tests" },
      {
        label: "E2E (mock backend, fast)",
        cmd: "uv run pytest tests/e2e -m mock_backend",
      },
      {
        label: "E2E (mock HTTP, requires Docker)",
        cmd: "docker compose up -d && uv run pytest tests/e2e -m mock_http",
      },
    ],
    coverage: [
      "Spec files: tests/e2e/conftest.py, test_vm_sync.py, test_devices_sync.py, test_backups_sync.py, test_demo_auth.py.",
      "Markers: @pytest.mark.mock_backend (in-process MockBackend) and @pytest.mark.mock_http (proxmox-sdk Docker container on ports 8006/8007).",
      "Auth helpers in proxbox_api/e2e/ are the only place Playwright is used in the backend.",
      "CI: ci.yml runs the core test job (pytest excluding tests/e2e) plus an E2E Docker matrix of 6 transport combos × netbox_proxbox_mode.",
      "Release gate: e2e-pre-publish in publish-testpypi.yml — must pass before TestPyPI / PyPI publish.",
    ],
    ciWorkflow: ".github/workflows/ci.yml",
    ciWorkflowUrl:
      "https://github.com/emersonfelipesp/proxbox-api/blob/main/.github/workflows/ci.yml",
  },
  links: {
    repo: "https://github.com/emersonfelipesp/proxbox-api",
    docs: "https://emersonfelipesp.github.io/proxbox-api/",
    plugin: "https://github.com/N-Multifibra/netbox-proxbox",
    "netbox-sdk": "https://github.com/emersonfelipesp/netbox-sdk",
    "proxmox-sdk": "https://github.com/emersonfelipesp/proxmox-sdk",
    issues: "https://github.com/emersonfelipesp/proxbox-api/issues",
  },
};
