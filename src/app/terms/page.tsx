import type { Metadata } from 'next';
import TermsContent from './TermsContent';

export const metadata: Metadata = {
    title: 'Terms & Conditions – Faith Fighters For America',
    description: 'Terms and Conditions for Faith Fighters For America. Last updated January 2, 2026.',
};

export default function TermsPage() {
    return <TermsContent />;
}
