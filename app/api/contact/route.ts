import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators/contact";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch (err) {
    console.error("[contact] invalid json:", err);
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fields = Object.fromEntries(
      parsed.error.issues.map((i) => [i.path[0], i.message]),
    );
    return NextResponse.json({ error: "validation_failed", fields }, { status: 422 });
  }

  return NextResponse.json({ ok: true, id: "noop" }, { status: 201 });
}
