import type { Metadata } from "next";
import { profile, skills, socials } from "@/content/profile";
import type { DeveloperContent, ProjectContent } from "@/content/types";
import type { GitHubRelease, GitHubSnapshot } from "@/lib/github";
import {
  getProject,
  releaseDetailPath,
  releaseListPath,
  roadmapPath,
  type ProjectRegistryEntry,
  type ProjectSlug,
} from "@/lib/project-registry";

export const SITE_URL = "https://emersonfelipesp.com";
export const SITE_NAME = "emersonfelipesp.com";
export const ROBOTS_INDEX_HEADER =
  "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

const AUTHOR_NAME = "Emerson Felipe";
const AUTHOR_HANDLE = "emersonfelipesp";
const AUTHOR_URL = SITE_URL;
const OG_IMAGE = "/opengraph-image";

const BASE_KEYWORDS = [
  "Emerson Felipe",
  "emersonfelipesp",
  "NetDevOps",
  "network automation",
  "NetBox",
  "Proxmox",
  "Python",
  "FastAPI",
  "Next.js",
  "open source",
];

type MetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  article?: {
    publishedTime?: string | null;
    modifiedTime?: string | null;
    tags?: readonly string[];
  };
};

type Crumb = {
  name: string;
  path: string;
};

type JsonLdNode = Record<string, unknown>;

function unique(values: readonly string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function absolute(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}

export function markdownPath(pathname: string): string {
  return pathname === "/" ? "/md" : `/md${pathname}`;
}

export function themedMarkdownPath(pathname: string): string {
  return pathname === "/" ? "/?content=markdown" : `${pathname}?content=markdown`;
}

export function discoveryLinkHeader(pathname: string): string {
  return [
    `<${absolute(pathname)}>; rel="canonical"`,
    `<${absolute(markdownPath(pathname))}>; rel="alternate"; type="text/markdown"; title="Raw Markdown"`,
    `<${absolute(themedMarkdownPath(pathname))}>; rel="alternate"; type="text/markdown"; title="Themed Markdown"`,
    `<${absolute("/llms.txt")}>; rel="alternate"; type="text/markdown"; title="LLMs index"`,
    `<${absolute("/sitemap.xml")}>; rel="sitemap"; type="application/xml"`,
    `<${absolute("/sitemap.md")}>; rel="alternate"; type="text/markdown"; title="Markdown sitemap"`,
  ].join(", ");
}

export function llmResourceLinkHeader(pathname: string): string {
  return [
    `<${absolute(pathname)}>; rel="canonical"`,
    `<${absolute("/llms.txt")}>; rel="alternate"; type="text/markdown"; title="LLMs index"`,
    `<${absolute("/llms-full.txt")}>; rel="alternate"; type="text/markdown"; title="Full Markdown corpus"`,
    `<${absolute("/sitemap.xml")}>; rel="sitemap"; type="application/xml"`,
    `<${absolute("/sitemap.md")}>; rel="alternate"; type="text/markdown"; title="Markdown sitemap"`,
  ].join(", ");
}

export function createPageMetadata({
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
            url: markdownPath(path),
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
      "llms-txt": absolute("/llms.txt"),
      "markdown-source": absolute(markdownPath(path)),
      "markdown-themed": absolute(themedMarkdownPath(path)),
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

export function siteGraphJsonLd(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: AUTHOR_NAME,
        alternateName: AUTHOR_HANDLE,
        url: SITE_URL,
        email: profile.email,
        jobTitle: profile.role,
        description: profile.bio.join(" "),
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cotia",
          addressRegion: "Sao Paulo",
          addressCountry: "BR",
        },
        worksFor: {
          "@type": "Organization",
          name: "N-Multifibra",
          url: "https://nmultifibra.com.br",
        },
        sameAs: socials
          .filter((item) => !item.href.startsWith("mailto:"))
          .map((item) => item.href),
        knowsAbout: unique([
          ...skills.flatMap((group) => group.items),
          "Network Automation",
          "NetDevOps",
          "Service Provider Networks",
        ]),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description:
          "Portfolio and project documentation for Emerson Felipe's NetDevOps and open-source infrastructure automation work.",
        inLanguage: ["en-US", "pt-BR"],
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };
}

export function breadcrumbJsonLd(crumbs: readonly Crumb[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}

export function webPageJsonLd({
  type = "WebPage",
  title,
  description,
  path,
  about,
}: {
  type?: string;
  title: string;
  description: string;
  path: string;
  about?: JsonLdNode | JsonLdNode[];
}): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absolute(path)}#webpage`,
    url: absolute(path),
    name: title,
    headline: title,
    description,
    inLanguage: ["en-US", "pt-BR"],
    isPartOf: { "@id": `${SITE_URL}/#website` },
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    about,
  };
}

export function homeJsonLd(): JsonLdNode[] {
  return [
    webPageJsonLd({
      type: "ProfilePage",
      title: profile.name,
      description: profile.role,
      path: "/",
      about: { "@id": `${SITE_URL}/#person` },
    }),
    breadcrumbJsonLd([{ name: "Home", path: "/" }]),
  ];
}

