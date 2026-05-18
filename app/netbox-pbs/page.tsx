import type { Metadata } from "next";
import { netboxPbs as p } from "@/content/netbox-pbs";
import { NetboxPbsContent } from "@/components/project/NetboxPbsContent";
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
    slug: "netbox-pbs",
    render: (shell) => (
      <NetboxPbsContent releases={shell.releases} repo={shell.repo} />
    ),
  });
}
