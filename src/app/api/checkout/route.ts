import { NextResponse } from "next/server";
import Stripe from "stripe";
import { placementById, SITE } from "@/lib/site";
import { cleanText, isEmail, normalisePublicUrl, ValidationError } from "@/lib/validate";

export const runtime = "nodejs";

const ALLOWED_ORIGINS = new Set([
  "https://zyvibe.com",
  "https://www.zyvibe.com",
  "http://localhost:3211",
  "http://127.0.0.1:3211",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function resolveOrigin(request: Request): string {
  const origin = request.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.has(origin)) return origin;
  return SITE.url;
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      {
        ok: false,
        mode: "unconfigured",
        message: "Stripe Checkout is not configured in this local environment.",
      },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Send a JSON body." }, { status: 400 });
  }

  const placement = placementById(cleanText(body.placement, 40));
  if (!placement) {
    return NextResponse.json({ message: "Choose a placement." }, { status: 400 });
  }

  const projectName = cleanText(body.projectName, 80);
  const builderName = cleanText(body.builderName, 80);
  if (projectName.length < 2 || builderName.length < 2) {
    return NextResponse.json(
      { message: "Add the project name and the builder name." },
      { status: 400 }
    );
  }

  let projectUrl: string;
  try {
    projectUrl = normalisePublicUrl(body.projectUrl);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof ValidationError
            ? error.message
            : "Add a public https project URL.",
      },
      { status: 400 }
    );
  }

  const email = isEmail(body.email) ? body.email.trim().toLowerCase() : "";
  if (!email) {
    return NextResponse.json({ message: "Add a valid receipt email." }, { status: 400 });
  }

  const origin = resolveOrigin(request);
  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: placement.currency,
            unit_amount: placement.amount,
            product_data: {
              name: `Zyvibe ${placement.name}`,
              description: `Labeled Advertisement placement on zyvibe.com for ${placement.duration}.`,
            },
          },
        },
      ],
      metadata: {
        placement: placement.id,
        projectName,
        projectUrl,
        builderName,
      },
      success_url: `${origin}/promote/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/promote?canceled=1`,
      allow_promotion_codes: false,
    });

    if (!session.url) {
      return NextResponse.json(
        { message: "Stripe did not return a checkout URL." },
        { status: 502 }
      );
    }
    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe Checkout could not be created.";
    return NextResponse.json({ message }, { status: 502 });
  }
}
