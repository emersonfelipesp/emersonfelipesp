"use client";

import { InstallSimulator } from "@/components/project/InstallSimulator";
import { DemoInitRunner } from "@/components/project/DemoInitRunner";
import { DemoDevicesListRunner } from "@/components/project/DemoDevicesListRunner";
import { DemoTuiRunner } from "@/components/project/DemoTuiRunner";
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
import { getNetboxSdk } from "@/lib/i18n/projects";
import type { NetboxSdkMeta } from "@/lib/netbox-sdk-meta";
import type {
  GitHubReleaseSummary,
  StaticRepoSummary,
} from "@/lib/github";

type Props = {
  liveMeta: NetboxSdkMeta | null;
  releases?: readonly GitHubReleaseSummary[];
  repo?: StaticRepoSummary | null;
};

export function NetboxSdkContent({
  liveMeta,
  releases,
  repo,
}: Props): React.JSX.Element {
  const { lang, t } = useLanguage();
  const p = getNetboxSdk(lang);
  const sections = t.project.sections;

  const meta = {
    netbox: liveMeta?.netbox ?? p.meta.netbox,
    python: liveMeta?.python ?? p.meta.python,
    latestRelease: liveMeta?.latestRelease ?? p.meta.latestRelease,
  };

  return (
    <div data-palette={p.palette} className="space-y-8">
      <ProjectNavigation project={p} releases={releases} repo={repo} />

      <ProjectHeroWindow
        project={p}
        badges={[
          { label: "netbox", value: meta.netbox },
          { label: "python", value: meta.python },
          { label: "release", value: meta.latestRelease },
        ]}
      >
        {p.install.runScript ? (
          <div className="mt-4">
            <InstallSimulator
              command={p.install.primary}
              cwd={`~/${p.slug}`}
              steps={p.install.runScript}
            />
          </div>
        ) : null}
        <div className="mt-4">
          <DemoInitRunner />
        </div>
        <div className="mt-4">
          <DemoDevicesListRunner />
        </div>
        <div className="mt-4">
          <DemoTuiRunner />
        </div>
      </ProjectHeroWindow>

      <OverviewSection project={p} sections={sections} />
      <FeaturesSection project={p} sections={sections} />
      <StackSection project={p} sections={sections} />
      <InstallSection project={p} sections={sections} />
      <RepoSection
        project={p}
        sections={sections}
        repo={repo}
        latestRelease={repo?.latestRelease ?? meta.latestRelease}
      />
      <LinksSection project={p} sections={sections} />
    </div>
  );
}
