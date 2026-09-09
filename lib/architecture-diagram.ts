import { DICTIONARIES, type Dictionary } from "@/lib/i18n/dictionary";
import type { Lang } from "@/lib/i18n/languages";

type ArchitectureCopy = Dictionary["home"]["architecture"];

export type ArchitecturePoint = readonly [number, number];

export type ArchitectureConnectorPath = {
  points: readonly ArchitecturePoint[];
  dashed?: boolean;
  opacity?: number;
};

export type ArchitectureNodeVariant = "default" | "highlight" | "featured";

export type ArchitectureNode = {
  id: string;
  label: string;
  description: string;
  href?: string;
  logo?: "netbox" | "proxmox";
  trailing?: string;
  variant: ArchitectureNodeVariant;
  svgWidth?: number;
};

export type ArchitectureDiagram = {
  heading: string;
  caption: string;
  edges: ArchitectureCopy["edges"];
  nodes: {
    netbox: ArchitectureNode;
    netboxCeph: ArchitectureNode;
    netboxPbs: ArchitectureNode;
    netboxProxbox: ArchitectureNode;
    netboxPdm: ArchitectureNode;
    netboxPacker: ArchitectureNode;
    netboxOpenbao: ArchitectureNode;
    openBao: ArchitectureNode;
    openbaoBroker: ArchitectureNode;
    proxboxApi: ArchitectureNode;
    netboxSdk: ArchitectureNode;
    netboxRest: ArchitectureNode;
    proxmoxSdk: ArchitectureNode;
    proxmoxVe: ArchitectureNode;
    proxmoxCeph: ArchitectureNode;
    proxmoxPbs: ArchitectureNode;
    proxmoxPdm: ArchitectureNode;
  };
  pluginNodes: readonly ArchitectureNode[];
  proxboxPluginNodes: readonly ArchitectureNode[];
  secretsNodes: readonly ArchitectureNode[];
  serviceApiNodes: readonly ArchitectureNode[];
};

function line(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  options?: Omit<ArchitectureConnectorPath, "points">,
): ArchitectureConnectorPath {
  return { points: [[x1, y1], [x2, y2]], ...options };
}

function polyline(
  points: readonly ArchitecturePoint[],
  options?: Omit<ArchitectureConnectorPath, "points">,
): ArchitectureConnectorPath {
  return { points, ...options };
}

export const ARCHITECTURE_CONNECTORS = {
  pluginFork6: [
    line(50, 0, 50, 9),
    line(8.3, 9, 91.6, 9),
    line(8.3, 9, 8.3, 20),
    line(25, 9, 25, 20),
    line(41.6, 9, 41.6, 20),
    line(58.3, 9, 58.3, 20),
    line(75, 9, 75, 20),
    line(91.6, 9, 91.6, 20),
    polyline([[6.3, 18], [8.3, 22], [10.3, 18]]),
    polyline([[23, 18], [25, 22], [27, 18]]),
    polyline([[39.6, 18], [41.6, 22], [43.6, 18]]),
    polyline([[56.3, 18], [58.3, 22], [60.3, 18]]),
    polyline([[73, 18], [75, 22], [77, 18]]),
    polyline([[89.6, 18], [91.6, 22], [93.6, 18]]),
  ],
  /** Full-width layout: sixth plugin column center at 91.6. */
  openbaoSecrets: [
    line(91.6, 0, 91.6, 20),
    polyline([[89.6, 18], [91.6, 22], [93.6, 18]]),
    line(91.6, 20, 91.6, 28, { dashed: true, opacity: 0.55 }),
    polyline([[89.6, 26], [91.6, 30], [93.6, 26]], { dashed: true, opacity: 0.55 }),
  ],
  /** Column-local layout: connector rendered inside the sixth grid cell. */
  openbaoSecretsColumn: [
    line(50, 0, 50, 20),
    polyline([[48, 18], [50, 22], [52, 18]]),
    line(50, 20, 50, 28, { dashed: true, opacity: 0.55 }),
    polyline([[48, 26], [50, 30], [52, 26]], { dashed: true, opacity: 0.55 }),
  ],
  pluginFork5: [
    line(50, 0, 50, 9),
    line(10, 9, 90, 9),
    line(10, 9, 10, 20),
    line(30, 9, 30, 20),
    line(50, 9, 50, 20),
    line(70, 9, 70, 20),
    line(90, 9, 90, 20),
    polyline([[8, 18], [10, 22], [12, 18]]),
    polyline([[28, 18], [30, 22], [32, 18]]),
    polyline([[48, 18], [50, 22], [52, 18]]),
    polyline([[68, 18], [70, 22], [72, 18]]),
    polyline([[88, 18], [90, 22], [92, 18]]),
  ],
  baseExtends: [
    line(8.3, 0, 8.3, 7, { dashed: true, opacity: 0.5 }),
    line(25, 0, 25, 7, { dashed: true, opacity: 0.5 }),
    line(58.3, 0, 58.3, 7, { dashed: true, opacity: 0.5 }),
    line(75, 0, 75, 7, { dashed: true, opacity: 0.5 }),
    line(8.3, 7, 75, 7, { dashed: true, opacity: 0.5 }),
    polyline([[39.6, 5], [41.6, 7], [39.6, 9]], { dashed: true, opacity: 0.5 }),
    polyline([[43.6, 5], [41.6, 7], [43.6, 9]], { dashed: true, opacity: 0.5 }),
  ],
  apiFunnel5: [
    line(8.3, 0, 8.3, 9),
    line(25, 0, 25, 9),
    line(41.6, 0, 41.6, 9),
    line(58.3, 0, 58.3, 9),
    line(75, 0, 75, 9),
    line(8.3, 9, 75, 9),
    line(50, 9, 50, 20),
    polyline([[48, 18], [50, 22], [52, 18]]),
  ],
  sdkFork2: [
    line(50, 0, 50, 9),
    line(24, 9, 76, 9),
    line(24, 9, 24, 20),
    line(76, 9, 76, 20),
    polyline([[22, 18], [24, 22], [26, 18]]),
    polyline([[74, 18], [76, 22], [78, 18]]),
  ],
  proxmoxServicesFork3: [
    line(76, 0, 76, 9),
    line(16, 9, 84, 9),
    line(16, 9, 16, 20),
    line(50, 9, 50, 20),
    line(84, 9, 84, 20),
    polyline([[14, 18], [16, 22], [18, 18]]),
    polyline([[48, 18], [50, 22], [52, 18]]),
    polyline([[82, 18], [84, 22], [86, 18]]),
  ],
} as const satisfies Record<string, readonly ArchitectureConnectorPath[]>;

