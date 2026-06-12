'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PLAN_CONFIG, PlanKey } from '@/lib/types';
import { Trophy, Vote, Zap, CheckCircle2, AlertCircle, TrendingUp, Calendar, Shield } from 'lucide-react';

interface SubscriptionInfo {
    plan: string;
    status: string;
    nextBillingDate?: string;
    amount?: number;
}

const VOTE_PACKS = [
    { id: 'pack_15', votes: 15, price: 10.00, label: 'Starter Boost',  description: 'No daily limit — use anytime', popular: false },
    { id: 'pack_30', votes: 30, price: 20.00, label: 'Value Boost',    description: 'No daily limit — use anytime', popular: true },
    { id: 'pack_45', votes: 45, price: 30.00, label: 'Power Boost',    description: 'No daily limit — use anytime', popular: false },
];

function SubscriptionContent() {
    const { user, refreshUser } = useAuth();
    const searchParams = useSearchParams();
    const votesAdded = searchParams.get('votes_added');
    const [sub, setSub] = useState<SubscriptionInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [buyingPack, setBuyingPack] = useState<string | null>(null);
    const [upgrading, setUpgrading] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(votesAdded ? `${votesAdded} vote${Number(votesAdded) > 1 ? 's' : ''} added to your account!` : '');
    const [cancelling, setCancelling] = useState(false);
    const inFlightRef = useRef(false);

    const fetchSub = () =>
        fetch('/api/subscription', { credentials: 'include' })
            .then(r => r.json())
            .then(data => setSub(data.subscription || null))
            .catch(() => setError('Failed to load subscription info. Please refresh.'))
            .finally(() => setLoading(false));

    useEffect(() => {
        fetchSub();
        if (votesAdded) {
            // Sync Stripe sessions first so booster votes are applied before refreshUser reads DB
            fetch('/api/stripe/sync', { method: 'POST', credentials: 'include' })
                .finally(() => refreshUser());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUpgrade = async (planKey: PlanKey) => {
        if (inFlightRef.current) return;
        inFlightRef.current = true;
        setUpgrading(planKey);
        setError('');
        setSuccess('');
        try {
            const res = await fetch('/api/subscription/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ plan: planKey }),
            });
            const data = await res.json();
            if (res.ok && data.url) { window.location.href = data.url; return; }
            if (res.ok && data.upgraded) {
                await refreshUser();
                await fetchSub();
                setSuccess(`Plan upgraded to ${PLAN_CONFIG[planKey].name}!`);
                return;
            }
            setError(data.message || 'Could not process upgrade. Please try again.');
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setUpgrading(null);
            inFlightRef.current = false;
        }
    };

    const handleBuyVotes = async (pack: typeof VOTE_PACKS[number]) => {
        if (inFlightRef.current) return;
        inFlightRef.current = true;
        setBuyingPack(pack.id);
        setError('');
        setSuccess('');
        try {
            const res = await fetch('/api/subscription/buy-votes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ votes: pack.votes, price: pack.price, label: pack.label }),
            });
            const data = await res.json();
            if (res.ok && data.url) { window.location.href = data.url; return; }
            setError(data.message || 'Could not start checkout. Please try again.');
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setBuyingPack(null);
            inFlightRef.current = false;
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel your subscription?')) return;
        setCancelling(true);
        setError('');
        try {
            const res = await fetch('/api/subscription', { method: 'DELETE', credentials: 'include' });
            if (res.ok) {
                setSub(null);
                await refreshUser();
                setSuccess('Subscription cancelled successfully.');
            } else {
                setError('Could not cancel. Please contact support.');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #f1f5f9', borderTopColor: '#dc2626', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
            Loading subscription…
        </div>
    );

    const currentPlan = user?.plan as PlanKey | undefined;
    const planCfg = currentPlan ? PLAN_CONFIG[currentPlan] : null;
    const votesRemaining = user?.votesRemaining ?? 0;
    const boosterRemaining = user?.boosterVotesRemaining ?? 0;
    const votesTotal = planCfg?.votes ?? 30;
    const votesUsed = Math.max(0, votesTotal - votesRemaining);
    const usagePercent = Math.round((votesUsed / votesTotal) * 100);

    return (
        <div>
            {/* ── Page Header ── */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Plans & Votes</h1>
                <p style={{ color: '#64748b' }}>Manage your membership and top up your donation votes.</p>
            </div>

            {/* ── Alerts ── */}
            {success && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', color: '#15803d', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#16a34a" /> {success}
                </div>
            )}
            {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', color: '#dc2626', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} color="#dc2626" /> {error}
                </div>
            )}

            {/* ── Two-column: Plan Card + Stats Sidebar ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px', alignItems: 'start' }}>
                {/* Left: Plan Card */}
                <div>
                    <div style={{ marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
                            {currentPlan ? 'Your Membership' : 'Choose a Plan'}
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '13px' }}>
                            {currentPlan ? 'Manage your membership plan.' : 'Become a Faith Fighter and start making an impact.'}
                        </p>
                    </div>
                    <SinglePlanCard
                        cfg={PLAN_CONFIG.faith_fighter}
                        planKey="faith_fighter"
                        isActive={currentPlan === 'faith_fighter'}
                        upgrading={upgrading === 'faith_fighter'}
                        onUpgrade={() => handleUpgrade('faith_fighter')}
                    />
                    {currentPlan && sub?.status === 'active' && (
                        <div style={{ marginTop: '10px' }}>
                            <button
                                onClick={handleCancel}
                                disabled={cancelling}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                            >
                                {cancelling ? 'Cancelling…' : 'Cancel subscription'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Right: Stats & Info Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Votes Usage */}
                    {currentPlan && (
                        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Vote Balance</div>
                                    <div style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                                        {votesRemaining}
                                        <span style={{ fontSize: '15px', fontWeight: 500, color: '#94a3b8', marginLeft: '6px' }}>/ {votesTotal}</span>
                                    </div>
                                </div>
                                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Vote size={24} color="#dc2626" />
                                </div>
                            </div>
                            <div style={{ background: '#f1f5f9', borderRadius: '8px', height: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                                <div style={{
                                    height: '100%', borderRadius: '8px',
                                    background: usagePercent > 80 ? '#dc2626' : usagePercent > 50 ? '#f59e0b' : '#22c55e',
                                    width: `${Math.min(usagePercent, 100)}%`,
                                    transition: 'width 0.6s ease',
                                }} />
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                                {votesUsed} used · {votesRemaining} remaining this cycle
                            </div>
                        </div>
                    )}

                    {/* Impact Stats */}
                    <div style={{ background: 'linear-gradient(145deg, #0f172a, #1e293b)', borderRadius: '20px', padding: '24px', border: '1px solid #1e293b' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Your Impact</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {[
                                { icon: <TrendingUp size={16} color="#4ade80" />, label: 'To Charities', value: '80%', sub: 'of every dollar' },
                                { icon: <Shield size={16} color="#60a5fa" />, label: 'Cause Votes', value: planCfg?.votes ?? 30, sub: 'votes / cycle' },
                                { icon: <Zap size={16} color="#fbbf24" />, label: 'Booster Votes', value: boosterRemaining > 0 ? `+${boosterRemaining}` : 'None', sub: 'no daily limit' },
                                { icon: <Calendar size={16} color="#f472b6" />, label: 'Billing', value: sub?.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Monthly', sub: 'renewal date' },
                            ].map(s => (
                                <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                        {s.icon}
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</span>
                                    </div>
                                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'white', lineHeight: 1, marginBottom: '2px' }}>{s.value}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{s.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trust line */}
                    <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '14px 18px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Shield size={18} color="#16a34a" />
                        <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                            <strong>80% of all purchases</strong> go directly to community-voted charities. Secure checkout via Stripe.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Booster Votes ── */}
            {currentPlan && (
                <div style={{ marginTop: '8px' }}>

                    {/* Section header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 16px rgba(245,158,11,0.35)' }}>
                            <Zap size={20} color="white" fill="white" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Voting Power Boosts</h2>
                            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>One-time packs · <strong>no daily limit</strong> · votes never expire</p>
                        </div>
                    </div>

                    {/* Current balance card */}
                    {boosterRemaining > 0 ? (
                        <div style={{
                            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                            border: '1.5px solid #fbbf24',
                            borderRadius: '20px',
                            padding: '20px 24px',
                            marginBottom: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: '0 8px 32px rgba(245,158,11,0.18)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 20px rgba(245,158,11,0.45)' }}>
                                    <Zap size={24} color="white" fill="white" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Current Booster Balance</div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                        <span style={{ fontSize: '40px', fontWeight: 900, color: 'white', lineHeight: 1 }}>{boosterRemaining}</span>
                                        <span style={{ fontSize: '15px', color: '#94a3b8', fontWeight: 500 }}>vote{boosterRemaining !== 1 ? 's' : ''} ready</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '20px', padding: '4px 12px', marginBottom: '6px', whiteSpace: 'nowrap' }}>
                                    No Daily Limit
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>Use anytime · never expire</div>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            background: '#f8fafc',
                            border: '1.5px dashed #e2e8f0',
                            borderRadius: '16px',
                            padding: '18px 20px',
                            marginBottom: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}>
                            <Zap size={18} color="#94a3b8" />
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#475569' }}>No booster votes yet</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Purchase a pack below to vote beyond your daily limit — anytime, no restrictions.</div>
                            </div>
                        </div>
                    )}

                    {/* Purchase packs */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {VOTE_PACKS.map(pack => (
                            <div
                                key={pack.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    padding: '28px 22px',
                                    border: pack.popular ? '2px solid #f59e0b' : '1.5px solid #f1f5f9',
                                    boxShadow: pack.popular ? '0 8px 28px rgba(245,158,11,0.14)' : '0 2px 8px rgba(0,0,0,0.03)',
                                    position: 'relative',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    cursor: 'default',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = pack.popular ? '0 16px 40px rgba(245,158,11,0.22)' : '0 12px 32px rgba(0,0,0,0.08)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.transform = 'none';
                                    (e.currentTarget as HTMLElement).style.boxShadow = pack.popular ? '0 8px 28px rgba(245,158,11,0.14)' : '0 2px 8px rgba(0,0,0,0.03)';
                                }}
                            >
                                {pack.popular && (
                                    <div style={{
                                        position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                        color: 'white', fontSize: '11px', fontWeight: 800,
                                        padding: '4px 14px', borderRadius: '20px',
                                        textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap',
                                    }}>
                                        Best Value
                                    </div>
                                )}

                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '14px',
                                    background: pack.popular
                                        ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                                        : 'linear-gradient(135deg, #fef9c3, #fde68a)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '16px',
                                    boxShadow: pack.popular ? '0 6px 16px rgba(245,158,11,0.35)' : 'none',
                                }}>
                                    <Zap size={22} color={pack.popular ? 'white' : '#d97706'} fill={pack.popular ? 'white' : 'none'} />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '2px' }}>
                                    <span style={{ fontSize: '42px', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>+{pack.votes}</span>
                                </div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b', marginBottom: '10px' }}>booster votes</div>

                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{pack.label}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <CheckCircle2 size={12} color="#16a34a" /> {pack.description}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '18px' }}>
                                    <span style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a' }}>${pack.price.toFixed(0)}</span>
                                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>one-time</span>
                                </div>

                                <button
                                    onClick={() => handleBuyVotes(pack)}
                                    disabled={buyingPack === pack.id}
                                    style={{
                                        width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
                                        background: buyingPack === pack.id
                                            ? '#94a3b8'
                                            : pack.popular
                                                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                                : '#0f172a',
                                        color: 'white', fontWeight: 700, fontSize: '14px',
                                        cursor: buyingPack === pack.id ? 'not-allowed' : 'pointer',
                                        fontFamily: 'inherit', transition: 'opacity 0.15s',
                                        boxShadow: buyingPack !== pack.id
                                            ? pack.popular
                                                ? '0 4px 14px rgba(245,158,11,0.4)'
                                                : '0 4px 14px rgba(15,23,42,0.15)'
                                            : 'none',
                                    }}
                                >
                                    {buyingPack === pack.id ? 'Redirecting…' : `Buy ${pack.votes} Votes — $${pack.price.toFixed(0)}`}
                                </button>
                            </div>
                        ))}
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#94a3b8' }}>
                        80% goes directly to charities · Booster votes never expire · Secure checkout via Stripe
                    </p>
                </div>
            )}
        </div>
    );
}

function SinglePlanCard({ cfg, planKey, isActive, upgrading, onUpgrade }: {
    cfg: typeof PLAN_CONFIG[PlanKey];
    planKey: PlanKey;
    isActive: boolean;
    upgrading: boolean;
    onUpgrade: () => void;
}) {
    return (
        <div style={{
            background: isActive ? 'linear-gradient(145deg, #0f172a, #1e293b)' : 'white',
            borderRadius: '24px',
            padding: '28px 24px',
            border: isActive ? '2px solid #dc2626' : '2px solid #f1f5f9',
            boxShadow: isActive ? '0 20px 60px rgba(220,38,38,0.18)' : '0 4px 20px rgba(0,0,0,0.06)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* decorative glow */}
            {isActive && (
                <div style={{
                    position: 'absolute', top: '-60px', right: '-60px',
                    width: '180px', height: '180px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(220,38,38,0.25) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
            )}

            {isActive && (
                <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    color: 'white', fontSize: '11px', fontWeight: 800,
                    padding: '4px 12px', borderRadius: '20px',
                    textTransform: 'uppercase', letterSpacing: '0.8px',
                }}>
                    Active
                </div>
            )}

            <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: isActive ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'linear-gradient(135deg, #fef2f2, #fecdd3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '18px',
                boxShadow: isActive ? '0 8px 20px rgba(220,38,38,0.4)' : 'none',
            }}>
                <Trophy size={22} color={isActive ? 'white' : '#dc2626'} />
            </div>

            <div style={{ fontSize: '20px', fontWeight: 800, color: isActive ? 'white' : '#0f172a', marginBottom: '6px' }}>
                {cfg.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontSize: '38px', fontWeight: 900, color: isActive ? 'white' : '#0f172a', lineHeight: 1 }}>${cfg.price}</span>
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>/month</span>
            </div>
            <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: isActive ? 'rgba(255,255,255,0.08)' : '#f8fafc',
                borderRadius: '20px', padding: '5px 12px', marginBottom: '20px',
            }}>
                <Vote size={13} color={isActive ? '#cbd5e1' : '#475569'} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: isActive ? '#cbd5e1' : '#475569' }}>
                    {cfg.votes} votes / cycle · 1 per day
                </span>
            </div>

            <div style={{ marginBottom: '20px' }}>
                {cfg.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '9px', fontSize: '13px', color: isActive ? '#cbd5e1' : '#475569', alignItems: 'flex-start' }}>
                        <span style={{
                            width: '17px', height: '17px', borderRadius: '50%', flexShrink: 0,
                            background: isActive ? 'rgba(220,38,38,0.3)' : '#f0fdf4',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <CheckCircle2 size={11} color={isActive ? '#fca5a5' : '#16a34a'} />
                        </span>
                        {f}
                    </div>
                ))}
            </div>

            <button
                onClick={onUpgrade}
                disabled={isActive || upgrading}
                style={{
                    width: '100%', padding: '13px', borderRadius: '14px', border: 'none',
                    background: isActive
                        ? 'rgba(255,255,255,0.08)'
                        : upgrading
                            ? '#94a3b8'
                            : 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    color: isActive ? '#94a3b8' : 'white',
                    fontWeight: 700, fontSize: '14px',
                    cursor: isActive || upgrading ? 'default' : 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.2s',
                    boxShadow: !isActive && !upgrading ? '0 6px 20px rgba(220,38,38,0.35)' : 'none',
                    letterSpacing: '0.2px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
            >
                {isActive
                    ? <><CheckCircle2 size={15} color="#94a3b8" /> Current Plan</>
                    : upgrading
                        ? 'Processing…'
                        : `Subscribe — $${cfg.price}/mo`
                }
            </button>
        </div>
    );
}

export default function DashboardSubscriptionPage() {
    return (
        <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading…</div>}>
            <SubscriptionContent />
        </Suspense>
    );
}
