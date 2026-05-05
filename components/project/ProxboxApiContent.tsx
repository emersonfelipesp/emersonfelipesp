"use client";

import Link from "next/link";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { SectionHeading } from "@/components/project/SectionHeading";
import { IntegrationsArchitecture } from "@/components/project/IntegrationsArchitecture";
import {
  FeaturesSection,
  InstallSection,
  LinksSection,
  OverviewSection,
  ProjectHeroWindow,
  ProjectNavigation,
  RepoSection,
} from "@/components/project/ProjectSections";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getProxboxApi } from "@/lib/i18n/projects";
import type {
  GitHubReleaseSummary,
  StaticRepoSummary,
} from "@/lib/github";

type Props = {
  releases?: readonly GitHubReleaseSummary[];
  repo?: StaticRepoSummary | null;
};

export function ProxboxApiContent({
  releases,
  repo,
}: Props = {}): React.JSX.Element {
  const { lang, t } = useLanguage();
  const p = getProxboxApi(lang);
  const sections = t.project.sections;
  const labels = t.project.proxboxApi;

  return (
    <div data-palette={p.palette} className="space-y-8">
      <ProjectNavigation
        project={p}
        releases={releases}
        repo={repo}
        showSideToc={false}
      />

      <ProjectHeroWindow
        project={p}
        badges={[
          { label: "license", value: p.meta.license },
          { label: "python", value: p.meta.python },
          { label: "netbox", value: p.meta.netbox },
          { label: "proxmox", value: p.meta.proxmox },
          { label: "release", value: repo?.latestRelease ?? p.meta.latestRelease },
        ]}
      />

      <OverviewSection project={p} sections={sections} inlineStack />
      <FeaturesSection project={p} sections={sections} />

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
                  className="break-words text-accent-2 hover:text-accent"
                >
                  → {labels.viewProject} [{it.id}]
                </Link>
              </p>
            </article>
          ))}
        </div>
      </section>

      <InstallSection project={p} sections={sections} />
      <RepoSection project={p} sections={sections} repo={repo} />
      <LinksSection project={p} sections={sections} />
    </div>
  );
}
