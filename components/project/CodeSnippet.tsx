"use client";

import { useState } from "react";

type Props = {
  code: string;
  label?: string;
};

export function CodeSnippet({ code, label = "shell" }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="border border-border bg-surface-2">
      <div className="flex items-center justify-between border-b border-border px-3 py-1 text-xs text-muted">
        <span>{label}</span>
        <button
          type="button"
          onClick={copy}
          className="border border-border px-2 py-0.5 hover:border-accent hover:text-accent"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-xs sm:text-sm leading-relaxed text-fg">
        {code}
      </pre>
    </div>
  );
}
