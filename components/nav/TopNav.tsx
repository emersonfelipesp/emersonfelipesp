"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ProjectViewToggle } from "@/components/nav/ProjectViewToggle";
import { PathPicker } from "@/components/nav/PathPicker";
import { useProjectLabels } from "@/components/nav/use-project-labels";
import { useScrollCompact } from "@/components/nav/use-scroll-compact";
import { getProjectFromPath, PROJECT_LIST } from "@/lib/project-registry";

export function TopNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const projectLabels = useProjectLabels();
  const projectRoute = getProjectFromPath(pathname);
  const showViewToggle =
    projectRoute !== null &&
    (projectRoute.view === "showcase" ||
      projectRoute.view === "developer" ||
      projectRoute.view === "roadmap");
  const compact = useScrollCompact();
  const navRef = useRef<HTMLElement>(null);

  const links = [
    { href: "/", label: t.nav.home },
    ...PROJECT_LIST.map((project) => ({
      href: project.projectPath,
      label: projectLabels[project.slug],
    })),
    { href: "/sponsor", label: t.nav.sponsor },
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
      className="sticky top-0 z-40 min-h-[6.25rem] border border-border bg-surface/90 px-3 backdrop-blur sm:min-h-[3.125rem]"
    >
      <ul className="nav-magnetic flex flex-wrap items-center gap-y-2 text-xs sm:hidden">
        <li>
          <PathPicker pathname={pathname} />
        </li>
        {showViewToggle ? (
          <li className="ml-auto">
            <ProjectViewToggle
              slug={projectRoute.slug}
              current={
                projectRoute.view as "showcase" | "developer" | "roadmap"
              }
              compact
            />
          </li>
        ) : null}
        <li className={showViewToggle ? "" : "ml-auto"}>
          <LanguageToggle compact />
        </li>
        <li>
          <ThemeToggle compact />
        </li>
        <li className="flex items-center">
          <a
            href="https://github.com/sponsors/emersonfelipesp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.sponsorButtonAria}
            className="inline-flex items-center border border-border bg-surface-2 px-2 py-1 text-xs text-muted transition-colors duration-150 hover:border-accent hover:bg-accent/15 hover:text-accent"
          >
            [{t.nav.sponsorButtonLabel}]
          </a>
        </li>
      </ul>
      <ul className="nav-magnetic hidden flex-wrap items-center gap-y-2 text-xs sm:flex">
        {links.map((l) => {
          const isActive = pathname === l.href;
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive ? "page" : undefined}
                className={`block px-2 py-4 transition-colors duration-150 ${
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
              current={
                projectRoute.view as "showcase" | "developer" | "roadmap"
              }
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
        <li className="flex items-center">
          <a
            href="https://github.com/sponsors/emersonfelipesp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.sponsorButtonAria}
            className="inline-flex items-center border border-border bg-surface-2 px-2 py-1 text-xs text-muted transition-colors duration-150 hover:border-accent hover:bg-accent/15 hover:text-accent"
          >
            [{t.nav.sponsorButtonLabel}]
          </a>
        </li>
      </ul>
    </nav>
  );
}
