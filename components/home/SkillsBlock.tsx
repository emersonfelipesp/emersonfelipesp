"use client";

import { skills } from "@/content/profile";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function SkillsBlock() {
  const { t } = useLanguage();
  return (
    <div className="border border-border bg-surface p-5">
      <p className="mb-3 text-xs text-muted">$ cat ~/.config/skills.toml</p>
      <ul className="space-y-2 text-sm">
        {skills.map((s) => {
          const label =
            t.home.skills.groups[s.group as keyof typeof t.home.skills.groups] ??
            s.group;
          return (
            <li key={s.group}>
              <span className="text-accent-2">[{label}]</span>
              <span className="text-muted"> = </span>
              <span className="text-fg/90">[{s.items.join(", ")}]</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
