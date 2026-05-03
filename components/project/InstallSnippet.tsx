"use client";

import { useState } from "react";
import { Prompt } from "@/components/terminal/Prompt";

type Props = {
  command: string;
  note?: string;
};

export function InstallSnippet({ command, note }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="border border-border bg-surface-2">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-[10px] text-muted">
        <span>install</span>
        <button
          type="button"
          onClick={copy}
          className="border border-border px-2 py-0.5 hover:border-accent hover:text-accent"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <div className="px-4 py-3 text-sm">
        <Prompt cwd="~" />
        <span className="text-fg">{command}</span>
      </div>
      {note ? (
        <p className="border-t border-border px-4 py-2 text-[10px] text-muted">
          # {note}
        </p>
      ) : null}
    </div>
  );
}
