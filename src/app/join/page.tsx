import type { Metadata } from 'next';
import PageBanner from '@/components/PageBanner';
import JoinContent from './JoinContent';

export const metadata: Metadata = {
    title: 'Join The Movement – Faith Fighters For America',
    description:
        'Choose your Faith Fighters membership plan. 80% of every dollar goes directly to the causes your community votes for.',
};

export default function JoinPage() {
    return (
        <>
            <PageBanner
                title="Join The Movement"
                backgroundImage="/images/hero-flag.png"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Join The Movement', href: '/join' },
                ]}
            />
            <JoinContent />
        </>
    );
}
