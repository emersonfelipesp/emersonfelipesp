"use client";

import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { SectionHeading } from "@/components/project/SectionHeading";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getNetboxProxbox } from "@/lib/i18n/projects";
import type { CommunityPostsData, ForumPost, RedditPost } from "@/lib/community-fetch";

type Props = {
  data: CommunityPostsData;
};

function StatChip({ value, label }: { value: number | null; label: string }) {
  if (value === null) return null;
  return (
    <span className="text-xs text-muted">
      <span className="text-accent-2">{value.toLocaleString()}</span>
      {" "}
      {label}
    </span>
  );
}

function PostLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-accent transition-colors hover:text-accent-2"
    >
      <span className="select-none text-muted">›</span>
      {label}
      <span className="select-none text-muted">↗</span>
    </a>
  );
}

function PlatformBadge({
  label,
  variant,
}: {
  label: string;
  variant: "forum" | "reddit";
}) {
  const base = "border px-1.5 py-0.5 text-xs font-mono rounded-sm";
  const style =
    variant === "forum"
      ? "border-success/50 text-success"
      : "border-accent/50 text-accent";
  return <span className={`${base} ${style}`}>{label}</span>;
}

function ForumPostCard({ post, readOriginalLabel, fetchErrorLabel }: {
  post: ForumPost;
  readOriginalLabel: string;
  fetchErrorLabel: string;
}) {
  return (
    <TerminalWindow title="~/forum.proxmox.com">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <PlatformBadge label="Proxmox Forum" variant="forum" />
          {post.author && (
            <span className="text-xs text-muted">
              <span className="text-accent">u/</span>
              {post.author}
            </span>
          )}
          <StatChip value={post.replyCount} label="replies" />
        </div>

        <h3 className="text-sm text-fg">{post.title}</h3>

        {post.error ? (
          <p className="text-xs text-danger">{fetchErrorLabel}</p>
        ) : post.body ? (
          <p className="line-clamp-6 text-xs leading-relaxed text-muted">
            {post.body}
          </p>
        ) : null}

        <PostLink href={post.url} label={readOriginalLabel} />
      </div>
    </TerminalWindow>
  );
}

function RedditPostCard({ post, platformLabel, readOriginalLabel, fetchErrorLabel }: {
  post: RedditPost;
  platformLabel: string;
  readOriginalLabel: string;
  fetchErrorLabel: string;
}) {
  return (
    <TerminalWindow title={`~/${post.subreddit}`}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <PlatformBadge label={platformLabel} variant="reddit" />
          {post.author && (
            <span className="text-xs text-muted">
              <span className="text-accent">u/</span>
              {post.author}
            </span>
          )}
          <StatChip value={post.score} label="upvotes" />
          <StatChip value={post.commentCount} label="comments" />
        </div>

        <h3 className="text-sm text-fg">{post.title}</h3>

        {post.error ? (
          <p className="text-xs text-danger">{fetchErrorLabel}</p>
        ) : post.body ? (
          <p className="line-clamp-6 whitespace-pre-line text-xs leading-relaxed text-muted">
            {post.body}
          </p>
        ) : null}

        <PostLink href={post.url} label={readOriginalLabel} />
      </div>
    </TerminalWindow>
  );
}

export function NetboxProxboxCommunityContent({ data }: Props) {
  const { lang, t } = useLanguage();
  const p = getNetboxProxbox(lang);
  const c = t.community;

  return (
    <div data-palette={p.palette} className="space-y-8">
      <div className="space-y-2">
        <TypedCommand
          command="fetch --community forum.proxmox.com reddit.com"
          cwd="~/netbox-proxbox"
        />
        <p className="text-xs text-muted">
          <span className="text-accent">#</span> {c.intro}
        </p>
      </div>

      <SectionHeading id="community">{c.heading}</SectionHeading>

      <div className="space-y-6">
        <ForumPostCard
          post={data.proxmoxForum}
          readOriginalLabel={c.readOriginal}
          fetchErrorLabel={c.fetchError}
        />
        <RedditPostCard
          post={data.redditProxmox}
          platformLabel={c.redditProxmox}
          readOriginalLabel={c.readOriginal}
          fetchErrorLabel={c.fetchError}
        />
        <RedditPostCard
          post={data.redditNetbox}
          platformLabel={c.redditNetbox}
          readOriginalLabel={c.readOriginal}
          fetchErrorLabel={c.fetchError}
        />
      </div>
    </div>
  );
}
