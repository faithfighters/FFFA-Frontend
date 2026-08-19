import type { Metadata } from 'next';
import PrivacyPolicyContent from './PrivacyPolicyContent';

export const metadata: Metadata = {
    title: 'Privacy Policy – Faith Fighters For America',
    description: 'Privacy Policy for Faith Fighters For America. Last updated February 5, 2026.',
};

export default function PrivacyPolicyPage() {
    return <PrivacyPolicyContent />;
}
