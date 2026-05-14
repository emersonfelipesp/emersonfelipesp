import {
  DEFAULT_LANG,
  LANGUAGES,
  VALID_LANGS,
} from "@/lib/i18n/languages";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(
    `
(function() {
  try {
    var valid = ${JSON.stringify(VALID_LANGS)};
    var htmlLangs = ${JSON.stringify(
      Object.fromEntries(LANGUAGES.map((l) => [l.code, l.htmlLang])),
    )};
    var stored = localStorage.getItem('lang');
    var lang = valid.indexOf(stored) >= 0 ? stored : ${JSON.stringify(DEFAULT_LANG)};
    document.documentElement.lang = htmlLangs[lang];
  } catch (e) {}
})();
`.trim(),
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "application/javascript; charset=utf-8",
      },
    },
  );
}
