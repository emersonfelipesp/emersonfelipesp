import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { ProjectHero } from "@/components/project/ProjectHero";
import { FeatureList } from "@/components/project/FeatureList";
import { InstallSnippet } from "@/components/project/InstallSnippet";
import { RepoStatsCard } from "@/components/project/RepoStatsCard";
import { BadgeRow } from "@/components/project/BadgeRow";
import { SectionHeading } from "@/components/project/SectionHeading";
import { StepList } from "@/components/project/StepList";
import { ScreenshotGallery } from "@/components/project/ScreenshotGallery";
import { SectionNav } from "@/components/nav/SectionNav";
import { netboxProxbox as p } from "@/content/netbox-proxbox";
import { incrementView, readView } from "@/lib/views";

export const metadata = {
  title: `${p.name} ~ NetBox + Proxmox sync`,
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
            { label: "netbox", value: p.meta.netbox },
            { label: "python", value: p.meta.python },
            { label: "proxmox", value: p.meta.proxmox },
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
          <div className="mt-4 border-t border-border pt-3 text-xs">
            <p className="text-muted">
              <span className="text-accent">›</span> stack
            </p>
            <ul className="mt-1 space-y-1">
              {p.stack.map((s) => (
                <li key={s} className="text-fg/90">
                  <span className="text-accent">·</span> {s}
                </li>
              ))}
            </ul>
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

      <section className="space-y-4">
        <SectionHeading id="install">install</SectionHeading>
        <TypedCommand command="./install --help" cwd={`~/${p.slug}`} />
        <p className="text-xs text-muted">
          <span className="text-accent">#</span> quick install (PyPI):
        </p>
        <InstallSnippet command={p.install.primary} note={p.install.note} />

        <div className="space-y-6 pt-2">
          <StepList
            title="path A — git / source into a NetBox venv (recommended)"
            steps={p.installation.git}
          />
          <StepList
            title="path B — netbox-docker"
            steps={p.installation.docker}
          />
          <StepList
            title="path C — proxbox-api backend (required)"
            steps={p.installation.backend}
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading id="configure">configure</SectionHeading>
        <TypedCommand command="./configure --endpoints" cwd={`~/${p.slug}`} />
        <p className="text-xs text-muted">
          <span className="text-accent">#</span> Configuration is UI-driven —
          three NetBox endpoint objects + a singleton plugin-settings record.
        </p>
        <div className="space-y-6 pt-2">
          <StepList
            title="endpoints — wire Proxmox, NetBox, and the FastAPI backend"
            steps={p.configuration.endpoints}
          />
          <StepList
            title="plugin settings & sync overwrite flags"
            steps={p.configuration.settings}
          />
        </div>
      </section>

      <div
        aria-hidden
        className="flex items-center gap-3 py-4 text-muted"
      >
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs">{"// screenshots"}</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <section className="space-y-3">
        <SectionHeading id="screenshots">screenshots</SectionHeading>
        <ScreenshotGallery groups={p.screenshots} cwd={`~/${p.slug}`} />
      </section>

      <div
        aria-hidden
        className="flex items-center gap-3 py-4 text-muted"
      >
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs">{"// repo"}</span>
        <span className="h-px flex-1 bg-border" />
      </div>

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
