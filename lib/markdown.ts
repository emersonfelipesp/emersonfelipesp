import { featured, profile, skills, socials } from "@/content/profile";
import { netboxProxbox } from "@/content/netbox-proxbox";
import { proxboxApi } from "@/content/proxbox-api";
import { netboxSdk } from "@/content/netbox-sdk";
import { proxmoxSdk } from "@/content/proxmox-sdk";
import { netboxProxboxDeveloper } from "@/content/netbox-proxbox-developer";
import { proxboxApiDeveloper } from "@/content/proxbox-api-developer";
import { netboxSdkDeveloper } from "@/content/netbox-sdk-developer";
import { proxmoxSdkDeveloper } from "@/content/proxmox-sdk-developer";
import type {
  DeveloperContent,
  ProjectContent,
  SimStep,
} from "@/content/types";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import {
  getGitHubSnapshot,
  type GitHubRelease,
  type GitHubSnapshot,
} from "@/lib/github";
import { loadRoadmap, type Roadmap } from "@/lib/roadmap";
import {
  getProject,
  isProjectSlug,
  PROJECT_LIST,
  releaseDetailPath,
  releaseListPath,
  roadmapPath,
  type ProjectSlug,
} from "@/lib/project-registry";

export const SITE_URL = "https://emersonfelipesp.com";

type CodeStep = {
  title: string;
  body: string | readonly string[];
  code?: string;
  codeLabel?: string;
};

type ConfigStep = {
  title: string;
  body: string | readonly string[];
};

type ScreenshotItem = {
  src: string;
  alt: string;
  caption: string;
};

type ScreenshotGroup = {
  id: string;
  title: string;
  items: readonly ScreenshotItem[];
};

type ProjectIntegration = {
  id: string;
  title: string;
  role: string;
  transport: string;
  direction: string;
  href: string;
  body: readonly string[];
  bullets: readonly string[];
};

type MarkdownProject = ProjectContent & {
  installation?: {
    git?: readonly CodeStep[];
    docker?: readonly CodeStep[];
    backend?: readonly CodeStep[];
  };
  configuration?: {
    endpoints?: readonly ConfigStep[];
    settings?: readonly ConfigStep[];
  };
  screenshots?: readonly ScreenshotGroup[];
  integrations?: readonly ProjectIntegration[];
};

type MarkdownRouteKind =
  | "home"
  | "project"
  | "developer"
  | "roadmap"
  | "release-index"
  | "release-detail";

type MarkdownRoute = {
  path: string;
  title: string;
  description: string;
  kind: MarkdownRouteKind;
  project?: ProjectSlug;
};

const PROJECT_CONTENT: Record<ProjectSlug, MarkdownProject> = {
  "netbox-proxbox": netboxProxbox,
  "proxbox-api": proxboxApi,
  "netbox-sdk": netboxSdk,
  "proxmox-sdk": proxmoxSdk,
};

const DEVELOPER_CONTENT = {
  "netbox-proxbox": netboxProxboxDeveloper,
  "proxbox-api": proxboxApiDeveloper,
  "netbox-sdk": netboxSdkDeveloper,
  "proxmox-sdk": proxmoxSdkDeveloper,
} satisfies Record<ProjectSlug, DeveloperContent>;

function absolute(path: string): string {
  return `${SITE_URL}${path}`;
}

