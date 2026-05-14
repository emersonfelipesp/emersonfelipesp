import { loadRoadmap, type Roadmap } from "@/lib/roadmap";
import {
  getProject,
  type ProjectSlug,
} from "@/lib/project-registry";
import {
  absolute,
  finalize,
  formatDate,
  formatDateTime,
  renderTable,
  section,
} from "./format";

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

export async function renderRoadmapPage(slug: ProjectSlug): Promise<string> {
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
