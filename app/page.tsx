import type { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";
import {
  renderThemedMarkdownIfRequested,
  type PageSearchParams,
} from "@/components/markdown/ThemedMarkdownView";

export const metadata: Metadata = {
  title: "emersonfelipesp ~ NetDevOps & Network Automation",
  description:
    "Software developer & network automation engineer. NetBox + Proxmox open source maintainer.",
};

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
  return <HomeContent />;
}
