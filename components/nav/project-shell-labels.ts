"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { SectionAction } from "@/components/nav/SectionNav";
import { getProjectShellMeta } from "@/lib/project-shell-meta";

export function useProjectShellActions(
  slug: string,
): readonly SectionAction[] {
  const { t } = useLanguage();
  const meta = getProjectShellMeta(slug);
  if (!meta) return [];
  return meta.actions.map((a) => ({
    ...a,
    label:
      a.icon === "github"
        ? t.project.actions.github
        : a.icon === "pypi"
          ? t.project.actions.pypi
          : t.project.actions.docker,
  }));
}
