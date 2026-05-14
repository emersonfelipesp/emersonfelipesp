"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ContentViewToggle } from "@/components/nav/ContentViewToggle";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-12 border-t border-border pt-4 text-xs text-muted">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="text-accent">$</span> {t.footer.tagline}
        </p>
        <ContentViewToggle className="w-full sm:w-auto" />
      </div>
    </footer>
  );
}
