import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { slug?: unknown; action?: unknown } | null;
  if (typeof body?.slug !== "string" || (body.action !== "vote" && body.action !== "unvote")) {
    return NextResponse.json({ message: "Invalid vote request." }, { status: 400 });
  }
  return NextResponse.json({ ok: false, message: "Voting storage is temporarily unavailable." }, { status: 503 });
}
