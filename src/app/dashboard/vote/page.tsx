'use client';

import { useState, useEffect, useRef } from 'react';

const PARTICLE_OFFSETS = ['14px', '22px', '30px'];
const PARTICLE_COLORS = ['#f87171', '#dc2626', '#fca5a5'];

const VOTE_CSS = [
    '@keyframes voteAddPop {',
    '0%{transform:scale(1)}',
    '25%{transform:scale(0.80)}',
    '55%{transform:scale(1.28)}',
    '75%{transform:scale(0.94)}',
    '100%{transform:scale(1)}',
    '}',
    '@keyframes voteRemovePop {',
    '0%{transform:scale(1)}',
    '35%{transform:scale(0.82)}',
    '70%{transform:scale(1.08)}',
    '100%{transform:scale(1)}',
    '}',
    '@keyframes numPop {',
    '0%{transform:scale(1);color:#ffffff}',
    '40%{transform:scale(1.5);color:#f87171}',
    '70%{transform:scale(0.92);color:#f87171}',
    '100%{transform:scale(1);color:#ffffff}',
    '}',
    '@keyframes numShrink {',
    '0%{transform:scale(1);opacity:1}',
    '40%{transform:scale(0.65);opacity:0.5}',
    '100%{transform:scale(1);opacity:1}',
    '}',
    '@keyframes cardGlow {',
    '0%{box-shadow:0 4px 20px rgba(220,38,38,0)}',
    '45%{box-shadow:0 4px 32px rgba(220,38,38,0.28)}',
    '100%{box-shadow:0 4px 20px rgba(220,38,38,0.06)}',
    '}',
    '@keyframes particleUp {',
    '0%{opacity:1;transform:translateY(0) scale(1)}',
    '100%{opacity:0;transform:translateY(-52px) scale(0.2)}',
    '}',
].join('');
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Cause, VotingCycle } from '@/lib/types';
import styles from '../page.module.css';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import { haptics } from '@/lib/haptics';


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
    const [btnAnim, setBtnAnim] = useState<Record<string, 'add' | 'remove' | ''>>({});
    const [particles, setParticles] = useState<{ id: number; causeId: string; offset: number }[]>([]);
    const particleIdRef = useRef(0);
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const maxVotes = user?.votesTotal ?? 0;
    const usedVotes = Object.values(allocations).reduce((sum, v) => sum + v, 0);
    const remaining = maxVotes - usedVotes;

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

    const triggerAnim = (causeId: string, type: 'add' | 'remove') => {
        if (reducedMotion) return;
        setBtnAnim(prev => ({ ...prev, [causeId]: type }));
        setTimeout(() => setBtnAnim(prev => ({ ...prev, [causeId]: '' })), 320);
    };

    const spawnParticles = (causeId: string) => {
        if (reducedMotion) return;
        const newParticles = [0, 1, 2].map(offset => ({
            id: ++particleIdRef.current,
            causeId,
            offset,
        }));
        setParticles(prev => [...prev, ...newParticles]);
        setTimeout(() => {
            const ids = new Set(newParticles.map(p => p.id));
            setParticles(prev => prev.filter(p => !ids.has(p.id)));
        }, 650);
    };

    const addVote = (causeId: string) => {
        if (!causeId || remaining <= 0) return;
        haptics.select();
        triggerAnim(causeId, 'add');
        spawnParticles(causeId);
        setAllocations(prev => ({ ...prev, [causeId]: (prev[causeId] || 0) + 1 }));
    };

    const removeVote = (causeId: string) => {
        if (!causeId) return;
        setAllocations(prev => {
            const current = prev[causeId] || 0;
            if (current <= 0) return prev;
            haptics.select();
            triggerAnim(causeId, 'remove');
            return { ...prev, [causeId]: current - 1 };
        });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        haptics.tap();
        try {
            const res = await fetch('/api/votes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ allocation: allocations }),
            });
            const data = await res.json();
            if (!res.ok) { haptics.error(); setError(data.error || data.message || 'Failed to submit.'); return; }
            haptics.success();
            setSubmitted(true);
            await refreshUser();
        } catch {
            haptics.error();
            setError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div>
            <div style={{ height: '36px', width: '220px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', marginBottom: '8px' }} />
            <div style={{ height: '20px', width: '320px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', marginBottom: '32px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ borderRadius: '20px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', height: '300px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ))}
            </div>
        </div>
    );

    const allocatedCauses = Object.entries(allocations).filter(([, v]) => v > 0);

    return (
        <div>
            <style>{VOTE_CSS}</style>
            {submitted ? (
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>Activities</h1>
                        <div style={{ background: '#15131f', borderRadius: '24px', padding: '48px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)', marginTop: '24px' }}>
                            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}><CheckCircle2 size={52} color="#4ade80" /></div>
                            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>Donations Submitted!</h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
                                Thank you! Your {usedVotes} donation vote{usedVotes !== 1 ? 's have' : ' has'} been recorded for this cycle.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px', margin: '0 auto' }}>
                                {allocatedCauses.map(([id, count]) => {
                                    const cause = causes.find(c => c.id === id);
                                    return (
                                        <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                                            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{cause?.name}</span>
                                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#f87171' }}>{count} vote{count > 1 ? 's' : ''}</span>
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
                                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>Activities</h1>
                                <p style={{ color: 'rgba(255,255,255,0.5)' }}>
                                    {cycle ? `${cycle.name} — ` : ''}Direct your donation votes to causes that matter.
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                <div style={{
                                    background: 'rgba(220,38,38,0.15)', border: '1.5px solid rgba(220,38,38,0.3)', borderRadius: '16px',
                                    padding: '12px 20px', textAlign: 'center',
                                }}>
                                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#f87171', lineHeight: 1 }}>{remaining}</div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>of {maxVotes} votes left</div>
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
                            <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: '12px', padding: '16px', marginBottom: '24px', color: '#fbbf24', textAlign: 'center' }}>
                                No active donation cycle right now. Check back soon!
                            </div>
                        )}

                        {error && (
                            <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', color: '#f87171' }}>
                                {error}
                            </div>
                        )}

                        {maxVotes === 0 && (
                            <div style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(96,165,250,0.35)', borderRadius: '12px', padding: '16px', marginBottom: '24px', color: '#60a5fa', textAlign: 'center' }}>
                                You need an active subscription to vote. <a href="/join" style={{ fontWeight: 700, color: '#f87171' }}>Get your membership →</a>
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
                                            background: '#15131f', borderRadius: '20px', overflow: 'hidden',
                                            border: votes > 0 ? '2px solid #dc2626' : '1px solid rgba(255,255,255,0.06)',
                                            boxShadow: votes > 0 ? '0 4px 20px rgba(220,38,38,0.15)' : '0 4px 20px rgba(0,0,0,0.2)',
                                            transition: 'border 0.2s, box-shadow 0.2s',
                                            animation: btnAnim[causeId] === 'add' && votes === 1 ? 'cardGlow 400ms ease-out' : undefined,
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
                                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '6px 0 8px' }}>{cause.name}</h3>
                                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: '14px' }}>{cause.description}</p>

                                                <div style={{ marginBottom: '16px' }}>
                                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
                                                        <div style={{ height: '100%', width: `${Math.min(progress, 100)}%`, background: 'linear-gradient(90deg, #dc2626, #f87171)', borderRadius: '3px' }} />
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                                                        <span>${cause.raisedAmount.toLocaleString()} raised</span>
                                                        <span>{cause.totalVotes.toLocaleString()} donations</span>
                                                    </div>
                                                </div>

                                                {isOwnCause ? (
                                                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', textAlign: 'center' }}>
                                                        You cannot vote for your own submission
                                                    </p>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', position: 'relative' }}>
                                                        <button
                                                            onClick={() => removeVote(causeId)} disabled={votes === 0}
                                                            style={{
                                                                width: '44px', height: '44px', borderRadius: '50%', border: 'none',
                                                                background: votes === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(220,38,38,0.15)', color: votes === 0 ? 'rgba(255,255,255,0.4)' : '#f87171',
                                                                fontSize: '20px', fontWeight: 700, cursor: votes === 0 ? 'not-allowed' : 'pointer',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                transition: 'background 0.15s, transform 0.1s',
                                                                animation: btnAnim[causeId] === 'remove' ? 'voteRemovePop 280ms cubic-bezier(0.22,1,0.36,1)' : undefined,
                                                                willChange: 'transform',
                                                            }}
                                                            aria-label={`Remove vote from ${cause.name}`}
                                                        >−</button>

                                                        <span
                                                            key={causeId + '-' + votes}
                                                            style={{
                                                                fontSize: '22px', fontWeight: 900, color: '#ffffff',
                                                                minWidth: '32px', textAlign: 'center', display: 'inline-block',
                                                                animation: btnAnim[causeId] === 'add'
                                                                    ? 'numPop 260ms cubic-bezier(0.22,1,0.36,1)'
                                                                    : btnAnim[causeId] === 'remove'
                                                                    ? 'numShrink 220ms ease-out'
                                                                    : undefined,
                                                                willChange: 'transform',
                                                            }}
                                                        >{votes}</span>

                                                        <div style={{ position: 'relative' }}>
                                                            {particles.filter(p => p.causeId === causeId).map(p => (
                                                                <div key={p.id} style={{
                                                                    position: 'absolute',
                                                                    top: '50%',
                                                                    left: PARTICLE_OFFSETS[p.offset],
                                                                    width: '7px', height: '7px',
                                                                    borderRadius: '50%',
                                                                    background: PARTICLE_COLORS[p.offset],
                                                                    pointerEvents: 'none',
                                                                    animation: 'particleUp 600ms ease-out forwards',
                                                                    willChange: 'transform, opacity',
                                                                }} />
                                                            ))}
                                                            <button
                                                                onClick={() => addVote(causeId)} disabled={remaining === 0}
                                                                style={{
                                                                    width: '44px', height: '44px', borderRadius: '50%', border: 'none',
                                                                    background: remaining === 0 ? 'rgba(255,255,255,0.08)' : '#dc2626', color: remaining === 0 ? 'rgba(255,255,255,0.4)' : 'white',
                                                                    fontSize: '20px', fontWeight: 700, cursor: remaining === 0 ? 'not-allowed' : 'pointer',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    boxShadow: remaining > 0 ? '0 4px 12px rgba(220,38,38,0.3)' : 'none',
                                                                    transition: 'background 0.15s, box-shadow 0.15s',
                                                                    animation: btnAnim[causeId] === 'add' ? 'voteAddPop 300ms cubic-bezier(0.22,1,0.36,1)' : undefined,
                                                                    willChange: 'transform',
                                                                }}
                                                                aria-label={`Add vote to ${cause.name}`}
                                                            >+</button>
                                                        </div>
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
                                position: 'sticky', bottom: '24px', background: '#15131f', border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '16px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.35)', marginTop: '24px',
                            }}>
                                <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                                    {usedVotes} vote{usedVotes > 1 ? 's' : ''} allocated across{' '}
                                    {Object.values(allocations).filter(v => v > 0).length} cause{Object.values(allocations).filter(v => v > 0).length !== 1 ? 's' : ''}
                                </p>
                                <button
                                    onClick={handleSubmit} disabled={submitting}
                                    style={{
                                        padding: '10px 24px', background: submitting ? 'rgba(255,255,255,0.1)' : '#dc2626', color: submitting ? 'rgba(255,255,255,0.4)' : 'white',
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
    );
}
