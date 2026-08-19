// Defaults for the CMS-editable fields on the Store page. Keys must match
// FFFA-Backend-stage/src/site-content/manifests/store.manifest.ts exactly —
// a mismatched key just silently falls back to its default instead of
// picking up an admin edit, so keep the two in sync.

export interface StoreProduct {
    name: string;
    price: string;
    image: string;
    url: string;
}

export interface StoreBenefit {
    title: string;
    text: string;
}

export interface StorePageContent {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    productsEyebrow: string;
    productsTitle: string;
    productsSubtitle: string;
    products: StoreProduct[];
    fullStoreBtnLabel: string;
    benefits: StoreBenefit[];
}

export const STORE_DEFAULTS: StorePageContent = {
    heroEyebrow: 'Official Store',
    heroTitle: 'Wear the Mission',
    heroLead: "Every purchase funds faith-driven initiatives that uplift communities and strengthen America's spirit.",
    productsEyebrow: 'Shop the Collection',
    productsTitle: 'Wear your faith',
    productsSubtitle: 'Tap a product to shop it directly.',
    products: [
        { name: "Men's Faith Tee", price: '30', image: '/images/serve-img.jpg', url: 'https://shop.faithfightersforamerica.com/products/wake-up-with-faith-mens-shirts' },
        { name: "Women's Faith Tank", price: '25', image: '/images/serve-img-2.jpg', url: 'https://shop.faithfightersforamerica.com/products/wake-up-with-faith-female-tanktops' },
        { name: 'Faith Fighters Hat', price: '25', image: '/images/serve-img-3.jpg', url: 'https://shop.faithfightersforamerica.com/products/wake-up-with-faith-hats' },
        { name: 'Wake Up With Faith Coffee', price: '25', image: '/images/serve-img-4.jpg', url: 'https://shop.faithfightersforamerica.com/products/wake-up-with-faith-cofee' },
    ],
    fullStoreBtnLabel: 'Visit the Full Store',
    benefits: [
        { title: 'Ships to all 50 states', text: 'Fast, tracked delivery nationwide.' },
        { title: 'Funds the mission', text: 'Proceeds support faith-driven missions.' },
    ],
};
