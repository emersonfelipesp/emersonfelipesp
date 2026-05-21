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
    line(10, 0, 10, 7, { dashed: true, opacity: 0.5 }),
    line(30, 0, 30, 7, { dashed: true, opacity: 0.5 }),
    line(70, 0, 70, 7, { dashed: true, opacity: 0.5 }),
    line(90, 0, 90, 7, { dashed: true, opacity: 0.5 }),
    line(10, 7, 90, 7, { dashed: true, opacity: 0.5 }),
    polyline([[47, 5], [50, 7], [47, 9]], { dashed: true, opacity: 0.5 }),
    polyline([[53, 5], [50, 7], [53, 9]], { dashed: true, opacity: 0.5 }),
  ],
  apiFunnel5: [
    line(10, 0, 10, 9),
    line(30, 0, 30, 9),
    line(50, 0, 50, 9),
    line(70, 0, 70, 9),
    line(90, 0, 90, 9),
    line(10, 9, 90, 9),
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
    ],
    serviceApiNodes: [nodes.proxmoxCeph, nodes.proxmoxPbs, nodes.proxmoxPdm],
  };
}

export function getArchitectureDiagram(lang: Lang = "en"): ArchitectureDiagram {
  return createArchitectureDiagram(DICTIONARIES[lang].home.architecture);
}
