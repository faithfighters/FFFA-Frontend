// Defaults for the CMS-editable fields on the About page. Keys must match
// FFFA-Backend-stage/src/site-content/manifests/about.manifest.ts exactly —
// a mismatched key just silently falls back to its default instead of
// picking up an admin edit, so keep the two in sync when either changes.

export interface AboutMissionVisionCard {
    image: string;
    icon: string;
    title: string;
    text: string;
}

export interface AboutCoreValue {
    icon: string;
    title: string;
    text: string;
}

export interface AboutTeamMember {
    image: string;
    name: string;
    role: string;
    bio: string;
}

export interface AboutContent {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    missionVisionCards: AboutMissionVisionCard[];
    storyEyebrow: string;
    storyTitle: string;
    storyLead: string;
    storyTagsCsv: string;
    coreValuesEyebrow: string;
    coreValuesTitle: string;
    coreValues: AboutCoreValue[];
    leadershipEyebrow: string;
    leadershipTitle: string;
    leadershipTeam: AboutTeamMember[];
    impactTitle: string;
    impactText1: string;
    impactText2: string;
    impactTagline: string;
    joinMissionLabel: string;
    volunteerBtnLabel: string;
}

export const ABOUT_DEFAULTS: AboutContent = {
    heroEyebrow: 'Who We Are',
    heroTitle: 'About Faith Fighters',
    heroLead: 'A movement built on the conviction that a nation grows strong when its people stand united in faith and service.',
    missionVisionCards: [
        { image: '/images/img-07.jpg', icon: '✝', title: 'Mission', text: 'We unite communities with compassion, making every act of giving a shared and visible moment of kindness.' },
        { image: '/images/img-08.jpg', icon: '◎', title: 'Vision', text: 'A transparent movement where everyone can see and celebrate how helping neighbors becomes a story that inspires us all.' },
    ],
    storyEyebrow: 'Our Story',
    storyTitle: 'Strength from unity',
    storyLead: 'Faith Fighters For America was born from a simple conviction: national strength emerges from a unified citizenry and shared faith. We encourage Americans to embody integrity, courage, compassion, and devotion to God and freedom — restoring optimism and reinforcing the communities we call home.',
    storyTagsCsv: 'Integrity, Courage, Compassion, Faith, Freedom',
    coreValuesEyebrow: 'How We Operate',
    coreValuesTitle: 'Our core values',
    coreValues: [
        { icon: '◎', title: 'Open Impact', text: 'Transparency and quantifiable outcomes that demonstrate the tangible difference we make together.' },
        { icon: '📍', title: 'Local First', text: 'Community-level transformation strengthens the broader nation, one neighborhood at a time.' },
        { icon: '🛡', title: 'Stewardship', text: 'Faith-guided responsibility in managing every resource entrusted to us.' },
    ],
    leadershipEyebrow: 'Leadership',
    leadershipTitle: 'Meet the team',
    leadershipTeam: [
        { image: '/images/kevin-jones.jpg', name: 'Kevin Jones "Coach K"', role: 'Founder & CEO', bio: "25+ years in entertainment and entrepreneurship, leading the movement's vision." },
        { image: '/images/james-price.jpg', name: 'James Price', role: 'Co-Founder & Treasurer', bio: 'Automotive & restaurant background with deep community mentorship experience.' },
        { image: '/images/billy-gleason-jr.jpg', name: 'Billy Gleason Jr.', role: 'Co-Founder & Secretary', bio: 'Martial arts instructor focused on character and accountability.' },
    ],
    impactTitle: 'Ready to Make an Impact?',
    impactText1: 'Faith Fighters for America empowers everyday people to create extraordinary change through kindness, service, and transparent giving.',
    impactText2: 'Together, we connect people who want to help with those who need it most, building stronger communities and changing lives—one act of kindness at a time.',
    impactTagline: 'One Nation. One Spirit. One Mission.',
    joinMissionLabel: 'Join the Mission',
    volunteerBtnLabel: 'Volunteer',
};
