import type { Metadata } from 'next';
import { Suspense } from 'react';
import PageBanner from '@/components/frontend/PageBanner';
import Newsletter from '@/components/frontend/Newsletter';
import DonationContent from './DonationContent';

export const metadata: Metadata = {
  title: 'Donation – Faith Fighters For America',
  description:
    'Support our cause to rebuild the moral and spiritual foundation of our nation. Every contribution helps us strengthen faith, unity, and purpose across America.',
};

export default function DonationPage() {
  return (
    <>
      <PageBanner
        title="Donation"
        backgroundImage="/images/hero-flag.png"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Donation', href: '/donation' },
        ]}
      />

      <Suspense fallback={null}>
        <DonationContent />
      </Suspense>

      <Newsletter />
    </>
  );
}
