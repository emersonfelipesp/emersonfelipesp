import type { MetadataRoute } from "next";
import { getGitHubSnapshot } from "@/lib/github";
import {
  RELEASE_PROJECTS,
  releaseDetailPath,
  releaseListPath,
} from "@/lib/release-projects";

const BASE = "https://emersonfelipesp.com";

function absolute(path: string): string {
  return `${BASE}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const releaseRoutes: MetadataRoute.Sitemap = [];

  for (const project of RELEASE_PROJECTS) {
    const snapshot = await getGitHubSnapshot(project.slug);
    if (!snapshot) continue;
    releaseRoutes.push({
      url: absolute(releaseListPath(project.slug)),
      lastModified: new Date(snapshot.syncedAt),
      changeFrequency: "daily",
      priority: 0.7,
    });
    for (const release of snapshot.releases) {
      releaseRoutes.push({
        url: absolute(releaseDetailPath(project.slug, release.tag)),
        lastModified: new Date(
          release.publishedAt ?? release.createdAt ?? snapshot.syncedAt,
        ),
        changeFrequency: "monthly",
        priority: release.latest ? 0.75 : 0.55,
      });
    }
  }

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/netbox-proxbox`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/netbox-proxbox/developer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/proxbox-api`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE}/proxbox-api/developer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/netbox-sdk`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/netbox-sdk/developer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/proxmox-sdk`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/proxmox-sdk/developer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...releaseRoutes,
  ];
}
