import { renderArchitectureDiagramSvg } from "@/lib/architecture-diagram-renderers";
import { ROBOTS_INDEX_HEADER } from "@/lib/seo/constants";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(renderArchitectureDiagramSvg(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "image/svg+xml; charset=utf-8",
      "X-Robots-Tag": ROBOTS_INDEX_HEADER,
    },
  });
}
