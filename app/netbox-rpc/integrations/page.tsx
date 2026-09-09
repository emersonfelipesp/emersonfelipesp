import type { Metadata } from "next";
import { createNetboxRpcIntegrationsMetadata } from "@/lib/seo/metadata";
import { loadProjectShellData } from "@/lib/project-shell";
import { incrementView } from "@/lib/views";
import { NetboxRpcIntegrationsContent } from "@/components/project/NetboxRpcIntegrationsContent";
import {
  renderThemedMarkdownIfRequested,
  type PageSearchParams,
} from "@/components/markdown/ThemedMarkdownView";

export const metadata: Metadata = createNetboxRpcIntegrationsMetadata();

export const dynamic = "force-dynamic";

type Props = {
  searchParams: PageSearchParams;
};

export default async function Page({
  searchParams,
}: Props): Promise<React.JSX.Element> {
  const path = "/netbox-rpc/integrations";
  const markdownView = await renderThemedMarkdownIfRequested(searchParams, path);
  if (markdownView) return markdownView;

  const [, shell] = await Promise.all([
    incrementView(path),
    loadProjectShellData("netbox-rpc"),
  ]);

  return (
    <NetboxRpcIntegrationsContent releases={shell.releases} repo={shell.repo} />
  );
}

