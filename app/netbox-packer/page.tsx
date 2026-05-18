import type { Metadata } from "next";
import { netboxPacker as p } from "@/content/netbox-packer";
import { NetboxPackerContent } from "@/components/project/NetboxPackerContent";
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
    slug: "netbox-packer",
    render: (shell) => (
      <NetboxPackerContent releases={shell.releases} repo={shell.repo} />
    ),
  });
}
