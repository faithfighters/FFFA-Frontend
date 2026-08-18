'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartHandshake } from 'lucide-react';
import Newsletter from '@/components/frontend/Newsletter';
import { useAuth } from '@/context/AuthContext';
import { useSiteContent } from '@/hooks/useSiteContent';
import { ABOUT_DEFAULTS } from './aboutContent';
import styles from './page.module.css';

const DESKTOP_HERO_IMAGES = [
    '/images/desktop1.png',
    '/images/desktop2.png',
    '/images/desktop3.png',
];

const MOBILE_HERO_IMAGES = [
    '/images/hands_bg_team.svg',
    '/images/america_hands_join.png',
    '/images/team_img.svg',
];

export default function AboutPage() {
    const { user } = useAuth();
    const content = useSiteContent('about', ABOUT_DEFAULTS);
    const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHeroImageIndex((prev) => (prev + 1) % DESKTOP_HERO_IMAGES.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            {/* ===== HERO ===== */}
            <section className={styles.hero}>
                <div className={`${styles.heroBgContainer} ${styles.heroBgDesktopOnly}`}>
                    {DESKTOP_HERO_IMAGES.map((src, index) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={src}
                            src={src}
                            alt=""
                            className={`${styles.heroBgImage} ${index === currentHeroImageIndex ? styles.heroBgActive : ''}`}
                        />
                    ))}
                </div>
                <div className={`${styles.heroBgContainer} ${styles.heroBgMobileOnly}`}>
                    {MOBILE_HERO_IMAGES.map((src, index) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={src}
                            src={src}
                            alt=""
                            className={`${styles.heroBgImage} ${index === currentHeroImageIndex ? styles.heroBgActive : ''}`}
                        />
                    ))}
                </div>
                <div style={{ position: 'relative', zIndex: 3, width: '100%' }}>
                    <div className="container">
                        <div className={styles.heroInner}>
                            <span className={styles.eyebrow}>{content.heroEyebrow}</span>
                            <h1 className={styles.heroTitle}>{content.heroTitle}</h1>
                            <p className={styles.heroLead}>
                                {content.heroLead}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== MISSION / VISION ===== */}
            <section className={`section ${styles.valuesSection}`}>
                <div className="container">
                    <div className={styles.valueGrid}>
                        {content.missionVisionCards.map((v) => (
                            <div key={v.title} className={styles.valueCard}>
                                <div className={styles.valueImage}>
                                    <Image src={v.image} alt={v.title} fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
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
                    <span className={styles.eyebrow}>{content.storyEyebrow}</span>
                    <h2 className={styles.sectionTitle}>{content.storyTitle}</h2>
                    <p className={styles.storyLead}>
                        {content.storyLead}
                    </p>
                    <div className={styles.tagRow}>
                        {content.storyTagsCsv.split(',').map(t => t.trim()).filter(Boolean).map((t) => (
                            <span key={t} className={styles.tag}>{t}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CORE VALUES ===== */}
            <section className={`section ${styles.operateSection}`}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <span className={styles.eyebrow}>{content.coreValuesEyebrow}</span>
                        <h2 className={styles.sectionTitle}>{content.coreValuesTitle}</h2>
                    </div>
                    <div className={styles.operateRows}>
                        {content.coreValues.map((v) => (
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
                        <span className={styles.eyebrow}>{content.leadershipEyebrow}</span>
                        <h2 className={styles.sectionTitle}>{content.leadershipTitle}</h2>
                    </div>
                    <div className={styles.leaderGrid}>
                        {content.leadershipTeam.map((member) => (
                            <div key={member.name} className={styles.leaderCard}>
                                <div className={styles.leaderAvatar}>
                                    <Image src={member.image} alt={member.name} fill sizes="84px" style={{ objectFit: 'cover' }} />
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
                            {content.impactTitle}
                        </h3>
                        <p className={styles.impactText}>
                            {content.impactText1}
                        </p>
                        <span className={styles.impactDivider} />
                        <p className={styles.impactText}>
                            {content.impactText2}
                        </p>
                        <span className={styles.impactDivider} />
                        <p className={styles.impactTagline}>{content.impactTagline}</p>
                    </div>
                    <div className={styles.ctaRow}>
                        <Link href={user ? '/dashboard' : '/register?intent=donate'} className="btn btn--primary">
                            {user ? 'Go to Dashboard' : content.joinMissionLabel}
                        </Link>
                        <Link href="/volunteer" className="btn btn--outline">
                            {content.volunteerBtnLabel}
                        </Link>
                    </div>
                </div>
            </section>

            <Newsletter />
        </>
    );
}
