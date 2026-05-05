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
  getStaticReleases,
  getStaticStars,
  type GitHubReleaseSummary,
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
  stars: number | null;
};

export async function loadProjectShellData(
  slug: ProjectShellSlug,
): Promise<ProjectShellData> {
  const meta = getProjectShellMeta(slug);
  if (!meta) return { releases: [], stars: null };

  const [releases, stars] = await Promise.all([
    getStaticReleases(meta.slug, meta.fullName, 30),
    getStaticStars(meta.slug, meta.fullName),
  ]);
  return { releases, stars };
}

