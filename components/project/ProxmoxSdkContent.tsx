"use client";

import Link from "next/link";
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
import { getProxmoxSdk } from "@/lib/i18n/projects";
import type {
  GitHubReleaseSummary,
  StaticRepoSummary,
} from "@/lib/github";

type Props = {
  releases?: readonly GitHubReleaseSummary[];
  repo?: StaticRepoSummary | null;
};

export function ProxmoxSdkContent({
  releases,
  repo,
}: Props = {}): React.JSX.Element {
  const { lang, t } = useLanguage();
  const p = getProxmoxSdk(lang);
  const sections = t.project.sections;

  return (
    <div data-palette={p.palette} className="space-y-8">
      <ProjectNavigation project={p} releases={releases} repo={repo} />

      <ProjectHeroWindow
        project={p}
        badges={[
          { label: "license", value: p.meta.license },
          { label: "python", value: p.meta.python },
          { label: "release", value: repo?.latestRelease ?? p.meta.latestRelease },
        ]}
      />

      <OverviewSection project={p} sections={sections} />
      <FeaturesSection project={p} sections={sections} />
      <StackSection project={p} sections={sections} />
      <InstallSection project={p} sections={sections} />
      <RepoSection project={p} sections={sections} repo={repo} />
      <LinksSection project={p} sections={sections} />
      <Link
        href="/proxmox-sdk/proxmoxer-comparison"
        className="block border border-border bg-surface p-4 text-sm group hover:border-accent transition-colors"
      >
        <span className="text-muted">see also</span>
        <span className="text-accent ml-2">›</span>
        <span className="text-accent-2 group-hover:text-accent ml-2">
          proxmoxer vs proxmox-sdk — comparison table
        </span>
      </Link>
    </div>
  );
}
