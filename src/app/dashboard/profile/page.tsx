'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { PLAN_CONFIG, PlanKey } from '@/lib/types';
import { Camera, CheckCircle2, Vote, CreditCard, LogOut } from 'lucide-react';

export default function DashboardProfilePage() {
    const { user, refreshUser, logout } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) setName(user.name || '');
    }, [user]);

    if (!user) return null;

    const firstName = user.name?.split(' ')[0] || '';
    const plan = user.plan ? PLAN_CONFIG[user.plan as PlanKey] : null;

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
        if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB.'); return; }

        setSuccess(''); setError(''); setUploadingPhoto(true);
        try {
            const presignRes = await fetch('/api/upload/presign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ contentType: file.type, fileSizeBytes: file.size, folder: 'avatars' }),
            });
            if (!presignRes.ok) throw new Error('Failed to get upload URL.');
            const { uploadUrl, publicUrl } = await presignRes.json();

            const uploadRes = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
            if (!uploadRes.ok) throw new Error('Upload failed.');

            const updateRes = await fetch('/api/auth/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ image: publicUrl }),
            });
            if (!updateRes.ok) {
                const d = await updateRes.json();
                throw new Error(d.message || 'Failed to save profile photo.');
            }
            await refreshUser();
            setSuccess('Profile photo updated!');
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setUploadingPhoto(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(''); setError('');
        if (!name.trim()) { setError('Name cannot be empty.'); return; }
        if (password && password.length < 8) { setError('Password must be at least 8 characters.'); return; }
        if (password && password !== confirmPassword) { setError('Passwords do not match.'); return; }

        setSubmitting(true);
        try {
            const res = await fetch('/api/auth/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: name.trim(), ...(password ? { password } : {}) }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Update failed.');
            await refreshUser();
            setSuccess('Profile updated successfully!');
            setPassword(''); setConfirmPassword('');
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>My Profile</h1>
                <p style={{ color: '#64748b' }}>Update your account details and profile photo.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Left — avatar + info */}
                <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #f1f5f9' }}>
                    {/* Avatar */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
                        <div
                            onClick={() => !uploadingPhoto && fileInputRef.current?.click()}
                            style={{
                                position: 'relative', width: '96px', height: '96px',
                                borderRadius: '24px', overflow: 'hidden', cursor: 'pointer',
                                background: 'linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%)',
                                border: '2px solid #fecdd3', marginBottom: '12px',
                            }}
                        >
                            {user.image ? (
                                <img src={user.image} alt={firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 800, color: '#dc2626' }}>
                                    {firstName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            {/* Hover overlay */}
                            <div style={{
                                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                opacity: uploadingPhoto ? 1 : 0, transition: 'opacity 0.2s', color: 'white', fontSize: '12px', fontWeight: 600, gap: '4px',
                            }}
                                onMouseEnter={e => { if (!uploadingPhoto) (e.currentTarget.style.opacity = '1'); }}
                                onMouseLeave={e => { if (!uploadingPhoto) (e.currentTarget.style.opacity = '0'); }}
                            >
                                <Camera size={18} />
                                {uploadingPhoto ? 'Uploading…' : 'Change'}
                            </div>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
                        <div style={{ fontSize: '13px', color: '#94a3b8' }}>Click photo to change</div>
                    </div>

                    {/* Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { label: 'Name', value: user.name },
                            { label: 'Email', value: user.email },
                            { label: 'Role', value: user.role },
                            { label: 'Plan', value: plan?.name ?? 'No Plan' },
                            { label: 'Votes Remaining', value: `${user.votesRemaining ?? 0} / ${user.votesTotal ?? 0}` },
                            { label: 'Member Since', value: user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '—' },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#fafafa', borderRadius: '10px' }}>
                                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
                                <span style={{ fontSize: '13px', color: '#334155', fontWeight: 600, textTransform: 'capitalize' }}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — edit form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <form onSubmit={handleSave} style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #f1f5f9' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Edit Details</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Full Name</label>
                                <input
                                    type="text" value={name} onChange={e => setName(e.target.value)}
                                    placeholder="Your full name" disabled={submitting}
                                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#0f172a' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Email</label>
                                <input type="email" value={user.email} disabled
                                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #f1f5f9', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', background: '#f8fafc', color: '#94a3b8', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '4px' }}>
                                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>Leave password fields blank to keep current password</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <input
                                        type="password" value={password} onChange={e => setPassword(e.target.value)}
                                        placeholder="New password (min 8 chars)" disabled={submitting}
                                        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#0f172a' }}
                                    />
                                    <input
                                        type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password" disabled={submitting}
                                        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#0f172a' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {success && (
                            <div style={{ marginTop: '16px', padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', color: '#16a34a', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                <CheckCircle2 size={14} style={{ marginRight: 6, flexShrink: 0 }} />{success}
                            </div>
                        )}
                        {error && (
                            <div style={{ marginTop: '16px', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#dc2626', fontSize: '13px', fontWeight: 600 }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit" disabled={submitting}
                            style={{
                                marginTop: '20px', width: '100%', padding: '12px', background: '#dc2626', color: 'white',
                                border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '14px',
                                fontFamily: 'inherit', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
                            }}
                        >
                            {submitting ? 'Saving…' : 'Save Changes'}
                        </button>
                    </form>

                    {/* Quick actions */}
                    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', border: '1px solid #f1f5f9' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {[
                                { icon: <Vote size={14} />, label: 'Cast your votes', href: '/dashboard/vote' },
                                { icon: <CreditCard size={14} />, label: 'Manage subscription', href: '/dashboard/subscription' },
                            ].map(({ icon, label, href }) => (
                                <a key={href} href={href} onClick={e => { e.preventDefault(); router.push(href); }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 14px', background: '#fafafa', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#0f172a', textDecoration: 'none', border: '1px solid #f1f5f9' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#fff5f6'; e.currentTarget.style.borderColor = '#fecdd3'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                                >
                                    {icon}{label}
                                </a>
                            ))}
                            <button onClick={async () => { await logout(); router.replace('/'); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 14px', background: 'white', border: '1px solid #fee2e2', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#dc2626', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                                <LogOut size={14} />Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
