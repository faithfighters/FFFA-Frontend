'use client';


import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PLAN_CONFIG, PlanKey } from '@/lib/types';
import styles from './page.module.css';
import { Suspense } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const floatingDonors = [
    { name: 'Jordan S.', amount: '$400' },
    { name: 'Maria T.', amount: '$250' },
    { name: 'David R.', amount: '$180' },
    { name: 'Sarah K.', amount: '$400' },
    { name: 'Alex M.', amount: '$320' },
    { name: 'Lisa P.', amount: '$150' },
    { name: 'James W.', amount: '$500' },
    { name: 'Emma C.', amount: '$275' },
];

function RegisterForm() {
    const searchParams = useSearchParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [plan, setPlan] = useState<PlanKey>((searchParams.get('plan') as PlanKey) || 'basic');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // TEMPORARY REDIRECT TO COMING SOON
        router.push('/coming-soon');

        // Uncomment below when API is ready
        /*
        const result = await register(name, email, password, plan);
        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Registration failed. Please try again.');
        }
        */

        setLoading(false);
    };

    const handleGoogleSSO = () => {
        router.push('/coming-soon');
        // window.location.href = `${API_URL}/auth/google?redirect=${encodeURIComponent(window.location.origin + '/dashboard')}`;
    };

    return (
        <div className={styles.loginPage}>
            {/* Grid background */}
            <div className={styles.gridBg} />

            {/* Floating Avatar Ring */}
            <div className={styles.avatarRing}>
                {floatingDonors.map((donor, i) => (
                    <div key={i} className={styles.floatingAvatar}>
                        <div className={styles.avatarImg}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
                            </svg>
                        </div>
                        <span className={styles.avatarLabel}>{donor.name}</span>
                        <span className={styles.avatarDonation}>
                            Donated <strong>{donor.amount}</strong>🔥
                        </span>
                    </div>
                ))}
            </div>

            <div className={styles.card}>
                {/* Brand icon */}
                <div className={styles.brandIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                    </svg>
                </div>

                <h1 className={styles.title}>Create your account</h1>
                <p className={styles.subtitle}>
                    Join Faith Fighters of America and start making a difference in your community.
                </p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.fieldRow}>
                        <div className={styles.labelRow}>
                            <label htmlFor="name" className={styles.label}>Full Name</label>
                        </div>
                        <input
                            id="name" type="text" className={styles.input}
                            placeholder="John Smith"
                            value={name} onChange={(e) => setName(e.target.value)}
                            required suppressHydrationWarning
                        />
                    </div>

                    <div className={styles.fieldRow}>
                        <div className={styles.labelRow}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                        </div>
                        <input
                            id="email" type="email" className={styles.input}
                            placeholder="you@example.com"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            required suppressHydrationWarning
                        />
                    </div>

                    <div className={styles.fieldRow}>
                        <div className={styles.labelRow}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                        </div>
                        <input
                            id="password" type="password" className={styles.input}
                            placeholder="Enter your password (min 8 characters)"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            minLength={8} required suppressHydrationWarning
                        />
                    </div>

                    <div className={styles.fieldRow}>
                        <div className={styles.labelRow}>
                            <label className={styles.label}>Select Your Plan</label>
                        </div>
                        <div className={styles.planGrid}>
                            {(Object.keys(PLAN_CONFIG) as PlanKey[]).map((key) => (
                                <div
                                    key={key}
                                    className={`${styles.planOption} ${plan === key ? styles.planOptionActive : ''} ${key === 'standard' ? styles.planPopular : ''}`}
                                    onClick={() => setPlan(key)}
                                >
                                    {key === 'standard' && <div className={styles.popularBadge}>POPULAR</div>}
                                    <div className={styles.planName}>{PLAN_CONFIG[key].name}</div>
                                    <div className={styles.planPrice}>${PLAN_CONFIG[key].price}/mo</div>
                                    <div className={styles.planVotes}>{PLAN_CONFIG[key].votes} vote{PLAN_CONFIG[key].votes > 1 ? 's' : ''}/cycle</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Creating account…' : 'Get started'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span className={styles.dividerLine} />
                    <span className={styles.dividerText}>Or sign up with</span>
                    <span className={styles.dividerLine} />
                </div>

                <div className={styles.socialRow}>
                    <button type="button" className={styles.socialBtn} style={{ width: '100%' }} onClick={handleGoogleSSO} aria-label="Google">
                        Sign in with Google
                    </button>
                </div>

                <p className={styles.footer}>
                    Already have an account?{' '}
                    <Link href="/login" className={styles.footerLink}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}>
            <RegisterForm />
        </Suspense>
    );
}
