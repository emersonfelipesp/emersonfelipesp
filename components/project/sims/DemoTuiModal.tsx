"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onClose: () => void;
};

function pickThemeVariant(): "dark" | "light" {
  if (typeof document === "undefined") return "dark";
  const root = document.documentElement;
  const named = root.getAttribute("data-theme");
  if (named === "netbox-light") return "light";
  if (named === "netbox-dark") return "dark";
  return root.classList.contains("dark") ? "dark" : "light";
}

export function DemoTuiModal({ onClose }: Props) {
  const [variant, setVariant] = useState<"dark" | "light">(() => pickThemeVariant());
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    triggerRef.current = document.activeElement;

    const observer = new MutationObserver(() => setVariant(pickThemeVariant()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);

    closeRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      const t = triggerRef.current;
      if (t instanceof HTMLElement) t.focus();
    };
  }, [onClose]);

  const src = `/netbox-sdk-fixtures/tui-main-netbox-${variant}.svg`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="nbx demo tui"
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-3 py-1.5 font-mono text-xs text-muted">
          <span>~/netbox-sdk $ nbx demo tui</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="text-muted transition-colors hover:text-accent"
            aria-label="close TUI preview"
          >
            close [ESC]
          </button>
        </div>
        <object
          type="image/svg+xml"
          data={src}
          aria-label="netbox-sdk TUI initial screen"
          className="block h-[70vh] w-full"
        />
      </div>
    </div>
  );
}
