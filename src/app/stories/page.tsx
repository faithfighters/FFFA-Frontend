import type { Metadata } from 'next';
import Link from 'next/link';
import PageBanner from '@/components/PageBanner';
import Newsletter from '@/components/Newsletter';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Stories – Faith Fighters For America',
    description: 'Kindness You Can See. Real stories of faith, compassion, and community impact from Faith Fighters For America.',
};

// Placeholder stories — will be driven by CMS/API
const featuredStories = [
    {
        id: '1',
        title: 'A Community Comes Together for the Martinez Family',
        excerpt:
            'After a devastating house fire left the Martinez family homeless just before winter, our community rallied to provide temporary housing, clothing, and a path forward. Read how your votes made this possible.',
        category: 'Disaster Relief',
        date: 'March 2026',
        readTime: '4 min read',
    },
    {
        id: '2',
        title: 'Veterans Housing Initiative Reaches 50 Families',
        excerpt:
            'Through collective giving and community action, Faith Fighters For America has now helped house 50 veteran families across the Southeast. Here\'s what that journey has looked like.',
        category: 'Veterans',
        date: 'February 2026',
        readTime: '5 min read',
    },
    {
        id: '3',
        title: 'Youth Mentorship Program Celebrates First Graduates',
        excerpt:
            'Twelve young men and women from Sarasota completed our inaugural youth mentorship program last month. Their stories of transformation remind us why we fight.',
        category: 'Youth Programs',
        date: 'January 2026',
        readTime: '3 min read',
    },
    {
        id: '4',
        title: 'Rural Healthcare Clinic Opens Doors in Eastern NC',
        excerpt:
            'Thanks to the votes and generosity of our Faith Hero and Faith Fighter members, a new mobile clinic is serving medically underserved families in rural North Carolina.',
        category: 'Healthcare',
        date: 'December 2025',
        readTime: '6 min read',
    },
    {
        id: '5',
        title: 'First Responder Support Fund Delivers $25,000 in Relief',
        excerpt:
            'After an especially difficult wildfire season, our members directed their votes to the First Responder Support Fund — delivering over $25,000 in direct aid to affected families.',
        category: 'First Responders',
        date: 'November 2025',
        readTime: '4 min read',
    },
    {
        id: '6',
        title: 'Food Bank Partnership Feeds 1,200 Families This Thanksgiving',
        excerpt:
            'This Thanksgiving, Faith Fighters For America partnered with three local food banks to ensure no family went without a meal. Here\'s how it came together.',
        category: 'Food Security',
        date: 'November 2025',
        readTime: '3 min read',
    },
];

const categories = ['All', 'Disaster Relief', 'Veterans', 'Youth Programs', 'Healthcare', 'First Responders', 'Food Security'];

export default function StoriesPage() {
    return (
        <>
            <PageBanner
                title="Stories"
                backgroundImage="/images/hero-flag.png"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Stories', href: '/stories' },
                ]}
            />

            {/* Tagline */}
            <section className={`section ${styles.taglineSection}`}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
                    <span className="section-label section-label--red" style={{ display: 'inline-block' }}>Impact Reports</span>
                    <h2 className="heading-lg">Kindness You Can See</h2>
                    <p className="text-body">
                        We believe kindness is more than words — it&apos;s action you can witness in every life touched,
                        every hand extended, and every community strengthened through faith and compassion.
                    </p>
                </div>
            </section>

            {/* Stories Grid */}
            <section className={`section section--light ${styles.storiesSection}`}>
                <div className="container">
                    <div className={styles.storiesGrid}>
                        {featuredStories.map((story) => (
                            <div key={story.id} className={styles.storyCard}>
                                <div className={styles.storyMeta}>
                                    <span className={styles.storyCategory}>{story.category}</span>
                                    <span className={styles.storyDate}>{story.date}</span>
                                </div>
                                <h3 className={styles.storyTitle}>{story.title}</h3>
                                <p className={styles.storyExcerpt}>{story.excerpt}</p>
                                <div className={styles.storyFooter}>
                                    <span className={styles.readTime}>{story.readTime}</span>
                                    <a href="#" className={styles.readMore}>
                                        Read Story <span>→</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stay Connected CTA */}
            <section className={`section section--dark ${styles.ctaSection}`}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
                    <h2 className="heading-lg">Stay Connected To The Movement</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 'var(--space-xl)' }}>
                        Get inspiring stories, volunteer opportunities, community updates, and behind-the-scenes
                        access delivered straight to your inbox.
                    </p>
                    <Link href="/join" className="btn btn--primary">
                        Join The Movement <span className="btn-arrow">→</span>
                    </Link>
                </div>
            </section>

            <Newsletter />
        </>
    );
}
