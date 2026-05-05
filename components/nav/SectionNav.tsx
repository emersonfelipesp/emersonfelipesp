"use client";

import { useEffect, useState } from "react";
import {
  NavActions,
  type SectionAction,
  type SectionStars,
} from "./NavActions";
import { useScrollCompact } from "./use-scroll-compact";
import type { GitHubReleaseSummary } from "@/lib/github";

export type Section = { id: string; label: string };

export type { SectionAction, SectionStars };

type Props = {
  sections: readonly Section[];
  actions?: readonly SectionAction[];
  stars?: SectionStars;
  releases?: readonly GitHubReleaseSummary[];
  releasesLabel?: string;
  releasesBasePath?: string;
  releasesAllLabel?: string;
};

export function SectionNav({
  sections,
  actions,
  stars,
  releases,
  releasesLabel,
  releasesBasePath,
  releasesAllLabel,
}: Props) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const compact = useScrollCompact(Boolean(releases));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    history.replaceState(null, "", `#${id}`);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const hasActions = Boolean((actions && actions.length > 0) || releases || stars);

  return (
    <nav
      aria-label="Section navigation"
      className="sticky top-[var(--topnav-h,3.125rem)] z-30 border border-t-0 border-border bg-surface/90 px-3 backdrop-blur"
    >
      <ul className="nav-magnetic flex flex-wrap items-center gap-y-2 text-xs">
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => handleClick(e, s.id)}
                aria-current={isActive ? "true" : undefined}
                className={`block px-2 py-4 transition-all duration-150 ${
                  isActive
                    ? "text-accent"
                    : "text-muted hover:bg-accent/15 hover:text-accent"
                }`}
              >
                [{s.label}]
              </a>
            </li>
          );
        })}
        {hasActions ? (
          <li className="ml-auto flex items-center gap-1">
            <NavActions
              actions={actions}
              stars={stars}
              releases={releases}
              releasesLabel={releasesLabel}
              releasesBasePath={releasesBasePath}
              releasesAllLabel={releasesAllLabel}
              compact={compact}
            />
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
