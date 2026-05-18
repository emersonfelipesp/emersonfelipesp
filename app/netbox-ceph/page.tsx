import type { Metadata } from "next";
import { netboxCeph as p } from "@/content/netbox-ceph";
import { NetboxCephContent } from "@/components/project/NetboxCephContent";
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
    slug: "netbox-ceph",
    render: (shell) => (
      <NetboxCephContent releases={shell.releases} repo={shell.repo} />
    ),
  });
}
