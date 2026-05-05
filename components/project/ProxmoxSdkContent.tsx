"use client";

import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { ProjectHero } from "@/components/project/ProjectHero";
import { FeatureList } from "@/components/project/FeatureList";
import { InstallSnippet } from "@/components/project/InstallSnippet";
import { RepoStatsCard } from "@/components/project/RepoStatsCard";
import { BadgeRow } from "@/components/project/BadgeRow";
import { SectionHeading } from "@/components/project/SectionHeading";
import { SectionNav } from "@/components/nav/SectionNav";
import { SideTOC } from "@/components/nav/SideTOC";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getProxmoxSdk } from "@/lib/i18n/projects";
import type { GitHubRelease } from "@/lib/github";

type Props = {
  releases?: readonly GitHubRelease[];
  stars?: number | null;
};

export function ProxmoxSdkContent({
  releases,
  stars,
}: Props = {}): React.JSX.Element {
  const { lang, t } = useLanguage();
  const p = getProxmoxSdk(lang);
  const sections = t.project.sections;
  const actions = t.project.actions;

  return (
    <div data-palette={p.palette} className="space-y-8">
      <SectionNav
        sections={p.sections}
        releases={releases}
        releasesLabel={actions.releases(p.name)}
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
            href: "https://github.com/emersonfelipesp/proxmox-sdk",
            label: actions.github,
          },
          {
            icon: "pypi",
            href: "https://pypi.org/project/proxmox-sdk/",
            label: actions.pypi,
          },
          {
            icon: "docker",
            href: "https://hub.docker.com/r/emersonfelipesp/proxmox-sdk",
            label: actions.docker,
          },
        ]}
      />
      <SideTOC sections={p.sections} />

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
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="features">{sections.features}</SectionHeading>
        <TypedCommand command="./features --list" cwd={`~/${p.slug}`} />
        <div className="border border-border bg-surface p-5">
          <FeatureList items={p.features} />
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="stack">{sections.stack}</SectionHeading>
        <TypedCommand command="cat stack.txt" cwd={`~/${p.slug}`} />
        <div className="border border-border bg-surface p-4 text-sm">
          <ul className="space-y-1">
            {p.stack.map((s) => (
              <li key={s} className="text-fg/90">
                <span className="text-accent">›</span> {s}
              </li>
            ))}
          </ul>
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
