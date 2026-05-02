import type { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
  className?: string;
};

export function SectionHeading({ id, children, className = "" }: Props) {
  return (
    <h2
      id={id}
      className={`group scroll-mt-24 text-sm font-normal text-muted ${className}`}
    >
      <a
        href={`#${id}`}
        className="inline-flex items-baseline gap-2 text-muted hover:text-accent"
      >
        <span className="select-none text-accent">›</span>
        <span className="text-fg">{children}</span>
        <span
          aria-hidden
          className="select-none text-muted opacity-0 transition-opacity group-hover:opacity-100"
        >
          #
        </span>
      </a>
    </h2>
  );
}