function node(
  id: string,
  label: string,
  description: string,
  options: Partial<Omit<ArchitectureNode, "id" | "label" | "description">> = {},
): ArchitectureNode {
  return {
    id,
    label,
    description,
    variant: "default",
    ...options,
  };
}

export function createArchitectureDiagram(
  architecture: ArchitectureCopy,
): ArchitectureDiagram {
  const nodes = {
    netbox: node("netbox", "netbox", architecture.nodes.netbox, {
      logo: "netbox",
      variant: "highlight",
    }),
    netboxCeph: node("netbox-ceph", "netbox-ceph", architecture.nodes.netboxCeph, {
      variant: "highlight",
    }),
    netboxPbs: node("netbox-pbs", "netbox-pbs", architecture.nodes.netboxPbs, {
      variant: "highlight",
    }),
    netboxProxbox: node(
      "netbox-proxbox",
      "netbox-proxbox",
      architecture.nodes.netboxProxbox,
      {
        href: "/netbox-proxbox",
        variant: "featured",
        svgWidth: 168,
      },
    ),
    netboxPdm: node("netbox-pdm", "netbox-pdm", architecture.nodes.netboxPdm, {
      variant: "highlight",
    }),
    netboxPacker: node(
      "netbox-packer",
      "netbox-packer",
      architecture.nodes.netboxPacker,
      {
        variant: "highlight",
        svgWidth: 152,
      },
    ),
    netboxOpenbao: node(
      "netbox-openbao",
      "netbox-openbao",
      architecture.nodes.netboxOpenbao,
      {
        href: "/netbox-openbao",
        variant: "featured",
        svgWidth: 168,
      },
    ),
    openBao: node("openbao", "OpenBao · KV v2", architecture.nodes.openBao, {
      variant: "highlight",
      svgWidth: 148,
    }),
    openbaoBroker: node(
      "openbao-broker",
      "openbao-broker",
      architecture.nodes.openbaoBroker,
      {
        variant: "default",
        svgWidth: 168,
      },
    ),
    proxboxApi: node("proxbox-api", "proxbox-api", architecture.nodes.proxboxApi, {
      variant: "highlight",
    }),
    netboxSdk: node("netbox-sdk", "netbox-sdk", architecture.nodes.netboxSdk, {
      href: "/netbox-sdk",
      variant: "highlight",
    }),
    netboxRest: node(
      "netbox-rest",
      "netbox · REST API",
      architecture.nodes.netboxRest,
      {
        logo: "netbox",
        trailing: "· REST API",
        svgWidth: 184,
      },
    ),
    proxmoxSdk: node(
      "proxmox-sdk",
      "proxmox-sdk",
      architecture.nodes.proxmoxSdk,
      {
        href: "/proxmox-sdk",
        variant: "highlight",
      },
    ),
    proxmoxVe: node("proxmox-ve", "Proxmox VE", architecture.nodes.proxmoxVe, {
      logo: "proxmox",
      trailing: "VE",
    }),
    proxmoxCeph: node(
      "proxmox-ceph",
      "proxmox · ceph",
      architecture.nodes.proxmoxCeph,
      {
        logo: "proxmox",
        trailing: "· ceph",
      },
    ),
    proxmoxPbs: node("proxmox-pbs", "proxmox · PBS", architecture.nodes.proxmoxPbs, {
      logo: "proxmox",
      trailing: "· PBS",
    }),
    proxmoxPdm: node("proxmox-pdm", "proxmox · PDM", architecture.nodes.proxmoxPdm, {
      logo: "proxmox",
      trailing: "· PDM",
    }),
  };

  return {
    heading: architecture.heading,
    caption: architecture.caption,
    edges: architecture.edges,
    nodes,
    pluginNodes: [
      nodes.netboxCeph,
      nodes.netboxPbs,
      nodes.netboxProxbox,
      nodes.netboxPdm,
      nodes.netboxPacker,
      nodes.netboxOpenbao,
    ],
    proxboxPluginNodes: [
      nodes.netboxCeph,
      nodes.netboxPbs,
      nodes.netboxProxbox,
      nodes.netboxPdm,
      nodes.netboxPacker,
    ],
    secretsNodes: [nodes.openBao, nodes.openbaoBroker],
    serviceApiNodes: [nodes.proxmoxCeph, nodes.proxmoxPbs, nodes.proxmoxPdm],
  };
}

export function getArchitectureDiagram(lang: Lang = "en"): ArchitectureDiagram {
  return createArchitectureDiagram(DICTIONARIES[lang].home.architecture);
}