function projectSoftwareJsonLd(
  project: Pick<
    ProjectContent,
    | "slug"
    | "name"
    | "fullName"
    | "tagline"
    | "description"
    | "features"
    | "stack"
    | "links"
    | "meta"
  >,
  snapshot?: GitHubSnapshot | null,
): JsonLdNode {
  const latestRelease =
    snapshot?.releases.find((release) => release.latest)?.tag ??
    snapshot?.releases[0]?.tag ??
    project.meta.latestRelease;
  return {
    "@type": "SoftwareSourceCode",
    "@id": `${absolute(`/${project.slug}`)}#software`,
    name: project.name,
    alternateName: project.fullName,
    url: absolute(`/${project.slug}`),
    description: project.description.join(" "),
    codeRepository: project.links.repo ?? getProject(project.slug)?.repoUrl,
    programmingLanguage: project.stack,
    license: project.meta.license,
    softwareVersion: latestRelease,
    applicationCategory: "DeveloperApplication",
    featureList: project.features,
    author: { "@id": `${SITE_URL}/#person` },
    maintainer: { "@id": `${SITE_URL}/#person` },
    sameAs: Object.values(project.links),
    interactionStatistic:
      typeof snapshot?.stars === "number"
        ? {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/LikeAction",
            userInteractionCount: snapshot.stars,
          }
        : undefined,
  };
}

export function projectJsonLd(
  project: ProjectContent,
  snapshot?: GitHubSnapshot | null,
): JsonLdNode[] {
  const software = projectSoftwareJsonLd(project, snapshot);
  return [
    webPageJsonLd({
      title: project.name,
      description: project.description[0] ?? project.tagline,
      path: `/${project.slug}`,
      about: software,
    }),
    software,
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: project.name, path: `/${project.slug}` },
    ]),
  ];
}

export function developerJsonLd(
  page: DeveloperContent,
  snapshot?: GitHubSnapshot | null,
): JsonLdNode[] {
  const project = getProject(page.slug);
  const path = `/${page.slug}/developer`;
  return [
    webPageJsonLd({
      type: "TechArticle",
      title: `${page.name} developer guide`,
      description: page.intro[0] ?? page.tagline,
      path,
      about: project
        ? {
            "@type": "SoftwareSourceCode",
            "@id": `${absolute(project.projectPath)}#software`,
            name: project.name,
            codeRepository: project.repoUrl,
          }
        : undefined,
    }),
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "@id": `${absolute(path)}#article`,
      headline: `${page.name} developer guide`,
      description: page.intro[0] ?? page.tagline,
      url: absolute(path),
      dateModified: snapshot?.syncedAt,
      author: { "@id": `${SITE_URL}/#person` },
      publisher: { "@id": `${SITE_URL}/#person` },
      about: page.architecture.bullets,
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: page.name, path: `/${page.slug}` },
      { name: "Developer guide", path },
    ]),
  ];
}

export function roadmapJsonLd(
  project: ProjectRegistryEntry,
  generatedAt?: string | null,
): JsonLdNode[] {
  const path = roadmapPath(project.slug) ?? `/${project.slug}/roadmap`;
  return [
    webPageJsonLd({
      type: "CollectionPage",
      title: `${project.name} roadmap`,
      description: `GitHub issue dependency roadmap for ${project.name}.`,
      path,
      about: {
        "@type": "SoftwareSourceCode",
        "@id": `${absolute(project.projectPath)}#software`,
        name: project.name,
        codeRepository: project.repoUrl,
      },
    }),
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": `${absolute(path)}#roadmap`,
      name: `${project.name} GitHub issue roadmap`,
      description: `Generated GitHub issue dependency roadmap for ${project.name}.`,
      url: absolute(path),
      dateModified: generatedAt ?? undefined,
      creator: { "@id": `${SITE_URL}/#person` },
      isBasedOn: `${project.repoUrl}/issues`,
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: project.name, path: project.projectPath },
      { name: "Roadmap", path },
    ]),
  ];
}

export function releaseListJsonLd(
  project: ProjectRegistryEntry,
  snapshot: GitHubSnapshot,
): JsonLdNode[] {
  const path = releaseListPath(project.slug);
  return [
    webPageJsonLd({
      type: "CollectionPage",
      title: `${project.name} releases`,
      description: `Release notes and version history for ${project.name}.`,
      path,
      about: {
        "@type": "SoftwareSourceCode",
        "@id": `${absolute(project.projectPath)}#software`,
        name: project.name,
        codeRepository: project.repoUrl,
      },
    }),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${absolute(path)}#releases`,
      name: `${project.name} releases`,
      numberOfItems: snapshot.releases.length,
      itemListElement: snapshot.releases.map((release, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absolute(releaseDetailPath(project.slug, release.tag)),
        name: release.name,
      })),
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: project.name, path: project.projectPath },
      { name: "Releases", path },
    ]),
  ];
}

export function releaseDetailJsonLd(
  project: ProjectRegistryEntry,
  release: GitHubRelease,
): JsonLdNode[] {
  const path = releaseDetailPath(project.slug, release.tag);
  return [
    webPageJsonLd({
      type: "TechArticle",
      title: `${project.name} ${release.tag}`,
      description: `${release.name} release notes for ${project.name}.`,
      path,
      about: {
        "@type": "SoftwareSourceCode",
        "@id": `${absolute(project.projectPath)}#software`,
        name: project.name,
        codeRepository: project.repoUrl,
        softwareVersion: release.tag,
      },
    }),
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "@id": `${absolute(path)}#release-notes`,
      headline: `${project.name} ${release.tag}`,
      description: `${release.name} release notes, assets, and source archives.`,
      url: absolute(path),
      datePublished: release.publishedAt ?? release.createdAt ?? undefined,
      dateModified: release.publishedAt ?? release.createdAt ?? undefined,
      author: { "@id": `${SITE_URL}/#person` },
      publisher: { "@id": `${SITE_URL}/#person` },
      about: release.tag,
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: project.name, path: project.projectPath },
      { name: "Releases", path: releaseListPath(project.slug) },
      { name: release.tag, path },
    ]),
  ];
}
