import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReleaseListContent } from "@/components/project/ReleasePages";
import { getGitHubSnapshot } from "@/lib/github";
import { incrementView } from "@/lib/views";
import { getReleaseProject, releaseListPath } from "@/lib/release-projects";

type PageProps = {
  params: Promise<{ project: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { project: slug } = await params;
  const project = getReleaseProject(slug);
  if (!project) return {};

  return {
    title: `${project.name} releases`,
    description: `Release notes, assets, and source archives for ${project.name}.`,
    alternates: {
      canonical: releaseListPath(project.slug),
    },
  };
}

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { project: slug } = await params;
  const project = getReleaseProject(slug);
  if (!project) notFound();

  const [snapshot] = await Promise.all([
    getGitHubSnapshot(project.slug),
    incrementView(releaseListPath(project.slug)),
  ]);

  if (!snapshot) notFound();

  return <ReleaseListContent project={project} snapshot={snapshot} />;
}
