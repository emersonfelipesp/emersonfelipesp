import { netboxProxbox } from "@/content/netbox-proxbox";
import { netboxProxboxDeveloper } from "@/content/netbox-proxbox-developer";
import { netboxSdk } from "@/content/netbox-sdk";
import { netboxSdkDeveloper } from "@/content/netbox-sdk-developer";
import { proxboxApi } from "@/content/proxbox-api";
import { proxboxApiDeveloper } from "@/content/proxbox-api-developer";
import { proxmoxSdk } from "@/content/proxmox-sdk";
import { proxmoxSdkDeveloper } from "@/content/proxmox-sdk-developer";
import type {
  DeveloperContent,
  ProjectContent,
} from "@/content/types";
import type { ProjectSlug } from "@/lib/project-registry";

export type CodeStep = {
  title: string;
  body: string | readonly string[];
  code?: string;
  codeLabel?: string;
};

export type ConfigStep = {
  title: string;
  body: string | readonly string[];
};

type ScreenshotItem = {
  src: string;
  alt: string;
  caption: string;
};

export type ScreenshotGroup = {
  id: string;
  title: string;
  items: readonly ScreenshotItem[];
};

export type ProjectIntegration = {
  id: string;
  title: string;
  role: string;
  transport: string;
  direction: string;
  href: string;
  body: readonly string[];
  bullets: readonly string[];
};

export type MarkdownProject = ProjectContent & {
  installation?: {
    git?: readonly CodeStep[];
    docker?: readonly CodeStep[];
    backend?: readonly CodeStep[];
  };
  configuration?: {
    endpoints?: readonly ConfigStep[];
    settings?: readonly ConfigStep[];
  };
  screenshots?: readonly ScreenshotGroup[];
  integrations?: readonly ProjectIntegration[];
};

export type MarkdownRouteKind =
  | "home"
  | "project"
  | "developer"
  | "roadmap"
  | "release-index"
  | "release-detail"
  | "sponsor";

export type MarkdownRoute = {
  path: string;
  title: string;
  description: string;
  kind: MarkdownRouteKind;
  project?: ProjectSlug;
};

export const PROJECT_CONTENT: Record<ProjectSlug, MarkdownProject> = {
  "netbox-proxbox": netboxProxbox,
  "proxbox-api": proxboxApi,
  "netbox-sdk": netboxSdk,
  "proxmox-sdk": proxmoxSdk,
};

export const DEVELOPER_CONTENT = {
  "netbox-proxbox": netboxProxboxDeveloper,
  "proxbox-api": proxboxApiDeveloper,
  "netbox-sdk": netboxSdkDeveloper,
  "proxmox-sdk": proxmoxSdkDeveloper,
} satisfies Record<ProjectSlug, DeveloperContent>;
