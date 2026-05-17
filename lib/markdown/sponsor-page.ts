import { SPONSOR_LINKS } from "@/content/sponsor";
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
        `- [GitHub Sponsors](${SPONSOR_LINKS.github}) — ${s.cardTitle}`,
        `- [Buy Me a Coffee](${SPONSOR_LINKS.buyMeACoffee}) — ${s.buyMeACoffeeLabel}`,
        `- [Patreon](${SPONSOR_LINKS.patreon}) — ${s.patreonLabel}`,
      ].join("\n"),
    ),
    s.thanks,
    section("Canonical URL", absolute("/sponsor")),
  ]);
}
