"use client";

import { useEffect, useReducer, useRef } from "react";
import { useFixture } from "./useFixture";
import { useTimeoutScheduler } from "./useTimeoutScheduler";

type Prompt = { label: string; hidden: boolean; answer: string };
type Flow = { prompts: Prompt[]; ok: string };

type Phase = { promptIdx: number; typed: number; done: boolean };

type Props = {
  onDone?: () => void;
};

const initialPhase: Phase = { promptIdx: 0, typed: 0, done: false };

function phaseReducer(_phase: Phase, nextPhase: Phase): Phase {
  return nextPhase;
}

export function DemoInitTrace({ onDone }: Props = {}) {
  const flow = useFixture<Flow>("demo-init-flow.json");
  const [phase, dispatchPhase] = useReducer(phaseReducer, initialPhase);
  const onDoneRef = useRef(onDone);
  const { clearScheduledTimeouts, scheduleTimeout } = useTimeoutScheduler();

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!flow) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    clearScheduledTimeouts();

    if (reduce) {
      scheduleTimeout(() => {
        dispatchPhase({
          promptIdx: flow.prompts.length,
          typed: 0,
          done: true,
        });
        onDoneRef.current?.();
      }, 0);
      return clearScheduledTimeouts;
    }

    let pi = 0;
    let ti = 0;
    const tick = () => {
      if (pi >= flow.prompts.length) {
        scheduleTimeout(() => {
          dispatchPhase({ promptIdx: pi, typed: 0, done: true });
          onDoneRef.current?.();
        }, 200);
        return;
      }
      const p = flow.prompts[pi];
      if (ti < p.answer.length) {
        ti += 1;
        dispatchPhase({ promptIdx: pi, typed: ti, done: false });
        scheduleTimeout(tick, 60 + Math.floor(Math.random() * 80));
        return;
      }
      scheduleTimeout(() => {
        pi += 1;
        ti = 0;
        dispatchPhase({ promptIdx: pi, typed: 0, done: false });
        tick();
      }, 280);
    };

    scheduleTimeout(tick, 200);

    return clearScheduledTimeouts;
  }, [clearScheduledTimeouts, flow, scheduleTimeout]);

  if (!flow) {
    return <div className="mt-2 text-xs text-muted">loading fixture…</div>;
  }

  return (
    <pre
      aria-live="polite"
      className="mt-2 overflow-x-auto whitespace-pre text-xs leading-relaxed text-fg sm:text-sm"
    >
      {flow.prompts.map((p, idx) => {
        if (idx > phase.promptIdx) return null;
        const isCurrent = idx === phase.promptIdx && !phase.done;
        const fullyAnswered = idx < phase.promptIdx || phase.done;
        const visibleCount = fullyAnswered ? p.answer.length : phase.typed;
        const visible = (p.hidden ? "*".repeat(visibleCount) : p.answer.slice(0, visibleCount));
        return (
          <div key={p.label}>
            <span className="text-accent-2">{p.label}</span>
            <span className="text-muted">: </span>
            <span className="text-fg">{visible}</span>
            {isCurrent ? <span className="text-accent">▍</span> : null}
          </div>
        );
      })}
      {phase.done ? (
        <div>
          <span className="text-success">  ✔  </span>
          <span className="text-fg">{flow.ok}</span>
        </div>
      ) : null}
    </pre>
  );
}
