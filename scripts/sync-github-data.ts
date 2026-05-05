import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RELEASE_PROJECTS, type ReleaseProject } from "../lib/release-projects";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEST_DIR = path.resolve(__dirname, "../public/github-data");
const PER_PAGE = 100;

type GitHubReleaseAuthor = {
  login: string;
  htmlUrl: string;
  avatarUrl: string | null;
};

type GitHubReleaseAsset = {
  id: number;
  name: string;
  label: string | null;
  contentType: string | null;
  state: string | null;
  size: number;
  downloadCount: number;
  url: string;
  browserDownloadUrl: string;
  createdAt: string | null;
  updatedAt: string | null;
};

type GitHubRelease = {
  id: number;
  nodeId: string | null;
  tag: string;
  name: string;
  url: string;
  apiUrl: string;
  targetCommitish: string | null;
  body: string;
  bodyHtml: string;
  createdAt: string | null;
  publishedAt: string | null;
  prerelease: boolean;
  latest: boolean;
  author: GitHubReleaseAuthor | null;
  assets: GitHubReleaseAsset[];
  sourceArchives: {
    zipballUrl: string;
    tarballUrl: string;
  };
};

type RawRelease = {
  id?: unknown;
  node_id?: unknown;
  tag_name?: unknown;
  name?: unknown;
  html_url?: unknown;
  url?: unknown;
  target_commitish?: unknown;
  body?: unknown;
  created_at?: unknown;
  published_at?: unknown;
  prerelease?: unknown;
  draft?: unknown;
  author?: unknown;
  assets?: unknown;
  zipball_url?: unknown;
  tarball_url?: unknown;
};

type RawAsset = {
  id?: unknown;
  name?: unknown;
  label?: unknown;
  content_type?: unknown;
  state?: unknown;
  size?: unknown;
  download_count?: unknown;
  url?: unknown;
  browser_download_url?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
};

function ghHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "emersonfelipesp-site",
    "X-GitHub-Api-Version": "2022-11-28",
    ...extra,
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { headers: ghHeaders() });
  if (!res.ok) {
    throw new Error(`${url} -> HTTP ${res.status}`);
  }
  return res.json();
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function normalizeAuthor(value: unknown): GitHubReleaseAuthor | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as {
    login?: unknown;
    html_url?: unknown;
    avatar_url?: unknown;
  };
  if (typeof raw.login !== "string" || typeof raw.html_url !== "string") {
    return null;
  }
  return {
    login: raw.login,
    htmlUrl: raw.html_url,
    avatarUrl: optionalString(raw.avatar_url),
  };
}

function normalizeAsset(item: RawAsset): GitHubReleaseAsset | null {
  if (typeof item.id !== "number") return null;
  if (typeof item.name !== "string") return null;
  if (typeof item.url !== "string") return null;
  if (typeof item.browser_download_url !== "string") return null;

  return {
    id: item.id,
    name: item.name,
    label: optionalString(item.label),
    contentType: optionalString(item.content_type),
    state: optionalString(item.state),
    size: typeof item.size === "number" ? item.size : 0,
    downloadCount:
      typeof item.download_count === "number" ? item.download_count : 0,
    url: item.url,
    browserDownloadUrl: item.browser_download_url,
    createdAt: optionalString(item.created_at),
    updatedAt: optionalString(item.updated_at),
  };
}

async function renderMarkdown(fullName: string, body: string): Promise<string> {
  if (!body.trim()) return "";
  const res = await fetch("https://api.github.com/markdown", {
    method: "POST",
    headers: ghHeaders({
      "Content-Type": "application/json",
      Accept: "text/html",
    }),
    body: JSON.stringify({
      text: body,
      mode: "gfm",
      context: fullName,
    }),
  });
  if (!res.ok) {
    throw new Error(`github markdown ${fullName} -> HTTP ${res.status}`);
  }
  return res.text();
}

