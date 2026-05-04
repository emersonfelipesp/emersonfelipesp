"use client";

import { useEffect, useRef, useState } from "react";
import { Prompt } from "@/components/terminal/Prompt";
import type { SimStep } from "@/content/types";
import { DemoInitTrace } from "./sims/DemoInitTrace";
import { DemoDevicesList } from "./sims/DemoDevicesList";
import { DemoTuiModal } from "./sims/DemoTuiModal";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠣", "⠏"] as const;

type RunId = "demo-init" | "demo-devices-list" | "demo-tui";

const RUN_BY_CMD: Record<string, RunId> = {
  "nbx demo init": "demo-init",
  "nbx demo dcim devices list": "demo-devices-list",
  "nbx demo tui": "demo-tui",
};

type Line =
  | { kind: "banner"; lines: readonly string[]; tone: "accent" | "success" }
  | { kind: "step"; text: string }
  | { kind: "info"; text: string }
  | { kind: "ok"; text: string }
  | { kind: "warn"; text: string }
  | { kind: "blank" }
  | { kind: "tip"; cmd: string; comment?: string; runId?: RunId };

type Status = "idle" | "running" | "done";

type Props = {
  command: string;
  cwd: string;
  steps: readonly SimStep[];
};

export function InstallSimulator({ command, cwd, steps }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [lines, setLines] = useState<Line[]>([]);
  const [active, setActive] = useState<{ label: string } | null>(null);
  const [frame, setFrame] = useState(0);
  const [subRun, setSubRun] = useState<RunId | null>(null);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const clearTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current = [];
    intervalsRef.current = [];
  };

  useEffect(() => clearTimers, []);

  const start = () => {
    clearTimers();
    setLines([]);
    setActive(null);
    setFrame(0);
    setSubRun(null);
    setStatus("running");

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const append = (line: Line) => setLines((prev) => [...prev, line]);

    const schedule = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timeoutsRef.current.push(t);
    };

    let i = 0;
    const next = () => {
      if (i >= steps.length) {
        setActive(null);
        setStatus("done");
        return;
      }
      const step = steps[i];
      i += 1;

      if (step.kind === "spinner") {
        if (reduce) {
          append({ kind: "ok", text: step.ok });
          schedule(next, 0);
          return;
        }
        setActive({ label: step.label });
        const interval = setInterval(() => {
          setFrame((f) => (f + 1) % FRAMES.length);
        }, 80);
        intervalsRef.current.push(interval);

        schedule(() => {
          clearInterval(interval);
          intervalsRef.current = intervalsRef.current.filter((x) => x !== interval);
          setActive(null);
          append({ kind: "ok", text: step.ok });
          schedule(next, jitter(reduce));
        }, step.ms);
        return;
      }

      append(toLine(step));
      schedule(next, jitter(reduce));
    };

    next();
  };

  const stop = () => {
    clearTimers();
    setActive(null);
    setStatus("idle");
  };

  const buttonLabel =
    status === "running" ? "stop" : status === "done" ? "replay" : "Run it!";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (status === "running") stop();
    else start();
  };

  const showBody = lines.length > 0 || active !== null;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 font-mono text-sm leading-relaxed">
        <p className="min-w-0 flex-1 truncate">
          <Prompt cwd={cwd} />
          <span className="text-fg">{command}</span>
        </p>
        <button
          type="button"
          onClick={handleClick}
          className={`shrink-0 text-xs transition-colors hover:text-accent ${
            status === "running" ? "text-warn" : "text-success"
          }`}
        >
          {buttonLabel}
        </button>
      </div>
      {showBody ? (
        <pre
          aria-live="polite"
          className="mt-2 overflow-x-auto text-xs sm:text-sm leading-relaxed text-fg whitespace-pre"
        >
          {lines.map((line, idx) => (
            <LineView
              key={idx}
              line={line}
              activeRun={subRun}
              onPick={(id) => setSubRun((cur) => (cur === id ? null : id))}
            />
          ))}
          {active ? (
            <div>
              <span className="text-accent-2">  {FRAMES[frame]}  </span>
              <span className="text-fg">{active.label}</span>
            </div>
          ) : null}
        </pre>
      ) : null}
      {subRun === "demo-init" ? <DemoInitTrace key="demo-init" /> : null}
      {subRun === "demo-devices-list" ? <DemoDevicesList key="demo-devices-list" /> : null}
      {subRun === "demo-tui" ? (
        <DemoTuiModal onClose={() => setSubRun(null)} />
      ) : null}
    </div>
  );
}

function toLine(step: Exclude<SimStep, { kind: "spinner" }>): Line {
  if (step.kind === "banner") {
    return { kind: "banner", lines: step.lines, tone: step.tone ?? "accent" };
  }
  if (step.kind === "tip") {
    const runId = RUN_BY_CMD[step.cmd];
    return runId ? { ...step, runId } : step;
  }
  return step;
}

function jitter(reduce: boolean) {
  if (reduce) return 0;
  return 40 + Math.floor(Math.random() * 80);
}

function LineView({
  line,
  activeRun,
  onPick,
}: {
  line: Line;
  activeRun: RunId | null;
  onPick: (id: RunId) => void;
}) {
  switch (line.kind) {
    case "banner": {
      const cls = line.tone === "success" ? "text-success" : "text-accent";
      return (
        <div className={cls}>
          {line.lines.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      );
    }
    case "step":
      return (
        <div>
          <span className="text-accent-2">  ›  </span>
          <span className="text-fg">{line.text}</span>
        </div>
      );
    case "info":
      return (
        <div>
          <span className="text-muted">     {line.text}</span>
        </div>
      );
    case "ok":
      return (
        <div>
          <span className="text-success">  ✔  </span>
          <span className="text-fg">{line.text}</span>
        </div>
      );
    case "warn":
      return (
        <div>
          <span className="text-warn">  ⚠  </span>
          <span className="text-warn">{line.text}</span>
        </div>
      );
    case "blank":
      return <div>{" "}</div>;
    case "tip": {
      const runId = line.runId;
      const isActive = runId !== undefined && activeRun === runId;
      return (
        <div>
          <span className="text-muted">     </span>
          {runId ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPick(runId);
              }}
              aria-label={`run ${line.cmd}`}
              aria-pressed={isActive}
              className={`text-accent underline-offset-2 hover:underline focus-visible:underline ${
                isActive ? "underline" : ""
              }`}
            >
              {line.cmd}
            </button>
          ) : (
            <span className="text-accent">{line.cmd}</span>
          )}
          {line.comment ? (
            <span className="text-muted">   {line.comment}</span>
          ) : null}
        </div>
      );
    }
  }
}
