"use client";

import Image from "next/image";
import { useEffect, useEffectEvent } from "react";

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
  const closeLightbox = useEffectEvent(onClose);
  const changeIndex = useEffectEvent(onIndexChange);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft" && hasPrev) changeIndex(index - 1);
      else if (e.key === "ArrowRight" && hasNext) changeIndex(index + 1);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, hasPrev, hasNext]);

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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg/95 p-4 backdrop-blur"
      style={{ animation: "fade-in 150ms ease-out" }}
    >
      <button
        type="button"
        aria-label="Close screenshot lightbox"
        onClick={onClose}
        className="absolute inset-0 cursor-zoom-out"
      />
      <div
        className="relative z-10 mb-2 flex w-full max-w-6xl items-center justify-between gap-4 text-xs text-muted"
      >
        <span className="truncate">
          <span className="text-accent">›</span> {item.caption}
        </span>
        <span className="shrink-0">
          [{index + 1}/{items.length}] · [← →] [esc]
        </span>
      </div>

      <div
        className="relative z-10 flex w-full max-w-6xl flex-1 items-center justify-center"
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

        <Image
          key={item.src}
          src={item.src}
          alt={item.alt}
          width={1600}
          height={1000}
          unoptimized
          className="max-h-[85vh] max-w-full border border-border object-contain"
          style={{
            touchAction: "pinch-zoom",
            animation: "overlay-in 180ms ease-out",
          }}
        />
      </div>
    </div>
  );
}
