import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageBanner from '@/components/PageBanner';
import Newsletter from '@/components/Newsletter';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'About Us – Faith Fighters For America',
    description:
        'Learn about our mission, vision, story, and the leadership team driving Faith Fighters For America forward.',
};

const leadershipTeam = [
    {
        name: 'Kevin Jones "Coach K"',
        role: 'Founder, CEO',
        initials: 'KJ',
        bio: 'A seasoned entrepreneur with 25+ years in entertainment and multiple successful business ventures, Kevin pairs compassion with accountability and execution to drive FFFA\'s mission forward.',
    },
    {
        name: 'James Price',
        role: 'Co-Founder, Treasurer',
        initials: 'JP',
        bio: 'A former automotive and restaurant industry professional from eastern North Carolina, James brings a decade-long mentorship background in community organizations to FFFA\'s financial stewardship.',
    },
    {
        name: 'Billy Gleason Jr.',
        role: 'Co-Founder, Secretary',
        initials: 'BG',
        bio: 'A martial arts instructor and community leader, Billy focuses on discipline, character development, and personal responsibility through traditional training methods and community engagement.',
    },
];

export default function AboutPage() {
    return (
        <>
            <PageBanner
                title="About Us"
                backgroundImage="/images/hero-flag.png"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'About Us', href: '/about' },
                ]}
            />

            {/* ===== WHO WE ARE ===== */}
            <section className={`section section--light ${styles.whoWeAre}`}>
                <div className="container">
                    <div className={styles.twoColumn}>
                        <div className={styles.textCol}>
                            <span className="section-label section-label--red">About Us</span>
                            <h2 className="heading-lg">Who We Are</h2>
                            <div className={styles.contentBlock}>
                                <p>
                                    <strong>Mission:</strong> &ldquo;Faith Fighters For America unites communities
                                    with compassion, making every act of giving a shared and visible
                                    moment of kindness.&rdquo;
                                </p>
                                <p>
                                    <strong>Vision:</strong> &ldquo;Our vision is to create a transparent movement
                                    where everyone can see and celebrate how helping neighbors becomes
                                    a story that inspires us all.&rdquo;
                                </p>
                            </div>
                            <Link href="/contact" className="btn btn--primary">
                                Contact Us
                                <span className="btn-arrow">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </Link>
                        </div>
                        <div className={styles.imageCol}>
                            <Image
                                src="/images/praying-hands.png"
                                alt="Praying hands painted with American flag"
                                width={500}
                                height={500}
                                className={styles.sectionImage}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== OUR STORY ===== */}
            <section className={`section ${styles.ourStory}`}>
                <div className="container">
                    <div className={styles.twoColumn}>
                        <div className={styles.imageCol}>
                            <Image
                                src="/images/handshake-flag.png"
                                alt="Handshake with American flag"
                                width={500}
                                height={500}
                                className={styles.sectionImage}
                            />
                        </div>
                        <div className={styles.textCol}>
                            <span className="section-label section-label--red">Our Journey</span>
                            <h2 className="heading-lg">Our Story</h2>
                            <div className={styles.contentBlock}>
                                <p>
                                    Faith Fighters for America is a movement born from the belief that a
                                    nation&apos;s true power lies in the unity and faith of its people. We stand
                                    to inspire Americans to uphold the values that built this country —
                                    integrity, courage, compassion, and unwavering belief in God and freedom.
                                </p>
                                <p>
                                    Together, we strive to restore hope, strengthen communities, and remind
                                    every citizen that faith is not just personal — it&apos;s the foundation of our
                                    shared destiny. One nation. One spirit. One mission.
                                </p>
                            </div>
                            <Link href="/contact" className="btn btn--primary">
                                Contact Us
                                <span className="btn-arrow">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== HOW WE OPERATE ===== */}
            <section className={`section section--dark ${styles.howWeOperate}`}>
                <div className="container">
                    <span className="section-label section-label--red">Check Out</span>
                    <h2 className="heading-lg">How We Operate</h2>
                    <div className={styles.operateGrid}>
                        <div className="card">
                            <div className="card__icon">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e61e2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                            </div>
                            <h4 className="card__title" style={{ color: 'white' }}>Open Impact</h4>
                            <p className="card__text">
                                We believe in transparency and measurable results, showing exactly
                                how every effort makes a difference.
                            </p>
                        </div>
                        <div className="card">
                            <div className="card__icon">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e61e2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                            </div>
                            <h4 className="card__title" style={{ color: 'white' }}>Local First</h4>
                            <p className="card__text">
                                Real change begins at home — we prioritise empowering local
                                communities to strengthen the nation from the ground up.
                            </p>
                        </div>
                        <div className="card">
                            <div className="card__icon">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e61e2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h4 className="card__title" style={{ color: 'white' }}>Stewardship</h4>
                            <p className="card__text">
                                Guided by faith and responsibility, we honour every resource
                                entrusted to us to serve the greater good.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== LEADERSHIP ===== */}
            <section className={`section section--light ${styles.leadership}`}>
                <div className="container">
                    <span className="section-label section-label--red">Leadership</span>
                    <h2 className="heading-lg">Who Leads Us</h2>
                    <div className={styles.leaderGrid}>
                        {leadershipTeam.map((member) => (
                            <div key={member.name} className={styles.leaderCard}>
                                <div className={styles.leaderAvatar}>
                                    <span className={styles.leaderInitials}>{member.initials}</span>
                                </div>
                                <h4 className={styles.leaderName}>{member.name}</h4>
                                <p className={styles.leaderRole}>{member.role}</p>
                                <p className={styles.leaderBio}>{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Newsletter />
        </>
    );
}
