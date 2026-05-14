import type { Metadata } from "next";
import { netboxProxbox as p } from "@/content/netbox-proxbox";
import { NetboxProxboxContent } from "@/components/project/NetboxProxboxContent";
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
    slug: "netbox-proxbox",
    render: (shell) => (
      <NetboxProxboxContent releases={shell.releases} repo={shell.repo} />
    ),
  });
}
