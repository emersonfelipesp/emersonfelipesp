import Link from "next/link";
import { featured } from "@/content/profile";

export function FeaturedProjectsGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {featured.map((p) => (
        <Link
          key={p.slug}
          href={p.href}
          className="group flex flex-col justify-between border border-border bg-surface p-4 transition-colors hover:border-accent"
        >
          <div>
            <p className="text-xs text-muted">$ ./run --project</p>
            <p className="mt-1 text-base text-accent group-hover:text-accent-2">
              {p.name}
            </p>
            <p className="mt-2 text-xs text-fg/80">{p.tagline}</p>
          </div>
          <p className="mt-3 text-[10px] text-muted">{p.badge}</p>
        </Link>
      ))}
    </div>
  );
}
