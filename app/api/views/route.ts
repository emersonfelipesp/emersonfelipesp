import { NextResponse } from "next/server";
import { z } from "zod";
import { incrementView, readView } from "@/lib/views";

export const runtime = "nodejs";

const pathSchema = z.object({
  path: z
    .string()
    .trim()
    .regex(/^\/[a-z0-9/_-]*$/i, "invalid path")
    .max(200),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = pathSchema.safeParse({ path: searchParams.get("path") ?? "" });
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid path" }, { status: 422 });
  }
  const count = await readView(parsed.data.path);
  return NextResponse.json({ path: parsed.data.path, count });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const parsed = pathSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid path" }, { status: 422 });
  }
  const count = await incrementView(parsed.data.path);
  return NextResponse.json({ path: parsed.data.path, count });
}
