import type { Metadata } from "next";
import { proxmoxSdk as p } from "@/content/proxmox-sdk";
import { incrementView } from "@/lib/views";
import { ProxmoxSdkContent } from "@/components/project/ProxmoxSdkContent";

export const metadata: Metadata = {
  title: `${p.name} ~ Schema-driven Proxmox SDK`,
  description: p.tagline,
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  await incrementView(`/${p.slug}`);
  return <ProxmoxSdkContent />;
}
