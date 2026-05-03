"use client";

import { useState } from "react";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { Screenshot } from "./Screenshot";
import { Lightbox } from "./Lightbox";

export type ScreenshotItem = {
  src: string;
  alt: string;
  caption: string;
};

export type ScreenshotGroup = {
  id: string;
  title: string;
  items: readonly ScreenshotItem[];
};

type Props = {
  groups: readonly ScreenshotGroup[];
  cwd?: string;
};

export function ScreenshotGallery({ groups, cwd = "~/netbox-proxbox" }: Props) {
  const [activeId, setActiveId] = useState<string>(groups[0]?.id ?? "");
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);

  const activeGroup =
    groups.find((g) => g.id === activeId) ?? groups[0];

  if (!activeGroup) return null;

  return (
    <div className="space-y-4">
      <div
        role="tablist"
        aria-label="Screenshot groups"
        className="flex flex-wrap gap-x-2 gap-y-1 border-b border-border pb-2 text-xs"
      >
        {groups.map((group) => {
          const isActive = group.id === activeId;
          return (
            <button
              key={group.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`screenshots-panel-${group.id}`}
              onClick={() => {
                setActiveId(group.id);
                setZoomedIndex(null);
              }}
              className={`border px-2 py-0.5 transition-colors ${
                isActive
                  ? "border-accent bg-surface-2 text-accent"
                  : "border-border text-muted hover:border-accent hover:text-accent"
              }`}
            >
              [{group.id}]
            </button>
          );
        })}
      </div>

      <div
        key={activeGroup.id}
        role="tabpanel"
        id={`screenshots-panel-${activeGroup.id}`}
        className="space-y-3"
        style={{ animation: "fade-in 150ms ease-out" }}
      >
        <TypedCommand command={`ls screenshots/${activeGroup.id}`} cwd={cwd} />
        <p className="text-xs text-muted">
          <span className="text-accent">#</span> {activeGroup.title}
        </p>
        <ul className="divide-y divide-border border border-border bg-surface">
          {activeGroup.items.map((item, i) => (
            <li key={item.src}>
              <Screenshot
                src={item.src}
                alt={item.alt}
                caption={item.caption}
                onZoom={() => setZoomedIndex(i)}
              />
            </li>
          ))}
        </ul>
      </div>

      {zoomedIndex !== null && (
        <Lightbox
          items={activeGroup.items}
          index={zoomedIndex}
          onClose={() => setZoomedIndex(null)}
          onIndexChange={setZoomedIndex}
        />
      )}
    </div>
  );
}
