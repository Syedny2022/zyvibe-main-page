import { NextResponse } from "next/server";
import Stripe from "stripe";
import { placementAlertEmail, placementReceiptEmail, sendTransactionalEmail } from "@/lib/email";
import { placementById, SITE } from "@/lib/site";
import { appendRecord, markEventProcessed, type PlacementRecord } from "@/lib/store";
import { checkUrlReachable, normalisePublicUrl } from "@/lib/validate";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      {
        ok: false,
        mode: "unconfigured",
        message: "The Stripe webhook is not configured in this local environment.",
      },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ message: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = new Stripe(secretKey);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ message: "Invalid signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  try {
    const firstDelivery = await markEventProcessed(event.id);
    if (!firstDelivery) {
      return NextResponse.json({ received: true, duplicate: true });
    }
  } catch {
    // If the idempotency store cannot be written we fail closed rather than double-activate.
    return NextResponse.json({ message: "Could not record event." }, { status: 500 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const metadata = session.metadata ?? {};
  const placement = placementById(metadata.placement ?? "");

  if (!placement) {
    return NextResponse.json({ received: true, ignored: "unknown placement" });
  }

  let projectUrl: string | null = null;
  let urlCheck: PlacementRecord["urlCheck"] = null;
  try {
    projectUrl = normalisePublicUrl(metadata.projectUrl);
    const result = await checkUrlReachable(projectUrl);
    urlCheck = {
      ok: result.ok,
      status: result.status,
      finalUrl: result.finalUrl,
      reason: result.reason,
    };
  } catch {
    urlCheck = {
      ok: false,
      status: null,
      finalUrl: null,
      reason: "URL failed the safety check after payment",
    };
  }

  const status: PlacementRecord["status"] = urlCheck?.ok ? "active" : "needs_review";
  const now = new Date().toISOString();

  const record: PlacementRecord = {
    id: event.id,
    placement: placement.id,
    projectName: metadata.projectName ?? "",
    projectUrl: projectUrl ?? metadata.projectUrl ?? "",
    builderName: metadata.builderName ?? "",
    email: session.customer_details?.email ?? session.customer_email ?? "",
    stripeSessionId: session.id,
    amountTotal: session.amount_total ?? null,
    currency: session.currency ?? null,
    status,
    urlCheck,
    activatedAt: status === "active" ? now : null,
    createdAt: now,
  };

  try {
    await appendRecord<PlacementRecord>("placements.json", record);
  } catch {
    return NextResponse.json({ message: "Could not record placement." }, { status: 500 });
  }

  const reason = urlCheck?.reason ?? "Not checked";
  const emailCopy = placementReceiptEmail({
    builderName: record.builderName || "there",
    projectName: record.projectName,
    projectUrl: record.projectUrl,
    placementName: placement.name,
    status: status === "active" ? "Active" : "Held for manual review",
    urlReason: reason,
  });

  if (record.email) {
    await sendTransactionalEmail({
      to: record.email,
      subject:
        status === "active"
          ? "Zyvibe placement receipt and activation"
          : "Zyvibe placement receipt: manual review needed",
      html: emailCopy,
    }).catch(() => undefined);
  }

  await sendTransactionalEmail({
    to: SITE.emails.alertsTo,
    subject: `Placement ${status}: ${record.projectName}`,
    html: placementAlertEmail({
      projectName: record.projectName,
      projectUrl: record.projectUrl,
      builderName: record.builderName,
      email: record.email,
      placementId: placement.id,
      sessionId: session.id,
      status,
      urlReason: reason,
    }),
  }).catch(() => undefined);

  return NextResponse.json({ received: true, status });
}
