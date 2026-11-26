import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "edge";
import { getUseCases } from "@/lib/content";
import { goalBySlug, harnessBySlug } from "@/lib/taxonomy";
import { appendRecord, readRecords } from "@/lib/store";
import { cleanText, normalisePublicUrl, ValidationError } from "@/lib/validate";

export const dynamic = "force-dynamic";

type IngestionRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  goal: string;
  agent: string;
  harness: string;
  source_url: string;
  prompt_snippet: string;
  status: "pending_review";
  createdAt: string;
};

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function authorise(request: Request): boolean {
  const secret = process.env.INGEST_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return false;
  return safeEqual(header.slice(7).trim(), secret);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST(request: Request) {
  if (!process.env.INGEST_SECRET) {
    return NextResponse.json(
      { ok: false, mode: "unconfigured", message: "INGEST_SECRET is not set." },
      { status: 503 }
    );
  }

  if (!authorise(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const issues: string[] = [];
  const title = cleanText(body.title, 140);
  const summary = cleanText(body.summary, 600);
  const goal = cleanText(body.goal, 60);
  const agent = cleanText(body.agent, 80);
  const harness = cleanText(body.harness, 60);
  const promptSnippet =
    typeof body.prompt_snippet === "string" ? body.prompt_snippet.trim().slice(0, 4000) : "";

  if (title.length < 6) issues.push("title must be at least 6 characters");
  if (summary.length < 20) issues.push("summary must be at least 20 characters");
  if (!goalBySlug(goal)) issues.push("goal is not a known goal slug");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(agent)) issues.push("agent must be a lowercase slug");
  if (!harnessBySlug(harness)) issues.push("harness is not a known harness slug");
  if (promptSnippet.length < 10) issues.push("prompt_snippet must be at least 10 characters");

  let sourceUrl = "";
  try {
    sourceUrl = normalisePublicUrl(body.source_url);
  } catch (error) {
    issues.push(
      error instanceof ValidationError ? error.message : "source_url must be a public https URL"
    );
  }

  if (issues.length > 0) {
    return NextResponse.json({ ok: false, error: "validation_failed", issues }, { status: 400 });
  }

  const requestedSlug = cleanText(body.slug, 90);
  const slug = slugify(requestedSlug || title);
  if (!slug) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", issues: ["slug could not be derived"] },
      { status: 400 }
    );
  }

  const normalisedSource = sourceUrl.toLowerCase();
  const liveMatch = getUseCases().find(
    (item) => item.slug === slug || item.source.url.toLowerCase() === normalisedSource
  );
  if (liveMatch) {
    return NextResponse.json(
      {
        ok: false,
        error: "duplicate",
        field: liveMatch.slug === slug ? "slug" : "source_url",
        existing: liveMatch.slug,
      },
      { status: 409 }
    );
  }

  let pending: IngestionRecord[] = [];
  try {
    pending = await readRecords<IngestionRecord>("ingestions.json");
  } catch {
    pending = [];
  }
  const pendingMatch = pending.find(
    (item) => item.slug === slug || item.source_url.toLowerCase() === normalisedSource
  );
  if (pendingMatch) {
    return NextResponse.json(
      {
        ok: false,
        error: "duplicate",
        field: pendingMatch.slug === slug ? "slug" : "source_url",
        existing: pendingMatch.slug,
        status: "pending_review",
      },
      { status: 409 }
    );
  }

  const record: IngestionRecord = {
    id: crypto.randomUUID(),
    slug,
    title,
    summary,
    goal,
    agent,
    harness,
    source_url: sourceUrl,
    prompt_snippet: promptSnippet,
    status: "pending_review",
    createdAt: new Date().toISOString(),
  };

  try {
    // Scraped items never publish directly. They wait in ingestions.json until
    // an editor promotes them to content/use-cases after a source check.
    await appendRecord<IngestionRecord>("ingestions.json", record);
  } catch {
    return NextResponse.json({ ok: false, error: "could_not_stage" }, { status: 500 });
  }

  return NextResponse.json(
    { ok: true, id: record.id, slug: record.slug, status: record.status },
    { status: 202 }
  );
}
