import { PROJECTS } from "@/lib/project-registry";

const project = PROJECTS["netbox-rpc"];

export const netboxRpc = {
  slug: project.slug,
  name: project.name,
  fullName: project.fullName,
  palette: project.palette,
  tagline: project.tagline,
  description: [
    "netbox-rpc is the Remote Command Policy bounded context inside NetBox. It owns the procedure catalog, approval and destructive gates, execution audit ledger, and backend dispatch — not SSH drivers or device protocol implementations. Those live in netbox-rpc-backend and other executor services.",
    "Every host operation that would otherwise become an ad-hoc shell script becomes a seeded RPCProcedure with a params schema, Linux-service allowlist entry when applicable, and a visible execution history. Operators and automation share one NetBox RBAC model for execute, approve, and cancel.",
  ],
  features: [
    "RPCProcedure catalog with versioned commands, effect classes, and optional approval/destructive gating",
    "Append-only RPCExecutionEvent ledger with projection fold — terminal states never transition backward",
    "RPCBackend registry selects netbox-rpc-backend (or other executors) without embedding drivers in the plugin",
    "Credential material resolved through netbox-openbao reveal when a procedure needs SSH keys or passwords",
    "Companion integrations: netbox-proxbox service monitoring, netbox-packer template verify, netbox-fileserver Samba, netbox-proxy NGINX deploy",
    "OpenBao host operations (health, seal status, policy reload) as audited procedures — never raw shell from other plugins",
    "nms rpc / nbx automation dispatch through the same REST API and permission checks as the UI",
  ],
  howItWorks: {
    title: "how it works",
    paragraphs: [
      "An operator or API client creates an RPCExecution against an enabled RPCProcedure and target NetBox object (device, VM, service, or plugin-specific endpoint). The command handler checks execute permission, normalizes params against the schema, and enqueues an RQ job.",
      "The job selects an RPCBackend row, forwards the normalized command to netbox-rpc-backend over HTTPS, and appends typed domain events as progress arrives. Success, failure, and cancellation each land in the execution projection and in NetBox ObjectChange where applicable.",
      "When SSH material is required, the backend asks NetBox to reveal assigned credentials through netbox-openbao (direct AppRole or broker mTLS). Inventory metadata stays in NetBox; secrets never enter procedure params or GET responses.",
    ],
    splitTable: {
      headers: ["Owned by netbox-rpc", "Owned by executor backend"],
      rows: [
        ["procedure policy and params schema", "SSH/CLI driver selection"],
        ["approval / destructive gates", "fixed-argv command assembly"],
        ["RPCExecution audit ledger", "host connectivity and timeouts"],
        ["NetBox RBAC for execute/cancel", "credential reveal callback to openbao"],
        ["RPCBackend routing metadata", "stdout/stderr capture and redaction"],
      ],
    },
  },
  security: {
    title: "security model",
    bullets: [
      "Caller input never reaches a shell — handlers use structured params mapped to fixed argv templates",
      "Destructive procedures require explicit approval and never run autonomously from companion plugins",
      "Execution events are append-only with payload hashing; ORM deletes on the ledger are rejected",
      "Backend exceptions are bounded and redacted before they reach clients or ObjectChange snapshots",
      "Reveal permissions stay on netbox-openbao; RPC only references credential assignments by ID",
    ],
  },
  ecosystem: {
    title: "ecosystem",
    items: [
      {
        name: "netbox-rpc-backend",
        href: "https://github.com/N-MultiCloud/netbox-rpc-backend",
        description:
          "FastAPI executor that runs audited procedures over SSH/CLI. netbox-rpc selects a backend row; drivers never ship inside the NetBox plugin.",
      },
      {
        name: "netbox-openbao",
        href: "https://emersonfelipesp.com/netbox-openbao",
        description:
          "Stores SSH and API material in OpenBao KV v2. RPC backends reveal assigned credentials at execution time with the same POST-only audit trail.",
      },
      {
        name: "netbox-openbao-broker",
        href: "https://github.com/emersonfelipesp/netbox-openbao-broker",
        description:
          "Optional sidecar so vault AppRoles never sit on the NetBox host. RPC and openbao share the broker path for host operations and guest SSH.",
      },
      {
        name: "netbox-proxbox",
        href: "https://emersonfelipesp.com/netbox-proxbox",
        description:
          "Queues read-only systemd service monitoring and Proxmox endpoint SSH procedures through netbox-rpc when the companion integration is enabled.",
      },
      {
        name: "netbox-packer · netbox-fileserver · netbox-proxy",
        href: "https://emersonfelipesp.com/netbox-rpc/integrations",
        description:
          "Template verification, Samba share checks, and NGINX config deploy each declare companion RPC procedures — see the cross-plugin architecture page.",
      },
    ],
  },
  apiExamples: {
    title: "api",
    intro:
      "List procedures, create executions, and poll status through /api/plugins/rpc/. Approval-gated runs expose a separate approve action.",
    snippets: [
      {
        label: "list enabled procedures",
        lang: "bash",
        content: String.raw`curl -H "Authorization: Bearer $TOKEN" \
  'https://netbox.example.net/api/plugins/rpc/procedures/?enabled=true'`,
      },
      {
        label: "queue execution",
        lang: "bash",
        content: String.raw`curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"procedure":"os.linux.ubuntu.24.restart_service","target":44,"params":{"service_slug":"netbox"}}' \
  'https://netbox.example.net/api/plugins/rpc/executions/'`,
      },
    ],
  },
  stack: [
    "NetBox plugin (Django / Python 3.12+)",
    "PostgreSQL 15+ for procedure catalog and execution ledger",
    "Redis 6+ and NetBox RQ for async dispatch",
    "netbox-rpc-backend executor (FastAPI, multi-driver SSH layer)",
  ],
  install: {
    primary: "pip install netbox-rpc",
    note: "Requires netbox-rpc-backend reachable from NetBox and RPCBackend rows seeded for your estate. Companion plugins add optional procedure families.",
  },
  meta: {
    license: "Apache-2.0",
    netbox: "4.6.x – 4.7.x",
    python: "3.12+",
  },
  links: {
    repo: project.repoUrl,
    integrations: "https://emersonfelipesp.com/netbox-rpc/integrations",
    backend: "https://github.com/N-MultiCloud/netbox-rpc-backend",
    openbao: "https://emersonfelipesp.com/netbox-openbao",
    proxbox: "https://emersonfelipesp.com/netbox-proxbox",
  },
  banner: String.raw`
  _ __ ___  ___  ___  ___
 | '__/ _ \/ __|/ _ \/ __|
 | | |  __/\__ \  __/ /__
 |_|  \___||___/\___\___|
   r e m o t e  c o m m a n d  p o l i c y
`,
  sections: [
    { id: "overview", label: "overview" },
    { id: "features", label: "features" },
    { id: "how-it-works", label: "how-it-works" },
    { id: "security", label: "security" },
    { id: "ecosystem", label: "ecosystem" },
    { id: "stack", label: "stack" },
    { id: "install", label: "install" },
    { id: "api", label: "api" },
    { id: "repo", label: "repo" },
    { id: "links", label: "links" },
  ],
} as const;

export type NetboxRpcContent = typeof netboxRpc;

