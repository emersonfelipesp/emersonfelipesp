import {
  ARCHITECTURE_CONNECTORS,
  getArchitectureDiagram,
  type ArchitectureConnectorPath,
  type ArchitectureNode,
} from "@/lib/architecture-diagram";
import { absoluteUrl } from "@/lib/seo/links";

const DIAGRAM_EN = getArchitectureDiagram("en");

const SVG_WIDTH = 1200;
const SVG_HEIGHT = 940;
const SVG_CONTENT_X = 150;
const SVG_CONTENT_WIDTH = 900;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function variantClass(node: ArchitectureNode): string {
  return `node-${node.variant}`;
}

function htmlConnectorPath(path: ArchitectureConnectorPath): string {
  const points = path.points.map(([x, y]) => `${x},${y}`).join(" ");
  const classes = ["connector-path", path.dashed ? "connector-path-dashed" : ""]
    .filter(Boolean)
    .join(" ");
  const opacity = path.opacity === undefined ? "" : ` opacity="${path.opacity}"`;
  return `<polyline class="${classes}" points="${points}"${opacity}></polyline>`;
}

function htmlConnector({
  label,
  labelAfter = false,
  paths,
  testId,
  viewBoxHeight,
}: {
  label?: string;
  labelAfter?: boolean;
  paths: readonly ArchitectureConnectorPath[];
  testId?: string;
  viewBoxHeight: number;
}): string {
  const labelMarkup = label
    ? `<span class="connector-label">${escapeHtml(label)}</span>`
    : "";
  const svg = [
    `<svg aria-hidden="true" viewBox="0 0 100 ${viewBoxHeight}" preserveAspectRatio="none"${
      testId ? ` data-testid="${escapeHtml(testId)}"` : ""
    }>`,
    paths.map(htmlConnectorPath).join(""),
    "</svg>",
  ].join("");

  return `<div class="connector">${labelAfter ? svg + labelMarkup : labelMarkup + svg}</div>`;
}

function htmlBrand(node: ArchitectureNode): string {
  if (node.logo === "netbox") {
    return `<span class="brand brand-netbox"><span>NetBox</span>${
      node.trailing ? `<span class="brand-tail">${escapeHtml(node.trailing)}</span>` : ""
    }</span>`;
  }

  if (node.logo === "proxmox") {
    return `<span class="brand brand-proxmox"><span>Proxmox</span>${
      node.trailing ? `<span class="brand-tail">${escapeHtml(node.trailing)}</span>` : ""
    }</span>`;
  }

  return `<span>${escapeHtml(node.label)}</span>`;
}

function htmlNode(node: ArchitectureNode): string {
  const tipId = `architecture-tip-${node.id}`;
  const controlClasses = [
    "node-control",
    node.logo ? "node-control-logo" : "",
    node.logo && node.trailing ? "node-control-logo-wide" : "",
    variantClass(node),
  ]
    .filter(Boolean)
    .join(" ");
  const commonAttrs = `class="${controlClasses}" aria-label="${escapeHtml(
    node.label,
  )}" aria-describedby="${escapeHtml(tipId)}"`;
  const control = node.href
    ? `<a ${commonAttrs} href="${escapeHtml(node.href)}">${htmlBrand(node)}</a>`
    : `<button ${commonAttrs} type="button">${htmlBrand(node)}</button>`;

  return [
    `<span class="node-shell">`,
    control,
    `<span id="${escapeHtml(tipId)}" role="tooltip" class="tooltip">`,
    `<span class="tooltip-title">${escapeHtml(node.label)}</span>`,
    `<span class="tooltip-copy">${escapeHtml(node.description)}</span>`,
    "</span>",
    "</span>",
  ].join("");
}

function htmlVerticalEdge(label?: string): string {
  return [
    `<span class="vertical-edge" aria-hidden="true">`,
    `<span>│</span>`,
    label ? `<span class="vertical-edge-label">${escapeHtml(label)}</span>` : "",
    `<span>▼</span>`,
    `</span>`,
  ].join("");
}

