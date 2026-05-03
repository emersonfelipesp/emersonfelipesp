import type { ReactNode } from "react";

type Props = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function TerminalWindow({ title = "~/", children, className = "" }: Props) {
  return (
    <section
      className={`border border-border bg-surface shadow-[0_0_0_1px_var(--border)] ${className}`}
    >
      <header className="flex items-center justify-between border-b border-border bg-surface-2 px-3 py-1.5 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-danger/80" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-warn/80" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-success/80" />
        </div>
        <span className="text-muted">[ {title} ]</span>
        <span className="w-12 text-right text-muted">tty0</span>
      </header>
      <div className="px-4 py-4 sm:px-6 sm:py-5">{children}</div>
    </section>
  );
}
