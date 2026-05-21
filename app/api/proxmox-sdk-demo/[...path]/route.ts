import { NextRequest, NextResponse } from "next/server";

const MOCK_URL = process.env.PROXMOX_SDK_MOCK_URL;

async function proxy(req: NextRequest, path: string): Promise<NextResponse> {
  if (!MOCK_URL) {
    return NextResponse.json(
      { error: "PROXMOX_SDK_MOCK_URL not set" },
      { status: 503 },
    );
  }

  const qs = req.nextUrl.search;
  const body = ["GET", "HEAD"].includes(req.method)
    ? undefined
    : await req.text();

  let upstream: Response;
  try {
    upstream = await fetch(`${MOCK_URL}/${path}${qs}`, {
      method: req.method,
      headers: { "content-type": "application/json" },
      body,
    });
  } catch {
    return NextResponse.json(
      { error: "Mock API unreachable" },
      { status: 502 },
    );
  }

  const data: unknown = await upstream.json();

  if (path === "openapi.json" && data && typeof data === "object") {
    (data as Record<string, unknown>).servers = [
      { url: "/api/proxmox-sdk-demo" },
    ];
  }

  return NextResponse.json(data, { status: upstream.status });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx): Promise<NextResponse> {
  return proxy(req, (await ctx.params).path.join("/"));
}
export async function POST(req: NextRequest, ctx: Ctx): Promise<NextResponse> {
  return proxy(req, (await ctx.params).path.join("/"));
}
export async function PUT(req: NextRequest, ctx: Ctx): Promise<NextResponse> {
  return proxy(req, (await ctx.params).path.join("/"));
}
export async function DELETE(
  req: NextRequest,
  ctx: Ctx,
): Promise<NextResponse> {
  return proxy(req, (await ctx.params).path.join("/"));
}
export async function PATCH(req: NextRequest, ctx: Ctx): Promise<NextResponse> {
  return proxy(req, (await ctx.params).path.join("/"));
}
