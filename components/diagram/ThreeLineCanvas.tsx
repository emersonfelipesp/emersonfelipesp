"use client";

import {
  createContext,
  type ReactNode,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { NmArrow, NmDashedLine, NmTube } from "@nmulticloud/nm-three-js";

// ─── Public types ──────────────────────────────────────────────────────────────

export type DiagramPoint = readonly [number, number];

export type DiagramPath = {
  id?: string;
  points: readonly DiagramPoint[];
  dashed?: boolean;
  opacity?: number;
};

export type DiagramTriangle = {
  id?: string;
  points: readonly [DiagramPoint, DiagramPoint, DiagramPoint];
  opacity?: number;
};

// ─── Internal types ───────────────────────────────────────────────────────────

type DiagramColor = {
  hex: number;
  alpha: number;
};

type DiagramSceneContextValue = DiagramColor & {
  strokeWidth: number;
};

type ThreeDiagramCanvasProps = {
  viewBox: readonly [number, number];
  children: ReactNode;
  className?: string;
  preserveDrawingBuffer?: boolean;
  strokeWidth?: number;
  testId?: string;
};

type ThreeLineCanvasProps = Omit<ThreeDiagramCanvasProps, "children"> & {
  paths: readonly DiagramPath[];
  triangles?: readonly DiagramTriangle[];
};

// ─── Context (keeps ThreeDiagramCanvas + children composition working) ────────

const DiagramSceneContext = createContext<DiagramSceneContextValue | null>(null);

function useDiagramScene(): DiagramSceneContextValue {
  const value = use(DiagramSceneContext);
  if (!value) {
    throw new Error("Three diagram primitives must be rendered inside ThreeDiagramCanvas.");
  }
  return value;
}

// ─── CSS color detection ──────────────────────────────────────────────────────

function parseComputedColor(style: string): DiagramColor {
  const rgba = style.match(/rgba?\(([^)]+)\)/i);
  if (rgba) {
    const raw = rgba[1].replace("/", " ");
    const channels: string[] = [];
    for (const part of raw.split(/[,\s]+/)) {
      const channel = part.trim();
      if (channel) channels.push(channel);
    }
    const values = channels.slice(0, 3).map((part) => {
      if (part.endsWith("%")) return (Number.parseFloat(part) / 100) * 255;
      return Number.parseFloat(part);
    });
    if (values.every((v) => Number.isFinite(v))) {
      const r = Math.round(values[0]);
      const g = Math.round(values[1]);
      const b = Math.round(values[2]);
      return {
        hex: (r << 16) | (g << 8) | b,
        alpha: channels[3] ? Number.parseFloat(channels[3]) : 1,
      };
    }
  }

  const color = new THREE.Color();
  try {
    color.setStyle(style);
  } catch {
    color.setRGB(1, 1, 1);
  }
  return { hex: color.getHex(), alpha: 1 };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toVec3(pts: readonly DiagramPoint[]): THREE.Vector3[] {
  return pts.map(([x, y]) => new THREE.Vector3(x, y, 0));
}

const EMPTY_TRIANGLES: readonly DiagramTriangle[] = [];

function pointKey([x, y]: DiagramPoint): string {
  return `${x}:${y}`;
}

function pathKey(path: DiagramPath): string {
  const id = path.id ? `${path.id}:` : "";
  return [
    `${id}${path.dashed ? "dashed" : "solid"}`,
    path.opacity ?? 1,
    path.points.map(pointKey).join("|"),
  ].join(":");
}

function triangleKey(triangle: DiagramTriangle): string {
  const id = triangle.id ? `${triangle.id}:` : "";
  return [`${id}${triangle.opacity ?? 1}`, triangle.points.map(pointKey).join("|")].join(":");
}

// ─── Scene primitives (use nm-three-js components) ────────────────────────────

export function ThreeDiagramPath({ points, dashed = false, opacity = 1 }: DiagramPath) {
  const { hex, alpha } = useDiagramScene();
  const vec3Points = useMemo(() => toVec3(points), [points]);

  if (dashed) {
    return (
      <NmDashedLine
        points={vec3Points}
        color={hex}
        dashSize={2}
        gapSize={1.5}
      />
    );
  }

  return (
    <NmTube
      points={vec3Points}
      color={hex}
      radius={0.7}
      opacity={alpha * opacity}
    />
  );
}

export function ThreeDiagramTriangle({ points }: DiagramTriangle) {
  const { hex } = useDiagramScene();

  // Compute arrowhead angle from base midpoint → tip.
  // Camera is Y-down (SVG coords): +Y is downward on screen.
  // NmArrow's cone apex is at +Y when angleRad=0.
  // atan2(-dx, dy) rotates the apex to align with the direction (dx, dy)
  // in Y-down world space.
  const tip = points[0];
  const baseMidX = (points[1][0] + points[2][0]) / 2;
  const baseMidY = (points[1][1] + points[2][1]) / 2;
  const dx = tip[0] - baseMidX;
  const dy = tip[1] - baseMidY;
  const angleRad = Math.atan2(-dx, dy);

  return <NmArrow tip={[tip[0], tip[1]]} angleRad={angleRad} color={hex} size={8} />;
}

// ─── Canvas wrapper ───────────────────────────────────────────────────────────

export function ThreeDiagramCanvas({
  viewBox,
  children,
  className,
  preserveDrawingBuffer = false,
  strokeWidth = 1,
  testId,
}: ThreeDiagramCanvasProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [paint, setPaint] = useState<DiagramColor>(() => ({
    hex: 0xd1d5db,
    alpha: 1,
  }));

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const hostEl = host;

    function readPaint() {
      const next = parseComputedColor(getComputedStyle(hostEl).color);
      setPaint((current) => {
        if (current.alpha === next.alpha && current.hex === next.hex) return current;
        return next;
      });
    }

    readPaint();
    const themeObserver = new MutationObserver(readPaint);
    themeObserver.observe(document.documentElement, {
      attributeFilter: ["class", "data-theme"],
      attributes: true,
    });
    return () => themeObserver.disconnect();
  }, []);

  const [width, height] = viewBox;
  const contextValue = useMemo<DiagramSceneContextValue>(
    () => ({ ...paint, strokeWidth }),
    [paint, strokeWidth],
  );

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      data-testid={testId}
    >
      <DiagramSceneContext.Provider value={contextValue}>
        <Canvas
          orthographic
          frameloop="demand"
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer }}
          dpr={[1, 2]}
          camera={{
            bottom: height,
            far: 10,
            left: 0,
            near: -10,
            position: [0, 0, 1],
            right: width,
            top: 0,
          }}
          style={{
            display: "block",
            height: "100%",
            pointerEvents: "none",
            width: "100%",
          }}
          onCreated={({ gl }) => {
            gl.setClearAlpha(0);
          }}
        >
          {children}
        </Canvas>
      </DiagramSceneContext.Provider>
    </div>
  );
}

// ─── Convenience composite ────────────────────────────────────────────────────

export function ThreeLineCanvas({
  viewBox,
  paths,
  triangles = EMPTY_TRIANGLES,
  className,
  preserveDrawingBuffer = false,
  strokeWidth = 1,
  testId,
}: ThreeLineCanvasProps) {
  return (
    <ThreeDiagramCanvas
      viewBox={viewBox}
      className={className}
      preserveDrawingBuffer={preserveDrawingBuffer}
      strokeWidth={strokeWidth}
      testId={testId}
    >
      {paths.map((path) => (
        <ThreeDiagramPath key={pathKey(path)} {...path} />
      ))}
      {triangles.map((triangle) => (
        <ThreeDiagramTriangle key={triangleKey(triangle)} {...triangle} />
      ))}
    </ThreeDiagramCanvas>
  );
}
