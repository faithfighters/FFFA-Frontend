import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('[Stripe] STRIPE_SECRET_KEY not set. Stripe features will not work.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-02-25.clover',
});

export const STRIPE_PRICE_PLAN = process.env.STRIPE_PRICE_PLAN || '';
export const STRIPE_PRICE_WELCOME_KIT = process.env.STRIPE_PRICE_WELCOME_KIT || '';
