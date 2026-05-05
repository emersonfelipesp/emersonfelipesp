"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useFixture } from "./useFixture";

type HotspotRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Hotspot = {
  id: string;
  label: string;
  action: "state" | "close";
  widget_id: string;
  region: HotspotRegion;
  target_state?: string;
};

type Capture = {
  svg: string;
  hotspots: Hotspot[];
};

type SimulationState = {
  id: string;
  captures: Record<string, Capture>;
};

type TuiSimulationManifest = {
  command: string;
  terminal_size: {
    columns: number;
    rows: number;
  };
  themes: string[];
  state_ids: string[];
  states: SimulationState[];
};

type Props = {
  command: string;
  onClose: () => void;
};

function pickPreferredTheme(available: readonly string[] | undefined): string {
  const themes = available ?? ["netbox-dark", "netbox-light"];
  if (typeof document === "undefined") return themes[0] ?? "netbox-dark";

  const root = document.documentElement;
  const named = root.getAttribute("data-theme");
  if (named && themes.includes(named)) return named;

  const fallback = root.classList.contains("dark") ? "netbox-dark" : "netbox-light";
  if (themes.includes(fallback)) return fallback;
  return themes[0] ?? fallback;
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function hotspotStyle(
  hotspot: Hotspot,
  size: TuiSimulationManifest["terminal_size"],
): CSSProperties {
  const left = clampPercent((hotspot.region.x / size.columns) * 100);
  const top = clampPercent((hotspot.region.y / size.rows) * 100);
  const width = clampPercent((hotspot.region.width / size.columns) * 100);
  const height = clampPercent((hotspot.region.height / size.rows) * 100);
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    height: `${height}%`,
  };
}

export function DemoTuiModal({ command, onClose }: Props) {
  const manifest = useFixture<TuiSimulationManifest>("tui-simulation/main-browser.json");
  const [stateId, setStateId] = useState("home");
  const [themeName, setThemeName] = useState(() => pickPreferredTheme(undefined));
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    const updateTheme = () => setThemeName(pickPreferredTheme(manifest?.themes));
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    return () => observer.disconnect();
  }, [manifest?.themes]);

  useEffect(() => {
    triggerRef.current = document.activeElement;

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
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      const trigger = triggerRef.current;
      if (trigger instanceof HTMLElement) trigger.focus();
    };
  }, [onClose]);

  const currentState = manifest?.states.find((state) => state.id === stateId) ?? manifest?.states[0];
  const capture =
    currentState?.captures[themeName] ??
    (currentState ? Object.values(currentState.captures)[0] : undefined);
  const imageSrc = capture ? `/netbox-sdk-fixtures/tui-simulation/${capture.svg}` : null;

  const onHotspot = (hotspot: Hotspot) => {
    if (hotspot.action === "close") {
      onClose();
      return;
    }
    if (hotspot.target_state) {
      setStateId(hotspot.target_state);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={command}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-3 py-1.5 font-mono text-xs text-muted">
          <span>~/netbox-sdk $ {command}</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="min-h-10 text-muted transition-colors hover:text-accent active:scale-[0.96]"
            aria-label="close TUI preview"
          >
            close [ESC]
          </button>
        </div>
        <div className="max-h-[76vh] overflow-auto bg-bg" data-state-id={currentState?.id ?? "loading"}>
          {imageSrc && currentState && manifest && capture ? (
            <div className="relative min-w-[720px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={`${command} ${currentState.id} TUI capture`}
                className="block w-full"
                draggable={false}
              />
              <div className="absolute inset-0">
                {capture.hotspots.map((hotspot) => (
                  <button
                    key={hotspot.id}
                    type="button"
                    aria-label={hotspot.label}
                    data-hotspot-id={hotspot.id}
                    data-widget-id={hotspot.widget_id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onHotspot(hotspot);
                    }}
                    className="absolute cursor-pointer bg-transparent text-[0px] outline-none transition-colors hover:bg-accent/10 focus-visible:bg-accent/15 focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent active:scale-[0.96]"
                    style={hotspotStyle(hotspot, manifest.terminal_size)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 font-mono text-sm text-muted">loading TUI capture...</div>
          )}
        </div>
      </div>
    </div>
  );
}
