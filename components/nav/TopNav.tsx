"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { href: "/", label: "~/home" },
  { href: "/netbox-proxbox", label: "~/netbox-proxbox" },
  { href: "/netbox-sdk", label: "~/netbox-sdk" },
  { href: "/proxmox-sdk", label: "~/proxmox-sdk" },
];

export function TopNav() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setCompact((prev) => (prev ? y > 4 : y > 8));
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--topnav-h", `${h}px`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (compact) {
    return (
      <nav
        ref={navRef}
        key="compact"
        aria-label="Top navigation"
        style={{ animation: "fade-in 120ms ease-out" }}
        className="sticky top-0 z-40 border border-border bg-surface/90 px-3 py-2 backdrop-blur"
      >
        <ul className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`border px-2 py-0.5 transition-colors ${
                    isActive
                      ? "border-accent text-accent"
                      : "border-border text-muted hover:border-accent hover:text-accent"
                  }`}
                >
                  [{l.label}]
                </Link>
              </li>
            );
          })}
          <li>
            <ThemeToggle compact />
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <nav
      ref={navRef}
      key="full"
      aria-label="Top navigation"
      style={{ animation: "fade-in 120ms ease-out" }}
      className="sticky top-0 z-40 flex flex-col gap-3 border border-border bg-surface/90 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-2 text-xs sm:gap-3">
        <span className="text-accent">emerson@netdevops</span>
        <span className="text-muted">:~$</span>
        <span className="text-fg">cd</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-muted transition-colors hover:text-accent"
          >
            {l.label}
          </Link>
        ))}
        <ThemeToggle />
      </div>
    </nav>
  );
}
