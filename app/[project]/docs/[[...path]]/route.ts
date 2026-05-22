import { NextRequest } from "next/server";
import {
  isProjectSlug,
  projectDocsPath,
  projectDocsPublicUrl,
  projectDocsUpstreamBase,
  type ProjectSlug,
} from "@/lib/project-registry";

type RouteContext = {
  params: Promise<{ project: string; path?: string[] }>;
};

const CACHE_CONTROL =
  "public, max-age=600, s-maxage=600, stale-while-revalidate=300";
const ERROR_CACHE_CONTROL = "no-store";

const FORWARDED_REQUEST_HEADERS = [
  "accept",
  "accept-language",
  "if-modified-since",
  "if-none-match",
  "range",
] as const;

const PASSTHROUGH_RESPONSE_HEADERS = [
  "accept-ranges",
  "content-type",
  "etag",
  "last-modified",
] as const;

type DocsProxyConfig = {
  slug: ProjectSlug;
  pathPrefix: string;
  publicBase: string;
  upstreamBase: string;
};

function docsProxyConfig(project: string): DocsProxyConfig | null {
  if (!isProjectSlug(project)) return null;
  return {
    slug: project,
    pathPrefix: projectDocsPath(project).replace(/\/$/, ""),
    publicBase: projectDocsPublicUrl(project).replace(/\/$/, ""),
    upstreamBase: projectDocsUpstreamBase(project),
  };
}

function upstreamUrl(request: NextRequest, config: DocsProxyConfig): URL {
  const pathname = request.nextUrl.pathname;
  const suffix = pathname.slice(config.pathPrefix.length) || "/";
  const url = new URL(`${config.upstreamBase}${suffix}`);
  url.search = request.nextUrl.search;
  return url;
}

function forwardedHeaders(request: NextRequest): Headers {
  const headers = new Headers();
  for (const key of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(key);
    if (value) headers.set(key, value);
  }
  return headers;
}

function responseHeaders(upstream: Response, cacheable: boolean): Headers {
  const headers = new Headers();
  for (const key of PASSTHROUGH_RESPONSE_HEADERS) {
    const value = upstream.headers.get(key);
    if (value) headers.set(key, value);
  }
  headers.set("cache-control", cacheable ? CACHE_CONTROL : ERROR_CACHE_CONTROL);
  return headers;
}

function isHtml(upstream: Response): boolean {
  return upstream.headers.get("content-type")?.includes("text/html") ?? false;
}

function rewriteRootRelativeAttributes(
  html: string,
  config: DocsProxyConfig,
): string {
  return html.replace(/\b(href|src)="(\/(?!\/)[^"]*)"/g, (match, attr, value) => {
    const currentValue = String(value);
    if (
      currentValue === config.pathPrefix ||
      currentValue.startsWith(`${config.pathPrefix}/`)
    ) {
      return match;
    }

    const projectRoot = `/${config.slug}`;
    if (
      currentValue === projectRoot ||
      currentValue.startsWith(`${projectRoot}/`)
    ) {
      return `${attr}="${config.pathPrefix}${currentValue.slice(projectRoot.length)}"`;
    }

    return `${attr}="${config.pathPrefix}${currentValue}"`;
  });
}

function rewriteHtml(html: string, config: DocsProxyConfig): string {
  return rewriteRootRelativeAttributes(
    html
      .replaceAll(`${config.upstreamBase}/`, `${config.publicBase}/`)
      .replaceAll(config.upstreamBase, config.publicBase)
      .replace(/^\s*<meta name="robots" content="noindex">\s*$/gim, ""),
    config,
  );
}

async function proxyDocs(
  request: NextRequest,
  { params }: RouteContext,
): Promise<Response> {
  const { project } = await params;
  const config = docsProxyConfig(project);
  if (!config) {
    return new Response("Unknown project documentation.", {
      headers: { "cache-control": ERROR_CACHE_CONTROL },
      status: 404,
    });
  }

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl(request, config), {
      cache: "no-store",
      headers: forwardedHeaders(request),
      method: request.method,
      redirect: "follow",
    });
  } catch {
    return new Response(`Unable to reach ${config.slug} documentation.`, {
      headers: { "cache-control": ERROR_CACHE_CONTROL },
      status: 502,
    });
  }

  const headers = responseHeaders(upstream, upstream.ok);

  if (
    request.method === "HEAD" ||
    upstream.status === 204 ||
    upstream.status === 304
  ) {
    return new Response(null, { headers, status: upstream.status });
  }

  if (isHtml(upstream)) {
    headers.delete("etag");
    headers.set("content-type", "text/html; charset=utf-8");
    return new Response(rewriteHtml(await upstream.text(), config), {
      headers,
      status: upstream.status,
    });
  }

  return new Response(upstream.body, {
    headers,
    status: upstream.status,
  });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  return proxyDocs(request, context);
}

export async function HEAD(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  return proxyDocs(request, context);
}
