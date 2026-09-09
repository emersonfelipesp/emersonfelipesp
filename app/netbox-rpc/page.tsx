import type { Metadata } from "next";
import { netboxRpc as p } from "@/content/netbox-rpc";
import { NetboxRpcContent } from "@/components/project/NetboxRpcContent";
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
    slug: "netbox-rpc",
    render: (shell) => (
      <NetboxRpcContent releases={shell.releases} repo={shell.repo} />
    ),
  });
}

