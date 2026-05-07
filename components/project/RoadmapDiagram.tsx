"use client";

import type { Roadmap, RoadmapNode } from "@/lib/roadmap";

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + "…";
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

export function RoadmapDiagram({ data }: { data: Roadmap }) {
  const openNodes = data.nodes.filter((n) => n.state === "open");

  return (
    <figure className="border border-border bg-surface">
      <div className="overflow-y-auto term-scroll">
        <svg
          viewBox={data.viewBox}
          role="img"
          aria-label="netbox-proxbox issue dependency graph"
          className="block w-full h-auto"
          preserveAspectRatio="xMidYMin meet"
        >
          <defs>
            <marker
              id="rm-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-border" />
            </marker>
          </defs>
          <g aria-hidden="true">
            {data.edges.map((e) => (
              <path
                key={`${e.from}->${e.to}`}
                d={e.d}
                fill="none"
                className="stroke-border"
                strokeWidth={1.25}
                markerEnd="url(#rm-arrow)"
              />
            ))}
          </g>
          {openNodes.map((n) => (
            <NodeCard key={n.number} node={n} />
          ))}
        </svg>
      </div>
      <figcaption className="border-t border-border bg-surface-2 px-3 py-2 text-[11px] text-muted">
        <span className="text-accent">{openNodes.length}</span> open issues ·{" "}
        <span className="text-accent">{data.edges.length}</span> dependency
        edges · arrows point from blocker to blocked task. Closed issues
        appear in the timeline view as the shipped prelude.
      </figcaption>
    </figure>
  );
}
