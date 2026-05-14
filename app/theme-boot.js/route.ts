import {
  DARK_THEMES,
  DEFAULT_THEME,
  NAMED_THEMES,
  VALID_THEMES,
} from "@/components/theme/theme-definitions";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(
    `
(function() {
  try {
    var valid = ${JSON.stringify(VALID_THEMES)};
    var dark  = ${JSON.stringify(DARK_THEMES)};
    var named = ${JSON.stringify(NAMED_THEMES)};
    var stored = localStorage.getItem('theme');
    var theme = valid.indexOf(stored) >= 0 ? stored : ${JSON.stringify(DEFAULT_THEME)};
    var root = document.documentElement;
    if (named.indexOf(theme) >= 0) root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');
    root.classList.toggle('dark', dark.indexOf(theme) >= 0);
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
