'use client';


import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://stage.faithfightersforamerica.com');

const floatingDonors = [
    { name: 'Jordan S.', amount: '$400', image: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Maria T.', amount: '$250', image: 'https://i.pravatar.cc/150?u=2' },
    { name: 'David R.', amount: '$180', image: 'https://i.pravatar.cc/150?u=3' },
    { name: 'Sarah K.', amount: '$400', image: 'https://i.pravatar.cc/150?u=4' },
    { name: 'Alex M.', amount: '$320', image: 'https://i.pravatar.cc/150?u=5' },
    { name: 'Lisa P.', amount: '$150', image: 'https://i.pravatar.cc/150?u=6' },
];

const extendedDonors = Array.from({ length: 60 }).flatMap(() => floatingDonors);

function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isTabActive, setIsTabActive] = useState(true);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsTabActive(document.visibilityState === 'visible');
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const mobileScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!authLoading && user) {
            router.replace('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (mobileScrollRef.current) {
                const el = mobileScrollRef.current;
                const cards = Array.from(el.children) as HTMLElement[];
                if (cards.length === 0) return;

                // 1. Calculate the current center of the container
                const containerCenter = el.scrollLeft + (el.clientWidth / 2);

                // 2. Find which card is currently closest to the center
                let closestIndex = 0;
                let minDistance = Infinity;

                cards.forEach((card, index) => {
                    const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
                    const distance = Math.abs(containerCenter - cardCenter);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestIndex = index;
                    }
                });

                // 3. Target exactly one card ahead
                const nextIndex = closestIndex + 1;

                if (nextIndex >= cards.length) {
                    // Seamlessly loop back to start without animation
                    el.scrollTo({ left: 0, behavior: 'instant' } as any);
                } else {
                    const nextCard = cards[nextIndex];
                    const targetScroll = nextCard.offsetLeft - (el.clientWidth / 2) + (nextCard.offsetWidth / 2);
                    el.scrollTo({ left: targetScroll, behavior: 'smooth' });
                }
            }
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Read directly from DOM to capture browser-autofilled values that
        // may not have triggered React's onChange
        const form = e.currentTarget as HTMLFormElement;
        const resolvedName = name || (form.elements.namedItem('name') as HTMLInputElement)?.value || '';
        const resolvedEmail = email || (form.elements.namedItem('email') as HTMLInputElement)?.value || '';
        const resolvedPassword = password || (form.elements.namedItem('password') as HTMLInputElement)?.value || '';

        if (!resolvedName.trim() || !resolvedEmail.trim() || !resolvedPassword.trim()) {
            setError('All fields are required.');
            return;
        }

        if (resolvedPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        const result = await register(resolvedName.trim(), resolvedEmail.trim(), resolvedPassword);
        if (!result.success) {
            setError(result.error || 'Registration failed. Please try again.');
            setLoading(false);
            return;
        }

        router.push('/welcome');
        setLoading(false);
    };

    const handleGoogleSSO = () => {
        // router.push('/coming-soon');
        window.location.href = `/api/auth/google?redirect=${encodeURIComponent(window.location.origin + '/dashboard')}`;
    };

    return (
        <div className={styles.loginPage}>
            {/* Grid background */}
            <div className={styles.gridBg} />

            {/* Floating Avatar Ring */}
            <div className={styles.avatarRing} style={{ animationPlayState: isTabActive ? 'running' : 'paused' }}>
                {floatingDonors.map((donor, i) => (
                    <div key={i} className={styles.floatingAvatar} style={{ animationPlayState: isTabActive ? 'running' : 'paused' }}>
                        <div className={styles.avatarBobContainer}>
                            <div className={styles.avatarImg}>
                                {donor.image ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={donor.image} alt={donor.name} width={52} height={52} className={styles.profileImg} />
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
                                    </svg>
                                )}
                            </div>
                            <span className={styles.avatarLabel}>{donor.name}</span>
                            <span className={styles.avatarDonation}>
                                Donated <strong>{donor.amount}</strong>🔥
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Donors Slider */}
            <div className={styles.mobileDonorsWrapper}>
                <div className={styles.mobileDonorsScroll} ref={mobileScrollRef}>
                    {extendedDonors.map((donor, i) => (
                        <div key={i} className={styles.mobileDonorCard}>
                            <div className={styles.avatarImg}>
                                {donor.image ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={donor.image} alt={donor.name} width={38} height={38} className={styles.profileImg} />
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
                                    </svg>
                                )}
                            </div>
                            <div className={styles.mobileDonorInfo}>
                                <span className={styles.mobileDonorName}>{donor.name}</span>
                                <span className={styles.mobileDonorAmount}>Donated <strong>{donor.amount}</strong>🔥</span>
                            </div>
                        </div>
                    ))}
                </div>
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
                            id="name" name="name" type="text" className={styles.input}
                            placeholder="John Smith"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={(e) => setName(e.target.value)}
                            autoComplete="name"
                            required suppressHydrationWarning
                        />
                    </div>

                    <div className={styles.fieldRow}>
                        <div className={styles.labelRow}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                        </div>
                        <input
                            id="email" name="email" type="email" className={styles.input}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required suppressHydrationWarning
                        />
                    </div>

                    <div className={styles.fieldRow}>
                        <div className={styles.labelRow}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                        </div>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                                id="password" name="password" type={showPassword ? 'text' : 'password'} className={styles.input}
                                style={{ paddingRight: '40px' }}
                                placeholder="Enter your password (min 8 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                minLength={8} required suppressHydrationWarning
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    color: '#64748b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
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
                    <button type="button" className={styles.socialBtn} onClick={handleGoogleSSO} aria-label="Google">
                        <span style={{ fontWeight: 'bold' }}>G</span>
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
