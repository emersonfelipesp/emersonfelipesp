import type { Metadata } from "next";
import { skills } from "@/content/profile";
import type { DeveloperContent, ProjectContent } from "@/content/types";
import type { GitHubRelease } from "@/lib/github";
import {
  releaseDetailPath,
  releaseListPath,
  roadmapPath,
  type ProjectRegistryEntry,
} from "@/lib/project-registry";
import {
  AUTHOR_NAME,
  BASE_KEYWORDS,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "./constants";
import {
  rawMarkdownPath,
  themedMarkdownPath,
} from "./links";
import type { MetadataOptions } from "./types";
import { unique } from "./utils";

const AUTHOR_URL = SITE_URL;

function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  article,
}: MetadataOptions): Metadata {
  const allKeywords = unique([...BASE_KEYWORDS, ...keywords]);
  const common = {
    title,
    description,
    url: path,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Emerson Felipe NetDevOps portfolio",
      },
    ],
    locale: "en_US",
    alternateLocale: ["pt_BR"],
  };

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
    creator: AUTHOR_NAME,
    publisher: AUTHOR_NAME,
    category: "technology",
    classification: "Network automation, NetDevOps, and open-source software",
    keywords: allKeywords,
    referrer: "origin-when-cross-origin",
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: path,
      types: {
        "text/markdown": [
          {
            title: `${title} raw Markdown`,
            url: rawMarkdownPath(path),
          },
          {
            title: `${title} themed Markdown`,
            url: themedMarkdownPath(path),
          },
        ],
      },
    },
    openGraph: article
      ? {
          ...common,
          type: "article",
          publishedTime: article.publishedTime ?? undefined,
          modifiedTime: article.modifiedTime ?? undefined,
          authors: [AUTHOR_URL],
          tags: unique([...allKeywords, ...(article.tags ?? [])]),
        }
      : {
          ...common,
          type: "website",
        },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@emersonfelipesp",
      images: [
        {
          url: OG_IMAGE,
          alt: "Emerson Felipe NetDevOps portfolio",
        },
      ],
    },
    other: {
      "llms-txt": new URL("/llms.txt", SITE_URL).toString(),
      "markdown-source": new URL(rawMarkdownPath(path), SITE_URL).toString(),
      "markdown-themed": new URL(themedMarkdownPath(path), SITE_URL).toString(),
    },
  };
}

export function createHomeMetadata(): Metadata {
  return createPageMetadata({
    title: "Emerson Felipe (emersonfelipesp) - NetDevOps & Network Automation",
    description:
      "Software developer and network automation engineer building open-source NetBox, Proxmox, FastAPI, Python, CLI, and TUI tooling.",
    path: "/",
    keywords: skills.flatMap((group) => group.items),
  });
}

export function createProjectMetadata(project: ProjectContent): Metadata {
  return createPageMetadata({
    title: `${project.name} - ${project.tagline}`,
    description: project.description[0] ?? project.tagline,
    path: `/${project.slug}`,
    keywords: [
      project.name,
      project.fullName,
      project.palette,
      ...project.features,
      ...project.stack,
      project.meta.netbox ?? "",
      project.meta.proxmox ?? "",
      project.meta.python ?? "",
    ],
  });
}

export function createDeveloperMetadata(page: DeveloperContent): Metadata {
  return createPageMetadata({
    title: `${page.name} developer guide`,
    description: page.intro[0] ?? page.tagline,
    path: `/${page.slug}/developer`,
    keywords: [
      page.name,
      page.fullName,
      "developer guide",
      "architecture",
      "contributing",
      ...page.architecture.bullets,
    ],
    article: {
      tags: [page.name, "developer guide", "open source"],
    },
  });
}

export function createRoadmapMetadata(project: ProjectRegistryEntry): Metadata {
  return createPageMetadata({
    title: `${project.name} roadmap`,
    description: `Top-down dependency graph and phased GitHub issue roadmap for ${project.name}.`,
    path: roadmapPath(project.slug) ?? `/${project.slug}/roadmap`,
    keywords: [
      project.name,
      project.fullName,
      "roadmap",
      "GitHub issues",
      "issue dependencies",
    ],
    article: {
      tags: [project.name, "roadmap", "GitHub issues"],
    },
  });
}

export function createReleaseListMetadata(
  project: ProjectRegistryEntry,
): Metadata {
  return createPageMetadata({
    title: `${project.name} releases`,
    description: `Release notes, assets, source archives, and version history for ${project.name}.`,
    path: releaseListPath(project.slug),
    keywords: [
      project.name,
      project.fullName,
      "release notes",
      "changelog",
      "source archives",
    ],
  });
}

export function createReleaseDetailMetadata(
  project: ProjectRegistryEntry,
  release: GitHubRelease | null,
): Metadata {
  const path = release
    ? releaseDetailPath(project.slug, release.tag)
    : releaseListPath(project.slug);

  return createPageMetadata({
    title: release ? `${project.name} ${release.tag}` : project.name,
    description: release
      ? `${release.name} release notes, assets, and source archives for ${project.name}.`
      : `Release notes for ${project.name}.`,
    path,
    keywords: [
      project.name,
      project.fullName,
      release?.tag ?? "",
      release?.name ?? "",
      "release notes",
      "changelog",
    ],
    article: {
      publishedTime: release?.publishedAt,
      modifiedTime: release?.publishedAt ?? release?.createdAt,
      tags: [project.name, release?.tag ?? "", "release"],
    },
  });
}
