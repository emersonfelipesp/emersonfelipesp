"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ListboxPicker } from "@/components/nav/ListboxPicker";
import type { Section } from "./SectionNav";

type Props = {
  sections: readonly Section[];
  activeId: string;
  onPick: (id: string) => void;
};

export function SectionPicker({ sections, activeId, onPick }: Props) {
  const { t } = useLanguage();
  const items = sections.map((s) => ({ id: s.id, label: s.label }));

  return (
    <ListboxPicker
      items={items}
      activeId={activeId}
      triggerLabel={(it) => `[# ${it.label}]`}
      itemLabel={(it) => `# ${it.label}`}
      triggerAria={(it) => t.nav.sectionPickerAria(it.label)}
      listboxAria={t.nav.sectionPickerLabel}
      onPick={(it) => onPick(it.id)}
    />
  );
}