function renderHtmlDiagram(): string {
  return [
    `<div class="diagram-inner">`,
    htmlNode(DIAGRAM_EN.nodes.netbox),
    htmlConnector({
      label: DIAGRAM_EN.edges.plugin,
      paths: ARCHITECTURE_CONNECTORS.pluginFork5,
      testId: "architecture-diagram-connector-plugin-fork",
      viewBoxHeight: 24,
    }),
    `<div class="node-grid node-grid-five">`,
    DIAGRAM_EN.pluginNodes.map(htmlNode).join(""),
    `</div>`,
    htmlConnector({
      label: DIAGRAM_EN.edges.base,
      labelAfter: true,
      paths: ARCHITECTURE_CONNECTORS.baseExtends,
      testId: "architecture-diagram-connector-base-extends",
      viewBoxHeight: 14,
    }),
    htmlConnector({
      label: DIAGRAM_EN.edges.httpSseWs,
      labelAfter: true,
      paths: ARCHITECTURE_CONNECTORS.apiFunnel5,
      testId: "architecture-diagram-connector-api-funnel",
      viewBoxHeight: 24,
    }),
    htmlNode(DIAGRAM_EN.nodes.proxboxApi),
    htmlConnector({
      paths: ARCHITECTURE_CONNECTORS.sdkFork2,
      testId: "architecture-diagram-connector-sdk-fork",
      viewBoxHeight: 24,
    }),
    `<div class="node-grid node-grid-two">`,
    `<div class="node-column">`,
    htmlNode(DIAGRAM_EN.nodes.netboxSdk),
    htmlVerticalEdge(DIAGRAM_EN.edges.rest),
    htmlNode(DIAGRAM_EN.nodes.netboxRest),
    `</div>`,
    `<div class="node-column">`,
    htmlNode(DIAGRAM_EN.nodes.proxmoxSdk),
    htmlVerticalEdge(),
    htmlNode(DIAGRAM_EN.nodes.proxmoxVe),
    htmlVerticalEdge(),
    `</div>`,
    `</div>`,
    htmlConnector({
      paths: ARCHITECTURE_CONNECTORS.proxmoxServicesFork3,
      testId: "architecture-diagram-connector-proxmox-services",
      viewBoxHeight: 24,
    }),
    `<div class="node-grid node-grid-three">`,
    DIAGRAM_EN.serviceApiNodes.map(htmlNode).join(""),
    `</div>`,
    `</div>`,
  ].join("");
}

