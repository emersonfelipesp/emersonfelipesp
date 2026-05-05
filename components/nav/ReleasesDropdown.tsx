"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiTag } from "react-icons/fi";
import type { GitHubRelease } from "@/lib/github";

type Props = {
  releases: readonly GitHubRelease[];
  ariaLabel?: string;
  compact?: boolean;
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function ReleasesDropdown({
  releases,
  ariaLabel,
  compact = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const latest = releases[0];

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function openDropdown() {
    setHighlight(0);
    setOpen(true);
  }

  function toggleDropdown() {
    if (releases.length === 0) return;
    if (open) setOpen(false);
    else openDropdown();
  }

  function pick(url: string) {
    setOpen(false);
    triggerRef.current?.focus();
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (releases.length === 0) return;
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
      setHighlight((i) => (i + 1) % releases.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => (i - 1 + releases.length) % releases.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setHighlight(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHighlight(releases.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = releases[highlight];
      if (r) pick(r.url);
    }
  }

  const empty = releases.length === 0;

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
          disabled={empty}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={ariaLabel ?? "Releases"}
          className={`flex items-center justify-center gap-0.5 p-2 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
            open
              ? "text-accent"
              : "text-muted hover:bg-accent/15 hover:text-accent"
          }`}
        >
          <FiTag className="h-4 w-4" aria-hidden="true" />
          <FiChevronDown className="h-3 w-3" aria-hidden="true" />
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={toggleDropdown}
          disabled={empty}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={ariaLabel ?? "Releases"}
          className={`block px-2 py-4 text-xs transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
            open ? "bg-accent/15" : "hover:bg-accent/15"
          }`}
        >
          <span className="text-muted">--releases=</span>
          <span className="text-accent">
            {latest ? latest.tag : "n/a"}
          </span>
          <span className="text-muted"> ▾</span>
        </button>
      )}
      {open && !empty && (
        <ul
          role="listbox"
          aria-label={ariaLabel ?? "Releases"}
          style={{ animation: "slide-in-down 150ms ease-out" }}
          className="term-scroll absolute right-0 z-50 mt-1 max-h-80 min-w-[16rem] overflow-y-auto border border-border bg-surface py-2 text-xs shadow-lg"
        >
          {releases.map((r, i) => {
            const isLatest = i === 0;
            const isHighlighted = i === highlight;
            const date = formatDate(r.publishedAt);
            return (
              <li
                key={r.tag}
                role="option"
                aria-selected={isLatest}
                onClick={() => pick(r.url)}
                onMouseEnter={() => setHighlight(i)}
                className={[
                  "flex cursor-pointer items-center justify-between gap-3 px-2 py-1 transition-colors",
                  isLatest ? "text-accent" : "text-muted hover:text-accent",
                  isHighlighted ? "bg-surface-2" : "",
                ].join(" ")}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{isLatest ? "●" : "○"}</span>
                  <span className="font-mono">{r.tag}</span>
                  {r.prerelease ? (
                    <span className="text-[10px] text-warn">[pre]</span>
                  ) : null}
                </span>
                {date ? (
                  <span className="text-[10px] text-muted/70">{date}</span>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
