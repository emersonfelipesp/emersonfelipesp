import type { Metadata } from "next";
import { proxboxApi as p } from "@/content/proxbox-api";
import { ProxboxApiContent } from "@/components/project/ProxboxApiContent";
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
    slug: "proxbox-api",
    render: (shell) => (
      <ProxboxApiContent releases={shell.releases} repo={shell.repo} />
    ),
  });
}
