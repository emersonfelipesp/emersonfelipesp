import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  return NextResponse.json({ error: "unavailable" }, { status: 503 });
}

export async function POST(): Promise<Response> {
  return NextResponse.json({ error: "unavailable" }, { status: 503 });
}
