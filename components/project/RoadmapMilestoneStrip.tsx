"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { Roadmap } from "@/lib/roadmap";

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

export function RoadmapMilestoneStrip({
  milestones,
}: {
  milestones: Roadmap["milestones"];
}) {
  const { t } = useLanguage();
  if (milestones.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2 border border-border bg-surface px-3 py-2">
      {milestones.map((m) => {
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
    </ul>
  );
}
