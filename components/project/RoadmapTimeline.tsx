"use client";

import { useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { Roadmap, RoadmapNode } from "@/lib/roadmap";

const SHIPPED_INITIAL = 24;

function IssueRow({ node }: { node: RoadmapNode }) {
  const closed = node.state === "closed";
  return (
    <li
      data-state={node.state}
      className="grid grid-cols-[5rem_1fr] items-baseline gap-3 border-b border-border/40 px-2 py-1 text-xs sm:grid-cols-[5rem_1fr_auto]"
    >
      <a
        href={node.url}
        target="_blank"
        rel="noopener noreferrer"
        className={
          closed ? "text-muted" : "text-accent hover:text-accent-2"
        }
      >
        #{node.number}
      </a>
      <span className={closed ? "text-muted line-through" : "text-fg"}>
        {node.title}
      </span>
      <span className="hidden flex-wrap gap-1 sm:flex">
        {node.milestone ? (
          <span className="border border-border bg-surface-2 px-1 text-[10px] text-accent-2">
            [{node.milestone.title}]
          </span>
        ) : null}
        {node.labels.slice(0, 3).map((l) => (
          <span
            key={l.name}
            className="border border-border bg-surface-2 px-1 text-[10px] text-muted"
          >
            {l.name}
          </span>
        ))}
      </span>
    </li>
  );
}

export function RoadmapTimeline({ data }: { data: Roadmap }) {
  const { t } = useLanguage();
  const lookup = new Map(data.nodes.map((n) => [n.number, n]));
  const [shippedExpanded, setShippedExpanded] = useState(false);

  return (
    <ol className="space-y-6">
      {data.timeline.map((phase) => {
        const isShipped = phase.kind === "shipped";
        const issues = phase.issues
          .map((num) => lookup.get(num))
          .filter((n): n is RoadmapNode => Boolean(n));
        const visible =
          isShipped && !shippedExpanded
            ? issues.slice(0, SHIPPED_INITIAL)
            : issues;
        const hidden = issues.length - visible.length;

        const heading = isShipped
          ? `[${t.roadmap.phase.shipped}] ${issues.length} issues`
          : `${t.roadmap.phase.label.replace("{n}", String(phase.phase))}${
              phase.phase === 1 ? ` — ${t.roadmap.phase.roots}` : ""
            } · ${issues.length} issues`;

        return (
          <li key={`${phase.kind}-${phase.phase}`} className="border-l-2 border-border pl-4">
            <h3 className="font-mono text-sm text-accent">{heading}</h3>
            <ul className="mt-2">
              {visible.map((n) => (
                <IssueRow key={n.number} node={n} />
              ))}
            </ul>
            {hidden > 0 ? (
              <button
                type="button"
                onClick={() => setShippedExpanded(true)}
                className="mt-2 px-2 py-1 text-[11px] text-muted hover:text-accent"
              >
                [+ {t.roadmap.timeline.expandShipped.replace("{n}", String(hidden))}]
              </button>
            ) : null}
            {isShipped && shippedExpanded ? (
              <button
                type="button"
                onClick={() => setShippedExpanded(false)}
                className="mt-2 px-2 py-1 text-[11px] text-muted hover:text-accent"
              >
                [- {t.roadmap.timeline.collapseShipped}]
              </button>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
