// Defaults for the CMS-editable fields on the Stories page. Keys must match
// FFFA-Backend-stage/src/site-content/manifests/stories.manifest.ts exactly —
// a mismatched key just silently falls back to its default instead of
// picking up an admin edit, so keep the two in sync when either changes.

export interface StoryItem {
    title: string;
    videoUrl: string;
    thumbnail: string;
    duration: string;
}

export interface StoriesPageContent {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    featuredVideoUrl: string;
    featuredVideoPoster: string;
    featuredCaption: string;
    testimonialsEyebrow: string;
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    stories: StoryItem[];
    shareCardTitle: string;
    shareCardDescription: string;
    shareBtnLabel: string;
    benefitLabelsCsv: string;
    noteText: string;
}

export const STORIES_DEFAULTS: StoriesPageContent = {
    heroEyebrow: 'Stories & Media',
    heroTitle: 'Stories of Impact',
    heroLead: 'Real testimonies from the neighborhoods, families, and first responders your generosity reaches.',
    featuredVideoUrl: 'https://faithfightersamerica.com/video13.mp4',
    featuredVideoPoster: '/images/video-thumbnail.png',
    featuredCaption: 'Our Story · A Nation United · 1:53',
    testimonialsEyebrow: 'Testimonials',
    testimonialsTitle: 'Real families. Real outcomes.',
    testimonialsSubtitle: 'Tap any story to watch.',
    stories: [
        { title: 'Bills Paid', videoUrl: 'https://faithfightersamerica.com/video8.mp4', thumbnail: '/images/img-01.jpg', duration: '0:57' },
        { title: 'Car Payment Paid', videoUrl: 'https://faithfightersamerica.com/video4.mp4', thumbnail: '/images/img-02.jpg', duration: '0:34' },
        { title: 'Hotel Stay Covered', videoUrl: 'https://faithfightersamerica.com/video5.mp4', thumbnail: '/images/img-03.jpg', duration: '1:12' },
        { title: 'Prayers Answered', videoUrl: 'https://faithfightersamerica.com/video11.mp4', thumbnail: '/images/img-05.png', duration: '0:32' },
        { title: 'Rent Covered', videoUrl: 'https://faithfightersamerica.com/video7.mp4', thumbnail: '/images/img-05.jpg', duration: '0:27' },
        { title: 'Student Loans Paid Off', videoUrl: 'https://faithfightersamerica.com/video6.mp4', thumbnail: '/images/img-06.jpg', duration: '0:29' },
    ],
    shareCardTitle: 'Your story can inspire someone today.',
    shareCardDescription: "Whether you've received help or want to share how giving back has impacted your life — your story matters.",
    shareBtnLabel: 'Share your story',
    benefitLabelsCsv: 'Inspire others, Encourage hope, Build community, Create change',
    noteText: 'Every submission is reviewed before being featured.',
};
