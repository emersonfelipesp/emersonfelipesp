"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getProfile, socials, companyHref } from "@/lib/i18n/profile";

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
        <Row k={labels.company} v={profile.company} href={companyHref} />
        <Row k={labels.communities} v={profile.communities.join(", ")} />
        <Row k={labels.email} v={profile.email} />
      </dl>

      <div className="mt-4 border-t border-border pt-3">
        <p className="mb-2 text-xs text-muted">{labels.socialHeader}</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs leading-4">
          {socials.map((s) => {
            const Icon = SOCIAL_ICONS[s.label] ?? SOCIAL_ICONS.default;
            return (
              <li key={s.label} className="leading-4">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="inline-flex h-4 w-4 items-center justify-center text-accent-2 hover:text-accent"
                >
                  <Icon />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

const ICON_PROPS = {
  className: "h-4 w-4",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
} as const;

const SOCIAL_ICONS: Record<string, () => React.JSX.Element> = {
  github: () => (
    <svg {...ICON_PROPS}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.604-.015 2.898-.015 3.293 0 .32.215.696.825.578C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  linkedin: () => (
    <svg {...ICON_PROPS}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  email: () => (
    <svg {...ICON_PROPS}>
      <path d="M2 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2zm.4 2h19.2L12 13.2 2.4 6zM2 8.45l9.4 7.05a1 1 0 0 0 1.2 0L22 8.45V18H2V8.45z" />
    </svg>
  ),
  telegram: () => (
    <svg {...ICON_PROPS}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  instagram: () => (
    <svg {...ICON_PROPS}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  "n-multifibra": () => (
    <svg {...ICON_PROPS}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 19.93c-3.94-.49-7-3.85-7-7.93 0-.6.07-1.18.2-1.74L9.5 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41C17.93 5.78 20 8.65 20 12c0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  ),
  default: () => (
    <svg {...ICON_PROPS}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-1-5h2v2h-2v-2zm0-10h2v8h-2V7z" />
    </svg>
  ),
};

function Row({
  k,
  v,
  accent,
  href,
}: {
  k: string;
  v: string;
  accent?: boolean;
  href?: string;
}) {
  return (
    <>
      <dt className="text-muted">{k}</dt>
      <dd className={accent ? "text-accent" : "text-fg"}>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-2 hover:text-accent"
          >
            {v}
          </a>
        ) : (
          v
        )}
      </dd>
    </>
  );
}
