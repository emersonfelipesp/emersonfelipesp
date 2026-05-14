import { getMarkdownSitemap } from "@/lib/markdown";
import { llmResourceLinkHeader, ROBOTS_INDEX_HEADER } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  return new Response(await getMarkdownSitemap(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: llmResourceLinkHeader("/sitemap.txt"),
      "X-Robots-Tag": ROBOTS_INDEX_HEADER,
      Vary: "Accept",
    },
  });
}
