"use client";

import {
  FeaturesSection,
  InstallSection,
  LinksSection,
  OverviewSection,
  ProjectHeroWindow,
  ProjectNavigation,
  RepoSection,
  StackSection,
} from "@/components/project/ProjectSections";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getNetboxCeph } from "@/lib/i18n/projects";
import type {
  GitHubReleaseSummary,
  StaticRepoSummary,
} from "@/lib/github";

type Props = {
  releases?: readonly GitHubReleaseSummary[];
  repo?: StaticRepoSummary | null;
};

export function NetboxCephContent({
  releases,
  repo,
}: Props = {}): React.JSX.Element {
  const { lang, t } = useLanguage();
  const p = getNetboxCeph(lang);
  const sections = t.project.sections;

  return (
    <div data-palette={p.palette} className="space-y-8">
      <ProjectNavigation project={p} releases={releases} repo={repo} />

      <ProjectHeroWindow
        project={p}
        badges={[
          { label: "license", value: p.meta.license },
          { label: "netbox", value: p.meta.netbox },
          { label: "python", value: p.meta.python },
        ]}
      />

      <OverviewSection project={p} sections={sections} />
      <FeaturesSection project={p} sections={sections} />
      <StackSection project={p} sections={sections} />
      <InstallSection project={p} sections={sections} />
      <RepoSection project={p} sections={sections} repo={repo} />
      <LinksSection project={p} sections={sections} />
    </div>
  );
}
