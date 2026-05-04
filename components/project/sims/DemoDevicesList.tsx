"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFixture } from "./useFixture";

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
  const cap = useFixture<Capture>("demo-devices-list-help.json");
  const [revealed, setRevealed] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const onDoneRef = useRef(onDone);

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

    const schedule = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timeoutsRef.current.push(t);
    };

    if (reduce) {
      schedule(() => {
        setRevealed(lines.length);
        onDoneRef.current?.();
      }, 0);
      return () => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
      };
    }

    let li = 0;
    const tick = () => {
      if (li >= lines.length) {
        schedule(() => {
          onDoneRef.current?.();
        }, 120);
        return;
      }
      li += 1;
      setRevealed(li);
      schedule(tick, 30 + Math.floor(Math.random() * 25));
    };

    schedule(tick, 120);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [cap, lines]);

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
          # captured from netbox-sdk docgen — `nbx {cap.argv.join(" ")}` (exit {cap.exit_code})
        </p>
      ) : null}
    </div>
  );
}
