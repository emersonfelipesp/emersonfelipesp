import { featured, profile, skills, socials } from "@/content/profile";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import {
  absolute,
  finalize,
  list,
  paragraphs,
  renderTable,
  section,
} from "./format";

export function renderHomePage(): string {
  const architecture = DICTIONARIES.en.home.architecture;

  return finalize([
    `# ${profile.name}`,
    profile.role,
    renderTable(
      ["Field", "Value"],
      [
        ["Handle", profile.handle],
        ["Location", profile.location],
        ["Company", profile.company],
        ["Communities", profile.communities.join(", ")],
        ["Email", profile.email],
      ],
    ),
    section("Bio", `${paragraphs(profile.bio)}\n\n${profile.motto}`),
    section(
      "Featured projects",
      featured
        .map(
          (project) =>
            `- [${project.name}](${absolute(project.href)}) - ${project.tagline} ${project.badge}`,
        )
        .join("\n"),
    ),
    section(
      "Project architecture",
      [
        architecture.heading,
        "",
        `- NetBox: ${architecture.nodes.netbox}`,
        `- netbox-proxbox: ${architecture.nodes.netboxProxbox}`,
        `- proxbox-api: ${architecture.nodes.proxboxApi}`,
        `- netbox-sdk: ${architecture.nodes.netboxSdk}`,
        `- NetBox REST API: ${architecture.nodes.netboxRest}`,
        `- proxmox-sdk: ${architecture.nodes.proxmoxSdk}`,
        `- Proxmox REST API: ${architecture.nodes.proxmoxRest}`,
        "",
        `Flow: NetBox -> ${architecture.edges.plugin} -> netbox-proxbox -> ${architecture.edges.httpSseWs} -> proxbox-api -> ${architecture.edges.rest} -> NetBox REST API / Proxmox REST API.`,
      ].join("\n"),
    ),
    section(
      "Skills",
      skills
        .map((group) => `### ${group.group}\n\n${list(group.items)}`)
        .join("\n\n"),
    ),
    section(
      "Social links",
      socials.map((item) => `- [${item.label}](${item.href})`).join("\n"),
    ),
    section(
      "Contact",
      `Use the contact form at ${absolute("/")} or email ${profile.email}.`,
    ),
  ]);
}
