import type { Metadata } from 'next';
import PageBanner from '@/components/frontend/PageBanner';
import Newsletter from '@/components/frontend/Newsletter';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Give Away – Faith Fighters For America',
    description: 'WIN 1 OF 3 HARLEY-DAVIDSON MOTORCYCLES. Enter the Faith Fighters For America custom bike giveaway.',
};

export default function GiveawayPage() {
    return (
        <>
            <PageBanner
                title="Give Away"
                backgroundImage="/images/hero-flag.png"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Give Away', href: '/giveaway' },
                ]}
            />

            {/* Hero Banner */}
            <section className={`section ${styles.heroBanner}`}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <span className="section-label section-label--red" style={{ display: 'inline-block' }}>Limited Time</span>
                    <h2 className={styles.giveawayTitle}>WIN 1 OF 3<br />HARLEY-DAVIDSON<br />MOTORCYCLES</h2>
                    <p className={styles.giveawaySubtitle}>
                        Faith Fighters For America is giving away three custom Harley-Davidson motorcycles
                        to celebrate our growing community of faith-driven Americans.
                    </p>
                </div>
            </section>

            {/* Entry Section */}
            <section className={`section section--dark ${styles.entrySection}`}>
                <div className="container">
                    <div className={styles.entryGrid}>
                        <div className={styles.entryInfo}>
                            <span className="section-label section-label--red">How To Enter</span>
                            <h2 className="heading-lg">Enter The Giveaway</h2>
                            <div className={styles.rulesBlock}>
                                <div className={styles.ruleItem}>
                                    <span className={styles.ruleIcon}>✓</span>
                                    <span>No purchase necessary to enter or win</span>
                                </div>
                                <div className={styles.ruleItem}>
                                    <span className={styles.ruleIcon}>✓</span>
                                    <span>Open to U.S. residents 18 years of age or older</span>
                                </div>
                                <div className={styles.ruleItem}>
                                    <span className={styles.ruleIcon}>✓</span>
                                    <span>One entry per person</span>
                                </div>
                                <div className={styles.ruleItem}>
                                    <span className={styles.ruleIcon}>✓</span>
                                    <span>Winner selected by random drawing</span>
                                </div>
                                <div className={styles.ruleItem}>
                                    <span className={styles.ruleIcon}>✓</span>
                                    <span>Winner notified within 72 hours of drawing</span>
                                </div>
                                <div className={styles.ruleItem}>
                                    <span className={styles.ruleIcon}>✓</span>
                                    <span>Prize is non-transferable</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.entryCard}>
                            <div className={styles.prizeBadge}>🏍️</div>
                            <h3>Custom Harley-Davidson</h3>
                            <p>Two exclusive motorcycle giveaway opportunities. Enter via our official GiveButter platform for a chance to win.</p>
                            <a
                                href="https://givebutter.com/faithfightersforamerica"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn--primary"
                                style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-xl)' }}
                            >
                                Enter Custom Bike Give-Away
                                <span className="btn-arrow">→</span>
                            </a>
                            <p className={styles.entryNote}>
                                You will be redirected to our official GiveButter fundraising page.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Terms */}
            <section className={`section ${styles.termsSection}`}>
                <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>
                    <h3 className={styles.termsTitle}>Giveaway Terms</h3>
                    <p className={styles.termsText}>
                        This giveaway is open to U.S. residents who are 18 years of age or older at the time of entry.
                        No purchase is necessary to enter or win. Void where prohibited by law. One entry per person.
                        The winner will be selected by random drawing and notified within 72 hours. The prize is
                        non-transferable and has no cash equivalent. Faith Fighters For America reserves the right
                        to disqualify any entry that does not comply with these terms. By entering, participants
                        agree to these official rules.
                    </p>
                    <p className={styles.termsText}>
                        For full terms and conditions, please visit our{' '}
                        <a href="/terms" style={{ color: 'var(--color-red)' }}>Terms &amp; Conditions</a> page.
                    </p>
                </div>
            </section>

            <Newsletter />
        </>
    );
}
