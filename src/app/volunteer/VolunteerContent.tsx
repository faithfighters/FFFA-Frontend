'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import {
    CalendarDays, Globe, Heart, Camera, Truck, DollarSign, ChevronRight,
} from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { VOLUNTEER_DEFAULTS } from './volunteerDefaults';

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

// Icons and accent colors for the "Six ways to serve" grid aren't
// CMS-editable — matched positionally to content.roles.
const ROLE_ICONS = [
    <CalendarDays key="0" size={20} />,
    <Globe key="1" size={20} />,
    <Heart key="2" size={20} />,
    <Camera key="3" size={20} />,
    <Truck key="4" size={20} />,
    <DollarSign key="5" size={20} />,
];
const ROLE_ACCENTS: ('red' | 'gold')[] = ['red', 'gold', 'red', 'gold', 'red', 'gold'];

const availabilityOptions = ['Weekdays', 'Weekends', 'Flexible'];

export default function VolunteerContent() {
    const content = useSiteContent('volunteer', VOLUNTEER_DEFAULTS);
    const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        cityState: '',
        availability: '',
        role: '',
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const res = await fetch('/api/volunteers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.fullName,
                    email: form.email,
                    phone: form.phone || undefined,
                    cityState: form.cityState,
                    availability: form.availability,
                    role: form.role,
                }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Something went wrong. Please try again.');
            }
            setSubmitted(true);
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

            {/* ===== SIX WAYS TO SERVE ===== */}
            <section className={`section ${styles.rolesSection}`}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <span className={styles.eyebrow}>{content.rolesEyebrow}</span>
                        <h2 className={styles.sectionTitle}>{content.rolesTitle}</h2>
                    </div>
                    <div className={styles.rolesGrid}>
                        {content.roles.map((role, i) => (
                            <div key={role.title} className={styles.roleRow}>
                                <div className={styles.roleImage}>
                                    <Image src={role.image} alt={role.title} fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                                </div>
                                <div className={styles.roleBody}>
                                    <div className={`${styles.roleIcon} ${ROLE_ACCENTS[i % ROLE_ACCENTS.length] === 'gold' ? styles.roleIconGold : ''}`}>
                                        {ROLE_ICONS[i % ROLE_ICONS.length]}
                                    </div>
                                    <div>
                                        <h4>{role.title}</h4>
                                        <p>{role.desc}</p>
                                    </div>
                                    <ChevronRight size={18} className={styles.roleChevron} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS + SIGN UP ===== */}
            <section className={`section ${styles.formSection}`}>
                <div className="container">
                    <div className={styles.splitGrid}>
                        <div>
                            <span className={styles.eyebrow}>{content.howItWorksEyebrow}</span>
                            <h2 className={styles.sectionTitle}>{content.howItWorksTitle}</h2>
                            <div className={styles.stepsList}>
                                {content.steps.map((step, i) => (
                                    <div className={styles.step} key={step.title}>
                                        <div className={styles.stepNumber}>{i + 1}</div>
                                        <div>
                                            <h4>{step.title}</h4>
                                            <p>{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <span className={styles.eyebrow}>{content.signupEyebrow}</span>
                            <h2 className={styles.sectionTitle}>{content.signupTitle}</h2>

                            {submitted ? (
                                <div className={styles.successCard}>
                                    <div className={styles.successIcon}>✓</div>
                                    <h3>{content.successTitle}</h3>
                                    <p>{content.successText}</p>
                                </div>
                            ) : (
                                <form className={styles.form} onSubmit={handleSubmit}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Full Name *</label>
                                        <input
                                            name="fullName"
                                            type="text"
                                            className={styles.input}
                                            placeholder="Your name"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Email *</label>
                                            <input
                                                name="email"
                                                type="email"
                                                className={styles.input}
                                                placeholder="you@email.com"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Phone Number</label>
                                            <input
                                                name="phone"
                                                type="tel"
                                                className={styles.input}
                                                placeholder="(000) 000-0000"
                                                value={form.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>City &amp; State *</label>
                                        <input
                                            name="cityState"
                                            type="text"
                                            className={styles.input}
                                            placeholder="City, ST"
                                            value={form.cityState}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Availability *</label>
                                        <select
                                            name="availability"
                                            className={styles.input}
                                            value={form.availability}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select…</option>
                                            {availabilityOptions.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Preferred Role *</label>
                                        <select
                                            name="role"
                                            className={styles.input}
                                            value={form.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select a role…</option>
                                            {content.roles.map((r) => (
                                                <option key={r.title} value={r.title}>{r.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {error && <p className={styles.errorText}>{error}</p>}

                                    <button type="submit" className={styles.submitBtn} disabled={submitting}>
                                        {submitting ? 'Submitting…' : content.submitBtnLabel}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
