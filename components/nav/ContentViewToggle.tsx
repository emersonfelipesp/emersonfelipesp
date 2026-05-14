"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type View = "human" | "markdown" | "raw";

type Props = {
  compact?: boolean;
  className?: string;
};

const URL_CHANGE_EVENT = "content-view-urlchange";
let historyPatched = false;

function emitUrlChange() {
  window.dispatchEvent(new Event(URL_CHANGE_EVENT));
}

function patchHistory() {
  if (historyPatched || typeof window === "undefined") return;
  historyPatched = true;

  const pushState = window.history.pushState.bind(window.history);
  window.history.pushState = ((...args: Parameters<History["pushState"]>) => {
    const result = pushState(...args);
    emitUrlChange();
    return result;
  }) as History["pushState"];

  const replaceState = window.history.replaceState.bind(window.history);
  window.history.replaceState = ((
    ...args: Parameters<History["replaceState"]>
  ) => {
    const result = replaceState(...args);
    emitUrlChange();
    return result;
  }) as History["replaceState"];
}

function subscribeToUrlChanges(onStoreChange: () => void): () => void {
  patchHistory();
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener(URL_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener(URL_CHANGE_EVENT, onStoreChange);
  };
}

function getSearchSnapshot(): string {
  return typeof window === "undefined" ? "" : window.location.search;
}

function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function getContentViewPaths(pathname: string): {
  current: View;
  humanHref: string;
  rawHref: string;
} {
  const normalized = normalizePath(pathname);
  if (normalized === "/md") {
    return {
      current: "raw",
      humanHref: "/",
      rawHref: "/md",
    };
  }
  if (normalized.startsWith("/md/")) {
    const humanHref = normalizePath(normalized.slice(3));
    return {
      current: "raw",
      humanHref,
      rawHref: normalized,
    };
  }
  return {
    current: "human",
    humanHref: normalized,
    rawHref: normalized === "/" ? "/md" : `/md${normalized}`,
  };
}

function withContentParam(
  pathname: string,
  searchParams: { toString(): string },
  content: "markdown" | null,
): string {
  const params = new URLSearchParams(searchParams.toString());
  if (content) params.set("content", content);
  else params.delete("content");

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function ContentViewToggle({
  compact = false,
  className = "",
}: Props) {
  const pathname = usePathname();
  const search = useSyncExternalStore(
    subscribeToUrlChanges,
    getSearchSnapshot,
    () => "",
  );
  const searchParams = new URLSearchParams(search);
  const { t } = useLanguage();
  const paths = getContentViewPaths(pathname);
  const current =
    paths.current === "raw"
      ? "raw"
      : searchParams.get("content") === "markdown"
        ? "markdown"
        : "human";
  const items: readonly { view: View; label: string; href: string }[] = [
    {
      view: "human",
      label: t.nav.contentHuman,
      href: withContentParam(paths.humanHref, searchParams, null),
    },
    {
      view: "markdown",
      label: t.nav.contentMarkdown,
      href: withContentParam(paths.humanHref, searchParams, "markdown"),
    },
    { view: "raw", label: t.nav.contentRaw, href: paths.rawHref },
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
            prefetch={item.view === "raw" ? false : undefined}
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
