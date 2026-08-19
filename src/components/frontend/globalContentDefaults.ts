// Defaults for CMS-editable content shared across many pages (not a single
// routed page — page slug 'global' in the backend). Keys must match
// FFFA-Backend-stage/src/site-content/manifests/global.manifest.ts exactly.

export interface GlobalContent {
    newsletterLabel: string;
    newsletterTitle: string;
    newsletterDescription: string;
    newsletterBtnLabel: string;
    newsletterNoSpamText: string;
}

export const GLOBAL_DEFAULTS: GlobalContent = {
    newsletterLabel: 'NEWSLETTER',
    newsletterTitle: 'STAY CONNECTED TO THE MOVEMENT',
    newsletterDescription: 'Get inspiring stories, volunteer opportunities, community updates, and behind-the-scenes access delivered straight to your inbox.',
    newsletterBtnLabel: 'JOIN THE MISSION',
    newsletterNoSpamText: 'No spam. Just purpose-driven updates.',
};
