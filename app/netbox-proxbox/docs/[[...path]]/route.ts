import { NextRequest } from "next/server";

const DOCS_PATH_PREFIX = "/netbox-proxbox/docs";
const PUBLIC_DOCS_BASE = "https://emersonfelipesp.com/netbox-proxbox/docs";
const UPSTREAM_DOCS_BASE = "https://emersonfelipesp.github.io/netbox-proxbox";
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

function upstreamUrl(request: NextRequest): URL {
  const pathname = request.nextUrl.pathname;
  const suffix = pathname.slice(DOCS_PATH_PREFIX.length) || "/";
  const url = new URL(`${UPSTREAM_DOCS_BASE}${suffix}`);
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

function rewriteHtml(html: string): string {
  return html
    .replaceAll(`${UPSTREAM_DOCS_BASE}/`, `${PUBLIC_DOCS_BASE}/`)
    .replaceAll(UPSTREAM_DOCS_BASE, PUBLIC_DOCS_BASE)
    .replaceAll('href="/netbox-proxbox/', 'href="/netbox-proxbox/docs/')
    .replaceAll('src="/netbox-proxbox/', 'src="/netbox-proxbox/docs/')
    .replace(/^\s*<meta name="robots" content="noindex">\s*$/gim, "");
}

async function proxyDocs(request: NextRequest): Promise<Response> {
  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl(request), {
      cache: "no-store",
      headers: forwardedHeaders(request),
      method: request.method,
      redirect: "follow",
    });
  } catch {
    return new Response("Unable to reach netbox-proxbox documentation.", {
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
    return new Response(rewriteHtml(await upstream.text()), {
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

export async function GET(request: NextRequest): Promise<Response> {
  return proxyDocs(request);
}

export async function HEAD(request: NextRequest): Promise<Response> {
  return proxyDocs(request);
}
