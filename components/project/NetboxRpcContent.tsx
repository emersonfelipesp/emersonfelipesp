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
  SectionDivider,
  StackSection,
} from "@/components/project/ProjectSections";
import { CodeSnippet } from "@/components/project/CodeSnippet";
import { SectionHeading } from "@/components/project/SectionHeading";
import { FeatureList } from "@/components/project/FeatureList";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getNetboxRpc } from "@/lib/i18n/projects";
import type {
  GitHubReleaseSummary,
  StaticRepoSummary,
} from "@/lib/github";

type Props = {
  releases?: readonly GitHubReleaseSummary[];
  repo?: StaticRepoSummary | null;
};

export function NetboxRpcContent({
  releases,
  repo,
}: Props = {}): React.JSX.Element {
  const { lang, t } = useLanguage();
  const p = getNetboxRpc(lang);
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

      <section id="how-it-works" className="scroll-mt-28">
        <SectionDivider label={`// ${sections["how-it-works"]}`} />
        <SectionHeading id="how-it-works">{p.howItWorks.title}</SectionHeading>
        <div className="space-y-4 text-sm leading-relaxed text-fg/90">
          {p.howItWorks.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-6 overflow-x-auto border border-border">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                {p.howItWorks.splitTable.headers.map((header) => (
                  <th key={header} className="px-4 py-2 font-normal text-accent">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.howItWorks.splitTable.rows.map((row) => (
                <tr key={row[0]} className="border-b border-border/70">
                  <td className="px-4 py-2 text-fg/90">{row[0]}</td>
                  <td className="px-4 py-2 text-muted">{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="security" className="scroll-mt-28">
        <SectionDivider label={`// ${sections.security}`} />
        <SectionHeading id="security">{p.security.title}</SectionHeading>
        <FeatureList items={p.security.bullets} />
      </section>

      <Link
        href="/netbox-rpc/integrations"
        className="block border border-border bg-surface p-4 text-sm group hover:border-accent transition-colors"
      >
        <span className="text-muted">see also</span>
        <span className="text-accent ml-2">›</span>
        <span className="text-accent-2 group-hover:text-accent ml-2">
          Cross-plugin RPC architecture — openbao, proxbox, packer, and more
        </span>
      </Link>

      <section id="ecosystem" className="scroll-mt-28">
        <SectionDivider label={`// ${sections.ecosystem}`} />
        <SectionHeading id="ecosystem">{p.ecosystem.title}</SectionHeading>
        <ul className="space-y-4 text-sm leading-relaxed">
          {p.ecosystem.items.map((item) => (
            <li key={item.name} className="border border-border bg-surface p-4">
              <a
                href={item.href}
                className="text-accent hover:underline"
                target={item.href.startsWith("/") ? undefined : "_blank"}
                rel={item.href.startsWith("/") ? undefined : "noreferrer"}
              >
                {item.name}
              </a>
              <p className="mt-2 text-fg/90">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <StackSection project={p} sections={sections} />
      <InstallSection project={p} sections={sections} />

      <section id="api" className="scroll-mt-28">
        <SectionDivider label={`// ${sections.api}`} />
        <SectionHeading id="api">{p.apiExamples.title}</SectionHeading>
        <p className="mb-4 text-sm leading-relaxed text-fg/90">
          {p.apiExamples.intro}
        </p>
        <div className="space-y-4">
          {p.apiExamples.snippets.map((snippet) => (
            <CodeSnippet
              key={snippet.label}
              label={snippet.label}
              code={snippet.content}
            />
          ))}
        </div>
      </section>

      <RepoSection project={p} sections={sections} repo={repo} />
      <LinksSection project={p} sections={sections} />
    </div>
  );
}

