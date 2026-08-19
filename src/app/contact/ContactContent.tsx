'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Newsletter from '@/components/frontend/Newsletter';
import { useSiteContent } from '@/hooks/useSiteContent';
import { CONTACT_DEFAULTS } from './contactDefaults';
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

export default function ContactContent() {
    const content = useSiteContent('contact', CONTACT_DEFAULTS);
    const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHeroImageIndex((prev) => (prev + 1) % DESKTOP_HERO_IMAGES.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Something went wrong. Please try again.');
            }
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
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

            {/* ===== CONTACT INFO + FORM ===== */}
            <section className={`section ${styles.contactSection}`}>
                <div className="container">
                    <div className={styles.grid}>
                        {/* Ways to connect */}
                        <div>
                            <span className={styles.eyebrow}>{content.connectEyebrow}</span>
                            <h2 className={styles.sectionTitle}>{content.connectTitle}</h2>

                            <div className={styles.infoGrid}>
                                <a href={`mailto:${content.emailAddress}`} className={styles.infoCard}>
                                    <div className={styles.infoIcon}><Mail size={20} /></div>
                                    <div>
                                        <h4>Email us</h4>
                                        <p>{content.emailAddress}</p>
                                    </div>
                                </a>
                                <div className={styles.infoCard}>
                                    <div className={`${styles.infoIcon} ${styles.infoIconGold}`}><Phone size={20} /></div>
                                    <div>
                                        <h4>Call us</h4>
                                        <p>{content.phoneText}</p>
                                    </div>
                                </div>
                                <div className={styles.infoCard}>
                                    <div className={styles.infoIcon}><MapPin size={20} /></div>
                                    <div>
                                        <h4>Visit us</h4>
                                        <p>{content.address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.socials}>
                                <a href={content.youtubeUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="YouTube">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12ZM9.8 15.3V8.7l6 3.3-6 3.3Z" />
                                    </svg>
                                </a>
                                <a href={content.xUrl} className={styles.socialLink} aria-label="X (coming soon)">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.9 2H22l-7.3 8.3L23 22h-6.8l-5-6.6L5.5 22H2.3l7.8-8.9L1.5 2h6.9l4.5 6L18.9 2Z" />
                                    </svg>
                                </a>
                                <a href={content.facebookUrl} className={styles.socialLink} aria-label="Facebook (coming soon)">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-3h2.4V9.5c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.4h-1.2c-1.2 0-1.5.7-1.5 1.4V12H16l-.4 3h-2.2v7A10 10 0 0 0 22 12Z" />
                                    </svg>
                                </a>
                                <a href={content.tiktokUrl} className={styles.socialLink} aria-label="TikTok (coming soon)">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M16 3c.3 2.2 1.6 3.8 3.8 4v2.5c-1.4 0-2.7-.4-3.8-1.2v6.4A5.7 5.7 0 1 1 10.3 9v2.6a3.1 3.1 0 1 0 2.2 3V3H16Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Send a message */}
                        <div>
                            <span className={styles.eyebrow}>{content.sendMessageEyebrow}</span>
                            <h2 className={styles.sectionTitle}>{content.sendMessageTitle}</h2>

                            {submitted && (
                                <div className={styles.successMsg}>
                                    {content.successText}
                                </div>
                            )}

                            <form className={styles.form} onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name" className={styles.formLabel}>Full name *</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="email" className={styles.formLabel}>Email *</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className={styles.formInput}
                                        placeholder="you@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="subject" className={styles.formLabel}>Subject</label>
                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="How can we help?"
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="message" className={styles.formLabel}>Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        className={styles.formTextarea}
                                        placeholder="Write your message..."
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {error && <p className={styles.errorText}>{error}</p>}

                                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                                    {submitting ? 'Sending…' : content.submitBtnLabel}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Newsletter />
        </>
    );
}
