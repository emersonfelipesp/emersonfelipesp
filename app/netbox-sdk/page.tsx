import type { Metadata } from "next";
import { netboxSdk as p } from "@/content/netbox-sdk";
import { getNetboxSdkMeta } from "@/lib/netbox-sdk-meta";
import { incrementView } from "@/lib/views";
import { loadProjectShellData } from "@/lib/project-shell";
import { NetboxSdkContent } from "@/components/project/NetboxSdkContent";

export const metadata: Metadata = {
  title: `${p.name} ~ NetBox SDK + CLI + TUI`,
  description: p.tagline,
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  const [liveMeta, , shell] = await Promise.all([
    getNetboxSdkMeta(),
    incrementView(`/${p.slug}`),
    loadProjectShellData("netbox-sdk"),
  ]);

  return (
    <NetboxSdkContent
      liveMeta={liveMeta}
      releases={shell.releases}
      repo={shell.repo}
    />
  );
}
