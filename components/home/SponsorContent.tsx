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
          <div className="flex justify-center">
            <iframe
              src="https://github.com/sponsors/emersonfelipesp/card"
              title={s.cardTitle}
              height={225}
              width={600}
              className="w-full max-w-[600px] border-0"
              loading="lazy"
            />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-xs text-muted">{s.alternativesCaption}</p>
          <TypedCommand command="open https://buymeacoffee.com/emersonfelipesp" cwd="~" />
          <a
            href="https://buymeacoffee.com/emersonfelipesp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.buyMeACoffeeAria}
            className="inline-block border border-border bg-surface-2 px-3 py-2 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
          >
            [{s.buyMeACoffeeLabel}] -&gt; buymeacoffee.com/emersonfelipesp
          </a>
        </div>
      </TerminalWindow>
    </div>
  );
}
