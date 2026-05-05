"use client";

import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { ProjectHero } from "@/components/project/ProjectHero";
import { SectionHeading } from "@/components/project/SectionHeading";
import { InstallSnippet } from "@/components/project/InstallSnippet";
import { CodeSnippet } from "@/components/project/CodeSnippet";
import { FeatureList } from "@/components/project/FeatureList";
import { SectionNav } from "@/components/nav/SectionNav";
import { SideTOC } from "@/components/nav/SideTOC";
import { useProjectShellActions } from "@/components/nav/project-shell-labels";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getDeveloperContent } from "@/lib/i18n/developer";
import type { DeveloperContent } from "@/content/types";
import { isProjectSlug } from "@/lib/project-shell-meta";
import type {
  GitHubReleaseSummary,
  StaticRepoSummary,
} from "@/lib/github";

type Props = {
  base: DeveloperContent;
  githubUrl?: string;
  releases?: readonly GitHubReleaseSummary[];
  repo?: StaticRepoSummary | null;
};

export function ProjectDeveloperContent({
  base,
  githubUrl,
  releases,
  repo,
}: Props): React.JSX.Element {
  const { lang, t } = useLanguage();
  const data = getDeveloperContent(base, lang);
  const dev = t.project.developer;
  const cwd = `~/${data.slug}/developer`;
  const showSideToc = data.palette !== "mixed";
  const actions = t.project.actions;
  const slug = data.slug;
  const shellActions = useProjectShellActions(
    isProjectSlug(slug) ? slug : "netbox-sdk",
  );
  const useShared = isProjectSlug(slug);

  return (
    <div data-palette={data.palette} className="space-y-8">
      <SectionNav
        sections={data.sections}
        releases={useShared ? releases : undefined}
        releasesLabel={actions.releases(data.name)}
        releasesBasePath={`/${slug}/releases`}
        releasesAllLabel={t.project.releases.all}
        stars={
          useShared && repo
            ? {
                count: repo.stars,
                href: `https://github.com/${data.fullName}/stargazers`,
                label: actions.stars(data.name),
              }
            : undefined
        }
        actions={
          useShared
            ? shellActions
            : githubUrl
              ? [
                  {
                    icon: "github",
                    href: githubUrl,
                    label: t.project.actions.github,
                  },
                ]
              : undefined
        }
      />
      {showSideToc ? <SideTOC sections={data.sections} /> : null}

      <TerminalWindow title={cwd}>
        <ProjectHero
          banner={data.banner}
          slug={data.slug}
          tagline={data.tagline}
          description={data.intro}
        />
      </TerminalWindow>

      <section className="space-y-3">
        <SectionHeading id="intro">{dev.sections.intro}</SectionHeading>
        <TypedCommand command="cat README.md | head" cwd={cwd} />
        <div className="border border-border bg-surface p-5 text-sm">
          <div className="space-y-3 text-fg/90">
            {data.intro.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="architecture">
          {dev.sections.architecture}
        </SectionHeading>
        <TypedCommand command="tree -L 2 src/" cwd={cwd} />
        <div className="border border-border bg-surface p-5">
          <FeatureList items={data.architecture.bullets} />
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="integrations">
          {dev.sections.integrations}
        </SectionHeading>
        <TypedCommand command="./describe-integrations" cwd={cwd} />
        <div className="border border-border bg-surface text-sm">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="px-4 py-2 font-normal">
                  <span className="text-accent">›</span>{" "}
                  {dev.integrations.target}
                </th>
                <th className="px-4 py-2 font-normal">
                  <span className="text-accent">›</span>{" "}
                  {dev.integrations.protocol}
                </th>
                <th className="px-4 py-2 font-normal">
                  <span className="text-accent">›</span>{" "}
                  {dev.integrations.library}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.integrations.map((row, i) => (
                <tr
                  key={`${row.target}-${i}`}
                  className={
                    i < data.integrations.length - 1
                      ? "border-b border-border align-top"
                      : "align-top"
                  }
                >
                  <td className="px-4 py-3 text-fg/90">{row.target}</td>
                  <td className="px-4 py-3 text-fg/90">{row.protocol}</td>
                  <td className="px-4 py-3 text-fg/90">{row.library}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.integrations.some((r) => r.notes) ? (
            <ul className="space-y-1 border-t border-border px-4 py-3 text-xs text-muted">
              {data.integrations.map((row, i) =>
                row.notes ? (
                  <li key={`${row.target}-note-${i}`}>
                    <span className="text-accent">›</span> {row.target}:{" "}
                    {row.notes}
                  </li>
                ) : null,
              )}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="contributing">
          {dev.sections.contributing}
        </SectionHeading>
        <TypedCommand command="./contributing --help" cwd={cwd} />
        <div className="space-y-3">
          <p className="text-xs text-muted">
            <span className="text-accent">#</span>{" "}
            {dev.contributing.devInstall}
          </p>
          <InstallSnippet command={data.contributing.devInstall} />
          <p className="text-xs text-muted">
            <span className="text-accent">#</span>{" "}
            {dev.contributing.checks}
          </p>
          <ul className="space-y-2">
            {data.contributing.checks.map((c) => (
              <li key={c.label} className="space-y-1">
                <p className="text-xs text-muted">› {c.label}</p>
                <CodeSnippet code={c.cmd} label="shell" />
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">
            <span className="text-accent">#</span>{" "}
            {dev.contributing.codeStyle}
          </p>
          <div className="border border-border bg-surface p-5">
            <FeatureList items={data.contributing.codeStyle} />
          </div>
          <p className="text-xs text-muted">
            <span className="text-accent">#</span>{" "}
            {dev.contributing.issues}{" "}
            <a
              href={data.contributing.issuesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-2 hover:text-accent"
            >
              {data.contributing.issuesUrl}
            </a>
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="e2e">{dev.sections.e2e}</SectionHeading>
        <TypedCommand command="./run-e2e --report" cwd={cwd} />
        <div className="space-y-3">
          <div className="border border-border bg-surface p-5 text-sm">
            <p className="text-xs text-muted">
              <span className="text-accent">›</span> {dev.e2e.framework}
            </p>
            <p className="mt-1 text-fg/90">{data.e2e.framework}</p>
          </div>
          <div className="border border-border bg-surface p-5 text-sm">
            <div className="space-y-3 text-fg/90">
              {data.e2e.intro.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted">
            <span className="text-accent">#</span> {dev.e2e.commands}
          </p>
          <ul className="space-y-2">
            {data.e2e.commands.map((c) => (
              <li key={c.label} className="space-y-1">
                <p className="text-xs text-muted">› {c.label}</p>
                <CodeSnippet code={c.cmd} label="shell" />
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">
            <span className="text-accent">#</span> {dev.e2e.coverage}
          </p>
          <div className="border border-border bg-surface p-5">
            <FeatureList items={data.e2e.coverage} />
          </div>
          {data.e2e.ciWorkflow ? (
            <p className="text-xs text-muted">
              <span className="text-accent">›</span> {dev.e2e.ci}:{" "}
              {data.e2e.ciWorkflowUrl ? (
                <a
                  href={data.e2e.ciWorkflowUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-2 hover:text-accent"
                >
                  {data.e2e.ciWorkflow}
                </a>
              ) : (
                <span className="text-fg/90">{data.e2e.ciWorkflow}</span>
              )}
            </p>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="links">{dev.sections.links}</SectionHeading>
        <TypedCommand command="links" cwd={cwd} />
        <ul className="border border-border bg-surface p-4 text-sm">
          {Object.entries(data.links).map(([k, v]) => (
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
