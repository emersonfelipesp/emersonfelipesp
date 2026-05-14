import type { Metadata } from "next";
import { proxmoxSdk as p } from "@/content/proxmox-sdk";
import { ProxmoxSdkContent } from "@/components/project/ProxmoxSdkContent";
import {
  renderProjectShowcasePage,
  type RouteSearchParams,
} from "@/lib/page-shells";
import { createProjectMetadata } from "@/lib/seo";

export const metadata: Metadata = createProjectMetadata(p);

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: RouteSearchParams): Promise<React.JSX.Element> {
  return renderProjectShowcasePage({
    searchParams,
    project: p,
    slug: "proxmox-sdk",
    render: (shell) => (
      <ProxmoxSdkContent releases={shell.releases} repo={shell.repo} />
    ),
  });
}
