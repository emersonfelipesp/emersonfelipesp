import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReleaseDetailContent } from "@/components/project/ReleasePages";
import { getGitHubSnapshot } from "@/lib/github";
import { incrementView } from "@/lib/views";
import {
  getReleaseProject,
  releaseDetailPath,
} from "@/lib/release-projects";
import {
  renderThemedMarkdownIfRequested,
  type PageSearchParams,
} from "@/components/markdown/ThemedMarkdownView";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  createReleaseDetailMetadata,
  releaseDetailJsonLd,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ project: string; tag: string[] }>;
  searchParams: PageSearchParams;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { project: slug, tag: tagParts } = await params;
  const project = getReleaseProject(slug);
  if (!project) return {};

  const tag = tagParts.join("/");
  const snapshot = await getGitHubSnapshot(project.slug);
  const release = snapshot?.releases.find((item) => item.tag === tag);

  return createReleaseDetailMetadata(project, release ?? null);
}

export default async function Page({
  params,
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  const { project: slug, tag: tagParts } = await params;
  const tag = tagParts.join("/");
  const markdownView = await renderThemedMarkdownIfRequested(
    searchParams,
    `/${slug}/releases/${tag}`,
  );
  if (markdownView) return markdownView;

  const project = getReleaseProject(slug);
  if (!project) notFound();

  const [snapshot] = await Promise.all([
    getGitHubSnapshot(project.slug),
    incrementView(releaseDetailPath(project.slug, tag)),
  ]);

  const release = snapshot?.releases.find((item) => item.tag === tag);
  if (!snapshot || !release) notFound();

  return (
    <>
      <JsonLd data={releaseDetailJsonLd(project, release)} />
      <ReleaseDetailContent
        project={project}
        snapshot={snapshot}
        release={release}
      />
    </>
  );
}
