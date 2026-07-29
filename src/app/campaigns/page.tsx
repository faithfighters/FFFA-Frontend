import type { Metadata } from 'next';
import CampaignsContent from './CampaignsContent';

export const metadata: Metadata = {
    title: 'Campaigns – Faith Fighters For America',
    description: 'Choose a cause close to your heart. Track its progress. See exactly where your giving goes.',
};

export default function CampaignsPage() {
    return <CampaignsContent />;
}
