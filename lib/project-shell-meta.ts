import {
  getProject,
  getProjectFromPath,
  isProjectSlug,
  PROJECT_SLUGS,
  type ProjectRegistryEntry,
  type ProjectRouteInfo,
  type ProjectSlug,
  type ProjectViewKind,
} from "./project-registry";

export {
  getProjectFromPath,
  isProjectSlug,
  PROJECT_SLUGS,
  type ProjectRouteInfo,
  type ProjectViewKind,
};

export type ProjectShellSlug = ProjectSlug;
export type ProjectShellMeta = ProjectRegistryEntry;

export function getProjectShellMeta(slug: string): ProjectShellMeta | null {
  return getProject(slug);
}
