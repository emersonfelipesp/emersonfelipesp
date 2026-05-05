"use client";

import { TypedCommand } from "@/components/terminal/TypedCommand";
import { InstallSnippet } from "@/components/project/InstallSnippet";
import { SectionHeading } from "@/components/project/SectionHeading";
import { StepList } from "@/components/project/StepList";
import { ScreenshotGallery } from "@/components/project/ScreenshotGallery";
import {
  FeaturesSection,
  LinksSection,
  OverviewSection,
  ProjectHeroWindow,
  ProjectNavigation,
  RepoSection,
  SectionDivider,
} from "@/components/project/ProjectSections";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getNetboxProxbox } from "@/lib/i18n/projects";
import type {
  GitHubReleaseSummary,
  StaticRepoSummary,
} from "@/lib/github";

type Props = {
  releases?: readonly GitHubReleaseSummary[];
  repo?: StaticRepoSummary | null;
};

export function NetboxProxboxContent({
  releases,
  repo,
}: Props = {}): React.JSX.Element {
  const { lang, t } = useLanguage();
  const p = getNetboxProxbox(lang);
  const sections = t.project.sections;
  const proxbox = t.project.proxbox;

  return (
    <div data-palette={p.palette} className="space-y-8">
      <ProjectNavigation project={p} releases={releases} repo={repo} />

      <ProjectHeroWindow
        project={p}
        badges={[
          { label: "license", value: p.meta.license },
          { label: "netbox", value: p.meta.netbox },
          { label: "python", value: p.meta.python },
          { label: "proxmox", value: p.meta.proxmox },
          { label: "release", value: repo?.latestRelease ?? p.meta.latestRelease },
        ]}
      />

      <OverviewSection project={p} sections={sections} inlineStack />
      <FeaturesSection project={p} sections={sections} />

      <section className="space-y-4">
        <SectionHeading id="install">{sections.install}</SectionHeading>
        <TypedCommand command="./install --help" cwd={`~/${p.slug}`} />
        <p
          id="install-quick"
          data-toc-group=""
          data-toc-label={proxbox.quickInstallTocLabel}
          className="scroll-mt-24 text-xs text-muted"
        >
          <span className="text-accent">#</span> {proxbox.quickInstallNote}
        </p>
        <InstallSnippet command={p.install.primary} note={p.install.note} />

        <div className="space-y-6 pt-2">
          <StepList
            title={proxbox.installPathGit}
            steps={p.installation.git}
          />
          <StepList
            title={proxbox.installPathDocker}
            steps={p.installation.docker}
          />
          <StepList
            title={proxbox.installPathBackend}
            steps={p.installation.backend}
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading id="configure">{sections.configure}</SectionHeading>
        <TypedCommand command="./configure --endpoints" cwd={`~/${p.slug}`} />
        <p className="text-xs text-muted">
          <span className="text-accent">#</span> {proxbox.configureIntro}
        </p>
        <div className="space-y-6 pt-2">
          <StepList
            title={proxbox.configureEndpoints}
            steps={p.configuration.endpoints}
          />
          <StepList
            title={proxbox.configureSettings}
            steps={p.configuration.settings}
          />
        </div>
      </section>

      <SectionDivider label={proxbox.screenshotsDivider} />

      <section className="space-y-3">
        <SectionHeading id="screenshots">{sections.screenshots}</SectionHeading>
        <ScreenshotGallery groups={p.screenshots} cwd={`~/${p.slug}`} />
      </section>

      <SectionDivider label={proxbox.repoDivider} />

      <RepoSection project={p} sections={sections} repo={repo} />
      <LinksSection project={p} sections={sections} />
    </div>
  );
}
