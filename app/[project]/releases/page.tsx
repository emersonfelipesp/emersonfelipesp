import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReleaseListContent } from "@/components/project/ReleasePages";
import { getGitHubSnapshot } from "@/lib/github";
import { incrementView } from "@/lib/views";
import { getReleaseProject, releaseListPath } from "@/lib/release-projects";
import {
  renderThemedMarkdownIfRequested,
  type PageSearchParams,
} from "@/components/markdown/ThemedMarkdownView";
import { JsonLd } from "@/components/seo/JsonLd";
import { createReleaseListMetadata, releaseListJsonLd } from "@/lib/seo";

type PageProps = {
  params: Promise<{ project: string }>;
  searchParams: PageSearchParams;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { project: slug } = await params;
  const project = getReleaseProject(slug);
  if (!project) return {};

  return createReleaseListMetadata(project);
}

export default async function Page({
  params,
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  const { project: slug } = await params;
  const markdownView = await renderThemedMarkdownIfRequested(
    searchParams,
    `/${slug}/releases`,
  );
  if (markdownView) return markdownView;

  const project = getReleaseProject(slug);
  if (!project) notFound();

  const [snapshot] = await Promise.all([
    getGitHubSnapshot(project.slug),
    incrementView(releaseListPath(project.slug)),
  ]);

  if (!snapshot) notFound();

  return (
    <>
      <JsonLd data={releaseListJsonLd(project, snapshot)} />
      <ReleaseListContent project={project} snapshot={snapshot} />
    </>
  );
}
