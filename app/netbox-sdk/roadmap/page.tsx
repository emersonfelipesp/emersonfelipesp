import type { Metadata } from "next";
import { PROJECTS } from "@/lib/project-registry";
import { renderRoadmapPage, type RouteSearchParams } from "@/lib/page-shells";
import { createRoadmapMetadata } from "@/lib/seo";

const project = PROJECTS["netbox-sdk"];

export const metadata: Metadata = createRoadmapMetadata(project);

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: RouteSearchParams): Promise<React.JSX.Element> {
  return renderRoadmapPage({ searchParams, slug: "netbox-sdk" });
}
