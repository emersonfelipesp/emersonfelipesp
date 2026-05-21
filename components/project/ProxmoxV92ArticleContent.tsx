"use client";

import Link from "next/link";
import { SectionNav } from "@/components/nav/SectionNav";
import { SideTOC } from "@/components/nav/SideTOC";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { AsciiBanner } from "@/components/terminal/AsciiBanner";
import { SectionHeading } from "@/components/project/SectionHeading";
import { CodeSnippet } from "@/components/project/CodeSnippet";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useProjectShellActions } from "@/components/nav/project-shell-labels";
import { getProxmoxPve92 } from "@/lib/i18n/projects";
import type { ArticleContent } from "@/content/types";
import type { GitHubReleaseSummary, StaticRepoSummary } from "@/lib/github";

type Props = {
  base: ArticleContent;
  releases?: readonly GitHubReleaseSummary[];
  repo?: StaticRepoSummary | null;
};

export function ProxmoxV92ArticleContent({
  base,
  releases,
  repo,
}: Props): React.JSX.Element {
  const { lang, t } = useLanguage();
  const p = getProxmoxPve92(lang, base);
  const actions = t.project.actions;
  const shellActions = useProjectShellActions(p.slug);
  const cwd = `~/${p.slug}/proxmox-v9.2-support`;

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

      <TerminalWindow title={cwd}>
        <AsciiBanner art={p.banner} />
        <TypedCommand
          command={`cat proxmox-v9.2-support.md`}
          cwd={cwd}
        />
        <div className="mt-4 space-y-1 text-xs text-muted">
          <span className="text-accent">[</span>
          <span>published</span>
          <span className="text-accent ml-1">=</span>
          <span className="text-success ml-1">{p.published}</span>
          <span className="text-accent ml-1">]</span>
          <span className="ml-3 text-accent">[</span>
          <span>sdk</span>
          <span className="text-accent ml-1">=</span>
          <span className="text-success ml-1">v0.0.6</span>
          <span className="text-accent ml-1">]</span>
          <span className="ml-3 text-accent">[</span>
          <span>pve</span>
          <span className="text-accent ml-1">=</span>
          <span className="text-success ml-1">9.2</span>
          <span className="text-accent ml-1">]</span>
        </div>
        <div className="mt-4 border border-border bg-bg p-4 text-sm">
          <p className="text-accent mb-1 text-xs"># {p.tagline}</p>
          <div className="space-y-3 text-fg/90">
            {p.intro.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </div>
      </TerminalWindow>

      {p.highlights.map((section) => (
        <section key={section.id} className="space-y-3">
          <SectionHeading id={section.id}>{section.heading}</SectionHeading>
          <TypedCommand
            command={`grep -n "${section.id}" proxmox-v9.2-support.md`}
            cwd={cwd}
          />
          <div className="border border-border bg-surface p-5 text-sm">
            <div className="space-y-3 text-fg/90">
              {section.body.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>
          {section.code ? (
            <CodeSnippet
              code={section.code.content}
              label={section.code.label ?? section.code.lang}
            />
          ) : null}
        </section>
      ))}

      <div className="space-y-2 pt-2">
        {Object.entries(p.links).map(([key, href]) => (
          <div key={key} className="text-sm">
            <span className="text-muted">[{key}]</span>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-accent hover:underline"
            >
              {href}
            </a>
          </div>
        ))}
      </div>

      <Link
        href={`/${p.slug}`}
        className="block border border-border bg-surface p-4 text-sm group hover:border-accent transition-colors"
      >
        <span className="text-accent">‹</span>
        <span className="text-accent-2 group-hover:text-accent ml-2">
          back to {p.name}
        </span>
      </Link>
    </div>
  );
}
