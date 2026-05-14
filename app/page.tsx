import type { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";
import {
  renderThemedMarkdownIfRequested,
  type PageSearchParams,
} from "@/components/markdown/ThemedMarkdownView";
import { JsonLd } from "@/components/seo/JsonLd";
import { createHomeMetadata, homeJsonLd } from "@/lib/seo";

export const metadata: Metadata = createHomeMetadata();

type PageProps = {
  searchParams: PageSearchParams;
};

export default async function HomePage({
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  const markdownView = await renderThemedMarkdownIfRequested(
    searchParams,
    "/",
  );
  if (markdownView) return markdownView;
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <HomeContent />
    </>
  );
}