function normalizePath(pathname: string): string {
  const withoutQuery = pathname.split(/[?#]/, 1)[0] ?? "/";
  const withSlash = withoutQuery.startsWith("/")
    ? withoutQuery
    : `/${withoutQuery}`;
  const trimmed =
    withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : withSlash;
  return trimmed || "/";
}

function decodeSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function clean(value: string): string {
  return value.replace(/\r\n/g, "\n").trim();
}

function tableCell(value: string | number | null | undefined): string {
  return String(value ?? "n/a")
    .replace(/\n+/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

function list(items: readonly string[]): string {
  if (items.length === 0) return "";
  return items.map((item) => `- ${item}`).join("\n");
}

function paragraphs(items: readonly string[]): string {
  return items.map((item) => clean(item)).join("\n\n");
}

function section(title: string, body: string | null | undefined): string {
  const content = body?.trim();
  if (!content) return "";
  return `## ${title}\n\n${content}`;
}

function fenced(code: string, label = ""): string {
  return ["```" + label, code.trim(), "```"].join("\n");
}

function formatDate(iso: string | null): string {
  if (!iso) return "n/a";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "n/a";
  return date.toISOString().slice(0, 10);
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "n/a";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "n/a";
  return `${date.toISOString().replace("T", " ").slice(0, 16)} UTC`;
}

function formatBody(body: string | readonly string[]): string {
  return typeof body === "string" ? clean(body) : list(body);
}

function renderCodeSteps(title: string, steps?: readonly CodeStep[]): string {
  if (!steps?.length) return "";
  const lines = steps.flatMap((step, index) => {
    const parts = [
      `### ${index + 1}. ${step.title}`,
      "",
      formatBody(step.body),
    ];
    if (step.code) {
      parts.push("", fenced(step.code, step.codeLabel ?? "shell"));
    }
    return parts;
  });
  return `## ${title}\n\n${lines.join("\n\n")}`;
}

function renderConfigSteps(title: string, steps?: readonly ConfigStep[]): string {
  if (!steps?.length) return "";
  return `## ${title}\n\n${steps
    .map((step, index) =>
      [`### ${index + 1}. ${step.title}`, "", formatBody(step.body)].join(
        "\n",
      ),
    )
    .join("\n\n")}`;
}

function renderSimStep(step: SimStep): string {
  switch (step.kind) {
    case "banner":
      return fenced(step.lines.join("\n"));
    case "step":
      return `- ${step.text}`;
    case "info":
      return `  - ${step.text}`;
    case "spinner":
      return `- ${step.label}: ${step.ok}`;
    case "warn":
      return `- Warning: ${step.text}`;
    case "blank":
      return "";
    case "tip":
      return `- \`${step.cmd}\`${step.comment ? ` - ${step.comment}` : ""}`;
  }
}

function renderProjectInstall(project: MarkdownProject): string {
  const parts = [
    `Primary command:\n\n${fenced(project.install.primary, "shell")}`,
  ];
  if (project.install.note) parts.push(project.install.note);
  if (project.install.runScript?.length) {
    const script = project.install.runScript
      .map(renderSimStep)
      .filter(Boolean)
      .join("\n\n");
    parts.push(`### Installer flow\n\n${script}`);
  }
  return section("Install", parts.join("\n\n"));
}

async function renderProjectPage(slug: ProjectSlug): Promise<string> {
  const project = PROJECT_CONTENT[slug];
  const snapshot = await getGitHubSnapshot(slug);
  const latestRelease =
    snapshot?.releases.find((release) => release.latest)?.tag ??
    snapshot?.releases[0]?.tag ??
    project.meta.latestRelease ??
    null;

  const metaRows = [
    ["Canonical URL", absolute(`/${slug}`)],
    ["GitHub", project.links.repo ?? getProject(slug)?.repoUrl ?? "n/a"],
    ["Developer guide", absolute(`/${slug}/developer`)],
    ["Roadmap", absolute(`/${slug}/roadmap`)],
    ["Releases", absolute(releaseListPath(slug))],
    ["Stars", snapshot?.stars ?? project.meta.stars ?? null],
    ["Forks", snapshot?.forks ?? project.meta.forks ?? null],
    ["Latest release", latestRelease],
  ];

  const parts = [
    `# ${project.name}`,
    project.tagline,
    renderTable(["Field", "Value"], metaRows),
    section("Overview", paragraphs(project.description)),
    section("Features", list(project.features)),
    section("Stack", list(project.stack)),
    renderProjectInstall(project),
  ];

  if (project.integrations?.length) {
    parts.push(renderProjectIntegrations(project.integrations));
  }

  if (project.installation) {
    parts.push(
      renderCodeSteps("Source install path", project.installation.git),
      renderCodeSteps("Docker install path", project.installation.docker),
      renderCodeSteps("Backend install path", project.installation.backend),
    );
  }

  if (project.configuration) {
    parts.push(
      renderConfigSteps(
        "Endpoint configuration",
        project.configuration.endpoints,
      ),
      renderConfigSteps("Plugin settings", project.configuration.settings),
    );
  }

  if (project.screenshots?.length) {
    parts.push(renderScreenshots(project.screenshots));
  }

  parts.push(renderLinks(project.links));
  return finalize(parts);
}

function renderProjectIntegrations(
  integrations: readonly ProjectIntegration[],
): string {
  const lines = integrations.map((item) =>
    [
      `### ${item.title}`,
      "",
      renderTable(
        ["Field", "Value"],
        [
          ["Role", item.role],
          ["Transport", item.transport],
          ["Direction", item.direction],
          ["Page", absolute(item.href)],
        ],
      ),
      "",
      paragraphs(item.body),
      "",
      list(item.bullets),
    ].join("\n"),
  );
  return `## Integrations\n\n${lines.join("\n\n")}`;
}

