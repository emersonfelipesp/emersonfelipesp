import { PROJECTS } from "@/lib/project-registry";
import type { SectionLink } from "./types";

const project = PROJECTS["netbox-rpc"];

export const netboxRpcIntegrationsSections: readonly SectionLink[] = [
  { id: "overview", label: "overview" },
  { id: "dispatch", label: "dispatch lane" },
  { id: "credentials", label: "credential lane" },
  { id: "integrations", label: "plugin map" },
  { id: "boundary", label: "boundary" },
  { id: "workflow", label: "operator flow" },
];

export const netboxRpcIntegrations = {
  slug: project.slug,
  pageSlug: "integrations",
  name: "Cross-plugin RPC architecture",
  fullName: project.fullName,
  palette: project.palette,
  tagline:
    "How netbox-rpc catalogs audited procedures, dispatches through netbox-rpc-backend, and meets companion plugins on shared NetBox objects — without ad-hoc shell or inter-plugin imports.",
  banner: String.raw`
 ___ _ __ ___  ___  ___  ___
/ __| '__/ _ \/ __|/ _ \/ __|
\__ \ | |  __/\__ \  __/ /__
|___/_|  \___||___/\___\___|
  c r o s s - p l u g i n  i n t e g r a t i o n s
`,
  sections: netboxRpcIntegrationsSections,
  intro: [
    "netbox-rpc never embeds SSH drivers or OpenBao clients for guest credentials. It owns procedure policy, execution audit, and backend selection inside NetBox. netbox-rpc-backend performs host connectivity; netbox-openbao reveals material when a procedure needs login secrets.",
    "Companion plugins — netbox-proxbox, netbox-packer, netbox-fileserver, netbox-proxy, and netbox-openbao itself — integrate by declaring RPCProcedure seeds and calling the same execution API operators use. They do not import each other's Python modules at runtime.",
    "Every integration lane is visible in NetBox: procedure catalog rows, RPCExecution history, and ObjectChange on configuration entities. If a capability is not listed under procedures and executions, it has not been added to the audited surface.",
  ],
  principles: {
    title: "design principles",
    bullets: [
      "Policy in NetBox, execution in backend services — netbox-rpc is the contract boundary, not the driver layer.",
      "Structured params only — caller input maps to fixed argv; nothing passes through eval, shell interpolation, or ad-hoc one-liners.",
      "Credentials via netbox-openbao reveal at execution time — assignments live on devices, VMs, and services; material never appears on GET.",
      "Companion plugins queue procedures they need; they never SSH to Proxmox or OpenBao directly when netbox-rpc is installed.",
      "Destructive and approval-gated procedures require human intent — automation cannot bypass the gate silently.",
    ],
  },
  integrationsTable: {
    title: "companion integrations",
    headers: ["Plugin", "Integration", "Typical procedures"],
    rows: [
      [
        "netbox-proxbox",
        "Endpoint service monitoring, Proxmox SSH reads",
        "systemd status refresh, read-only host probes",
      ],
      [
        "netbox-openbao",
        "Vault host operations",
        "health, seal status, policy reload via audited RPC",
      ],
      [
        "netbox-packer",
        "Template bake verification",
        "post-build SSH checks on baked templates",
      ],
      [
        "netbox-fileserver",
        "Samba share validation",
        "share list and permission probes",
      ],
      [
        "netbox-proxy",
        "NGINX config deploy",
        "config test and reload through netbox-rpc",
      ],
      [
        "netbox-openbao-broker",
        "Vault access path",
        "mTLS broker sits between NetBox and OpenBao for reveal and host ops",
      ],
    ],
  },
  boundary: {
    title: "what stays outside netbox-rpc",
    paragraphs: [
      "Inventory sync — proxbox discovery, OpenBao KV writes, Packer image builds — runs in its own lane. RPC executes only after the target object exists in NetBox and a procedure is enabled for that object type.",
      "netbox-rpc-backend is not a second NetBox plugin. It is a separate FastAPI service registered as an RPCBackend row. Rotating backend URLs or credentials is configuration, not a code deploy inside the NetBox venv.",
      "Guest SSH for automation should flow: assign credential in netbox-openbao → queue RPC execution with target VM → backend reveals → SSH. Skipping reveal and embedding passwords in procedure params violates the split boundary.",
    ],
  },
  workflow: {
    title: "typical operator sequence",
    steps: [
      "Confirm RPCBackend points at netbox-rpc-backend and required RPCProcedure rows are enabled (seed migrations or admin UI).",
      "Assign SSH credentials on the target device or VM through netbox-openbao when the procedure family needs login material.",
      "Create an RPCExecution from the UI, nms rpc, or a companion plugin trigger (e.g. proxbox service refresh).",
      "Approve if the procedure requires it; watch execution events until status is succeeded or failed.",
      "Inspect stdout/stderr and ObjectChange — the ledger is the audit record for compliance and postmortems.",
    ],
  },
  links: {
    netboxRpc: "/netbox-rpc",
    netboxOpenbao: "/netbox-openbao",
    netboxProxbox: "/netbox-proxbox",
    proxmoxSecrets: "/netbox-openbao/proxmox-secrets",
    architectureDocs:
      "https://github.com/N-MultiCloud/netbox-rpc/blob/main/docs/cross-plugin-integrations.md",
    openbaoStackDocs:
      "https://github.com/emersonfelipesp/netbox-openbao/blob/main/docs/architecture/openbao-broker-rpc.md",
    proxboxRpcDocs:
      "https://github.com/emersonfelipesp/netbox-proxbox/blob/develop/docs/companion-plugins/netbox-rpc.md",
  },
  diagrams: {
    dispatch: {
      heading: "Lane 1 — procedure dispatch",
      caption: "hover any node for details",
      nodes: {
        operator:
          "Operator, nms rpc, nbx, or companion plugin — creates RPCExecution with procedure slug and target object ID.",
        netboxRpc:
          "netbox-rpc validates RBAC, normalizes params, enqueues RQ job, appends ExecutionQueued and lifecycle events.",
        rpcBackend:
          "netbox-rpc-backend receives normalized command over HTTPS, selects driver, connects to target host.",
        target:
          "Managed device, VM, Proxmox endpoint, or service — must exist in NetBox before dispatch.",
      },
      edges: {
        submit: "POST /api/plugins/rpc/executions/",
        enqueue: "RQ worker + event append",
        forward: "RPCBackend HTTPS",
        execute: "SSH / CLI driver",
      },
    },
    credentials: {
      heading: "Lane 2 — credential resolution",
      caption: "reveal at execution time only",
      nodes: {
        execution:
          "Running RPCExecution — backend knows credential assignment ID from target object, not secret bytes.",
        openbaoPlugin:
          "netbox-openbao services.py — POST reveal with reveal_credential permission and optional reason.",
        broker:
          "netbox-openbao-broker (optional) — holds AppRole; NetBox uses mTLS client cert.",
        openbaoKv:
          "OpenBao KV v2 — password, private key, or token material returned once to backend over TLS.",
        sshTarget:
          "SSH session to guest or host — material never stored in RPCExecution params or GET responses.",
      },
      edges: {
        need: "procedure requires SSH",
        reveal: "POST reveal",
        vault: "KV v2 read",
        connect: "SSH auth",
      },
    },
    map: {
      heading: "Lane 3 — cross-plugin map",
      caption: "shared NetBox objects, no direct plugin imports",
      nodes: {
        proxbox:
          "netbox-proxbox — inventory + optional service monitoring RPC triggers on ProxmoxEndpoint.",
        openbao:
          "netbox-openbao — credential assignments on VMs/devices; vault host ops as RPC procedures.",
        packer:
          "netbox-packer — template verify procedures after bake completes.",
        fileserver:
          "netbox-fileserver — Samba share validation procedures.",
        proxy:
          "netbox-proxy — NGINX test/reload deploy procedures.",
        rpcCore:
          "netbox-rpc — single procedure catalog and execution history for all lanes.",
      },
      edges: {
        inventory: "creates target objects",
        assign: "CredentialAssignment",
        queue: "queue RPCExecution",
        audit: "append-only ledger",
      },
    },
  },
  seeAlso: {
    label: "see also",
    netboxRpc: "netbox-rpc showcase",
    netboxOpenbao: "netbox-openbao — secret storage",
    proxmoxSecrets: "Proxmox VM secrets — proxbox + openbao",
  },
} as const;

export type NetboxRpcIntegrationsContent = typeof netboxRpcIntegrations;

