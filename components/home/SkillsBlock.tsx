"use client";

import {
  useState,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from "react";
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
import { skills, type Skill } from "@/content/profile";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const MOBILE_VISIBLE = 2;

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

const SKILL_LINKS: Record<string, string> = {
  Python: "https://www.python.org",
  JavaScript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  TypeScript: "https://www.typescriptlang.org",
  Go: "https://go.dev",
  HTML: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  CSS: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  Django: "https://www.djangoproject.com",
  FastAPI: "https://fastapi.tiangolo.com",
  "Next.js": "https://nextjs.org",
  Bootstrap: "https://getbootstrap.com",
  Jinja2: "https://jinja.palletsprojects.com",
  PostgreSQL: "https://www.postgresql.org",
  MongoDB: "https://www.mongodb.com",
  SQLite: "https://www.sqlite.org",
  NetBox: "https://netboxlabs.com",
  Proxmox: "https://www.proxmox.com",
  Docker: "https://www.docker.com",
  Zabbix: "https://www.zabbix.com",
  Grafana: "https://grafana.com",
  Linux: "https://www.kernel.org",
  Cisco: "https://www.cisco.com",
  Huawei: "https://www.huawei.com",
  Mikrotik: "https://mikrotik.com",
  Dell: "https://www.dell.com",
  "A10 Networks": "https://www.a10networks.com",
};

function SkillItemBody({ item }: { item: string }): ReactNode {
  const Icon = SKILL_ICONS[item];
  return (
    <>
      {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
      <span>{item}</span>
    </>
  );
}

function SkillItemLink({
  item,
  className,
}: {
  item: string;
  className: string;
}) {
  const href = SKILL_LINKS[item];
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={item}
        className={className}
      >
        <SkillItemBody item={item} />
      </a>
    );
  }
  return (
    <span className={className}>
      <SkillItemBody item={item} />
    </span>
  );
}

function SkillRow({ skill, label }: { skill: Skill; label: string }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const hidden = expanded
    ? 0
    : Math.max(skill.items.length - MOBILE_VISIBLE, 0);
  const subListId = `skills-${skill.group}-more`;

  return (
    <li className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className="text-accent-2">[{label}]</span>
      <span className="text-muted">=</span>
      <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-fg/90">
        {skill.items.map((item, idx) => {
          const hideOnMobile = idx >= MOBILE_VISIBLE || expanded;
          const wrapperClass = hideOnMobile
            ? "hidden sm:inline-flex items-center"
            : "inline-flex items-center";
          const hasComma = idx < skill.items.length - 1;
          const commaHide = idx >= MOBILE_VISIBLE - 1 || expanded;
          const commaClass = commaHide
            ? "ml-1 text-muted hidden sm:inline"
            : "ml-1 text-muted";
          return (
            <span key={item} className={wrapperClass}>
              <SkillItemLink
                item={item}
                className="inline-flex items-center gap-1.5 hover:text-accent"
              />
              {hasComma && <span className={commaClass}>,</span>}
            </span>
          );
        })}
        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={subListId}
            aria-label={
              expanded
                ? t.home.skills.collapseAria(label, hidden)
                : t.home.skills.expandAria(label, hidden)
            }
            className="inline-flex items-center text-muted hover:text-accent sm:hidden"
          >
            {expanded
              ? `[− ${t.home.skills.lessShort} ▴]`
              : `[+${hidden} ${t.home.skills.moreShort} ▾]`}
          </button>
        )}
      </span>
      {expanded && (
        <ul
          id={subListId}
          className="mt-1 w-full space-y-1 pl-4 text-fg/90 sm:hidden"
          style={{ animation: "slide-in-down 150ms ease-out" }}
        >
          {skill.items.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="text-muted">→</span>
              <SkillItemLink
                item={item}
                className="inline-flex items-center gap-1.5 hover:text-accent"
              />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function SkillsBlock() {
  const { lang, t } = useLanguage();
  return (
    <div className="border border-border bg-surface p-5">
      <p className="mb-3 text-xs text-muted">$ cat ~/.config/skills.toml</p>
      <ul className="space-y-2 text-sm">
        {skills.map((s) => {
          const label =
            t.home.skills.groups[s.group as keyof typeof t.home.skills.groups] ??
            s.group;
          return <SkillRow key={`${s.group}-${lang}`} skill={s} label={label} />;
        })}
      </ul>
    </div>
  );
}
