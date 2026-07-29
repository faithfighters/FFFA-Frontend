'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Newsletter from '@/components/frontend/Newsletter';
import styles from './page.module.css';

const VIDEO_BASE = 'https://faithfightersamerica.com/';
const FEATURED_VIDEO = `${VIDEO_BASE}video13.mp4`;

const STORIES = [
    { title: 'Bills Paid', file: 'video8.mp4', duration: '0:57', img: '/images/img-01.jpg' },
    { title: 'Car Payment Paid', file: 'video4.mp4', duration: '0:34', img: '/images/img-02.jpg' },
    { title: 'Hotel Stay Covered', file: 'video5.mp4', duration: '1:12', img: '/images/img-03.jpg' },
    { title: 'Prayers Answered', file: 'video11.mp4', duration: '0:32', img: '/images/img-04.jpg' },
    { title: 'Rent Covered', file: 'video7.mp4', duration: '0:27', img: '/images/img-05.jpg' },
    { title: 'Student Loans Paid Off', file: 'video6.mp4', duration: '0:29', img: '/images/img-06.jpg' },
];

export default function StoriesContent() {
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    return (
        <>
            {/* ===== HERO ===== */}
            <section className={styles.hero}>
                <div className={styles.heroDots} />
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
            </section>

            {/* ===== FEATURED FILM ===== */}
            <section className={`section ${styles.featuredSection}`}>
                <div className="container">
                    <span className={styles.liveBadge}>
                        <span className={styles.liveDot} />
                        Featured film
                    </span>
                    <div
                        className={styles.featuredVideo}
                        onClick={() => setLightboxSrc(FEATURED_VIDEO)}
                    >
                        <video
                            className={styles.featuredVideoMedia}
                            src={`${FEATURED_VIDEO}#t=2`}
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
                            <div
                                key={story.title}
                                className={styles.reelCard}
                                onClick={() => setLightboxSrc(`${VIDEO_BASE}${story.file}`)}
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
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SHARE YOUR STORY ===== */}
            <section className={`section ${styles.shareSection}`}>
                <div className="container">
                    <div className={styles.noteBox}>
                        <span className={styles.noteIcon}>ⓘ</span>
                        <span>Have a story to share? Submissions from members and beneficiaries are featured here every week.</span>
                    </div>
                    <Link href="/register?intent=help" className={styles.shareBtn}>
                        Share your story
                    </Link>
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
