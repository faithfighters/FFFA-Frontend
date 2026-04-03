'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import PageBanner from '@/components/frontend/PageBanner';
import Newsletter from '@/components/frontend/Newsletter';
import styles from './page.module.css';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <>
            <PageBanner
                title="Contact Us"
                backgroundImage="/images/office-building.png"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Contact Us', href: '/contact' },
                ]}
            />

            {/* ===== CONTACT INFO + FORM ===== */}
            <section className={`section ${styles.contactSection}`}>
                <div className="container">
                    <div className={styles.grid}>
                        {/* Contact Info Column */}
                        <div className={styles.infoCol}>
                            <span className="section-label section-label--red">Get In Touch</span>
                            <h2 className="heading-lg" style={{ marginBottom: 'var(--space-md)' }}>Contact Us</h2>
                            <p className={styles.infoDesc}>
                                We&apos;d love to hear from you — whether you have questions, ideas, or
                                want to get involved. Reach out and join us in strengthening faith and
                                unity across America.
                            </p>

                            <div className={styles.infoItems}>
                                <div className={styles.infoItem}>
                                    <div className={styles.infoIcon}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className={styles.infoText}>1751 Mound St,</p>
                                        <p className={styles.infoText}>Suite 201</p>
                                        <p className={styles.infoText}>Sarasota FL, 34236</p>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <div className={styles.infoIcon}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <a href="mailto:info@faithfightersforamerica.com" className={styles.infoLink}>
                                            info@faithfightersforamerica.com
                                        </a>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <div className={styles.infoIcon}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className={styles.infoText}>Call us today</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className={styles.socials}>
                                <a href="https://x.com/fffa_official" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="X/Twitter">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                                <a href="https://www.facebook.com/faithfightersforamerica" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href="https://www.tiktok.com/@faithfightersforamerica" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="TikTok">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.16z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Contact Form Column */}
                        <div className={styles.formCol}>
                            <div className={styles.formCard}>
                                <h3 className={styles.formTitle}>Let&apos;s Talk Here</h3>
                                {submitted && (
                                    <div className={styles.successMsg}>
                                        ✓ Thank you! We&apos;ll get back to you soon.
                                    </div>
                                )}
                                <form className={styles.form} onSubmit={handleSubmit}>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="name" className={styles.formLabel}>Full Name</label>
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
                                            <label htmlFor="email" className={styles.formLabel}>Email</label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                className={styles.formInput}
                                                placeholder="Your email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="subject" className={styles.formLabel}>Subject</label>
                                        <input
                                            id="subject"
                                            name="subject"
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="Subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="message" className={styles.formLabel}>Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            className={styles.formTextarea}
                                            placeholder="Write your message here..."
                                            rows={6}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }}>
                                        Send Message
                                        <span className="btn-arrow">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Newsletter />
        </>
    );
}
