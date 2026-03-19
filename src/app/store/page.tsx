import type { Metadata } from 'next';
import PageBanner from '@/components/PageBanner';
import Newsletter from '@/components/Newsletter';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Store – Faith Fighters For America',
    description: 'Shop with purpose. Every purchase from our store helps fund faith-driven initiatives that uplift communities and strengthen America\'s spirit.',
};

const comingSoonCategories = [
    { icon: '👕', name: 'Apparel', desc: 'T-shirts, hoodies, and hats bearing the FFFA crest and message.' },
    { icon: '📿', name: 'Accessories', desc: 'Bracelets, pins, keychains, and more to show your faith.' },
    { icon: '✝️', name: 'Faith-Inspired', desc: 'Books, devotionals, and items to strengthen your spiritual walk.' },
    { icon: '🇺🇸', name: 'Patriot Collection', desc: 'Celebrate your love of God and country with our patriotic line.' },
];

export default function StorePage() {
    return (
        <>
            <PageBanner
                title="Store"
                backgroundImage="/images/hero-flag.png"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Store', href: '/store' },
                ]}
            />

            {/* Coming Soon Banner */}
            <section className={`section ${styles.heroSection}`}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className={styles.badge}>Coming Soon</div>
                    <h2 className="heading-lg">Shop With Purpose</h2>
                    <p className={styles.subtitle}>
                        Every purchase from our store helps fund faith-driven initiatives that uplift
                        communities and strengthen America&apos;s spirit.
                    </p>
                </div>
            </section>

            {/* Product Categories Preview */}
            <section className={`section section--dark ${styles.categoriesSection}`}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
                        <span className="section-label section-label--red" style={{ display: 'inline-block' }}>Preview</span>
                        <h2 className="heading-lg">What&apos;s Coming</h2>
                    </div>
                    <div className={styles.categoriesGrid}>
                        {comingSoonCategories.map((cat) => (
                            <div key={cat.name} className="card">
                                <div className="card__icon" style={{ fontSize: '2.5rem', background: 'none' }}>{cat.icon}</div>
                                <h4 className="card__title" style={{ color: 'white' }}>{cat.name}</h4>
                                <p className="card__text">{cat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Policy Highlights */}
            <section className={`section ${styles.policySection}`}>
                <div className="container">
                    <div className={styles.policyGrid}>
                        <div className={styles.policyItem}>
                            <div className={styles.policyIcon}>🔄</div>
                            <h4>14-Day Returns</h4>
                            <p>Unused items in original condition accepted within 14 days of purchase.</p>
                        </div>
                        <div className={styles.policyItem}>
                            <div className={styles.policyIcon}>🚚</div>
                            <h4>U.S. Shipping</h4>
                            <p>We ship to all 50 states. International shipping coming soon.</p>
                        </div>
                        <div className={styles.policyItem}>
                            <div className={styles.policyIcon}>💙</div>
                            <h4>Purpose-Driven</h4>
                            <p>Proceeds support our community programs and national faith initiatives.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Alert */}
            <section className={`section section--navy ${styles.alertSection}`}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                    <h2 className="heading-lg" style={{ color: 'white' }}>Be First To Know</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 'var(--space-xl)' }}>
                        Subscribe to our newsletter and be the first to know when our store launches
                        with exclusive early-access deals.
                    </p>
                </div>
            </section>

            <Newsletter />
        </>
    );
}
