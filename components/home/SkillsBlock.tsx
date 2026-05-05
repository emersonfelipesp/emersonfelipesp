"use client";

import type { ComponentType, SVGProps } from "react";
import {
  SiBootstrap,
  SiCisco,
  SiCss,
  SiDell,
  SiDjango,
  SiDocker,
  SiFastapi,
  SiGo,
  SiGrafana,
  SiHtml5,
  SiHuawei,
  SiJavascript,
  SiJinja,
  SiLinux,
  SiMikrotik,
  SiMongodb,
  SiNextdotjs,
  SiPostgresql,
  SiProxmox,
  SiPython,
  SiSqlite,
  SiTypescript,
} from "react-icons/si";
import { skills } from "@/content/profile";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;

const SKILL_ICONS: Record<string, IconComponent> = {
  Python: SiPython,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Go: SiGo,
  HTML: SiHtml5,
  CSS: SiCss,
  Django: SiDjango,
  FastAPI: SiFastapi,
  "Next.js": SiNextdotjs,
  Bootstrap: SiBootstrap,
  Jinja2: SiJinja,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  SQLite: SiSqlite,
  Proxmox: SiProxmox,
  Docker: SiDocker,
  Grafana: SiGrafana,
  Linux: SiLinux,
  Cisco: SiCisco,
  Huawei: SiHuawei,
  Mikrotik: SiMikrotik,
  Dell: SiDell,
};

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
            <li key={s.group} className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-accent-2">[{label}]</span>
              <span className="text-muted">=</span>
              <span className="text-muted">[</span>
              <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-fg/90">
                {s.items.map((item, idx) => {
                  const Icon = SKILL_ICONS[item];
                  return (
                    <span key={item} className="inline-flex items-center gap-1.5">
                      {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
                      <span>{item}</span>
                      {idx < s.items.length - 1 && (
                        <span className="ml-1 text-muted">,</span>
                      )}
                    </span>
                  );
                })}
              </span>
              <span className="text-muted">]</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
