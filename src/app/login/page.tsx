'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        if (result.success) {
            // Redirect based on role (me endpoint returns user role)
            const meRes = await fetch('/api/auth/me', { credentials: 'include' });
            const meData = await meRes.json();
            if (meData.user?.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } else {
            setError(result.error || 'Invalid credentials. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1 className={styles.authTitle}>Welcome Back</h1>
                    <p className={styles.authSubtitle}>Sign in to your FFFA account</p>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className={styles.input}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            suppressHydrationWarning
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            id="password"
                            type="password"
                            className={styles.input}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            suppressHydrationWarning
                        />
                    </div>
                    <button type="submit" className={`btn btn--primary ${styles.submitBtn}`} disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className={styles.authFooter}>
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className={styles.authLink}>Create one</Link>
                </p>
                <p className={styles.authHint}>
                    Admin: <strong>admin@faithfighters.com</strong>
                </p>
            </div>
        </div>
    );
}
