"use client";

import Link from "next/link";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { ProjectHero } from "@/components/project/ProjectHero";
import { FeatureList } from "@/components/project/FeatureList";
import { InstallSnippet } from "@/components/project/InstallSnippet";
import { RepoStatsCard } from "@/components/project/RepoStatsCard";
import { BadgeRow } from "@/components/project/BadgeRow";
import { SectionHeading } from "@/components/project/SectionHeading";
import { IntegrationsArchitecture } from "@/components/project/IntegrationsArchitecture";
import { ProjectViewTabs } from "@/components/project/ProjectViewTabs";
import { SectionNav } from "@/components/nav/SectionNav";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getProxboxApi } from "@/lib/i18n/projects";
import type { GitHubReleaseSummary } from "@/lib/github";

type Props = {
  releases?: readonly GitHubReleaseSummary[];
  stars?: number | null;
};

export function ProxboxApiContent({
  releases,
  stars,
}: Props = {}): React.JSX.Element {
  const { lang, t } = useLanguage();
  const p = getProxboxApi(lang);
  const sections = t.project.sections;
  const actions = t.project.actions;
  const labels = t.project.proxboxApi;

  return (
    <div data-palette={p.palette} className="space-y-8">
      <SectionNav
        sections={p.sections}
        releases={releases}
        releasesLabel={actions.releases(p.name)}
        releasesBasePath={`/${p.slug}/releases`}
        releasesAllLabel={t.project.releases.all}
        stars={
          stars !== undefined
            ? {
                count: stars,
                href: `https://github.com/${p.fullName}/stargazers`,
                label: actions.stars(p.name),
              }
            : undefined
        }
        actions={[
          {
            icon: "github",
            href: "https://github.com/emersonfelipesp/proxbox-api",
            label: actions.github,
          },
          {
            icon: "pypi",
            href: "https://pypi.org/project/proxbox-api/",
            label: actions.pypi,
          },
          {
            icon: "docker",
            href: "https://hub.docker.com/r/emersonfelipesp/proxbox-api",
            label: actions.docker,
          },
        ]}
      />

      <ProjectViewTabs slug={p.slug} />

      <TerminalWindow title={`~/${p.slug}`}>
        <ProjectHero
          banner={p.banner}
          slug={p.slug}
          tagline={p.tagline}
          description={p.description}
        />
        <BadgeRow
          badges={[
            { label: "license", value: p.meta.license },
            { label: "python", value: p.meta.python },
            { label: "netbox", value: p.meta.netbox },
            { label: "proxmox", value: p.meta.proxmox },
            { label: "release", value: p.meta.latestRelease },
          ]}
        />
      </TerminalWindow>

      <section className="space-y-3">
        <SectionHeading id="overview">{sections.overview}</SectionHeading>
        <TypedCommand command="cat OVERVIEW.md" cwd={`~/${p.slug}`} />
        <div className="border border-border bg-surface p-5 text-sm">
          <div className="space-y-3 text-fg/90">
            {p.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-3 text-xs">
            <p className="text-muted">
              <span className="text-accent">›</span> {sections.stack}
            </p>
            <ul className="mt-1 space-y-1">
              {p.stack.map((s) => (
                <li key={s} className="text-fg/90">
                  <span className="text-accent">·</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="features">{sections.features}</SectionHeading>
        <TypedCommand command="./features --list" cwd={`~/${p.slug}`} />
        <div className="border border-border bg-surface p-5">
          <FeatureList items={p.features} />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading id="integrations">{sections.integrations}</SectionHeading>
        <TypedCommand command="./integrations --map" cwd={`~/${p.slug}`} />
        <p className="text-xs text-muted">
          <span className="text-accent">#</span> {labels.intro}
        </p>

        <IntegrationsArchitecture />

        <div className="space-y-4 pt-2">
          {p.integrations.map((it) => (
            <article
              key={it.id}
              id={`integration-${it.id}`}
              data-toc-step=""
              data-toc-step-title={it.title}
              className="scroll-mt-24 border border-border bg-surface p-5 text-sm"
            >
              <header className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-accent">›</span>
                <h3 className="text-fg">{it.title}</h3>
                <span className="text-xs text-muted">[{it.role}]</span>
              </header>

              <dl className="mb-3 grid gap-1 text-xs text-muted sm:grid-cols-[8rem_1fr]">
                <dt>{labels.transport}</dt>
                <dd className="text-fg/90">{it.transport}</dd>
                <dt>{labels.direction}</dt>
                <dd className="font-mono text-accent-2">{it.direction}</dd>
              </dl>

              <div className="space-y-2 text-fg/90">
                {it.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <ul className="mt-3 space-y-1 text-xs">
                {it.bullets.map((b) => (
                  <li key={b} className="text-fg/90">
                    <span className="text-accent">·</span> {b}
                  </li>
                ))}
              </ul>

              <p className="mt-3 text-xs">
                <Link
                  href={it.href}
                  className="text-accent-2 hover:text-accent"
                >
                  → {labels.viewProject} [{it.id}]
                </Link>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="install">{sections.install}</SectionHeading>
        <TypedCommand command="install" cwd={`~/${p.slug}`} />
        <InstallSnippet command={p.install.primary} note={p.install.note} />
      </section>

      <section className="space-y-3">
        <SectionHeading id="repo">{sections.repo}</SectionHeading>
        <TypedCommand command="repo:stats" cwd={`~/${p.slug}`} />
        <RepoStatsCard
          fullName={p.fullName}
          stars={p.meta.stars ?? 0}
          forks={p.meta.forks ?? 0}
          language="Python"
          latestRelease={p.meta.latestRelease}
        />
      </section>

      <section className="space-y-3">
        <SectionHeading id="links">{sections.links}</SectionHeading>
        <TypedCommand command="links" cwd={`~/${p.slug}`} />
        <ul className="border border-border bg-surface p-4 text-sm">
          {Object.entries(p.links).map(([k, v]) => (
            <li key={k}>
              <span className="text-muted">{k} → </span>
              <a
                href={v}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-2 hover:text-accent"
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
