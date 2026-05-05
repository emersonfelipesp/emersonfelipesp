"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ProjectViewToggle } from "@/components/nav/ProjectViewToggle";
import { useScrollCompact } from "@/components/nav/use-scroll-compact";
import { getProjectFromPath, PROJECT_LIST } from "@/lib/project-registry";
import type { ProjectSlug } from "@/lib/project-registry";

export function TopNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const projectRoute = getProjectFromPath(pathname);
  const showViewToggle =
    projectRoute !== null &&
    (projectRoute.view === "showcase" || projectRoute.view === "developer");
  const compact = useScrollCompact();
  const navRef = useRef<HTMLElement>(null);

  const projectLabels: Record<ProjectSlug, string> = {
    "netbox-proxbox": t.nav.netboxProxbox,
    "proxbox-api": t.nav.proxboxApi,
    "netbox-sdk": t.nav.netboxSdk,
    "proxmox-sdk": t.nav.proxmoxSdk,
  };

  const links = [
    { href: "/", label: t.nav.home },
    ...PROJECT_LIST.map((project) => ({
      href: project.projectPath,
      label: projectLabels[project.slug],
    })),
  ];

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--topnav-h", `${h}px`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [compact]);

  return (
    <nav
      ref={navRef}
      aria-label="Top navigation"
      className="sticky top-0 z-40 border border-border bg-surface/90 px-3 backdrop-blur"
    >
      <ul className="nav-magnetic flex flex-wrap gap-y-2 text-xs">
        {links.map((l) => {
          const isActive = pathname === l.href;
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive ? "page" : undefined}
                className={`block px-2 py-4 transition-all duration-150 ${
                  isActive
                    ? "text-accent"
                    : "text-muted hover:bg-accent/15 hover:text-accent"
                }`}
              >
                [{l.label}]
              </Link>
            </li>
          );
        })}
        {showViewToggle ? (
          <li className="ml-auto">
            <ProjectViewToggle
              slug={projectRoute.slug}
              current={projectRoute.view as "showcase" | "developer"}
              compact={compact}
            />
          </li>
        ) : null}
        <li className={showViewToggle ? "" : "ml-auto"}>
          <LanguageToggle compact={compact} />
        </li>
        <li>
          <ThemeToggle compact={compact} />
        </li>
      </ul>
    </nav>
  );
}
