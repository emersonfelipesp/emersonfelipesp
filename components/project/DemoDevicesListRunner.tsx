"use client";

import { DemoCommandRunner } from "./DemoCommandRunner";
import { DemoDevicesList } from "./sims/DemoDevicesList";

export function DemoDevicesListRunner() {
  return (
    <DemoCommandRunner
      command="nbx dcim devices list --help"
      render={({ runKey, onDone }) => (
        <DemoDevicesList key={runKey} onDone={onDone} />
      )}
    />
  );
}
