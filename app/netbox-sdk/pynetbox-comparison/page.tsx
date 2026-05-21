import type { Metadata } from "next";
import { netboxSdkPynetboxComparison as p } from "@/content/netbox-sdk-pynetbox-comparison";
import { loadProjectShellData } from "@/lib/project-shell";
import { incrementView } from "@/lib/views";
import { ComparisonPageContent } from "@/components/project/ComparisonPageContent";

export const metadata: Metadata = {
  title: "pynetbox vs netbox-sdk — Python NetBox library comparison",
  description: p.intro[0],
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  const [, shell] = await Promise.all([
    incrementView("/netbox-sdk/pynetbox-comparison"),
    loadProjectShellData("netbox-sdk"),
  ]);
  return (
    <ComparisonPageContent
      base={p}
      comparisonSlug="pynetbox-comparison"
      releases={shell.releases}
      repo={shell.repo}
    />
  );
}
