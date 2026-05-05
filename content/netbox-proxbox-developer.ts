import type { DeveloperContent } from "./types";
import { netboxProxbox } from "./netbox-proxbox";

export const netboxProxboxDeveloper: DeveloperContent = {
  slug: "netbox-proxbox",
  name: "netbox-proxbox",
  fullName: "N-Multifibra/netbox-proxbox",
  palette: "netbox",
  tagline:
    "Developer guide — architecture, integrations, contribution workflow and end-to-end testing.",
  banner: netboxProxbox.banner,
  sections: [
    { id: "intro", label: "intro" },
    { id: "architecture", label: "architecture" },
    { id: "integrations", label: "integrations" },
    { id: "contributing", label: "contributing" },
    { id: "e2e", label: "e2e" },
    { id: "links", label: "links" },
  ],
  intro: [
    "netbox-proxbox is a Django plugin shipped on top of NetBox 4.5.x / 4.6.x. It runs inside the NetBox process and orchestrates all real Proxmox traffic through a sibling FastAPI service called proxbox-api.",
    "This page documents the moving parts a contributor has to understand: how a Full Update click in the NetBox UI ends up streaming clusters, nodes, VMs, snapshots and backups into the source-of-truth, where the code that does it lives, and how the test suite proves the wiring works.",
  ],
  architecture: {
    bullets: [
      "Plugin entry: netbox_proxbox/__init__.py registers the NetBoxPluginConfig (currently certified against NetBox v4.5.8 → v4.6.x).",
      "Persisted models: ProxmoxEndpoint, NetBoxEndpoint (singleton), FastAPIEndpoint (singleton), ProxmoxCluster, ProxmoxNode, ProxmoxStorage, BackupRoutine, Replication, VMBackup, VMSnapshot, VMTaskHistory, ProxboxPluginSettings.",
      "URL routing: netbox_proxbox/urls.py wires every CRUD and operational view; views in netbox_proxbox/views/ extend NetBoxModelViewSet and use register_model_view for related-object panels.",
      "REST API: netbox_proxbox/api/ exposes DRF NetBoxModelViewSet routes for every persisted model.",
      "Sync workflow: a Full Update enqueues ProxboxSyncJob on NetBox's RQ default queue (7200s job timeout, 3600s HTTP read timeout). The job calls proxbox-api's full-update/stream endpoint and replays each SSE event back to the browser via netbox_proxbox/services/backend_proxy.py.",
      "Live log viewer: a separate WebSocket bridge keeps proxbox-api's log buffer streaming inside the plugin UI. Browser-side parsing lives in netbox_proxbox/static/netbox_proxbox/js/.",
      "Security model: CRUD views use ObjectPermissionRequiredMixin; custom views use ConditionalLoginRequiredMixin (respects NetBox's LOGIN_REQUIRED); operational endpoints use ContentTypePermissionRequiredMixin.",
      "Companion CLI: proxbox_cli/ ships the pxb command (declared in pyproject.toml [project.scripts]) for headless sync triggers.",
    ],
  },
  integrations: [
    {
      target: "proxbox-api",
      protocol: "HTTP REST + Server-Sent Events + WebSocket",
      library: "requests + websockets + a small SSE reader in services/backend_proxy.py",
      notes:
        "Resolved at runtime via FastAPIEndpoint.objects.first() — never imported as a Python dependency.",
    },
    {
      target: "NetBox core (Django ORM + DRF)",
      protocol: "in-process",
      library: "NetBox plugin framework",
      notes:
        "Plugin lives inside NetBox; persists its own models in NetBox's database and renders inside NetBox's templates.",
    },
    {
      target: "Proxmox VE",
      protocol: "indirect",
      library: "—",
      notes:
        "The plugin never talks to Proxmox directly; everything goes through proxbox-api.",
    },
  ],
  contributing: {
    devInstall: "pip install -e '.[dev,test,cli]'",
    checks: [
      { label: "syntax compile", cmd: "python -m compileall netbox_proxbox tests" },
      { label: "lint", cmd: "rtk ruff check ." },
      { label: "type check (cli)", cmd: "rtk ty check proxbox_cli" },
      { label: "unit + integration", cmd: "rtk pytest tests/" },
    ],
    codeStyle: [
      "Linter: ruff (line length 88, select E/F/W).",
      "Formatter: black.",
      "Type checker: ty (>=0.0.1a19).",
      "Pre-commit hooks: .pre-commit-config.yaml (run before opening a PR).",
      "PRs reference the closing issue with `Closes #<id>`. Contribution guide: CONTRIBUTING.md.",
    ],
    issuesUrl: "https://github.com/N-Multifibra/netbox-proxbox/issues",
  },
  e2e: {
    framework:
      "Plain Python requests + Docker Compose stack (NetBox + PostgreSQL + Redis + proxbox-api + a proxmox-sdk:dev-nginx mock).",
    intro: [
      "There is no pytest E2E target — the suite is a runnable Python script that brings the whole stack up, drives a Full Update, and asserts the resulting NetBox state.",
      "The same suite is wired into a GitHub Actions matrix that re-runs the entire flow against three install sources and two dependency modes for every release candidate, plus once per night.",
    ],
    commands: [
      { label: "run E2E locally", cmd: "python tests/e2e/e2e_stack_check.py" },
    ],
    coverage: [
      "Spec files: tests/e2e/e2e_stack_check.py, stack_setup.py, stack_sync.py, stack_common.py, mock_proxmox_api.py.",
      "Stack: NetBox image netboxcommunity/netbox:v4.5.8 / v4.5.9 / v4.6.0 + Postgres + Redis + proxbox-api + proxmox-sdk:dev-nginx.",
      "Mock data: tests/e2e/proxmox_openapi_mock_data.json mounted into the proxmox-sdk mock container.",
      "Matrix axes: install_source ∈ {local, pypi, container} × dependency_mode ∈ {dev, published}.",
      "Release gate: e2e-docker-local must be green before publishing to PyPI.",
      "Schedule: nightly cron 31 2 * * * exercises the full matrix unattended.",
    ],
    ciWorkflow: ".github/workflows/e2e-docker.yml",
    ciWorkflowUrl:
      "https://github.com/N-Multifibra/netbox-proxbox/blob/main/.github/workflows/e2e-docker.yml",
  },
  links: {
    repo: "https://github.com/N-Multifibra/netbox-proxbox",
    docs: "https://emersonfelipesp.github.io/netbox-proxbox/",
    backendRepo: "https://github.com/emersonfelipesp/proxbox-api",
    issues: "https://github.com/N-Multifibra/netbox-proxbox/issues",
    contributing:
      "https://github.com/N-Multifibra/netbox-proxbox/blob/main/CONTRIBUTING.md",
  },
};
