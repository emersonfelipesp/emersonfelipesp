"use client";

import Link from "next/link";
import { SectionNav } from "@/components/nav/SectionNav";
import { SideTOC } from "@/components/nav/SideTOC";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { AsciiBanner } from "@/components/terminal/AsciiBanner";
import { OutputBlock } from "@/components/terminal/OutputBlock";
import { SectionHeading } from "@/components/project/SectionHeading";
import { FeatureList } from "@/components/project/FeatureList";
import { NetboxRpcIntegrationsArchitecture } from "@/components/project/NetboxRpcIntegrationsArchitecture";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useProjectShellActions } from "@/components/nav/project-shell-labels";
import { getNetboxRpcIntegrations } from "@/lib/i18n/projects";
import type {
  GitHubReleaseSummary,
  StaticRepoSummary,
} from "@/lib/github";

type Props = {
  releases?: readonly GitHubReleaseSummary[];
  repo?: StaticRepoSummary | null;
};

export function NetboxRpcIntegrationsContent({
  releases,
  repo,
}: Props = {}): React.JSX.Element {
  const { lang, t } = useLanguage();
  const p = getNetboxRpcIntegrations(lang);
  const actions = t.project.actions;
  const shellActions = useProjectShellActions(p.slug);

  return (
    <div data-palette={p.palette} className="space-y-8">
      <SectionNav
        sections={p.sections}
        releases={releases}
        releasesLabel={actions.releases(p.slug)}
        releasesBasePath={`/${p.slug}/releases`}
        releasesAllLabel={t.project.releases.all}
        stars={
          repo
            ? {
                count: repo.stars,
                href: `https://github.com/${p.fullName}/stargazers`,
                label: actions.stars(p.slug),
              }
            : undefined
        }
        actions={shellActions}
      />
      <SideTOC sections={p.sections} />

      <TerminalWindow title={`~/${p.slug}/${p.pageSlug}`}>
        <AsciiBanner art={p.banner} />
        <TypedCommand
          command="diagram netbox-rpc --integrations --cross-plugin"
          cwd={`~/${p.slug}`}
        />
        <OutputBlock>
          <h1 className="text-base font-normal text-accent">{p.name}</h1>
          <p className="mt-1 text-base text-accent-2">{p.tagline}</p>
          <div className="mt-3 space-y-2 text-sm text-fg/90">
            {p.intro.map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>
        </OutputBlock>
      </TerminalWindow>

      <section id="overview" className="scroll-mt-28 space-y-4">
        <SectionHeading id="overview">
          {p.sections[0]?.label ?? "overview"}
        </SectionHeading>
        <p className="text-sm text-accent">{p.principles.title}</p>
        <FeatureList items={p.principles.bullets} />
      </section>

      <section id="dispatch" className="scroll-mt-28 space-y-3">
        <SectionHeading id="dispatch">
          {p.sections[1]?.label ?? "dispatch lane"}
        </SectionHeading>
        <NetboxRpcIntegrationsArchitecture diagrams={p.diagrams} lane="dispatch" />
      </section>

      <section id="credentials" className="scroll-mt-28 space-y-3">
        <SectionHeading id="credentials">
          {p.sections[2]?.label ?? "credential lane"}
        </SectionHeading>
        <NetboxRpcIntegrationsArchitecture
          diagrams={p.diagrams}
          lane="credentials"
        />
      </section>

      <section id="integrations" className="scroll-mt-28 space-y-4">
        <SectionHeading id="integrations">
          {p.sections[3]?.label ?? "plugin map"}
        </SectionHeading>
        <NetboxRpcIntegrationsArchitecture diagrams={p.diagrams} lane="map" />
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                {p.integrationsTable.headers.map((header) => (
                  <th key={header} className="px-4 py-2 font-normal text-accent">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.integrationsTable.rows.map((row) => (
                <tr key={row[0]} className="border-b border-border/70">
                  <td className="px-4 py-2 text-fg/90">{row[0]}</td>
                  <td className="px-4 py-2 text-muted">{row[1]}</td>
                  <td className="px-4 py-2 text-muted">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-28 space-y-4">
        <SectionHeading id="boundary">{p.boundary.title}</SectionHeading>
        <div className="space-y-3 text-sm leading-relaxed text-fg/90">
          {p.boundary.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
        <div className="space-y-1 text-xs text-muted">
          <p>
            <span className="text-accent">#</span>{" "}
            <a
              href={p.links.architectureDocs}
              className="text-accent hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              netbox-rpc docs/cross-plugin-integrations.md
            </a>
          </p>
          <p>
            <span className="text-accent">#</span>{" "}
            <a
              href={p.links.openbaoStackDocs}
              className="text-accent hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              netbox-openbao docs/architecture/openbao-broker-rpc.md
            </a>
          </p>
          <p>
            <span className="text-accent">#</span>{" "}
            <a
              href={p.links.proxboxRpcDocs}
              className="text-accent hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              netbox-proxbox docs/companion-plugins/netbox-rpc.md
            </a>
          </p>
        </div>
      </section>

      <section id="workflow" className="scroll-mt-28 space-y-4">
        <SectionHeading id="workflow">{p.workflow.title}</SectionHeading>
        <ol className="list-decimal space-y-2 border border-border bg-surface p-4 pl-8 text-sm leading-relaxed text-fg/90">
          {p.workflow.steps.map((step) => (
            <li key={step.slice(0, 48)}>{step}</li>
          ))}
        </ol>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href={p.links.netboxRpc}
          className="block border border-border bg-surface p-4 text-sm group hover:border-accent transition-colors"
        >
          <span className="text-muted">{p.seeAlso.label}</span>
          <span className="text-accent ml-2">›</span>
          <span className="text-accent-2 group-hover:text-accent ml-2">
            {p.seeAlso.netboxRpc}
          </span>
        </Link>
        <Link
          href={p.links.proxmoxSecrets}
          className="block border border-border bg-surface p-4 text-sm group hover:border-accent transition-colors"
        >
          <span className="text-muted">{p.seeAlso.label}</span>
          <span className="text-accent ml-2">›</span>
          <span className="text-accent-2 group-hover:text-accent ml-2">
            {p.seeAlso.proxmoxSecrets}
          </span>
        </Link>
      </div>
    </div>
  );
}

