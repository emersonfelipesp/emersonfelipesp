import type { Metadata } from "next";
import { proxboxApi as p } from "@/content/proxbox-api";
import { incrementView } from "@/lib/views";
import { getStaticReleases } from "@/lib/github";
import { ProxboxApiContent } from "@/components/project/ProxboxApiContent";

export const metadata: Metadata = {
  title: `${p.name} ~ FastAPI orchestrator for Proxbox`,
  description: p.tagline,
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  const [, releases] = await Promise.all([
    incrementView(`/${p.slug}`),
    getStaticReleases(p.slug, p.fullName, 30),
  ]);
  return <ProxboxApiContent releases={releases} />;
}
