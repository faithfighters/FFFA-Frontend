// Defaults for the CMS-editable fields on the Donation page. Keys must
// match FFFA-Backend-stage/src/site-content/manifests/donation.manifest.ts
// exactly — a mismatched key just silently falls back to its default
// instead of picking up an admin edit, so keep the two in sync.

export interface DonationAmountOption {
    value: string;
    label: string;
}

export interface DonationBenefit {
    title: string;
    text: string;
}

export interface DonationPageContent {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    amountLabel: string;
    amountOptions: DonationAmountOption[];
    causeOptionsCsv: string;
    secureNoteText: string;
    benefits: DonationBenefit[];
    modalTitle: string;
    modalSubtitle: string;
    modalBody: string;
    modalCardTitle: string;
    modalCardSubtitle: string;
    modalBtnLabel: string;
}

export const DONATION_DEFAULTS: DonationPageContent = {
    heroEyebrow: 'Give Today',
    heroTitle: 'Your gift, made visible',
    heroLead: '100% transparent. Every dollar tracked to a mission you can follow from start to finish.',
    amountLabel: 'Choose an amount',
    amountOptions: [
        { value: '25', label: '1 family meal' },
        { value: '50', label: 'Shelter kit' },
        { value: '100', label: 'Youth mentor' },
        { value: '250', label: 'Relief supplies' },
        { value: '500', label: 'Rebuild fund' },
    ],
    causeOptionsCsv: "Where it's needed most, Disaster Relief, Youth Programs, Medical Relief, Food Security, Housing",
    secureNoteText: "Secure checkout via Stripe. You'll receive a tax-deductible receipt and a link to follow your mission.",
    benefits: [
        { title: 'Tracked to the dollar', text: 'Follow your gift to the exact mission it funds.' },
        { title: 'Boots on the ground', text: '963 missions delivered by real volunteers.' },
    ],
    modalTitle: 'Donation Successful!',
    modalSubtitle: 'Thank you for your contribution!',
    modalBody: 'Your support helps us continue our mission to strengthen faith, unity, and purpose across America.',
    modalCardTitle: 'Thank you for Supporting!',
    modalCardSubtitle: 'Together we can bring hope and rebuild lives',
    modalBtnLabel: 'Great!',
};
