import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { href: "/", label: "~/home" },
  { href: "/netbox-proxbox", label: "~/netbox-proxbox" },
  { href: "/netbox-sdk", label: "~/netbox-sdk" },
  { href: "/proxmox-sdk", label: "~/proxmox-sdk" },
];

export function TopNav() {
  return (
    <nav className="flex flex-col gap-3 border border-border bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
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
