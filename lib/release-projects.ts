import {
  getProject,
  PROJECT_LIST,
  releaseDetailPath,
  releaseListPath,
  type ProjectRegistryEntry,
} from "./project-registry";

export type ReleaseProject = ProjectRegistryEntry;

export const RELEASE_PROJECTS = PROJECT_LIST;

export function getReleaseProject(slug: string): ReleaseProject | null {
  return getProject(slug);
}

export { releaseDetailPath, releaseListPath };
