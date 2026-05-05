"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-12 border-t border-border pt-4 text-xs text-muted">
      <span className="text-accent">$</span> {t.footer.tagline}
    </footer>
  );
}
