import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dagre from "@dagrejs/dagre";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEST_FILE = path.resolve(
  __dirname,
  "../public/github-data/netbox-proxbox-roadmap.json",
);

const REPO_OWNER = "emersonfelipesp";
const REPO_NAME = "netbox-proxbox";
const FULL_NAME = `${REPO_OWNER}/${REPO_NAME}`;

const PER_PAGE = 100;
const NODE_WIDTH = 240;
const NODE_HEIGHT = 96;

type RawLabel =
  | string
  | {
      name?: unknown;
      color?: unknown;
    };

type RawMilestone = {
  title?: unknown;
  state?: unknown;
  due_on?: unknown;
  html_url?: unknown;
} | null;

type RawIssue = {
  number?: unknown;
  title?: unknown;
  state?: unknown;
  html_url?: unknown;
  closed_at?: unknown;
  pull_request?: unknown;
  labels?: unknown;
  milestone?: unknown;
};

type Label = { name: string; color: string | null };
type Milestone = {
  title: string;
  state: "open" | "closed";
  due_on: string | null;
  url: string | null;
};

type Issue = {
  number: number;
  title: string;
  state: "open" | "closed";
  url: string;
  closedAt: string | null;
  labels: Label[];
  milestone: Milestone | null;
};

type RoadmapNode = Issue & {
  x: number;
  y: number;
  w: number;
  h: number;
  blocked_by: number[];
};

type RoadmapEdge = { from: number; to: number; d: string };

type TimelinePhase = {
  phase: number;
  kind: "shipped" | "open";
  note: string;
  issues: number[];
};

type LabelCatalogueEntry = Label & { count: number };
type MilestoneCatalogueEntry = Milestone & { open: number; closed: number };

function ghHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "emersonfelipesp-site",
    "X-GitHub-Api-Version": "2022-11-28",
    ...extra,
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchJson(url: string, extraHeaders?: Record<string, string>): Promise<unknown> {
  const res = await fetch(url, { headers: ghHeaders(extraHeaders) });
  if (!res.ok) {
    throw new Error(`${url} -> HTTP ${res.status}`);
  }
  return res.json();
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function normalizeLabel(raw: RawLabel): Label | null {
  if (typeof raw === "string") {
    return raw ? { name: raw, color: null } : null;
  }
  if (!raw || typeof raw !== "object") return null;
  const name = asString(raw.name);
  if (!name) return null;
  return { name, color: asString(raw.color) };
}

function normalizeMilestone(raw: RawMilestone): Milestone | null {
  if (!raw || typeof raw !== "object") return null;
  const title = asString(raw.title);
  if (!title) return null;
  const state = raw.state === "closed" ? "closed" : "open";
  return {
    title,
    state,
    due_on: asString(raw.due_on),
    url: asString(raw.html_url),
  };
}

function normalizeIssue(raw: RawIssue): Issue | null {
  if (raw.pull_request) return null;
  if (typeof raw.number !== "number") return null;
  const title = asString(raw.title);
  const url = asString(raw.html_url);
  if (!title || !url) return null;
  const state: "open" | "closed" = raw.state === "closed" ? "closed" : "open";
  const labels = Array.isArray(raw.labels)
    ? raw.labels
        .map((l) => normalizeLabel(l as RawLabel))
        .filter((l): l is Label => l !== null)
    : [];
  return {
    number: raw.number,
    title,
    state,
    url,
    closedAt: asString(raw.closed_at),
    labels,
    milestone: normalizeMilestone(raw.milestone as RawMilestone),
  };
}

async function fetchAllIssues(): Promise<Issue[]> {
  const issues: Issue[] = [];
  for (let page = 1; ; page += 1) {
    const url = `https://api.github.com/repos/${FULL_NAME}/issues?state=all&per_page=${PER_PAGE}&page=${page}`;
    const raw = await fetchJson(url);
    if (!Array.isArray(raw)) {
      throw new Error(`github issues ${FULL_NAME} -> expected array`);
    }
    for (const item of raw) {
      const issue = normalizeIssue(item as RawIssue);
      if (issue) issues.push(issue);
    }
    if (raw.length < PER_PAGE) break;
  }
  return issues;
}

async function fetchBlockedBy(issueNumber: number): Promise<number[]> {
  const url = `https://api.github.com/repos/${FULL_NAME}/issues/${issueNumber}/dependencies/blocked_by?per_page=${PER_PAGE}`;
  try {
    const res = await fetch(url, {
      headers: ghHeaders({ "X-GitHub-Api-Version": "2022-11-28" }),
    });
    if (res.status === 404 || res.status === 410) return [];
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const raw = (await res.json()) as unknown;
    if (!Array.isArray(raw)) return [];
    const numbers: number[] = [];
    for (const entry of raw) {
      if (entry && typeof entry === "object") {
        const n = (entry as { number?: unknown }).number;
        if (typeof n === "number") numbers.push(n);
      }
    }
    return numbers;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(
      `[roadmap-sync] #${issueNumber}: blocked_by fetch failed (${msg}); treating as no edges.`,
    );
    return [];
  }
}

function layoutGraph(
  issues: Issue[],
  blockedByByNumber: Map<number, number[]>,
): {
  positions: Map<number, { x: number; y: number; w: number; h: number }>;
  edges: RoadmapEdge[];
  viewBox: string;
} {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", nodesep: 24, ranksep: 56, marginx: 16, marginy: 16 });
  g.setDefaultEdgeLabel(() => ({}));
  const layoutIssues = issues.filter((i) => i.state === "open");
  for (const issue of layoutIssues) {
    g.setNode(String(issue.number), { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  const issueNumbers = new Set(layoutIssues.map((i) => i.number));
  for (const [target, blockers] of blockedByByNumber) {
    if (!issueNumbers.has(target)) continue;
    for (const blocker of blockers) {
      if (!issueNumbers.has(blocker)) continue;
      g.setEdge(String(blocker), String(target));
    }
  }
  dagre.layout(g);

  const positions = new Map<number, { x: number; y: number; w: number; h: number }>();
  for (const issue of layoutIssues) {
    const node = g.node(String(issue.number));
    if (!node) continue;
    positions.set(issue.number, {
      x: node.x - node.width / 2,
      y: node.y - node.height / 2,
      w: node.width,
      h: node.height,
    });
  }

  const edges: RoadmapEdge[] = [];
  for (const e of g.edges()) {
    const points = (g.edge(e) as { points: { x: number; y: number }[] }).points;
    if (!points || points.length === 0) continue;
    const d =
      `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} ` +
      points
        .slice(1)
        .map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
        .join(" ");
    edges.push({ from: Number(e.v), to: Number(e.w), d });
  }

  const graph = g.graph() as { width?: number; height?: number };
  const width = Math.max(1, Math.ceil(graph.width ?? NODE_WIDTH));
  const height = Math.max(1, Math.ceil(graph.height ?? NODE_HEIGHT));
  return { positions, edges, viewBox: `0 0 ${width} ${height}` };
}

function computeTimeline(
  issues: Issue[],
  blockedByByNumber: Map<number, number[]>,
): TimelinePhase[] {
  const open = issues.filter((i) => i.state === "open");
  const closed = issues.filter((i) => i.state === "closed");
  const phases: TimelinePhase[] = [];

  if (closed.length > 0) {
    const sorted = [...closed].sort((a, b) => {
      const ad = a.closedAt ? Date.parse(a.closedAt) : 0;
      const bd = b.closedAt ? Date.parse(b.closedAt) : 0;
      return bd - ad;
    });
    phases.push({
      phase: 0,
      kind: "shipped",
      note: "shipped",
      issues: sorted.map((i) => i.number),
    });
  }

  const openSet = new Set(open.map((i) => i.number));
  const remaining = new Map<number, Set<number>>();
  for (const issue of open) {
    const blockers = (blockedByByNumber.get(issue.number) ?? []).filter((n) =>
      openSet.has(n),
    );
    remaining.set(issue.number, new Set(blockers));
  }

  let phase = 1;
  while (remaining.size > 0) {
    const ready: number[] = [];
    for (const [num, blockers] of remaining) {
      if (blockers.size === 0) ready.push(num);
    }
    if (ready.length === 0) {
      const stuck = [...remaining.keys()].sort((a, b) => a - b);
      phases.push({
        phase,
        kind: "open",
        note: `cycle (${stuck.length} issues with circular blockers)`,
        issues: stuck,
      });
      break;
    }
    ready.sort((a, b) => a - b);
    phases.push({
      phase,
      kind: "open",
      note: phase === 1 ? "start anywhere" : `phase ${phase}`,
      issues: ready,
    });
    for (const num of ready) remaining.delete(num);
    for (const blockers of remaining.values()) {
      for (const num of ready) blockers.delete(num);
    }
    phase += 1;
  }

  return phases;
}

function aggregateLabels(issues: Issue[]): LabelCatalogueEntry[] {
  const map = new Map<string, LabelCatalogueEntry>();
  for (const issue of issues) {
    for (const label of issue.labels) {
      const existing = map.get(label.name);
      if (existing) {
        existing.count += 1;
        if (!existing.color && label.color) existing.color = label.color;
      } else {
        map.set(label.name, { ...label, count: 1 });
      }
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function aggregateMilestones(issues: Issue[]): MilestoneCatalogueEntry[] {
  const map = new Map<string, MilestoneCatalogueEntry>();
  for (const issue of issues) {
    const m = issue.milestone;
    if (!m) continue;
    const key = m.title;
    const existing = map.get(key);
    if (existing) {
      if (issue.state === "open") existing.open += 1;
      else existing.closed += 1;
      if (!existing.due_on && m.due_on) existing.due_on = m.due_on;
      if (!existing.url && m.url) existing.url = m.url;
    } else {
      map.set(key, {
        ...m,
        open: issue.state === "open" ? 1 : 0,
        closed: issue.state === "closed" ? 1 : 0,
      });
    }
  }
  return [...map.values()].sort((a, b) => {
    const ad = a.due_on ? Date.parse(a.due_on) : Number.POSITIVE_INFINITY;
    const bd = b.due_on ? Date.parse(b.due_on) : Number.POSITIVE_INFINITY;
    if (ad !== bd) return ad - bd;
    return a.title.localeCompare(b.title);
  });
}

async function main(): Promise<void> {
  console.log(`[roadmap-sync] fetching issues for ${FULL_NAME}...`);
  const issues = await fetchAllIssues();
  console.log(
    `[roadmap-sync] ${issues.length} issue(s) (${issues.filter((i) => i.state === "open").length} open, ${issues.filter((i) => i.state === "closed").length} closed)`,
  );

  console.log(`[roadmap-sync] fetching blocked_by edges...`);
  const blockedByByNumber = new Map<number, number[]>();
  let edgeTotal = 0;
  for (const issue of issues) {
    const blockers = await fetchBlockedBy(issue.number);
    blockedByByNumber.set(issue.number, blockers);
    edgeTotal += blockers.length;
  }
  console.log(`[roadmap-sync] ${edgeTotal} blocked_by edge(s)`);

  console.log(`[roadmap-sync] running dagre layout...`);
  const { positions, edges, viewBox } = layoutGraph(issues, blockedByByNumber);

  const nodes: RoadmapNode[] = issues.map((issue) => {
    const pos = positions.get(issue.number);
    return {
      ...issue,
      x: pos?.x ?? 0,
      y: pos?.y ?? 0,
      w: pos?.w ?? NODE_WIDTH,
      h: pos?.h ?? NODE_HEIGHT,
      blocked_by: (blockedByByNumber.get(issue.number) ?? []).slice().sort((a, b) => a - b),
    };
  });

  const timeline = computeTimeline(issues, blockedByByNumber);
  const labels = aggregateLabels(issues);
  const milestones = aggregateMilestones(issues);

  const payload = {
    schema_version: 1 as const,
    generated_at: new Date().toISOString(),
    repo: FULL_NAME,
    counts: {
      open: issues.filter((i) => i.state === "open").length,
      closed: issues.filter((i) => i.state === "closed").length,
      edges: edgeTotal,
    },
    viewBox,
    nodes,
    edges,
    timeline,
    labels,
    milestones,
  };

  mkdirSync(path.dirname(DEST_FILE), { recursive: true });
  writeFileSync(DEST_FILE, JSON.stringify(payload, null, 2) + "\n");
  console.log(`[roadmap-sync] wrote ${DEST_FILE}`);
}

main().catch((err) => {
  console.error("[roadmap-sync] FATAL", err);
  process.exit(1);
});
