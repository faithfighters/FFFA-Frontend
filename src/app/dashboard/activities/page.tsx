'use client';

import { useState, useEffect } from 'react';
import { Activity, Zap, Flame, Vote, Bell } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
}

export default function DashboardActivitiesPage() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<string>('all');

    useEffect(() => {
        fetch('/api/notifications', { credentials: 'include' })
            .then(r => r.json())
            .then(data => {
                const notifs = data.notifications || [];
                setActivities(notifs.map((n: { _id: string; type: string; title: string; message: string; createdAt: string; read: boolean }) => ({
                    id: n._id,
                    type: n.type,
                    title: n.title,
                    description: n.message,
                    timestamp: n.createdAt,
                    read: n.read,
                })));
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const filtered = activities.filter(act => {
        const matchesSearch = act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            act.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || act.type === activeTab;
        return matchesSearch && matchesTab;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'votes_added': return <Zap size={18} color="#f59e0b" />;
            case 'vote_cast': return <Vote size={18} color="#10b981" />;
            case 'video_approved': case 'video_rejected': return <Flame size={18} color="#ef4444" />;
            case 'cycle_closed': return <Activity size={18} color="#8b5cf6" />;
            default: return <Bell size={18} color="#64748b" />;
        }
    };

    const getBadgeStyle = (type: string): React.CSSProperties => {
        const map: Record<string, [string, string]> = {
            votes_added: ['#fffbeb', '#b45309'],
            vote_cast: ['#ecfdf5', '#047857'],
            video_approved: ['#f0fdf4', '#15803d'],
            video_rejected: ['#fef2f2', '#b91c1c'],
            cycle_closed: ['#f5f3ff', '#6d28d9'],
        };
        const [bg, color] = map[type] ?? ['#f8fafc', '#475569'];
        return { backgroundColor: bg, color };
    };

    const getRelativeTime = (ts: string) => {
        const diff = Date.now() - new Date(ts).getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days === 1) return 'Yesterday';
        return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const tabs: { key: string; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'votes_added', label: 'Votes Added' },
        { key: 'vote_cast', label: 'Vote Cast' },
        { key: 'video_approved', label: 'Approved' },
        { key: 'video_rejected', label: 'Rejected' },
        { key: 'cycle_closed', label: 'Cycle Closed' },
    ];

    const typeLabel: Record<string, string> = {
        votes_added: 'Votes Added',
        vote_cast: 'Vote Cast',
        video_approved: 'Approved',
        video_rejected: 'Rejected',
        cycle_closed: 'Cycle Closed',
    };

    if (loading) return (
        <div>
            <div style={{ height: '36px', width: '200px', borderRadius: '12px', background: '#f1f5f9', marginBottom: '8px' }} />
            <div style={{ height: '20px', width: '300px', borderRadius: '8px', background: '#f1f5f9', marginBottom: '28px' }} />
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px 24px', border: '1px solid #f1f5f9', marginBottom: '24px' }}>
                <div style={{ height: '42px', borderRadius: '12px', background: '#f1f5f9', marginBottom: '16px' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                    {[...Array(6)].map((_, i) => <div key={i} style={{ height: '32px', width: '80px', borderRadius: '20px', background: '#f1f5f9' }} />)}
                </div>
            </div>
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9' }}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px 0', borderBottom: i < 4 ? '1px solid #f8fafc' : 'none' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f1f5f9', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ height: '14px', width: '60%', borderRadius: '6px', background: '#f1f5f9', marginBottom: '8px' }} />
                            <div style={{ height: '12px', width: '40%', borderRadius: '6px', background: '#f1f5f9' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Community Activity</h1>
                <p style={{ color: '#64748b' }}>Recent actions across the FFFA community.</p>
            </div>

            {/* Search + tabs */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px 24px', border: '1px solid #f1f5f9', marginBottom: '24px' }}>
                <input
                    type="text"
                    placeholder="Search activities…"
                    aria-label="Search activities"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%', padding: '10px 16px', border: '1.5px solid #f1f5f9',
                        borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', outline: 'none',
                        marginBottom: '16px', boxSizing: 'border-box',
                    }}
                />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: '6px 16px', borderRadius: '20px', border: 'none',
                                background: activeTab === tab.key ? '#0f172a' : '#f8fafc',
                                color: activeTab === tab.key ? 'white' : '#64748b',
                                fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                                fontFamily: 'inherit',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Activity list */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f1f5f9' }}>
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No activity found.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {filtered.map(act => (
                            <div key={act.id} style={{
                                display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                                borderRadius: '12px', transition: 'background 0.15s',
                            }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#fef7f8')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                <div style={{
                                    width: '38px', height: '38px', background: '#f8fafc', borderRadius: '10px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid #f1f5f9', flexShrink: 0,
                                }}>
                                    {getIcon(act.type)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{act.title}</span>
                                        <span style={{
                                            ...getBadgeStyle(act.type),
                                            fontSize: '12px', fontWeight: 700, padding: '2px 8px',
                                            borderRadius: '6px',
                                        }}>
                                            {typeLabel[act.type] ?? act.type}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                                        {act.description}
                                    </div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', flexShrink: 0 }}>
                                    {getRelativeTime(act.timestamp)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
