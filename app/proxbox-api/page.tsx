import type { Metadata } from "next";
import { proxboxApi as p } from "@/content/proxbox-api";
import { incrementView } from "@/lib/views";
import { loadProjectShellData } from "@/lib/project-shell";
import { ProxboxApiContent } from "@/components/project/ProxboxApiContent";

export const metadata: Metadata = {
  title: `${p.name} ~ FastAPI orchestrator for Proxbox`,
  description: p.tagline,
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  const [, shell] = await Promise.all([
    incrementView(`/${p.slug}`),
    loadProjectShellData("proxbox-api"),
  ]);
  return <ProxboxApiContent releases={shell.releases} repo={shell.repo} />;
}
