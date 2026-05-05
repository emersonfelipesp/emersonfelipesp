import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { getProject, PROJECT_LIST } from "./project-registry";

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

export type StaticRepoSummary = {
  fullName: string;
  stars: number | null;
  forks: number | null;
  latestRelease: string | null;
  syncedAt: string;
};

function snapshotLatestRelease(snapshot: GitHubSnapshot): string | null {
  return (
    snapshot.releases.find((release) => release.latest)?.tag ??
    snapshot.releases[0]?.tag ??
    null
  );
}

async function readStaticSnapshot(slug: string): Promise<GitHubSnapshot | null> {
  const project = getProject(slug);
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
    PROJECT_LIST.map((project) => readStaticSnapshot(project.slug)),
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

export async function getStaticRepoSummary(
  slug: string,
  fullName: string,
): Promise<StaticRepoSummary | null> {
  const snapshot = await readStaticSnapshot(slug);
  if (!snapshot || snapshot.fullName !== fullName) return null;
  return {
    fullName: snapshot.fullName,
    stars: typeof snapshot.stars === "number" ? snapshot.stars : null,
    forks: typeof snapshot.forks === "number" ? snapshot.forks : null,
    latestRelease: snapshotLatestRelease(snapshot),
    syncedAt: snapshot.syncedAt,
  };
}
