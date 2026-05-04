"use client";

import { useEffect, useState } from "react";

const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

export function useFixture<T>(name: string): T | null {
  const [data, setData] = useState<T | null>(() => (cache.get(name) as T | undefined) ?? null);

  useEffect(() => {
    if (data !== null) return;
    let cancelled = false;
    const url = `/netbox-sdk-fixtures/${name}`;
    let p = inflight.get(url) as Promise<T> | undefined;
    if (!p) {
      p = fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(`fixture ${name} HTTP ${r.status}`);
          return r.json() as Promise<T>;
        })
        .then((j) => {
          cache.set(name, j);
          inflight.delete(url);
          return j;
        });
      inflight.set(url, p as Promise<unknown>);
    }
    p.then((j) => {
      if (!cancelled) setData(j);
    }).catch(() => {
      if (!cancelled) setData(null);
    });
    return () => {
      cancelled = true;
    };
  }, [name, data]);

  return data;
}
