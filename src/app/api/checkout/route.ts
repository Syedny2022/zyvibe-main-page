import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, url, description, tier, listingType } = body;

    if (!name || !email || !url) {
      return NextResponse.json(
        { error: 'Name, email, and URL are required.' },
        { status: 400 }
      );
    }

    const priceAmount = tier === 'permanent' ? 14900 : 4900; // in cents ($149 or $49)
    const tierLabel = tier === 'permanent' ? 'Permanent Verified Listing' : '1-Week Featured Showcase';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zyvibe.com';

    // If running in development without live Stripe keys
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
      const demoSuccessUrl = `${siteUrl}/promote/success?session_id=demo_session_${Date.now()}&listing=${encodeURIComponent(name)}`;
      return NextResponse.json({ url: demoSuccessUrl });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Zyvibe Promotion: ${name}`,
              description: `${tierLabel} for ${listingType === 'solo_service' ? 'Remote Solo Service' : 'Builder Showcase'}`,
            },
            unit_amount: priceAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        listingName: name,
        listingUrl: url,
        listingDescription: description || '',
        listingType: listingType || 'showcase',
        tier: tier || 'weekly',
        customerEmail: email,
      },
      success_url: `${siteUrl}/promote/success?session_id={CHECKOUT_SESSION_ID}&listing=${encodeURIComponent(name)}`,
      cancel_url: `${siteUrl}/promote?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to initialize checkout session' },
      { status: 500 }
    );
  }
}
