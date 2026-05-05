"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { GitHubReleaseSummary } from "@/lib/github";

function TagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M2 2v9.172a2 2 0 0 0 .586 1.414l8.828 8.828a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828L12.586 2.586A2 2 0 0 0 11.172 2H2zm5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M3.22 8.47a.75.75 0 0 1 1.06 0L12 16.19l7.72-7.72a.75.75 0 1 1 1.06 1.06l-8.25 8.25a.75.75 0 0 1-1.06 0L3.22 9.53a.75.75 0 0 1 0-1.06z" />
    </svg>
  );
}

type Props = {
  releases: readonly GitHubReleaseSummary[];
  ariaLabel?: string;
  basePath?: string;
  allLabel?: string;
  compact?: boolean;
};

type ReleaseOption =
  | {
      kind: "all";
      key: string;
      href: string;
      label: string;
    }
  | {
      kind: "release";
      key: string;
      href: string;
      release: GitHubReleaseSummary;
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
  basePath,
  allLabel = "all releases",
  compact = false,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const latest = releases.find((release) => release.latest) ?? releases[0];
  const options: ReleaseOption[] = [
    ...(basePath
      ? [{ kind: "all" as const, key: "all", href: basePath, label: allLabel }]
      : []),
    ...releases.map((release) => ({
      kind: "release" as const,
      key: release.tag,
      href: basePath
        ? `${basePath}/${release.tag
            .split("/")
            .map((part) => encodeURIComponent(part))
            .join("/")}`
        : release.url,
      release,
    })),
  ];

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
    if (options.length === 0) return;
    if (open) setOpen(false);
    else openDropdown();
  }

  function pick(option: ReleaseOption) {
    setOpen(false);
    triggerRef.current?.focus();
    if (basePath) {
      router.push(option.href);
    } else if (typeof window !== "undefined") {
      window.open(option.href, "_blank", "noopener,noreferrer");
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (options.length === 0) return;
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
      setHighlight((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setHighlight(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHighlight(options.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const option = options[highlight];
      if (option) pick(option);
    }
  }

  const empty = options.length === 0;

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
          <TagIcon className="h-4 w-4" />
          <ChevronDownIcon className="h-3 w-3" />
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
          {options.map((option, i) => {
            const isHighlighted = i === highlight;
            const isAll = option.kind === "all";
            const release = option.kind === "release" ? option.release : null;
            const isLatest = release?.tag === latest?.tag;
            const date = formatDate(release?.publishedAt ?? null);
            return (
              <li
                key={option.key}
                role="option"
                aria-selected={isLatest || isAll}
                onClick={() => pick(option)}
                onMouseEnter={() => setHighlight(i)}
                className={[
                  "flex cursor-pointer items-center justify-between gap-3 px-2 py-1 transition-colors",
                  isLatest || isAll
                    ? "text-accent"
                    : "text-muted hover:text-accent",
                  isHighlighted ? "bg-surface-2" : "",
                ].join(" ")}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">
                    {isLatest || isAll ? "●" : "○"}
                  </span>
                  <span className="font-mono">
                    {isAll ? option.label : release?.tag}
                  </span>
                  {release?.prerelease ? (
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
