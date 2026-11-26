import { NextResponse } from "next/server";
import { appendRecord, findSubscriber, type Subscriber } from "@/lib/store";
import { cleanText, isEmail } from "@/lib/validate";

export const runtime = "nodejs";

const CONSENT_TEXT =
  "By subscribing, you agree to receive Zyvibe Digest emails. You can unsubscribe at any time.";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Send a JSON body." }, { status: 400 });
  }

  const email = isEmail(body.email) ? body.email.trim().toLowerCase() : null;
  if (!email) {
    return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json(
      { message: "Subscription requires consent to receive Zyvibe Digest emails." },
      { status: 400 }
    );
  }

  const originHeader = request.headers.get("origin") ?? "";
  let sourceDomain = cleanText(body.sourceDomain, 120).toLowerCase();
  if (!sourceDomain) {
    try {
      sourceDomain = new URL(originHeader).hostname;
    } catch {
      sourceDomain = "unknown";
    }
  }
  if (!/^[a-z0-9.-]+$/.test(sourceDomain)) sourceDomain = "unknown";

  const sourcePath = cleanText(body.sourcePath, 200) || "/";

  try {
    const existing = await findSubscriber(email);
    if (existing) {
      return NextResponse.json({ message: "This email is already on the Zyvibe Digest list." });
    }

    const record: Subscriber = {
      email,
      sourceDomain,
      sourcePath,
      consentText: CONSENT_TEXT,
      createdAt: new Date().toISOString(),
      verified: false,
    };

    await appendRecord<Subscriber>("subscribers.json", record);

    // Optional hand-off to the MailPoet WordPress endpoint. MailPoet owns the digest list;
    // Resend is never used for newsletter capture or broadcasts.
    const forwardUrl = process.env.DIGEST_SIGNUP_WEBHOOK_URL;
    if (forwardUrl) {
      await fetch(forwardUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(process.env.DIGEST_SIGNUP_WEBHOOK_SECRET
            ? { authorization: `Bearer ${process.env.DIGEST_SIGNUP_WEBHOOK_SECRET}` }
            : {}),
        },
        body: JSON.stringify({ email, sourceDomain, sourcePath, consentText: CONSENT_TEXT }),
      }).catch(() => undefined);
    }

    return NextResponse.json({
      message: "You are on the Zyvibe Digest list. You can unsubscribe from any email.",
    });
  } catch {
    return NextResponse.json(
      { message: "The signup could not be saved. Please try again." },
      { status: 500 }
    );
  }
}
