import type { SimStep } from "@/content/types";
import {
  getGitHubSnapshot,
} from "@/lib/github";
import {
  getProject,
  releaseListPath,
  type ProjectSlug,
} from "@/lib/project-registry";
import {
  PROJECT_CONTENT,
  type CodeStep,
  type ConfigStep,
  type MarkdownProject,
  type ProjectIntegration,
  type ScreenshotGroup,
} from "./data";
import {
  absolute,
  fenced,
  finalize,
  formatBody,
  list,
  paragraphs,
  renderTable,
  section,
} from "./format";

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
      .flatMap((step) => {
        const line = renderSimStep(step);
        return line ? [line] : [];
      })
      .join("\n\n");
    parts.push(`### Installer flow\n\n${script}`);
  }
  return section("Install", parts.join("\n\n"));
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

export async function renderProjectPage(slug: ProjectSlug): Promise<string> {
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
