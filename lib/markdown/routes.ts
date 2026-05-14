import { profile, skills } from "@/content/profile";
import { getGitHubSnapshot } from "@/lib/github";
import {
  isProjectSlug,
  PROJECT_LIST,
  releaseDetailPath,
  releaseListPath,
  roadmapPath,
} from "@/lib/project-registry";
import {
  type MarkdownRoute,
  type MarkdownRouteKind,
} from "./data";
import { renderDeveloperPage } from "./developer-pages";
import {
  absolute,
  decodeSegment,
  fenced,
  finalize,
  normalizePath,
  paragraphs,
  rawMarkdownAbsolute,
  renderTable,
  section,
  SITE_URL,
  themedMarkdownAbsolute,
} from "./format";
import { renderHomePage } from "./home-page";
import { renderProjectPage } from "./project-pages";
import {
  renderReleaseDetailPage,
  renderReleaseListPage,
} from "./release-pages";
import { renderRoadmapPage } from "./roadmap-pages";

export async function getMarkdownForPath(
  pathname: string,
): Promise<string | null> {
  const normalized = normalizePath(pathname);
  if (normalized === "/") return renderHomePage();

  const segments: string[] = [];
  for (const segment of normalized.slice(1).split("/")) {
    if (segment) segments.push(decodeSegment(segment));
  }
  const [slug, view, ...rest] = segments;

  if (!slug || !isProjectSlug(slug)) return null;
  if (!view) return renderProjectPage(slug);
  if (view === "developer" && rest.length === 0) {
    return renderDeveloperPage(slug);
  }
  if (view === "roadmap" && rest.length === 0) {
    return renderRoadmapPage(slug);
  }
  if (view === "releases") {
    if (rest.length === 0) return renderReleaseListPage(slug);
    return renderReleaseDetailPage(slug, rest.join("/"));
  }
  return null;
}

export async function getPublicMarkdownRoutes(): Promise<MarkdownRoute[]> {
  const projectRoutes = await Promise.all(
    PROJECT_LIST.map(async (project) => {
      const routes: MarkdownRoute[] = [
        {
          path: project.projectPath,
          title: project.name,
          description: project.tagline,
          kind: "project",
          project: project.slug,
        },
        {
          path: project.developerPath,
          title: `${project.name} developer guide`,
          description: `Developer guide for ${project.name}.`,
          kind: "developer",
          project: project.slug,
        },
        {
          path: roadmapPath(project.slug) ?? `/${project.slug}/roadmap`,
          title: `${project.name} roadmap`,
          description: `Roadmap for ${project.name}.`,
          kind: "roadmap",
          project: project.slug,
        },
        {
          path: releaseListPath(project.slug),
          title: `${project.name} releases`,
          description: `Release index for ${project.name}.`,
          kind: "release-index",
          project: project.slug,
        },
      ];

      const snapshot = await getGitHubSnapshot(project.slug);
      for (const release of snapshot?.releases ?? []) {
        routes.push({
          path: releaseDetailPath(project.slug, release.tag),
          title: `${project.name} ${release.tag}`,
          description: release.name,
          kind: "release-detail",
          project: project.slug,
        });
      }

      return routes;
    }),
  );

  return [
    {
      path: "/",
      title: profile.name,
      description: profile.role,
      kind: "home",
    },
    ...projectRoutes.flat(),
  ];
}

function renderRouteIndex(
  routes: readonly MarkdownRoute[],
  kind: MarkdownRouteKind,
): string {
  const lines: string[] = [];

  for (const route of routes) {
    if (route.kind !== kind) continue;
    lines.push(
      `- [${route.title}](${absolute(route.path)}) - ${route.description}. Markdown: [raw](${rawMarkdownAbsolute(route.path)}), [themed](${themedMarkdownAbsolute(route.path)}).`,
    );
  }

  return lines.join("\n");
}

export async function getMarkdownSitemap(): Promise<string> {
  const routes = await getPublicMarkdownRoutes();
  return finalize([
    "# emersonfelipesp.com Markdown sitemap",
    "Every URL listed here also serves Markdown directly when requested with `Accept: text/markdown`.",
    section("Primary pages", renderRouteIndex(routes, "home")),
    section("Project showcases", renderRouteIndex(routes, "project")),
    section("Developer guides", renderRouteIndex(routes, "developer")),
    section("Roadmaps", renderRouteIndex(routes, "roadmap")),
    section("Release indexes", renderRouteIndex(routes, "release-index")),
    section("Release detail pages", renderRouteIndex(routes, "release-detail")),
  ]);
}

