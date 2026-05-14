"use client";

import { useCopySnippet } from "./use-copy-snippet";

type Props = {
  code: string;
  label?: string;
};

export function CodeSnippet({ code, label = "shell" }: Props) {
  const { copied, handleButtonClick } = useCopySnippet(code);

  return (
    <div className="group border border-border bg-surface-2">
      <div className="flex items-center justify-between px-3 pt-1 text-xs text-muted">
        <span>{label}</span>
        <button
          type="button"
          aria-label={`Copy ${label} snippet`}
          onClick={handleButtonClick}
          className={`transition-opacity hover:text-accent focus-visible:opacity-100 group-hover:opacity-100 ${
            copied ? "text-accent opacity-100" : "opacity-0"
          }`}
        >
          {copied ? "copied!" : "copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-xs sm:text-sm leading-relaxed text-fg">
        {code}
      </pre>
    </div>
  );
}
