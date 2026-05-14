import { getMarkdownForPath } from "@/lib/markdown";
import { discoveryLinkHeader, ROBOTS_INDEX_HEADER } from "@/lib/seo";

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const { path = [] } = await params;
  const pagePath = path.length ? `/${path.join("/")}` : "/";
  const markdown = await getMarkdownForPath(pagePath);

  if (!markdown) {
    return new Response("# Not found\n", {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: "Accept",
      },
    });
  }

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: discoveryLinkHeader(pagePath),
      "X-Robots-Tag": ROBOTS_INDEX_HEADER,
      Vary: "Accept",
    },
  });
}
