import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { db } from "./db";

const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

const githubRepoSchema = z.object({
  stargazers_count: z.number(),
  forks_count: z.number(),
  language: z.string().nullable(),
  description: z.string().nullable(),
});

const githubReleaseSchema = z.object({
  tag_name: z.string(),
});

export type RepoStats = {
  fullName: string;
  stars: number;
  forks: number;
  language: string | null;
  description: string | null;
  latestRelease: string | null;
  fetchedAt: Date;
  cached: boolean;
};

export async function getRepoStats(fullName: string): Promise<RepoStats> {
  if (!fullName) throw new Error("fullName is required");

  let cached: Awaited<
    ReturnType<typeof db.gitHubStatsCache.findUnique>
  > = null;
  try {
    cached = await db.gitHubStatsCache.findUnique({ where: { fullName } });
  } catch {
    // DB unavailable — skip cache lookup
  }

  if (cached && Date.now() - cached.fetchedAt.getTime() < CACHE_TTL_MS) {
    return { ...cached, cached: true };
  }

  try {
    const fresh = await fetchFromGitHub(fullName);
    try {
      const saved = await db.gitHubStatsCache.upsert({
        where: { fullName },
        update: fresh,
        create: { fullName, ...fresh },
      });
      return { ...saved, cached: false };
    } catch {
      return { fullName, ...fresh, fetchedAt: new Date(), cached: false };
    }
  } catch (err) {
    console.error("[github] fetch failed for", fullName, err);
    if (cached) return { ...cached, cached: true };
    return {
      fullName,
      stars: 0,
      forks: 0,
      language: null,
      description: null,
      latestRelease: null,
      fetchedAt: new Date(0),
      cached: false,
    };
  }
}

const githubReleaseListItemSchema = z.object({
  tag_name: z.string(),
  name: z.string().nullable().optional(),
  html_url: z.string(),
  published_at: z.string().nullable().optional(),
  prerelease: z.boolean().optional(),
  draft: z.boolean().optional(),
});

export type GitHubRelease = {
  tag: string;
  name: string;
  url: string;
  publishedAt: string | null;
  prerelease: boolean;
};

export async function getRepoReleases(
  fullName: string,
  limit = 20,
): Promise<GitHubRelease[]> {
  if (!fullName) return [];

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "emersonfelipesp-site",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${fullName}/releases?per_page=${limit}`,
      { headers, next: { revalidate: 21600 } },
    );
    if (!res.ok) return [];
    const raw = await res.json();
    if (!Array.isArray(raw)) return [];
    const parsed: GitHubRelease[] = [];
    for (const item of raw) {
      const p = githubReleaseListItemSchema.safeParse(item);
      if (!p.success) continue;
      const r = p.data;
      if (r.draft) continue;
      parsed.push({
        tag: r.tag_name,
        name: r.name?.trim() || r.tag_name,
        url: r.html_url,
        publishedAt: r.published_at ?? null,
        prerelease: Boolean(r.prerelease),
      });
    }
    return parsed;
  } catch (err) {
    console.error("[github] releases fetch failed for", fullName, err);
    return [];
  }
}

const staticReleasesSchema = z.object({
  syncedAt: z.string(),
  fullName: z.string(),
  releases: z.array(
    z.object({
      tag: z.string(),
      name: z.string(),
      url: z.string(),
      publishedAt: z.string().nullable(),
      prerelease: z.boolean(),
    }),
  ),
});

export async function getStaticReleases(
  slug: string,
  fullName: string,
  fallbackLimit = 20,
): Promise<GitHubRelease[]> {
  try {
    const file = path.join(
      process.cwd(),
      "public/github-data",
      `${slug}.json`,
    );
    const raw = await readFile(file, "utf8");
    const parsed = staticReleasesSchema.safeParse(JSON.parse(raw));
    if (parsed.success && parsed.data.fullName === fullName) {
      return parsed.data.releases;
    }
  } catch {
    // fall through to live fetch when the static file is missing or invalid
  }
  return getRepoReleases(fullName, fallbackLimit);
}

async function fetchFromGitHub(
  fullName: string,
): Promise<Omit<RepoStats, "fullName" | "fetchedAt" | "cached">> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "emersonfelipesp-site",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const repoRes = await fetch(`https://api.github.com/repos/${fullName}`, {
    headers,
    next: { revalidate: 3600 },
  });
  if (!repoRes.ok) throw new Error(`github repo ${fullName} ${repoRes.status}`);
  const repo = githubRepoSchema.parse(await repoRes.json());

  let latestRelease: string | null = null;
  const relRes = await fetch(
    `https://api.github.com/repos/${fullName}/releases/latest`,
    { headers, next: { revalidate: 3600 } },
  );
  if (relRes.ok) {
    const rel = githubReleaseSchema.safeParse(await relRes.json());
    latestRelease = rel.success ? rel.data.tag_name : null;
  }

  return {
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    description: repo.description,
    latestRelease,
  };
}
