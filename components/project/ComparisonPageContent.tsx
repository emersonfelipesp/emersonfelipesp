"use client";

import { SectionNav } from "@/components/nav/SectionNav";
import { SideTOC } from "@/components/nav/SideTOC";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { AsciiBanner } from "@/components/terminal/AsciiBanner";
import { OutputBlock } from "@/components/terminal/OutputBlock";
import { SectionHeading } from "@/components/project/SectionHeading";
import { CodeSnippet } from "@/components/project/CodeSnippet";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useProjectShellActions } from "@/components/nav/project-shell-labels";
import type { ComparisonContent } from "@/content/types";
import type { Lang } from "@/lib/i18n/languages";
import type { GitHubReleaseSummary, StaticRepoSummary } from "@/lib/github";

type Props = {
  base: ComparisonContent;
  comparisonSlug: string;
  localize: (lang: Lang, base: ComparisonContent) => ComparisonContent;
  releases?: readonly GitHubReleaseSummary[];
  repo?: StaticRepoSummary | null;
};

export function ComparisonPageContent({
  base,
  comparisonSlug,
  localize,
  releases,
  repo,
}: Props) {
  const { lang, t } = useLanguage();
  const p = localize(lang, base);
  const actions = t.project.actions;
  const shellActions = useProjectShellActions(p.slug);

  return (
    <div data-palette={p.palette} className="space-y-8">
      <SectionNav
        sections={p.sections}
        releases={releases}
        releasesLabel={actions.releases(p.slug)}
        releasesBasePath={`/${p.slug}/releases`}
        releasesAllLabel={t.project.releases.all}
        stars={
          repo
            ? {
                count: repo.stars,
                href: `https://github.com/${p.fullName}/stargazers`,
                label: actions.stars(p.slug),
              }
            : undefined
        }
        actions={shellActions}
      />
      <SideTOC sections={p.sections} />

      <TerminalWindow title={`~/${p.slug}/${comparisonSlug}`}>
        <AsciiBanner art={p.banner} />
        <TypedCommand
          command={`diff ${p.libraryA.name} ${p.libraryB.name}`}
          cwd={`~/${p.slug}`}
        />
        <OutputBlock>
          <h1 className="text-base font-normal text-accent">{p.name}</h1>
          <p className="mt-1 text-base text-accent-2">{p.tagline}</p>
          <div className="mt-3 space-y-2 text-sm text-fg/90">
            {p.intro.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </OutputBlock>
      </TerminalWindow>

      <section className="space-y-3">
        <SectionHeading id="libraries">libraries</SectionHeading>
        <TypedCommand command="cat libraries.md" cwd={`~/${p.slug}`} />
        <div className="grid gap-4 sm:grid-cols-2">
          {([p.libraryA, p.libraryB] as const).map((lib) => (
            <div
              key={lib.name}
              className="border border-border bg-surface p-5 text-sm"
            >
              <p className="text-accent font-normal">{lib.name}</p>
              <div className="mt-3 space-y-2 text-fg/90">
                {lib.description.map((d) => (
                  <p key={d}>{d}</p>
                ))}
              </div>
              <div className="mt-4 border-t border-border pt-3">
                <p className="text-xs text-muted mb-2">best for</p>
                <ul className="space-y-1">
                  {lib.bestFor.map((item) => (
                    <li key={item} className="text-xs text-fg/80">
                      <span className="text-accent-2 mr-1">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="comparison">comparison</SectionHeading>
        <TypedCommand
          command={`./compare.sh ${p.libraryA.name} ${p.libraryB.name}`}
          cwd={`~/${p.slug}`}
        />
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                <th className="px-4 py-2 text-left text-xs text-muted font-normal w-1/3">
                  aspect
                </th>
                <th className="px-4 py-2 text-left text-xs text-accent font-normal w-1/3">
                  {p.libraryA.name}
                </th>
                <th className="px-4 py-2 text-left text-xs text-accent-2 font-normal w-1/3">
                  {p.libraryB.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {p.table.map((row, i) => (
                <tr
                  key={row.aspect}
                  className={`border-b border-border ${i % 2 === 0 ? "bg-bg" : "bg-surface"}`}
                >
                  <td className="px-4 py-2 text-xs text-muted">{row.aspect}</td>
                  <td
                    className={`px-4 py-2 text-xs ${
                      row.winner === "a" ? "text-success" : "text-fg/80"
                    }`}
                  >
                    {row.a}
                  </td>
                  <td
                    className={`px-4 py-2 text-xs ${
                      row.winner === "b" ? "text-success" : "text-fg/80"
                    }`}
                  >
                    {row.b}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="when-to-choose">when to choose</SectionHeading>
        <TypedCommand command="./recommend.sh" cwd={`~/${p.slug}`} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border border-border bg-surface p-5 text-sm">
            <p className="text-accent font-normal mb-3">
              use {p.libraryA.name} when
            </p>
            <ul className="space-y-1">
              {p.libraryA.bestFor.map((item) => (
                <li key={item} className="text-xs text-fg/80">
                  <span className="text-accent mr-1">›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-border bg-surface p-5 text-sm">
            <p className="text-accent-2 font-normal mb-3">
              use {p.libraryB.name} when
            </p>
            <ul className="space-y-1">
              {p.libraryB.bestFor.map((item) => (
                <li key={item} className="text-xs text-fg/80">
                  <span className="text-accent-2 mr-1">›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border border-border bg-surface p-5 text-sm space-y-3 text-fg/90">
          {p.verdict.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="install">install</SectionHeading>
        <TypedCommand command="pip install" cwd={`~/${p.slug}`} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs text-accent px-1">{p.libraryA.name}</p>
            <CodeSnippet code={p.install.a} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-accent-2 px-1">{p.libraryB.name}</p>
            <CodeSnippet code={p.install.b} />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="links">links</SectionHeading>
        <TypedCommand command="links" cwd={`~/${p.slug}`} />
        <ul className="border border-border bg-surface p-4 text-sm space-y-1">
          {Object.entries(p.links).map(([k, v]) => (
            <li key={k}>
              <span className="text-muted">{k} → </span>
              <a
                href={v}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-accent-2 hover:text-accent"
              >
                {v}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
