"use client";

import { useEffect, useRef, useState } from "react";
import { LANGUAGES, useLanguage, type Lang } from "./LanguageProvider";

type Props = { compact?: boolean };

export function LanguageToggle({ compact = false }: Props) {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentIndex = LANGUAGES.findIndex((entry) => entry.code === lang);

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

  function pick(next: Lang) {
    setLang(next);
    setOpen(false);
    triggerRef.current?.focus();
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
      setHighlight((i) => (i + 1) % LANGUAGES.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => (i - 1 + LANGUAGES.length) % LANGUAGES.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setHighlight(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHighlight(LANGUAGES.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(LANGUAGES[highlight].code);
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
          aria-label={t.nav.languageAria(lang)}
          className={`block px-2 py-4 text-xs transition-all duration-150 ${
            open
              ? "text-accent"
              : "text-muted hover:bg-accent/15 hover:text-accent"
          }`}
        >
          [{lang}]
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`block px-2 py-4 text-xs transition-all duration-150 ${
            open ? "bg-accent/15" : "hover:bg-accent/15"
          }`}
        >
          <span className="text-muted">{t.nav.languageLabel}</span>
          <span className="text-accent">{lang}</span>
          <span className="text-muted"> ▾</span>
        </button>
      )}
      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          style={{ animation: "slide-in-down 150ms ease-out" }}
          className="absolute right-0 z-50 mt-1 min-w-[10rem] border border-border bg-surface py-1 text-xs shadow-lg"
        >
          {LANGUAGES.map((entry, i) => {
            const isActive = entry.code === lang;
            const isHighlighted = i === highlight;
            return (
              <li
                key={entry.code}
                role="option"
                aria-selected={isActive}
                onClick={() => pick(entry.code)}
                onMouseEnter={() => setHighlight(i)}
                className={[
                  "flex cursor-pointer items-center gap-2 px-2 py-1 transition-colors",
                  isActive ? "text-accent" : "text-muted hover:text-accent",
                  isHighlighted ? "bg-surface-2" : "",
                ].join(" ")}
              >
                <span aria-hidden="true">{isActive ? "●" : "○"}</span>
                <span>{entry.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
