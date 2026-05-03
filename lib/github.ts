import { db } from "./db";

const STALE_MS = 1000 * 60 * 60 * 6;

type GitHubRepo = {
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  description: string | null;
};

type GitHubRelease = {
  tag_name: string;
};

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
  const cached = await db.gitHubStatsCache.findUnique({ where: { fullName } });

  if (cached && Date.now() - cached.fetchedAt.getTime() < STALE_MS) {
    return { ...cached, cached: true };
  }

  try {
    const fresh = await fetchFromGitHub(fullName);
    const saved = await db.gitHubStatsCache.upsert({
      where: { fullName },
      update: fresh,
      create: { fullName, ...fresh },
    });
    return { ...saved, cached: false };
  } catch {
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
  const repo: GitHubRepo = await repoRes.json();

  let latestRelease: string | null = null;
  const relRes = await fetch(
    `https://api.github.com/repos/${fullName}/releases/latest`,
    { headers, next: { revalidate: 3600 } },
  );
  if (relRes.ok) {
    const rel: GitHubRelease = await relRes.json();
    latestRelease = rel.tag_name ?? null;
  }

  return {
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    description: repo.description,
    latestRelease,
  };
}
