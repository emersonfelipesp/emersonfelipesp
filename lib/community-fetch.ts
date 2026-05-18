const PROXMOX_FORUM_URL =
  "https://forum.proxmox.com/threads/proxbox-netbox-plugin-for-syncing-proxmox-ve-inventory-into-netbox.183646/";
const REDDIT_PROXMOX_URL =
  "https://www.reddit.com/r/Proxmox/comments/1tglo8y/proxbox_netbox_plugin_for_syncing_proxmox_ve/";
const REDDIT_NETBOX_URL =
  "https://www.reddit.com/r/Netbox/comments/1tglnow/proxbox_netbox_plugin_for_syncing_proxmox_ve/";

export const COMMUNITY_URLS = {
  proxmoxForum: PROXMOX_FORUM_URL,
  redditProxmox: REDDIT_PROXMOX_URL,
  redditNetbox: REDDIT_NETBOX_URL,
} as const;

const FETCH_UA =
  "emersonfelipesp.com community proxy (+https://emersonfelipesp.com)";
const FETCH_TIMEOUT_MS = 8000;

export type ForumPost = {
  title: string;
  body: string;
  author: string | null;
  replyCount: number | null;
  url: string;
  fetchedAt: string;
  error: string | null;
};

export type RedditPost = {
  title: string;
  body: string;
  author: string | null;
  score: number | null;
  commentCount: number | null;
  subreddit: string;
  url: string;
  fetchedAt: string;
  error: string | null;
};

export type CommunityPostsData = {
  proxmoxForum: ForumPost;
  redditProxmox: RedditPost;
  redditNetbox: RedditPost;
};

function stripped(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchProxmoxForum(): Promise<ForumPost> {
  const url = PROXMOX_FORUM_URL;
  const fetchedAt = new Date().toISOString();
  const fallbackTitle =
    "Proxbox – NetBox plugin for syncing Proxmox VE inventory into NetBox";
  try {
    const res = await fetchWithTimeout(url, {
      headers: { "User-Agent": FETCH_UA, Accept: "text/html" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const titleMatch = html.match(
      /<h1[^>]*class="[^"]*p-title-value[^"]*"[^>]*>([\s\S]*?)<\/h1>/,
    );
    const title = titleMatch ? stripped(titleMatch[1]) : fallbackTitle;

    let body = "";
    const bbIdx = html.indexOf('class="bbWrapper"');
    if (bbIdx !== -1) {
      const divStart = html.lastIndexOf("<div", bbIdx);
      if (divStart !== -1) {
        const articleEnd = html.indexOf("</article>", divStart);
        const block =
          articleEnd !== -1
            ? html.slice(divStart, articleEnd)
            : html.slice(divStart, divStart + 12000);
        body = stripped(block).slice(0, 3000);
      }
    }

    const authorMatch = html.match(
      /class="[^"]*message-name[^"]*"[\s\S]*?class="[^"]*username[^"]*"[^>]*>([\s\S]*?)<\/a>/,
    );
    const author = authorMatch ? stripped(authorMatch[1]) : null;

    const repliesMatch = html.match(/Replies<\/dt>\s*<dd[^>]*>([\d,]+)/);
    const replyCount = repliesMatch
      ? parseInt(repliesMatch[1].replace(/,/g, ""), 10)
      : null;

    return { title, body, author, replyCount, url, fetchedAt, error: null };
  } catch (err) {
    return {
      title: fallbackTitle,
      body: "",
      author: null,
      replyCount: null,
      url,
      fetchedAt,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function fetchRedditPost(
  canonicalUrl: string,
  subreddit: string,
): Promise<RedditPost> {
  const url = canonicalUrl;
  const jsonUrl = canonicalUrl.replace(/\/?$/, ".json");
  const fetchedAt = new Date().toISOString();
  const fallbackTitle =
    "Proxbox – NetBox plugin for syncing Proxmox VE inventory into NetBox";
  try {
    const res = await fetchWithTimeout(jsonUrl, {
      headers: { "User-Agent": FETCH_UA, Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    type RedditData = {
      title: string;
      selftext: string;
      author: string;
      score: number;
      num_comments: number;
      subreddit_name_prefixed: string;
    };
    type Listing = { data: { children: { data: RedditData }[] } };
    const json = (await res.json()) as Listing[];

    const post = json[0]?.data?.children?.[0]?.data;
    if (!post) throw new Error("unexpected Reddit JSON shape");

    return {
      title: post.title ?? fallbackTitle,
      body: post.selftext ?? "",
      author: post.author ?? null,
      score: typeof post.score === "number" ? post.score : null,
      commentCount:
        typeof post.num_comments === "number" ? post.num_comments : null,
      subreddit: post.subreddit_name_prefixed ?? subreddit,
      url,
      fetchedAt,
      error: null,
    };
  } catch (err) {
    return {
      title: fallbackTitle,
      body: "",
      author: null,
      score: null,
      commentCount: null,
      subreddit,
      url,
      fetchedAt,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function fetchCommunityPosts(): Promise<CommunityPostsData> {
  const [proxmoxForum, redditProxmox, redditNetbox] = await Promise.all([
    fetchProxmoxForum(),
    fetchRedditPost(REDDIT_PROXMOX_URL, "r/Proxmox"),
    fetchRedditPost(REDDIT_NETBOX_URL, "r/Netbox"),
  ]);
  return { proxmoxForum, redditProxmox, redditNetbox };
}
