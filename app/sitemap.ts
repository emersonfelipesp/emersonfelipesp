import type { MetadataRoute } from "next";
import { getGitHubSnapshot } from "@/lib/github";
import { loadRoadmap } from "@/lib/roadmap";
import {
  PROJECT_LIST,
  type ProjectSlug,
  releaseDetailPath,
  releaseListPath,
  roadmapPath,
} from "@/lib/project-registry";

const BASE = "https://emersonfelipesp.com";

function absolute(path: string): string {
  return `${BASE}${path}`;
}

function dateOrNull(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function newestDate(dates: readonly (Date | null | undefined)[]): Date {
  const timestamps = dates
    .filter((date): date is Date => Boolean(date))
    .map((date) => date.getTime());
  return new Date(timestamps.length ? Math.max(...timestamps) : Date.now());
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const releaseRoutes: MetadataRoute.Sitemap = [];
  const projectRoutes: MetadataRoute.Sitemap = [];
  const modifiedDates: Date[] = [];

  for (const project of PROJECT_LIST) {
    const [snapshot, roadmap] = await Promise.all([
      getGitHubSnapshot(project.slug),
      loadRoadmap(project.slug as ProjectSlug),
    ]);
    const projectModified = dateOrNull(snapshot?.syncedAt);
    const roadmapModified = dateOrNull(roadmap?.generated_at);
    if (projectModified) modifiedDates.push(projectModified);
    if (roadmapModified) modifiedDates.push(roadmapModified);

    projectRoutes.push(
      {
        url: absolute(project.projectPath),
        lastModified: projectModified ?? undefined,
        changeFrequency: "weekly",
        priority: project.slug === "netbox-proxbox" ? 0.95 : 0.9,
      },
      {
        url: absolute(project.developerPath),
        lastModified: projectModified ?? undefined,
        changeFrequency: "monthly",
        priority: 0.75,
      },
      {
        url: absolute(roadmapPath(project.slug) ?? `/${project.slug}/roadmap`),
        lastModified: roadmapModified ?? projectModified ?? undefined,
        changeFrequency: "daily",
        priority: 0.65,
      },
    );

    if (snapshot) {
      releaseRoutes.push({
        url: absolute(releaseListPath(project.slug)),
        lastModified: dateOrNull(snapshot.syncedAt) ?? undefined,
        changeFrequency: "daily",
        priority: 0.75,
      });
      for (const release of snapshot.releases) {
        releaseRoutes.push({
          url: absolute(releaseDetailPath(project.slug, release.tag)),
          lastModified:
            dateOrNull(
              release.publishedAt ?? release.createdAt ?? snapshot.syncedAt,
            ) ?? undefined,
          changeFrequency: release.latest ? "weekly" : "monthly",
          priority: release.latest ? 0.8 : 0.55,
        });
      }
    }
  }

  return [
    {
      url: BASE,
      lastModified: newestDate(modifiedDates),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projectRoutes,
    ...releaseRoutes,
  ];
}
