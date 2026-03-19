import type { Metadata } from 'next';
import PageBanner from '@/components/PageBanner';
import legalStyles from '../privacy-policy/page.module.css';

export const metadata: Metadata = {
    title: 'Refund Policy – Faith Fighters For America',
    description: 'Refund Policy for Faith Fighters For America. Last updated March 6, 2026.',
};

export default function RefundPolicyPage() {
    return (
        <>
            <PageBanner
                title="Refund Policy"
                backgroundImage="/images/hero-flag.png"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Refund Policy', href: '/refund-policy' },
                ]}
            />

            <section className={`section ${legalStyles.legalSection}`}>
                <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
                    <p className={legalStyles.lastUpdated}>Last Updated: March 6, 2026</p>

                    <div className={legalStyles.legalContent}>
                        <p>
                            Faith Fighters For America (&ldquo;FFFA&rdquo;) is committed to transparency and fairness
                            in all financial transactions. Please read this Refund Policy carefully before making
                            any donation or subscription purchase.
                        </p>

                        <h2>1. Donations</h2>
                        <p>
                            All donations made to Faith Fighters For America are considered voluntary contributions
                            and are <strong>generally non-refundable</strong>. Once a donation has been processed
                            and allocated to charitable causes, it cannot be reversed.
                        </p>

                        <h2>2. Disputed or Erroneous Charges</h2>
                        <p>
                            If you believe a charge was made in error or without your authorization, you have a
                            <strong> 7-day window</strong> from the date of the charge to contact us at{' '}
                            <a href="mailto:info@faithfightersforamerica.com">
                                info@faithfightersforamerica.com
                            </a>{' '}
                            to report the issue. We will investigate promptly and, if an error is confirmed,
                            process a refund.
                        </p>

                        <h2>3. Refund Processing</h2>
                        <p>
                            Once a refund is approved, it will be processed within <strong>7–10 business days</strong>.
                            Refunds are returned to the original payment method. Processing times may vary depending
                            on your financial institution.
                        </p>

                        <h2>4. Membership Fees</h2>
                        <p>
                            Monthly membership fees are <strong>generally non-refundable</strong>. If you cancel
                            your subscription, your membership remains active through the end of the current
                            billing period, after which no further charges will occur. No partial-month refunds
                            are issued.
                        </p>

                        <h2>5. Store Purchases</h2>
                        <p>
                            Store items may be returned within <strong>14 days</strong> of purchase if they are
                            unused and in their original condition. To initiate a return, contact us at
                            info@faithfightersforamerica.com with your order details.
                        </p>

                        <h2>6. How to Request a Refund</h2>
                        <p>To request a refund:</p>
                        <ul>
                            <li>Email <a href="mailto:info@faithfightersforamerica.com">info@faithfightersforamerica.com</a></li>
                            <li>Include your full name, email address used for the transaction, and transaction date</li>
                            <li>Describe the reason for your refund request</li>
                            <li>Our team will respond within 2 business days</li>
                        </ul>

                        <h2>7. Contact</h2>
                        <p>
                            Questions about refunds? Contact us at{' '}
                            <a href="mailto:info@faithfightersforamerica.com">
                                info@faithfightersforamerica.com
                            </a>{' '}
                            or visit our{' '}
                            <a href="/contact">Contact page</a>.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
