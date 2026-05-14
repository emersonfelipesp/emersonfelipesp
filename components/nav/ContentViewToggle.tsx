"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type View = "human" | "llm";

type Props = {
  compact?: boolean;
  className?: string;
};

function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function getContentViewPaths(pathname: string): {
  current: View;
  humanHref: string;
  llmHref: string;
} {
  const normalized = normalizePath(pathname);
  if (normalized === "/md") {
    return { current: "llm", humanHref: "/", llmHref: "/md" };
  }
  if (normalized.startsWith("/md/")) {
    const humanHref = normalizePath(normalized.slice(3));
    return { current: "llm", humanHref, llmHref: normalized };
  }
  return {
    current: "human",
    humanHref: normalized,
    llmHref: normalized === "/" ? "/md" : `/md${normalized}`,
  };
}

export function ContentViewToggle({
  compact = false,
  className = "",
}: Props) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { current, humanHref, llmHref } = getContentViewPaths(pathname);
  const items: readonly { view: View; label: string; href: string }[] = [
    { view: "human", label: t.nav.contentHuman, href: humanHref },
    { view: "llm", label: t.nav.contentLlm, href: llmHref },
  ];

  return (
    <div
      role="group"
      aria-label={t.nav.contentAria}
      className={[
        "inline-flex min-h-10 overflow-hidden border border-border bg-surface text-xs",
        className,
      ].join(" ")}
    >
      {!compact ? (
        <span className="flex min-h-10 items-center border-r border-border px-2 text-muted">
          {t.nav.contentLabel}
        </span>
      ) : null}
      {items.map((item) => {
        const isActive = item.view === current;
        const text = `[${item.label}]`;
        const baseClass =
          "flex min-h-10 flex-1 items-center justify-center px-2 transition-[background-color,color,transform] duration-150";
        const segmentClassName = isActive
          ? `${baseClass} bg-accent/15 text-accent`
          : `${baseClass} text-muted hover:bg-accent/15 hover:text-accent focus-visible:bg-accent/15 focus-visible:text-accent active:scale-[0.96]`;

        if (isActive) {
          return (
            <span
              key={item.view}
              aria-current="page"
              className={segmentClassName}
            >
              {text}
            </span>
          );
        }

        return (
          <Link
            key={item.view}
            href={item.href}
            prefetch={item.view === "llm" ? false : undefined}
            aria-label={t.nav.contentSwitchAria(item.label)}
            className={segmentClassName}
          >
            {text}
          </Link>
        );
      })}
    </div>
  );
}
