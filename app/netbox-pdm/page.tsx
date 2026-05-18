import type { Metadata } from "next";
import { netboxPdm as p } from "@/content/netbox-pdm";
import { NetboxPdmContent } from "@/components/project/NetboxPdmContent";
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
    slug: "netbox-pdm",
    render: (shell) => (
      <NetboxPdmContent releases={shell.releases} repo={shell.repo} />
    ),
  });
}
