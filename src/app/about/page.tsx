import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HeartHandshake } from 'lucide-react';
import Newsletter from '@/components/frontend/Newsletter';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'About Us – Faith Fighters For America',
    description:
        'Learn about our mission, vision, story, and the leadership team driving Faith Fighters For America forward.',
};

const valueCards = [
    {
        img: '/images/img-07.jpg',
        icon: '✝',
        title: 'Mission',
        text: 'We unite communities with compassion, making every act of giving a shared and visible moment of kindness.',
    },
    {
        img: '/images/img-08.jpg',
        icon: '◎',
        title: 'Vision',
        text: 'A transparent movement where everyone can see and celebrate how helping neighbors becomes a story that inspires us all.',
    },
];

const tags = ['Integrity', 'Courage', 'Compassion', 'Faith', 'Freedom'];

const coreValues = [
    {
        icon: '◎',
        title: 'Open Impact',
        text: 'Transparency and quantifiable outcomes that demonstrate the tangible difference we make together.',
    },
    {
        icon: '📍',
        title: 'Local First',
        text: 'Community-level transformation strengthens the broader nation, one neighborhood at a time.',
    },
    {
        icon: '🛡',
        title: 'Stewardship',
        text: 'Faith-guided responsibility in managing every resource entrusted to us.',
    },
];

const leadershipTeam = [
    {
        name: 'Kevin Jones "Coach K"',
        role: 'Founder & CEO',
        img: '/images/kevin-jones.jpg',
        bio: '25+ years in entertainment and entrepreneurship, leading the movement\'s vision.',
    },
    {
        name: 'James Price',
        role: 'Co-Founder & Treasurer',
        img: '/images/james-price.jpg',
        bio: 'Automotive & restaurant background with deep community mentorship experience.',
    },
    {
        name: 'Billy Gleason Jr.',
        role: 'Co-Founder & Secretary',
        img: '/images/billy-gleason-jr.jpg',
        bio: 'Martial arts instructor focused on character and accountability.',
    },
];

export default function AboutPage() {
    return (
        <>
            {/* ===== HERO ===== */}
            <section className={styles.hero}>
                <div className={styles.heroDots} />
                <div className="container">
                    <div className={styles.heroInner}>
                        <span className={styles.eyebrow}>Who We Are</span>
                        <h1 className={styles.heroTitle}>About Faith Fighters</h1>
                        <p className={styles.heroLead}>
                            A movement built on the conviction that a nation grows strong when its
                            people stand united in faith and service.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===== MISSION / VISION ===== */}
            <section className={`section ${styles.valuesSection}`}>
                <div className="container">
                    <div className={styles.valueGrid}>
                        {valueCards.map((v) => (
                            <div key={v.title} className={styles.valueCard}>
                                <div className={styles.valueImage}>
                                    <Image src={v.img} alt={v.title} fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                                </div>
                                <div className={styles.valueCaption}>
                                    <div className={styles.valueIcon}>{v.icon}</div>
                                    <div>
                                        <h4>{v.title}</h4>
                                        <p>{v.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== OUR STORY ===== */}
            <section className={`section ${styles.storySection}`}>
                <div className="container">
                    <span className={styles.eyebrow}>Our Story</span>
                    <h2 className={styles.sectionTitle}>Strength from unity</h2>
                    <p className={styles.storyLead}>
                        Faith Fighters For America was born from a simple conviction: national strength
                        emerges from a unified citizenry and shared faith. We encourage Americans to
                        embody integrity, courage, compassion, and devotion to God and freedom —
                        restoring optimism and reinforcing the communities we call home.
                    </p>
                    <div className={styles.tagRow}>
                        {tags.map((t) => (
                            <span key={t} className={styles.tag}>{t}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CORE VALUES ===== */}
            <section className={`section ${styles.operateSection}`}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <span className={styles.eyebrow}>How We Operate</span>
                        <h2 className={styles.sectionTitle}>Our core values</h2>
                    </div>
                    <div className={styles.operateRows}>
                        {coreValues.map((v) => (
                            <div key={v.title} className={styles.operateRow}>
                                <div className={styles.operateIcon}>{v.icon}</div>
                                <div>
                                    <h4>{v.title}</h4>
                                    <p>{v.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== LEADERSHIP ===== */}
            <section className={`section ${styles.leadershipSection}`}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <span className={styles.eyebrow}>Leadership</span>
                        <h2 className={styles.sectionTitle}>Meet the team</h2>
                    </div>
                    <div className={styles.leaderGrid}>
                        {leadershipTeam.map((member) => (
                            <div key={member.name} className={styles.leaderCard}>
                                <div className={styles.leaderAvatar}>
                                    <Image src={member.img} alt={member.name} fill sizes="84px" style={{ objectFit: 'cover' }} />
                                </div>
                                <h4 className={styles.leaderName}>{member.name}</h4>
                                <p className={styles.leaderRole}>{member.role}</p>
                                <p className={styles.leaderBio}>{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== READY TO MAKE AN IMPACT ===== */}
            <section className={`section ${styles.quoteSection}`}>
                <div className="container">
                    <div className={styles.impactCard}>
                        <div className={styles.impactIconRow}>
                            <span className={styles.impactLine} />
                            <HeartHandshake size={30} className={styles.impactIcon} />
                            <span className={styles.impactLine} />
                        </div>
                        <h3 className={styles.impactTitle}>
                            Ready to Make an <em>Impact?</em>
                        </h3>
                        <p className={styles.impactText}>
                            Faith Fighters for America empowers everyday people to create
                            extraordinary change through kindness, service, and transparent giving.
                        </p>
                        <span className={styles.impactDivider} />
                        <p className={styles.impactText}>
                            Together, we connect people who want to help with those who need it most,
                            building <em>stronger communities</em> and <em>changing lives</em>&mdash;one act of kindness at a time.
                        </p>
                        <span className={styles.impactDivider} />
                        <p className={styles.impactTagline}>One Nation. One Spirit. One Mission.</p>
                    </div>
                    <div className={styles.ctaRow}>
                        <Link href="/register?intent=donate" className="btn btn--primary">
                            Join the Mission
                        </Link>
                        <Link href="/volunteer" className="btn btn--outline">
                            Volunteer
                        </Link>
                    </div>
                </div>
            </section>

            <Newsletter />
        </>
    );
}
