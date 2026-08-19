// Defaults for the CMS-editable fields on the Volunteer page. Keys must
// match FFFA-Backend-stage/src/site-content/manifests/volunteer.manifest.ts
// exactly — a mismatched key just silently falls back to its default
// instead of picking up an admin edit, so keep the two in sync.

export interface VolunteerRole {
    title: string;
    desc: string;
    image: string;
}

export interface VolunteerStep {
    title: string;
    desc: string;
}

export interface VolunteerPageContent {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    rolesEyebrow: string;
    rolesTitle: string;
    roles: VolunteerRole[];
    howItWorksEyebrow: string;
    howItWorksTitle: string;
    steps: VolunteerStep[];
    signupEyebrow: string;
    signupTitle: string;
    submitBtnLabel: string;
    successTitle: string;
    successText: string;
}

export const VOLUNTEER_DEFAULTS: VolunteerPageContent = {
    heroEyebrow: 'Volunteer',
    heroTitle: 'Serve Your Community',
    heroLead: 'One hour a week or a full weekend — bring your time and talents and make a real difference.',
    rolesEyebrow: 'Find Your Role',
    rolesTitle: 'Six ways to serve',
    roles: [
        { title: 'Event Crew', desc: 'Setup, greeting guests, and event support.', image: '/images/serve-event.jpg' },
        { title: 'Community Outreach', desc: 'Shelter visits, food drives, partner support.', image: '/images/serve-outreach.jpg' },
        { title: 'Prayer & Care Team', desc: 'Encouragement and follow-up support.', image: '/images/serve-prayer.jpg' },
        { title: 'Content & Media', desc: 'Photography, storytelling, social media.', image: '/images/serve-media.jpg' },
        { title: 'Drivers & Logistics', desc: 'Transport supplies and resources.', image: '/images/serve-drive.jpg' },
        { title: 'Fundraising Support', desc: 'Awareness and donation initiatives.', image: '/images/serve-fund.jpg' },
    ],
    howItWorksEyebrow: 'How It Works',
    howItWorksTitle: 'Start in three steps',
    steps: [
        { title: 'Sign up', desc: 'Complete the short form with your info and preferred role.' },
        { title: 'Get matched', desc: 'A dedicated coordinator in your area reaches out to you.' },
        { title: 'Start serving', desc: 'Begin making a tangible difference alongside your community.' },
    ],
    signupEyebrow: 'Ready to Serve?',
    signupTitle: 'Sign up to volunteer',
    submitBtnLabel: 'Submit Volunteer Application →',
    successTitle: 'Thank You!',
    successText: 'A volunteer coordinator will be in touch with you soon.',
};
