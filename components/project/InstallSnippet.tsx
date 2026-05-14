"use client";

import { Prompt } from "@/components/terminal/Prompt";
import { useCopySnippet } from "./use-copy-snippet";

type Props = {
  command: string;
  note?: string;
};

export function InstallSnippet({ command, note }: Props) {
  const { copied, handleButtonClick } = useCopySnippet(command);

  return (
    <div className="group border border-border bg-surface-2">
      <div className="flex items-center justify-between px-3 pt-1.5 text-xs text-muted">
        <span>install</span>
        <button
          type="button"
          aria-label="Copy install command"
          onClick={handleButtonClick}
          className={`transition-opacity hover:text-accent focus-visible:opacity-100 group-hover:opacity-100 ${
            copied ? "text-accent opacity-100" : "opacity-0"
          }`}
        >
          {copied ? "copied!" : "copy"}
        </button>
      </div>
      <div className="px-4 py-3 text-sm">
        <Prompt cwd="~" />
        <span className="text-fg">{command}</span>
      </div>
      {note ? (
        <p className="border-t border-border px-4 py-2 text-xs text-muted">
          # {note}
        </p>
      ) : null}
    </div>
  );
}
