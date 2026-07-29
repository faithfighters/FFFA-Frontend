'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    source: string;
    status: string;
    createdAt: string;
}

const STATUS_OPTIONS = ['new', 'read', 'replied', 'closed'];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    new: { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa' },
    read: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
    replied: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
    closed: { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' },
};

export default function AdminMessagesPage() {
    const router = useRouter();
    const { user, isAdmin, isLoading } = useAuth();
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && (!user || !isAdmin)) {
            router.replace('/dashboard');
        }
    }, [user, isAdmin, isLoading, router]);

    useEffect(() => {
        if (!isAdmin) return;
        fetch('/api/contact', { credentials: 'include' })
            .then((r) => r.json())
            .then((d) => setMessages(d.messages || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [isAdmin]);

    const handleStatusChange = async (id: string, status: string) => {
        setUpdatingId(id);
        try {
            const res = await fetch(`/api/contact/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, status } : m)));
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
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: '0 0 4px' }}>Contact Messages</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 24px' }}>
                Messages submitted through the public Contact Us form.
            </p>

            {loading ? (
                <div style={{ padding: '24px', color: 'rgba(255,255,255,0.6)' }}>Loading…</div>
            ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#15131f', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Mail size={36} color="rgba(255,255,255,0.25)" style={{ marginBottom: '12px' }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, margin: 0 }}>No contact messages yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {messages.map((m) => {
                        const sc = STATUS_COLORS[m.status] || STATUS_COLORS.new;
                        return (
                            <div
                                key={m._id}
                                style={{
                                    background: '#15131f', borderRadius: '16px', padding: '18px 20px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    display: 'flex', flexDirection: 'column', gap: '10px',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{m.name}</div>
                                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{m.email}</div>
                                    </div>
                                    <span style={{
                                        display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                                        fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap',
                                        background: sc.bg, color: sc.color,
                                    }}>
                                        {m.status}
                                    </span>
                                </div>
                                {m.subject && (
                                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#F8C38F' }}>{m.subject}</div>
                                )}
                                <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>{m.message}</p>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                                    Received {new Date(m.createdAt).toLocaleDateString()}
                                </div>
                                <select
                                    value={m.status}
                                    disabled={updatingId === m._id}
                                    onChange={(e) => handleStatusChange(m._id, e.target.value)}
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
