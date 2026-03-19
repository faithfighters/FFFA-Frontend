import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('[Stripe] STRIPE_SECRET_KEY not set. Stripe features will not work.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-02-24.acacia',
});

// Map plan keys to Stripe price IDs (set in .env.local)
export const STRIPE_PRICE_IDS: Record<string, string> = {
    faith_builder: process.env.STRIPE_PRICE_FAITH_BUILDER || '',
    faith_hero: process.env.STRIPE_PRICE_FAITH_HERO || '',
    faith_fighter: process.env.STRIPE_PRICE_FAITH_FIGHTER || '',
};
