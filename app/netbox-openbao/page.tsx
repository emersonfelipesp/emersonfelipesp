import type { Metadata } from "next";
import { netboxOpenbao as p } from "@/content/netbox-openbao";
import { NetboxOpenbaoContent } from "@/components/project/NetboxOpenbaoContent";
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
    slug: "netbox-openbao",
    render: (shell) => (
      <NetboxOpenbaoContent releases={shell.releases} repo={shell.repo} />
    ),
  });
}
