import { profile, socials } from "@/content/profile";

export function ProfileCard() {
  return (
    <div className="border border-border bg-surface p-5">
      <dl className="grid gap-y-1 text-sm sm:grid-cols-[8rem_1fr]">
        <Row k="name" v={profile.name} accent />
        <Row k="handle" v={`@${profile.handle}`} />
        <Row k="role" v={profile.role} />
        <Row k="location" v={profile.location} />
        <Row k="company" v={profile.company} />
        <Row k="communities" v={profile.communities.join(", ")} />
        <Row k="email" v={profile.email} />
      </dl>

      <div className="mt-4 border-t border-border pt-3">
        <p className="mb-2 text-xs text-muted">$ ls ~/.social/</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-2 hover:text-accent"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Row({
  k,
  v,
  accent,
}: {
  k: string;
  v: string;
  accent?: boolean;
}) {
  return (
    <>
      <dt className="text-muted">{k}</dt>
      <dd className={accent ? "text-accent" : "text-fg"}>{v}</dd>
    </>
  );
}
