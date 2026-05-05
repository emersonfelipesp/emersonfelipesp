"use client";

import { useState } from "react";
import { Prompt } from "@/components/terminal/Prompt";
import { DemoTuiModal } from "./sims/DemoTuiModal";

export function DemoTuiRunner() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 font-mono text-sm leading-relaxed">
        <p className="min-w-0 flex-1 truncate">
          <Prompt cwd="~/netbox-sdk" />
          <span className="text-fg">nbx tui</span>
        </p>
        <button
          type="button"
          aria-label="run nbx tui"
          aria-haspopup="dialog"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className="shrink-0 text-xs text-success transition-colors hover:text-accent active:scale-[0.96]"
        >
          Run it!
        </button>
      </div>
      {open ? <DemoTuiModal command="nbx tui" onClose={() => setOpen(false)} /> : null}
    </div>
  );
}

