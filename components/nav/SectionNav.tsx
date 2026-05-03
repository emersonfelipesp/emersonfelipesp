"use client";

import { useEffect, useState } from "react";

export type Section = { id: string; label: string };

type Props = {
  sections: readonly Section[];
};

export function SectionNav({ sections }: Props) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

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

  return (
    <nav
      aria-label="Section navigation"
      className="sticky top-[var(--topnav-h,0px)] z-30 border border-border bg-surface/90 px-3 py-2 backdrop-blur"
    >
      <ul className="flex flex-wrap gap-x-2 gap-y-1 text-xs">
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => handleClick(e, s.id)}
                aria-current={isActive ? "true" : undefined}
                className={`border px-2 py-0.5 transition-all duration-150 ${
                  isActive
                    ? "border-accent text-accent"
                    : "border-border text-muted hover:border-accent hover:text-accent"
                }`}
              >
                [{s.label}]
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
