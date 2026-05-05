"use client";

import Link from "next/link";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { BadgeRow } from "@/components/project/BadgeRow";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  releaseDetailPath,
  releaseListPath,
  type ReleaseProject,
} from "@/lib/release-projects";
import type { GitHubRelease, GitHubSnapshot } from "@/lib/github";

type ListProps = {
  project: ReleaseProject;
  snapshot: GitHubSnapshot;
};

type DetailProps = {
  project: ReleaseProject;
  snapshot: GitHubSnapshot;
  release: GitHubRelease;
};

function formatDate(iso: string | null): string {
  if (!iso) return "n/a";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "n/a";
  return date.toISOString().slice(0, 10);
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "n/a";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "n/a";
  return `${date.toISOString().replace("T", " ").slice(0, 16)} UTC`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let size = bytes / 1024;
  let unit = units[0];
  for (let i = 1; i < units.length && size >= 1024; i += 1) {
    size /= 1024;
    unit = units[i];
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${unit}`;
}

function releaseState(release: GitHubRelease, labels: {
  latest: string;
  prerelease: string;
  stable: string;
}): string {
  if (release.latest) return labels.latest;
  if (release.prerelease) return labels.prerelease;
  return labels.stable;
}

function totalDownloads(release: GitHubRelease): number {
  return release.assets.reduce(
    (total, asset) => total + asset.downloadCount,
    0,
  );
}

export function ReleaseListContent({
  project,
  snapshot,
}: ListProps): React.JSX.Element {
  const { t } = useLanguage();
  const labels = t.project.releases;

  return (
    <div data-palette={project.palette} className="space-y-8">
      <TerminalWindow title={`~/${project.slug}/releases`}>
        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <TypedCommand
                command={`gh release list --repo ${project.fullName}`}
                cwd={`~/${project.slug}`}
              />
              <h1 className="text-xl text-accent sm:text-2xl">
                {project.name} {labels.heading}
              </h1>
              <p className="max-w-3xl text-sm text-fg/90">
                {project.tagline}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link
                href={project.projectPath}
                className="border border-border bg-surface-2 px-3 py-2 text-muted transition-colors duration-150 hover:bg-accent/15 hover:text-accent"
              >
                [{labels.backToProject}]
              </Link>
              <a
                href={project.releasesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border bg-surface-2 px-3 py-2 text-muted transition-colors duration-150 hover:bg-accent/15 hover:text-accent"
              >
                [{labels.openOnGitHub}]
              </a>
            </div>
          </div>

          <BadgeRow
            badges={[
              { label: "repo", value: project.fullName },
              { label: "count", value: labels.releaseCount(snapshot.releases.length) },
              { label: labels.synced, value: formatDateTime(snapshot.syncedAt) },
              {
                label: "stars",
                value:
                  typeof snapshot.stars === "number"
                    ? String(snapshot.stars)
                    : "n/a",
              },
            ]}
          />
        </div>
      </TerminalWindow>

      <section className="space-y-3">
        {snapshot.releases.length === 0 ? (
          <div className="border border-border bg-surface p-5 text-sm text-muted">
            {labels.noReleases}
          </div>
        ) : (
          <div className="space-y-3">
            {snapshot.releases.map((release) => (
              <article
                key={release.id}
                className="border border-border bg-surface p-4 transition-colors duration-150 hover:border-accent hover:bg-surface-2"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <Link
                      href={releaseDetailPath(project.slug, release.tag)}
                      className="text-base text-accent hover:text-accent-2"
                    >
                      {release.name}
                    </Link>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                      <span className="tabular-nums">{release.tag}</span>
                      <span>
                        {labels.published}:{" "}
                        <span className="tabular-nums">
                          {formatDate(release.publishedAt)}
                        </span>
                      </span>
                      <span>[{releaseState(release, labels)}]</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted">
                    <div>
                      {labels.assets}:{" "}
                      <span className="tabular-nums">
                        {release.assets.length}
                      </span>
                    </div>
                    <div>
                      {labels.downloads}:{" "}
                      <span className="tabular-nums">
                        {totalDownloads(release)}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function ReleaseDetailContent({
  project,
  snapshot,
  release,
}: DetailProps): React.JSX.Element {
  const { t } = useLanguage();
  const labels = t.project.releases;

  return (
    <div data-palette={project.palette} className="space-y-8">
      <TerminalWindow title={`~/${project.slug}/releases/${release.tag}`}>
        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <TypedCommand
                command={`gh release view ${release.tag} --repo ${project.fullName}`}
                cwd={`~/${project.slug}`}
              />
              <p className="text-xs text-muted">
                <Link
                  href={releaseListPath(project.slug)}
                  className="hover:text-accent"
                >
                  {labels.backToReleases}
                </Link>
                <span> / </span>
                <Link href={project.projectPath} className="hover:text-accent">
                  {labels.backToProject}
                </Link>
              </p>
              <h1 className="text-xl text-accent sm:text-2xl">
                {release.name}
              </h1>
            </div>
            <a
              href={release.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border bg-surface-2 px-3 py-2 text-xs text-muted transition-colors duration-150 hover:bg-accent/15 hover:text-accent"
            >
              [{labels.openOnGitHub}]
            </a>
          </div>

          <BadgeRow
            badges={[
              { label: "tag", value: release.tag },
              { label: "state", value: releaseState(release, labels) },
              { label: labels.published, value: formatDate(release.publishedAt) },
              { label: labels.synced, value: formatDateTime(snapshot.syncedAt) },
            ]}
          />

          <dl className="grid gap-2 border border-border bg-surface-2 p-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
            <Meta label={labels.author} value={release.author?.login ?? "n/a"} />
            <Meta label={labels.created} value={formatDateTime(release.createdAt)} />
            <Meta label={labels.target} value={release.targetCommitish ?? "n/a"} />
            <Meta
              label={labels.downloads}
              value={String(totalDownloads(release))}
            />
          </dl>
        </div>
      </TerminalWindow>

      <section className="space-y-3">
        <TypedCommand command="cat RELEASE_NOTES.md" cwd={`~/${project.slug}`} />
        <div className="border border-border bg-surface p-5">
          {release.bodyHtml ? (
            <div
              className="release-markdown"
              dangerouslySetInnerHTML={{ __html: release.bodyHtml }}
            />
          ) : (
            <p className="text-sm text-muted">{labels.noNotes}</p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <TypedCommand command="gh release download --pattern '*'" cwd={`~/${project.slug}`} />
        <div className="border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm text-accent">{labels.assets}</h2>
          {release.assets.length === 0 ? (
            <p className="text-sm text-muted">{labels.noAssets}</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {release.assets.map((asset) => (
                <li
                  key={asset.id}
                  className="flex flex-wrap items-center justify-between gap-3 border border-border bg-surface-2 px-3 py-2"
                >
                  <a
                    href={asset.browserDownloadUrl}
                    className="text-accent-2 hover:text-accent"
                  >
                    {asset.name}
                  </a>
                  <span className="text-xs text-muted">
                    {formatBytes(asset.size)} · {labels.downloads}:{" "}
                    <span className="tabular-nums">{asset.downloadCount}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 border-t border-border pt-4">
            <h2 className="mb-3 text-sm text-accent">{labels.sourceCode}</h2>
            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href={release.sourceArchives.zipballUrl}
                className="border border-border bg-surface-2 px-3 py-2 text-muted transition-colors duration-150 hover:bg-accent/15 hover:text-accent"
              >
                [{labels.zip}]
              </a>
              <a
                href={release.sourceArchives.tarballUrl}
                className="border border-border bg-surface-2 px-3 py-2 text-muted transition-colors duration-150 hover:bg-accent/15 hover:text-accent"
              >
                [{labels.tar}]
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-muted">{label}</dt>
      <dd className="truncate text-fg tabular-nums">{value}</dd>
    </div>
  );
}
