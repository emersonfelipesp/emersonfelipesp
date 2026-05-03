import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators/contact";
import { db } from "@/lib/db";

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

  try {
    const created = await db.contactMessage.create({ data: parsed.data });
    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (err) {
    console.error("[contact] db error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
