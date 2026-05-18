import { getProject } from "@/lib/project-registry";
import { COMMUNITY_URLS } from "@/lib/community-fetch";
import { absolute, finalize, section } from "./format";

export async function renderCommunityPage(slug: string): Promise<string | null> {
  if (slug !== "netbox-proxbox") return null;
  const project = getProject("netbox-proxbox");
  if (!project) return null;

  return finalize([
    `# ${project.name} Community`,
    `> Community discussion threads for ${project.name} across the Proxmox Forum and Reddit.`,
    section(
      "Proxmox Forum",
      [
        `Platform: Proxmox Community Forum (XenForo)`,
        `Thread: Proxbox – NetBox plugin for syncing Proxmox VE inventory into NetBox`,
        `URL: ${COMMUNITY_URLS.proxmoxForum}`,
        ``,
        `Discussion thread on the official Proxmox community forum covering installation,`,
        `configuration, troubleshooting, and feature requests for netbox-proxbox.`,
      ].join("\n"),
    ),
    section(
      "Reddit r/Proxmox",
      [
        `Platform: Reddit r/Proxmox`,
        `Post: Proxbox – NetBox plugin for syncing Proxmox VE inventory into NetBox`,
        `URL: ${COMMUNITY_URLS.redditProxmox}`,
        ``,
        `Announcement and discussion thread for netbox-proxbox on the r/Proxmox subreddit,`,
        `targeting the Proxmox VE user community.`,
      ].join("\n"),
    ),
    section(
      "Reddit r/Netbox",
      [
        `Platform: Reddit r/Netbox`,
        `Post: Proxbox – NetBox plugin for syncing Proxmox VE inventory into NetBox`,
        `URL: ${COMMUNITY_URLS.redditNetbox}`,
        ``,
        `Announcement and discussion thread for netbox-proxbox on the r/Netbox subreddit,`,
        `targeting the NetBox DCIM/IPAM community.`,
      ].join("\n"),
    ),
    section(
      "Related pages",
      [
        `- [${project.name} showcase](${absolute("/netbox-proxbox")})`,
        `- [${project.name} developer guide](${absolute("/netbox-proxbox/developer")})`,
        `- [${project.name} releases](${absolute("/netbox-proxbox/releases")})`,
        `- [GitHub](${project.repoUrl})`,
      ].join("\n"),
    ),
  ]);
}
