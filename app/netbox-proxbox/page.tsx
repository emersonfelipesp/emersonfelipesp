import type { Metadata } from "next";
import { netboxProxbox as p } from "@/content/netbox-proxbox";
import { incrementView } from "@/lib/views";
import { loadProjectShellData } from "@/lib/project-shell";
import { NetboxProxboxContent } from "@/components/project/NetboxProxboxContent";

export const metadata: Metadata = {
  title: `${p.name} ~ NetBox + Proxmox sync`,
  description: p.tagline,
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  const [, shell] = await Promise.all([
    incrementView(`/${p.slug}`),
    loadProjectShellData("netbox-proxbox"),
  ]);
  return (
    <NetboxProxboxContent releases={shell.releases} repo={shell.repo} />
  );
}
