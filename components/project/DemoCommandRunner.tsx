"use client";

import { useState, type ReactNode } from "react";
import { Prompt } from "@/components/terminal/Prompt";

type Status = "idle" | "running" | "done";

type RenderDemo = {
  runKey: number;
  onDone: () => void;
};

type Props = {
  command: string;
  cwd?: string;
  render: (demo: RenderDemo) => ReactNode;
};

export function DemoCommandRunner({
  command,
  cwd = "~/netbox-sdk",
  render,
}: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [runKey, setRunKey] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  const buttonLabel =
    status === "running" ? "stop" : status === "done" ? "replay" : "Run it!";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (status === "running") {
      setStatus("idle");
      return;
    }
    if (status === "done") {
      setRunKey((k) => k + 1);
    }
    setCollapsed(false);
    setStatus("running");
  };

  const toggleCollapsed = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCollapsed((c) => !c);
  };

  const markDone = () => {
    setStatus((cur) => (cur === "running" ? "done" : cur));
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 font-mono text-sm leading-relaxed">
        <p className="min-w-0 flex-1 truncate">
          <Prompt cwd={cwd} />
          <span className="text-fg">{command}</span>
        </p>
        <div className="flex shrink-0 items-baseline gap-3">
          <button
            type="button"
            onClick={handleClick}
            className={`text-xs transition-colors hover:text-accent ${
              status === "running" ? "text-warn" : "text-success"
            }`}
          >
            {buttonLabel}
          </button>
          {status !== "idle" ? (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "expand output" : "collapse output"}
              aria-expanded={!collapsed}
              className="text-xs text-muted transition-colors hover:text-accent"
            >
              {collapsed ? "▸" : "▾"}
            </button>
          ) : null}
        </div>
      </div>
      {status !== "idle" ? (
        <div hidden={collapsed}>{render({ runKey, onDone: markDone })}</div>
      ) : null}
    </div>
  );
}
