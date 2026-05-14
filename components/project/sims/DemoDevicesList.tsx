"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFixture } from "./useFixture";
import { useTimeoutScheduler } from "./useTimeoutScheduler";

type Capture = {
  title: string;
  argv: readonly string[];
  stdout_full: string;
  exit_code: number;
};

type Props = {
  onDone?: () => void;
};

export function DemoDevicesList({ onDone }: Props = {}) {
  const cap = useFixture<Capture>("demo-devices-list.json");
  const [revealed, setRevealed] = useState(0);
  const onDoneRef = useRef(onDone);
  const { clearScheduledTimeouts, scheduleTimeout } = useTimeoutScheduler();

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const lines = useMemo(
    () => (cap ? cap.stdout_full.split("\n") : []),
    [cap],
  );

  useEffect(() => {
    if (!cap) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    clearScheduledTimeouts();

    if (reduce) {
      scheduleTimeout(() => {
        setRevealed(lines.length);
        onDoneRef.current?.();
      }, 0);
      return clearScheduledTimeouts;
    }

    let li = 0;
    const tick = () => {
      if (li >= lines.length) {
        scheduleTimeout(() => {
          onDoneRef.current?.();
        }, 120);
        return;
      }
      li += 1;
      setRevealed(li);
      scheduleTimeout(tick, 30 + Math.floor(Math.random() * 25));
    };

    scheduleTimeout(tick, 120);

    return clearScheduledTimeouts;
  }, [cap, clearScheduledTimeouts, lines, scheduleTimeout]);

  if (!cap) {
    return <div className="mt-2 text-xs text-muted">loading fixture…</div>;
  }

  const visible = lines.slice(0, revealed).join("\n");
  const done = revealed >= lines.length;

  return (
    <div className="mt-2">
      <pre
        aria-live="polite"
        className="overflow-x-auto whitespace-pre text-xs leading-relaxed text-fg sm:text-sm"
      >
        {visible}
      </pre>
      {done ? (
        <p className="mt-1 text-xs text-muted">
          # captured from netbox-sdk docgen: `nbx {cap.argv.join(" ")}` (exit {cap.exit_code})
        </p>
      ) : null}
    </div>
  );
}
