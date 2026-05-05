"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getProfile, socials } from "@/lib/i18n/profile";

export function ProfileCard() {
  const { lang, t } = useLanguage();
  const profile = getProfile(lang);
  const labels = t.home.profile;
  return (
    <div className="border border-border bg-surface p-5">
      <dl className="grid gap-y-1 text-sm sm:grid-cols-[8rem_1fr]">
        <Row k={labels.name} v={profile.name} accent />
        <Row k={labels.handle} v={`@${profile.handle}`} />
        <Row k={labels.role} v={profile.role} />
        <Row k={labels.location} v={profile.location} />
        <Row k={labels.company} v={profile.company} />
        <Row k={labels.communities} v={profile.communities.join(", ")} />
        <Row k={labels.email} v={profile.email} />
      </dl>

      <div className="mt-4 border-t border-border pt-3">
        <p className="mb-2 text-xs text-muted">{labels.socialHeader}</p>
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
