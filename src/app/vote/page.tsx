'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Cause, VotingCycle } from '@/lib/types';
import styles from './page.module.css';
import { CheckCircle2 } from 'lucide-react';

// 28 deterministic confetti pieces — full-viewport celebration on vote success
// left: % across viewport | cx: horizontal drift px | cr: final rotation deg
const PAGE_CONFETTI = [
    { left: 3,  size: 8,  color: '#dc2626', round: true,  delay: 0,   dur: 900,  cx:  12, cr: 360 },
    { left: 8,  size: 6,  color: '#f59e0b', round: false, delay: 70,  dur: 1000, cx:  -8, cr: 480 },
    { left: 14, size: 10, color: '#4ade80', round: true,  delay: 20,  dur: 850,  cx:  20, cr: 540 },
    { left: 19, size: 6,  color: '#60a5fa', round: false, delay: 140, dur: 950,  cx: -15, cr: 360 },
    { left: 24, size: 8,  color: '#a78bfa', round: true,  delay: 50,  dur: 1100, cx:  10, cr: 450 },
    { left: 29, size: 7,  color: '#fbbf24', round: false, delay: 190, dur: 800,  cx: -20, cr: 540 },
    { left: 34, size: 9,  color: '#f87171', round: true,  delay: 30,  dur: 1050, cx:  18, cr: 360 },
    { left: 39, size: 6,  color: '#dc2626', round: false, delay: 110, dur: 900,  cx: -12, cr: 480 },
    { left: 44, size: 8,  color: '#f59e0b', round: true,  delay: 60,  dur: 1000, cx:  25, cr: 540 },
    { left: 49, size: 7,  color: '#4ade80', round: false, delay: 170, dur: 850,  cx: -18, cr: 360 },
    { left: 54, size: 9,  color: '#60a5fa', round: true,  delay: 0,   dur: 950,  cx:   8, cr: 450 },
    { left: 59, size: 6,  color: '#a78bfa', round: false, delay: 90,  dur: 1150, cx: -25, cr: 540 },
    { left: 64, size: 8,  color: '#fbbf24', round: true,  delay: 240, dur: 800,  cx:  15, cr: 360 },
    { left: 69, size: 7,  color: '#f87171', round: false, delay: 40,  dur: 1050, cx: -10, cr: 480 },
    { left: 74, size: 10, color: '#dc2626', round: true,  delay: 120, dur: 900,  cx:  22, cr: 540 },
    { left: 79, size: 6,  color: '#f59e0b', round: false, delay: 80,  dur: 1000, cx:  -8, cr: 360 },
    { left: 84, size: 8,  color: '#4ade80', round: true,  delay: 160, dur: 850,  cx:  12, cr: 450 },
    { left: 89, size: 7,  color: '#60a5fa', round: false, delay: 10,  dur: 950,  cx: -20, cr: 540 },
    { left: 94, size: 9,  color: '#a78bfa', round: true,  delay: 100, dur: 1100, cx:  18, cr: 360 },
    { left: 97, size: 6,  color: '#fbbf24', round: false, delay: 210, dur: 800,  cx: -15, cr: 480 },
    { left: 6,  size: 7,  color: '#f87171', round: true,  delay: 290, dur: 1000, cx:   8, cr: 540 },
    { left: 16, size: 8,  color: '#dc2626', round: false, delay: 150, dur: 900,  cx: -22, cr: 360 },
    { left: 26, size: 6,  color: '#f59e0b', round: true,  delay: 270, dur: 850,  cx:  15, cr: 450 },
    { left: 36, size: 9,  color: '#4ade80', round: false, delay: 130, dur: 950,  cx: -18, cr: 540 },
    { left: 46, size: 7,  color: '#60a5fa', round: true,  delay: 320, dur: 1050, cx:  25, cr: 360 },
    { left: 56, size: 8,  color: '#a78bfa', round: false, delay: 180, dur: 800,  cx: -12, cr: 480 },
    { left: 66, size: 6,  color: '#fbbf24', round: true,  delay: 230, dur: 1150, cx:  20, cr: 540 },
    { left: 76, size: 9,  color: '#f87171', round: false, delay: 340, dur: 900,  cx: -25, cr: 360 },
];

