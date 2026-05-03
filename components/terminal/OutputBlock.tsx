import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function OutputBlock({ children, className = "" }: Props) {
  return (
    <div
      className={`mt-2 mb-4 border-l-2 border-border pl-4 text-sm leading-relaxed text-fg/90 ${className}`}
    >
      {children}
    </div>
  );
}
