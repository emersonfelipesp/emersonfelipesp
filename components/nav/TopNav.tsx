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
        <li className="ml-auto">
          <ThemeToggle compact={compact} />
        </li>
      </ul>
    </nav>
  );
}
