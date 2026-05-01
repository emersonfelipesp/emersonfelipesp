import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { ProjectHero } from "@/components/project/ProjectHero";
import { FeatureList } from "@/components/project/FeatureList";
import { InstallSnippet } from "@/components/project/InstallSnippet";
import { RepoStatsCard } from "@/components/project/RepoStatsCard";
import { BadgeRow } from "@/components/project/BadgeRow";
import { netboxSdk as p } from "@/content/netbox-sdk";
import { incrementView, readView } from "@/lib/views";

export const metadata = {
  title: `${p.name} ~ NetBox SDK + CLI + TUI`,
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
      <TerminalWindow title={`~/${p.slug}`}>
        <ProjectHero
          banner={p.banner}
          slug={p.slug}
          tagline={p.tagline}
          description={p.description}
        />
        <BadgeRow
          badges={[
            { label: "netbox", value: p.meta.netbox },
            { label: "python", value: p.meta.python },
            { label: "release", value: p.meta.latestRelease },
          ]}
        />
      </TerminalWindow>

      <section className="space-y-3">
        <TypedCommand command="./features --list" cwd={`~/${p.slug}`} />
        <div className="border border-border bg-surface p-5">
          <FeatureList items={p.features} />
        </div>
      </section>

      <section className="space-y-3">
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
        <TypedCommand command="install" cwd={`~/${p.slug}`} />
        <InstallSnippet command={p.install.primary} note={p.install.note} />
      </section>

      <section className="space-y-3">
        <TypedCommand command="repo:stats" cwd={`~/${p.slug}`} />
        <RepoStatsCard fullName={p.fullName} />
      </section>

      <section className="space-y-3">
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

      <p className="text-right text-[10px] text-muted">
        ~/visits → <span className="text-accent">{views}</span>
      </p>
    </div>
  );
}
