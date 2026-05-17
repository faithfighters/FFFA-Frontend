import type { Metadata } from 'next';
import PageBanner from '@/components/frontend/PageBanner';
import legalStyles from '../privacy-policy/page.module.css';

export const metadata: Metadata = {
    title: 'Terms & Conditions – Faith Fighters For America',
    description: 'Terms and Conditions for Faith Fighters For America. Last updated January 2, 2026.',
};

export default function TermsPage() {
    return (
        <>
            <PageBanner
                title="Terms & Conditions"
                backgroundImage="/images/hero-flag.png"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Terms & Conditions', href: '/terms' },
                ]}
            />

            <section className={`section ${legalStyles.legalSection}`}>
                <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
                    <p className={legalStyles.lastUpdated}>Last Updated: January 2, 2026</p>

                    <div className={legalStyles.legalContent}>
                        <p>
                            Welcome to Faith Fighters For America (&ldquo;FFFA&rdquo;). By accessing or using our website
                            and platform, you agree to be bound by these Terms and Conditions. Please read them carefully.
                        </p>

                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using our services, you confirm that you are at least 18 years of age
                            and agree to comply with these Terms and Conditions and all applicable laws and regulations.
                        </p>

                        <h2>2. Membership &amp; Subscriptions</h2>
                        <p>
                            Membership plans are offered on a monthly recurring basis. By subscribing, you authorize
                            FFFA to charge your payment method on a recurring basis. You may cancel your subscription
                            at any time through your account portal. Cancellations take effect at the end of the
                            current billing period.
                        </p>
                        <ul>
                            <li>Faith Builder: $39.95/month — 1 vote per cycle</li>
                            <li>Faith Hero: $59.95/month — 2 votes per cycle</li>
                            <li>Faith Fighter: $79.95/month — 3 votes per cycle (weighted)</li>
                        </ul>

                        <h2>3. Donations</h2>
                        <p>
                            All donations are voluntary contributions. 80% of subscription revenue is allocated to
                            community causes selected by member votes. 20% supports platform operations. Donations
                            are non-refundable unless an error or unauthorized charge is reported within 7 days.
                        </p>

                        <h2>4. Giveaway Rules</h2>
                        <p>
                            FFFA giveaways are open to U.S. residents 18 years of age or older. No purchase is
                            necessary to enter or win. Void where prohibited by law. One entry per person.
                            Winners are selected by random drawing and notified within 72 hours. Prizes are
                            non-transferable and have no cash equivalent.
                        </p>

                        <h2>5. User Content</h2>
                        <p>
                            By submitting videos, stories, or other content to our platform, you grant FFFA a
                            non-exclusive, royalty-free license to use, display, and distribute that content
                            in connection with our services. You are responsible for ensuring you have the right
                            to submit any content you upload.
                        </p>

                        <h2>6. Prohibited Use</h2>
                        <p>You agree not to:</p>
                        <ul>
                            <li>Use our platform for any unlawful purpose</li>
                            <li>Submit false, misleading, or fraudulent content</li>
                            <li>Attempt to manipulate the voting system</li>
                            <li>Harass, threaten, or harm other users</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                        </ul>

                        <h2>7. Disclaimer of Warranties</h2>
                        <p>
                            Our platform and materials are provided &ldquo;as is&rdquo; without warranties of any kind,
                            either express or implied. FFFA does not warrant that the service will be uninterrupted,
                            error-free, or free from viruses or other harmful components.
                        </p>

                        <h2>8. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by law, FFFA shall not be liable for any indirect,
                            incidental, special, consequential, or punitive damages arising out of your use of
                            our platform.
                        </p>

                        <h2>9. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms at any time. Continued use of our platform
                            after changes are posted constitutes acceptance of the new Terms.
                        </p>

                        <h2>10. Contact</h2>
                        <p>
                            Questions about these Terms? Contact us at:{' '}
                            <a href="mailto:info@faithfightersforamerica.com">
                                info@faithfightersforamerica.com
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
