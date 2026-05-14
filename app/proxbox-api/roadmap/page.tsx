import type { Metadata } from "next";
import { incrementView } from "@/lib/views";
import { loadRoadmap } from "@/lib/roadmap";
import { RoadmapEmpty, RoadmapView } from "@/components/project/RoadmapView";

export const metadata: Metadata = {
  title: "proxbox-api ~ roadmap",
  description:
    "Top-down dependency graph and phased timeline of every proxbox-api issue, derived from GitHub Issue Dependencies.",
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  const [, data] = await Promise.all([
    incrementView("/proxbox-api/roadmap"),
    loadRoadmap("proxbox-api"),
  ]);
  if (!data) return <RoadmapEmpty project="proxbox-api" />;
  return <RoadmapView data={data} />;
}
