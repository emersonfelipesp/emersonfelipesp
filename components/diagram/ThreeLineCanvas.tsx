"use client";

import {
  createContext,
  createElement,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  use,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

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

type DiagramPaint = {
  color: THREE.Color;
  alpha: number;
};

type DiagramSceneContextValue = DiagramPaint & {
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

const EMPTY_TRIANGLES: readonly DiagramTriangle[] = [];

const DiagramSceneContext = createContext<DiagramSceneContextValue | null>(null);

function useDiagramScene() {
  const value = use(DiagramSceneContext);
  if (!value) {
    throw new Error("Three diagram primitives must be rendered inside ThreeDiagramCanvas.");
  }
  return value;
}

function parseComputedColor(style: string): DiagramPaint {
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
      return {
        color: new THREE.Color(values[0] / 255, values[1] / 255, values[2] / 255),
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
  return { color, alpha: 1 };
}

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
  return [
    `${id}${triangle.opacity ?? 1}`,
    triangle.points.map(pointKey).join("|"),
  ].join(":");
}

export function ThreeDiagramPath({
  points,
  dashed = false,
  opacity = 1,
}: DiagramPath) {
  const { alpha, color, strokeWidth } = useDiagramScene();
  const { size } = useThree();

  const geometry = useMemo(
    () => {
      const next = new LineGeometry();
      next.setPositions(points.flatMap(([x, y]) => [x, y, 0]));
      return next;
    },
    [points],
  );
  const material = useMemo(
    () =>
      new LineMaterial({
        color,
        dashed,
        dashSize: 2,
        depthTest: false,
        depthWrite: false,
        gapSize: 1.5,
        linewidth: strokeWidth,
        opacity: alpha * opacity,
        transparent: true,
        worldUnits: false,
      }),
    [alpha, color, dashed, opacity, strokeWidth],
  );
  const line = useMemo(() => new Line2(geometry, material), [geometry, material]);

  useLayoutEffect(() => {
    material.resolution.set(size.width, size.height);
  }, [material, size.height, size.width]);

  useLayoutEffect(() => {
    if (dashed) line.computeLineDistances();
  }, [dashed, line]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return createElement("primitive", { object: line });
}

export function ThreeDiagramTriangle({
  points,
  opacity = 1,
}: DiagramTriangle) {
  const { alpha, color } = useDiagramScene();

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        points.flatMap(([x, y]) => [x, y, 0]),
        3,
      ),
    );
    g.setIndex([0, 1, 2]);
    return g;
  }, [points]);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        opacity: alpha * opacity,
        side: THREE.DoubleSide,
        transparent: true,
      }),
    [alpha, color, opacity],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return createElement("mesh", { geometry, material });
}

export function ThreeDiagramCanvas({
  viewBox,
  children,
  className,
  preserveDrawingBuffer = false,
  strokeWidth = 1,
  testId,
}: ThreeDiagramCanvasProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [paint, setPaint] = useState<DiagramPaint>(() => ({
    color: new THREE.Color(1, 1, 1),
    alpha: 1,
  }));

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const hostEl = host;

    function readPaint() {
      const next = parseComputedColor(getComputedStyle(hostEl).color);
      setPaint((current) => {
        if (
          current.alpha === next.alpha &&
          current.color.r === next.color.r &&
          current.color.g === next.color.g &&
          current.color.b === next.color.b
        ) {
          return current;
        }
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
  const contextValue = useMemo(
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
