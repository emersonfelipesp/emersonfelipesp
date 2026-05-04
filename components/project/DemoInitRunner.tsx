"use client";

import { DemoCommandRunner } from "./DemoCommandRunner";
import { DemoInitTrace } from "./sims/DemoInitTrace";

export function DemoInitRunner() {
  return (
    <DemoCommandRunner
      command="nbx demo init"
      render={({ runKey, onDone }) => (
        <DemoInitTrace key={runKey} onDone={onDone} />
      )}
    />
  );
}
