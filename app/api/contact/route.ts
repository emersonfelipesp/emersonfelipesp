import { NextResponse } from "next/server";
import { db } from "@/lib/db";
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
    return NextResponse.json(
      { error: "validation_failed", fields, issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const message = await db.contactMessage.create({ data: parsed.data });
    return NextResponse.json({ ok: true, id: message.id }, { status: 201 });
  } catch (err) {
    console.error("[contact] create failed:", err);
    return NextResponse.json({ error: "database_error" }, { status: 500 });
  }
}
