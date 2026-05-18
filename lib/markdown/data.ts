import { netboxProxbox } from "@/content/netbox-proxbox";
import { netboxProxboxDeveloper } from "@/content/netbox-proxbox-developer";
import { netboxSdk } from "@/content/netbox-sdk";
import { netboxSdkDeveloper } from "@/content/netbox-sdk-developer";
import { proxboxApi } from "@/content/proxbox-api";
import { proxboxApiDeveloper } from "@/content/proxbox-api-developer";
import { proxmoxSdk } from "@/content/proxmox-sdk";
import { proxmoxSdkDeveloper } from "@/content/proxmox-sdk-developer";
import { netboxPbs } from "@/content/netbox-pbs";
import { netboxPdm } from "@/content/netbox-pdm";
import { netboxCeph } from "@/content/netbox-ceph";
import { netboxPacker } from "@/content/netbox-packer";
import type {
  DeveloperContent,
  ProjectContent,
} from "@/content/types";
import type { ProjectSlug } from "@/lib/project-registry";

function stubDeveloper(p: ProjectContent): DeveloperContent {
  return {
    slug: p.slug,
    name: p.name,
    fullName: p.fullName,
    palette: p.palette,
    tagline: p.tagline,
    banner: p.banner,
    sections: [{ id: "overview", label: "overview" }],
    intro: p.description as string[],
    architecture: { bullets: p.stack as string[] },
    integrations: [],
    contributing: {
      devInstall: `pip install -e ".[dev]"`,
      checks: [],
      codeStyle: ["ruff", "black"],
      issuesUrl: `https://github.com/${p.fullName}/issues`,
    },
    e2e: {
      framework: "pytest",
      intro: ["Run the test suite against a live NetBox instance."],
      commands: [{ label: "unit", cmd: "pytest tests/" }],
      coverage: ["plugin models", "REST API endpoints"],
    },
    links: p.links,
  };
}

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
  | "sponsor"
  | "community";

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
  "netbox-pbs": netboxPbs,
  "netbox-pdm": netboxPdm,
  "netbox-ceph": netboxCeph,
  "netbox-packer": netboxPacker,
};

export const DEVELOPER_CONTENT = {
  "netbox-proxbox": netboxProxboxDeveloper,
  "proxbox-api": proxboxApiDeveloper,
  "netbox-sdk": netboxSdkDeveloper,
  "proxmox-sdk": proxmoxSdkDeveloper,
  "netbox-pbs": stubDeveloper(netboxPbs),
  "netbox-pdm": stubDeveloper(netboxPdm),
  "netbox-ceph": stubDeveloper(netboxCeph),
  "netbox-packer": stubDeveloper(netboxPacker),
} satisfies Record<ProjectSlug, DeveloperContent>;
