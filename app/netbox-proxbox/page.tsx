import type { Metadata } from "next";
import { netboxProxbox as p } from "@/content/netbox-proxbox";
import { incrementView } from "@/lib/views";
import { NetboxProxboxContent } from "@/components/project/NetboxProxboxContent";

export const metadata: Metadata = {
  title: `${p.name} ~ NetBox + Proxmox sync`,
  description: p.tagline,
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  await incrementView(`/${p.slug}`);
  return <NetboxProxboxContent />;
}
