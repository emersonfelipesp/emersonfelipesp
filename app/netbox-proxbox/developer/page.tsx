import type { Metadata } from "next";
import { netboxProxboxDeveloper as p } from "@/content/netbox-proxbox-developer";
import { incrementView } from "@/lib/views";
import { ProjectDeveloperContent } from "@/components/project/ProjectDeveloperContent";

export const metadata: Metadata = {
  title: `${p.name} ~ developer guide`,
  description: p.tagline,
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  await incrementView(`/${p.slug}/developer`);
  return (
    <ProjectDeveloperContent
      base={p}
      githubUrl={`https://github.com/${p.fullName}`}
    />
  );
}