function renderScreenshots(groups: readonly ScreenshotGroup[]): string {
  const lines = groups.map((group) =>
    [
      `### ${group.title}`,
      "",
      group.items
        .map(
          (item) =>
            `- ${item.caption} (${item.alt}) - ${absolute(item.src)}`,
        )
        .join("\n"),
    ].join("\n"),
  );
  return `## Screenshots\n\n${lines.join("\n\n")}`;
}

function renderLinks(links: Record<string, string>): string {
  const rows = Object.entries(links).map(([label, href]) => [label, href]);
  return section("Links", renderTable(["Label", "URL"], rows));
}

function renderHomePage(): string {
  const architecture = DICTIONARIES.en.home.architecture;
  return finalize([
    `# ${profile.name}`,
    profile.role,
    renderTable(
      ["Field", "Value"],
      [
        ["Handle", profile.handle],
        ["Location", profile.location],
        ["Company", profile.company],
        ["Communities", profile.communities.join(", ")],
        ["Email", profile.email],
      ],
    ),
    section("Bio", `${paragraphs(profile.bio)}\n\n${profile.motto}`),
    section(
      "Featured projects",
      featured
        .map(
          (project) =>
            `- [${project.name}](${absolute(project.href)}) - ${project.tagline} ${project.badge}`,
        )
        .join("\n"),
    ),
    section(
      "Project architecture",
      [
        architecture.heading,
        "",
        `- NetBox: ${architecture.nodes.netbox}`,
        `- netbox-proxbox: ${architecture.nodes.netboxProxbox}`,
        `- proxbox-api: ${architecture.nodes.proxboxApi}`,
        `- netbox-sdk: ${architecture.nodes.netboxSdk}`,
        `- NetBox REST API: ${architecture.nodes.netboxRest}`,
        `- proxmox-sdk: ${architecture.nodes.proxmoxSdk}`,
        `- Proxmox REST API: ${architecture.nodes.proxmoxRest}`,
        "",
        `Flow: NetBox -> ${architecture.edges.plugin} -> netbox-proxbox -> ${architecture.edges.httpSseWs} -> proxbox-api -> ${architecture.edges.rest} -> NetBox REST API / Proxmox REST API.`,
      ].join("\n"),
    ),
    section(
      "Skills",
      skills
        .map((group) => `### ${group.group}\n\n${list(group.items)}`)
        .join("\n\n"),
    ),
    section(
      "Social links",
      socials.map((item) => `- [${item.label}](${item.href})`).join("\n"),
    ),
    section(
      "Contact",
      `Use the contact form at ${absolute("/")} or email ${profile.email}.`,
    ),
  ]);
}

async function renderDeveloperPage(slug: ProjectSlug): Promise<string> {
  const page = DEVELOPER_CONTENT[slug];
  const project = getProject(slug);
  const snapshot = await getGitHubSnapshot(slug);
  const parts = [
    `# ${page.name} developer guide`,
    page.tagline,
    renderTable(
      ["Field", "Value"],
      [
        ["Canonical URL", absolute(`/${slug}/developer`)],
        ["Showcase", absolute(`/${slug}`)],
        ["GitHub", project?.repoUrl ?? `https://github.com/${page.fullName}`],
        ["Releases", absolute(releaseListPath(slug))],
        ["Release snapshot synced", snapshot?.syncedAt ?? null],
      ],
    ),
    section("Intro", paragraphs(page.intro)),
    section("Architecture", list(page.architecture.bullets)),
    renderDeveloperIntegrations(page),
    renderContributing(page),
    renderCi(page),
    renderE2e(page),
    renderLinks(page.links),
  ];
  return finalize(parts);
}

function renderDeveloperIntegrations(page: DeveloperContent): string {
  if (!page.integrations.length) return "";
  return section(
    "Integrations",
    renderTable(
      ["Target", "Protocol", "Library", "Notes"],
      page.integrations.map((item) => [
        item.target,
        item.protocol,
        item.library,
        item.notes ?? "",
      ]),
    ),
  );
}

function renderContributing(page: DeveloperContent): string {
  return section(
    "Contributing",
    [
      "Development install:",
      "",
      fenced(page.contributing.devInstall, "shell"),
      "",
      "Pre-PR checks:",
      "",
      page.contributing.checks
        .map((check) => `- ${check.label}: \`${check.cmd}\``)
        .join("\n"),
      "",
      "Code style:",
      "",
      list(page.contributing.codeStyle),
      "",
      `Issues: ${page.contributing.issuesUrl}`,
    ].join("\n"),
  );
}

