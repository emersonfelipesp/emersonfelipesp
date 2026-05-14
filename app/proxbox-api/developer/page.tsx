import type { Metadata } from "next";
import { proxboxApiDeveloper as p } from "@/content/proxbox-api-developer";
import { incrementView } from "@/lib/views";
import { ProjectDeveloperContent } from "@/components/project/ProjectDeveloperContent";
import { loadProjectShellData } from "@/lib/project-shell";
import {
  renderThemedMarkdownIfRequested,
  type PageSearchParams,
} from "@/components/markdown/ThemedMarkdownView";

export const metadata: Metadata = {
  title: `${p.name} ~ developer guide`,
  description: p.tagline,
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: PageSearchParams;
};

export default async function Page({
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  const markdownView = await renderThemedMarkdownIfRequested(
    searchParams,
    `/${p.slug}/developer`,
  );
  if (markdownView) return markdownView;

  const [, shell] = await Promise.all([
    incrementView(`/${p.slug}/developer`),
    loadProjectShellData("proxbox-api"),
  ]);
  return (
    <ProjectDeveloperContent
      base={p}
      githubUrl={`https://github.com/${p.fullName}`}
      releases={shell.releases}
      repo={shell.repo}
    />
  );
}
