import type { Metadata } from "next";
import { proxmoxerComparison as p } from "@/content/proxmox-sdk-proxmoxer-comparison";
import { loadProjectShellData } from "@/lib/project-shell";
import { incrementView } from "@/lib/views";
import { ComparisonPageContent } from "@/components/project/ComparisonPageContent";

export const metadata: Metadata = {
  title: "proxmoxer vs proxmox-sdk — Python Proxmox library comparison",
  description: p.intro[0],
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  const [, shell] = await Promise.all([
    incrementView("/proxmox-sdk/proxmoxer-comparison"),
    loadProjectShellData("proxmox-sdk"),
  ]);
  return (
    <ComparisonPageContent
      base={p}
      comparisonSlug="proxmoxer-comparison"
      releases={shell.releases}
      repo={shell.repo}
    />
  );
}
