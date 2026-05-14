import type { JSX } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { DeveloperContent, ProjectContent } from "@/content/types";
import {
  renderThemedMarkdownIfRequested,
  type PageSearchParams,
} from "@/components/markdown/ThemedMarkdownView";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProjectDeveloperContent } from "@/components/project/ProjectDeveloperContent";
import { RoadmapEmpty, RoadmapView } from "@/components/project/RoadmapView";
import { ReleaseDetailContent, ReleaseListContent } from "@/components/project/ReleasePages";
import { getGitHubSnapshot } from "@/lib/github";
import { loadProjectShellData, type ProjectShellData } from "@/lib/project-shell";
import { PROJECTS, type ProjectSlug } from "@/lib/project-registry";
import {
  getReleaseProject,
  releaseDetailPath,
  releaseListPath,
} from "@/lib/release-projects";
import { loadRoadmap } from "@/lib/roadmap";
import { incrementView } from "@/lib/views";
import {
  createReleaseDetailMetadata,
  createReleaseListMetadata,
  developerJsonLd,
  projectJsonLd,
  releaseDetailJsonLd,
  releaseListJsonLd,
  roadmapJsonLd,
} from "@/lib/seo";

export type RouteSearchParams = {
  searchParams: PageSearchParams;
};

type ProjectPageOptions<TExtra = undefined> = RouteSearchParams & {
  project: ProjectContent;
  slug: ProjectSlug;
  loadExtra?: () => Promise<TExtra>;
  render: (shell: ProjectShellData, extra: TExtra | undefined) => JSX.Element;
};

export async function renderProjectShowcasePage<TExtra = undefined>({
  searchParams,
  project,
  slug,
  loadExtra,
  render,
}: ProjectPageOptions<TExtra>): Promise<JSX.Element> {
  const path = `/${slug}`;
  const markdownView = await renderThemedMarkdownIfRequested(searchParams, path);
  if (markdownView) return markdownView;

  const [, shell, extra] = await Promise.all([
    incrementView(path),
    loadProjectShellData(slug),
    loadExtra ? loadExtra() : Promise.resolve(undefined),
  ]);

  return (
    <>
      <JsonLd data={projectJsonLd(project)} />
      {render(shell, extra)}
    </>
  );
}

type DeveloperPageOptions = RouteSearchParams & {
  page: DeveloperContent;
  slug: ProjectSlug;
};

export async function renderDeveloperGuidePage({
  searchParams,
  page,
  slug,
}: DeveloperPageOptions): Promise<JSX.Element> {
  const path = `/${slug}/developer`;
  const markdownView = await renderThemedMarkdownIfRequested(searchParams, path);
  if (markdownView) return markdownView;

  const [, shell] = await Promise.all([
    incrementView(path),
    loadProjectShellData(slug),
  ]);

  return (
    <>
      <JsonLd data={developerJsonLd(page)} />
      <ProjectDeveloperContent
        base={page}
        githubUrl={`https://github.com/${page.fullName}`}
        releases={shell.releases}
        repo={shell.repo}
      />
    </>
  );
}

type RoadmapPageOptions = RouteSearchParams & {
  slug: ProjectSlug;
};

export async function renderRoadmapPage({
  searchParams,
  slug,
}: RoadmapPageOptions): Promise<JSX.Element> {
  const path = `/${slug}/roadmap`;
  const markdownView = await renderThemedMarkdownIfRequested(searchParams, path);
  if (markdownView) return markdownView;

  const data = await loadRoadmap(slug);
  if (!data) return <RoadmapEmpty project={slug} />;

  await incrementView(path);

  return (
    <>
      <JsonLd data={roadmapJsonLd(PROJECTS[slug], data.generated_at)} />
      <RoadmapView data={data} />
    </>
  );
}

export type ReleaseListPageProps = RouteSearchParams & {
  params: Promise<{ project: string }>;
};

export async function createReleaseListPageMetadata({
  params,
}: ReleaseListPageProps): Promise<Metadata> {
  const { project: slug } = await params;
  const project = getReleaseProject(slug);
  return project ? createReleaseListMetadata(project) : {};
}

export async function renderReleaseListPage({
  params,
  searchParams,
}: ReleaseListPageProps): Promise<JSX.Element> {
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

export type ReleaseDetailPageProps = RouteSearchParams & {
  params: Promise<{ project: string; tag: string[] }>;
};

export async function createReleaseDetailPageMetadata({
  params,
}: ReleaseDetailPageProps): Promise<Metadata> {
  const { project: slug, tag: tagParts } = await params;
  const project = getReleaseProject(slug);
  if (!project) return {};

  const tag = tagParts.join("/");
  const snapshot = await getGitHubSnapshot(project.slug);
  const release = snapshot?.releases.find((item) => item.tag === tag);

  return createReleaseDetailMetadata(project, release ?? null);
}

export async function renderReleaseDetailPage({
  params,
  searchParams,
}: ReleaseDetailPageProps): Promise<JSX.Element> {
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
