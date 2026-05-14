import type { DeveloperContent } from "@/content/types";
import { getGitHubSnapshot } from "@/lib/github";
import {
  getProject,
  releaseListPath,
  type ProjectSlug,
} from "@/lib/project-registry";
import { DEVELOPER_CONTENT } from "./data";
import {
  absolute,
  fenced,
  finalize,
  list,
  paragraphs,
  renderTable,
  section,
} from "./format";

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

function renderLinks(links: Record<string, string>): string {
  const rows = Object.entries(links).map(([label, href]) => [label, href]);
  return section("Links", renderTable(["Label", "URL"], rows));
}

export async function renderDeveloperPage(
  slug: ProjectSlug,
): Promise<string> {
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
