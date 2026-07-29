'use client';

import { useState } from 'react';
import styles from './Newsletter.module.css';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            setEmail('');
            setTimeout(() => setSubmitted(false), 3000);
        }
    };

    return (
        <section className={styles.newsletter}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <span className={styles.label}>Newsletter</span>
                    <h2 className={styles.title}>Stay Connected to the Movement</h2>
                    <p className={styles.description}>
                        Get inspiring stories, volunteer opportunities, community updates, and
                        behind-the-scenes access delivered straight to your inbox.
                    </p>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            suppressHydrationWarning
                        />
                        <button type="submit" className={styles.submitBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            Join The Mission
                        </button>
                    </form>
                    {submitted && (
                        <p className={styles.success}>✓ Thank you for joining the mission!</p>
                    )}
                    <p className={styles.disclaimer}>No spam. Just purpose-driven updates.</p>
                </div>
            </div>
        </section>
    );
}
