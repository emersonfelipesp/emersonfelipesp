import {
  getProjectFromPath,
  getProjectShellMeta,
  isProjectSlug,
  PROJECT_SLUGS,
  type ProjectRouteInfo,
  type ProjectShellMeta,
  type ProjectShellSlug,
  type ProjectViewKind,
} from "./project-shell-meta";
import {
  getStaticRepoSummary,
  getStaticReleases,
  type GitHubReleaseSummary,
  type StaticRepoSummary,
} from "./github";

export {
  getProjectFromPath,
  getProjectShellMeta,
  isProjectSlug,
  PROJECT_SLUGS,
  type ProjectRouteInfo,
  type ProjectShellMeta,
  type ProjectShellSlug,
  type ProjectViewKind,
};

export type ProjectShellData = {
  releases: readonly GitHubReleaseSummary[];
  repo: StaticRepoSummary | null;
};

export async function loadProjectShellData(
  slug: ProjectShellSlug,
): Promise<ProjectShellData> {
  const meta = getProjectShellMeta(slug);
  if (!meta) return { releases: [], repo: null };

  const [releases, repo] = await Promise.all([
    getStaticReleases(meta.slug, meta.fullName, 30),
    getStaticRepoSummary(meta.slug, meta.fullName),
  ]);
  return { releases, repo };
}
