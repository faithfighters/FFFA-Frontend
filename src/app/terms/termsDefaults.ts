// Defaults for the CMS-editable fields on the Terms page. Keys must match
// FFFA-Backend-stage/src/site-content/manifests/terms.manifest.ts exactly —
// a mismatched key just silently falls back to its default instead of
// picking up an admin edit, so keep the two in sync.

export interface LegalSection {
    heading: string;
    body: string;
}

export interface TermsPageContent {
    heroTitle: string;
    lastUpdated: string;
    introText: string;
    sections: LegalSection[];
    contactHeading: string;
    contactText: string;
    contactEmail: string;
}

export const TERMS_DEFAULTS: TermsPageContent = {
    heroTitle: 'Terms & Conditions',
    lastUpdated: 'January 2, 2026',
    introText: 'Welcome to Faith Fighters For America ("FFFA"). By accessing or using our website and platform, you agree to be bound by these Terms and Conditions. Please read them carefully.',
    sections: [
        { heading: '1. Acceptance of Terms', body: 'By accessing or using our services, you confirm that you are at least 18 years of age and agree to comply with these Terms and Conditions and all applicable laws and regulations.' },
        { heading: '2. Membership & Subscriptions', body: 'Membership plans are offered on a monthly recurring basis. By subscribing, you authorize FFFA to charge your payment method on a recurring basis. You may cancel your subscription at any time through your account portal. Cancellations take effect at the end of the current billing period.\n- Faith Fighter: $30/month — 30 votes per cycle' },
        { heading: '3. Donations', body: '80% of subscription revenue is allocated to community causes selected by member votes. 20% supports platform operations. Donations are non-refundable unless an error or unauthorized charge is reported within 7 days.' },
        { heading: '4. Giveaway Rules', body: 'FFFA giveaways are open to U.S. residents 18 years of age or older. No purchase is necessary to enter or win. Void where prohibited by law. One entry per person. Winners are selected by random drawing and notified within 72 hours. Prizes are non-transferable and have no cash equivalent.' },
        { heading: '5. User Content', body: 'By submitting videos, stories, or other content to our platform, you grant FFFA a non-exclusive, royalty-free license to use, display, and distribute that content in connection with our services. You are responsible for ensuring you have the right to submit any content you upload.' },
        { heading: '6. Prohibited Use', body: 'You agree not to:\n- Use our platform for any unlawful purpose\n- Submit false, misleading, or fraudulent content\n- Attempt to manipulate the voting system\n- Harass, threaten, or harm other users\n- Attempt to gain unauthorized access to our systems' },
        { heading: '7. Disclaimer of Warranties', body: 'Our platform and materials are provided "as is" without warranties of any kind, either express or implied. FFFA does not warrant that the service will be uninterrupted, error-free, or free from viruses or other harmful components.' },
        { heading: '8. Limitation of Liability', body: 'To the maximum extent permitted by law, FFFA shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of our platform.' },
        { heading: '9. Changes to Terms', body: 'We reserve the right to modify these Terms at any time. Continued use of our platform after changes are posted constitutes acceptance of the new Terms.' },
    ],
    contactHeading: '10. Contact',
    contactText: 'Questions about these Terms? Contact us at:',
    contactEmail: 'info@faithfightersforamerica.com',
};
