"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { ProjectSlug } from "@/lib/project-registry";

export function useProjectLabels(): Record<ProjectSlug, string> {
  const { t } = useLanguage();
  return {
    "netbox-proxbox": t.nav.netboxProxbox,
    "proxbox-api": t.nav.proxboxApi,
    "netbox-sdk": t.nav.netboxSdk,
    "proxmox-sdk": t.nav.proxmoxSdk,
  };
}
