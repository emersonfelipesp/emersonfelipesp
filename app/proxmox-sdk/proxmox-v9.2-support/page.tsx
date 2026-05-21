import type { Metadata } from "next";
import { proxmoxPve92 as p } from "@/content/proxmox-sdk-pve92";
import { loadProjectShellData } from "@/lib/project-shell";
import { incrementView } from "@/lib/views";
import { ProxmoxV92ArticleContent } from "@/components/project/ProxmoxV92ArticleContent";
import { getProxmoxPve92 } from "@/lib/i18n/projects";

export const metadata: Metadata = {
  title: "Proxmox VE 9.2 support in proxmox-sdk — new API endpoints",
  description: p.intro[0],
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  const [, shell] = await Promise.all([
    incrementView("/proxmox-sdk/proxmox-v9.2-support"),
    loadProjectShellData("proxmox-sdk"),
  ]);
  return (
    <ProxmoxV92ArticleContent
      base={p}
      localize={getProxmoxPve92}
      releases={shell.releases}
      repo={shell.repo}
    />
  );
}
