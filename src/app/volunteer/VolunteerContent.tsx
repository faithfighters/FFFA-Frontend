'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import {
    CalendarDays, Globe, Heart, Camera, Truck, DollarSign, ChevronRight,
} from 'lucide-react';

const roles = [
    { title: 'Event Crew', desc: 'Setup, greeting guests, and event support.', icon: <CalendarDays size={20} />, img: '/images/serve-event.jpg', accent: 'red' },
    { title: 'Community Outreach', desc: 'Shelter visits, food drives, partner support.', icon: <Globe size={20} />, img: '/images/serve-outreach.jpg', accent: 'gold' },
    { title: 'Prayer & Care Team', desc: 'Encouragement and follow-up support.', icon: <Heart size={20} />, img: '/images/serve-prayer.jpg', accent: 'red' },
    { title: 'Content & Media', desc: 'Photography, storytelling, social media.', icon: <Camera size={20} />, img: '/images/serve-media.jpg', accent: 'gold' },
    { title: 'Drivers & Logistics', desc: 'Transport supplies and resources.', icon: <Truck size={20} />, img: '/images/serve-drive.jpg', accent: 'red' },
    { title: 'Fundraising Support', desc: 'Awareness and donation initiatives.', icon: <DollarSign size={20} />, img: '/images/serve-fund.jpg', accent: 'gold' },
];

const availabilityOptions = ['Weekdays', 'Weekends', 'Flexible'];

export default function VolunteerContent() {
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
                <div className={styles.heroDots} />
                <div className="container">
                    <div className={styles.heroInner}>
                        <span className={styles.eyebrow}>Volunteer</span>
                        <h1 className={styles.heroTitle}>Serve Your Community</h1>
                        <p className={styles.heroLead}>
                            One hour a week or a full weekend — bring your time and talents and make a
                            real difference.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===== SIX WAYS TO SERVE ===== */}
            <section className={`section ${styles.rolesSection}`}>
                <div className="container">
                    <div className={styles.sectionHeaderCenter}>
                        <span className={styles.eyebrow}>Find Your Role</span>
                        <h2 className={styles.sectionTitle}>Six ways to serve</h2>
                    </div>
                    <div className={styles.rolesGrid}>
                        {roles.map((role) => (
                            <div key={role.title} className={styles.roleRow}>
                                <div className={styles.roleImage}>
                                    <Image src={role.img} alt={role.title} fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                                </div>
                                <div className={styles.roleBody}>
                                    <div className={`${styles.roleIcon} ${role.accent === 'gold' ? styles.roleIconGold : ''}`}>
                                        {role.icon}
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
                            <span className={styles.eyebrow}>How It Works</span>
                            <h2 className={styles.sectionTitle}>Start in three steps</h2>
                            <div className={styles.stepsList}>
                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>1</div>
                                    <div>
                                        <h4>Sign up</h4>
                                        <p>Complete the short form with your info and preferred role.</p>
                                    </div>
                                </div>
                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>2</div>
                                    <div>
                                        <h4>Get matched</h4>
                                        <p>A dedicated coordinator in your area reaches out to you.</p>
                                    </div>
                                </div>
                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>3</div>
                                    <div>
                                        <h4>Start serving</h4>
                                        <p>Begin making a tangible difference alongside your community.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <span className={styles.eyebrow}>Ready to Serve?</span>
                            <h2 className={styles.sectionTitle}>Sign up to volunteer</h2>

                            {submitted ? (
                                <div className={styles.successCard}>
                                    <div className={styles.successIcon}>✓</div>
                                    <h3>Thank You!</h3>
                                    <p>A volunteer coordinator will be in touch with you soon.</p>
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
                                            {roles.map((r) => (
                                                <option key={r.title} value={r.title}>{r.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {error && <p className={styles.errorText}>{error}</p>}

                                    <button type="submit" className={styles.submitBtn} disabled={submitting}>
                                        {submitting ? 'Submitting…' : 'Submit Volunteer Application →'}
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
