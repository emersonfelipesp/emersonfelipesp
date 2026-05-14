import type { Metadata } from "next";
import { proxmoxSdkDeveloper as p } from "@/content/proxmox-sdk-developer";
import {
  renderDeveloperGuidePage,
  type RouteSearchParams,
} from "@/lib/page-shells";
import { createDeveloperMetadata } from "@/lib/seo";

export const metadata: Metadata = createDeveloperMetadata(p);

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: RouteSearchParams): Promise<React.JSX.Element> {
  return renderDeveloperGuidePage({
    searchParams,
    page: p,
    slug: "proxmox-sdk",
  });
}
