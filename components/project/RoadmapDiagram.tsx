"use client";

import { useMemo, useState } from "react";
import {
  ThreeLineCanvas,
  type DiagramPath,
  type DiagramPoint,
  type DiagramTriangle,
} from "@/components/diagram/ThreeLineCanvas";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { Roadmap, RoadmapEdge, RoadmapNode } from "@/lib/roadmap";
import { RoadmapDiagramOverlay } from "./RoadmapDiagramOverlay";

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + "…";
}

function parseViewBox(value: string): readonly [number, number] {
  const [, , width, height] = value.split(/\s+/).map(Number);
  return [
    Number.isFinite(width) && width > 0 ? width : 1,
    Number.isFinite(height) && height > 0 ? height : 1,
  ];
}

function parseEdgePoints(d: string): DiagramPoint[] {
  return [...d.matchAll(/[ML]\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)].map(
    (match) => [Number(match[1]), Number(match[2])],
  );
}

function arrowTriangle(
  points: readonly DiagramPoint[],
  id?: string,
): DiagramTriangle | null {
  if (points.length < 2) return null;

  const tip = points[points.length - 1];
  const tail = points[points.length - 2];
  const dx = tip[0] - tail[0];
  const dy = tip[1] - tail[1];
  const length = Math.hypot(dx, dy);
  if (!length) return null;

  const ux = dx / length;
  const uy = dy / length;
  const px = -uy;
  const py = ux;
  const arrowLength = 8;
  const arrowWidth = 6;
  const baseX = tip[0] - ux * arrowLength;
  const baseY = tip[1] - uy * arrowLength;

  return {
    id,
    points: [
      tip,
      [baseX + (px * arrowWidth) / 2, baseY + (py * arrowWidth) / 2],
      [baseX - (px * arrowWidth) / 2, baseY - (py * arrowWidth) / 2],
    ],
  };
}

function buildRoadmapEdges(edges: readonly RoadmapEdge[]): {
  paths: DiagramPath[];
  triangles: DiagramTriangle[];
} {
  const paths: DiagramPath[] = [];
  const triangles: DiagramTriangle[] = [];

  for (const edge of edges) {
    const points = parseEdgePoints(edge.d);
    if (points.length < 2) continue;
    const edgeId = `${edge.from}->${edge.to}`;
    paths.push({ id: edgeId, points });
    const triangle = arrowTriangle(points, `${edgeId}:arrow`);
    if (triangle) triangles.push(triangle);
  }

  return { paths, triangles };
}

function NodeCard({ node }: { node: RoadmapNode }) {
  const closed = node.state === "closed";
  const titleLine = truncate(node.title, 32);
  const labels = node.labels.slice(0, 3).map((l) => l.name).join(" · ");

  return (
    <a
      href={node.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`#${node.number} ${node.title}`}
    >
      <g
        transform={`translate(${node.x} ${node.y})`}
        data-state={node.state}
        className="transition-opacity hover:opacity-90"
      >
        <rect
          width={node.w}
          height={node.h}
          rx={2}
          className={`stroke-border ${
            closed ? "fill-surface opacity-60" : "fill-surface-2"
          }`}
          strokeWidth={1}
        />
        <text
          x={10}
          y={22}
          className={`font-mono text-[12px] ${
            closed ? "fill-muted" : "fill-accent"
          }`}
        >
          #{node.number}
        </text>
        <text
          x={10}
          y={42}
          className={`font-mono text-[11px] ${
            closed ? "fill-muted line-through" : "fill-fg"
          }`}
        >
          {titleLine}
        </text>
        {node.milestone ? (
          <text
            x={10}
            y={node.h - 24}
            className="font-mono text-[10px] fill-accent-2"
          >
            [{truncate(node.milestone.title, 24)}]
          </text>
        ) : null}
        {labels ? (
          <text
            x={10}
            y={node.h - 8}
            className="font-mono text-[10px] fill-muted"
          >
            {truncate(labels, 36)}
          </text>
        ) : null}
      </g>
    </a>
  );
}

export function RoadmapSvg({
  data,
  className,
}: {
  data: Roadmap;
  className?: string;
}) {
  const openNodes = data.nodes.filter((n) => n.state === "open");
  const viewBox = parseViewBox(data.viewBox);
  const edgeGeometry = useMemo(() => buildRoadmapEdges(data.edges), [data.edges]);

  return (
    <div className={`relative ${className ?? "block w-full h-auto"}`}>
      <ThreeLineCanvas
        viewBox={viewBox}
        paths={edgeGeometry.paths}
        triangles={edgeGeometry.triangles}
        strokeWidth={1.25}
        className="pointer-events-none absolute inset-0 h-full w-full text-border"
      />
      <svg
        viewBox={data.viewBox}
        role="img"
        aria-label="netbox-proxbox issue dependency graph"
        className="relative block h-auto w-full"
        preserveAspectRatio="xMidYMin meet"
      >
        {openNodes.map((n) => (
          <NodeCard key={n.number} node={n} />
        ))}
      </svg>
    </div>
  );
}

export function RoadmapDiagram({ data }: { data: Roadmap }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const openNodes = data.nodes.filter((n) => n.state === "open");

  return (
    <>
      <figure className="border border-border bg-surface">
        <div className="overflow-y-auto term-scroll">
          <RoadmapSvg data={data} />
        </div>
        <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface-2 px-3 py-2 text-[11px] text-muted">
          <span>
            <span className="text-accent">{openNodes.length}</span>{" "}
            {t.roadmap.diagram.openIssuesLabel} ·{" "}
            <span className="text-accent">{data.edges.length}</span>{" "}
            {t.roadmap.diagram.edgesLabel} · {t.roadmap.diagram.arrowsHint}.{" "}
            {t.roadmap.diagram.closedNote}.
          </span>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label={t.roadmap.diagram.expand}
            className="border border-border bg-surface/80 px-2 py-1 text-[11px] text-muted transition-colors hover:border-accent hover:text-accent"
          >
            [ {t.roadmap.diagram.expand} ]
          </button>
        </figcaption>
      </figure>
      {expanded ? (
        <RoadmapDiagramOverlay
          data={data}
          onClose={() => setExpanded(false)}
        />
      ) : null}
    </>
  );
}
