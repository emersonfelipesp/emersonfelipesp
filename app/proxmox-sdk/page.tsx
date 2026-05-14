import type { Metadata } from "next";
import { proxmoxSdk as p } from "@/content/proxmox-sdk";
import { incrementView } from "@/lib/views";
import { loadProjectShellData } from "@/lib/project-shell";
import { ProxmoxSdkContent } from "@/components/project/ProxmoxSdkContent";
import {
  renderThemedMarkdownIfRequested,
  type PageSearchParams,
} from "@/components/markdown/ThemedMarkdownView";

export const metadata: Metadata = {
  title: `${p.name} ~ Schema-driven Proxmox SDK`,
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
    `/${p.slug}`,
  );
  if (markdownView) return markdownView;

  const [, shell] = await Promise.all([
    incrementView(`/${p.slug}`),
    loadProjectShellData("proxmox-sdk"),
  ]);
  return <ProxmoxSdkContent releases={shell.releases} repo={shell.repo} />;
}
