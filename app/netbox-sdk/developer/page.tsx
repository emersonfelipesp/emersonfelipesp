import type { Metadata } from "next";
import { netboxSdkDeveloper as p } from "@/content/netbox-sdk-developer";
import { incrementView } from "@/lib/views";
import { ProjectDeveloperContent } from "@/components/project/ProjectDeveloperContent";
import { loadProjectShellData } from "@/lib/project-shell";
import {
  renderThemedMarkdownIfRequested,
  type PageSearchParams,
} from "@/components/markdown/ThemedMarkdownView";
import { JsonLd } from "@/components/seo/JsonLd";
import { createDeveloperMetadata, developerJsonLd } from "@/lib/seo";

export const metadata: Metadata = createDeveloperMetadata(p);

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
    loadProjectShellData("netbox-sdk"),
  ]);
  return (
    <>
      <JsonLd data={developerJsonLd(p)} />
      <ProjectDeveloperContent
        base={p}
        githubUrl={`https://github.com/${p.fullName}`}
        releases={shell.releases}
        repo={shell.repo}
      />
    </>
  );
}
