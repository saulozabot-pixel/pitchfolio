import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
});

export const SUBSCRIPTION_PLANS = {
  PREMIUM: {
    name: 'Elite Creator Premium',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM!,
    price: 29.90,
  },
  ENTERPRISE: {
    name: 'Elite Creator Enterprise',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE!,
    price: 99.90,
  }
};
