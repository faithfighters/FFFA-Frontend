'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fraunces } from 'next/font/google';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Check, Home, UtensilsCrossed, LifeBuoy, HeartHandshake } from 'lucide-react';
import styles from './page.module.css';
import OtpInput from '@/components/shared/OtpInput';
import AuthTabs from '@/components/shared/AuthTabs';
import { haptics } from '@/lib/haptics';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://stage.faithfightersforamerica.com');

const fraunces = Fraunces({
    subsets: ['latin'],
    weight: ['600', '700', '800'],
    style: ['normal', 'italic'],
    variable: '--font-fraunces',
    display: 'swap',
});

function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Recipient (need-help) intake fields — only shown/required when intent=help
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [helpType, setHelpType] = useState('');
    const [message, setMessage] = useState('');

    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [otpCode, setOtpCode] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [checkoutRedirecting, setCheckoutRedirecting] = useState(false);
    const [postVerifyRedirecting, setPostVerifyRedirecting] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, verifyRegisterOtp, user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const intent = searchParams.get('intent') === 'help' ? 'help' : 'donate';
    const userType: 'donor' | 'recipient' = intent === 'help' ? 'recipient' : 'donor';

    useEffect(() => {
        if (authLoading || !user || postVerifyRedirecting) return;
        router.replace(intent === 'help' ? '/dashboard/submit' : '/');
    }, [user, authLoading, postVerifyRedirecting, intent, router]);

    useEffect(() => {
        if (step !== 'otp' || timer <= 0) return;
        const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [step, timer]);

    // Password validation
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        haptics.tap();

        const form = e.currentTarget as HTMLFormElement;
        const resolvedName = name || (form.elements.namedItem('name') as HTMLInputElement)?.value || '';
        const resolvedEmail = email || (form.elements.namedItem('email') as HTMLInputElement)?.value || '';
        const resolvedPassword = password || (form.elements.namedItem('password') as HTMLInputElement)?.value || '';

        if (!resolvedName.trim() || !resolvedEmail.trim() || !resolvedPassword.trim()) {
            haptics.error();
            setError('All fields are required.');
            return;
        }
        if (resolvedPassword.length < 8) {
            haptics.error();
            setError('Password must be at least 8 characters.');
            return;
        }
        if (confirmPassword && resolvedPassword !== confirmPassword) {
            haptics.error();
            setError('Passwords do not match.');
            return;
        }
        if (intent === 'help' && (!phone.trim() || !helpType || !message.trim())) {
            haptics.error();
            setError('Phone, type of help needed, and a short message are required.');
            return;
        }

        setLoading(true);
        const intake = intent === 'help' ? { phone: phone.trim(), city: city.trim(), helpType, message: message.trim() } : undefined;
        const result = await register(resolvedName.trim(), resolvedEmail.trim(), resolvedPassword, undefined, userType, intake);
        if (!result.success) {
            haptics.error();
            setError(result.error || 'Registration failed. Please try again.');
            setLoading(false);
            return;
        }
        haptics.success();
        setStep('otp');
        setTimer(60);
        setLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otpCode.length < 6) {
            setOtpError('Please enter the 6-digit verification code.');
            return;
        }
        setOtpLoading(true);
        setOtpError('');
        const result = await verifyRegisterOtp(email.trim().toLowerCase(), otpCode);
        if (result.success) {
            setPostVerifyRedirecting(true);
            if (userType === 'recipient') {
                router.push('/dashboard/submit');
                return;
            }
            // Donor path — send straight to Stripe checkout for the $30 membership.
            setCheckoutRedirecting(true);
            try {
                const res = await fetch('/api/stripe/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ plan: 'faith_fighter' }),
                });
                const data = await res.json();
                if (res.ok && data.url) {
                    window.location.href = data.url;
                } else {
                    // Account already created — send them to the dashboard where they can retry checkout.
                    router.push('/dashboard/subscription?checkout=retry');
                }
            } catch {
                router.push('/dashboard/subscription?checkout=retry');
            }
        } else {
            setOtpError(result.error || 'Invalid or expired code.');
            setOtpLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        setOtpLoading(true);
        setOtpError('');
        const intake = intent === 'help' ? { phone: phone.trim(), city: city.trim(), helpType, message: message.trim() } : undefined;
        const result = await register(name.trim(), email.trim(), password, undefined, userType, intake);
        setOtpLoading(false);
        if (result.success) {
            setTimer(60);
            setOtpCode('');
        } else {
            setOtpError(result.error || 'Failed to resend code. Please try again.');
        }
    };

    const handleGoogleSSO = () => {
        haptics.tap();
        window.location.href = `/api/auth/google?redirect=${encodeURIComponent(window.location.origin + '/dashboard')}`;
    };

    if (step === 'otp') {
        return (
            <div className={styles.loginPage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/login_backgrounf_img.svg" alt="" className={styles.bgImage} aria-hidden />
                <div className={styles.bgOverlay} />
                <div style={{ flex: 1 }} />
                <div className={styles.cardCentered} style={{ margin: '0 16px 40px' }}>
                    <h1 className={styles.title}>Verify your email</h1>
                    <p className={styles.subtitle}>
                        We sent a 6-digit code to <strong style={{ color: '#ffffff' }}>{email}</strong>.
                    </p>

                    {otpError && <div className={styles.error}>{otpError}</div>}

                    <form onSubmit={handleVerifyOtp}>
                        <div className={styles.fieldRow}>
                            <label className={styles.label} style={{ textAlign: 'center', display: 'block' }}>Verification Code</label>
                            <OtpInput value={otpCode} onChange={setOtpCode} disabled={otpLoading} error={!!otpError} />
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={otpLoading || otpCode.length < 6}>
                            {checkoutRedirecting ? 'Redirecting to checkout…' : otpLoading ? 'Verifying…' : 'Verify Code'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                        {timer > 0 ? (
                            <span>Resend code in <strong style={{ color: '#ffffff' }}>{timer}s</strong></span>
                        ) : (
                            <button type="button" onClick={handleResendOtp} disabled={otpLoading} style={{ background: 'none', border: 'none', color: '#f97316', fontWeight: 700, cursor: 'pointer', padding: '4px', fontFamily: 'inherit' }}>
                                Resend Code
                            </button>
                        )}
                    </div>
                    <button type="button" onClick={() => { setStep('form'); setOtpCode(''); setOtpError(''); }} disabled={otpLoading}
                        style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        ← Back to registration
                    </button>
                </div>
            </div>
        );
    }

    if (intent === 'help') {
        return (
            <div className={`${fraunces.variable} ${styles.helpPage}`}>
                <section className={styles.hero}>
                    <div className={styles.heroDots} />
                    <div className="container">
                        <div className={styles.heroInner}>
                            <span className={styles.eyebrow}>Need Help</span>
                            <h1 className={styles.heroTitle}>We&apos;re Here for You</h1>
                            <p className={styles.heroLead}>
                                If you or someone you know is in need, reach out. No situation is too small for compassion.
                            </p>
                        </div>
                    </div>
                </section>

                <div className={`${styles.helpContainer} ${styles.helpMainContainer}`}>
                    {/* How we help */}
                    <div className={styles.howWeHelpSection}>
                        <span className={styles.helpEyebrowRed}>— How We Help</span>
                        <h2 className={styles.howWeHelpHeading}>Ways we can support you</h2>
                        <div className={styles.helpCardsGrid}>
                            <div className={styles.helpInfoCard}>
                                <span className={styles.helpInfoIcon}><Home size={20} /></span>
                                <div>
                                    <h4 className={styles.helpInfoTitle}>Housing &amp; shelter</h4>
                                    <p className={styles.helpInfoDesc}>Emergency housing, repairs, and essentials.</p>
                                </div>
                            </div>
                            <div className={styles.helpInfoCard}>
                                <span className={`${styles.helpInfoIcon} ${styles.helpInfoIconGold}`}><UtensilsCrossed size={20} /></span>
                                <div>
                                    <h4 className={styles.helpInfoTitle}>Food &amp; supplies</h4>
                                    <p className={styles.helpInfoDesc}>Meals, groceries, and daily necessities.</p>
                                </div>
                            </div>
                            <div className={styles.helpInfoCard}>
                                <span className={styles.helpInfoIcon}><LifeBuoy size={20} /></span>
                                <div>
                                    <h4 className={styles.helpInfoTitle}>Disaster relief</h4>
                                    <p className={styles.helpInfoDesc}>Rapid response for families hit by crisis.</p>
                                </div>
                            </div>
                            <div className={styles.helpInfoCard}>
                                <span className={`${styles.helpInfoIcon} ${styles.helpInfoIconGold}`}><HeartHandshake size={20} /></span>
                                <div>
                                    <h4 className={styles.helpInfoTitle}>Prayer &amp; care</h4>
                                    <p className={styles.helpInfoDesc}>Encouragement, connection, and follow-up.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit request + create account */}
                    <div className={styles.pageInnerHelp}>
                        <div className={styles.placeholderCol}>
                            <div className={styles.formEyebrowWrap}>
                                <span className={styles.helpEyebrowRed}>— Share Your Story</span>
                                <h2 className={styles.formHeading}>Your story matters</h2>
                                <p className={styles.formSub}>Every mission starts with someone reaching out — thank you for taking this step.</p>
                            </div>
                            <div className={styles.placeholderPane}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/handshake-flag.png" alt="" className={styles.placeholderImage} />
                            </div>
                        </div>

                        <div className={styles.helpRightCol}>
                            <div className={styles.formEyebrowWrap}>
                                <span className={styles.helpEyebrowRed}>— Submit Your Request</span>
                                <h2 className={styles.formHeading}>A few details &amp; you&apos;re done</h2>
                                <p className={styles.formSub}>No account needed — we&apos;ll create your member account with this request so you can track it.</p>
                            </div>
                            <div className={styles.helpCard}>
                                {error && <div className={styles.error}>{error}</div>}

                                <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Full name */}
                        <div className={styles.fieldRow}>
                            <label className={styles.helpLabel} htmlFor="name">Full name <span className={styles.req}>*</span></label>
                            <input
                                id="name" name="name" type="text" className={styles.helpInput}
                                placeholder="Full name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                onBlur={e => setName(e.target.value)}
                                autoComplete="name"
                                required suppressHydrationWarning
                            />
                        </div>

                        {/* Email + Phone */}
                        <div className={styles.rowTwo}>
                            <div className={styles.fieldRow}>
                                <label className={styles.helpLabel} htmlFor="email">Email <span className={styles.req}>*</span></label>
                                <input
                                    id="email" name="email" type="email" className={styles.helpInput}
                                    placeholder="you@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onBlur={e => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required suppressHydrationWarning
                                />
                            </div>
                            <div className={styles.fieldRow}>
                                <label className={styles.helpLabel} htmlFor="phone">Phone <span className={styles.req}>*</span></label>
                                <input
                                    id="phone" name="phone" type="tel" className={styles.helpInput}
                                    placeholder="(000) 000-0000"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    autoComplete="tel"
                                    required suppressHydrationWarning
                                />
                            </div>
                        </div>

                        {/* Create a password */}
                        <div className={styles.fieldRow}>
                            <label className={styles.helpLabel} htmlFor="password">Create a password <span className={styles.req}>*</span></label>
                            <div className={styles.inputWrap}>
                                <input
                                    id="password" name="password" type={showPassword ? 'text' : 'password'} className={styles.helpInput}
                                    style={{ paddingRight: '46px' }}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onBlur={e => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    minLength={8} required suppressHydrationWarning
                                />
                                <button type="button" className={styles.inputSuffix} onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            <small className={styles.helpHint}>Sets up your member account so you can log in and track your request.</small>
                        </div>

                        {/* City & State */}
                        <div className={styles.fieldRow}>
                            <label className={styles.helpLabel} htmlFor="city">City &amp; State</label>
                            <input
                                id="city" name="city" type="text" className={styles.helpInput}
                                placeholder="City, ST"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                autoComplete="address-level2"
                                suppressHydrationWarning
                            />
                        </div>

                        {/* Type of help needed */}
                        <div className={styles.fieldRow}>
                            <label className={styles.helpLabel} htmlFor="helpType">Type of help needed <span className={styles.req}>*</span></label>
                            <select
                                id="helpType" name="helpType" className={styles.helpSelect}
                                value={helpType}
                                onChange={e => setHelpType(e.target.value)}
                                required suppressHydrationWarning
                            >
                                <option value="">Select…</option>
                                <option value="Housing & shelter">Housing &amp; shelter</option>
                                <option value="Food & supplies">Food &amp; supplies</option>
                                <option value="Disaster relief">Disaster relief</option>
                                <option value="Prayer & care">Prayer &amp; care</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Tell us more */}
                        <div className={styles.fieldRow}>
                            <label className={styles.helpLabel} htmlFor="message">Tell us more <span className={styles.req}>*</span></label>
                            <textarea
                                id="message" name="message" className={styles.helpTextarea}
                                placeholder="Share your situation — everything is confidential."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                required suppressHydrationWarning
                            />
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'Creating account…' : 'Submit request & create account'}
                        </button>
                        </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${fraunces.variable} ${styles.donorPage}`}>
            <section className={styles.hero}>
                <div className={styles.heroDots} />
                <div className="container">
                    <div className={styles.heroInner}>
                        <span className={styles.eyebrow}>Join the Movement</span>
                        <h1 className={styles.heroTitle}>
                            One Spirit. One Mission.
                        </h1>
                        <p className={styles.heroLead}>
                            Create your account to track your giving, join missions, and stand with 10,000+ Americans.
                        </p>
                    </div>
                </div>
            </section>

            <div className={`${styles.helpContainer} ${styles.helpMainContainer}`}>
            <div className={styles.donorFormCol}>

            <AuthTabs active="join" />

            {/* Form card */}
            <div className={styles.helpCard}>
                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Full Name */}
                    <div className={styles.fieldRow}>
                        <label className={styles.helpLabel} htmlFor="name">Full Name</label>
                        <input
                            id="name" name="name" type="text" className={styles.helpInput}
                            placeholder="Full Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onBlur={e => setName(e.target.value)}
                            autoComplete="name"
                            required suppressHydrationWarning
                        />
                    </div>

                    {/* Email */}
                    <div className={styles.fieldRow}>
                        <label className={styles.helpLabel} htmlFor="email">Email Address</label>
                        <input
                            id="email" name="email" type="email" className={styles.helpInput}
                            placeholder="Email Address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onBlur={e => setEmail(e.target.value)}
                            autoComplete="email"
                            required suppressHydrationWarning
                        />
                    </div>

                    {/* Password */}
                    <div className={styles.fieldRow}>
                        <label className={styles.helpLabel} htmlFor="password">Password</label>
                        <div className={styles.inputWrap}>
                            <input
                                id="password" name="password" type={showPassword ? 'text' : 'password'} className={styles.helpInput}
                                style={{ paddingRight: '46px' }}
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onBlur={e => setPassword(e.target.value)}
                                autoComplete="new-password"
                                minLength={8} required suppressHydrationWarning
                            />
                            <button type="button" className={styles.inputSuffix} onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className={styles.fieldRow}>
                        <label className={styles.helpLabel} htmlFor="confirmPassword">Confirm Password</label>
                        <div className={styles.inputWrap}>
                            <input
                                id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} className={styles.helpInput}
                                style={{ paddingRight: '46px' }}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                suppressHydrationWarning
                            />
                            <button type="button" className={styles.inputSuffix} onClick={() => setShowConfirmPassword(v => !v)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                    </div>

                    {/* Validation checklist */}
                    <div className={styles.validationList}>
                        <div className={`${styles.validationItem} ${hasMinLength ? styles.valid : ''}`}>
                            <span className={styles.validationCheck}>{hasMinLength && <Check size={11} color="#ff5a1f" strokeWidth={3} />}</span>
                            At least 8 characters
                        </div>
                        <div className={`${styles.validationItem} ${hasNumber ? styles.valid : ''}`}>
                            <span className={styles.validationCheck}>{hasNumber && <Check size={11} color="#ff5a1f" strokeWidth={3} />}</span>
                            One number
                        </div>
                        <div className={`${styles.validationItem} ${hasSpecial ? styles.valid : ''}`}>
                            <span className={styles.validationCheck}>{hasSpecial && <Check size={11} color="#ff5a1f" strokeWidth={3} />}</span>
                            One special character
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Creating account…' : 'Sign Up'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span className={styles.dividerLine} />
                    <span className={styles.dividerText}>or continue with</span>
                    <span className={styles.dividerLine} />
                </div>

                <button type="button" className={styles.googleBtn} onClick={handleGoogleSSO}>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>

                <p className={styles.footer}>
                    Already have an account?{' '}
                    <Link href="/login" className={styles.footerLink}>Log In</Link>
                </p>
            </div>

            </div>{/* end donorFormCol */}
            </div>{/* end helpContainer/helpMainContainer */}
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>}>
            <RegisterForm />
        </Suspense>
    );
}
