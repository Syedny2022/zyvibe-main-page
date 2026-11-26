import { NextResponse } from "next/server";

export const runtime = "edge";
import { getUseCase } from "@/lib/content";
import { appendRecord } from "@/lib/store";

type VoteRecord = { id: string; slug: string; delta: number; at: string };

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    slug?: unknown;
    action?: unknown;
  } | null;

  const slug = typeof body?.slug === "string" ? body.slug : null;
  const action = body?.action;
  if (!slug || (action !== "vote" && action !== "unvote") || !getUseCase(slug)) {
    return NextResponse.json({ message: "Invalid vote request." }, { status: 400 });
  }

  const record: VoteRecord = {
    id: crypto.randomUUID(),
    slug,
    delta: action === "vote" ? 1 : -1,
    at: new Date().toISOString(),
  };

  try {
    await appendRecord<VoteRecord>("votes.json", record);
    return NextResponse.json({ ok: true, slug });
  } catch {
    return NextResponse.json(
      { ok: false, message: "The vote could not be stored; it stays in this browser." },
      { status: 500 }
    );
  }
}
