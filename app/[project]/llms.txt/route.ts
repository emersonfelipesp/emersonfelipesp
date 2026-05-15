import { notFound } from "next/navigation";
import { getProjectLlmsTxt } from "@/lib/markdown";
import { isProjectSlug } from "@/lib/project-registry";
import { llmResourceLinkHeader, ROBOTS_INDEX_HEADER } from "@/lib/seo";

type RouteContext = {
  params: Promise<{ project: string }>;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const { project: slug } = await params;
  if (!isProjectSlug(slug)) notFound();

  const body = await getProjectLlmsTxt(slug);
  if (!body) notFound();

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: llmResourceLinkHeader(`/${slug}/llms.txt`),
      "X-Robots-Tag": ROBOTS_INDEX_HEADER,
      Vary: "Accept",
    },
  });
}
