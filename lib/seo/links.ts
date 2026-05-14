import { SITE_URL } from "./constants";

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}

export function rawMarkdownPath(pathname: string): string {
  return pathname === "/" ? "/md" : `/md${pathname}`;
}

export function themedMarkdownPath(pathname: string): string {
  return pathname === "/"
    ? "/?content=markdown"
    : `${pathname}?content=markdown`;
}

export function discoveryLinkHeader(pathname: string): string {
  return [
    `<${absoluteUrl(pathname)}>; rel="canonical"`,
    `<${absoluteUrl(rawMarkdownPath(pathname))}>; rel="alternate"; type="text/markdown"; title="Raw Markdown"`,
    `<${absoluteUrl(themedMarkdownPath(pathname))}>; rel="alternate"; type="text/markdown"; title="Themed Markdown"`,
    `<${absoluteUrl("/llms.txt")}>; rel="alternate"; type="text/markdown"; title="LLMs index"`,
    `<${absoluteUrl("/sitemap.xml")}>; rel="sitemap"; type="application/xml"`,
    `<${absoluteUrl("/sitemap.md")}>; rel="alternate"; type="text/markdown"; title="Markdown sitemap"`,
  ].join(", ");
}

export function llmResourceLinkHeader(pathname: string): string {
  return [
    `<${absoluteUrl(pathname)}>; rel="canonical"`,
    `<${absoluteUrl("/llms.txt")}>; rel="alternate"; type="text/markdown"; title="LLMs index"`,
    `<${absoluteUrl("/llms-full.txt")}>; rel="alternate"; type="text/markdown"; title="Full Markdown corpus"`,
    `<${absoluteUrl("/sitemap.xml")}>; rel="sitemap"; type="application/xml"`,
    `<${absoluteUrl("/sitemap.md")}>; rel="alternate"; type="text/markdown"; title="Markdown sitemap"`,
  ].join(", ");
}
