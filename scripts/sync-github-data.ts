import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEST_DIR = path.resolve(__dirname, "../public/github-data");

type Repo = {
  readonly slug: string;
  readonly fullName: string;
  readonly limit: number;
};

const REPOS: ReadonlyArray<Repo> = [
  { slug: "proxbox-api", fullName: "emersonfelipesp/proxbox-api", limit: 30 },
];

type GitHubRelease = {
  tag: string;
  name: string;
  url: string;
  publishedAt: string | null;
  prerelease: boolean;
};

type RawRelease = {
  tag_name?: unknown;
  name?: unknown;
  html_url?: unknown;
  published_at?: unknown;
  prerelease?: unknown;
  draft?: unknown;
};

function normalize(item: RawRelease): GitHubRelease | null {
  if (typeof item.tag_name !== "string") return null;
  if (typeof item.html_url !== "string") return null;
  if (item.draft === true) return null;
  const tag = item.tag_name;
  const rawName = typeof item.name === "string" ? item.name.trim() : "";
  const publishedAt =
    typeof item.published_at === "string" ? item.published_at : null;
  return {
    tag,
    name: rawName || tag,
    url: item.html_url,
    publishedAt,
    prerelease: item.prerelease === true,
  };
}

async function fetchReleases(
  fullName: string,
  limit: number,
): Promise<GitHubRelease[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "emersonfelipesp-site",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(
    `https://api.github.com/repos/${fullName}/releases?per_page=${limit}`,
    { headers },
  );
  if (!res.ok) {
    throw new Error(`github releases ${fullName} → HTTP ${res.status}`);
  }
  const raw = (await res.json()) as unknown;
  if (!Array.isArray(raw)) {
    throw new Error(`github releases ${fullName} → expected array`);
  }
  const out: GitHubRelease[] = [];
  for (const item of raw) {
    const r = normalize(item as RawRelease);
    if (r) out.push(r);
  }
  return out;
}

async function syncRepo(repo: Repo): Promise<{ ok: boolean; skipped: boolean }> {
  const dst = path.join(DEST_DIR, `${repo.slug}.json`);
  try {
    const releases = await fetchReleases(repo.fullName, repo.limit);
    const payload = {
      syncedAt: new Date().toISOString(),
      fullName: repo.fullName,
      releases,
    };
    writeFileSync(dst, JSON.stringify(payload, null, 2) + "\n");
    console.log(
      `[sync-github-data] ${repo.slug}: wrote ${releases.length} release(s).`,
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
      `[sync-github-data] ${repo.slug}: FATAL — fetch failed and no existing file at ${dst}: ${msg}`,
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
  for (const repo of REPOS) {
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
      `[sync-github-data] one or more repos failed without a fallback file.`,
    );
    process.exit(1);
  }

  console.log(`[sync-github-data] done — ${REPOS.length} repo(s).`);
}

main().catch((err) => {
  console.error(`[sync-github-data] FATAL`, err);
  process.exit(1);
});
