// Defaults for the CMS-editable fields on the Register page (covers both
// the donor and help-flow variants). Keys must match
// FFFA-Backend-stage/src/site-content/manifests/register.manifest.ts
// exactly — a mismatched key just silently falls back to its default
// instead of picking up an admin edit, so keep the two in sync.

export interface RegisterHelpCard {
    title: string;
    desc: string;
}

export interface RegisterPageContent {
    donorHeroEyebrow: string;
    donorHeroTitle: string;
    donorHeroLead: string;
    donorFooterText: string;
    donorFooterLinkLabel: string;
    helpHeroEyebrow: string;
    helpHeroTitle: string;
    helpHeroLead: string;
    howWeHelpEyebrow: string;
    howWeHelpTitle: string;
    helpCards: RegisterHelpCard[];
    shareStoryEyebrow: string;
    shareStoryTitle: string;
    shareStoryText: string;
    submitRequestEyebrow: string;
    submitRequestTitle: string;
    submitRequestText: string;
}

export const REGISTER_DEFAULTS: RegisterPageContent = {
    donorHeroEyebrow: 'Join the Movement',
    donorHeroTitle: 'One Spirit. One Mission.',
    donorHeroLead: 'Create your account to track your giving, join missions, and stand with 10,000+ Americans.',
    donorFooterText: 'Already have an account?',
    donorFooterLinkLabel: 'Log In',
    helpHeroEyebrow: 'Need Help',
    helpHeroTitle: "We're Here for You",
    helpHeroLead: 'If you or someone you know is in need, reach out. No situation is too small for compassion.',
    howWeHelpEyebrow: '— How We Help',
    howWeHelpTitle: 'Ways we can support you',
    helpCards: [
        { title: 'Housing & shelter', desc: 'Emergency housing, repairs, and essentials.' },
        { title: 'Food & supplies', desc: 'Meals, groceries, and daily necessities.' },
        { title: 'Disaster relief', desc: 'Rapid response for families hit by crisis.' },
        { title: 'Prayer & care', desc: 'Encouragement, connection, and follow-up.' },
    ],
    shareStoryEyebrow: '— Share Your Story',
    shareStoryTitle: 'Your story matters',
    shareStoryText: 'Every mission starts with someone reaching out — thank you for taking this step.',
    submitRequestEyebrow: '— Submit Your Request',
    submitRequestTitle: "A few details & you're done",
    submitRequestText: "No account needed — we'll create your member account with this request so you can track it.",
};
