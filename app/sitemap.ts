import type { MetadataRoute } from "next";
import { getGitHubSnapshot } from "@/lib/github";
import { loadRoadmap } from "@/lib/roadmap";
import {
  PROJECT_LIST,
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
  const timestamps: number[] = [];
  for (const date of dates) {
    if (date) timestamps.push(date.getTime());
  }
  return new Date(timestamps.length ? Math.max(...timestamps) : Date.now());
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routeGroups = await Promise.all(PROJECT_LIST.map(async (project) => {
    const [snapshot, roadmap] = await Promise.all([
      getGitHubSnapshot(project.slug),
      loadRoadmap(project.slug),
    ]);
    const projectModified = dateOrNull(snapshot?.syncedAt);
    const roadmapModified = dateOrNull(roadmap?.generated_at);
    const modifiedDates = [projectModified, roadmapModified];

    const projectRoutes: MetadataRoute.Sitemap = [
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
      ...(project.slug === "netbox-proxbox"
        ? [
            {
              url: absolute("/netbox-proxbox/community"),
              lastModified: new Date(),
              changeFrequency: "daily" as const,
              priority: 0.7,
            },
          ]
        : []),
    ];

    const releaseRoutes: MetadataRoute.Sitemap = [];

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

    return {
      modifiedDates,
      routes: [...projectRoutes, ...releaseRoutes],
    };
  }));

  const modifiedDates = routeGroups.flatMap((group) => group.modifiedDates);
  const routes = routeGroups.flatMap((group) => group.routes);

  return [
    {
      url: BASE,
      lastModified: newestDate(modifiedDates),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/sponsor`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...routes,
  ];
}
