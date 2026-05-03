"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { THEMES, useTheme, type Theme } from "./ThemeProvider";

type Props = { compact?: boolean };

export function ThemeToggle({ compact = false }: Props) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentIndex = THEMES.findIndex((t) => t.name === theme);

  useEffect(() => {
    if (open) setHighlight(currentIndex >= 0 ? currentIndex : 0);
  }, [open, currentIndex]);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function pick(next: Theme) {
    setTheme(next);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => (i + 1) % THEMES.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => (i - 1 + THEMES.length) % THEMES.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setHighlight(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHighlight(THEMES.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(THEMES[highlight].name);
    }
  }

  let separatorInjected = false;
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
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Theme: ${theme}`}
          className={`border px-2 py-0.5 text-xs transition-colors ${
            open
              ? "border-accent text-accent"
              : "border-border text-muted hover:border-accent hover:text-accent"
          }`}
        >
          [•••]
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="border border-border px-2 py-1 text-xs hover:border-accent hover:text-accent transition-colors"
        >
          <span className="text-muted">--theme=</span>
          <span className="text-accent">{theme}</span>
          <span className="text-muted"> ▾</span>
        </button>
      )}
      {open && (
        <ul
          role="listbox"
          aria-label="Theme"
          className="absolute right-0 z-50 mt-1 min-w-[12rem] border border-border bg-surface py-1 text-xs shadow-lg"
        >
          {THEMES.map((t, i) => {
            const isActive = t.name === theme;
            const isHighlighted = i === highlight;
            const showSeparator = t.group === "named" && !separatorInjected;
            if (showSeparator) separatorInjected = true;
            return (
              <Fragment key={t.name}>
                {showSeparator && (
                  <li
                    role="presentation"
                    className="px-2 py-0.5 text-muted/60 select-none"
                  >
                    ─── named ───
                  </li>
                )}
                <li
                  role="option"
                  aria-selected={isActive}
                  onClick={() => pick(t.name)}
                  onMouseEnter={() => setHighlight(i)}
                  className={[
                    "flex cursor-pointer items-center gap-2 px-2 py-1 transition-colors",
                    isActive ? "text-accent" : "text-muted hover:text-accent",
                    isHighlighted ? "bg-surface-2" : "",
                  ].join(" ")}
                >
                  <span aria-hidden="true">{isActive ? "●" : "○"}</span>
                  <span>{t.label}</span>
                </li>
              </Fragment>
            );
          })}
        </ul>
      )}
    </div>
  );
}
