import { NextResponse } from "next/server";

export const runtime = "edge";
import { randomUUID } from "node:crypto";
import { appendRecord, type Submission } from "@/lib/store";
import { cleanLines, cleanText, isEmail, normalisePublicUrl, ValidationError } from "@/lib/validate";
import { GOALS, HARNESSES } from "@/lib/taxonomy";
import { sendTransactionalEmail } from "@/lib/email";
import { SITE } from "@/lib/site";
import { escapeHtml } from "@/lib/email";


export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Send a JSON body." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (cleanText(body.website, 10)) {
    return NextResponse.json({ message: "Submission received." });
  }

  const issues: string[] = [];

  const title = cleanText(body.title, 120);
  if (title.length < 12) issues.push("Add a workflow title of at least 12 characters.");

  let sourceUrl = "";
  try {
    sourceUrl = normalisePublicUrl(body.sourceUrl);
  } catch (error) {
    issues.push(error instanceof ValidationError ? error.message : "Add a valid source URL.");
  }

  const goal = cleanText(body.goal, 60);
  if (!GOALS.some((item) => item.slug === goal)) issues.push("Choose a goal from the list.");

  const harness = cleanText(body.harness, 60);
  if (!HARNESSES.some((item) => item.slug === harness)) {
    issues.push("Choose a harness from the list.");
  }

  const agentName = cleanText(body.agentName, 80);
  if (agentName.length < 2) issues.push("Name the agent or framework used.");

  const evidence = cleanText(body.evidence, 40);
  if (!["Documented", "Reported"].includes(evidence)) {
    issues.push("Choose whether the source documents the workflow or reports it.");
  }

  const summary = cleanText(body.summary, 600);
  if (summary.length < 40) issues.push("Describe what the workflow does in at least 40 characters.");

  const steps = cleanLines(body.steps, 12, 400);
  if (steps.length < 3) issues.push("Add at least three reproducible steps, one per line.");

  const configSnippet = cleanText(body.configSnippet, 2000);
  if (configSnippet.length < 8) {
    issues.push("Include the command, config, or prompt pattern that drives the workflow.");
  }

  const limitations = cleanText(body.limitations, 1200);
  if (limitations.length < 20) {
    issues.push("State the limitations or what broke. A record without friction is rejected.");
  }

  const contactEmail = isEmail(body.contactEmail) ? body.contactEmail.trim().toLowerCase() : "";
  if (!contactEmail) issues.push("Add a contact email for review questions.");

  if (body.consent !== true) {
    issues.push("Confirm the submission is accurate and that Zyvibe may contact you.");
  }

  if (issues.length > 0) {
    return NextResponse.json({ message: "A few fields need attention.", issues }, { status: 400 });
  }

  const submission: Submission = {
    id: randomUUID(),
    title,
    sourceUrl,
    goal,
    agentName,
    harness,
    evidence,
    summary,
    steps,
    configSnippet,
    limitations,
    contactEmail,
    status: "pending_review",
    createdAt: new Date().toISOString(),
  };

  try {
    await appendRecord<Submission>("submissions.json", submission);
  } catch {
    return NextResponse.json(
      { message: "The submission could not be stored. Please try again later." },
      { status: 500 }
    );
  }

  await sendTransactionalEmail({
    to: SITE.emails.alertsTo,
    subject: `Use-case submission for review: ${title}`,
    html: `<h2>New submission (pending review)</h2>
<ul>
  <li>Title: ${escapeHtml(title)}</li>
  <li>Source: ${escapeHtml(sourceUrl)}</li>
  <li>Goal: ${escapeHtml(goal)}</li>
  <li>Agent: ${escapeHtml(agentName)}</li>
  <li>Harness: ${escapeHtml(harness)}</li>
  <li>Evidence claimed: ${escapeHtml(evidence)}</li>
  <li>Contact: ${escapeHtml(contactEmail)}</li>
  <li>Record id: ${escapeHtml(submission.id)}</li>
</ul>
<p>Status: pending_review. Nothing has been published.</p>`,
  }).catch(() => undefined);

  return NextResponse.json({
    message:
      "Received. A reviewer checks the source link, steps, and limitations before anything is published.",
  });
}
