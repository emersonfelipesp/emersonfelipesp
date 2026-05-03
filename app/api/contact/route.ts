import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators/contact";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const created = await db.contactMessage.create({ data: parsed.data });
  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}
