// Defaults for the CMS-editable fields on the Contact page. Keys must match
// FFFA-Backend-stage/src/site-content/manifests/contact.manifest.ts exactly —
// a mismatched key just silently falls back to its default instead of
// picking up an admin edit, so keep the two in sync.

export interface ContactPageContent {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    connectEyebrow: string;
    connectTitle: string;
    emailAddress: string;
    phoneText: string;
    address: string;
    youtubeUrl: string;
    xUrl: string;
    facebookUrl: string;
    tiktokUrl: string;
    sendMessageEyebrow: string;
    sendMessageTitle: string;
    successText: string;
    submitBtnLabel: string;
}

export const CONTACT_DEFAULTS: ContactPageContent = {
    heroEyebrow: 'Get in Touch',
    heroTitle: 'Contact Us',
    heroLead: 'Questions, ideas, or want to get involved? Reach out and join us in strengthening faith and unity across America.',
    connectEyebrow: 'Reach Us',
    connectTitle: 'Ways to connect',
    emailAddress: 'info@faithfightersforamerica.com',
    phoneText: "Call us today — we'd love to hear from you.",
    address: '1751 Mound St, Suite 201 · Sarasota, FL 34236',
    youtubeUrl: 'https://www.youtube.com/@FaithFightersforAmerica',
    xUrl: '#',
    facebookUrl: '#',
    tiktokUrl: '#',
    sendMessageEyebrow: 'Send a Message',
    sendMessageTitle: "We'd love to hear from you",
    successText: "✓ Thank you! We'll get back to you soon.",
    submitBtnLabel: 'Send message',
};
