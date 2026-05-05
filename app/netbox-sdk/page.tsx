import type { Metadata } from "next";
import { netboxSdk as p } from "@/content/netbox-sdk";
import { getNetboxSdkMeta } from "@/lib/netbox-sdk-meta";
import { incrementView } from "@/lib/views";
import { NetboxSdkContent } from "@/components/project/NetboxSdkContent";

export const metadata: Metadata = {
  title: `${p.name} ~ NetBox SDK + CLI + TUI`,
  description: p.tagline,
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  const [liveMeta] = await Promise.all([
    getNetboxSdkMeta(),
    incrementView(`/${p.slug}`),
  ]);

  return <NetboxSdkContent liveMeta={liveMeta} />;
}