export function renderArchitectureDiagramHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Emerson Felipe project architecture diagram for NetBox, Proxmox, proxbox-api, netbox-sdk, and proxmox-sdk.">
  <meta property="og:title" content="Emerson Felipe Architecture Diagram">
  <meta property="og:image" content="${absoluteUrl("/architecture-diagram.svg")}">
  <title>Architecture Diagram | emersonfelipesp</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #07101a;
      --surface: #0c1621;
      --surface-2: #11202e;
      --fg: #f5f5f5;
      --muted: #8b9aa8;
      --border: #1e3247;
      --accent: #00f2d4;
      --accent-2: #ff8a1f;
      --shadow: rgba(0, 0, 0, 0.35);
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      min-height: 100%;
    }

    body {
      margin: 0;
      background:
        linear-gradient(180deg, rgba(0, 242, 212, 0.06), transparent 18rem),
        var(--bg);
      color: var(--fg);
      font-family: "JetBrains Mono", "Fira Code", "Cascadia Code", "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      -webkit-font-smoothing: antialiased;
      font-feature-settings: "calt" 1, "liga" 1;
      padding: clamp(1rem, 4vw, 3.5rem);
      text-rendering: geometricPrecision;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button {
      font: inherit;
    }

    .page {
      margin: 0 auto;
      max-width: 74rem;
    }

    .prompt {
      color: var(--fg);
      font-size: clamp(0.8rem, 2vw, 0.95rem);
      line-height: 1.7;
      margin: 0 0 0.75rem;
    }

    .prompt-user {
      color: var(--accent);
    }

    .prompt-host {
      color: var(--accent-2);
    }

    .prompt-muted {
      color: var(--muted);
    }

    .frame {
      background: var(--surface);
      border: 1px solid var(--border);
      box-shadow:
        0 24px 70px var(--shadow),
        0 0 0 1px rgba(255, 255, 255, 0.03);
      padding: clamp(1rem, 3vw, 1.5rem);
    }

    .diagram-title {
      color: var(--muted);
      font-size: 0.75rem;
      line-height: 1.6;
      margin: 0 0 1rem;
      text-wrap: pretty;
    }

    .diagram-title span {
      color: rgba(139, 154, 168, 0.7);
    }

    .diagram-scroll {
      overflow-x: auto;
      padding: 0.25rem 0 0.5rem;
      scrollbar-color: var(--border) transparent;
      scrollbar-width: thin;
    }

    .diagram-scroll::-webkit-scrollbar {
      height: 0.375rem;
    }

    .diagram-scroll::-webkit-scrollbar-track {
      background: transparent;
    }

    .diagram-scroll::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 999px;
    }

    .diagram-inner {
      align-items: center;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin: 0 auto;
      min-width: 42rem;
      width: 42rem;
    }

    .node-grid {
      display: grid;
      justify-items: center;
      width: 100%;
    }

    .node-grid-five {
      gap: 0.5rem;
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    .node-grid-two {
      align-items: start;
      column-gap: 1rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .node-grid-three {
      gap: 1rem;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .node-column {
      align-items: center;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .node-shell {
      display: inline-flex;
      position: relative;
    }

    .node-control {
      align-items: center;
      background: var(--surface);
      border: 1px solid var(--border);
      color: rgba(245, 245, 245, 0.92);
      cursor: help;
      display: inline-flex;
      font-size: 0.875rem;
      justify-content: center;
      line-height: 1;
      min-height: 2.5rem;
      outline: none;
      padding: 0.45rem 0.75rem;
      position: relative;
      transition-duration: 150ms;
      transition-property: background-color, border-color, color, transform, box-shadow;
      transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
      white-space: nowrap;
    }

    .node-control::before {
      content: "";
      inset: -0.375rem;
      position: absolute;
    }

    .node-control-logo {
      height: 2.5rem;
      min-width: 7rem;
      padding-inline: 0.55rem;
    }

    .node-control-logo-wide {
      min-width: auto;
      padding-inline: 0.55rem;
    }

    .node-highlight {
      border-color: rgba(0, 242, 212, 0.7);
      color: var(--accent);
    }

    .node-featured {
      background: rgba(0, 242, 212, 0.1);
      border-color: var(--accent);
      color: var(--accent);
      cursor: pointer;
    }

    .node-control:is(:hover, :focus-visible) {
      background: var(--surface-2);
      border-color: var(--accent);
      box-shadow: 0 0 0 1px rgba(0, 242, 212, 0.18);
      color: var(--accent);
    }

    .node-control:active {
      transform: scale(0.96);
    }

    .brand {
      align-items: center;
      display: inline-flex;
      gap: 0.35rem;
      line-height: 1;
    }

    .brand-netbox {
      color: var(--accent);
      font-weight: 700;
    }

    .brand-proxmox {
      color: var(--accent-2);
      font-weight: 700;
    }

    .brand-tail {
      color: var(--fg);
      font-weight: 400;
    }

    .tooltip {
      background: var(--surface-2);
      border: 1px solid rgba(0, 242, 212, 0.6);
      box-shadow: 0 0 0 1px var(--border), 0 16px 34px var(--shadow);
      color: rgba(245, 245, 245, 0.92);
      display: block;
      font-size: 0.75rem;
      left: 1rem;
      line-height: 1.5;
      opacity: 0;
      padding: 0.65rem 0.75rem;
      pointer-events: none;
      position: fixed;
      right: 1rem;
      text-align: left;
      top: 1rem;
      transform: translateY(-0.25rem);
      transition-duration: 150ms;
      transition-property: opacity, transform;
      transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
      z-index: 10;
    }

    .node-shell:is(:hover, :focus-within) .tooltip {
      opacity: 1;
      transform: translateY(0);
    }

    .tooltip-title {
      color: var(--accent);
      display: block;
      margin-bottom: 0.25rem;
    }

    .tooltip-copy {
      display: block;
      text-wrap: pretty;
    }

    .connector {
      align-items: center;
      color: var(--muted);
      display: flex;
      flex-direction: column;
      max-width: 42rem;
      width: 100%;
    }

    .connector svg {
      display: block;
      height: 1.75rem;
      overflow: visible;
      width: 100%;
    }

    .connector-path {
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1.4;
      vector-effect: non-scaling-stroke;
    }

    .connector-path-dashed {
      stroke-dasharray: 4 4;
    }

    .connector-label,
    .vertical-edge-label {
      color: rgba(139, 154, 168, 0.8);
      font-size: 0.625rem;
      letter-spacing: 0.08em;
      line-height: 1.2;
      text-transform: uppercase;
    }

    .vertical-edge {
      align-items: center;
      color: var(--muted);
      display: flex;
      flex-direction: column;
      line-height: 1;
    }

    .vertical-edge-label {
      margin: 0.15rem 0;
    }

    @media (min-width: 640px) {
      .node-grid-two {
        column-gap: 1.5rem;
      }
    }

    @media (max-width: 720px) {
      body {
        padding-inline: 0.75rem;
      }

      .frame {
        padding-inline: 0.75rem;
      }
    }
  </style>
</head>
<body>
  <main class="page" aria-label="Architecture diagram">
    <p class="prompt"><span class="prompt-user">emerson</span><span class="prompt-muted">@</span><span class="prompt-host">netdevops</span><span class="prompt-muted">:~$ </span>./show --architecture</p>
    <section class="frame" data-testid="architecture-diagram-standalone">
      <p class="diagram-title">${escapeHtml(DIAGRAM_EN.heading)} <span>· ${escapeHtml(
        DIAGRAM_EN.caption,
      )}</span></p>
      <div class="diagram-scroll">
        ${renderHtmlDiagram()}
      </div>
    </section>
  </main>
</body>
</html>`;
}

function svgText(value: string): string {
  return escapeHtml(value);
}

function svgPathElements(
  paths: readonly ArchitectureConnectorPath[],
  x: number,
  y: number,
  width: number,
  height: number,
  viewBoxHeight: number,
): string {
  return paths
    .map((path) => {
      const points = path.points
        .map(([px, py]) => {
          const sx = x + (px / 100) * width;
          const sy = y + (py / viewBoxHeight) * height;
          return `${sx.toFixed(2)},${sy.toFixed(2)}`;
        })
        .join(" ");
      const classes = ["connector-line", path.dashed ? "connector-dashed" : ""]
        .filter(Boolean)
        .join(" ");
      const opacity = path.opacity === undefined ? "" : ` opacity="${path.opacity}"`;
      return `<polyline class="${classes}" points="${points}"${opacity}></polyline>`;
    })
    .join("");
}

function svgNodeWidth(node: ArchitectureNode): number {
  if (node.svgWidth !== undefined) return node.svgWidth;
  if (node.logo && node.trailing) return 166;
  if (node.logo) return 142;
  return Math.max(128, node.label.length * 9 + 28);
}

function svgNode(
  node: ArchitectureNode,
  centerX: number,
  y: number,
  width = svgNodeWidth(node),
): string {
  const height = 42;
  const x = centerX - width / 2;
  const hrefStart = node.href
    ? `<a href="${escapeHtml(absoluteUrl(node.href))}" target="_blank">`
    : "";
  const hrefEnd = node.href ? "</a>" : "";
  const labelClass = [
    "node-label",
    node.logo === "netbox" ? "node-label-netbox" : "",
    node.logo === "proxmox" ? "node-label-proxmox" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `${hrefStart}<g class="svg-node ${variantClass(node)}" data-node="${escapeHtml(
    node.id,
  )}">
    <title>${svgText(node.label)}</title>
    <desc>${svgText(node.description)}</desc>
    <rect x="${x}" y="${y}" width="${width}" height="${height}"></rect>
    <text class="${labelClass}" x="${centerX}" y="${y + height / 2 + 5}">${svgText(
      node.logo === "netbox" && node.trailing
        ? `NetBox ${node.trailing}`
        : node.logo === "netbox"
        ? "NetBox"
        : node.logo === "proxmox" && node.trailing
        ? `Proxmox ${node.trailing}`
        : node.label,
    )}</text>
  </g>${hrefEnd}`;
}

function svgVerticalEdge(
  centerX: number,
  startY: number,
  endY: number,
  label?: string,
): string {
  const labelMarkup = label
    ? `<text class="edge-label" x="${centerX}" y="${(startY + endY) / 2 + 3}">${svgText(
        label,
      )}</text>`
    : "";
  return `<g class="vertical-connector">
    <line class="connector-line" x1="${centerX}" y1="${startY}" x2="${centerX}" y2="${
      endY - 11
    }"></line>
    ${labelMarkup}
    <polyline class="connector-line" points="${centerX - 5},${endY - 11} ${centerX},${endY} ${
      centerX + 5
    },${endY - 11}"></polyline>
  </g>`;
}

export function renderArchitectureDiagramSvg(): string {
  const pluginCenters = [0.1, 0.3, 0.5, 0.7, 0.9].map(
    (position) => SVG_CONTENT_X + SVG_CONTENT_WIDTH * position,
  );
  const leftCenter = SVG_CONTENT_X + SVG_CONTENT_WIDTH * 0.24;
  const rightCenter = SVG_CONTENT_X + SVG_CONTENT_WIDTH * 0.76;
  const serviceCenters = [0.16, 0.5, 0.84].map(
    (position) => SVG_CONTENT_X + SVG_CONTENT_WIDTH * position,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="${SVG_HEIGHT}" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" role="img" aria-labelledby="architecture-title architecture-desc">
  <title id="architecture-title">Emerson Felipe project architecture diagram</title>
  <desc id="architecture-desc">NetBox connects to five NetBox plugins, which feed proxbox-api, then netbox-sdk, proxmox-sdk, NetBox REST API, Proxmox VE, and Proxmox service APIs.</desc>
  <defs>
    <style>
      .bg { fill: #07101a; }
      .frame { fill: #0c1621; stroke: #1e3247; stroke-width: 1; }
      .prompt { fill: #f5f5f5; font: 16px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
      .prompt-accent { fill: #00f2d4; }
      .prompt-accent-2 { fill: #ff8a1f; }
      .muted { fill: #8b9aa8; font: 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
      .connector-line { fill: none; stroke: #8b9aa8; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
      .connector-dashed { stroke-dasharray: 5 5; }
      .edge-label { fill: #8b9aa8; font: 10px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; letter-spacing: 1px; text-anchor: middle; text-transform: uppercase; }
      .svg-node rect { fill: #0c1621; stroke: #1e3247; stroke-width: 1; }
      .svg-node.node-highlight rect { stroke: rgba(0, 242, 212, 0.7); }
      .svg-node.node-featured rect { fill: rgba(0, 242, 212, 0.1); stroke: #00f2d4; }
      .node-label { fill: rgba(245, 245, 245, 0.92); font: 15px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; text-anchor: middle; }
      .node-highlight .node-label, .node-featured .node-label, .node-label-netbox { fill: #00f2d4; }
      .node-label-proxmox { fill: #ff8a1f; }
    </style>
  </defs>
  <rect class="bg" width="${SVG_WIDTH}" height="${SVG_HEIGHT}"></rect>
  <text class="prompt" x="48" y="48"><tspan class="prompt-accent">emerson</tspan><tspan fill="#8b9aa8">@</tspan><tspan class="prompt-accent-2">netdevops</tspan><tspan fill="#8b9aa8">:~$ </tspan><tspan>./show --architecture</tspan></text>
  <rect class="frame" x="40" y="88" width="1120" height="846"></rect>
  <text class="muted" x="64" y="124">${svgText(DIAGRAM_EN.heading)}  ·  ${svgText(
    DIAGRAM_EN.caption,
  )}</text>

  ${svgNode(DIAGRAM_EN.nodes.netbox, 600, 154)}
  <text class="edge-label" x="600" y="219">${svgText(DIAGRAM_EN.edges.plugin)}</text>
  ${svgPathElements(ARCHITECTURE_CONNECTORS.pluginFork5, SVG_CONTENT_X, 228, SVG_CONTENT_WIDTH, 54, 24)}
  ${DIAGRAM_EN.pluginNodes
    .map((node, index) => svgNode(node, pluginCenters[index], 286))
    .join("")}
  ${svgPathElements(ARCHITECTURE_CONNECTORS.baseExtends, SVG_CONTENT_X, 350, SVG_CONTENT_WIDTH, 28, 14)}
  <text class="edge-label" x="600" y="390">${svgText(DIAGRAM_EN.edges.base)}</text>
  ${svgPathElements(ARCHITECTURE_CONNECTORS.apiFunnel5, SVG_CONTENT_X, 402, SVG_CONTENT_WIDTH, 54, 24)}
  <text class="edge-label" x="600" y="466">${svgText(DIAGRAM_EN.edges.httpSseWs)}</text>
  ${svgNode(DIAGRAM_EN.nodes.proxboxApi, 600, 482)}
  ${svgPathElements(ARCHITECTURE_CONNECTORS.sdkFork2, SVG_CONTENT_X, 548, SVG_CONTENT_WIDTH, 54, 24)}

  ${svgNode(DIAGRAM_EN.nodes.netboxSdk, leftCenter, 616)}
  ${svgVerticalEdge(leftCenter, 660, 718, DIAGRAM_EN.edges.rest)}
  ${svgNode(DIAGRAM_EN.nodes.netboxRest, leftCenter, 730)}

  ${svgNode(DIAGRAM_EN.nodes.proxmoxSdk, rightCenter, 616)}
  ${svgVerticalEdge(rightCenter, 660, 704)}
  ${svgNode(DIAGRAM_EN.nodes.proxmoxVe, rightCenter, 716)}
  ${svgVerticalEdge(rightCenter, 760, 812)}
  ${svgPathElements(ARCHITECTURE_CONNECTORS.proxmoxServicesFork3, SVG_CONTENT_X, 820, SVG_CONTENT_WIDTH, 54, 24)}
  ${DIAGRAM_EN.serviceApiNodes
    .map((node, index) => svgNode(node, serviceCenters[index], 884, 170))
    .join("")}
</svg>`;
}
