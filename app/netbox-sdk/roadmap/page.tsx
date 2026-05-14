import type { Metadata } from "next";
import { incrementView } from "@/lib/views";
import { loadRoadmap } from "@/lib/roadmap";
import { RoadmapEmpty, RoadmapView } from "@/components/project/RoadmapView";

export const metadata: Metadata = {
  title: "netbox-sdk ~ roadmap",
  description:
    "Top-down dependency graph and phased timeline of every netbox-sdk issue, derived from GitHub Issue Dependencies.",
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  const [, data] = await Promise.all([
    incrementView("/netbox-sdk/roadmap"),
    loadRoadmap("netbox-sdk"),
  ]);
  if (!data) return <RoadmapEmpty project="netbox-sdk" />;
  return <RoadmapView data={data} />;
}
