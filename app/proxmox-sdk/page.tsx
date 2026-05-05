import type { Metadata } from "next";
import { proxmoxSdk as p } from "@/content/proxmox-sdk";
import { incrementView } from "@/lib/views";
import { getStaticReleases, getStaticStars } from "@/lib/github";
import { ProxmoxSdkContent } from "@/components/project/ProxmoxSdkContent";

export const metadata: Metadata = {
  title: `${p.name} ~ Schema-driven Proxmox SDK`,
  description: p.tagline,
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  const [, releases, stars] = await Promise.all([
    incrementView(`/${p.slug}`),
    getStaticReleases(p.slug, p.fullName, 30),
    getStaticStars(p.slug, p.fullName),
  ]);
  return <ProxmoxSdkContent releases={releases} stars={stars} />;
}
