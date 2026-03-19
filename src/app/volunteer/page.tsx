'use client';

import { useState } from 'react';
import PageBanner from '@/components/PageBanner';
import Newsletter from '@/components/Newsletter';
import styles from './page.module.css';

const volunteerRoles = [
    {
        icon: '🎪',
        title: 'Event Crew',
        desc: 'Help set up, greet guests, and support local events that unite our community.',
    },
    {
        icon: '🌍',
        title: 'Community Outreach',
        desc: 'Visit shelters, food drives, and partner groups to extend a helping hand.',
    },
    {
        icon: '🙏',
        title: 'Prayer & Care Team',
        desc: 'Offer encouragement, prayer support, and follow up with those in need.',
    },
    {
        icon: '📸',
        title: 'Content & Media',
        desc: 'Take photos, write stories, or help manage our social media presence.',
    },
    {
        icon: '🚗',
        title: 'Drivers & Logistics',
        desc: 'Transport supplies and resources to and from events and partner locations.',
    },
    {
        icon: '💰',
        title: 'Fundraising Support',
        desc: 'Help raise awareness and donations to fuel our faith-driven initiatives.',
    },
];

const availabilityOptions = ['Weekdays', 'Weekends', 'Flexible'];

export default function VolunteerPage() {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        cityState: '',
        availability: '',
        role: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <>
            <PageBanner
                title="Volunteer"
                backgroundImage="/images/hero-flag.png"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Volunteer', href: '/volunteer' },
                ]}
            />

            {/* Intro */}
            <section className={`section ${styles.introSection}`}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
                    <span className="section-label section-label--red" style={{ display: 'inline-block' }}>Get Involved</span>
                    <h2 className="heading-lg">Serve Your Community</h2>
                    <p className="text-body">
                        There are many ways to serve with Faith Fighters For America. Whether you have an hour
                        a week or a full weekend, your time and talents can make a real difference. Join our
                        growing family of volunteers across the country.
                    </p>
                </div>
            </section>

            {/* Volunteer Roles */}
            <section className={`section section--dark ${styles.rolesSection}`}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
                        <span className="section-label section-label--red" style={{ display: 'inline-block' }}>Opportunities</span>
                        <h2 className="heading-lg">Ways To Serve</h2>
                    </div>
                    <div className={styles.rolesGrid}>
                        {volunteerRoles.map((role) => (
                            <div key={role.title} className="card">
                                <div className="card__icon" style={{ fontSize: '2rem', background: 'none' }}>{role.icon}</div>
                                <h4 className="card__title" style={{ color: 'white' }}>{role.title}</h4>
                                <p className="card__text">{role.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className={`section ${styles.howSection}`}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
                        <span className="section-label section-label--red" style={{ display: 'inline-block' }}>Process</span>
                        <h2 className="heading-lg">How It Works</h2>
                    </div>
                    <div className={styles.stepsGrid}>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>1</div>
                            <h4>Complete The Form</h4>
                            <p>Fill out the volunteer sign-up form below with your basic information and preferred role.</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>2</div>
                            <h4>Get Matched</h4>
                            <p>Receive a connection with a dedicated volunteer coordinator in your area.</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>3</div>
                            <h4>Start Serving</h4>
                            <p>Begin making a tangible difference in your community alongside fellow Faith Fighters.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sign-Up Form */}
            <section className={`section section--light ${styles.formSection}`}>
                <div className="container" style={{ maxWidth: '640px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
                        <span className="section-label section-label--red" style={{ display: 'inline-block' }}>Sign Up</span>
                        <h2 className="heading-lg">Ready To Serve?</h2>
                    </div>

                    {submitted ? (
                        <div className={styles.successCard}>
                            <div className={styles.successIcon}>✓</div>
                            <h3>Thank You For Signing Up!</h3>
                            <p>
                                A volunteer coordinator will reach out to you within 48 business hours
                                to connect you with the right opportunity.
                            </p>
                        </div>
                    ) : (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Full Name *</label>
                                    <input
                                        name="fullName"
                                        type="text"
                                        className={styles.input}
                                        placeholder="Your full name"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Email *</label>
                                    <input
                                        name="email"
                                        type="email"
                                        className={styles.input}
                                        placeholder="Your email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Phone Number</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        className={styles.input}
                                        placeholder="Your phone number"
                                        value={form.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>City &amp; State *</label>
                                    <input
                                        name="cityState"
                                        type="text"
                                        className={styles.input}
                                        placeholder="e.g. Sarasota, FL"
                                        value={form.cityState}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Availability *</label>
                                    <select
                                        name="availability"
                                        className={styles.input}
                                        value={form.availability}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select availability</option>
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
                                        <option value="">Select a role</option>
                                        {volunteerRoles.map((r) => (
                                            <option key={r.title} value={r.title}>{r.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-md)' }}>
                                Submit Volunteer Application
                                <span className="btn-arrow">→</span>
                            </button>
                        </form>
                    )}
                </div>
            </section>

            <Newsletter />
        </>
    );
}
