'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PLAN_CONFIG, PlanKey } from '@/lib/types';
import styles from '../login/page.module.css';
import { Suspense } from 'react';

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
        const result = await register(name, email, password, plan);
        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Registration failed. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1 className={styles.authTitle}>Join The Fight</h1>
                    <p className={styles.authSubtitle}>Create your FFFA account</p>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>Full Name</label>
                        <input id="name" type="text" className={styles.input} placeholder="John Smith" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email Address</label>
                        <input id="email" type="email" className={styles.input} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>Password (min 8 characters)</label>
                        <input id="password" type="password" className={styles.input} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Select Your Plan</label>
                        <div className={styles.planGrid}>
                            {(Object.keys(PLAN_CONFIG) as PlanKey[]).map((key) => (
                                <div
                                    key={key}
                                    className={`${styles.planOption} ${plan === key ? styles.planOptionActive : ''}`}
                                    onClick={() => setPlan(key)}
                                >
                                    <div className={styles.planName}>{PLAN_CONFIG[key].name}</div>
                                    <div className={styles.planPrice}>${PLAN_CONFIG[key].price}/mo</div>
                                    <div className={styles.planVotes}>{PLAN_CONFIG[key].votes} vote{PLAN_CONFIG[key].votes > 1 ? 's' : ''}/cycle</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className={`btn btn--primary ${styles.submitBtn}`} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className={styles.authFooter}>
                    Already have an account?{' '}
                    <Link href="/login" className={styles.authLink}>Sign In</Link>
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
