import type { Metadata } from "next";
import { netboxProxbox as p } from "@/content/netbox-proxbox";
import { incrementView } from "@/lib/views";
import { getStaticReleases, getStaticStars } from "@/lib/github";
import { NetboxProxboxContent } from "@/components/project/NetboxProxboxContent";

export const metadata: Metadata = {
  title: `${p.name} ~ NetBox + Proxmox sync`,
  description: p.tagline,
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  const [, releases, stars] = await Promise.all([
    incrementView(`/${p.slug}`),
    getStaticReleases(p.slug, p.fullName, 30),
    getStaticStars(p.slug, p.fullName),
  ]);
  return <NetboxProxboxContent releases={releases} stars={stars} />;
}
