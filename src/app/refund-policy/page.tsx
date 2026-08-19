import type { Metadata } from 'next';
import RefundPolicyContent from './RefundPolicyContent';

export const metadata: Metadata = {
    title: 'Refund Policy – Faith Fighters For America',
    description: 'Refund Policy for Faith Fighters For America. Last updated March 6, 2026.',
};

export default function RefundPolicyPage() {
    return <RefundPolicyContent />;
}
