'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Newsletter from '@/components/frontend/Newsletter';
import { useAuth } from '@/context/AuthContext';
import { useSiteContent } from '@/hooks/useSiteContent';
import { CAMPAIGNS_DEFAULTS } from './campaignsDefaults';
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

export default function CampaignsContent() {
    const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [playingInline, setPlayingInline] = useState<string | null>(null);
    const { user } = useAuth();
    const content = useSiteContent('campaigns', CAMPAIGNS_DEFAULTS);
    const missionHref = user ? '/dashboard/campaigns' : '/login';

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHeroImageIndex((prev) => (prev + 1) % DESKTOP_HERO_IMAGES.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const handleVideoClick = (title: string, videoUrl: string) => {
        if (window.matchMedia('(min-width: 1024px)').matches) {
            setPlayingInline(title);
        } else {
            setLightboxSrc(videoUrl);
        }
    };

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

            {/* ===== CAMPAIGN GRID ===== */}
            <section className={`section ${styles.campaignsSection}`}>
                <div className="container">
                    <div className={styles.campGrid}>
                        {content.campaigns.map((c) => (
                            <div key={c.title} className={styles.campCard}>
                                {playingInline === c.title ? (
                                    <div className={styles.campMedia} style={{ background: '#000' }}>
                                        <video
                                            src={c.videoUrl}
                                            controls
                                            autoPlay
                                            playsInline
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className={styles.campMedia}
                                        onClick={() => handleVideoClick(c.title, c.videoUrl)}
                                    >
                                        <Image
                                            src={c.image}
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
                                )}
                                <div className={styles.campBody}>
                                    <h4>{c.title}</h4>
                                    <p>{c.desc}</p>
                                    <Link href={missionHref} className={styles.missionBtn}>
                                        {content.missionBtnLabel}
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
