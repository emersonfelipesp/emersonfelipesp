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
import { useProjectShellActions } from "@/components/nav/project-shell-labels";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { ProjectContent } from "@/content/types";
import type {
  GitHubReleaseSummary,
  StaticRepoSummary,
} from "@/lib/github";

type Badge = {
  label: string;
  value?: string | number | null;
};

type ProjectLike = Pick<
  ProjectContent,
  | "slug"
  | "name"
  | "fullName"
  | "palette"
  | "banner"
  | "tagline"
  | "description"
  | "sections"
  | "features"
  | "stack"
  | "install"
  | "meta"
  | "links"
>;

type SectionLabels = {
  overview: string;
  features: string;
  stack: string;
  install: string;
  repo: string;
  links: string;
};

export function ProjectNavigation({
  project,
  releases,
  repo,
  showSideToc = true,
}: {
  project: ProjectLike;
  releases?: readonly GitHubReleaseSummary[];
  repo?: StaticRepoSummary | null;
  showSideToc?: boolean;
}) {
  const { t } = useLanguage();
  const actions = t.project.actions;
  const shellActions = useProjectShellActions(project.slug);

  return (
    <>
      <SectionNav
        sections={project.sections}
        releases={releases}
        releasesLabel={actions.releases(project.name)}
        releasesBasePath={`/${project.slug}/releases`}
        releasesAllLabel={t.project.releases.all}
        stars={
          repo
            ? {
                count: repo.stars,
                href: `https://github.com/${project.fullName}/stargazers`,
                label: actions.stars(project.name),
              }
            : undefined
        }
        actions={shellActions}
      />
      {showSideToc ? <SideTOC sections={project.sections} /> : null}
    </>
  );
}

export function ProjectHeroWindow({
  project,
  badges,
  children,
}: {
  project: ProjectLike;
  badges: readonly Badge[];
  children?: React.ReactNode;
}) {
  return (
    <TerminalWindow title={`~/${project.slug}`}>
      <ProjectHero
        banner={project.banner}
        slug={project.slug}
        tagline={project.tagline}
        description={project.description}
      />
      <BadgeRow
        badges={badges
          .filter((badge) => badge.value !== undefined && badge.value !== null)
          .map((badge) => ({ label: badge.label, value: String(badge.value) }))}
      />
      {children}
    </TerminalWindow>
  );
}

export function OverviewSection({
  project,
  sections,
  inlineStack = false,
}: {
  project: ProjectLike;
  sections: SectionLabels;
  inlineStack?: boolean;
}) {
  return (
    <section className="space-y-3">
      <SectionHeading id="overview">{sections.overview}</SectionHeading>
      <TypedCommand command="cat OVERVIEW.md" cwd={`~/${project.slug}`} />
      <div className="border border-border bg-surface p-5 text-sm">
        <div className="space-y-3 text-fg/90">
          {project.description.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {inlineStack ? (
          <div className="mt-4 border-t border-border pt-3 text-xs">
            <p className="text-muted">
              <span className="text-accent">›</span> {sections.stack}
            </p>
            <ul className="mt-1 space-y-1">
              {project.stack.map((s) => (
                <li key={s} className="text-fg/90">
                  <span className="text-accent">·</span> {s}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function FeaturesSection({
  project,
  sections,
}: {
  project: ProjectLike;
  sections: SectionLabels;
}) {
  return (
    <section className="space-y-3">
      <SectionHeading id="features">{sections.features}</SectionHeading>
      <TypedCommand command="./features --list" cwd={`~/${project.slug}`} />
      <div className="border border-border bg-surface p-5">
        <FeatureList items={project.features} />
      </div>
    </section>
  );
}

export function StackSection({
  project,
  sections,
}: {
  project: ProjectLike;
  sections: SectionLabels;
}) {
  return (
    <section className="space-y-3">
      <SectionHeading id="stack">{sections.stack}</SectionHeading>
      <TypedCommand command="cat stack.txt" cwd={`~/${project.slug}`} />
      <div className="border border-border bg-surface p-4 text-sm">
        <ul className="space-y-1">
          {project.stack.map((s) => (
            <li key={s} className="text-fg/90">
              <span className="text-accent">›</span> {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function InstallSection({
  project,
  sections,
  command = "install",
}: {
  project: ProjectLike;
  sections: SectionLabels;
  command?: string;
}) {
  return (
    <section className="space-y-3">
      <SectionHeading id="install">{sections.install}</SectionHeading>
      <TypedCommand command={command} cwd={`~/${project.slug}`} />
      <InstallSnippet
        command={project.install.primary}
        note={project.install.note}
      />
    </section>
  );
}

export function RepoSection({
  project,
  sections,
  repo,
  latestRelease,
  language = "Python",
}: {
  project: ProjectLike;
  sections: SectionLabels;
  repo?: StaticRepoSummary | null;
  latestRelease?: string | null;
  language?: string | null;
}) {
  return (
    <section className="space-y-3">
      <SectionHeading id="repo">{sections.repo}</SectionHeading>
      <TypedCommand command="repo:stats" cwd={`~/${project.slug}`} />
      <RepoStatsCard
        fullName={project.fullName}
        stars={repo?.stars ?? project.meta.stars ?? 0}
        forks={repo?.forks ?? project.meta.forks ?? 0}
        language={language}
        latestRelease={
          latestRelease ?? repo?.latestRelease ?? project.meta.latestRelease
        }
      />
    </section>
  );
}

export function LinksSection({
  project,
  sections,
}: {
  project: ProjectLike;
  sections: SectionLabels;
}) {
  return (
    <section className="space-y-3">
      <SectionHeading id="links">{sections.links}</SectionHeading>
      <TypedCommand command="links" cwd={`~/${project.slug}`} />
      <ul className="border border-border bg-surface p-4 text-sm">
        {Object.entries(project.links).map(([k, v]) => (
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
  );
}

export function SectionDivider({ label }: { label: string }) {
  return (
    <div aria-hidden className="flex items-center gap-3 py-4 text-muted">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
