"use client";

import { TypedCommand } from "@/components/terminal/TypedCommand";
import { SectionHeading } from "@/components/project/SectionHeading";
import { InstallSnippet } from "@/components/project/InstallSnippet";
import { CodeSnippet } from "@/components/project/CodeSnippet";
import { FeatureList } from "@/components/project/FeatureList";
import type { DeveloperContent } from "@/content/types";
import type { Dictionary } from "@/lib/i18n/dictionary";

type DeveloperLabels = Dictionary["project"]["developer"];

type DeveloperSectionProps = {
  data: DeveloperContent;
  dev: DeveloperLabels;
  cwd: string;
};

export function IntroSection({
  data,
  dev,
  cwd,
}: DeveloperSectionProps): React.JSX.Element {
  return (
    <section className="space-y-3">
      <SectionHeading id="intro">{dev.sections.intro}</SectionHeading>
      <TypedCommand command="cat README.md | head" cwd={cwd} />
      <div className="border border-border bg-surface p-5 text-sm">
        <div className="space-y-3 text-fg/90">
          {data.intro.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ArchitectureSection({
  data,
  dev,
  cwd,
}: DeveloperSectionProps): React.JSX.Element {
  return (
    <section className="space-y-3">
      <SectionHeading id="architecture">
        {dev.sections.architecture}
      </SectionHeading>
      <TypedCommand command="tree -L 2 src/" cwd={cwd} />
      <div className="border border-border bg-surface p-5">
        <FeatureList items={data.architecture.bullets} />
      </div>
    </section>
  );
}

export function IntegrationsSection({
  data,
  dev,
  cwd,
}: DeveloperSectionProps): React.JSX.Element {
  return (
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
            {data.integrations.map((row, index) => (
              <tr
                key={`${row.target}-${row.protocol}-${row.library}`}
                className={
                  index < data.integrations.length - 1
                    ? "border-b border-border align-top"
                    : "align-top"
                }
              >
                <td className="break-words px-4 py-3 text-fg/90">
                  {row.target}
                </td>
                <td className="break-words px-4 py-3 text-fg/90">
                  {row.protocol}
                </td>
                <td className="break-words px-4 py-3 text-fg/90">
                  {row.library}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.integrations.some((row) => row.notes) ? (
          <ul className="space-y-1 border-t border-border px-4 py-3 text-xs text-muted">
            {data.integrations.flatMap((row) =>
              row.notes
                ? [
                    <li key={`${row.target}-note`}>
                      <span className="text-accent">›</span> {row.target}:{" "}
                      {row.notes}
                    </li>,
                  ]
                : [],
            )}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

export function ContributingSection({
  data,
  dev,
  cwd,
}: DeveloperSectionProps): React.JSX.Element {
  return (
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
          <span className="text-accent">#</span> {dev.contributing.checks}
        </p>
        <ul className="space-y-2">
          {data.contributing.checks.map((check) => (
            <li key={check.label} className="space-y-1">
              <p className="text-xs text-muted">› {check.label}</p>
              <CodeSnippet code={check.cmd} label="shell" />
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
          <span className="text-accent">#</span> {dev.contributing.issues}{" "}
          <a
            href={data.contributing.issuesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-accent-2 hover:text-accent"
          >
            {data.contributing.issuesUrl}
          </a>
        </p>
      </div>
    </section>
  );
}

export function CiSection({
  data,
  dev,
  cwd,
}: DeveloperSectionProps): React.JSX.Element | null {
  if (!data.ci) return null;

  return (
    <section className="space-y-3">
      <SectionHeading id="ci">{dev.sections.ci}</SectionHeading>
      <TypedCommand command="gh workflow list" cwd={cwd} />
      <div className="space-y-3">
        <div className="border border-border bg-surface p-5 text-sm">
          <div className="space-y-3 text-fg/90">
            {data.ci.intro.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted">
          <span className="text-accent">#</span> {dev.ci.workflows}
        </p>
        <div className="overflow-x-auto border border-border bg-surface text-sm">
          <table className="w-full min-w-[680px] table-fixed border-collapse">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="w-1/4 px-4 py-2 font-normal">
                  <span className="text-accent">›</span> {dev.ci.name}
                </th>
                <th className="w-1/4 px-4 py-2 font-normal">
                  <span className="text-accent">›</span> {dev.ci.trigger}
                </th>
                <th className="px-4 py-2 font-normal">
                  <span className="text-accent">›</span> {dev.ci.purpose}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.ci.workflows.map((row, index) => (
                <tr
                  key={`${row.name}-${row.trigger}`}
                  className={
                    index < (data.ci?.workflows.length ?? 0) - 1
                      ? "border-b border-border align-top"
                      : "align-top"
                  }
                >
                  <td className="break-words px-4 py-3 font-mono text-xs text-accent-2">
                    {row.name}
                  </td>
                  <td className="break-words px-4 py-3 text-fg/90">
                    {row.trigger}
                  </td>
                  <td className="break-words px-4 py-3 text-fg/90">
                    {row.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.ci.notes?.length ? (
          <>
            <p className="text-xs text-muted">
              <span className="text-accent">#</span> {dev.ci.notes}
            </p>
            <div className="border border-border bg-surface p-5">
              <FeatureList items={data.ci.notes} />
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

export function E2eSection({
  data,
  dev,
  cwd,
}: DeveloperSectionProps): React.JSX.Element {
  return (
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
            {data.e2e.intro.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted">
          <span className="text-accent">#</span> {dev.e2e.commands}
        </p>
        <ul className="space-y-2">
          {data.e2e.commands.map((check) => (
            <li key={check.label} className="space-y-1">
              <p className="text-xs text-muted">› {check.label}</p>
              <CodeSnippet code={check.cmd} label="shell" />
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
  );
}

export function LinksSection({
  data,
  dev,
  cwd,
}: DeveloperSectionProps): React.JSX.Element {
  return (
    <section className="space-y-3">
      <SectionHeading id="links">{dev.sections.links}</SectionHeading>
      <TypedCommand command="links" cwd={cwd} />
      <ul className="border border-border bg-surface p-4 text-sm">
        {Object.entries(data.links).map(([label, href]) => (
          <li key={label}>
            <span className="text-muted">{label} → </span>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-accent-2 hover:text-accent"
            >
              {href}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
