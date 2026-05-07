"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { Roadmap } from "@/lib/roadmap";
import { RoadmapSvg } from "./RoadmapDiagram";

const MIN_SCALE = 0.25;
const MAX_SCALE = 8;
const STEP = 1.2;
const DRAG_THRESHOLD_PX = 4;

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

type Props = {
  data: Roadmap;
  onClose: () => void;
};

export function RoadmapDiagramOverlay({ data, onClose }: Props) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [dragging, setDragging] = useState(false);

  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    tx0: number;
    ty0: number;
    moved: boolean;
  } | null>(null);

  const stateRef = useRef({ scale, tx, ty });
  useEffect(() => {
    stateRef.current = { scale, tx, ty };
  }, [scale, tx, ty]);

  const reset = useCallback(() => {
    setScale(1);
    setTx(0);
    setTy(0);
  }, []);

  const zoomAt = useCallback(
    (factor: number, pivotX: number, pivotY: number) => {
      const { scale: s, tx: x, ty: y } = stateRef.current;
      const next = clamp(s * factor, MIN_SCALE, MAX_SCALE);
      if (next === s) return;
      const k = next / s;
      setTx(pivotX - k * (pivotX - x));
      setTy(pivotY - k * (pivotY - y));
      setScale(next);
    },
    [],
  );

  const zoomCenter = useCallback(
    (factor: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      zoomAt(factor, rect.width / 2, rect.height / 2);
    },
    [zoomAt],
  );

  // Body scroll lock + keyboard shortcuts.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomCenter(STEP);
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        zoomCenter(1 / STEP);
      } else if (e.key === "0") {
        e.preventDefault();
        reset();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, reset, zoomCenter]);

  // Non-passive wheel handler so we can preventDefault page scroll.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const rect = el!.getBoundingClientRect();
      const pivotX = e.clientX - rect.left;
      const pivotY = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? STEP : 1 / STEP;
      zoomAt(factor, pivotX, pivotY);
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      tx0: stateRef.current.tx,
      ty0: stateRef.current.ty,
      moved: false,
    };
    setDragging(true);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
      d.moved = true;
    }
    if (d.moved) {
      setTx(d.tx0 + dx);
      setTy(d.ty0 + dy);
    }
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    // Keep dragRef.current.moved around briefly so the click capture sees it.
    setDragging(false);
    setTimeout(() => {
      dragRef.current = null;
    }, 0);
  }

  // Suppress link navigation when the pointer was dragged.
  function onClickCapture(e: React.MouseEvent<HTMLDivElement>) {
    if (dragRef.current?.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  const scalePct = Math.round(scale * 100);
  const dialogTitle = `${data.counts.open} ${t.roadmap.diagram.openIssuesLabel} · ${data.counts.edges} ${t.roadmap.diagram.edgesLabel}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.roadmap.diagram.overlayAria}
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col bg-bg/95 p-3 backdrop-blur"
      style={{ animation: "fade-in 150ms ease-out" }}
    >
      <header
        className="flex flex-wrap items-center justify-between gap-2 border border-border bg-surface px-3 py-2 text-xs text-muted"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="truncate">
          <span className="text-accent">›</span> ~/netbox-proxbox/roadmap{" "}
          <span className="text-muted">— {dialogTitle}</span>
        </span>
        <span className="flex items-center gap-1">
          <button
            type="button"
            aria-label={t.roadmap.diagram.zoomOut}
            onClick={() => zoomCenter(1 / STEP)}
            className="border border-border bg-surface/80 px-2 py-1 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            [ − ]
          </button>
          <button
            type="button"
            aria-label={t.roadmap.diagram.reset}
            onClick={reset}
            className="border border-border bg-surface/80 px-2 py-1 text-sm text-muted tabular-nums transition-colors hover:border-accent hover:text-accent"
          >
            [ {scalePct}% ]
          </button>
          <button
            type="button"
            aria-label={t.roadmap.diagram.zoomIn}
            onClick={() => zoomCenter(STEP)}
            className="border border-border bg-surface/80 px-2 py-1 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            [ + ]
          </button>
          <button
            type="button"
            aria-label={t.roadmap.diagram.close}
            onClick={onClose}
            className="border border-border bg-surface/80 px-2 py-1 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            [ esc ]
          </button>
        </span>
      </header>

      <div
        ref={containerRef}
        className={`relative flex-1 overflow-hidden border border-t-0 border-border bg-surface select-none ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onClick={(e) => e.stopPropagation()}
        onClickCapture={onClickCapture}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          ref={stageRef}
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transition: dragging ? "none" : "transform 80ms ease-out",
          }}
        >
          <RoadmapSvg data={data} className="block w-[3232px] h-auto" />
        </div>
      </div>
    </div>
  );
}
