import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { absolute, finalize, section } from "./format";

export function renderSponsorPage(): string {
  const s = DICTIONARIES.en.sponsor;

  return finalize([
    "# Sponsor emersonfelipesp",
    s.intro,
    section("Why sponsor", s.why),
    section("Impact", s.impact),
    section(
      "Ways to support",
      [
        `- [GitHub Sponsors](https://github.com/sponsors/emersonfelipesp) — ${s.cardTitle}`,
        `- [Buy Me a Coffee](https://buymeacoffee.com/emersonfelipesp) — ${s.buyMeACoffeeLabel}`,
        `- [Patreon](https://patreon.com/emersonfelipesp) — ${s.patreonLabel}`,
      ].join("\n"),
    ),
    s.thanks,
    section("Canonical URL", absolute("/sponsor")),
  ]);
}
