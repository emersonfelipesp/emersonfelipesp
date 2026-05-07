"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { roadmapPath, type ProjectSlug } from "@/lib/project-registry";

type View = "showcase" | "developer" | "roadmap";

const BASE_VIEWS: readonly View[] = ["showcase", "developer"] as const;

function viewsForSlug(slug: ProjectSlug): readonly View[] {
  return roadmapPath(slug)
    ? ([...BASE_VIEWS, "roadmap"] as const)
    : BASE_VIEWS;
}

type Props = {
  slug: ProjectSlug;
  current: View;
  compact?: boolean;
};

export function ProjectViewToggle({ slug, current, compact = false }: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const views = viewsForSlug(slug);
  const labels = t.project.developer.tabs;
  const optionLabel = (v: View) =>
    v === "showcase"
      ? labels.showcase
      : v === "developer"
        ? labels.developer
        : labels.roadmap;
  const currentIndex = views.indexOf(current);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function openDropdown() {
    setHighlight(currentIndex >= 0 ? currentIndex : 0);
    setOpen(true);
  }

  function toggleDropdown() {
    if (open) setOpen(false);
    else openDropdown();
  }

  function pick(next: View) {
    setOpen(false);
    triggerRef.current?.focus();
    if (next === current) return;
    const href =
      next === "developer"
        ? `/${slug}/developer`
        : next === "roadmap"
          ? `/${slug}/roadmap`
          : `/${slug}`;
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        openDropdown();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => (i + 1) % views.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => (i - 1 + views.length) % views.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setHighlight(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHighlight(views.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(views[highlight]);
    }
  }

  return (
    <div
      ref={rootRef}
      className="relative inline-block"
      onKeyDown={onKeyDown}
    >
      {compact ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={t.nav.viewAria(optionLabel(current))}
          className={`block px-2 py-4 text-xs transition-all duration-150 ${
            open
              ? "text-accent"
              : "text-muted hover:bg-accent/15 hover:text-accent"
          }`}
        >
          [{optionLabel(current)}]
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={t.nav.viewAria(optionLabel(current))}
          className={`block px-2 py-4 text-xs transition-all duration-150 ${
            open ? "bg-accent/15" : "hover:bg-accent/15"
          }`}
        >
          <span className="text-muted">{t.nav.viewLabel}</span>
          <span className="text-accent">{optionLabel(current)}</span>
          <span className="text-muted"> ▾</span>
        </button>
      )}
      {open && (
        <ul
          role="listbox"
          aria-label="Project view"
          style={{ animation: "slide-in-down 150ms ease-out" }}
          className="absolute right-0 z-50 mt-1 min-w-[10rem] border border-border bg-surface py-1 text-xs shadow-lg"
        >
          {views.map((view, i) => {
            const isActive = view === current;
            const isHighlighted = i === highlight;
            return (
              <li
                key={view}
                role="option"
                aria-selected={isActive}
                onClick={() => pick(view)}
                onMouseEnter={() => setHighlight(i)}
                className={[
                  "flex cursor-pointer items-center gap-2 px-2 py-1 transition-colors",
                  isActive ? "text-accent" : "text-muted hover:text-accent",
                  isHighlighted ? "bg-surface-2" : "",
                ].join(" ")}
              >
                <span aria-hidden="true">{isActive ? "●" : "○"}</span>
                <span>{optionLabel(view)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
