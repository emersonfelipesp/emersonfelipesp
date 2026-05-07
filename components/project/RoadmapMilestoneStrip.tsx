"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { Roadmap } from "@/lib/roadmap";

type Milestone = Roadmap["milestones"][number];

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

type Version = { major: number; minor: number; patch: number; suffix: string };

function parseVersion(title: string): Version | null {
  const m = title.match(/^v(\d+)\.(\d+)\.(\d+)(.*)$/);
  if (!m) return null;
  return {
    major: parseInt(m[1], 10),
    minor: parseInt(m[2], 10),
    patch: parseInt(m[3], 10),
    suffix: m[4] ?? "",
  };
}

function compareMilestones(a: Milestone, b: Milestone): number {
  const va = parseVersion(a.title);
  const vb = parseVersion(b.title);
  if (!va && !vb) {
    const ad = a.due_on ? Date.parse(a.due_on) : Number.POSITIVE_INFINITY;
    const bd = b.due_on ? Date.parse(b.due_on) : Number.POSITIVE_INFINITY;
    if (ad !== bd) return ad - bd;
    return a.title.localeCompare(b.title);
  }
  if (!va) return -1;
  if (!vb) return 1;
  if (va.major !== vb.major) return va.major - vb.major;
  if (va.minor !== vb.minor) return va.minor - vb.minor;
  if (va.patch !== vb.patch) return va.patch - vb.patch;
  if (va.suffix === "" && vb.suffix !== "") return 1;
  if (va.suffix !== "" && vb.suffix === "") return -1;
  return va.suffix.localeCompare(vb.suffix);
}

function isPast(m: Milestone): boolean {
  const total = m.open + m.closed;
  return m.state === "closed" || (total > 0 && m.open === 0);
}

export function RoadmapMilestoneStrip({
  milestones,
}: {
  milestones: Roadmap["milestones"];
}) {
  const { t } = useLanguage();
  const [showPast, setShowPast] = useState(false);

  const sorted = useMemo(
    () => [...milestones].sort(compareMilestones),
    [milestones],
  );
  const pastCount = useMemo(
    () => sorted.filter(isPast).length,
    [sorted],
  );
  const visible = useMemo(
    () => (showPast ? sorted : sorted.filter((m) => !isPast(m))),
    [sorted, showPast],
  );

  if (sorted.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2 border border-border bg-surface px-3 py-2">
      {visible.map((m) => {
        const total = m.open + m.closed;
        const pct = total === 0 ? 0 : Math.round((m.closed / total) * 100);
        const due = fmtDate(m.due_on);
        return (
          <li
            key={m.title}
            data-state={m.state}
            className="border border-border bg-surface-2 px-2 py-1 font-mono text-[11px]"
          >
            <span className="text-accent">[{m.title}]</span>{" "}
            <span className="text-muted">
              {m.closed}/{total} ({pct}%)
            </span>
            {due ? (
              <span className="text-muted">
                {" · "}
                {t.roadmap.milestoneDue.replace("{date}", due)}
              </span>
            ) : null}
          </li>
        );
      })}
      {pastCount > 0 ? (
        <li className="border border-border bg-surface-2 font-mono text-[11px]">
          <button
            type="button"
            data-toggle="past-milestones"
            data-state={showPast ? "open" : "closed"}
            aria-pressed={showPast}
            onClick={() => setShowPast((v) => !v)}
            className="px-2 py-1 text-muted transition-colors hover:bg-accent/15 hover:text-accent"
          >
            [
            {showPast
              ? t.roadmap.milestoneToggle.hidePast
              : t.roadmap.milestoneToggle.showPast.replace(
                  "{n}",
                  String(pastCount),
                )}
            ]
          </button>
        </li>
      ) : null}
    </ul>
  );
}
