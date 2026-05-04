"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error boundary]", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "monospace", background: "#07101a", color: "#e6f7f4", padding: "2rem" }}>
        <div style={{ border: "1px solid #ef4444", padding: "1.25rem" }}>
          <p style={{ color: "#ef4444", marginBottom: "0.25rem" }}>
            <span style={{ color: "#64748b" }}>$ </span>
            fatal: {error.message || "unexpected error"}
          </p>
          {error.digest ? (
            <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: 0 }}>
              digest: {error.digest}
            </p>
          ) : null}
          <button
            onClick={reset}
            style={{
              marginTop: "1rem",
              border: "1px solid #00f2d4",
              background: "transparent",
              color: "#00f2d4",
              padding: "0.25rem 0.75rem",
              fontSize: "0.75rem",
              fontFamily: "monospace",
              cursor: "pointer",
            }}
          >
            $ retry
          </button>
        </div>
      </body>
    </html>
  );
}
