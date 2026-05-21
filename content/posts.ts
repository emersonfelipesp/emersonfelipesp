import type { Palette } from "@/lib/project-registry";
import { proxmoxerComparison } from "./proxmox-sdk-proxmoxer-comparison";
import { netboxSdkPynetboxComparison } from "./netbox-sdk-pynetbox-comparison";
import { proxmoxPve92 } from "./proxmox-sdk-pve92";

export type PostKind = "article" | "comparison";

export type Post = {
  href: string;
  title: string;
  kind: PostKind;
  palette: Palette;
  project: string;
  published?: string;
  tagline: string;
};

export const POSTS: readonly Post[] = [
  {
    href: "/proxmox-sdk/proxmox-v9.2-support",
    title: "Proxmox VE 9.2 support in proxmox-sdk",
    kind: "article",
    palette: "proxmox",
    project: "proxmox-sdk",
    published: proxmoxPve92.published,
    tagline: proxmoxPve92.tagline,
  },
  {
    href: "/proxmox-sdk/proxmoxer-comparison",
    title: proxmoxerComparison.name,
    kind: "comparison",
    palette: "proxmox",
    project: "proxmox-sdk",
    tagline: proxmoxerComparison.tagline,
  },
  {
    href: "/netbox-sdk/pynetbox-comparison",
    title: netboxSdkPynetboxComparison.name,
    kind: "comparison",
    palette: "netbox",
    project: "netbox-sdk",
    tagline: netboxSdkPynetboxComparison.tagline,
  },
];
