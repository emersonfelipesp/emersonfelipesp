"use client";

import Link from "next/link";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TypedCommand } from "@/components/terminal/TypedCommand";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { POSTS, type Post } from "@/content/posts";
import { proxmoxerComparison } from "@/content/proxmox-sdk-proxmoxer-comparison";
import { netboxSdkPynetboxComparison } from "@/content/netbox-sdk-pynetbox-comparison";
import { proxmoxPve92 } from "@/content/proxmox-sdk-pve92";
import {
  getProxmoxerComparison,
  getNetboxSdkComparison,
  getProxmoxPve92,
} from "@/lib/i18n/projects";
import type { Lang } from "@/lib/i18n/languages";

function localizeTagline(post: Post, lang: Lang): string {
  switch (post.href) {
    case "/proxmox-sdk/proxmox-v9.2-support":
      return getProxmoxPve92(lang, proxmoxPve92).tagline;
    case "/proxmox-sdk/proxmoxer-comparison":
      return getProxmoxerComparison(lang, proxmoxerComparison).tagline;
    case "/netbox-sdk/pynetbox-comparison":
      return getNetboxSdkComparison(lang, netboxSdkPynetboxComparison).tagline;
    default:
      return post.tagline;
  }
}

export function PostsContent() {
  const { lang, t } = useLanguage();
  const s = t.posts;

  return (
    <div data-palette="mixed" className="space-y-8">
      <TerminalWindow title="~/posts">
        <TypedCommand command={s.command} cwd="~" />

        <div className="mt-4 space-y-1">
          <p className="mb-6 text-xs text-muted">{"// "}{s.heading}</p>

          <div className="space-y-4">
            {POSTS.map((post) => (
              <article
                key={post.href}
                className="border border-border bg-surface p-4 space-y-2 hover:border-accent transition-colors"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="text-accent font-mono">[{s[post.kind as "article" | "comparison"]}]</span>
                  <span className="text-muted font-mono">{post.project}</span>
                  {post.published && (
                    <span className="text-muted font-mono">
                      {s.published}: {post.published}
                    </span>
                  )}
                </div>

                <Link
                  href={post.href}
                  className="block font-mono text-sm text-fg hover:text-accent transition-colors"
                >
                  {post.title}
                </Link>

                <p className="text-xs text-muted leading-relaxed">
                  {localizeTagline(post, lang)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </TerminalWindow>
    </div>
  );
}
