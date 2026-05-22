import { PROJECTS } from "@/lib/project-registry";

const project = PROJECTS["netbox-proxbox"];

export const netboxProxbox = {
  slug: project.slug,
  name: project.name,
  fullName: project.fullName,
  palette: project.palette,
  tagline:
    "NetBox plugin that synchronizes Proxmox infrastructure into NetBox via a FastAPI backend.",
  description: [
    "netbox-proxbox keeps your DCIM in sync with real Proxmox clusters by streaming clusters, nodes, VMs, containers, storage, snapshots and backups straight into NetBox.",
    "It pairs a NetBox plugin (Django) with a dedicated FastAPI service called proxbox-api that does the heavy lifting and pushes progress live over Server-Sent Events.",
  ],
  features: [
    "Automatic sync: clusters, nodes, VMs, containers, storage, snapshots, backups",
    "Real-time progress via Server-Sent Events (SSE) streaming",
    "Granular per-VM and per-endpoint sync flags",
    "Live backend log viewer pulled from proxbox-api",
    "Endpoint configuration via CSV / JSON / YAML import & export",
    "Read-only discovery — never mutates resources on Proxmox",
    "Network interface and IP assignment tracking inside NetBox",
  ],
  stack: [
    "NetBox plugin (Django / Python 3.12+)",
    "proxbox-api (FastAPI backend)",
    "Server-Sent Events for streaming",
    "MkDocs Material for docs",
  ],
  install: {
    primary: "pip install netbox-proxbox",
    note: "Plus the proxbox-api backend (Docker image or standalone). See docs.",
  },
  meta: {
    license: "Apache-2.0",
    netbox: "4.6.x",
    python: "3.12+",
    proxmox: "7.x / 8.x",
    latestRelease: "v0.0.13.post4",
    stars: 539,
    forks: 62,
  },
  links: {
    repo: project.repoUrl,
    docs: "https://emersonfelipesp.com/netbox-proxbox/docs/",
    backendRepo: "https://github.com/emersonfelipesp/proxbox-api",
    "Proxmox Forum":
      "https://forum.proxmox.com/threads/proxbox-netbox-plugin-for-syncing-proxmox-ve-inventory-into-netbox.183646/",
    "Reddit r/Proxmox":
      "https://www.reddit.com/r/Proxmox/comments/1tglo8y/proxbox_netbox_plugin_for_syncing_proxmox_ve/",
    "Reddit r/Netbox":
      "https://www.reddit.com/r/Netbox/comments/1tglnow/proxbox_netbox_plugin_for_syncing_proxmox_ve/",
  },
  banner: String.raw`
   ___              _
  | _ \_ _ _____ __| |__  _____ __
  |  _/ '_/ _ \ \ / '_ \/ _ \ \ /
  |_| |_| \___/_\_\_.__/\___/_\_\
   n e t b o x  ⇄  p r o x m o x
`,
  sections: [
    { id: "overview", label: "overview" },
    { id: "features", label: "features" },
    { id: "install", label: "install" },
    { id: "configure", label: "configure" },
    { id: "screenshots", label: "screenshots" },
    { id: "repo", label: "repo" },
    { id: "links", label: "links" },
  ],
  installation: {
    git: [
      {
        title: "Clone the repository into NetBox's plugins directory",
        body: "On the NetBox host, drop the plugin source next to NetBox itself.",
        code: "cd /opt/netbox/netbox/\nsudo git clone https://github.com/emersonfelipesp/netbox-proxbox.git",
      },
      {
        title: "Activate the NetBox virtualenv",
        body: "Every NetBox install ships its own venv — use it so the plugin links against NetBox's exact dependencies.",
        code: "source /opt/netbox/venv/bin/activate",
      },
      {
        title: "Install the plugin in editable mode",
        body: "Editable install means future `git pull`s pick up new code without re-installing.",
        code: "pip install -e /opt/netbox/netbox/netbox-proxbox",
      },
      {
        title: "Enable the plugin in NetBox configuration",
        body: "Edit `/opt/netbox/netbox/netbox/configuration.py` and append `\"netbox_proxbox\"` to the `PLUGINS` list.",
        code: 'PLUGINS = [\n    "netbox_proxbox",\n]',
        codeLabel: "configuration.py",
      },
      {
        title: "Run database migrations",
        body: "Creates the plugin's tables (endpoints, plugin settings, sync history).",
        code: "python3 /opt/netbox/netbox/manage.py migrate netbox_proxbox",
      },
      {
        title: "Collect static assets",
        body: "Required so the plugin's CSS/JS are served by NetBox.",
        code: "python3 /opt/netbox/netbox/manage.py collectstatic --no-input",
      },
      {
        title: "Restart NetBox services",
        body: "Picks up the new plugin and serves it under Plugins → Proxbox.",
        code: "sudo systemctl restart netbox netbox-rq",
      },
      {
        title: "Verify",
        body: 'Open the NetBox web UI, navigate to Plugins → Proxbox. The home page should load with three empty endpoint lists — that means installation is healthy.',
      },
    ],
    docker: [
      {
        title: "Add the plugin to plugin_requirements.txt",
        body: "On netbox-community/netbox-docker, plugin requirements live alongside the compose file.",
        code: "echo 'netbox-proxbox' >> plugin_requirements.txt",
      },
      {
        title: "Enable the plugin in configuration/plugins.py",
        body: "Mirrors the venv flow but inside the docker config directory.",
        code: 'PLUGINS = [\n    "netbox_proxbox",\n]',
        codeLabel: "configuration/plugins.py",
      },
      {
        title: "Rebuild and start NetBox",
        body: "The build pulls the plugin from PyPI into the image; up -d boots NetBox + workers.",
        code: "docker compose build --no-cache netbox\ndocker compose up -d",
      },
      {
        title: "Run migrations inside the container",
        body: "Same `manage.py migrate` as venv install, but routed through the running container.",
        code: "docker compose exec netbox /opt/netbox/venv/bin/python /opt/netbox/netbox/manage.py migrate netbox_proxbox",
      },
      {
        title: "Verify",
        body: "Browse to NetBox → Plugins → Proxbox. If the page renders, you are ready to add endpoints.",
      },
    ],
    backend: [
      {
        title: "Pull the proxbox-api Docker image",
        body: "The backend is the FastAPI service that actually talks to Proxmox and pushes streaming progress to the plugin.",
        code: "docker pull emersonfelipesp/proxbox-api:latest",
      },
      {
        title: "Run the backend on port 8800",
        body: "Map host 8800 → container 8000. The plugin will reach this URL via the FastAPI endpoint object you create next.",
        code: "docker run -d \\\n  --name proxbox-api \\\n  -p 8800:8000 \\\n  --restart unless-stopped \\\n  emersonfelipesp/proxbox-api:latest",
      },
      {
        title: "Verify health",
        body: "A 200 OK from /health means the backend is up. Need TLS or a non-Docker install? See the upstream backend docs.",
        code: "curl -sf http://localhost:8800/health && echo OK",
      },
    ],
  },
  configuration: {
    endpoints: [
      {
        title: "Create the Proxmox API endpoint",
        body: [
          "In NetBox, go to Plugins → Proxbox → Proxmox Endpoints → Add.",
          "Fill in the Proxmox host or VIP, port (usually 8006), and either user/password or an API token. Toggle TLS verification according to your environment.",
        ],
      },
      {
        title: "Create the NetBox API endpoint",
        body: [
          "Plugins → Proxbox → NetBox Endpoints → Add.",
          "Point this at the same NetBox you are configuring (yes, NetBox calls itself), with port 443 and a NetBox API token that has write permissions on DCIM/Virtualization.",
        ],
      },
      {
        title: "Create the ProxBox API (FastAPI) endpoint",
        body: [
          "Plugins → Proxbox → FastAPI Endpoints → Add.",
          "Hostname or IP of the proxbox-api service, port 8800 (or whatever you mapped). This is the bridge that performs the actual sync and streams progress back over SSE.",
        ],
      },
      {
        title: "Run a Full Update",
        body: 'From Plugins → Proxbox home page, click "Full Update". The page streams live SSE progress as clusters, nodes, VMs, containers, storage, snapshots and backups appear in NetBox.',
      },
    ],
    settings: [
      {
        title: "Tune plugin settings",
        body: [
          "Plugins → Proxbox → Plugin Settings exposes a singleton settings object.",
          "Useful knobs: guest-agent interface naming, Proxmox fetch concurrency, IPv6 link-local filtering, NetBox concurrency + retry policy, bulk-batch sizing, VM sync parallelism.",
        ],
      },
      {
        title: "Configure SSRF protection",
        body: "Same settings page. Enable / disable SSRF protection, allow specific private IPs or CIDRs. Keep the default unless you intentionally point endpoints at link-local or private addresses.",
      },
      {
        title: "Set sync overwrite flags",
        body: [
          "Every `overwrite_*` flag is configurable globally on plugin settings or per-endpoint on the Settings tab of each Proxmox endpoint.",
          "Per-endpoint flags use a tri-state: Use plugin default / Always overwrite / Never overwrite. This lets you treat one cluster as authoritative while merging from another.",
        ],
      },
    ],
  },
  screenshots: [
    {
      id: "overview",
      title: "Plugin home & dashboard",
      items: [
        {
          src: "/netbox-proxbox/screenshots/home.png",
          alt: "Proxbox plugin home page inside NetBox",
          caption: "Plugin home — endpoint status cards and quick-sync actions.",
        },
        {
          src: "/netbox-proxbox/screenshots/dashboard.png",
          alt: "Proxbox operational dashboard",
          caption: "Operational dashboard — cluster and node summaries at a glance.",
        },
      ],
    },
    {
      id: "endpoints",
      title: "Endpoint configuration",
      items: [
        {
          src: "/netbox-proxbox/screenshots/proxmox-endpoints.png",
          alt: "List of configured Proxmox API endpoints",
          caption: "Proxmox API endpoints — every cluster Proxbox can reach.",
        },
        {
          src: "/netbox-proxbox/screenshots/proxmox-endpoint-detail.png",
          alt: "Single Proxmox endpoint detail page",
          caption: "Proxmox endpoint detail — credentials, TLS, mode of access.",
        },
        {
          src: "/netbox-proxbox/screenshots/proxmox-endpoint-settings.png",
          alt: "Per-endpoint Proxmox sync settings",
          caption: "Per-endpoint sync settings — tri-state overwrite flags.",
        },
        {
          src: "/netbox-proxbox/screenshots/fastapi-endpoints.png",
          alt: "List of FastAPI / proxbox-api endpoints",
          caption: "FastAPI endpoints — the proxbox-api backend Proxbox talks to.",
        },
        {
          src: "/netbox-proxbox/screenshots/fastapi-endpoint-detail.png",
          alt: "FastAPI endpoint detail",
          caption: "FastAPI endpoint detail — host, port, TLS verify.",
        },
        {
          src: "/netbox-proxbox/screenshots/netbox-endpoints.png",
          alt: "List of NetBox endpoints (self-referential)",
          caption: "NetBox endpoints — the self-referential write target.",
        },
        {
          src: "/netbox-proxbox/screenshots/netbox-endpoint-detail.png",
          alt: "NetBox endpoint detail",
          caption: "NetBox endpoint detail — token & API base URL.",
        },
      ],
    },
    {
      id: "infrastructure",
      title: "Clusters, nodes, storage",
      items: [
        {
          src: "/netbox-proxbox/screenshots/clusters.png",
          alt: "Proxmox clusters synchronized into NetBox",
          caption: "Clusters — every Proxmox cluster surfaced in NetBox.",
        },
        {
          src: "/netbox-proxbox/screenshots/nodes.png",
          alt: "Proxmox nodes per cluster",
          caption: "Nodes — devices that make up each Proxmox cluster.",
        },
        {
          src: "/netbox-proxbox/screenshots/storage.png",
          alt: "Proxmox storage pools",
          caption: "Storage — pools discovered from Proxmox.",
        },
        {
          src: "/netbox-proxbox/screenshots/storage-detail.png",
          alt: "Single storage pool detail",
          caption: "Storage detail — type, capacity, content classes.",
        },
      ],
    },
    {
      id: "vms-containers",
      title: "Virtual machines & LXC containers",
      items: [
        {
          src: "/netbox-proxbox/screenshots/virtual-machines.png",
          alt: "All Proxmox VMs synchronized into NetBox",
          caption: "Virtual machines — full inventory across all clusters.",
        },
        {
          src: "/netbox-proxbox/screenshots/virtual-machine-detail.png",
          alt: "Single virtual machine detail page",
          caption: "VM detail — Proxmox config tab plus NetBox-native fields.",
        },
        {
          src: "/netbox-proxbox/screenshots/lxc-containers.png",
          alt: "LXC containers managed by Proxmox",
          caption: "LXC containers — discovered alongside KVM guests.",
        },
        {
          src: "/netbox-proxbox/screenshots/lxc-container-detail.png",
          alt: "Single LXC container detail",
          caption: "Container detail — config, network, snapshots.",
        },
      ],
    },
    {
      id: "backups",
      title: "Backups, snapshots, replications",
      items: [
        {
          src: "/netbox-proxbox/screenshots/backups.png",
          alt: "VM backup jobs discovered from storage",
          caption: "Backups — vzdump archives discovered on each storage.",
        },
        {
          src: "/netbox-proxbox/screenshots/backup-detail.png",
          alt: "Single backup detail",
          caption: "Backup detail — guest, size, mode, timestamp.",
        },
        {
          src: "/netbox-proxbox/screenshots/snapshots.png",
          alt: "VM and container snapshots",
          caption: "Snapshots — across VMs and containers.",
        },
        {
          src: "/netbox-proxbox/screenshots/snapshot-detail.png",
          alt: "Single snapshot detail",
          caption: "Snapshot detail — parent, RAM, description.",
        },
        {
          src: "/netbox-proxbox/screenshots/backup-routines.png",
          alt: "Backup routine definitions",
          caption: "Backup routines — vzdump schedules + targets.",
        },
        {
          src: "/netbox-proxbox/screenshots/backup-routine-detail.png",
          alt: "Single backup routine detail",
          caption: "Backup routine detail — selection, retention, mailto.",
        },
        {
          src: "/netbox-proxbox/screenshots/replications.png",
          alt: "Replication job status and config",
          caption: "Replications — Proxmox replication jobs & status.",
        },
      ],
    },
    {
      id: "tasks",
      title: "Task history",
      items: [
        {
          src: "/netbox-proxbox/screenshots/task-history.png",
          alt: "VM task history",
          caption: "Task history — Proxmox jobs surfaced inside NetBox.",
        },
        {
          src: "/netbox-proxbox/screenshots/task-history-detail.png",
          alt: "Individual task detail",
          caption: "Task detail — status, log output, duration.",
        },
      ],
    },
  ],
};
