import type { Metadata } from "next";
import { SponsorContent } from "@/components/home/SponsorContent";
import {
  renderThemedMarkdownIfRequested,
  type PageSearchParams,
} from "@/components/markdown/ThemedMarkdownView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sponsor ~ emersonfelipesp",
  description:
    "Sponsor Emerson Felipe on GitHub Sponsors to support open-source NetBox, Proxmox, and NetDevOps tooling.",
  alternates: { canonical: "/sponsor" },
};

type PageProps = { searchParams: PageSearchParams };

export default async function SponsorPage({
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  const markdownView = await renderThemedMarkdownIfRequested(
    searchParams,
    "/sponsor",
  );
  if (markdownView) return markdownView;
  return <SponsorContent />;
}
