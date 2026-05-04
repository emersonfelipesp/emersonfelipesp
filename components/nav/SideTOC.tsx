"use client";

import { useEffect, useState } from "react";

export type Section = { id: string; label: string };

type Props = {
  sections: readonly Section[];
};

type SubItem = {
  id: string;
  label: string;
  level: 0 | 1;
  num?: number;
};

export function SideTOC({ sections }: Props) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState<SubItem[]>([]);
  const [activeSub, setActiveSub] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (inView[0]) setActive(inView[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const first = document.getElementById(sections[0]?.id ?? "");
    if (!first) return;

    const trigger = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setVisible(entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    trigger.observe(first);
    return () => trigger.disconnect();
  }, [sections]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raf = requestAnimationFrame(() => {
      const heading = document.getElementById(active);
      const section = heading?.closest("section");
      if (!section) {
        setItems((prev) => (prev.length === 0 ? prev : []));
        return;
      }
      const nodes = Array.from(
        section.querySelectorAll<HTMLElement>(
          "[data-toc-group], [data-toc-step]",
        ),
      );
      let counter = 0;
      const out: SubItem[] = [];
      for (const el of nodes) {
        if (!el.id) continue;
        const isGroup = el.hasAttribute("data-toc-group");
        if (isGroup) {
          counter = 0;
          const label =
            el.getAttribute("data-toc-label") ?? el.textContent?.trim() ?? "";
          if (label) out.push({ id: el.id, label, level: 0 });
        } else {
          counter += 1;
          const label =
            el.getAttribute("data-toc-step-title") ??
            el.textContent?.trim() ??
            "";
          if (label) out.push({ id: el.id, label, level: 1, num: counter });
        }
      }
      setItems(out);
    });
    return () => cancelAnimationFrame(raf);
  }, [active]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (items.length === 0) {
      const raf = requestAnimationFrame(() =>
        setActiveSub((prev) => (prev === "" ? prev : "")),
      );
      return () => cancelAnimationFrame(raf);
    }
    const els = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (inView[0]) setActiveSub(inView[0].target.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    setActiveSub(id);
    history.replaceState(null, "", `#${id}`);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const sectionLabel = sections.find((s) => s.id === active)?.label ?? "";
  const showItems = items.length > 0;
  const reveal = visible && showItems;

  return (
    <nav
      aria-label="Section sub-table of contents"
      aria-hidden={!reveal}
      className={`fixed left-3 top-[calc(var(--topnav-h,3.125rem)+5rem)] z-30 hidden max-h-[calc(100vh-var(--topnav-h,3.125rem)-6rem)] w-[calc((100vw-72rem)/2-1.5rem)] overflow-y-auto pr-2 xl:block transition-[opacity,transform] duration-300 ease-out ${
        reveal
          ? "opacity-100 translate-x-0"
          : "pointer-events-none -translate-x-2 opacity-0"
      }`}
    >
      <p className="mb-2 break-words pl-3 text-[10px] uppercase tracking-widest text-muted">
        {"// "}
        {sectionLabel}
      </p>
      <ul className="space-y-1 border-l border-border pl-3 text-[11px] leading-snug">
        {items.map((it, i) => {
          const isActive = it.id === activeSub;
          const isGroup = it.level === 0;
          return (
            <li
              key={it.id}
              style={{ transitionDelay: reveal ? `${i * 18}ms` : "0ms" }}
              className={`transition-[opacity,transform] duration-300 ease-out ${
                reveal ? "opacity-100 translate-x-0" : "-translate-x-1 opacity-0"
              }`}
            >
              <a
                href={`#${it.id}`}
                onClick={(e) => handleClick(e, it.id)}
                aria-current={isActive ? "true" : undefined}
                className={`flex gap-1.5 break-words py-1 transition-colors duration-150 ${
                  isGroup
                    ? isActive
                      ? "-ml-3 -my-px border-l-2 border-accent pl-3 text-accent"
                      : "text-fg hover:text-accent"
                    : isActive
                      ? "-ml-3 -my-px border-l-2 border-accent pl-7 text-accent"
                      : "pl-4 text-muted hover:text-accent"
                }`}
              >
                {isGroup ? (
                  <>
                    <span className="shrink-0 text-accent">#</span>
                    <span className="min-w-0 flex-1 break-words">
                      {it.label}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="shrink-0 text-accent/70">→</span>
                    <span className="shrink-0 text-accent">
                      {String(it.num ?? 0).padStart(2, "0")}.
                    </span>
                    <span className="min-w-0 flex-1 break-words">
                      {it.label}
                    </span>
                  </>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
