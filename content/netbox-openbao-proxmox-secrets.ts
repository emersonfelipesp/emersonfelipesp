import { PROJECTS } from "@/lib/project-registry";
import type { SectionLink } from "./types";

const project = PROJECTS["netbox-openbao"];

export const proxboxOpenbaoSecretsSections: readonly SectionLink[] = [
  { id: "overview", label: "overview" },
  { id: "inventory", label: "inventory sync" },
  { id: "credentials", label: "credential write" },
  { id: "reveal", label: "reveal & access" },
  { id: "boundary", label: "boundary" },
  { id: "workflow", label: "operator flow" },
];

export const proxboxOpenbaoSecrets = {
  slug: project.slug,
  pageSlug: "proxmox-secrets",
  name: "Proxmox VM & container secrets",
  fullName: project.fullName,
  palette: project.palette,
  tagline:
    "How netbox-proxbox inventory sync and netbox-openbao secret storage work together — without mixing credentials into the sync pipeline.",
  banner: String.raw`
 _ __ ___  ___ _ __   ___ _ __ | |_ _   _ 
| '__/ _ \/ __| '_ \ / _ \ '_ \| __| | | |
| | |  __/\__ \ |_) |  __/ | | | |_| |_| |
|_|  \___||___/ .__/ \___|_| |_|\__|\__, |
              |_|                    |___/`,
  sections: proxboxOpenbaoSecretsSections,
  intro: [
    "netbox-proxbox keeps Proxmox QEMU VMs and LXC containers modeled in NetBox — clusters, nodes, interfaces, addresses, and optional ssh service metadata. That sync path is read-only against Proxmox and never carries login passwords or private keys.",
    "netbox-openbao attaches SSH credentials to the same VirtualMachine and virtualization.VM objects after they exist. Secret material lives only in OpenBao KV v2; NetBox holds usernames, fingerprints, assignments, and audit — the same split as devices elsewhere in the estate.",
    "The two plugins do not call each other directly. They meet on shared NetBox objects: proxbox creates the VM row and network context; openbao binds credentials to that row (and to an ipam.Service when services are modeled).",
  ],
  principles: {
    title: "design principles",
    bullets: [
      "Inventory sync and secret storage are separate lanes — a proxbox job failure must not rotate or leak credentials, and a reveal must not trigger a Proxmox API call.",
      "Proxbox never writes to OpenBao; netbox-openbao never queries the Proxmox API for VM discovery.",
      "Quick-add SSH on a VM page is the usual handoff: proxbox supplies the object; the operator (or automation with NetBox RBAC) stores the login material in one atomic transaction.",
      "When netbox-nms is installed, password quick-add mirrors into DeviceCredential and SSH DeviceService so NMS RPC and automation resolve the same secret without a second manual step.",
    ],
  },
  boundary: {
    title: "what stays out of proxbox sync",
    paragraphs: [
      "Proxmox guest credentials — cloud-init passwords, QEMU agent secrets, LXC root passwords stored on the hypervisor — are not part of the proxbox discovery contract. Even when proxbox creates or updates an ipam.Service named ssh with tcp/22, that row describes reachability, not the login secret.",
      "Storing the SSH login belongs to netbox-openbao (or another credential workflow) after the VM exists in NetBox. Automation should resolve material through POST /api/plugins/openbao/credentials/{id}/reveal/ with reveal_credential permission, not by scraping Proxmox config or expecting sync payloads to include secrets.",
    ],
  },
  workflow: {
    title: "typical operator sequence",
    steps: [
      "Run proxbox sync (manual, scheduled, or via proxbox-api) so the VM or container appears under the correct cluster and node with interfaces and IPs.",
      "Open the VirtualMachine in NetBox and use Add SSH access (quick-add) to create the ipam.Service (when modeled), Credential, and CredentialAssignment in one transaction.",
      "Optional: confirm the public key or username metadata on the credential row; material remains write-only on GET.",
      "Operators or nbx automation POST reveal when they need the password or private key for SSH — audited, Cache-Control: no-store, separate from inventory export.",
    ],
  },
  links: {
    netboxProxbox: "/netbox-proxbox",
    netboxOpenbao: "/netbox-openbao",
    proxboxApi: "/proxbox-api",
    quickAddDocs:
      "https://github.com/emersonfelipesp/netbox-openbao/blob/main/docs/quick-add-ssh.md",
    architectureDocs:
      "https://github.com/emersonfelipesp/netbox-openbao/blob/main/docs/architecture/proxmox-vm-secrets.md",
    proxboxCompanionDocs:
      "https://github.com/emersonfelipesp/netbox-proxbox/blob/develop/docs/companion-plugins/netbox-openbao.md",
  },
  diagrams: {
    inventory: {
      heading: "Lane 1 — inventory sync (no secrets)",
      caption: "hover any node for details",
      noSecrets: "no passwords · no keys · no tokens",
      nodes: {
        proxmox:
          "Proxmox VE — hypervisor hosting QEMU VMs and LXC containers. Source of inventory; guest credentials on the host are not part of sync.",
        proxboxApi:
          "proxbox-api orchestrates read-only sync jobs through proxmox-sdk. HTTP/SSE/WebSocket transport — never writes secret material.",
        netboxProxbox:
          "netbox-proxbox plugin maps clusters, nodes, VMs, interfaces, and IPs into NetBox DCIM/virtualization models.",
        netboxPg:
          "NetBox PostgreSQL — VirtualMachine, VMInterface, IPAddress, ipam.Service (e.g. ssh tcp/22 as reachability metadata).",
      },
      edges: {
        toApi: "REST read-only",
        toPlugin: "sync jobs",
        toDb: "netbox-sdk · REST write",
      },
    },
    credentials: {
      heading: "Lane 2 — store SSH credential on the VM",
      caption: "Quick-add or API after the object exists",
      nodes: {
        operator:
          "Operator or automation with add_credential — Add SSH access on the Device/VM page.",
        openbaoPlugin:
          "netbox-openbao · services.py — validates RBAC, store_credential(), rollback compensation.",
        netboxMeta:
          "NetBox — Credential (metadata), CredentialAssignment, ipam.Service ssh:22 when assignable_models includes service.",
        openbaoKv:
          "OpenBao KV v2 — ssh-password or ssh-keypair payload; AppRole or broker mTLS.",
        nmsOptional:
          "netbox-nms (optional) — mirrors password into DeviceCredential + SSH DeviceService for RPC.",
      },
      edges: {
        submit: "POST · atomic transaction",
        meta: "indexed metadata",
        secret: "write-only material",
        mirror: "optional mirror",
      },
    },
    reveal: {
      heading: "Lane 3 — reveal and SSH access",
      caption: "Material leaves only through audited POST reveal",
      nodes: {
        consumer:
          "Operator, nbx CLI, or NMS RPC — needs SSH login for the VM/container.",
        revealApi:
          "POST /api/plugins/openbao/credentials/{id}/reveal/ — reveal_credential permission, JSON-only, no-store.",
        openbaoRead:
          "OpenBao read via AppRole or netbox-openbao-broker — no vendor policy text in errors.",
        target:
          "VirtualMachine or container — SSH session using IP/interface from proxbox inventory.",
      },
      edges: {
        request: "POST reveal",
        vault: "KV v2 read",
        ssh: "SSH · outside NetBox",
      },
    },
  },
  seeAlso: {
    label: "see also",
    netboxOpenbao: "netbox-openbao — credential plugin showcase",
    netboxProxbox: "netbox-proxbox — Proxmox → NetBox sync",
  },
} as const;

export type ProxboxOpenbaoSecretsContent = typeof proxboxOpenbaoSecrets;
