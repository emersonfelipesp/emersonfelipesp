import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const labelSchema = z.object({
  name: z.string(),
  color: z.string().nullable(),
});

const milestoneSchema = z.object({
  title: z.string(),
  state: z.enum(["open", "closed"]),
  due_on: z.string().nullable(),
  url: z.string().nullable(),
});

const nodeSchema = z.object({
  number: z.number(),
  title: z.string(),
  state: z.enum(["open", "closed"]),
  url: z.string(),
  closedAt: z.string().nullable(),
  labels: z.array(labelSchema),
  milestone: milestoneSchema.nullable(),
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  blocked_by: z.array(z.number()),
});

const edgeSchema = z.object({
  from: z.number(),
  to: z.number(),
  d: z.string(),
});

const phaseSchema = z.object({
  phase: z.number(),
  kind: z.enum(["shipped", "open"]),
  note: z.string(),
  issues: z.array(z.number()),
});

export const RoadmapSchema = z.object({
  schema_version: z.literal(1),
  generated_at: z.string(),
  repo: z.string(),
  counts: z.object({
    open: z.number(),
    closed: z.number(),
    edges: z.number(),
  }),
  viewBox: z.string(),
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
  timeline: z.array(phaseSchema),
  labels: z.array(labelSchema.extend({ count: z.number() })),
  milestones: z.array(
    milestoneSchema.extend({ open: z.number(), closed: z.number() }),
  ),
});

export type Roadmap = z.infer<typeof RoadmapSchema>;
export type RoadmapNode = z.infer<typeof nodeSchema>;
export type RoadmapEdge = z.infer<typeof edgeSchema>;
export type RoadmapPhase = z.infer<typeof phaseSchema>;
export type RoadmapLabel = z.infer<typeof labelSchema>;
export type RoadmapMilestone = z.infer<typeof milestoneSchema>;

export async function loadRoadmap(): Promise<Roadmap | null> {
  try {
    const file = path.join(
      process.cwd(),
      "public/github-data",
      "netbox-proxbox-roadmap.json",
    );
    const raw = JSON.parse(await readFile(file, "utf8"));
    const parsed = RoadmapSchema.safeParse(raw);
    if (parsed.success) return parsed.data;
    console.warn("[roadmap] schema validation failed:", parsed.error.issues);
    return null;
  } catch (err) {
    console.warn("[roadmap] could not load snapshot:", err);
    return null;
  }
}
