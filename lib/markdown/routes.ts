import { profile, skills } from "@/content/profile";
import { getGitHubSnapshot } from "@/lib/github";
import {
  getProject,
  isProjectSlug,
  PROJECT_LIST,
  type ProjectActionIcon,
  type ProjectSlug,
  releaseDetailPath,
  releaseListPath,
  roadmapPath,
} from "@/lib/project-registry";
import {
  DEVELOPER_CONTENT,
  PROJECT_CONTENT,
  type CodeStep,
  type ConfigStep,
  type MarkdownRoute,
  type MarkdownRouteKind,
} from "./data";
import { renderCommunityPage } from "./community-pages";
import { renderDeveloperPage } from "./developer-pages";
import {
  absolute,
  decodeSegment,
  fenced,
  finalize,
  formatDate,
  list,
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
import { renderSponsorPage } from "./sponsor-page";
import {
  renderReleaseDetailPage,
  renderReleaseListPage,
} from "./release-pages";
import { renderRoadmapPage } from "./roadmap-pages";

const PROJECT_ACTION_LABELS = {
  github: "GitHub",
  docs: "Docs",
  pypi: "PyPI",
  docker: "Docker Hub",
} satisfies Record<ProjectActionIcon, string>;

export async function getMarkdownForPath(
  pathname: string,
): Promise<string | null> {
  const normalized = normalizePath(pathname);
  if (normalized === "/") return renderHomePage();
  if (normalized === "/sponsor") return renderSponsorPage();

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
  if (view === "community" && rest.length === 0) {
    return renderCommunityPage(slug);
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

      if (project.slug === "netbox-proxbox") {
        routes.push({
          path: "/netbox-proxbox/community",
          title: "netbox-proxbox community threads",
          description:
            "Community discussion threads for netbox-proxbox on the Proxmox Forum and Reddit.",
          kind: "community",
          project: "netbox-proxbox",
        });
      }

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
    {
      path: "/sponsor",
      title: "Sponsor emersonfelipesp",
      description: "Support open-source NetBox, Proxmox, and NetDevOps tooling.",
      kind: "sponsor",
    },
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
    section("Community threads", renderRouteIndex(routes, "community")),
    section("Support pages", renderRouteIndex(routes, "sponsor")),
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
    section(
      "Per-project llms.txt",
      [
        "Each project ships its own focused llms.txt covering metadata, overview, features, stack, install, architecture, integrations, configuration, screenshots, contributing, CI workflows, end-to-end testing, recent releases, related projects, and external links.",
        "",
        renderTable(
          ["Project", "Tagline", "llms.txt", "Showcase", "Developer guide", "GitHub"],
          PROJECT_LIST.map((project) => [
            project.name,
            project.tagline,
            absolute(`${project.projectPath}/llms.txt`),
            absolute(project.projectPath),
            absolute(`${project.projectPath}/developer`),
            project.repoUrl,
          ]),
        ),
      ].join("\n"),
    ),
    section(
      "Per-project quick links",
      PROJECT_LIST.map((project) => {
        const actionLines = project.actions
          .map((action) => {
            return `  - ${PROJECT_ACTION_LABELS[action.icon]}: ${action.href}`;
          })
          .join("\n");
        return [
          `- **${project.name}** — ${project.tagline}`,
          actionLines,
        ]
          .filter(Boolean)
          .join("\n");
      }).join("\n"),
    ),
    section("Primary pages", renderRouteIndex(routes, "home")),
    section("Project showcases", renderRouteIndex(routes, "project")),
    section("Developer guides", renderRouteIndex(routes, "developer")),
    section("Roadmaps", renderRouteIndex(routes, "roadmap")),
    section("Release indexes", renderRouteIndex(routes, "release-index")),
    section("Release detail pages", renderRouteIndex(routes, "release-detail")),
    section("Community threads", renderRouteIndex(routes, "community")),
    section("Support pages", renderRouteIndex(routes, "sponsor")),
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

export async function getProjectLlmsTxt(
  slug: ProjectSlug,
): Promise<string | null> {
  const project = getProject(slug);
  const content = PROJECT_CONTENT[slug];
  const developer = DEVELOPER_CONTENT[slug];
  if (!project || !content) return null;

  const snapshot = await getGitHubSnapshot(slug);
  const latestRelease =
    snapshot?.releases.find((release) => release.latest)?.tag ??
    snapshot?.releases[0]?.tag ??
    content.meta.latestRelease ??
    null;

  const showcasePath = `/${slug}`;
  const developerPath = `/${slug}/developer`;
  const roadmapHref = roadmapPath(slug) ?? `/${slug}/roadmap`;
  const releasesIndexPath = releaseListPath(slug);

  const projectActionsMap = new Map<string, string>(
    project.actions.map((action) => [action.icon, action.href]),
  );

  const metaRows: ReadonlyArray<readonly [string, string | number | null]> = [
    ["Canonical URL", absolute(showcasePath)],
    ["Project llms.txt", absolute(`${showcasePath}/llms.txt`)],
    ["GitHub", project.repoUrl],
    ["GitHub releases", project.releasesUrl],
    ["Developer guide", absolute(developerPath)],
    ["Roadmap", absolute(roadmapHref)],
    ["Release index", absolute(releasesIndexPath)],
    ["Docs", projectActionsMap.get("docs") ?? null],
    ["PyPI", projectActionsMap.get("pypi") ?? null],
    ["Docker Hub", projectActionsMap.get("docker") ?? null],
    ["License", content.meta.license ?? null],
    ["Python", content.meta.python ?? null],
    ["NetBox", content.meta.netbox ?? null],
    ["Proxmox", content.meta.proxmox ?? null],
    ["Latest release", latestRelease],
    ["Stars", snapshot?.stars ?? content.meta.stars ?? null],
    ["Forks", snapshot?.forks ?? content.meta.forks ?? null],
  ];

  const sitePages: ReadonlyArray<{
    title: string;
    path: string;
    description: string;
  }> = [
    {
      title: `${content.name} showcase`,
      path: showcasePath,
      description: content.tagline,
    },
    {
      title: `${content.name} developer guide`,
      path: developerPath,
      description: `Architecture, integrations, contribution workflow, and end-to-end testing for ${content.name}.`,
    },
    {
      title: `${content.name} roadmap`,
      path: roadmapHref,
      description: `Roadmap for ${content.name}.`,
    },
    {
      title: `${content.name} release index`,
      path: releasesIndexPath,
      description: `Release index for ${content.name}.`,
    },
    ...(slug === "netbox-proxbox"
      ? [
          {
            title: `${content.name} community threads`,
            path: "/netbox-proxbox/community",
            description:
              "Community discussion threads for netbox-proxbox on the Proxmox Forum and Reddit.",
          },
        ]
      : []),
  ];

  const sitePagesIndex = sitePages
    .map(
      (page) =>
        `- [${page.title}](${absolute(page.path)}) - ${page.description}. Markdown: [raw](${rawMarkdownAbsolute(page.path)}), [themed](${themedMarkdownAbsolute(page.path)}).`,
    )
    .join("\n");

  const releaseLines = (snapshot?.releases ?? [])
    .slice(0, 10)
    .map((release) => {
      const state = release.latest
        ? "latest"
        : release.prerelease
          ? "pre-release"
          : "stable";
      return `- [${release.name || release.tag}](${absolute(
        releaseDetailPath(slug, release.tag),
      )}) - ${release.tag} - ${formatDate(release.publishedAt)} - ${state}`;
    })
    .join("\n");

  const externalLinkRows = Object.entries(content.links).map(
    ([label, href]) => [label, href],
  );

  const developerLinkRows = developer
    ? Object.entries(developer.links).map(([label, href]) => [label, href])
    : [];

  const allLinkRows = [
    ...externalLinkRows,
    ...developerLinkRows.filter(
      ([label]) =>
        !externalLinkRows.some(([existing]) => existing === label),
    ),
  ];

  const architectureSection = developer
    ? [
        paragraphs(developer.intro),
        "",
        list(developer.architecture.bullets),
      ]
        .filter((part) => part.trim())
        .join("\n")
    : "";

  const integrationsSection =
    developer && developer.integrations.length
      ? renderTable(
          ["Target", "Protocol", "Library", "Notes"],
          developer.integrations.map((row) => [
            row.target,
            row.protocol,
            row.library,
            row.notes ?? "",
          ]),
        )
      : "";

  const installationSection = (() => {
    if (!content.installation) return "";
    const blocks: string[] = [];
    const groups: ReadonlyArray<readonly [string, readonly CodeStep[] | undefined]> = [
      ["Install (git source)", content.installation.git],
      ["Install (Docker)", content.installation.docker],
      ["Backend (proxbox-api)", content.installation.backend],
    ];
    for (const [heading, steps] of groups) {
      if (!steps?.length) continue;
      const lines: string[] = [`### ${heading}`, ""];
      steps.forEach((step, index) => {
        lines.push(`${index + 1}. **${step.title}**`);
        const body = typeof step.body === "string" ? [step.body] : step.body;
        for (const para of body) lines.push(`   - ${para}`);
        if (step.code) {
          lines.push("");
          lines.push(fenced(step.code, step.codeLabel ?? "shell"));
        }
        lines.push("");
      });
      blocks.push(lines.join("\n").trim());
    }
    return blocks.join("\n\n");
  })();

  const configurationSection = (() => {
    if (!content.configuration) return "";
    const blocks: string[] = [];
    const groups: ReadonlyArray<readonly [string, readonly ConfigStep[] | undefined]> = [
      ["Endpoints", content.configuration.endpoints],
      ["Plugin settings", content.configuration.settings],
    ];
    for (const [heading, steps] of groups) {
      if (!steps?.length) continue;
      const lines: string[] = [`### ${heading}`, ""];
      for (const step of steps) {
        lines.push(`- **${step.title}**`);
        const body = typeof step.body === "string" ? [step.body] : step.body;
        for (const para of body) lines.push(`  - ${para}`);
      }
      blocks.push(lines.join("\n").trim());
    }
    return blocks.join("\n\n");
  })();

  const screenshotsSection = content.screenshots?.length
    ? content.screenshots
        .map((group) => {
          const items = group.items
            .map(
              (item) =>
                `- [${item.alt}](${absolute(item.src)}) - ${item.caption}`,
            )
            .join("\n");
          return [`### ${group.title}`, "", items].join("\n").trim();
        })
        .join("\n\n")
    : "";

  const contributingSection = developer
    ? [
        `Dev install: \`${developer.contributing.devInstall}\``,
        "",
        "Local checks:",
        "",
        renderTable(
          ["Check", "Command"],
          developer.contributing.checks.map((check) => [check.label, `\`${check.cmd}\``]),
        ),
        "",
        "Code style:",
        "",
        list(developer.contributing.codeStyle),
        "",
        `Issues: ${developer.contributing.issuesUrl}`,
      ].join("\n")
    : "";

  const ciSection = developer?.ci
    ? [
        paragraphs(developer.ci.intro),
        "",
        renderTable(
          ["Workflow", "Trigger", "Purpose"],
          developer.ci.workflows.map((wf) => [wf.name, wf.trigger, wf.purpose]),
        ),
        developer.ci.notes?.length ? `\n**Notes**\n\n${list(developer.ci.notes)}` : "",
      ].join("\n")
    : "";

  const e2eSection = developer
    ? [
        `Framework: ${developer.e2e.framework}`,
        "",
        paragraphs(developer.e2e.intro),
        "",
        "Commands:",
        "",
        renderTable(
          ["Suite", "Command"],
          developer.e2e.commands.map((cmd) => [cmd.label, `\`${cmd.cmd}\``]),
        ),
        "",
        "Coverage:",
        "",
        list(developer.e2e.coverage),
        developer.e2e.ciWorkflow
          ? `\nCI workflow: \`${developer.e2e.ciWorkflow}\`${
              developer.e2e.ciWorkflowUrl ? ` (${developer.e2e.ciWorkflowUrl})` : ""
            }`
          : "",
      ].join("\n")
    : "";

  const relatedProjects = PROJECT_LIST.filter((p) => p.slug !== slug);
  const relatedSection = relatedProjects.length
    ? renderTable(
        ["Project", "Tagline", "Showcase", "llms.txt", "GitHub"],
        relatedProjects.map((p) => [
          p.name,
          p.tagline,
          absolute(p.projectPath),
          absolute(`${p.projectPath}/llms.txt`),
          p.repoUrl,
        ]),
      )
    : "";

  const parts: (string | null | undefined)[] = [
    `# ${content.name}`,
    `> ${content.tagline}`,
    section("Project metadata", renderTable(["Field", "Value"], metaRows)),
    section("Overview", paragraphs(content.description)),
    section("Features", list(content.features)),
    section("Stack", list(content.stack)),
    section(
      "Install",
      [
        fenced(content.install.primary, "shell"),
        content.install.note ? `\n${content.install.note}` : "",
      ].join("\n"),
    ),
    section("Architecture", architectureSection),
    section("Integrations", integrationsSection),
    section("Installation walkthrough", installationSection),
    section("Configuration", configurationSection),
    section("Screenshots", screenshotsSection),
    section("Contributing", contributingSection),
    section("CI workflows", ciSection),
    section("End-to-end testing", e2eSection),
    section("Pages on emersonfelipesp.com", sitePagesIndex),
    releaseLines
      ? section(
          "Recent releases",
          [
            releaseLines,
            "",
            `Full release index: ${absolute(releasesIndexPath)}`,
            `GitHub releases: ${project.releasesUrl}`,
          ].join("\n"),
        )
      : "",
    section("Related projects", relatedSection),
    allLinkRows.length
      ? section("External links", renderTable(["Label", "URL"], allLinkRows))
      : "",
    section(
      "Markdown access",
      [
        `This llms.txt is available at ${absolute(`${showcasePath}/llms.txt`)}.`,
        "",
        "Every showcase, developer, roadmap, and release page on this site also serves Markdown directly when requested with `Accept: text/markdown`, via a /md prefix, or via `?content=markdown`.",
        "",
        fenced(
          `curl -H "Accept: text/markdown" ${absolute(showcasePath)}`,
          "shell",
        ),
        "",
        `Raw Markdown: ${rawMarkdownAbsolute(showcasePath)}`,
        `Themed Markdown: ${themedMarkdownAbsolute(showcasePath)}`,
        `Site-wide llms.txt index: ${absolute("/llms.txt")}`,
        `Full Markdown corpus: ${absolute("/llms-full.txt")}`,
      ].join("\n"),
    ),
  ];

  return finalize(parts);
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
