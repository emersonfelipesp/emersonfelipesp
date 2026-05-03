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

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const parsed = pathSchema.safeParse({ path: searchParams.get("path") ?? "" });
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_path" }, { status: 422 });
  }
  try {
    const count = await readView(parsed.data.path);
    return NextResponse.json({ path: parsed.data.path, count });
  } catch (err) {
    console.error("[views] read error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch (err) {
    console.error("[views] invalid json:", err);
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = pathSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_path" }, { status: 422 });
  }
  try {
    const count = await incrementView(parsed.data.path);
    return NextResponse.json({ path: parsed.data.path, count }, { status: 201 });
  } catch (err) {
    console.error("[views] increment error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
