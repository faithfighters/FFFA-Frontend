'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeartHandshake } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface VolunteerApplication {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    cityState: string;
    availability: string;
    role: string;
    source: string;
    status: string;
    createdAt: string;
}

const STATUS_OPTIONS = ['new', 'contacted', 'placed', 'closed'];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    new: { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa' },
    contacted: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
    placed: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
    closed: { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' },
};

export default function AdminVolunteersPage() {
    const router = useRouter();
    const { user, isAdmin, isLoading } = useAuth();
    const [applications, setApplications] = useState<VolunteerApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && (!user || !isAdmin)) {
            router.replace('/dashboard');
        }
    }, [user, isAdmin, isLoading, router]);

    useEffect(() => {
        if (!isAdmin) return;
        fetch('/api/volunteers', { credentials: 'include' })
            .then((r) => r.json())
            .then((d) => setApplications(d.applications || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [isAdmin]);

    const handleStatusChange = async (id: string, status: string) => {
        setUpdatingId(id);
        try {
            const res = await fetch(`/api/volunteers/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
            }
        } finally {
            setUpdatingId(null);
        }
    };

    if (isLoading || !isAdmin) {
        return <div style={{ padding: '24px', color: 'rgba(255,255,255,0.6)' }}>Loading…</div>;
    }

    return (
        <div style={{ padding: '20px 20px 40px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: '0 0 4px' }}>Volunteers</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 24px' }}>
                All volunteer applications submitted from the public site.
            </p>

            {loading ? (
                <div style={{ padding: '24px', color: 'rgba(255,255,255,0.6)' }}>Loading…</div>
            ) : applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#15131f', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <HeartHandshake size={36} color="rgba(255,255,255,0.25)" style={{ marginBottom: '12px' }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, margin: 0 }}>No volunteer applications yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {applications.map((a) => {
                        const sc = STATUS_COLORS[a.status] || STATUS_COLORS.new;
                        return (
                            <div
                                key={a._id}
                                style={{
                                    background: '#15131f', borderRadius: '16px', padding: '18px 20px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    display: 'flex', flexDirection: 'column', gap: '10px',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{a.name}</div>
                                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{a.email}{a.phone ? ` · ${a.phone}` : ''}</div>
                                    </div>
                                    <span style={{
                                        display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                                        fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap',
                                        background: sc.bg, color: sc.color,
                                    }}>
                                        {a.status}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                                    <span><b style={{ color: '#F8C38F' }}>Role:</b> {a.role}</span>
                                    <span><b style={{ color: '#F8C38F' }}>Availability:</b> {a.availability}</span>
                                    <span><b style={{ color: '#F8C38F' }}>Location:</b> {a.cityState}</span>
                                    <span>Applied {new Date(a.createdAt).toLocaleDateString()}</span>
                                </div>
                                <select
                                    value={a.status}
                                    disabled={updatingId === a._id}
                                    onChange={(e) => handleStatusChange(a._id, e.target.value)}
                                    style={{
                                        alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
                                        color: '#fff', padding: '8px 12px', fontSize: '13px', fontFamily: 'inherit',
                                    }}
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
