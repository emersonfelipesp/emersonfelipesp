"use client";

import { useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { RoadmapDiagram } from "./RoadmapDiagram";
import { RoadmapTimeline } from "./RoadmapTimeline";
import { RoadmapMilestoneStrip } from "./RoadmapMilestoneStrip";
import type { Roadmap } from "@/lib/roadmap";
import { getProject } from "@/lib/project-registry";

type View = "diagram" | "timeline";

function fmtDateTime(iso: string): string {
  try {
    return new Date(iso).toISOString().replace("T", " ").slice(0, 16) + " UTC";
  } catch {
    return iso;
  }
}

function projectFromRepo(repo: string): string {
  const parts = repo.split("/");
  return parts[parts.length - 1] || repo;
}

function paletteFor(slug: string): "netbox" | "proxmox" | "mixed" {
  return getProject(slug)?.palette ?? "netbox";
}

export function RoadmapView({ data }: { data: Roadmap }) {
  const { t } = useLanguage();
  const [view, setView] = useState<View>("timeline");
  const project = projectFromRepo(data.repo);
  const palette = paletteFor(project);

  return (
    <div data-palette={palette} className="bg-bg text-fg">
      <header className="border border-border bg-surface px-3 py-3">
        <h1 className="font-mono text-base text-accent">
          ~/{project}/roadmap
        </h1>
        <p className="mt-1 max-w-3xl text-xs text-muted">
          {t.roadmap.intro}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
          <span>
            <span className="text-accent">{data.counts.open}</span>{" "}
            {t.roadmap.legend.open}
          </span>
          <span>
            <span className="text-accent">{data.counts.closed}</span>{" "}
            {t.roadmap.legend.closed}
          </span>
          <span>
            <span className="text-accent">{data.counts.edges}</span>{" "}
            {t.roadmap.legend.edges}
          </span>
          <span>
            {t.roadmap.synced.replace("{when}", fmtDateTime(data.generated_at))}
          </span>
        </div>
      </header>

      <RoadmapMilestoneStrip milestones={data.milestones} />

      <div
        role="tablist"
        aria-label={t.roadmap.viewToggle.aria}
        className="flex border border-t-0 border-border bg-surface-2 px-2 text-xs"
      >
        {(["timeline", "diagram"] as const).map((v) => {
          const active = view === v;
          return (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={active}
              data-view={v}
              data-active={active ? "true" : "false"}
              onClick={() => setView(v)}
              className={`px-3 py-2 transition-colors ${
                active
                  ? "text-accent"
                  : "text-muted hover:bg-accent/15 hover:text-accent"
              }`}
            >
              [{t.roadmap.view[v]}]
            </button>
          );
        })}
      </div>

      <section className="mt-4">
        {view === "diagram" ? (
          <RoadmapDiagram data={data} />
        ) : (
          <RoadmapTimeline data={data} />
        )}
      </section>
    </div>
  );
}

export function RoadmapEmpty({ project }: { project: string }) {
  const { t } = useLanguage();
  const palette = paletteFor(project);
  return (
    <div data-palette={palette} className="bg-bg text-fg">
      <header className="border border-border bg-surface px-3 py-3">
        <h1 className="font-mono text-base text-accent">
          ~/{project}/roadmap
        </h1>
        <p className="mt-1 text-xs text-muted">{t.roadmap.empty}</p>
      </header>
    </div>
  );
}
