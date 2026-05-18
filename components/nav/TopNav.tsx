"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { ProjectViewToggle } from "@/components/nav/ProjectViewToggle";
import { PathPicker } from "@/components/nav/PathPicker";
import { useProjectLabels } from "@/components/nav/use-project-labels";
import { useScrollCompact } from "@/components/nav/use-scroll-compact";
import {
  getChildProjects,
  getProject,
  getProjectFromPath,
  TOP_LEVEL_PROJECT_LIST,
} from "@/lib/project-registry";

const PROXBOX_CHILDREN = getChildProjects("netbox-proxbox");

export function TopNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const projectLabels = useProjectLabels();
  const projectRoute = getProjectFromPath(pathname);
  const showViewToggle =
    projectRoute !== null &&
    !getProject(projectRoute.slug)?.parentSlug &&
    (projectRoute.view === "showcase" ||
      projectRoute.view === "developer" ||
      projectRoute.view === "roadmap");
  const compact = useScrollCompact();
  const navRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const links = [
    { href: "/", label: t.nav.home },
    ...TOP_LEVEL_PROJECT_LIST.map((project) => ({
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

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [dropdownOpen]);

  const isProxboxActive =
    pathname === "/netbox-proxbox" ||
    PROXBOX_CHILDREN.some((c) => pathname.startsWith(c.projectPath));

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
          if (l.href === "/netbox-proxbox") {
            return (
              <li key={l.href} ref={dropdownRef} className="relative">
                <button
                  type="button"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className={`block px-2 py-4 transition-colors duration-150 ${
                    isProxboxActive
                      ? "text-accent"
                      : "text-muted hover:bg-accent/15 hover:text-accent"
                  }`}
                >
                  [{projectLabels["netbox-proxbox"]}] {dropdownOpen ? "▴" : "▾"}
                </button>
                {dropdownOpen && (
                  <ul
                    role="menu"
                    className="absolute left-0 top-full z-50 min-w-max border border-border bg-surface/95 py-1 backdrop-blur"
                  >
                    <li role="none">
                      <Link
                        href="/netbox-proxbox"
                        role="menuitem"
                        aria-current={pathname === "/netbox-proxbox" ? "page" : undefined}
                        onClick={() => setDropdownOpen(false)}
                        className={`block px-3 py-2 transition-colors duration-150 ${
                          pathname === "/netbox-proxbox"
                            ? "text-accent"
                            : "text-muted hover:bg-accent/15 hover:text-accent"
                        }`}
                      >
                        [{projectLabels["netbox-proxbox"]}]
                      </Link>
                    </li>
                    {PROXBOX_CHILDREN.map((child) => {
                      const isChildActive = pathname.startsWith(child.projectPath);
                      return (
                        <li key={child.slug} role="none">
                          <Link
                            href={child.projectPath}
                            role="menuitem"
                            onClick={() => setDropdownOpen(false)}
                            className={`block px-3 py-2 transition-colors duration-150 ${
                              isChildActive
                                ? "text-accent"
                                : "text-muted hover:bg-accent/15 hover:text-accent"
                            }`}
                          >
                            [{projectLabels[child.slug]}]
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          }

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
