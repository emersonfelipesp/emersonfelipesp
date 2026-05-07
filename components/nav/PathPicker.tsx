"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ListboxPicker } from "@/components/nav/ListboxPicker";
import { useProjectLabels } from "@/components/nav/use-project-labels";
import {
  PROJECT_LIST,
  getProjectFromPath,
} from "@/lib/project-registry";

type Props = {
  pathname: string;
};

export function PathPicker({ pathname }: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const projectLabels = useProjectLabels();

  const items = [
    { id: "/", label: t.nav.home },
    ...PROJECT_LIST.map((project) => ({
      id: project.projectPath,
      label: projectLabels[project.slug],
    })),
  ];

  const route = getProjectFromPath(pathname);
  const activeId = route !== null ? `/${route.slug}` : "/";

  return (
    <ListboxPicker
      items={items}
      activeId={activeId}
      triggerLabel={(it) => `[${it.label}]`}
      triggerAria={(it) => t.nav.routePickerAria(it.label)}
      listboxAria={t.nav.routePickerLabel}
      onPick={(it) => {
        if (it.id !== activeId) router.push(it.id);
      }}
    />
  );
}
