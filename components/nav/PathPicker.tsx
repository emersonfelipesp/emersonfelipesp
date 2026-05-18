"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ListboxPicker } from "@/components/nav/ListboxPicker";
import { useProjectLabels } from "@/components/nav/use-project-labels";
import {
  TOP_LEVEL_PROJECT_LIST,
  getChildProjects,
  getProjectFromPath,
} from "@/lib/project-registry";

const PROXBOX_CHILDREN = getChildProjects("netbox-proxbox");

type Props = {
  pathname: string;
};

export function PathPicker({ pathname }: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const projectLabels = useProjectLabels();

  const items = [
    { id: "/", label: t.nav.home },
    ...TOP_LEVEL_PROJECT_LIST.flatMap((project) => {
      const main = { id: project.projectPath, label: projectLabels[project.slug] };
      if (project.slug === "netbox-proxbox") {
        return [
          main,
          ...PROXBOX_CHILDREN.map((child) => ({
            id: child.projectPath,
            label: `↳ ${projectLabels[child.slug]}`,
          })),
        ];
      }
      return [main];
    }),
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
