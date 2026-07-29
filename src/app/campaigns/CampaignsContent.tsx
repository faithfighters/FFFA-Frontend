'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Newsletter from '@/components/frontend/Newsletter';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

const VIDEO_BASE = 'https://faithfightersamerica.com/';

const CAMPAIGNS = [
    { title: 'Bills Paid', file: 'video8.mp4', img: '/images/img-01.jpg', desc: 'A family caught up on overdue utilities and kept the power on.' },
    { title: 'Car Payment Paid', file: 'video4.mp4', img: '/images/img-02.jpg', desc: 'A worker kept the car that gets them to their job every day.' },
    { title: 'Hotel Stay Covered', file: 'video5.mp4', img: '/images/img-03.jpg', desc: 'A family off the street and into a safe, warm place for the night.' },
    { title: 'Prayers Answered', file: 'video11.mp4', img: '/images/img-04.jpg', desc: 'When hope had run out, the community showed up in force.' },
    { title: 'Rent Covered', file: 'video7.mp4', img: '/images/img-05.jpg', desc: 'A family kept their home when the rent came due.' },
    { title: 'Student Loans Paid Off', file: 'video6.mp4', img: '/images/img-06.jpg', desc: 'A graduate set free from the weight of student debt.' },
];

export default function CampaignsContent() {
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const { user } = useAuth();
    const missionHref = user ? '/dashboard/campaigns' : '/login';

    return (
        <>
            {/* ===== HERO ===== */}
            <section className={styles.hero}>
                <div className={styles.heroDots} />
                <div className="container">
                    <div className={styles.heroInner}>
                        <span className={styles.eyebrow}>Campaigns</span>
                        <h1 className={styles.heroTitle}>Fund a Mission</h1>
                        <p className={styles.heroLead}>
                            Choose a cause close to your heart. Track its progress. See exactly where
                            your giving goes.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===== CAMPAIGN GRID ===== */}
            <section className={`section ${styles.campaignsSection}`}>
                <div className="container">
                    <div className={styles.campGrid}>
                        {CAMPAIGNS.map((c) => (
                            <div key={c.title} className={styles.campCard}>
                                <div
                                    className={styles.campMedia}
                                    onClick={() => setLightboxSrc(`${VIDEO_BASE}${c.file}`)}
                                >
                                    <Image
                                        src={c.img}
                                        alt={c.title}
                                        fill
                                        sizes="(max-width: 900px) 100vw, 33vw"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <div className={styles.campPlayBtn}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                    <span className={styles.fundedBadge}>✓ Funded</span>
                                </div>
                                <div className={styles.campBody}>
                                    <h4>{c.title}</h4>
                                    <p>{c.desc}</p>
                                    <Link href={missionHref} className={styles.missionBtn}>
                                        Support this mission
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Newsletter />

            {/* ===== VIDEO LIGHTBOX ===== */}
            {lightboxSrc && (
                <div onClick={() => setLightboxSrc(null)} className={styles.lightboxOverlay}>
                    <div onClick={(e) => e.stopPropagation()} className={styles.lightboxInner}>
                        <button onClick={() => setLightboxSrc(null)} aria-label="Close video" className={styles.lightboxClose}>✕</button>
                        <video src={lightboxSrc} controls autoPlay className={styles.lightboxVideo} />
                    </div>
                </div>
            )}
        </>
    );
}
