'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
import { Sparkles, Vote, DollarSign, Video, Rocket } from 'lucide-react';

const steps = [
    {
        icon: <Sparkles size={40} color="#dc2626" />,
        title: 'Welcome to Faith Fighters for America!',
        body: "You're now part of a community united by faith, compassion, and purpose. Together we direct real dollars to causes that matter.",
        cta: 'Get Started',
    },
    {
        icon: <Vote size={40} color="#dc2626" />,
        title: 'You Have 30 Votes This Month',
        body: 'Your Faith Fighter membership gives you 30 donation votes per cycle. Cast 1 vote per day — your votes direct real money to the causes you care about most.',
        cta: 'Next',
    },
    {
        icon: <DollarSign size={40} color="#dc2626" />,
        title: '80% Goes Directly to Causes',
        body: 'Every dollar you donate is put to work: 80% flows directly to community-voted charitable causes. You decide where it goes.',
        cta: 'Next',
    },
    {
        icon: <Video size={40} color="#dc2626" />,
        title: 'Share Your Story',
        body: 'Upload video reels of impact from your community. Inspire others and amplify the movement with your voice.',
        cta: 'Next',
    },
    {
        icon: <Rocket size={40} color="#dc2626" />,
        title: "You're All Set!",
        body: 'Head to your dashboard to cast your first vote, explore causes, and track your impact in real time.',
        cta: 'Go to My Dashboard',
    },
];

export default function WelcomePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/register');
        }
    }, [user, isLoading, router]);

    const advance = () => {
        if (step === steps.length - 1) {
            router.push('/dashboard');
            return;
        }
        setAnimating(true);
        setTimeout(() => {
            setStep(s => s + 1);
            setAnimating(false);
        }, 220);
    };

    if (isLoading || !user) return null;

    const current = steps[step];

    return (
        <div className={styles.page}>
            <div className={styles.card} data-animating={animating}>
                {/* Progress dots */}
                <div className={styles.dots}>
                    {steps.map((_, i) => (
                        <span key={i} className={`${styles.dot} ${i === step ? styles.dotActive : i < step ? styles.dotDone : ''}`} />
                    ))}
                </div>

                <div className={styles.icon}>{current.icon}</div>
                <h1 className={styles.title}>{current.title}</h1>
                <p className={styles.body}>{current.body}</p>

                {step === 1 && (
                    <div className={styles.voteBox}>
                        <div className={styles.voteCount}>30</div>
                        <div className={styles.voteLabel}>votes / month</div>
                        <div className={styles.voteSub}>1 vote available per day</div>
                    </div>
                )}

                <button className={styles.btn} onClick={advance}>
                    {current.cta}
                </button>

                {step < steps.length - 1 && (
                    <button className={styles.skip} onClick={() => router.push('/dashboard')}>
                        Skip intro
                    </button>
                )}
            </div>
        </div>
    );
}
