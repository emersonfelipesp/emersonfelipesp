import {
  getGitHubSnapshot,
  type GitHubRelease,
  type GitHubSnapshot,
} from "@/lib/github";
import {
  getProject,
  releaseDetailPath,
  releaseListPath,
  type ProjectSlug,
} from "@/lib/project-registry";
import {
  absolute,
  finalize,
  formatDate,
  formatDateTime,
  renderTable,
  section,
} from "./format";

export async function renderReleaseListPage(
  slug: ProjectSlug,
): Promise<string | null> {
  const project = getProject(slug);
  const snapshot = await getGitHubSnapshot(slug);
  if (!project || !snapshot) return null;

  return finalize([
    `# ${project.name} releases`,
    project.tagline,
    renderTable(
      ["Field", "Value"],
      [
        ["Canonical URL", absolute(releaseListPath(slug))],
        ["GitHub releases", project.releasesUrl],
        ["Repository", snapshot.fullName],
        ["Synced", formatDateTime(snapshot.syncedAt)],
        ["Release count", snapshot.releases.length],
        ["Stars", snapshot.stars ?? null],
        ["Forks", snapshot.forks ?? null],
      ],
    ),
    section(
      "Release index",
      snapshot.releases
        .map(
          (release) =>
            `- [${release.name}](${absolute(
              releaseDetailPath(slug, release.tag),
            )}) - ${release.tag} - ${formatDate(
              release.publishedAt,
            )} - ${release.latest ? "latest" : release.prerelease ? "pre-release" : "stable"}`,
        )
        .join("\n"),
    ),
  ]);
}

export async function renderReleaseDetailPage(
  slug: ProjectSlug,
  tag: string,
): Promise<string | null> {
  const project = getProject(slug);
  const snapshot = await getGitHubSnapshot(slug);
  const release = snapshot?.releases.find((item) => item.tag === tag);
  if (!project || !snapshot || !release) return null;

  return finalize([
    `# ${project.name} ${release.tag}`,
    release.name,
    renderReleaseMeta(slug, release, snapshot),
    section(
      "Release notes",
      release.body.trim() ? release.body : "This release has no notes.",
    ),
    renderReleaseAssets(release),
  ]);
}

function renderReleaseMeta(
  slug: ProjectSlug,
  release: GitHubRelease,
  snapshot: GitHubSnapshot,
): string {
  return renderTable(
    ["Field", "Value"],
    [
      ["Canonical URL", absolute(releaseDetailPath(slug, release.tag))],
      ["GitHub URL", release.url],
      ["Tag", release.tag],
      [
        "State",
        release.latest
          ? "latest"
          : release.prerelease
            ? "pre-release"
            : "stable",
      ],
      ["Author", release.author?.login ?? null],
      ["Created", formatDateTime(release.createdAt)],
      ["Published", formatDateTime(release.publishedAt)],
      ["Target", release.targetCommitish ?? null],
      ["Synced", formatDateTime(snapshot.syncedAt)],
      ["Assets", release.assets.length],
    ],
  );
}

function renderReleaseAssets(release: GitHubRelease): string {
  const assetRows = release.assets.map((asset) => [
    asset.name,
    asset.contentType ?? "",
    asset.size,
    asset.downloadCount,
    asset.browserDownloadUrl,
  ]);
  const sourceRows = [
    ["zip", release.sourceArchives.zipballUrl],
    ["tar.gz", release.sourceArchives.tarballUrl],
  ];

  return section(
    "Assets",
    [
      assetRows.length
        ? renderTable(
            ["Name", "Type", "Size bytes", "Downloads", "URL"],
            assetRows,
          )
        : "No binary assets attached.",
      "",
      "Source archives:",
      "",
      renderTable(["Format", "URL"], sourceRows),
    ].join("\n"),
  );
}
