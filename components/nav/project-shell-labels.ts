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
  const actionLabels = {
    github: t.project.actions.github,
    pypi: t.project.actions.pypi,
    docker: t.project.actions.docker,
    docs: t.project.actions.docs,
  } as const;
  return meta.actions.map((a) => ({
    ...a,
    label: actionLabels[a.icon],
  }));
}
