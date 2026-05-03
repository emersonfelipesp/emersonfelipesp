import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { ProjectHero } from "@/components/project/ProjectHero";
import { FeatureList } from "@/components/project/FeatureList";
import { InstallSnippet } from "@/components/project/InstallSnippet";
import { RepoStatsCard } from "@/components/project/RepoStatsCard";
import { BadgeRow } from "@/components/project/BadgeRow";
import { SectionHeading } from "@/components/project/SectionHeading";
import { SectionNav } from "@/components/nav/SectionNav";
import { proxmoxSdk as p } from "@/content/proxmox-sdk";
import { incrementView, readView } from "@/lib/views";

export const metadata = {
  title: `${p.name} ~ Schema-driven Proxmox SDK`,
  description: p.tagline,
};

export const dynamic = "force-dynamic";

export default async function Page() {
  let views = 0;
  try {
    views = await incrementView(`/${p.slug}`);
  } catch {
    views = await readView(`/${p.slug}`).catch(() => 0);
  }

  return (
    <div data-palette={p.palette} className="space-y-8">
      <SectionNav sections={p.sections} />

      <TerminalWindow title={`~/${p.slug}`}>
        <ProjectHero
          banner={p.banner}
          slug={p.slug}
          tagline={p.tagline}
          description={p.description}
        />
        <BadgeRow
          badges={[
            { label: "license", value: p.meta.license },
            { label: "python", value: p.meta.python },
            { label: "release", value: p.meta.latestRelease },
          ]}
        />
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
        <RepoStatsCard fullName={p.fullName} />
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

      <p className="text-right text-xs text-muted">
        ~/visits → <span className="text-accent">{views}</span>
      </p>
    </div>
  );
}
