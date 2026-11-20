import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { isEventProcessed, markEventProcessed, activatePromotedListing } from '@/lib/data-store';
import { sendPaymentConfirmationEmail } from '@/lib/email';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      // Local dev or fallback parsing
      event = JSON.parse(rawBody) as Stripe.Event;
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 1. Idempotency Check: Don't process the same event twice
  if (isEventProcessed(event.id)) {
    console.log(`[Stripe Webhook] Event ${event.id} already processed. Skipping idempotently.`);
    return NextResponse.json({ received: true, alreadyProcessed: true });
  }

  // 2. Handle successful checkout session
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    const customerEmail = session.customer_details?.email || metadata.customerEmail || 'customer@example.com';
    const customerName = session.customer_details?.name || metadata.listingName || 'Valued Builder';
    const listingName = metadata.listingName || 'New Listing';
    const listingType = (metadata.listingType as 'showcase' | 'solo_service') || 'showcase';
    const listingUrl = metadata.listingUrl || 'https://zyvibe.com';
    const listingDescription = metadata.listingDescription || '';
    const amountTotal = session.amount_total || 4900;
    const currency = session.currency || 'usd';

    console.log(`[Stripe Webhook] Processing activation for: "${listingName}" (${listingType})`);

    // Activate and save the listing to content directory
    if (listingType === 'solo_service') {
      activatePromotedListing(
        {
          name: listingName,
          title: listingName,
          oneLiner: listingDescription,
          description: listingDescription,
          providerType: 'Solo Developer',
          founderName: customerName,
          founderHandle: `@${customerName.toLowerCase().replace(/\s+/g, '')}`,
          location: 'Remote / Global',
          rateOrPricing: 'Custom Quote',
          skillsAndStack: ['Next.js', 'AI Agents', 'Automation'],
          portfolioOrProofUrl: listingUrl,
          contactEmailOrUrl: customerEmail,
        },
        'solo_service'
      );
    } else {
      activatePromotedListing(
        {
          name: listingName,
          tagline: listingDescription,
          description: listingDescription,
          builderName: customerName,
          builderHandle: `@${customerName.toLowerCase().replace(/\s+/g, '')}`,
          agentStack: ['AI Agents', 'Next.js'],
          websiteUrl: listingUrl,
          category: 'Promoted Showcase',
          featured: true,
        },
        'showcase'
      );
    }

    // Dispatch transactional confirmation email via mail.zyvibe.com (Resend)
    await sendPaymentConfirmationEmail({
      toEmail: customerEmail,
      customerName,
      listingName,
      listingType: listingType === 'solo_service' ? 'Remote Solo Service' : 'Builder Showcase',
      amountTotal,
      currency,
      sessionId: session.id,
    });

    // 3. Mark event processed permanently
    markEventProcessed(event.id);
  }

  return NextResponse.json({ received: true, eventId: event.id });
}
