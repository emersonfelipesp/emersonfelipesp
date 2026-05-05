"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type Props = {
  slug: string;
};

export function ProjectViewTabs({ slug }: Props) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const tabs = t.project.developer.tabs;
  const showcaseHref = `/${slug}`;
  const developerHref = `/${slug}/developer`;
  const isDeveloper = pathname === developerHref;

  return (
    <nav
      aria-label="Project view"
      className="flex flex-wrap gap-y-1 border border-border bg-surface/90 px-3 text-xs"
    >
      <Link
        href={showcaseHref}
        aria-current={!isDeveloper ? "page" : undefined}
        className={`block px-2 py-2 transition-all duration-150 ${
          !isDeveloper
            ? "text-accent"
            : "text-muted hover:bg-accent/15 hover:text-accent"
        }`}
      >
        [{tabs.showcase}]
      </Link>
      <Link
        href={developerHref}
        aria-current={isDeveloper ? "page" : undefined}
        className={`block px-2 py-2 transition-all duration-150 ${
          isDeveloper
            ? "text-accent"
            : "text-muted hover:bg-accent/15 hover:text-accent"
        }`}
      >
        [{tabs.developer}]
      </Link>
    </nav>
  );
}