function renderCi(page: DeveloperContent): string {
  if (!page.ci) return "";
  return section(
    "CI",
    [
      paragraphs(page.ci.intro),
      "",
      renderTable(
        ["Workflow", "Trigger", "Purpose"],
        page.ci.workflows.map((item) => [
          item.name,
          item.trigger,
          item.purpose,
        ]),
      ),
      page.ci.notes?.length ? `\n${list(page.ci.notes)}` : "",
    ].join("\n"),
  );
}

function renderE2e(page: DeveloperContent): string {
  return section(
    "End-to-end tests",
    [
      `Framework: ${page.e2e.framework}`,
      "",
      paragraphs(page.e2e.intro),
      "",
      "Commands:",
      "",
      page.e2e.commands
        .map((command) => `- ${command.label}: \`${command.cmd}\``)
        .join("\n"),
      "",
      "Coverage:",
      "",
      list(page.e2e.coverage),
      page.e2e.ciWorkflow
        ? `\nCI workflow: ${page.e2e.ciWorkflow}${
            page.e2e.ciWorkflowUrl ? ` (${page.e2e.ciWorkflowUrl})` : ""
          }`
        : "",
    ].join("\n"),
  );
}

async function renderRoadmapPage(slug: ProjectSlug): Promise<string> {
  const project = getProject(slug);
  const data = await loadRoadmap(slug);
  if (!data) {
    return finalize([
      `# ${project?.name ?? slug} roadmap`,
      `No roadmap snapshot is committed for ${slug}.`,
    ]);
  }
  return finalize([
    `# ${project?.name ?? slug} roadmap`,
    renderTable(
      ["Field", "Value"],
      [
        ["Canonical URL", absolute(`/${slug}/roadmap`)],
        ["Repository", data.repo],
        ["Generated", formatDateTime(data.generated_at)],
        ["Open issues", data.counts.open],
        ["Closed issues", data.counts.closed],
        ["Dependency edges", data.counts.edges],
      ],
    ),
    renderRoadmapTimeline(data),
    renderRoadmapMilestones(data),
    renderRoadmapIssues(data),
  ]);
}

function renderRoadmapTimeline(data: Roadmap): string {
  if (!data.timeline.length) return "";
  return section(
    "Timeline",
    data.timeline
      .map(
        (phase) =>
          `### Phase ${phase.phase} (${phase.kind})\n\n${phase.note}\n\nIssues: ${phase.issues
            .map((issue) => `#${issue}`)
            .join(", ")}`,
      )
      .join("\n\n"),
  );
}

function renderRoadmapMilestones(data: Roadmap): string {
  if (!data.milestones.length) return "";
  return section(
    "Milestones",
    renderTable(
      ["Milestone", "State", "Due", "Open", "Closed", "URL"],
      data.milestones.map((milestone) => [
        milestone.title,
        milestone.state,
        milestone.due_on ? formatDate(milestone.due_on) : "n/a",
        milestone.open,
        milestone.closed,
        milestone.url ?? "",
      ]),
    ),
  );
}

function renderRoadmapIssues(data: Roadmap): string {
  if (!data.nodes.length) return "";
  return section(
    "Issues",
    renderTable(
      ["Issue", "State", "Title", "Milestone", "Blocked by", "URL"],
      data.nodes.map((node) => [
        `#${node.number}`,
        node.state,
        node.title,
        node.milestone?.title ?? "",
        node.blocked_by.length
          ? node.blocked_by.map((issue) => `#${issue}`).join(", ")
          : "",
        node.url,
      ]),
    ),
  );
}

async function renderReleaseListPage(slug: ProjectSlug): Promise<string | null> {
  const project = getProject(slug);
  const snapshot = await getGitHubSnapshot(slug);
  if (!project || !snapshot) return null;

  return finalize([
    `# ${project.name} releases`,
    project.tagline,
    renderTable(
      ["Field", "Value"],
      [
        ["Canonical URL", absolute(releaseListPath(slug))],
        ["GitHub releases", project.releasesUrl],
        ["Repository", snapshot.fullName],
        ["Synced", formatDateTime(snapshot.syncedAt)],
        ["Release count", snapshot.releases.length],
        ["Stars", snapshot.stars ?? null],
        ["Forks", snapshot.forks ?? null],
      ],
    ),
    section(
      "Release index",
      snapshot.releases
        .map(
          (release) =>
            `- [${release.name}](${absolute(
              releaseDetailPath(slug, release.tag),
            )}) - ${release.tag} - ${formatDate(
              release.publishedAt,
            )} - ${release.latest ? "latest" : release.prerelease ? "pre-release" : "stable"}`,
        )
        .join("\n"),
    ),
  ]);
}

