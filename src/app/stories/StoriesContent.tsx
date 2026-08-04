'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Newsletter from '@/components/frontend/Newsletter';
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

const VIDEO_BASE = 'https://faithfightersamerica.com/';
const FEATURED_VIDEO = `${VIDEO_BASE}video13.mp4`;

const STORIES = [
    { title: 'Bills Paid', file: 'video8.mp4', duration: '0:57', img: '/images/img-01.jpg' },
    { title: 'Car Payment Paid', file: 'video4.mp4', duration: '0:34', img: '/images/img-02.jpg' },
    { title: 'Hotel Stay Covered', file: 'video5.mp4', duration: '1:12', img: '/images/img-03.jpg' },
    { title: 'Prayers Answered', file: 'video11.mp4', duration: '0:32', img: '/images/img-05.png' },
    { title: 'Rent Covered', file: 'video7.mp4', duration: '0:27', img: '/images/img-05.jpg' },
    { title: 'Student Loans Paid Off', file: 'video6.mp4', duration: '0:29', img: '/images/img-06.jpg' },
];

export default function StoriesContent() {
    const { user } = useAuth();
    const router = useRouter();
    const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [playingInline, setPlayingInline] = useState<string | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHeroImageIndex((prev) => (prev + 1) % DESKTOP_HERO_IMAGES.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const handleVideoClick = (key: string, src: string) => {
        if (typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches) {
            setPlayingInline(key);
        } else {
            setLightboxSrc(src);
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
                <div style={{ position: 'relative', zIndex: 3 }}>
                    <div className="container">
                        <div className={styles.heroInner}>
                            <span className={styles.eyebrow}>Stories &amp; Media</span>
                            <h1 className={styles.heroTitle}>Stories of Impact</h1>
                            <p className={styles.heroLead}>
                                Real testimonies from the neighborhoods, families, and first responders your
                                generosity reaches.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURED FILM ===== */}
            <section className={`section ${styles.featuredSection}`}>
                <div className="container">
                    <span className={styles.liveBadge}>
                        <span className={styles.liveDot} />
                        Featured film
                    </span>
                    {playingInline === 'featured' ? (
                        <div className={styles.featuredVideo} style={{ background: '#000' }}>
                            <video
                                src={FEATURED_VIDEO}
                                controls
                                autoPlay
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </div>
                    ) : (
                        <div
                            className={styles.featuredVideo}
                            onClick={() => handleVideoClick('featured', FEATURED_VIDEO)}
                        >
                            <video
                                className={styles.featuredVideoMedia}
                                src={`${FEATURED_VIDEO}#t=2`}
                                poster="/images/video-thumbnail.png"
                                muted
                                playsInline
                                preload="metadata"
                            />
                            <div className={styles.featuredOverlay}>
                                <div className={styles.featuredPlayBtn}>
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                                </div>
                            </div>
                            <div className={styles.featuredCaption}>
                                <span className={styles.captionDot} />
                                Our Story · A Nation United · 1:53
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className={`section ${styles.testimonialsSection}`}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <span className={styles.eyebrow}>Testimonials</span>
                        <h2 className={styles.sectionTitle}>Real families. Real outcomes.</h2>
                        <p className={styles.sectionSub}>Tap any story to watch.</p>
                    </div>
                    <div className={styles.reelGrid}>
                        {STORIES.map((story) => (
                            playingInline === story.title ? (
                                <div key={story.title} className={styles.reelCard} style={{ background: '#000' }}>
                                    <video
                                        src={`${VIDEO_BASE}${story.file}`}
                                        controls
                                        autoPlay
                                        playsInline
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                            ) : (
                                <div
                                    key={story.title}
                                    className={styles.reelCard}
                                    onClick={() => handleVideoClick(story.title, `${VIDEO_BASE}${story.file}`)}
                                >
                                    <Image
                                        src={story.img}
                                        alt={story.title}
                                        fill
                                        sizes="(max-width: 900px) 50vw, 33vw"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <div className={styles.reelPlayBtn}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                    <div className={styles.reelCaption}>
                                        <span className={styles.captionDot} />
                                        {story.title} · {story.duration}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SHARE YOUR STORY ===== */}
            <section className={`section ${styles.shareSection}`}>
                <div className="container">
                    <div className={styles.storyCard}>
                        <div className={styles.cardIconBox}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </div>

                        <div className={styles.cardContent}>
                            <h2 className={styles.cardTitle}>
                                Your story can <span className={styles.highlight}>inspire</span> someone today.
                            </h2>
                            <p className={styles.cardDescription}>
                                Whether you've received help or want to share how giving back has impacted your life — your story matters.
                            </p>
                            <button
                                onClick={() => {
                                    if (user) {
                                        router.push('/dashboard/testimonials');
                                    } else {
                                        router.push('/register?intent=help');
                                    }
                                }}
                                className={styles.shareBtn}
                            >
                                Share your story
                            </button>
                        </div>
                    </div>

                    <div className={styles.benefitsRow}>
                        <div className={styles.benefitItem}>
                            <div className={styles.benefitIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <span className={styles.benefitLabel}>Inspire others</span>
                        </div>

                        <span className={styles.benefitDivider} />

                        <div className={styles.benefitItem}>
                            <div className={styles.benefitIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </div>
                            <span className={styles.benefitLabel}>Encourage hope</span>
                        </div>

                        <span className={styles.benefitDivider} />

                        <div className={styles.benefitItem}>
                            <div className={styles.benefitIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <span className={styles.benefitLabel}>Build community</span>
                        </div>

                        <span className={styles.benefitDivider} />

                        <div className={styles.benefitItem}>
                            <div className={styles.benefitIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 2v10l7 7"></path>
                                </svg>
                            </div>
                            <span className={styles.benefitLabel}>Create change</span>
                        </div>
                    </div>

                    <div className={styles.noteBox}>
                        <span className={styles.noteIcon}>✓</span>
                        <span>Every submission is reviewed before being featured.</span>
                    </div>
                </div>
            </section>

            <Newsletter />

            {/* ===== VIDEO LIGHTBOX ===== */}
            {lightboxSrc && (
                <div onClick={() => setLightboxSrc(null)} className={styles.lightboxOverlay}>
                    <div onClick={(e) => e.stopPropagation()} className={styles.lightboxInner}>
                        <button onClick={() => setLightboxSrc(null)} aria-label="Close video" className={styles.lightboxClose}>✕</button>
                        <video src={lightboxSrc} controls autoPlay playsInline className={styles.lightboxVideo} />
                    </div>
                </div>
            )}
        </>
    );
}
