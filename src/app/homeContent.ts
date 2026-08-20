// Defaults for the CMS-editable fields on the Home page. Keys must match
// FFFA-Backend-stage/src/site-content/manifests/home.manifest.ts exactly —
// a mismatched key just silently falls back to its default instead of
// picking up an admin edit, so keep the two in sync when either changes.

export interface HomeWhatWeDoItem {
    title: string;
    desc: string;
}

export interface HomeTestimonial {
    quote: string;
    bio: string;
    name: string;
    role: string;
    initials: string;
}

export interface HomeContent {
    heroBadgeText: string;
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroTitleLine3: string;
    heroLead: string;
    heroTrustText: string;
    heroVideoCaption: string;
    heroVideoPoster: string;
    joinNowLabel: string;
    needHelpLabel: string;
    whatWeDoEyebrow: string;
    whatWeDoTitle: string;
    whatWeDo: HomeWhatWeDoItem[];
    testimonials: HomeTestimonial[];
    campaignsEyebrow: string;
    campaignsTitle: string;
    campaignsSeeAllLabel: string;
    purposeEyebrow: string;
    purposeTitle: string;
    purposeLead: string;
    purposeStat1: string;
    purposeStat2: string;
    purposeStat3: string;
    purposeTagline: string;
    storeEyebrow: string;
    storeTitle: string;
    storeSubtitle: string;
    storeCtaLabel: string;
}

export const HOME_DEFAULTS: HomeContent = {
    heroBadgeText: '963 Missions Completed',
    heroTitleLine1: 'One Nation.',
    heroTitleLine2: 'One Spirit.',
    heroTitleLine3: 'One Mission.',
    heroLead: 'A national movement of everyday Americans strengthening communities, restoring unity, and lifting up those in need through faith-driven action.',
    heroTrustText: 'Join the Founding Members',
    heroVideoCaption: 'One Nation. One Mission. · 1:53',
    heroVideoPoster: '/images/video-thumbnail.png',
    joinNowLabel: 'Join Now',
    needHelpLabel: 'Need Help',
    whatWeDoEyebrow: '— What We Do',
    whatWeDoTitle: 'Faith in action, made visible',
    whatWeDo: [
        { title: 'Transparent Giving', desc: 'Every dollar is tracked and every mission is shared, so you always see the difference you make.' },
        { title: 'Community Action', desc: 'Boots-on-the-ground missions — food drives, shelter support, disaster relief — in neighborhoods nationwide.' },
        { title: 'Stories of Impact', desc: 'Real testimonies from the people you help, turning generosity into a story that inspires us all.' },
    ],
    testimonials: [
        {
            quote: "I couldn't even begin to imagine what my outcome would have been if it wasn't for Faith Fighters For America.",
            bio: "Mum-of-four Nikki Benstead needed the charity's help when her horse spooked and reared up, falling backwards on top of her.",
            name: 'Nikki Benstead', role: 'Mission beneficiary', initials: 'NB',
        },
        {
            quote: "They didn't just send help — they showed up, prayed with us, and helped us rebuild. We finally felt seen.",
            bio: 'After a house fire took everything, the Alvarez family turned to Faith Fighters for emergency housing and hope.',
            name: 'Maria Alvarez', role: 'Mission beneficiary', initials: 'MA',
        },
    ],
    campaignsEyebrow: '— Active Campaigns',
    campaignsTitle: 'Fund a mission today',
    campaignsSeeAllLabel: 'See all campaigns',
    purposeEyebrow: 'Our Purpose',
    purposeTitle: 'Making Kindness Visible.',
    purposeLead: 'We unite communities through transparent giving and meaningful action, connecting people who want to help with those who need it most.',
    purposeStat1: 'Stronger Communities',
    purposeStat2: 'Real Compassion',
    purposeStat3: 'Lasting Impact',
    purposeTagline: 'One Nation. One Spirit. One Mission.',
    storeEyebrow: '— Official Store',
    storeTitle: 'Wear the mission',
    storeSubtitle: 'Every purchase funds faith-driven initiatives.',
    storeCtaLabel: 'Visit the store',
};