async function renderReleaseDetailPage(
  slug: ProjectSlug,
  tag: string,
): Promise<string | null> {
  const project = getProject(slug);
  const snapshot = await getGitHubSnapshot(slug);
  const release = snapshot?.releases.find((item) => item.tag === tag);
  if (!project || !snapshot || !release) return null;

  return finalize([
    `# ${project.name} ${release.tag}`,
    release.name,
    renderReleaseMeta(slug, release, snapshot),
    section(
      "Release notes",
      release.body.trim() ? release.body : "This release has no notes.",
    ),
    renderReleaseAssets(release),
  ]);
}

function renderReleaseMeta(
  slug: ProjectSlug,
  release: GitHubRelease,
  snapshot: GitHubSnapshot,
): string {
  return renderTable(
    ["Field", "Value"],
    [
      ["Canonical URL", absolute(releaseDetailPath(slug, release.tag))],
      ["GitHub URL", release.url],
      ["Tag", release.tag],
      ["State", release.latest ? "latest" : release.prerelease ? "pre-release" : "stable"],
      ["Author", release.author?.login ?? null],
      ["Created", formatDateTime(release.createdAt)],
      ["Published", formatDateTime(release.publishedAt)],
      ["Target", release.targetCommitish ?? null],
      ["Synced", formatDateTime(snapshot.syncedAt)],
      ["Assets", release.assets.length],
    ],
  );
}

function renderReleaseAssets(release: GitHubRelease): string {
  const assetRows = release.assets.map((asset) => [
    asset.name,
    asset.contentType ?? "",
    asset.size,
    asset.downloadCount,
    asset.browserDownloadUrl,
  ]);
  const sourceRows = [
    ["zip", release.sourceArchives.zipballUrl],
    ["tar.gz", release.sourceArchives.tarballUrl],
  ];
  return section(
    "Assets",
    [
      assetRows.length
        ? renderTable(
            ["Name", "Type", "Size bytes", "Downloads", "URL"],
            assetRows,
          )
        : "No binary assets attached.",
      "",
      "Source archives:",
      "",
      renderTable(["Format", "URL"], sourceRows),
    ].join("\n"),
  );
}

function renderTable(
  headers: readonly string[],
  rows: readonly (readonly (string | number | null | undefined)[])[],
): string {
  if (!rows.length) return "";
  return [
    `| ${headers.map(tableCell).join(" |")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(tableCell).join(" | ")} |`),
  ].join("\n");
}

function finalize(parts: readonly (string | null | undefined)[]): string {
  return `${parts
    .map((part) => part?.trim())
    .filter(Boolean)
    .join("\n\n")}\n`;
}

export async function getMarkdownForPath(
  pathname: string,
): Promise<string | null> {
  const normalized = normalizePath(pathname);
  if (normalized === "/") return renderHomePage();

  const segments = normalized
    .slice(1)
    .split("/")
    .filter(Boolean)
    .map(decodeSegment);
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
  const routes: MarkdownRoute[] = [
    {
      path: "/",
      title: profile.name,
      description: profile.role,
      kind: "home",
    },
  ];

  for (const project of PROJECT_LIST) {
    routes.push(
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
    );

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
  }

  return routes;
}

function renderRouteIndex(
  routes: readonly MarkdownRoute[],
  kind: MarkdownRouteKind,
): string {
  return routes
    .filter((route) => route.kind === kind)
    .map(
      (route) =>
        `- [${route.title}](${absolute(route.path)}) - ${route.description}`,
    )
    .join("\n");
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
        "All public HTML pages support content negotiation.",
        "",
        fenced(
          `curl -H "Accept: text/markdown" ${SITE_URL}/netbox-sdk`,
          "shell",
        ),
        "",
        `A Markdown sitemap is available at ${absolute("/sitemap.md")}.`,
        `A plain sitemap alias is available at ${absolute("/sitemap.txt")}.`,
        `Full concatenated site content is available at ${absolute(
          "/llms-full.txt",
        )}.`,
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
  const pages: string[] = [];
  for (const route of routes) {
    const markdown = await getMarkdownForPath(route.path);
    if (!markdown) continue;
    pages.push(
      finalize([
        `# Source: ${absolute(route.path)}`,
        `Title: ${route.title}`,
        `Description: ${route.description}`,
        markdown,
      ]),
    );
  }
  return finalize([
    "# emersonfelipesp.com full Markdown content",
    "This file concatenates all public Markdown page equivalents.",
    pages.join("\n\n---\n\n"),
  ]);
}
