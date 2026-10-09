"use client";

import { TypedCommand } from "@/components/terminal/TypedCommand";
import { SectionHeading } from "@/components/project/SectionHeading";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type Props = {
  slug: string;
  repoUrl: string;
};

const STAGE_DELAY = ["pitch-d1", "pitch-d2", "pitch-d3"] as const;

function Link({ index }: { index: number }): React.JSX.Element {
  return (
    <div
      aria-hidden
      className="relative mx-auto h-10 w-px bg-border md:h-px md:w-full md:min-w-12 md:flex-1 md:self-center"
      data-link={index}
    >
      <span className="pitch-packet" />
      <span className="pitch-packet pitch-packet-2" />
      <span className="pitch-packet pitch-packet-3" />
    </div>
  );
}

export function StackPitch({ slug, repoUrl }: Props): React.JSX.Element {
  const { t } = useLanguage();
  const pitch = t.project.proxbox.pitch;

  return (
    <section className="space-y-3 scroll-mt-24">
      <SectionHeading id="how-it-works">{pitch.heading}</SectionHeading>
      <TypedCommand command="./how-it-works --free" cwd={`~/${slug}`} />

      <div className="space-y-6 border border-border bg-surface p-5 text-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs uppercase tracking-widest text-accent-2">
              {pitch.eyebrow}
            </p>
            <p className="text-lg font-bold leading-snug text-fg sm:text-xl">
              {pitch.headline}
            </p>
            <p className="text-fg/90">{pitch.subhead}</p>
          </div>

          <div
            className="pitch-free border border-success bg-success/10 px-4 py-3 text-center"
            data-testid="pitch-free-badge"
          >
            <p className="text-xs tracking-widest text-success">
              [ {pitch.freeBadge} ]
            </p>
            <p className="text-3xl font-bold text-success">{pitch.freePrice}</p>
            <p className="max-w-48 text-xs text-muted">{pitch.freeNote}</p>
          </div>
        </div>

        <div
          role="img"
          aria-label={pitch.flowLabel}
          className="flex flex-col items-stretch md:flex-row md:items-stretch"
        >
          {pitch.steps.map((step, i) => (
            <div key={step.title} className="contents">
              {i > 0 ? <Link index={i} /> : null}
              <div
                className={`pitch-stage ${STAGE_DELAY[i]} flex-1 border border-border p-4 md:basis-0`}
              >
                <p className="text-xs text-muted">
                  <span className="text-accent">{i + 1}</span> / {step.verb}
                </p>
                <p className="mt-1 font-bold text-accent">[ {step.title} ]</p>
                <p className={`pitch-caption ${STAGE_DELAY[i]} mt-2 text-xs text-fg/90`}>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <dl className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
          {pitch.ledger.map((row) => (
            <div key={row.label} className="bg-surface p-3">
              <dt className="text-xs text-muted">{row.label}</dt>
              <dd className="text-success">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-3">
          <code className="border border-accent px-3 py-2 text-xs text-accent">
            $ {pitch.ctaInstall}
          </code>
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="border border-border px-3 py-2 text-xs text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {pitch.ctaRepo} <span className="ml-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
