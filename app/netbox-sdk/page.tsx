import type { Metadata } from "next";
import { netboxSdk as p } from "@/content/netbox-sdk";
import { getNetboxSdkMeta } from "@/lib/netbox-sdk-meta";
import { incrementView } from "@/lib/views";
import { getStaticReleases, getStaticStars } from "@/lib/github";
import { NetboxSdkContent } from "@/components/project/NetboxSdkContent";

export const metadata: Metadata = {
  title: `${p.name} ~ NetBox SDK + CLI + TUI`,
  description: p.tagline,
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  const [liveMeta, , releases, stars] = await Promise.all([
    getNetboxSdkMeta(),
    incrementView(`/${p.slug}`),
    getStaticReleases(p.slug, p.fullName, 30),
    getStaticStars(p.slug, p.fullName),
  ]);

  return (
    <NetboxSdkContent liveMeta={liveMeta} releases={releases} stars={stars} />
  );
}
