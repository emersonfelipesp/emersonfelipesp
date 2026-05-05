import type { Metadata } from "next";
import { netboxSdkDeveloper as p } from "@/content/netbox-sdk-developer";
import { incrementView } from "@/lib/views";
import { ProjectDeveloperContent } from "@/components/project/ProjectDeveloperContent";
import { loadProjectShellData } from "@/lib/project-shell";

export const metadata: Metadata = {
  title: `${p.name} ~ developer guide`,
  description: p.tagline,
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  const [, shell] = await Promise.all([
    incrementView(`/${p.slug}/developer`),
    loadProjectShellData("netbox-sdk"),
  ]);
  return (
    <ProjectDeveloperContent
      base={p}
      githubUrl={`https://github.com/${p.fullName}`}
      releases={shell.releases}
      repo={shell.repo}
    />
  );
}
