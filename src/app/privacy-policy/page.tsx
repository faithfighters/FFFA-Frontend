import type { Metadata } from 'next';
import PageBanner from '@/components/PageBanner';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Privacy Policy – Faith Fighters For America',
    description: 'Privacy Policy for Faith Fighters For America. Last updated February 5, 2026.',
};

export default function PrivacyPolicyPage() {
    return (
        <>
            <PageBanner
                title="Privacy Policy"
                backgroundImage="/images/hero-flag.png"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Privacy Policy', href: '/privacy-policy' },
                ]}
            />

            <section className={`section ${styles.legalSection}`}>
                <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
                    <p className={styles.lastUpdated}>Last Updated: February 5, 2026</p>

                    <div className={styles.legalContent}>
                        <p>
                            Faith Fighters For America (&ldquo;FFFA,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to
                            protecting your personal information and your right to privacy. Our core commitment is simple:
                            <strong> We do not sell, trade, or rent your personal information to third parties.</strong>
                        </p>

                        <h2>1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, including:</p>
                        <ul>
                            <li>Name, email address, and phone number when you register or contact us</li>
                            <li>Billing and payment information (processed securely through Stripe)</li>
                            <li>Profile information and membership plan details</li>
                            <li>Volunteer application information</li>
                            <li>Communications you send to us via contact forms or email</li>
                        </ul>

                        <h2>2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Process your membership subscription and donations</li>
                            <li>Send you receipts, tax letters, and account-related communications</li>
                            <li>Provide you with platform features including voting, video submissions, and impact reports</li>
                            <li>Send newsletters and community updates (you may opt out at any time)</li>
                            <li>Improve our platform and services</li>
                            <li>Comply with legal obligations</li>
                        </ul>

                        <h2>3. How We Share Your Information</h2>
                        <p>
                            We do not sell or rent your personal information. We may share your information with:
                        </p>
                        <ul>
                            <li><strong>Service Providers:</strong> Stripe (payment processing), email providers, and hosting services who are contractually obligated to keep your data secure</li>
                            <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, sale, or transfer of assets, with notice to you</li>
                        </ul>

                        <h2>4. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your personal information,
                            including SSL encryption for data transmission and secure storage of sensitive data.
                            Payment information is processed and stored by Stripe and never stored on our servers.
                        </p>

                        <h2>5. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access the personal information we hold about you</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your personal data (subject to legal obligations)</li>
                            <li>Opt out of marketing communications at any time</li>
                            <li>Cancel your membership at any time</li>
                        </ul>

                        <h2>6. Cookies</h2>
                        <p>
                            We use cookies and similar tracking technologies to improve your browsing experience,
                            analyze site traffic, and understand where our visitors are coming from. You can
                            control cookie settings through your browser preferences.
                        </p>

                        <h2>7. Children&apos;s Privacy</h2>
                        <p>
                            Our platform is not directed to children under 13. We do not knowingly collect
                            personal information from children under 13. If you believe we have inadvertently
                            collected such information, please contact us immediately.
                        </p>

                        <h2>8. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any
                            material changes by posting the new policy on this page with an updated date.
                        </p>

                        <h2>9. Contact Us</h2>
                        <p>
                            For privacy-related questions or requests, please contact us at:{' '}
                            <a href="mailto:privacy@faithfightersforamerica.com">
                                privacy@faithfightersforamerica.com
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
