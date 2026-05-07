"use client";

import { useEffect, useRef, useState } from "react";

export type PickerItem = { id: string; label: string };

type Props = {
  items: readonly PickerItem[];
  activeId: string;
  triggerLabel: (active: PickerItem) => string;
  itemLabel?: (item: PickerItem) => string;
  triggerAria: (active: PickerItem) => string;
  listboxAria: string;
  onPick: (item: PickerItem) => void;
};

export function ListboxPicker({
  items,
  activeId,
  triggerLabel,
  itemLabel = (item) => item.label,
  triggerAria,
  listboxAria,
  onPick,
}: Props) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const activeIndex = items.findIndex((i) => i.id === activeId);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;
  const current = items[safeIndex] ?? items[0];

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function openDropdown() {
    setHighlight(safeIndex);
    setOpen(true);
  }

  function toggleDropdown() {
    if (open) setOpen(false);
    else openDropdown();
  }

  function pick(item: PickerItem) {
    setOpen(false);
    triggerRef.current?.focus();
    onPick(item);
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
      setHighlight((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setHighlight(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHighlight(items.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(items[highlight]);
    }
  }

  if (!current) return null;

  return (
    <div ref={rootRef} className="relative inline-block" onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={triggerAria(current)}
        className={`block px-2 py-4 text-xs transition-all duration-150 ${
          open
            ? "text-accent"
            : "text-muted hover:bg-accent/15 hover:text-accent"
        }`}
      >
        <span className="text-accent">{triggerLabel(current)}</span>
        <span className="text-muted"> ▾</span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={listboxAria}
          style={{ animation: "slide-in-down 150ms ease-out" }}
          className="absolute left-0 z-50 mt-1 min-w-[14rem] border border-border bg-surface py-1 text-xs shadow-lg"
        >
          {items.map((item, i) => {
            const isActive = item.id === current.id;
            const isHighlighted = i === highlight;
            return (
              <li
                key={item.id}
                role="option"
                aria-selected={isActive}
                onClick={() => pick(item)}
                onMouseEnter={() => setHighlight(i)}
                className={[
                  "flex cursor-pointer items-center gap-2 px-2 py-1 transition-colors",
                  isActive ? "text-accent" : "text-muted hover:text-accent",
                  isHighlighted ? "bg-surface-2" : "",
                ].join(" ")}
              >
                <span aria-hidden="true">{isActive ? "●" : "○"}</span>
                <span>{itemLabel(item)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
