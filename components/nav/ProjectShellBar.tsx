"use client";

import {
  NavActions,
  type SectionAction,
  type SectionStars,
} from "./NavActions";
import { useScrollCompact } from "./use-scroll-compact";
import type { GitHubReleaseSummary } from "@/lib/github";

type Props = {
  actions?: readonly SectionAction[];
  stars?: SectionStars;
  releases?: readonly GitHubReleaseSummary[];
  releasesLabel?: string;
  releasesBasePath?: string;
  releasesAllLabel?: string;
};

export function ProjectShellBar({
  actions,
  stars,
  releases,
  releasesLabel,
  releasesBasePath,
  releasesAllLabel,
}: Props) {
  const compact = useScrollCompact(Boolean(releases));

  if (!actions?.length && !releases && !stars) return null;

  return (
    <div className="sticky top-[var(--topnav-h,3.125rem)] z-30 flex items-center justify-end gap-1 border border-t-0 border-border bg-surface/90 px-3 py-1 text-xs backdrop-blur">
      <NavActions
        actions={actions}
        stars={stars}
        releases={releases}
        releasesLabel={releasesLabel}
        releasesBasePath={releasesBasePath}
        releasesAllLabel={releasesAllLabel}
        compact={compact}
      />
    </div>
  );
}
