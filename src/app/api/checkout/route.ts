import { auth } from '@clerk/nextjs/server';
import { stripe, SUBSCRIPTION_PLANS } from '@/lib/stripe/config';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = await auth();
  const { plan = 'PREMIUM' } = await req.json();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const selectedPlan = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS];

  if (!selectedPlan) {
    return new NextResponse('Invalid Plan', { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