async function normalizeRelease(
  fullName: string,
  item: RawRelease,
  latestTag: string | null,
): Promise<GitHubRelease | null> {
  if (item.draft === true) return null;
  if (typeof item.id !== "number") return null;
  if (typeof item.tag_name !== "string") return null;
  if (typeof item.html_url !== "string") return null;
  if (typeof item.url !== "string") return null;
  if (typeof item.zipball_url !== "string") return null;
  if (typeof item.tarball_url !== "string") return null;

  const tag = item.tag_name;
  const rawName = typeof item.name === "string" ? item.name.trim() : "";
  const body = typeof item.body === "string" ? item.body : "";
  const assets = Array.isArray(item.assets)
    ? item.assets
        .map((asset) => normalizeAsset(asset as RawAsset))
        .filter((asset): asset is GitHubReleaseAsset => Boolean(asset))
    : [];

  return {
    id: item.id,
    nodeId: optionalString(item.node_id),
    tag,
    name: rawName || tag,
    url: item.html_url,
    apiUrl: item.url,
    targetCommitish: optionalString(item.target_commitish),
    body,
    bodyHtml: await renderMarkdown(fullName, body),
    createdAt: optionalString(item.created_at),
    publishedAt: optionalString(item.published_at),
    prerelease: item.prerelease === true,
    latest: latestTag === tag,
    author: normalizeAuthor(item.author),
    assets,
    sourceArchives: {
      zipballUrl: item.zipball_url,
      tarballUrl: item.tarball_url,
    },
  };
}

async function fetchAllReleases(
  fullName: string,
): Promise<RawRelease[]> {
  const releases: RawRelease[] = [];
  for (let page = 1; ; page += 1) {
    const raw = await fetchJson(
      `https://api.github.com/repos/${fullName}/releases?per_page=${PER_PAGE}&page=${page}`,
    );
    if (!Array.isArray(raw)) {
      throw new Error(`github releases ${fullName} -> expected array`);
    }
    releases.push(...(raw as RawRelease[]));
    if (raw.length < PER_PAGE) break;
  }
  return releases;
}

async function fetchLatestTag(fullName: string): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${fullName}/releases/latest`,
    { headers: ghHeaders() },
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`github latest release ${fullName} -> HTTP ${res.status}`);
  }
  const raw = (await res.json()) as { tag_name?: unknown };
  return typeof raw.tag_name === "string" ? raw.tag_name : null;
}

async function fetchRepoStats(
  fullName: string,
): Promise<{ stars: number | null; forks: number | null }> {
  const raw = (await fetchJson(`https://api.github.com/repos/${fullName}`)) as {
    stargazers_count?: unknown;
    forks_count?: unknown;
  };
  return {
    stars:
      typeof raw.stargazers_count === "number" ? raw.stargazers_count : null,
    forks: typeof raw.forks_count === "number" ? raw.forks_count : null,
  };
}

async function syncRepo(
  repo: ReleaseProject,
): Promise<{ ok: boolean; skipped: boolean }> {
  const dst = path.join(DEST_DIR, `${repo.slug}.json`);
  try {
    const [rawReleases, stats, latestTag] = await Promise.all([
      fetchAllReleases(repo.fullName),
      fetchRepoStats(repo.fullName),
      fetchLatestTag(repo.fullName),
    ]);

    const releases: GitHubRelease[] = [];
    for (const rawRelease of rawReleases) {
      const release = await normalizeRelease(
        repo.fullName,
        rawRelease,
        latestTag,
      );
      if (release) releases.push(release);
    }

    const payload = {
      syncedAt: new Date().toISOString(),
      fullName: repo.fullName,
      stars: stats.stars,
      forks: stats.forks,
      releases,
    };
    writeFileSync(dst, JSON.stringify(payload, null, 2) + "\n");
    console.log(
      `[sync-github-data] ${repo.slug}: wrote ${releases.length} release(s), stars=${stats.stars ?? "?"}.`,
    );
    return { ok: true, skipped: false };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (existsSync(dst)) {
      console.warn(
        `[sync-github-data] ${repo.slug}: fetch failed (${msg}); keeping existing ${dst}.`,
      );
      return { ok: true, skipped: true };
    }
    console.error(
      `[sync-github-data] ${repo.slug}: FATAL - fetch failed and no existing file at ${dst}: ${msg}`,
    );
    return { ok: false, skipped: false };
  }
}

async function main(): Promise<void> {
  mkdirSync(DEST_DIR, { recursive: true });

  const summary: Array<{
    slug: string;
    fullName: string;
    ok: boolean;
    skipped: boolean;
  }> = [];
  let hadFatal = false;
  for (const repo of RELEASE_PROJECTS) {
    const result = await syncRepo(repo);
    summary.push({ slug: repo.slug, fullName: repo.fullName, ...result });
    if (!result.ok) hadFatal = true;
  }

  const manifest = {
    syncedAt: new Date().toISOString(),
    repos: summary,
  };
  writeFileSync(
    path.join(DEST_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );

  if (hadFatal) {
    console.error(
      "[sync-github-data] one or more repos failed without a fallback file.",
    );
    process.exit(1);
  }

  console.log(`[sync-github-data] done - ${RELEASE_PROJECTS.length} repo(s).`);
}

main().catch((err) => {
  console.error("[sync-github-data] FATAL", err);
  process.exit(1);
});
