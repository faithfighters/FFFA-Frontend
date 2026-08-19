// Defaults for the CMS-editable fields on the Campaigns page. Keys must
// match FFFA-Backend-stage/src/site-content/manifests/campaigns.manifest.ts
// exactly — a mismatched key just silently falls back to its default
// instead of picking up an admin edit, so keep the two in sync.

export interface CampaignItem {
    title: string;
    videoUrl: string;
    image: string;
    desc: string;
}

export interface CampaignsPageContent {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    missionBtnLabel: string;
    campaigns: CampaignItem[];
}

export const CAMPAIGNS_DEFAULTS: CampaignsPageContent = {
    heroEyebrow: 'Campaigns',
    heroTitle: 'Fund a Mission',
    heroLead: 'Choose a cause close to your heart. Track its progress. See exactly where your giving goes.',
    missionBtnLabel: 'Support this mission',
    campaigns: [
        { title: 'Bills Paid', videoUrl: 'https://faithfightersamerica.com/video8.mp4', image: '/images/img-01.jpg', desc: 'A family caught up on overdue utilities and kept the power on.' },
        { title: 'Car Payment Paid', videoUrl: 'https://faithfightersamerica.com/video4.mp4', image: '/images/img-02.jpg', desc: 'A worker kept the car that gets them to their job every day.' },
        { title: 'Hotel Stay Covered', videoUrl: 'https://faithfightersamerica.com/video5.mp4', image: '/images/img-03.jpg', desc: 'A family off the street and into a safe, warm place for the night.' },
        { title: 'Prayers Answered', videoUrl: 'https://faithfightersamerica.com/video11.mp4', image: '/images/img-05.png', desc: 'When hope had run out, the community showed up in force.' },
        { title: 'Rent Covered', videoUrl: 'https://faithfightersamerica.com/video7.mp4', image: '/images/img-05.jpg', desc: 'A family kept their home when the rent came due.' },
        { title: 'Student Loans Paid Off', videoUrl: 'https://faithfightersamerica.com/video6.mp4', image: '/images/img-06.jpg', desc: 'A graduate set free from the weight of student debt.' },
    ],
};
