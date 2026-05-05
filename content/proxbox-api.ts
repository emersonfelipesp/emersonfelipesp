export const proxboxApi = {
  slug: "proxbox-api",
  name: "proxbox-api",
  fullName: "emersonfelipesp/proxbox-api",
  palette: "mixed" as const,
  tagline:
    "FastAPI orchestrator that bridges Proxmox VE and NetBox for the Proxbox suite.",
  description: [
    "proxbox-api is the FastAPI service that powers the Proxbox stack. It is the engine behind every Full Update click you see inside the netbox-proxbox NetBox plugin.",
    "It exposes REST, Server-Sent Events and WebSocket endpoints so the plugin can discover, sync and stream live progress for clusters, nodes, VMs, containers, storage, snapshots and backups.",
    "Internally it stands on two SDKs: netbox-sdk talks to the NetBox REST API as the write target, and proxmox-sdk talks to Proxmox VE as the read source. proxbox-api is the only place where both worlds are reconciled.",
  ],
  features: [
    "FastAPI orchestrator with Swagger UI at /docs",
    "REST + Server-Sent Events + WebSocket sync streams",
    "Bcrypt-hashed API key auth (X-Proxbox-API-Key) with brute-force lockout",
    "Encrypted credentials at rest (Fernet) — PROXBOX_ENCRYPTION_KEY required",
    "SQLModel + SQLite for endpoint and key storage",
    "Per-VM and per-endpoint sync flags driven by the netbox-proxbox plugin",
    "Read-only Proxmox discovery — never mutates the source cluster",
    "Bundled Next.js admin UI for endpoint configuration (nextjs-ui/)",
  ],
  stack: [
    "Python 3.11+ / FastAPI 0.136 + uvicorn",
    "SQLModel 0.0.38 + aiosqlite",
    "Pydantic 2.13",
    "bcrypt + cryptography (Fernet)",
    "netbox-sdk 0.0.7.post6 (NetBox REST client)",
    "proxmox-sdk 0.0.3.post1 (Proxmox VE SDK)",
    "Next.js admin UI (nextjs-ui/)",
  ],
  install: {
    primary: "docker pull emersonfelipesp/proxbox-api:latest",
    note: "Then run with -p 8800:8000. The netbox-proxbox plugin will reach this URL via its FastAPI endpoint object.",
  },
  meta: {
    license: "Apache-2.0",
    python: "3.11+",
    netbox: "4.5.x / 4.6.x",
    proxmox: "7.x / 8.x",
    latestRelease: "v0.0.10.post2",
    stars: 18,
    forks: 1,
  },
  links: {
    repo: "https://github.com/emersonfelipesp/proxbox-api",
    docs: "https://emersonfelipesp.github.io/proxbox-api/",
    plugin: "https://github.com/emersonfelipesp/netbox-proxbox",
    "netbox-sdk": "https://github.com/emersonfelipesp/netbox-sdk",
    "proxmox-sdk": "https://github.com/emersonfelipesp/proxmox-sdk",
  },
  banner: String.raw`
   ___                _                       _    ___ ___
  | _ \_ _ _____ ___| |__  _____ __  ___    /_\  | _ \_ _|
  |  _/ '_/ _ \ \ /| '_ \/ _ \ \ /(_-<-_)  / _ \ |  _/| |
  |_| |_| \___/_\_\|_.__/\___/_\_\/__/__/ /_/ \_\|_|  |___|
   p r o x m o x  ⇄  n e t b o x   ·  f a s t a p i
`,
  sections: [
    { id: "overview", label: "overview" },
    { id: "features", label: "features" },
    { id: "integrations", label: "integrations" },
    { id: "install", label: "install" },
    { id: "repo", label: "repo" },
    { id: "links", label: "links" },
  ],
  integrations: [
    {
      id: "netbox-proxbox",
      title: "netbox-proxbox · NetBox plugin",
      role: "consumer (frontend)",
      transport: "HTTP / SSE / WebSocket",
      direction: "netbox-proxbox → proxbox-api",
      href: "/netbox-proxbox",
      body: [
        "netbox-proxbox is a Django plugin that lives inside NetBox and never talks to Proxmox itself. Every cluster, node and VM you see in NetBox got there because the plugin asked proxbox-api to fetch it.",
        "The plugin stores three endpoint objects (Proxmox, NetBox, FastAPI) and dispatches sync requests to the FastAPI endpoint (this service). Progress comes back over Server-Sent Events and the live log viewer is fed by a WebSocket from proxbox-api.",
      ],
      bullets: [
        "Triggers Full Update / per-VM / per-endpoint syncs over REST",
        "Streams progress to the plugin's UI via SSE (real-time bars)",
        "Pushes the proxbox-api log buffer back to the plugin via WebSocket",
        "Honours per-endpoint overwrite flags set in the plugin's UI",
        "Authenticates with the X-Proxbox-API-Key configured on the FastAPI endpoint object",
      ],
    },
    {
      id: "netbox-sdk",
      title: "netbox-sdk · NetBox REST SDK",
      role: "downstream — write target",
      transport: "HTTP (NetBox REST API)",
      direction: "proxbox-api → netbox-sdk → NetBox REST",
      href: "/netbox-sdk",
      body: [
        "netbox-sdk is the async Python toolkit for the NetBox REST API. proxbox-api uses it as the write side of every sync — clusters become NetBox cluster groups, nodes become devices, VMs become virtual machines, network interfaces and IP assignments are reconciled in place.",
        "Reusing netbox-sdk means proxbox-api inherits its session pooling, typed responses, retry policy and concurrency knobs (PROXBOX_NETBOX_MAX_CONCURRENT, PROXBOX_NETBOX_GET_CACHE_TTL) without reinventing the HTTP layer.",
      ],
      bullets: [
        "Pinned dependency: netbox-sdk 0.0.7.post6",
        "Single source of NetBox session creation in proxbox_api/session/",
        "Drives every DCIM, IPAM and Virtualization write the plugin asks for",
        "Cached GET layer (60s default) shared across the sync workflow",
        "Compatible with NetBox 4.5.x and 4.6.x — version detection lives here",
      ],
    },
    {
      id: "proxmox-sdk",
      title: "proxmox-sdk · Proxmox VE SDK",
      role: "downstream — read source",
      transport: "HTTP (Proxmox VE REST API)",
      direction: "proxbox-api → proxmox-sdk → Proxmox VE",
      href: "/proxmox-sdk",
      body: [
        "proxmox-sdk is the schema-driven SDK that mirrors the Proxmox VE 8.1 API as 646 typed endpoints. proxbox-api uses it as the read side of every sync — clusters, nodes, storage, VMs, containers, snapshots and backups are all queried through it.",
        "Because proxmox-sdk supports a mock mode out of the box, proxbox-api can be developed and tested end-to-end against a fake Proxmox cluster, with the same schema the production proxy validates. The proxmox-mock sub-package shipped under proxbox-api-repo at tag v0.0.7 is the integration-test counterpart.",
      ],
      bullets: [
        "Pinned dependency: proxmox-sdk 0.0.3.post1",
        "Read-only — proxbox-api never POSTs, PUTs or DELETEs into Proxmox",
        "Async client used inside the SSE-driven sync workflow",
        "Mock mode enables offline integration tests with realistic schemas",
        "Concurrency capped by PROXBOX_VM_SYNC_MAX_CONCURRENCY",
      ],
    },
  ],
};
