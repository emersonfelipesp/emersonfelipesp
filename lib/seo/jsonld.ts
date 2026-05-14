import { profile, skills, socials } from "@/content/profile";
import type { DeveloperContent, ProjectContent } from "@/content/types";
import type { GitHubRelease, GitHubSnapshot } from "@/lib/github";
import {
  getProject,
  releaseDetailPath,
  releaseListPath,
  roadmapPath,
  type ProjectRegistryEntry,
} from "@/lib/project-registry";
import {
  AUTHOR_HANDLE,
  AUTHOR_NAME,
  SITE_NAME,
  SITE_URL,
} from "./constants";
import { absoluteUrl } from "./links";
import type { Crumb, JsonLdNode } from "./types";
import { unique } from "./utils";

function socialProfileUrls(): string[] {
  const urls: string[] = [];

  for (const item of socials) {
    if (!item.href.startsWith("mailto:")) urls.push(item.href);
  }

  return urls;
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
        sameAs: socialProfileUrls(),
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

function breadcrumbJsonLd(crumbs: readonly Crumb[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

function webPageJsonLd({
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
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
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
    "@id": `${absoluteUrl(`/${project.slug}`)}#software`,
    name: project.name,
    alternateName: project.fullName,
    url: absoluteUrl(`/${project.slug}`),
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
            "@id": `${absoluteUrl(project.projectPath)}#software`,
            name: project.name,
            codeRepository: project.repoUrl,
          }
        : undefined,
    }),
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "@id": `${absoluteUrl(path)}#article`,
      headline: `${page.name} developer guide`,
      description: page.intro[0] ?? page.tagline,
      url: absoluteUrl(path),
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
        "@id": `${absoluteUrl(project.projectPath)}#software`,
        name: project.name,
        codeRepository: project.repoUrl,
      },
    }),
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": `${absoluteUrl(path)}#roadmap`,
      name: `${project.name} GitHub issue roadmap`,
      description: `Generated GitHub issue dependency roadmap for ${project.name}.`,
      url: absoluteUrl(path),
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
        "@id": `${absoluteUrl(project.projectPath)}#software`,
        name: project.name,
        codeRepository: project.repoUrl,
      },
    }),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${absoluteUrl(path)}#releases`,
      name: `${project.name} releases`,
      numberOfItems: snapshot.releases.length,
      itemListElement: snapshot.releases.map((release, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(releaseDetailPath(project.slug, release.tag)),
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
        "@id": `${absoluteUrl(project.projectPath)}#software`,
        name: project.name,
        codeRepository: project.repoUrl,
        softwareVersion: release.tag,
      },
    }),
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "@id": `${absoluteUrl(path)}#release-notes`,
      headline: `${project.name} ${release.tag}`,
      description: `${release.name} release notes, assets, and source archives.`,
      url: absoluteUrl(path),
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
