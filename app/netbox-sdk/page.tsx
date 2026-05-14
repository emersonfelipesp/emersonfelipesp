import type { Metadata } from "next";
import { netboxSdk as p } from "@/content/netbox-sdk";
import { getNetboxSdkMeta } from "@/lib/netbox-sdk-meta";
import { incrementView } from "@/lib/views";
import { loadProjectShellData } from "@/lib/project-shell";
import { NetboxSdkContent } from "@/components/project/NetboxSdkContent";
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

  const [liveMeta, , shell] = await Promise.all([
    getNetboxSdkMeta(),
    incrementView(`/${p.slug}`),
    loadProjectShellData("netbox-sdk"),
  ]);

  return (
    <>
      <JsonLd data={projectJsonLd(p)} />
      <NetboxSdkContent
        liveMeta={liveMeta}
        releases={shell.releases}
        repo={shell.repo}
      />
    </>
  );
}
