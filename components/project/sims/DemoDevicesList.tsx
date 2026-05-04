"use client";

import { useFixture } from "./useFixture";

type Capture = {
  title: string;
  argv: readonly string[];
  stdout_full: string;
  exit_code: number;
};

export function DemoDevicesList() {
  const cap = useFixture<Capture>("demo-devices-list-help.json");

  if (!cap) {
    return <div className="mt-2 text-xs text-muted">loading fixture…</div>;
  }

  return (
    <div className="mt-2">
      <pre className="overflow-x-auto whitespace-pre text-xs leading-relaxed text-fg sm:text-sm">
        {cap.stdout_full}
      </pre>
      <p className="mt-1 text-xs text-muted">
        # captured from netbox-sdk docgen — `nbx {cap.argv.join(" ")}` (exit {cap.exit_code})
      </p>
    </div>
  );
}
