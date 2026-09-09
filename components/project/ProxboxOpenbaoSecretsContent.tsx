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
import { ProxboxOpenbaoSecretsArchitecture } from "@/components/project/ProxboxOpenbaoSecretsArchitecture";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useProjectShellActions } from "@/components/nav/project-shell-labels";
import { getProxboxOpenbaoSecrets } from "@/lib/i18n/projects";
import type {
  GitHubReleaseSummary,
  StaticRepoSummary,
} from "@/lib/github";

type Props = {
  releases?: readonly GitHubReleaseSummary[];
  repo?: StaticRepoSummary | null;
};

export function ProxboxOpenbaoSecretsContent({
  releases,
  repo,
}: Props = {}): React.JSX.Element {
  const { lang, t } = useLanguage();
  const p = getProxboxOpenbaoSecrets(lang);
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
          command="diagram proxbox-openbao --vms --secrets"
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
        <SectionHeading id="overview">{p.sections[0]?.label ?? "overview"}</SectionHeading>
        <p className="text-sm text-accent">{p.principles.title}</p>
        <FeatureList items={p.principles.bullets} />
      </section>

      <section id="inventory" className="scroll-mt-28 space-y-3">
        <SectionHeading id="inventory">{p.sections[1]?.label ?? "inventory sync"}</SectionHeading>
        <ProxboxOpenbaoSecretsArchitecture diagrams={p.diagrams} lane="inventory" />
      </section>

      <section id="credentials" className="scroll-mt-28 space-y-3">
        <SectionHeading id="credentials">{p.sections[2]?.label ?? "credential write"}</SectionHeading>
        <ProxboxOpenbaoSecretsArchitecture diagrams={p.diagrams} lane="credentials" />
      </section>

      <section id="reveal" className="scroll-mt-28 space-y-3">
        <SectionHeading id="reveal">{p.sections[3]?.label ?? "reveal & access"}</SectionHeading>
        <ProxboxOpenbaoSecretsArchitecture diagrams={p.diagrams} lane="reveal" />
      </section>

      <section id="stack" className="scroll-mt-28 space-y-3">
        <SectionHeading id="stack">{p.sections[4]?.label ?? "security stack"}</SectionHeading>
        <ProxboxOpenbaoSecretsArchitecture diagrams={p.diagrams} lane="stack" />
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
              href={p.links.stackDocs}
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
              href={p.links.architectureDocs}
              className="text-accent hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              netbox-openbao docs/architecture/proxmox-vm-secrets.md
            </a>
          </p>
          <p>
            <span className="text-accent">#</span>{" "}
            <a
              href={p.links.proxboxCompanionDocs}
              className="text-accent hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              netbox-proxbox docs/companion-plugins/netbox-openbao.md
            </a>
          </p>
          <p>
            <span className="text-accent">#</span>{" "}
            <a
              href={p.links.quickAddDocs}
              className="text-accent hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              netbox-openbao docs/quick-add-ssh.md
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
          href={p.links.netboxOpenbao}
          className="block border border-border bg-surface p-4 text-sm group hover:border-accent transition-colors"
        >
          <span className="text-muted">{p.seeAlso.label}</span>
          <span className="text-accent ml-2">›</span>
          <span className="text-accent-2 group-hover:text-accent ml-2">
            {p.seeAlso.netboxOpenbao}
          </span>
        </Link>
        <Link
          href={p.links.netboxProxbox}
          className="block border border-border bg-surface p-4 text-sm group hover:border-accent transition-colors"
        >
          <span className="text-muted">{p.seeAlso.label}</span>
          <span className="text-accent ml-2">›</span>
          <span className="text-accent-2 group-hover:text-accent ml-2">
            {p.seeAlso.netboxProxbox}
          </span>
        </Link>
      </div>
    </div>
  );
}
