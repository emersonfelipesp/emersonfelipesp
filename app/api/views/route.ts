import { NextResponse } from "next/server";
import { readView, incrementView } from "@/lib/views";
import { viewBodySchema, viewPathSchema } from "@/lib/validators/views";

export const runtime = "nodejs";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const parsed = viewPathSchema.safeParse(url.searchParams.get("path"));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const count = await readView(parsed.data);
  return NextResponse.json({ path: parsed.data, count });
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch (err) {
    console.error("[views] invalid json:", err);
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = viewBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const count = await incrementView(parsed.data.path);
  return NextResponse.json({ path: parsed.data.path, count });
}
