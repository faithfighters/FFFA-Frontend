// Defaults for the CMS-editable fields on the Login page. Keys must match
// FFFA-Backend-stage/src/site-content/manifests/login.manifest.ts exactly —
// a mismatched key just silently falls back to its default instead of
// picking up an admin edit, so keep the two in sync.

export interface LoginPageContent {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    footerText: string;
    footerLinkLabel: string;
}

export const LOGIN_DEFAULTS: LoginPageContent = {
    heroEyebrow: 'Welcome Back',
    heroTitle: 'One Spirit. One Mission.',
    heroLead: 'Sign in to track your giving, follow your missions, and stand with 10,000+ Americans.',
    footerText: 'New to Faith Fighters?',
    footerLinkLabel: 'Create an account',
};
