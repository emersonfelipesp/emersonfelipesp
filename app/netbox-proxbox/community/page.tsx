import type { Metadata } from "next";
import { createCommunityMetadata } from "@/lib/seo";
import { fetchCommunityPosts } from "@/lib/community-fetch";
import { incrementView } from "@/lib/views";
import { NetboxProxboxCommunityContent } from "@/components/project/NetboxProxboxCommunityContent";
import {
  renderThemedMarkdownIfRequested,
  type PageSearchParams,
} from "@/components/markdown/ThemedMarkdownView";

export const metadata: Metadata = createCommunityMetadata();

export const dynamic = "force-dynamic";

type Props = {
  searchParams: PageSearchParams;
};

export default async function Page({
  searchParams,
}: Props): Promise<React.JSX.Element> {
  const path = "/netbox-proxbox/community";
  const markdownView = await renderThemedMarkdownIfRequested(searchParams, path);
  if (markdownView) return markdownView;

  const [data] = await Promise.all([
    fetchCommunityPosts(),
    incrementView(path),
  ]);

  return <NetboxProxboxCommunityContent data={data} />;
}
