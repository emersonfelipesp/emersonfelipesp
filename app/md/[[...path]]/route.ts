import { getMarkdownForPath } from "@/lib/markdown";

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
      Vary: "Accept",
    },
  });
}
