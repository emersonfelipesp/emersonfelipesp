"use client";

import { useEffect } from "react";

export function ViewBeacon({ path }: { path: string }) {
  useEffect(() => {
    const body = JSON.stringify({ path });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/views",
        new Blob([body], { type: "application/json" }),
      );
      return;
    }
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }, [path]);
  return null;
}
