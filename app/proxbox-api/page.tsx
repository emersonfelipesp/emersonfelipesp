import type { Metadata } from "next";
import { proxboxApi as p } from "@/content/proxbox-api";
import { incrementView } from "@/lib/views";
import { loadProjectShellData } from "@/lib/project-shell";
import { ProxboxApiContent } from "@/components/project/ProxboxApiContent";
import {
  renderThemedMarkdownIfRequested,
  type PageSearchParams,
} from "@/components/markdown/ThemedMarkdownView";
import { JsonLd } from "@/components/seo/JsonLd";
import { createProjectMetadata, projectJsonLd } from "@/lib/seo";

export const metadata: Metadata = createProjectMetadata(p);

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: PageSearchParams;
};

export default async function Page({
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  const markdownView = await renderThemedMarkdownIfRequested(
    searchParams,
    `/${p.slug}`,
  );
  if (markdownView) return markdownView;

  const [, shell] = await Promise.all([
    incrementView(`/${p.slug}`),
    loadProjectShellData("proxbox-api"),
  ]);
  return (
    <>
      <JsonLd data={projectJsonLd(p)} />
      <ProxboxApiContent releases={shell.releases} repo={shell.repo} />
    </>
  );
}