export default function VotePage() {
    return (
        <ProtectedRoute>
            <VoteContent />
        </ProtectedRoute>
    );
}

function VoteContent() {
    const { user, refreshUser } = useAuth();
    const [causes, setCauses] = useState<Cause[]>([]);
    const [cycle, setCycle] = useState<VotingCycle | null>(null);
    const [allocations, setAllocations] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);

    const maxVotes = user?.votesTotal ?? 0;
    const usedVotes = Object.values(allocations).reduce((sum, v) => sum + v, 0);
    const remaining = maxVotes - usedVotes;

    useEffect(() => {
        fetch('/api/votes', { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const normCause = (c: any): Cause | null => {
                    if (!c || typeof c !== 'object') return null;
                    const id = c.id || c._id?.toString();
                    if (!id || !c.name) return null;
                    return { ...c, id } as Cause;
                };
                if (data.causes) setCauses((data.causes as unknown[]).map(normCause).filter(Boolean) as Cause[]);
                if (data.cycle) setCycle(data.cycle);
                if (data.userVotes?.length) {
                    const init: Record<string, number> = {};
                    for (const v of data.userVotes) {
                        const id = v.causeId?.toString?.() || v.causeId;
                        if (id) init[id] = (init[id] || 0) + v.count;
                    }
                    setAllocations(init);
                }
            })
            .catch(() => setError('Failed to load donation data.'))
            .finally(() => setLoading(false));
    }, []);

    const getCauseId = (cause: Cause) =>
        cause.id || (cause as unknown as { _id?: { toString(): string } })._id?.toString() || '';

    const addVote = (causeId: string) => {
        if (!causeId || remaining <= 0) return;
        setAllocations((prev) => ({ ...prev, [causeId]: (prev[causeId] || 0) + 1 }));
    };

    const removeVote = (causeId: string) => {
        setAllocations((prev) => {
            const current = prev[causeId] || 0;
            if (current <= 0) return prev;
            return { ...prev, [causeId]: current - 1 };
        });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/votes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ allocation: allocations }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || data.message || 'Failed to submit donations.');
                return;
            }
            // Trigger celebration before flipping to success screen
            const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!reducedMotion) {
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([20, 80, 30]);
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 2000);
            }
            setSubmitted(true);
            await refreshUser();
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.votePage}>
                <div className="container" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                    <p>Loading donation data...</p>
                </div>
            </div>
        );
    }

    const allocatedCauses = Object.entries(allocations).filter(([, v]) => v > 0);

    return (
        <>
            {/* Full-viewport confetti — fixed, pointer-events:none, auto-dismissed after 2s */}
            {showCelebration && (
                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9990, overflow: 'hidden' }}>
                    <style>{`
                        @keyframes pg_confetti {
                            0%   { opacity: 1; transform: translateY(-20px) translateX(0) rotate(0deg); }
                            85%  { opacity: 0.9; }
                            100% { opacity: 0; transform: translateY(110vh) translateX(var(--cx)) rotate(var(--cr)); }
                        }
                    `}</style>
                    {PAGE_CONFETTI.map((p, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                left: `${p.left}%`,
                                top: 0,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                borderRadius: p.round ? '50%' : '2px',
                                background: p.color,
                                willChange: 'transform, opacity',
                                ['--cx' as string]: `${p.cx}px`,
                                ['--cr' as string]: `${p.cr}deg`,
                                animation: `pg_confetti ${p.dur}ms ease-in ${p.delay}ms both`,
                            } as React.CSSProperties & Record<string, string>}
                        />
                    ))}
                </div>
            )}

            <div className={styles.votePage}>
                <div className="container">
                    {submitted ? (
                        <div className={styles.successCard}>
                            <div className={styles.successIcon}><CheckCircle2 size={52} color="#16a34a" /></div>
                            <h2 className="heading-lg">Donations Submitted!</h2>
                            <p className="text-body" style={{ marginTop: 'var(--space-md)' }}>
                                Thank you for making your voice heard. Your {usedVotes} donation vote{usedVotes !== 1 ? 's have' : ' has'} been recorded for this cycle.
                            </p>
                            <div className={styles.voteSummary}>
                                {allocatedCauses.map(([id, count]) => {
                                    const cause = causes.find((c) => c.id === id);
                                    return (
                                        <div key={id} className={styles.summaryItem}>
                                            <span>{cause?.name}</span>
                                            <span className={styles.summaryCount}>{count} donation vote{count > 1 ? 's' : ''}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.voteHeader}>
                                <div>
                                    <h1 className="heading-lg">Allocate Your Donations</h1>
                                    <p className="text-body">
                                        {cycle
                                            ? `${cycle.name} — Direct your donation votes to the causes that matter most`
                                            : 'Direct your donation votes to the causes that matter to you'}
                                    </p>
                                </div>
                                <div className={styles.voteCounter}>
                                    <span className={styles.counterLabel}>Donation Votes Remaining</span>
                                    <span className={styles.counterValue}>{remaining}</span>
                                    <span className={styles.counterOf}>of {maxVotes}</span>
                                </div>
                            </div>

                            {!cycle && (
                                <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 8, padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)', color: '#854d0e', textAlign: 'center' }}>
                                    No active donation cycle right now. Check back soon!
                                </div>
                            )}

                            {error && (
                                <div style={{ background: '#fee2e2', border: '1px solid #ef4444', borderRadius: 8, padding: 'var(--space-md)', marginBottom: 'var(--space-lg)', color: '#dc2626' }}>
                                    {error}
                                </div>
                            )}

                            {causes.length === 0 && cycle ? (
                                <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--color-gray-500)' }}>
                                    No causes available for this cycle yet.
                                </div>
                            ) : (
                                <div className={styles.causesGrid}>
                                    {causes.map((cause) => {
                                        const causeId = getCauseId(cause);
                                        const votes = allocations[causeId] || 0;
                                        const isOwnCause = !!(user?.id && cause.submittedBy && cause.submittedBy === user.id);
                                        const progress = cause.goalAmount > 0
                                            ? Math.round((cause.raisedAmount / cause.goalAmount) * 100)
                                            : 0;
                                        return (
                                            <div key={causeId} className={`${styles.causeCard} ${votes > 0 ? styles.causeCardActive : ''}`}>
                                                {cause.image && (
                                                    <div className={styles.causeImage}>
                                                        <Image src={cause.image} alt={cause.name} fill style={{ objectFit: 'cover' }} />
                                                    </div>
                                                )}
                                                <div className={styles.causeBody}>
                                                    <span className={styles.causeCategory}>{cause.category}</span>
                                                    <h3 className={styles.causeName}>{cause.name}</h3>
                                                    <p className={styles.causeDesc}>{cause.description}</p>
                                                    <div className={styles.causeProgress}>
                                                        <div className={styles.causeProgressBar}>
                                                            <div className={styles.causeProgressFill} style={{ width: `${Math.min(progress, 100)}%` }} />
                                                        </div>
                                                        <div className={styles.causeStats}>
                                                            <span>${cause.raisedAmount.toLocaleString()} raised</span>
                                                            <span>{cause.totalVotes.toLocaleString()} donations</span>
                                                        </div>
                                                    </div>
                                                    {isOwnCause ? (
                                                        <div className={styles.voteControls}>
                                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                                                You cannot vote for your own submission
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className={styles.voteControls}>
                                                            <button className={styles.voteBtn} onClick={() => removeVote(causeId)} disabled={votes === 0} aria-label="Remove donation vote">−</button>
                                                            <span className={styles.voteCount}>{votes}</span>
                                                            <button className={styles.voteBtn} onClick={() => addVote(causeId)} disabled={remaining === 0} aria-label="Add donation vote">+</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {usedVotes > 0 && (
                                <div className={styles.submitBar}>
                                    <p>
                                        {usedVotes} donation vote{usedVotes > 1 ? 's' : ''} allocated across{' '}
                                        {Object.values(allocations).filter(v => v > 0).length} cause{Object.values(allocations).filter(v => v > 0).length !== 1 ? 's' : ''}
                                    </p>
                                    <button className="btn btn--primary" onClick={handleSubmit} disabled={submitting}>
                                        {submitting ? 'Submitting...' : 'Submit Donations'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
