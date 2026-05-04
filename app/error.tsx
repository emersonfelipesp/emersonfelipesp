"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[error boundary]", error);
  }, [error]);

  return (
    <div data-palette="mixed" className="p-8">
      <div className="border border-danger bg-surface p-5 text-sm">
        <p className="text-danger">
          <span className="text-muted">$ </span>
          error: {error.message || "unexpected server error"}
        </p>
        {error.digest ? (
          <p className="mt-1 text-xs text-muted">digest: {error.digest}</p>
        ) : null}
        <button
          onClick={reset}
          className="mt-4 border border-accent px-3 py-1 text-xs text-accent hover:bg-accent/10"
        >
          $ retry
        </button>
      </div>
    </div>
  );
}
