import type { Metadata } from "next";
import { netboxSdk as p } from "@/content/netbox-sdk";
import { getNetboxSdkMeta } from "@/lib/netbox-sdk-meta";
import { NetboxSdkContent } from "@/components/project/NetboxSdkContent";
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
    slug: "netbox-sdk",
    loadExtra: getNetboxSdkMeta,
    render: (shell, liveMeta) => (
      <NetboxSdkContent
        liveMeta={liveMeta ?? null}
        releases={shell.releases}
        repo={shell.repo}
      />
    ),
  });
}
