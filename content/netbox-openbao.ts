import { PROJECTS } from "@/lib/project-registry";

const project = PROJECTS["netbox-openbao"];

export const netboxOpenbao = {
  slug: project.slug,
  name: project.name,
  fullName: project.fullName,
  palette: project.palette,
  tagline:
    "NetBox plugin that keeps secret material in OpenBao while NetBox owns credential inventory, assignments, and audit.",
  description: [
    "netbox-openbao splits secret material from credential metadata. Private keys, passwords, and API tokens live only in OpenBao KV v2. Usernames, fingerprints, expiry dates, and device assignments stay in NetBox — searchable, filterable, and safe to export without a reveal permission.",
    "Unlike browser-side vault plugins, every resolve path is server-side over the NetBox REST API, so automation and operators share one authorization model. Reveal is a separate permission, POST-only in the UI, JSON-only on the wire, and fully audited.",
  ],
  features: [
    "No model field can hold secret material — changelog, exports, and REST GET responses are safe by construction",
    "Inventory queries (expiry, fingerprint, assignment) need zero OpenBao reads",
    "Dedicated reveal permission with object-level constraints in standard NetBox RBAC",
    "Staged rotation: write candidate alongside live version, promote on decision",
    "Per-tier AppRoles bound blast radius; optional broker mode keeps vault credentials off the NetBox host",
    "HashiCorp Vault supported as an alternative backend on the same wire contract",
    "Quick-add SSH password flow; broker mode and netbox-rpc integrate without a proprietary credential mirror",
  ],
  howItWorks: {
    title: "how it works",
    paragraphs: [
      "NetBox stores Credential rows, policy tiers, engine configuration, assignments to devices/VMs/services, and a complete access log. OpenBao stores the payload — private key, password, token, or certificate key — addressed by a path derived from the engine and policy tier.",
      "Every operation that touches material flows through services.py inside the NetBox process. UI views, REST viewsets, forms, and background jobs never call OpenBao directly; they call the service layer, which picks the correct AppRole (or broker client certificate) and enforces NetBox permissions first.",
      "Reading material requires the reveal_credential action. Writing creates or rotates a KV version with explicit compensation if PostgreSQL rolls back. Destroying a row schedules vault deletion after commit so a failed transaction never wipes working secrets.",
    ],
    splitTable: {
      headers: ["Goes to OpenBao", "Stays in NetBox (indexed)"],
      rows: [
        ["private key", "public key"],
        ["passphrase", "SHA256 fingerprint"],
        ["password", "username"],
        ["API token", "key type and bit length"],
        ["certificate private key", "serial, issuer, subject, not_before, not_after"],
      ],
    },
  },
  security: {
    title: "security model",
    bullets: [
      "secret_data is write-only in the REST API — DRF refuses to serialize it on GET, brief, or browsable API",
      "Reveal responses are Cache-Control: no-store and exclude the HTML browsable renderer",
      "Backend exceptions carry no vendor text — OpenBao policy hints never reach logs or clients",
      "AppRole SecretIDs load from environment or _FILE mounts, never from the database",
      "Broker mode removes vault credentials from NetBox configuration; NetBox holds an mTLS client cert and asks the broker to read",
    ],
  },
  ecosystem: {
    title: "ecosystem",
    items: [
      {
        name: "netbox-openbao-broker",
        href: "https://github.com/emersonfelipesp/netbox-openbao-broker",
        description:
          "Optional sidecar that holds the AppRole. NetBox authenticates with a client certificate; audit log sits outside NetBox's blast radius.",
      },
      {
        name: "netbox-rpc",
        href: "https://emersonfelipesp.com/netbox-rpc",
        description:
          "OpenBao host operations and companion automation dispatch through audited RPC procedures — see the cross-plugin architecture page.",
      },
      {
        name: "netbox-sdk / nbx",
        href: "https://emersonfelipesp.com/netbox-sdk",
        description:
          "Automation resolves credentials through the plugin REST API (/api/plugins/openbao/credentials/) with the same tokens and RBAC as any other NetBox endpoint.",
      },
    ],
  },
  apiExamples: {
    title: "api",
    intro:
      "Inventory endpoints never return material. Reveal requires netbox_openbao.reveal_credential and an optional reason query parameter.",
    snippets: [
      {
        label: "inventory — no OpenBao read",
        lang: "bash",
        content: String.raw`curl -H "Authorization: Bearer $TOKEN" \
  'https://netbox.example.net/api/plugins/openbao/credentials/?expires_within_days=30'`,
      },
      {
        label: "reveal — separate permission",
        lang: "bash",
        content: String.raw`curl -X POST -H "Authorization: Bearer $TOKEN" \
  'https://netbox.example.net/api/plugins/openbao/credentials/142/reveal/?reason=CHG-1234'`,
      },
    ],
  },
  stack: [
    "NetBox plugin (Django / Python 3.12+)",
    "OpenBao 2.6.x KV v2 (HashiCorp Vault optional)",
    "PostgreSQL 15+ with ltree",
    "Redis 6+ and NetBox RQ for background jobs",
  ],
  install: {
    primary: "pip install netbox-openbao",
    note: "Requires OpenBao (or Vault) with KV v2, AppRole auth, and per-engine SecretID in the NetBox process environment.",
  },
  meta: {
    license: "Apache-2.0",
    netbox: "4.6.x – 4.7.x",
    python: "3.12+",
  },
  links: {
    repo: project.repoUrl,
    docs: "https://emersonfelipesp.com/netbox-openbao/docs/",
    broker: "https://github.com/emersonfelipesp/netbox-openbao-broker",
    "OpenBao": "https://openbao.org/",
  },
  banner: String.raw`
  _  _      _          _
 | \| |___ | |__  ___ | |__  _____ __
 | . \ / _ \| '_ \/ _ \| '_ \/ _ \ \ /
 |_|\_\___/|_.__/\___/|_.__/\___/_/_\
   n e t b o x  ⇄  o p e n b a o
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

export type NetboxOpenbaoContent = typeof netboxOpenbao;
