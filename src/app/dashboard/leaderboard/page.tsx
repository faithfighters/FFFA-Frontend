'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Trophy, CreditCard, Vote, Search, Crown, DollarSign, Flame, Award } from 'lucide-react';
import styles from './page.module.css';

interface Member {
    id: string;
    name: string;
    email: string;
    role: string;
    plan?: 'faith_fighter' | 'faith_hero' | 'faith_builder' | string;
    votesTotal: number;
    votesCast: number;
    subscription?: {
        plan: string;
        amount: number;
        status: string;
    } | null;
}

export default function DashboardLeaderboardPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<'donations' | 'votes'>('donations');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('/api/leaderboard/members', { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => setMembers(data.members || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const getMemberDonationAmount = (member: Member): number => {
        if (member.subscription?.status === 'active') return member.subscription.amount;
        if (member.plan === 'faith_fighter') return 100;
        if (member.plan === 'faith_hero') return 50;
        if (member.plan === 'faith_builder') return 25;
        return 0;
    };

    const getPlanBadge = (plan?: string) => {
        switch (plan) {
            case 'faith_fighter':
                return { label: 'Faith Fighter', bg: 'linear-gradient(135deg, #7f1d1d, #dc2626)', color: '#ffffff' };
            case 'faith_hero':
                return { label: 'Faith Hero', bg: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', color: '#ffffff' };
            case 'faith_builder':
                return { label: 'Faith Builder', bg: 'linear-gradient(135deg, #4c1d95, #8b5cf6)', color: '#ffffff' };
            default:
                return { label: 'Member', bg: '#f1f5f9', color: '#64748b' };
        }
    };

    const sortedMembers = [...members]
        .map((member) => ({ ...member, donationAmount: getMemberDonationAmount(member) }))
        .sort((a, b) => {
            if (activeCategory === 'donations') {
                return b.donationAmount - a.donationAmount || b.votesCast - a.votesCast;
            }
            return b.votesCast - a.votesCast || b.donationAmount - a.donationAmount;
        })
        .filter((member) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const topThree = sortedMembers.slice(0, 3);

    const getInitials = (name: string) =>
        name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

    if (loading) {
        return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading leaderboard data...</div>;
    }

    const tabStyle = (active: boolean): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        border: 'none',
        borderBottom: active ? '2px solid #ef4444' : '2px solid transparent',
        background: 'transparent',
        color: active ? '#ef4444' : '#64748b',
        fontWeight: 800,
        cursor: 'pointer',
        fontFamily: 'inherit',
    });

    return (
        <div>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Trophy size={28} color="#ef4444" />
                        Community Leaderboard
                    </h1>
                    <p style={{ color: '#64748b' }}>Honoring FaithFighters who drive change through generous donations and active voting.</p>
                </div>

                <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 16px 10px 40px',
                            border: '1.5px solid #e2e8f0',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            background: 'white',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                            fontFamily: 'inherit',
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', borderBottom: '1px solid #fee2e2' }}>
                <button type="button" style={tabStyle(activeCategory === 'donations')} onClick={() => setActiveCategory('donations')}>
                    <CreditCard size={16} />
                    Donations Leaderboard
                </button>
                <button type="button" style={tabStyle(activeCategory === 'votes')} onClick={() => setActiveCategory('votes')}>
                    <Vote size={16} />
                    Votes Leaderboard
                </button>
            </div>

            {sortedMembers.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '24px', marginBottom: '48px', flexWrap: 'wrap', padding: '24px 0' }}>
                    {topThree[1] && <PodiumMember member={topThree[1]} rank={2} activeCategory={activeCategory} getInitials={getInitials} />}
                    {topThree[0] && <PodiumMember member={topThree[0]} rank={1} activeCategory={activeCategory} getInitials={getInitials} />}
                    {topThree[2] && <PodiumMember member={topThree[2]} rank={3} activeCategory={activeCategory} getInitials={getInitials} />}
                </div>
            )}

            <div style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
                    Full Standing Rankings
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sortedMembers.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', backgroundColor: 'white', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                            No standing results found.
                        </div>
                    )}
                    {sortedMembers.map((member, index) => (
                        <StandingRow
                            key={member.id}
                            member={member}
                            index={index}
                            badge={getPlanBadge(member.plan)}
                            activeCategory={activeCategory}
                            getInitials={getInitials}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function PodiumMember({
    member,
    rank,
    activeCategory,
    getInitials,
}: {
    member: Member & { donationAmount: number };
    rank: 1 | 2 | 3;
    activeCategory: 'donations' | 'votes';
    getInitials: (name: string) => string;
}) {
    const rankTheme = {
        1: { size: 100, bg: '#fef3c7', border: '#fbbf24', color: '#b45309', podium: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)', height: 140, width: 220 },
        2: { size: 80, bg: '#e2e8f0', border: '#cbd5e1', color: '#475569', podium: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)', height: 110, width: 200 },
        3: { size: 80, bg: '#ffedd5', border: '#fdba74', color: '#c2410c', podium: 'linear-gradient(180deg, #ffedd5 0%, #fed7aa 100%)', height: 90, width: 200 },
    }[rank];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: rankTheme.width, transform: rank === 1 ? 'translateY(-16px)' : 'none' }}>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
                {rank === 1 && <div style={{ position: 'absolute', top: '-28px', left: '50%', transform: 'translateX(-50%)' }}><Crown size={28} color="#f59e0b" /></div>}
                <div style={{
                    width: rankTheme.size,
                    height: rankTheme.size,
                    borderRadius: '50%',
                    backgroundColor: rankTheme.bg,
                    border: `${rank === 1 ? 4 : 3}px solid ${rankTheme.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: rank === 1 ? '24px' : '20px',
                    color: rankTheme.color,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                }}>
                    {getInitials(member.name)}
                </div>
                <span style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    width: rank === 1 ? '30px' : '26px',
                    height: rank === 1 ? '30px' : '26px',
                    borderRadius: '50%',
                    backgroundColor: rankTheme.border,
                    color: rankTheme.color,
                    fontWeight: 800,
                    fontSize: rank === 1 ? '14px' : '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: rank === 1 ? '3px solid white' : '2px solid white',
                }}>{rank}</span>
            </div>
            <div style={{ fontWeight: rank === 1 ? 800 : 700, color: rank === 1 ? '#0f172a' : '#1e293b', fontSize: rank === 1 ? '16px' : '15px', textAlign: 'center', marginBottom: '4px' }}>{member.name}</div>
            <div style={{ fontSize: rank === 1 ? '16px' : '14px', fontWeight: 800, color: activeCategory === 'donations' ? '#dc2626' : '#10b981' }}>
                {activeCategory === 'donations' ? `$${member.donationAmount}/mo` : `${member.votesCast} Votes`}
            </div>
            <div style={{ height: rankTheme.height, width: '100%', background: rankTheme.podium, borderRadius: '16px 16px 0 0', marginTop: '16px', border: `1px solid ${rankTheme.border}`, borderBottom: 'none' }} />
        </div>
    );
}

function StandingRow({
    member,
    index,
    badge,
    activeCategory,
    getInitials,
}: {
    member: Member & { donationAmount: number };
    index: number;
    badge: { label: string; bg: string; color: string };
    activeCategory: 'donations' | 'votes';
    getInitials: (name: string) => string;
}) {
    const isTopThree = index < 3;
    const rankColor = index === 0 ? '#fbbf24' : index === 1 ? '#64748b' : index === 2 ? '#b45309' : '#94a3b8';

    return (
        <div className={styles.standingRow} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            backgroundColor: isTopThree ? 'rgba(255, 255, 255, 0.9)' : '#ffffff',
            border: isTopThree ? `2.5px solid ${index === 0 ? '#fde68a' : index === 1 ? '#cbd5e1' : '#fed7aa'}` : '1.5px solid #e2e8f0',
            borderRadius: '20px',
            padding: '16px 28px',
            boxShadow: isTopThree ? '0 8px 30px rgba(0, 0, 0, 0.04)' : '0 4px 12px rgba(0, 0, 0, 0.02)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {isTopThree && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', backgroundColor: index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : '#ea580c' }} />
            )}

            <div className={styles.memberInfo} style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '18px', fontWeight: 900, width: '65px', textAlign: 'left', color: rankColor, fontFamily: 'monospace', flexShrink: 0 }}>
                    {index === 0 ? <><Trophy size={16} color="#fbbf24" style={{ marginRight: '4px' }} />1</> : index === 1 ? <><Award size={16} color="#94a3b8" style={{ marginRight: '4px' }} />2</> : index === 2 ? <><Award size={16} color="#b45309" style={{ marginRight: '4px' }} />3</> : `#${index + 1}`}
                </div>

                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: index === 0
                        ? 'radial-gradient(circle, #fef3c7 0%, #fbbf24 100%)'
                        : index === 1
                        ? 'radial-gradient(circle, #f1f5f9 0%, #cbd5e1 100%)'
                        : index === 2
                        ? 'radial-gradient(circle, #ffedd5 0%, #fdba74 100%)'
                        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    color: index === 0 ? '#78350f' : index === 1 ? '#334155' : index === 2 ? '#7c2d12' : '#64748b',
                    border: `2px solid ${index === 0 ? '#fbbf24' : index === 1 ? '#cbd5e1' : index === 2 ? '#fdba74' : '#cbd5e1'}`,
                    fontWeight: 800,
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {getInitials(member.name)}
                </div>

                <div className={styles.memberNameBlock} style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.email}</div>
                </div>
            </div>

            <div className={styles.statsWrap} style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                <StatPill
                    label="Donations"
                    value={`$${member.donationAmount}/mo`}
                    icon={<DollarSign size={16} />}
                    active={activeCategory === 'donations'}
                    tone="red"
                />
                <StatPill
                    label="Votes Cast"
                    value={`${member.votesCast} Votes`}
                    icon={<Flame size={16} />}
                    active={activeCategory === 'votes'}
                    tone="green"
                />
            </div>
        </div>
    );
}

function StatPill({ label, value, icon, active, tone }: { label: string; value: string; icon: React.ReactNode; active: boolean; tone: 'red' | 'green' }) {
    const isRed = tone === 'red';
    return (
        <div style={{
            backgroundColor: isRed ? '#fff5f5' : '#f0fdf4',
            border: `1px solid ${active ? (isRed ? '#fca5a5' : '#86efac') : (isRed ? '#fee2e2' : '#dcfce7')}`,
            borderRadius: '14px',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '145px',
            boxShadow: active ? `0 4px 12px ${isRed ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)'}` : 'none',
            transform: active ? 'scale(1.05)' : 'none',
            transition: 'all 0.2s',
        }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
            <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: isRed ? '#991b1b' : '#166534', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: isRed ? '#dc2626' : '#16a34a' }}>{value}</div>
            </div>
        </div>
    );
}
