"use client";

import { useCallback, useEffect, useRef } from "react";

export function useTimeoutScheduler(): {
  clearScheduledTimeouts: () => void;
  scheduleTimeout: (callback: () => void, delayMs: number) => void;
} {
  const timeoutsRef = useRef(new Set<ReturnType<typeof setTimeout>>());

  const clearScheduledTimeouts = useCallback(() => {
    for (const timeout of timeoutsRef.current) {
      clearTimeout(timeout);
    }
    timeoutsRef.current.clear();
  }, []);

  const scheduleTimeout = useCallback(
    (callback: () => void, delayMs: number) => {
      const timeout = setTimeout(() => {
        timeoutsRef.current.delete(timeout);
        callback();
      }, delayMs);
      timeoutsRef.current.add(timeout);
    },
    [],
  );

  useEffect(() => clearScheduledTimeouts, [clearScheduledTimeouts]);

  return { clearScheduledTimeouts, scheduleTimeout };
}
