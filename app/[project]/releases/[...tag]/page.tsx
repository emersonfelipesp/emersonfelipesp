import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReleaseDetailContent } from "@/components/project/ReleasePages";
import { getGitHubSnapshot } from "@/lib/github";
import { incrementView } from "@/lib/views";
import {
  getReleaseProject,
  releaseDetailPath,
  releaseListPath,
} from "@/lib/release-projects";

type PageProps = {
  params: Promise<{ project: string; tag: string[] }>;
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
  const title = release ? `${project.name} ${release.tag}` : project.name;

  return {
    title,
    description: release
      ? `${release.name} release notes, assets, and source archives.`
      : `Release notes for ${project.name}.`,
    alternates: {
      canonical: release ? releaseDetailPath(project.slug, release.tag) : releaseListPath(project.slug),
    },
  };
}

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { project: slug, tag: tagParts } = await params;
  const project = getReleaseProject(slug);
  if (!project) notFound();

  const tag = tagParts.join("/");
  const [snapshot] = await Promise.all([
    getGitHubSnapshot(project.slug),
    incrementView(releaseDetailPath(project.slug, tag)),
  ]);

  const release = snapshot?.releases.find((item) => item.tag === tag);
  if (!snapshot || !release) notFound();

  return (
    <ReleaseDetailContent
      project={project}
      snapshot={snapshot}
      release={release}
    />
  );
}
