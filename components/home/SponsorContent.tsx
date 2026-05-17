"use client";

import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { OutputBlock } from "@/components/terminal/OutputBlock";
import { ViewBeacon } from "@/components/home/ViewBeacon";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function SponsorContent() {
  const { t } = useLanguage();
  const s = t.sponsor;

  return (
    <div data-palette="mixed" className="space-y-8">
      <ViewBeacon path="/sponsor" />

      <TerminalWindow title="~/sponsor">
        <TypedCommand command={s.command} cwd="~" />
        <OutputBlock>
          <p className="mb-3">{s.intro}</p>
          <p className="mb-3">{s.why}</p>
          <p className="mb-3">{s.impact}</p>
          <p className="text-accent-2">{s.thanks}</p>
        </OutputBlock>

        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted">{s.cardCaption}</p>
          <SponsorCard
            href="https://github.com/sponsors/emersonfelipesp"
            label={s.cardTitle}
            url="github.com/sponsors/emersonfelipesp"
            ariaLabel={s.cardTitle}
            primary
          />
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-xs text-muted">{s.alternativesCaption}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <SponsorCard
              href="https://buymeacoffee.com/emersonfelipesp"
              label={s.buyMeACoffeeLabel}
              url="buymeacoffee.com/emersonfelipesp"
              ariaLabel={s.buyMeACoffeeAria}
            />
            <SponsorCard
              href="https://patreon.com/emersonfelipesp"
              label={s.patreonLabel}
              url="patreon.com/emersonfelipesp"
              ariaLabel={s.patreonAria}
            />
          </div>
        </div>
      </TerminalWindow>
    </div>
  );
}

type SponsorCardProps = {
  href: string;
  label: string;
  url: string;
  ariaLabel: string;
  primary?: boolean;
};

function SponsorCard({ href, label, url, ariaLabel, primary }: SponsorCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`flex h-full items-center justify-between gap-3 border px-3 py-3 text-sm text-fg transition-colors sm:px-4 ${
        primary
          ? "border-accent bg-surface-2 hover:border-accent-2 hover:bg-surface"
          : "border-border bg-surface-2 hover:border-accent hover:bg-surface"
      }`}
    >
      <div className="min-w-0 space-y-1">
        <p className={primary ? "text-accent" : "text-fg"}>[{label}]</p>
        <p className="truncate text-xs text-muted">{url}</p>
      </div>
      <span
        aria-hidden="true"
        className={`shrink-0 text-lg ${primary ? "text-accent-2" : "text-muted"}`}
      >
        -&gt;
      </span>
    </a>
  );
}
