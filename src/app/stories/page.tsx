import type { Metadata } from 'next';
import StoriesContent from './StoriesContent';

export const metadata: Metadata = {
    title: 'Stories – Faith Fighters For America',
    description: 'Real testimonies from the neighborhoods, families, and first responders your generosity reaches.',
};

export default function StoriesPage() {
    return <StoriesContent />;
}
