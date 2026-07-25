'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PLAN_CONFIG, PlanKey } from '@/lib/types';
import { Trophy, Vote, Zap, CheckCircle2, AlertCircle, TrendingUp, Calendar, Shield, X } from 'lucide-react';
import { haptics } from '@/lib/haptics';

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
    const router = useRouter();
    const votesAdded = searchParams.get('votes_added');
    const [sub, setSub] = useState<SubscriptionInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [buyingPack, setBuyingPack] = useState<string | null>(null);
    const [upgrading, setUpgrading] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(votesAdded ? `${votesAdded} vote${Number(votesAdded) > 1 ? 's' : ''} added to your account!` : '');
    const [cancelling, setCancelling] = useState(false);
    const inFlightRef = useRef(false);
    const [showCelebration, setShowCelebration] = useState(false);

    const fetchSub = () =>
        fetch('/api/subscription', { credentials: 'include' })
            .then(r => r.json())
            .then(data => setSub(data.subscription || null))
            .catch(() => setError('Failed to load subscription info. Please refresh.'))
            .finally(() => setLoading(false));

    useEffect(() => {
        fetchSub();
        if (votesAdded) {
            setShowCelebration(true);
            // Sync Stripe sessions first so booster votes are applied before refreshUser reads DB
            fetch('/api/stripe/sync', { method: 'POST', credentials: 'include' })
                .then(() => {
                    refreshUser();
                    router.replace('/dashboard/subscription');
                });
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
        haptics.warning();
        setCancelling(true);
        setError('');
        try {
            const res = await fetch('/api/subscription', { method: 'DELETE', credentials: 'include' });
            if (res.ok) {
                haptics.success();
                setSub(null);
                await refreshUser();
                setSuccess('Subscription cancelled successfully.');
            } else {
                haptics.error();
                setError('Could not cancel. Please contact support.');
            }
        } catch {
            haptics.error();
            setError('Network error. Please try again.');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: '#dc2626', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
            Loading subscription…
        </div>
    );

    const currentPlan = user?.plan as PlanKey | undefined;
    const planCfg = currentPlan ? PLAN_CONFIG[currentPlan] : null;
    const planVotesRemaining = user?.votesRemaining ?? 0;
    const boosterRemaining = user?.boosterVotesRemaining ?? 0;
    const planVotesTotal = planCfg?.votes ?? 30;

    const votesRemaining = planVotesRemaining + boosterRemaining;
    const votesTotal = planVotesTotal;
    const votesUsed = Math.max(0, planVotesTotal - planVotesRemaining);
    const usagePercent = planVotesTotal > 0 ? Math.round((votesUsed / planVotesTotal) * 100) : 0;

    return (
        <div>
            {/* SVG Defs for gradients */}
            <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
                <defs>
                    <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#E7421B" />
                        <stop offset="50%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#F8C38F" />
                    </linearGradient>
                </defs>
            </svg>

            {/* ── Page Header ── */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>Plans & Votes</h1>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Manage your membership and top up your donation votes.</p>
            </div>

            {/* ── Alerts ── */}
            {success && (
                <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', color: '#4ade80', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#4ade80" /> {success}
                </div>
            )}
            {error && (
                <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', color: '#f87171', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} color="#f87171" /> {error}
                </div>
            )}

            {/* ── Booster Votes (shown first — this is the purchase-driving CTA) ── */}
            {currentPlan && (
                <div style={{ marginBottom: '40px' }}>

                    {/* Section header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 16px rgba(245,158,11,0.35)' }}>
                            <Zap size={20} color="white" fill="white" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0 }}>Voting Power Boosts</h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>One-time packs · <strong>no daily limit</strong> · votes never expire</p>
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
                                        <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>vote{boosterRemaining !== 1 ? 's' : ''} ready</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '20px', padding: '4px 12px', marginBottom: '6px', whiteSpace: 'nowrap' }}>
                                    No Daily Limit
                                </div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Use anytime · never expire</div>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1.5px dashed rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            padding: '18px 20px',
                            marginBottom: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}>
                            <Zap size={18} color="rgba(255,255,255,0.4)" />
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>No booster votes yet</div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Purchase a pack below to vote beyond your daily limit — anytime, no restrictions.</div>
                            </div>
                        </div>
                    )}

                    {/* Purchase packs */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {VOTE_PACKS.map(pack => (
                            <div
                                key={pack.id}
                                style={{
                                    background: '#15131f',
                                    borderRadius: '20px',
                                    padding: '28px 22px',
                                    border: pack.popular ? '2px solid #f59e0b' : '1.5px solid rgba(255,255,255,0.08)',
                                    boxShadow: pack.popular ? '0 8px 28px rgba(245,158,11,0.14)' : '0 2px 8px rgba(0,0,0,0.2)',
                                    position: 'relative',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    cursor: 'default',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = pack.popular ? '0 16px 40px rgba(245,158,11,0.22)' : '0 12px 32px rgba(0,0,0,0.3)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.transform = 'none';
                                    (e.currentTarget as HTMLElement).style.boxShadow = pack.popular ? '0 8px 28px rgba(245,158,11,0.14)' : '0 2px 8px rgba(0,0,0,0.2)';
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
                                        : 'rgba(245,158,11,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '16px',
                                    boxShadow: pack.popular ? '0 6px 16px rgba(245,158,11,0.35)' : 'none',
                                }}>
                                    <Zap size={22} color={pack.popular ? 'white' : '#fbbf24'} fill={pack.popular ? 'white' : 'none'} />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '2px' }}>
                                    <span style={{ fontSize: '42px', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>+{pack.votes}</span>
                                </div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b', marginBottom: '10px' }}>booster votes</div>

                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>{pack.label}</div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <CheckCircle2 size={12} color="#4ade80" /> {pack.description}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '18px' }}>
                                    <span style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff' }}>${pack.price.toFixed(0)}</span>
                                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>one-time</span>
                                </div>

                                <button
                                    onClick={() => handleBuyVotes(pack)}
                                    disabled={buyingPack === pack.id}
                                    style={{
                                        width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
                                        background: buyingPack === pack.id
                                            ? 'rgba(255,255,255,0.1)'
                                            : pack.popular
                                                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                                : 'linear-gradient(135deg, #F8C38F, #E7421B)',
                                        color: 'white', fontWeight: 700, fontSize: '14px',
                                        cursor: buyingPack === pack.id ? 'not-allowed' : 'pointer',
                                        fontFamily: 'inherit', transition: 'opacity 0.15s',
                                        boxShadow: buyingPack !== pack.id
                                            ? pack.popular
                                                ? '0 4px 14px rgba(245,158,11,0.4)'
                                                : '0 4px 14px rgba(231,66,27,0.3)'
                                            : 'none',
                                    }}
                                >
                                    {buyingPack === pack.id ? 'Redirecting…' : `Buy ${pack.votes} Votes — $${pack.price.toFixed(0)}`}
                                </button>
                            </div>
                        ))}
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                        80% goes directly to charities · Booster votes never expire · Secure checkout via Stripe
                    </p>
                </div>
            )}

            {/* ── Two-column: Current Membership + Stats Sidebar ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px', alignItems: 'start' }}>
                {/* Left: Plan Card */}
                <div>
                    <div style={{ marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '2px' }}>
                            {currentPlan ? 'Your Membership' : 'Choose a Plan'}
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
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
                                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
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
                        <div style={{ background: '#15131f', borderRadius: '20px', padding: '24px', border: '1.5px solid rgba(255,255,255,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Vote Balance</div>
                                    <div style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
                                        {votesRemaining}
                                        <span style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', marginLeft: '6px' }}>/ {votesTotal}</span>
                                    </div>
                                </div>
                                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(231, 66, 27, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Vote size={24} stroke="url(#flameGradient)" />
                                </div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', height: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                                <div style={{
                                    height: '100%', borderRadius: '8px',
                                    background: usagePercent > 80 ? '#dc2626' : usagePercent > 50 ? '#f59e0b' : '#22c55e',
                                    width: `${Math.min(usagePercent, 100)}%`,
                                    transition: 'width 0.6s ease',
                                }} />
                            </div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                                {votesUsed} used · {votesRemaining} remaining ({planVotesRemaining} plan + {boosterRemaining} booster)
                            </div>
                        </div>
                    )}

                    {/* Impact Stats */}
                    <div style={{ background: 'linear-gradient(145deg, #0f172a, #1e293b)', borderRadius: '20px', padding: '24px', border: '1px solid #1e293b' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Your Impact</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {[
                                { icon: <TrendingUp size={16} color="#4ade80" />, label: 'To Charities', value: '80%', sub: 'of every dollar', show: true },
                                { icon: <Shield size={16} color="#60a5fa" />, label: 'Cause Votes', value: planCfg?.votes ?? 0, sub: 'votes / cycle', show: true },
                                { icon: <Zap size={16} color="#fbbf24" />, label: 'Booster Votes', value: boosterRemaining > 0 ? `+${boosterRemaining}` : 'None', sub: 'no daily limit', show: !!currentPlan },
                                { icon: <Calendar size={16} color="#f472b6" />, label: 'Billing', value: sub?.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Monthly', sub: 'renewal date', show: !!currentPlan },
                            ].filter(s => s.show).map(s => (
                                <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                        {s.icon}
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</span>
                                    </div>
                                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'white', lineHeight: 1, marginBottom: '2px' }}>{s.value}</div>
                                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{s.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trust line */}
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '14px 18px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Shield size={18} color="#4ade80" />
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.5 }}>
                            <strong>80% of all purchases</strong> go directly to community-voted charities. Secure checkout via Stripe.
                        </p>
                    </div>
                </div>
            </div>

            {showCelebration && (
                <PurchaseCelebrationModal 
                    onClose={() => setShowCelebration(false)} 
                    message={votesAdded ? `Your booster package of ${votesAdded} votes was successfully added to your balance!` : "Your membership subscription was successfully updated!"}
                />
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
            background: isActive
                ? 'linear-gradient(145deg, #1a1530, #221c3a) padding-box, linear-gradient(135deg, #F8C38F 0%, #E7421B 100%) border-box'
                : '#15131f',
            borderRadius: '24px',
            padding: '28px 24px',
            border: isActive ? '2px solid transparent' : '2px solid rgba(255,255,255,0.08)',
            boxShadow: isActive ? '0 20px 60px rgba(231, 66, 27, 0.22)' : '0 4px 20px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* decorative glow */}
            {isActive && (
                <div style={{
                    position: 'absolute', top: '-60px', right: '-60px',
                    width: '180px', height: '180px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(231, 66, 27, 0.3) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
            )}

            {isActive && (
                <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'linear-gradient(135deg, #F8C38F, #E7421B)',
                    color: 'white', fontSize: '11px', fontWeight: 800,
                    padding: '4px 12px', borderRadius: '20px',
                    textTransform: 'uppercase', letterSpacing: '0.8px',
                }}>
                    Active
                </div>
            )}

            <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: isActive ? 'linear-gradient(135deg, #F8C38F, #E7421B)' : 'rgba(231, 66, 27, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '18px',
                boxShadow: isActive ? '0 8px 20px rgba(231, 66, 27, 0.4)' : 'none',
            }}>
                <Trophy size={22} stroke={isActive ? 'white' : 'url(#flameGradient)'} color={isActive ? 'white' : undefined} />
            </div>

            <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                {cfg.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontSize: '38px', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>${cfg.price}</span>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>/month</span>
            </div>
            <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '20px', padding: '5px 12px', marginBottom: '20px',
            }}>
                <Vote size={13} color="rgba(255,255,255,0.6)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                    {cfg.votes} votes / cycle · use anytime
                </span>
            </div>

            <div style={{ marginBottom: '20px' }}>
                {cfg.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '9px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', alignItems: 'flex-start' }}>
                        <span style={{
                            width: '17px', height: '17px', borderRadius: '50%', flexShrink: 0,
                            background: 'rgba(34,197,94,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <CheckCircle2 size={11} color="#4ade80" />
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
                            ? 'rgba(255,255,255,0.1)'
                            : 'linear-gradient(135deg, #F8C38F, #E7421B)',
                    color: isActive ? 'rgba(255,255,255,0.4)' : 'white',
                    fontWeight: 700, fontSize: '14px',
                    cursor: isActive || upgrading ? 'default' : 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.2s',
                    boxShadow: !isActive && !upgrading ? '0 6px 20px rgba(231,66,27,0.35)' : 'none',
                    letterSpacing: '0.2px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
            >
                {isActive
                    ? <><CheckCircle2 size={15} color="rgba(255,255,255,0.4)" /> Current Plan</>
                    : upgrading
                        ? 'Processing…'
                        : `Subscribe — $${cfg.price}/mo`
                }
            </button>
        </div>
    );
}

function PurchaseCelebrationModal({ onClose, message }: { onClose: () => void; message: string }) {
    return (
        <div 
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                boxSizing: 'border-box'
            }}
            onClick={onClose}
        >
            <div 
                onClick={e => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '480px',
                    height: 'min(640px, 90vh)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    backgroundImage: 'url(/images/vote_celebration.svg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '48px 24px 32px',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
                    border: '1.5px solid rgba(255,255,255,0.08)',
                    animation: 'vpm_slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
                    boxSizing: 'border-box',
                    color: '#ffffff'
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '1.5px solid rgba(255,255,255,0.2)',
                        background: 'rgba(15,23,42,0.6)',
                        backdropFilter: 'blur(8px)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        zIndex: 10
                    }}
                >
                    <X size={18} />
                </button>

                {/* Top Section */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', textAlign: 'center' }}>
                    {/* Checkmark Circle Icon */}
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        border: '3px solid #ff7b5a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        background: 'rgba(255, 123, 90, 0.1)',
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff7b5a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 10px', color: '#ffffff', letterSpacing: '-0.5px' }}>
                        Purchase Successful!
                    </h2>

                    <p style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px', color: 'rgba(255,255,255,0.9)' }}>
                        Thank you for your <span style={{ color: '#ff7b5a' }}>contribution!</span>
                    </p>

                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5, padding: '0 12px' }}>
                        {message}
                    </p>
                </div>

                {/* Bottom Section */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '16px', zIndex: 10 }}>
                    {/* Supporting Card */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px 20px',
                        borderRadius: '16px',
                        background: 'rgba(15, 13, 23, 0.65)',
                        backdropFilter: 'blur(12px)',
                        border: '1.5px solid rgba(255, 255, 255, 0.08)',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}>
                        {/* Heart Icon Circle */}
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ff7b5a, #e7421b)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(231, 66, 27, 0.3)',
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'left' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                                Thank you for <span style={{ color: '#ff7b5a' }}>Supporting!</span>
                            </span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.3 }}>
                                Together we can bring hope and rebuild lives
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={onClose}
                        style={{
                            width: '100%',
                            padding: '14px 20px',
                            borderRadius: '50px',
                            background: 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 6px 20px rgba(231, 66, 27, 0.4)',
                            transition: 'transform 0.2s',
                        }}
                    >
                        Great!
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes vpm_slideUp { from { transform:translateY(24px);opacity:0 } to { transform:translateY(0);opacity:1 } }
            `}</style>
        </div>
    );
}

export default function DashboardSubscriptionPage() {
    return (
        <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading…</div>}>
            <SubscriptionContent />
        </Suspense>
    );
}
