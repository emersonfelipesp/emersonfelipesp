"use client";

import { useEffect } from "react";

export type LightboxItem = {
  src: string;
  alt: string;
  caption: string;
};

type Props = {
  items: readonly LightboxItem[];
  index: number;
  onClose: () => void;
  onIndexChange: (next: number) => void;
};

export function Lightbox({ items, index, onClose, onIndexChange }: Props) {
  const item = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasPrev) onIndexChange(index - 1);
      else if (e.key === "ArrowRight" && hasNext) onIndexChange(index + 1);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, hasPrev, hasNext, onClose, onIndexChange]);

  useEffect(() => {
    [items[index + 1], items[index - 1]].forEach((sibling) => {
      if (!sibling) return;
      const img = new window.Image();
      img.src = sibling.src;
    });
  }, [index, items]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.caption}
      onClick={onClose}
      className="fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center justify-center bg-bg/95 p-4 backdrop-blur"
      style={{ animation: "fade-in 150ms ease-out" }}
    >
      <div
        className="mb-2 flex w-full max-w-6xl items-center justify-between gap-4 text-xs text-muted"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="truncate">
          <span className="text-accent">›</span> {item.caption}
        </span>
        <span className="shrink-0">
          [{index + 1}/{items.length}] · [← →] [esc]
        </span>
      </div>

      <div
        className="relative flex w-full max-w-6xl flex-1 items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {hasPrev && (
          <button
            type="button"
            aria-label="Previous screenshot"
            onClick={() => onIndexChange(index - 1)}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 border border-border bg-surface/80 px-2 py-1 text-sm text-muted backdrop-blur transition-colors hover:border-accent hover:text-accent"
          >
            ‹ prev
          </button>
        )}
        {hasNext && (
          <button
            type="button"
            aria-label="Next screenshot"
            onClick={() => onIndexChange(index + 1)}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 border border-border bg-surface/80 px-2 py-1 text-sm text-muted backdrop-blur transition-colors hover:border-accent hover:text-accent"
          >
            next ›
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={item.src}
          src={item.src}
          alt={item.alt}
          className="max-h-[85vh] max-w-full border border-border object-contain"
          style={{
            touchAction: "pinch-zoom",
            animation: "overlay-in 180ms ease-out",
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
