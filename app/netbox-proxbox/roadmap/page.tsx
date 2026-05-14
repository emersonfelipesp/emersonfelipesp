import type { Metadata } from "next";
import { incrementView } from "@/lib/views";
import { loadRoadmap } from "@/lib/roadmap";
import { RoadmapEmpty, RoadmapView } from "@/components/project/RoadmapView";
import {
  renderThemedMarkdownIfRequested,
  type PageSearchParams,
} from "@/components/markdown/ThemedMarkdownView";
import { JsonLd } from "@/components/seo/JsonLd";
import { PROJECTS } from "@/lib/project-registry";
import { createRoadmapMetadata, roadmapJsonLd } from "@/lib/seo";

const project = PROJECTS["netbox-proxbox"];

export const metadata: Metadata = createRoadmapMetadata(project);

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: PageSearchParams;
};

export default async function Page({
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  const path = "/netbox-proxbox/roadmap";
  const markdownView = await renderThemedMarkdownIfRequested(
    searchParams,
    path,
  );
  if (markdownView) return markdownView;

  const data = await loadRoadmap("netbox-proxbox");
  if (!data) return <RoadmapEmpty project="netbox-proxbox" />;
  await incrementView(path);
  return (
    <>
      <JsonLd data={roadmapJsonLd(project, data.generated_at)} />
      <RoadmapView data={data} />
    </>
  );
}
