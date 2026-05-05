"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getFeatured } from "@/lib/i18n/profile";

export function FeaturedProjectsGrid() {
  const { lang } = useLanguage();
  const featured = getFeatured(lang);
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {featured.map((p) => (
        <Link
          key={p.slug}
          href={p.href}
          className="group flex flex-col justify-between border border-border bg-surface p-4 transition-all duration-200 hover:border-accent hover:-translate-y-px"
        >
          <div>
            <p className="text-xs text-muted">$ ./run --project</p>
            <p className="mt-1 text-base text-accent group-hover:text-accent-2">
              {p.name}
            </p>
            <p className="mt-2 text-xs text-fg/80">{p.tagline}</p>
          </div>
          <p className="mt-3 text-xs text-muted">{p.badge}</p>
        </Link>
      ))}
    </div>
  );
}