export async function getLlmsTxt(): Promise<string> {
  const routes = await getPublicMarkdownRoutes();
  return finalize([
    "# emersonfelipesp.com",
    `> ${profile.name} - ${profile.role}.`,
    section(
      "About",
      [
        paragraphs(profile.bio),
        "",
        renderTable(
          ["Field", "Value"],
          [
            ["Location", profile.location],
            ["Company", profile.company],
            ["Email", profile.email],
            ["GitHub", "https://github.com/emersonfelipesp"],
            ["LinkedIn", "https://www.linkedin.com/in/emersonfelipesp/"],
          ],
        ),
      ].join("\n"),
    ),
    section(
      "Markdown access",
      [
        "All public HTML pages support content negotiation and explicit Markdown alternates.",
        "",
        fenced(
          `curl -H "Accept: text/markdown" ${SITE_URL}/netbox-sdk`,
          "shell",
        ),
        "",
        `Raw Markdown routes use the /md prefix, for example ${rawMarkdownAbsolute("/netbox-sdk")}.`,
        `Themed Markdown views use the canonical page plus ?content=markdown, for example ${themedMarkdownAbsolute("/netbox-sdk")}.`,
        `A Markdown sitemap is available at ${absolute("/sitemap.md")}.`,
        `A plain sitemap alias is available at ${absolute("/sitemap.txt")}.`,
        `Full concatenated site content is available at ${absolute(
          "/llms-full.txt",
        )}.`,
      ].join("\n"),
    ),
    section(
      "Crawler directives",
      [
        "Canonical HTML pages are indexable and include canonical links, Open Graph metadata, Twitter card metadata, and JSON-LD.",
        "Markdown routes are equivalent machine-readable content for LLM crawlers and include Link headers back to their canonical HTML page.",
        "Use canonical HTML URLs for citation and ranking signals; use raw Markdown URLs when a plain text corpus is preferred.",
      ].join("\n"),
    ),
    section(
      "Sitemaps and full corpus",
      [
        `- [XML sitemap](${absolute("/sitemap.xml")}) - crawler sitemap.`,
        `- [Markdown sitemap](${absolute(
          "/sitemap.md",
        )}) - grouped Markdown route inventory.`,
        `- [Text sitemap](${absolute(
          "/sitemap.txt",
        )}) - same inventory for plain text clients.`,
        `- [Full Markdown corpus](${absolute(
          "/llms-full.txt",
        )}) - concatenated Markdown content for all indexed pages.`,
      ].join("\n"),
    ),
    section("Primary pages", renderRouteIndex(routes, "home")),
    section("Project showcases", renderRouteIndex(routes, "project")),
    section("Developer guides", renderRouteIndex(routes, "developer")),
    section("Roadmaps", renderRouteIndex(routes, "roadmap")),
    section("Release indexes", renderRouteIndex(routes, "release-index")),
    section("Release detail pages", renderRouteIndex(routes, "release-detail")),
    section(
      "Open-source projects",
      PROJECT_LIST.map(
        (project) =>
          `- [${project.name}](${absolute(project.projectPath)}) - ${project.tagline}`,
      ).join("\n"),
    ),
    section(
      "Technical skills",
      skills
        .map((group) => `- ${group.group}: ${group.items.join(", ")}`)
        .join("\n"),
    ),
  ]);
}

export async function getLlmsFullTxt(): Promise<string> {
  const routes = await getPublicMarkdownRoutes();
  const pages = await Promise.all(
    routes.map(async (route) => {
      const markdown = await getMarkdownForPath(route.path);
      if (!markdown) return null;
      return finalize([
        `# Source: ${absolute(route.path)}`,
        `Title: ${route.title}`,
        `Description: ${route.description}`,
        markdown,
      ]);
    }),
  );

  const includedPages: string[] = [];
  for (const page of pages) {
    if (page) includedPages.push(page);
  }

  return finalize([
    "# emersonfelipesp.com full Markdown content",
    "This file concatenates all public Markdown page equivalents.",
    includedPages.join("\n\n---\n\n"),
  ]);
}
