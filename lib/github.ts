import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { db } from "./db";
import { RELEASE_PROJECTS, getReleaseProject } from "./release-projects";

const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

const githubRepoSchema = z.object({
  stargazers_count: z.number(),
  forks_count: z.number(),
  language: z.string().nullable(),
  description: z.string().nullable(),
});

const githubLatestReleaseSchema = z.object({
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

const staticReleaseAuthorSchema = z.object({
  login: z.string(),
  htmlUrl: z.string(),
  avatarUrl: z.string().nullable(),
});

const staticReleaseAssetSchema = z.object({
  id: z.number(),
  name: z.string(),
  label: z.string().nullable(),
  contentType: z.string().nullable(),
  state: z.string().nullable(),
  size: z.number(),
  downloadCount: z.number(),
  url: z.string(),
  browserDownloadUrl: z.string(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

const staticReleaseSchema = z.object({
  id: z.number(),
  nodeId: z.string().nullable(),
  tag: z.string(),
  name: z.string(),
  url: z.string(),
  apiUrl: z.string(),
  targetCommitish: z.string().nullable(),
  body: z.string(),
  bodyHtml: z.string(),
  createdAt: z.string().nullable(),
  publishedAt: z.string().nullable(),
  prerelease: z.boolean(),
  latest: z.boolean(),
  author: staticReleaseAuthorSchema.nullable(),
  assets: z.array(staticReleaseAssetSchema),
  sourceArchives: z.object({
    zipballUrl: z.string(),
    tarballUrl: z.string(),
  }),
});

const staticSnapshotSchema = z.object({
  syncedAt: z.string(),
  fullName: z.string(),
  stars: z.number().nullable().optional(),
  forks: z.number().nullable().optional(),
  releases: z.array(staticReleaseSchema),
});

export type GitHubReleaseAuthor = z.infer<typeof staticReleaseAuthorSchema>;
export type GitHubReleaseAsset = z.infer<typeof staticReleaseAssetSchema>;
export type GitHubRelease = z.infer<typeof staticReleaseSchema>;
export type GitHubSnapshot = z.infer<typeof staticSnapshotSchema>;
export type GitHubReleaseSummary = Pick<
  GitHubRelease,
  "tag" | "name" | "url" | "publishedAt" | "prerelease" | "latest"
>;

async function readStaticSnapshot(slug: string): Promise<GitHubSnapshot | null> {
  const project = getReleaseProject(slug);
  if (!project) return null;

  try {
    const file = path.join(
      process.cwd(),
      "public/github-data",
      `${slug}.json`,
    );
    const raw = await readFile(file, "utf8");
    const parsed = staticSnapshotSchema.safeParse(JSON.parse(raw));
    if (parsed.success && parsed.data.fullName === project.fullName) {
      return parsed.data;
    }
  } catch {
    // fall through
  }
  return null;
}

export async function getGitHubSnapshot(
  slug: string,
): Promise<GitHubSnapshot | null> {
  return readStaticSnapshot(slug);
}

export async function getAllGitHubSnapshots(): Promise<GitHubSnapshot[]> {
  const snapshots = await Promise.all(
    RELEASE_PROJECTS.map((project) => readStaticSnapshot(project.slug)),
  );
  return snapshots.filter((snapshot): snapshot is GitHubSnapshot => Boolean(snapshot));
}

export async function getStaticRelease(
  slug: string,
  tag: string,
): Promise<GitHubRelease | null> {
  const snapshot = await readStaticSnapshot(slug);
  return snapshot?.releases.find((release) => release.tag === tag) ?? null;
}

export async function getStaticReleases(
  slug: string,
  fullName: string,
  fallbackLimit = 20,
): Promise<GitHubReleaseSummary[]> {
  const snapshot = await readStaticSnapshot(slug);
  if (!snapshot || snapshot.fullName !== fullName) return [];
  return snapshot.releases.slice(0, fallbackLimit).map((release) => ({
    tag: release.tag,
    name: release.name,
    url: release.url,
    publishedAt: release.publishedAt,
    prerelease: release.prerelease,
    latest: release.latest,
  }));
}

export async function getStaticStars(
  slug: string,
  fullName: string,
): Promise<number | null> {
  const snapshot = await readStaticSnapshot(slug);
  if (!snapshot || snapshot.fullName !== fullName) return null;
  if (snapshot && typeof snapshot.stars === "number") return snapshot.stars;
  return null;
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
    const rel = githubLatestReleaseSchema.safeParse(await relRes.json());
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
