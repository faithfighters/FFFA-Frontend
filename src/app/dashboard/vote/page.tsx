'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Cause, VotingCycle } from '@/lib/types';
import styles from '../page.module.css';
import { CheckCircle2, RefreshCw } from 'lucide-react';

// 28 deterministic confetti pieces — same palette as reel celebration
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

export default function DashboardVotePage() {
    const { user, refreshUser } = useAuth();
    const [causes, setCauses] = useState<Cause[]>([]);
    const [cycle, setCycle] = useState<VotingCycle | null>(null);
    const [allocations, setAllocations] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [buyMoreLoading, setBuyMoreLoading] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    const maxVotes = user?.votesTotal ?? 0;
    const usedVotes = Object.values(allocations).reduce((sum, v) => sum + v, 0);
    const remaining = maxVotes - usedVotes;

    const DAILY_LIMIT = 1;

    const handleBuyMore = async () => {
        setBuyMoreLoading(true);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ plan: user?.plan || 'faith_fighter' }),
            });
            const data = await res.json();
            if (res.ok && data.url) window.location.href = data.url;
        } finally {
            setBuyMoreLoading(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizeCause = (c: any): Cause | null => {
        if (!c || typeof c !== 'object') return null;
        const id: string | undefined = c.id || c._id?.toString();
        if (!id || !c.name) return null;
        return { ...c, id } as Cause;
    };

    useEffect(() => {
        fetch('/api/votes', { credentials: 'include' })
            .then(r => r.json())
            .then(data => {
                if (data.causes) setCauses((data.causes as unknown[]).map(normalizeCause).filter(Boolean) as Cause[]);
                if (data.cycle) setCycle(data.cycle);
                if (data.userVotes?.length) {
                    const init: Record<string, number> = {};
                    for (const v of data.userVotes) {
                        const id: string | undefined = v.causeId?.toString?.() ?? v.causeId;
                        if (id) init[id] = (init[id] || 0) + v.count;
                    }
                    setAllocations(init);
                }
            })
            .catch(() => setError('Failed to load donation data.'))
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCauseId = (cause: Cause): string =>
        cause.id || (cause as unknown as { _id?: { toString(): string } })._id?.toString() || '';

    const addVote = (causeId: string) => {
        if (!causeId || remaining <= 0) return;
        setAllocations(prev => ({ ...prev, [causeId]: (prev[causeId] || 0) + 1 }));
    };

    const removeVote = (causeId: string) => {
        if (!causeId) return;
        setAllocations(prev => {
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
            if (!res.ok) { setError(data.error || data.message || 'Failed to submit.'); return; }
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

    if (loading) return (
        <div>
            <div style={{ height: '36px', width: '220px', borderRadius: '12px', background: '#f1f5f9', marginBottom: '8px' }} />
            <div style={{ height: '20px', width: '320px', borderRadius: '8px', background: '#f1f5f9', marginBottom: '32px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ borderRadius: '20px', overflow: 'hidden', background: '#f1f5f9', height: '300px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ))}
            </div>
        </div>
    );

    const allocatedCauses = Object.entries(allocations).filter(([, v]) => v > 0);

    return (
        <>
            {/* Full-viewport confetti — fixed overlay, pointer-events:none, auto-dismissed after 2s */}
            {showCelebration && (
                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9990, overflow: 'hidden' }}>
                    <style>{`
                        @keyframes dv_confetti {
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
                                animation: `dv_confetti ${p.dur}ms ease-in ${p.delay}ms both`,
                            } as React.CSSProperties & Record<string, string>}
                        />
                    ))}
                </div>
            )}

            <div>
                {submitted ? (
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Activities</h1>
                        <div style={{ background: 'white', borderRadius: '24px', padding: '48px', textAlign: 'center', border: '1px solid #f1f5f9', marginTop: '24px' }}>
                            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}><CheckCircle2 size={52} color="#16a34a" /></div>
                            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Donations Submitted!</h2>
                            <p style={{ color: '#64748b', marginBottom: '24px' }}>
                                Thank you! Your {usedVotes} donation vote{usedVotes !== 1 ? 's have' : ' has'} been recorded for this cycle.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px', margin: '0 auto' }}>
                                {allocatedCauses.map(([id, count]) => {
                                    const cause = causes.find(c => c.id === id);
                                    return (
                                        <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: '#f8fafc', borderRadius: '10px' }}>
                                            <span style={{ fontSize: '14px', color: '#334155' }}>{cause?.name}</span>
                                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>{count} vote{count > 1 ? 's' : ''}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Activities</h1>
                                <p style={{ color: '#64748b' }}>
                                    {cycle ? `${cycle.name} — ` : ''}Direct your donation votes to causes that matter.
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                <div style={{
                                    background: '#fff5f6', border: '1.5px solid #fecdd3', borderRadius: '16px',
                                    padding: '12px 20px', textAlign: 'center',
                                }}>
                                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#dc2626', lineHeight: 1 }}>{remaining}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>of {maxVotes} votes left</div>
                                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>{DAILY_LIMIT} vote / day</div>
                                </div>
                                {remaining === 0 && maxVotes > 0 && (
                                    <button
                                        onClick={handleBuyMore}
                                        disabled={buyMoreLoading}
                                        style={{ padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '12px', cursor: buyMoreLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: buyMoreLoading ? 0.7 : 1 }}
                                    >
                                        {buyMoreLoading ? 'Redirecting…' : <><RefreshCw size={13} style={{ marginRight: '5px' }} />Buy More Votes</>}
                                    </button>
                                )}
                            </div>
                        </div>

                        {!cycle && (
                            <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '12px', padding: '16px', marginBottom: '24px', color: '#854d0e', textAlign: 'center' }}>
                                No active donation cycle right now. Check back soon!
                            </div>
                        )}

                        {error && (
                            <div style={{ background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', color: '#dc2626' }}>
                                {error}
                            </div>
                        )}

                        {maxVotes === 0 && (
                            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px', marginBottom: '24px', color: '#1d4ed8', textAlign: 'center' }}>
                                You need an active subscription to vote. <a href="/join" style={{ fontWeight: 700, color: '#dc2626' }}>Get your membership →</a>
                            </div>
                        )}

                        {causes.length === 0 && cycle ? (
                            <div className={styles.emptyState}>No causes available for this cycle yet.</div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {causes.map(cause => {
                                    const causeId = getCauseId(cause);
                                    const votes = allocations[causeId] || 0;
                                    const isOwnCause = !!(user?.id && (cause as Cause & { submittedBy?: string }).submittedBy && (cause as Cause & { submittedBy?: string }).submittedBy === user.id);
                                    const progress = cause.goalAmount > 0 ? Math.round((cause.raisedAmount / cause.goalAmount) * 100) : 0;
                                    return (
                                        <div key={causeId} style={{
                                            background: 'white', borderRadius: '20px', overflow: 'hidden',
                                            border: votes > 0 ? '2px solid #dc2626' : '1px solid #f1f5f9',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                            transition: 'all 0.2s',
                                        }}>
                                            {cause.image && (
                                                <div style={{ position: 'relative', height: '160px' }}>
                                                    <Image src={cause.image} alt={cause.name} fill style={{ objectFit: 'cover' }} />
                                                </div>
                                            )}
                                            <div style={{ padding: '20px' }}>
                                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                    {cause.category}
                                                </span>
                                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '6px 0 8px' }}>{cause.name}</h3>
                                                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '14px' }}>{cause.description}</p>

                                                <div style={{ marginBottom: '16px' }}>
                                                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
                                                        <div style={{ height: '100%', width: `${Math.min(progress, 100)}%`, background: 'linear-gradient(90deg, #dc2626, #f87171)', borderRadius: '3px' }} />
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                                                        <span>${cause.raisedAmount.toLocaleString()} raised</span>
                                                        <span>{cause.totalVotes.toLocaleString()} donations</span>
                                                    </div>
                                                </div>

                                                {isOwnCause ? (
                                                    <p style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
                                                        You cannot vote for your own submission
                                                    </p>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                                                        <button
                                                            onClick={() => removeVote(causeId)} disabled={votes === 0}
                                                            style={{
                                                                width: '44px', height: '44px', borderRadius: '50%', border: 'none',
                                                                background: votes === 0 ? '#f1f5f9' : '#fff1f2', color: votes === 0 ? '#94a3b8' : '#dc2626',
                                                                fontSize: '20px', fontWeight: 700, cursor: votes === 0 ? 'not-allowed' : 'pointer',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                transition: 'background 0.15s',
                                                            }}
                                                            aria-label={`Remove vote from ${cause.name}`}
                                                        >−</button>
                                                        <span style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', minWidth: '32px', textAlign: 'center' }}>{votes}</span>
                                                        <button
                                                            onClick={() => addVote(causeId)} disabled={remaining === 0}
                                                            style={{
                                                                width: '44px', height: '44px', borderRadius: '50%', border: 'none',
                                                                background: remaining === 0 ? '#f1f5f9' : '#dc2626', color: remaining === 0 ? '#94a3b8' : 'white',
                                                                fontSize: '20px', fontWeight: 700, cursor: remaining === 0 ? 'not-allowed' : 'pointer',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                boxShadow: remaining > 0 ? '0 4px 12px rgba(220,38,38,0.3)' : 'none',
                                                                transition: 'background 0.15s, box-shadow 0.15s',
                                                            }}
                                                            aria-label={`Add vote to ${cause.name}`}
                                                        >+</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {usedVotes > 0 && (
                            <div style={{
                                position: 'sticky', bottom: '24px', background: 'white', border: '1px solid #f1f5f9',
                                borderRadius: '16px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', marginTop: '24px',
                            }}>
                                <p style={{ margin: 0, fontSize: '14px', color: '#334155' }}>
                                    {usedVotes} vote{usedVotes > 1 ? 's' : ''} allocated across{' '}
                                    {Object.values(allocations).filter(v => v > 0).length} cause{Object.values(allocations).filter(v => v > 0).length !== 1 ? 's' : ''}
                                </p>
                                <button
                                    onClick={handleSubmit} disabled={submitting}
                                    style={{
                                        padding: '10px 24px', background: submitting ? '#e2e8f0' : '#dc2626', color: submitting ? '#94a3b8' : 'white',
                                        border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '14px',
                                        cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                                    }}
                                >
                                    {submitting ? 'Submitting…' : 'Submit Donations'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
