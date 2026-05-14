"use client";

import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { ProjectHero } from "@/components/project/ProjectHero";
import { SectionNav } from "@/components/nav/SectionNav";
import { SideTOC } from "@/components/nav/SideTOC";
import { useProjectShellActions } from "@/components/nav/project-shell-labels";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  ArchitectureSection,
  CiSection,
  ContributingSection,
  E2eSection,
  IntegrationsSection,
  IntroSection,
  LinksSection,
} from "@/components/project/developer/DeveloperSections";
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
          name={`${data.name} developer guide`}
          slug={data.slug}
          tagline={data.tagline}
          description={data.intro}
        />
      </TerminalWindow>

      <IntroSection data={data} dev={dev} cwd={cwd} />
      <ArchitectureSection data={data} dev={dev} cwd={cwd} />
      <IntegrationsSection data={data} dev={dev} cwd={cwd} />
      <ContributingSection data={data} dev={dev} cwd={cwd} />
      <CiSection data={data} dev={dev} cwd={cwd} />
      <E2eSection data={data} dev={dev} cwd={cwd} />
      <LinksSection data={data} dev={dev} cwd={cwd} />
    </div>
  );
}
