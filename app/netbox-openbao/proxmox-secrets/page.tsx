import type { Metadata } from "next";
import { createProxboxOpenbaoSecretsMetadata } from "@/lib/seo/metadata";
import { loadProjectShellData } from "@/lib/project-shell";
import { incrementView } from "@/lib/views";
import { ProxboxOpenbaoSecretsContent } from "@/components/project/ProxboxOpenbaoSecretsContent";
import {
  renderThemedMarkdownIfRequested,
  type PageSearchParams,
} from "@/components/markdown/ThemedMarkdownView";

export const metadata: Metadata = createProxboxOpenbaoSecretsMetadata();

export const dynamic = "force-dynamic";

type Props = {
  searchParams: PageSearchParams;
};

export default async function Page({
  searchParams,
}: Props): Promise<React.JSX.Element> {
  const path = "/netbox-openbao/proxmox-secrets";
  const markdownView = await renderThemedMarkdownIfRequested(searchParams, path);
  if (markdownView) return markdownView;

  const [, shell] = await Promise.all([
    incrementView(path),
    loadProjectShellData("netbox-openbao"),
  ]);

  return (
    <ProxboxOpenbaoSecretsContent releases={shell.releases} repo={shell.repo} />
  );
}
