// Defaults for the CMS-editable fields on the Media page. Keys must match
// FFFA-Backend-stage/src/site-content/manifests/media.manifest.ts exactly —
// a mismatched key just silently falls back to its default instead of
// picking up an admin edit, so keep the two in sync. The videos themselves
// are real submissions fetched server-side, not CMS content.

export interface MediaPageContent {
    heroTitle: string;
    featuredEyebrow: string;
    featuredTitle: string;
    emptyStateText: string;
    galleryEyebrow: string;
    galleryTitle: string;
}

export const MEDIA_DEFAULTS: MediaPageContent = {
    heroTitle: 'Media',
    featuredEyebrow: 'Featured',
    featuredTitle: 'Latest From Our Community',
    emptyStateText: 'No videos yet. Be the first to submit a story!',
    galleryEyebrow: 'All Videos',
    galleryTitle: 'Stories of Impact',
};
