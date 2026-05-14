import type { Metadata } from "next";
import { incrementView } from "@/lib/views";
import { loadRoadmap } from "@/lib/roadmap";
import { RoadmapEmpty, RoadmapView } from "@/components/project/RoadmapView";
import {
  renderThemedMarkdownIfRequested,
  type PageSearchParams,
} from "@/components/markdown/ThemedMarkdownView";

export const metadata: Metadata = {
  title: "netbox-sdk ~ roadmap",
  description:
    "Top-down dependency graph and phased timeline of every netbox-sdk issue, derived from GitHub Issue Dependencies.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: PageSearchParams;
};

export default async function Page({
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  const path = "/netbox-sdk/roadmap";
  const markdownView = await renderThemedMarkdownIfRequested(
    searchParams,
    path,
  );
  if (markdownView) return markdownView;

  const data = await loadRoadmap("netbox-sdk");
  if (!data) return <RoadmapEmpty project="netbox-sdk" />;
  await incrementView(path);
  return <RoadmapView data={data} />;
}
