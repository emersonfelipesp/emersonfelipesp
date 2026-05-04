import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { ProjectHero } from "@/components/project/ProjectHero";
import { FeatureList } from "@/components/project/FeatureList";
import { InstallSnippet } from "@/components/project/InstallSnippet";
import { InstallSimulator } from "@/components/project/InstallSimulator";
import { DemoInitRunner } from "@/components/project/DemoInitRunner";
import { RepoStatsCard } from "@/components/project/RepoStatsCard";
import { BadgeRow } from "@/components/project/BadgeRow";
import { SectionHeading } from "@/components/project/SectionHeading";
import { SectionNav } from "@/components/nav/SectionNav";
import { SideTOC } from "@/components/nav/SideTOC";
import type { Metadata } from "next";
import { netboxSdk as p } from "@/content/netbox-sdk";
import { getNetboxSdkMeta } from "@/lib/netbox-sdk-meta";

export const metadata: Metadata = {
  title: `${p.name} ~ NetBox SDK + CLI + TUI`,
  description: p.tagline,
};

export default async function Page(): Promise<React.JSX.Element> {
  const liveMeta = await getNetboxSdkMeta();
  const meta = {
    netbox: liveMeta?.netbox ?? p.meta.netbox,
    python: liveMeta?.python ?? p.meta.python,
    latestRelease: liveMeta?.latestRelease ?? p.meta.latestRelease,
  };

  return (
    <div data-palette={p.palette} className="space-y-8">
      <SectionNav sections={p.sections} />
      <SideTOC sections={p.sections} />

      <TerminalWindow title={`~/${p.slug}`}>
        <ProjectHero
          banner={p.banner}
          slug={p.slug}
          tagline={p.tagline}
          description={p.description}
        />
        <BadgeRow
          badges={[
            { label: "netbox", value: meta.netbox },
            { label: "python", value: meta.python },
            { label: "release", value: meta.latestRelease },
          ]}
        />
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
      </TerminalWindow>

      <section className="space-y-3">
        <SectionHeading id="overview">overview</SectionHeading>
        <TypedCommand command="cat OVERVIEW.md" cwd={`~/${p.slug}`} />
        <div className="border border-border bg-surface p-5 text-sm">
          <div className="space-y-3 text-fg/90">
            {p.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="features">features</SectionHeading>
        <TypedCommand command="./features --list" cwd={`~/${p.slug}`} />
        <div className="border border-border bg-surface p-5">
          <FeatureList items={p.features} />
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="stack">stack</SectionHeading>
        <TypedCommand command="cat stack.txt" cwd={`~/${p.slug}`} />
        <div className="border border-border bg-surface p-4 text-sm">
          <ul className="space-y-1">
            {p.stack.map((s) => (
              <li key={s} className="text-fg/90">
                <span className="text-accent">›</span> {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading id="install">install</SectionHeading>
        <TypedCommand command="install" cwd={`~/${p.slug}`} />
        <InstallSnippet command={p.install.primary} note={p.install.note} />
      </section>

      <section className="space-y-3">
        <SectionHeading id="repo">repo</SectionHeading>
        <TypedCommand command="repo:stats" cwd={`~/${p.slug}`} />
        <RepoStatsCard
          fullName={p.fullName}
          stars={p.meta.stars ?? 0}
          forks={p.meta.forks ?? 0}
          language="Python"
          latestRelease={meta.latestRelease}
        />
      </section>

      <section className="space-y-3">
        <SectionHeading id="links">links</SectionHeading>
        <TypedCommand command="links" cwd={`~/${p.slug}`} />
        <ul className="border border-border bg-surface p-4 text-sm">
          {Object.entries(p.links).map(([k, v]) => (
            <li key={k}>
              <span className="text-muted">{k} → </span>
              <a
                href={v}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-2 hover:text-accent"
              >
                {v}
              </a>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}
