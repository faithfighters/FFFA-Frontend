'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { PLAN_CONFIG, PlanKey } from '@/lib/types';
import { Camera, CheckCircle2, ChevronRight, Trophy, CreditCard, Calendar, BarChart2, HelpCircle, LogOut, Users, Folder, Activity, Video } from 'lucide-react';
import { haptics } from '@/lib/haptics';
import OtpInput from '@/components/shared/OtpInput';

export default function DashboardProfilePage() {
    const { user, refreshUser, logout } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => { if (user) setName(user.name || ''); }, [user]);

    useEffect(() => {
        if (!otpSent || timer <= 0) return;
        const interval = setInterval(() => setTimer(p => p - 1), 1000);
        return () => clearInterval(interval);
    }, [otpSent, timer]);

    if (!user) return null;

    const firstName = user.name?.split(' ')[0] || '';
    const plan = user.plan ? PLAN_CONFIG[user.plan as PlanKey] : null;
    const boosterRemaining = user.boosterVotesRemaining ?? 0;
    const planVotesRemaining = user.votesRemaining ?? 0;
    const votesTotal = user.votesTotal ?? 0;

    const votesRemaining = planVotesRemaining + boosterRemaining;
    const votesCast = Math.max(0, votesTotal - planVotesRemaining);
    const memberSince = user.joinedAt
        ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
        : '—';

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
        if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB.'); return; }

        setSuccess(''); setError(''); setUploadingPhoto(true);
        try {
            const presignRes = await fetch('/api/upload/presign', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({ contentType: file.type, fileSizeBytes: file.size, folder: 'avatars' }),
            });
            if (!presignRes.ok) throw new Error('Failed to get upload URL.');
            const { uploadUrl, publicUrl } = await presignRes.json();
            const uploadRes = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
            if (!uploadRes.ok) throw new Error('Upload failed.');
            const updateRes = await fetch('/api/auth/update-profile', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({ image: publicUrl }),
            });
            if (!updateRes.ok) { const d = await updateRes.json(); throw new Error(d.message || 'Failed to save photo.'); }
            await refreshUser();
            setSuccess('Profile photo updated!');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setUploadingPhoto(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        setSubmitting(true); setSuccess(''); setError(''); haptics.tap();
        try {
            const res = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user.email }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to resend code.');
            setTimer(60); setOtpCode(''); setSuccess('Verification code resent.');
        } catch (err: unknown) {
            haptics.error(); setError(err instanceof Error ? err.message : 'Failed to resend code.');
        } finally { setSubmitting(false); }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(''); setError(''); haptics.tap();
        if (!name.trim()) { haptics.error(); setError('Name cannot be empty.'); return; }

        if (password) {
            if (!currentPassword) { haptics.error(); setError('Current password is required.'); return; }
            if (password.length < 8) { haptics.error(); setError('Password must be at least 8 characters.'); return; }
            if (password !== confirmPassword) { haptics.error(); setError('Passwords do not match.'); return; }

            if (!otpSent) {
                setSubmitting(true);
                try {
                    const res = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user.email }) });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || 'Failed to send code.');
                    setOtpSent(true); setTimer(60); setSuccess('Verification code sent to your email.');
                } catch (err: unknown) {
                    haptics.error(); setError(err instanceof Error ? err.message : 'Failed to send OTP.');
                } finally { setSubmitting(false); }
                return;
            }
            if (otpCode.length < 6) { haptics.error(); setError('Please enter the 6-digit code.'); return; }
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/auth/update-profile', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({ name: name.trim(), ...(password ? { password, currentPassword, otpCode } : {}) }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Update failed.');
            await refreshUser(); haptics.success();
            setSuccess('Profile updated!');
            setPassword(''); setConfirmPassword(''); setCurrentPassword(''); setOtpCode(''); setOtpSent(false);
            setShowEditForm(false);
        } catch (err: unknown) {
            haptics.error(); setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally { setSubmitting(false); }
    };

    const menuItems = [
        { icon: <Folder size={18} />, label: 'My Campaigns', href: '/dashboard/campaigns' },
        { icon: <Activity size={18} />, label: 'Activity History', href: '/dashboard/activities' },
        { icon: <Trophy size={18} />, label: 'Leaderboard', href: '/dashboard/leaderboard' },
        { icon: <Video size={18} />, label: 'Submit Video', href: '/dashboard/submit' },
        { icon: <Calendar size={18} />, label: 'Events & Sponsors', href: '/dashboard/events' },
        { icon: <CreditCard size={18} />, label: 'Payment Methods', href: '/dashboard/subscription' },
        { icon: <HelpCircle size={18} />, label: 'Help & Support', href: '/dashboard/activities' },
    ];

    const LogoutButton = () => (
        <button onClick={async () => { haptics.warning(); await logout(); router.replace('/'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '16px 18px', background: 'rgba(231,66,27,0.08)', border: '1px solid rgba(231,66,27,0.2)', borderRadius: '16px', color: '#ff7b5a', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
        >
            <LogOut size={18} />Log Out
        </button>
    );

    return (
        <div className="profile-container">
            <style>{`
                .profile-container {
                    width: 100%;
                    max-width: 1100px;
                    margin: 0 auto;
                    padding-bottom: 40px;
                }
                .profile-title-section {
                    margin-bottom: 32px;
                }
                .profile-title {
                    font-size: 28px;
                    font-weight: 800;
                    color: #ffffff;
                    margin-bottom: 8px;
                }
                .profile-subtitle {
                    color: rgba(255, 255, 255, 0.45);
                    font-size: 14px;
                }
                .profile-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 24px;
                    align-items: start;
                }
                @media (min-width: 860px) {
                    .profile-grid {
                        grid-template-columns: 1fr 1.2fr;
                    }
                }
                .profile-left-col {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .profile-right-col {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .desktop-logout {
                    display: none;
                }
                .mobile-logout {
                    display: block;
                    margin-top: 12px;
                }
                @media (min-width: 860px) {
                    .desktop-logout {
                        display: block;
                    }
                    .mobile-logout {
                        display: none;
                    }
                }
            `}</style>

            {/* Page header */}
            <div className="profile-title-section">
                <h1 className="profile-title">Profile</h1>
                <p className="profile-subtitle">Manage your personal details, security settings, and subscription plans.</p>
            </div>

            <div className="profile-grid">
                <div className="profile-left-col">
                    {/* Avatar + name */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(19, 17, 28, 0.45)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '20px', padding: '24px 20px 20px' }}>
                        <div
                            onClick={() => !uploadingPhoto && fileInputRef.current?.click()}
                            style={{
                                position: 'relative', width: '90px', height: '90px', borderRadius: '50%',
                                cursor: 'pointer', marginBottom: '14px',
                                border: '3px solid #E7421B',
                                boxShadow: '0 0 0 3px rgba(231,66,27,0.25), 0 8px 24px rgba(0,0,0,0.4)',
                                overflow: 'hidden',
                                background: 'linear-gradient(135deg, rgba(248,195,143,0.2), rgba(231,66,27,0.2))',
                            }}
                        >
                            {user.image ? (
                                <img src={user.image} alt={firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px', fontWeight: 800, background: 'linear-gradient(135deg, #F8C38F, #E7421B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    {firstName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: uploadingPhoto ? 1 : 0, transition: 'opacity 0.2s', color: 'white', fontSize: '11px', fontWeight: 600, gap: '4px' }}
                                onMouseEnter={e => { if (!uploadingPhoto) (e.currentTarget.style.opacity = '1'); }}
                                onMouseLeave={e => { if (!uploadingPhoto) (e.currentTarget.style.opacity = '0'); }}
                            >
                                <Camera size={16} />{uploadingPhoto ? 'Uploading…' : 'Change'}
                            </div>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '2px' }}>{user.name}</div>
                    </div>

                    {/* Stats row */}
                    <div style={{
                        display: 'flex',
                        background: 'rgba(19, 17, 28, 0.45)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        padding: '12px 0'
                    }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '8px' }}>
                            <Users size={20} color="#ff7b5a" style={{ marginBottom: '8px' }} />
                            <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginBottom: '4px', lineHeight: 1.1 }}>
                                {votesRemaining}/{votesTotal}
                            </div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                Votes Remain
                            </div>
                        </div>

                        <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.08)', alignSelf: 'stretch' }} />

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '8px' }}>
                            <Trophy size={20} color="#fbbf24" style={{ marginBottom: '8px' }} />
                            <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginBottom: '4px', lineHeight: 1.1 }}>
                                {votesCast}
                            </div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                Votes Casted
                            </div>
                        </div>

                        <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.08)', alignSelf: 'stretch' }} />

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '8px' }}>
                            <Calendar size={20} color="#4ade80" style={{ marginBottom: '8px' }} />
                            <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginBottom: '4px', lineHeight: 1.1 }}>
                                {memberSince}
                            </div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                Member Since
                            </div>
                        </div>
                    </div>

                    {/* Fighter Plan card */}
                    <div style={{ background: 'linear-gradient(135deg, rgba(248,195,143,0.06) 0%, rgba(231,66,27,0.1) 100%)', border: '1px solid rgba(231,66,27,0.2)', borderRadius: '16px', padding: '20px 20px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                                    {plan ? `${plan.name} — $${plan.price}/Mo` : 'No Active Plan'}
                                </div>
                                {plan && (
                                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginTop: '4px' }}>
                                        Renews monthly · {votesTotal} votes added monthly
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => { haptics.tap(); router.push('/dashboard/subscription'); }}
                                style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)', color: '#fff', border: 'none', borderRadius: '50px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(231,66,27,0.4)' }}
                            >
                                Buy extra votes
                            </button>
                            <button
                                onClick={() => { haptics.tap(); router.push('/dashboard/subscription'); }}
                                style={{ flex: 1, padding: '11px', background: 'transparent', color: 'rgba(255,255,255,0.8)', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '50px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
                            >
                                Manage plan
                            </button>
                        </div>
                    </div>

                    {/* Desktop Logout Button */}
                    <div className="desktop-logout">
                        <LogoutButton />
                    </div>
                </div>

                <div className="profile-right-col">
                    {/* Edit profile toggle */}
                    <button
                        onClick={() => setShowEditForm(v => !v)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', background: 'rgba(19, 17, 28, 0.45)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', color: '#ffffff', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                        <span>Edit Profile</span>
                        <ChevronRight size={16} color="rgba(255,255,255,0.3)" style={{ transform: showEditForm ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>

                    {showEditForm && (
                        <form onSubmit={handleSave} style={{ background: 'rgba(19, 17, 28, 0.45)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Full Name</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" disabled={submitting}
                                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#ffffff', background: 'rgba(255,255,255,0.04)' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Email</label>
                                    <input type="email" value={user?.email ?? ''} readOnly disabled
                                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.02)', cursor: 'not-allowed' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Current Password</label>
                                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Required to change password" disabled={submitting || otpSent}
                                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#ffffff', background: 'rgba(255,255,255,0.04)' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>New Password</label>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" disabled={submitting || otpSent}
                                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#ffffff', background: 'rgba(255,255,255,0.04)' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
                                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" disabled={submitting || otpSent}
                                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#ffffff', background: 'rgba(255,255,255,0.04)' }} />
                                </div>

                                {otpSent && (
                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px', textAlign: 'center' }}>Verification Code</label>
                                        <OtpInput value={otpCode} onChange={setOtpCode} disabled={submitting} error={!!error} />
                                        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12.5px', color: 'rgba(255,255,255,0.5)' }}>
                                            {timer > 0 ? <span>Resend in <strong style={{ color: '#ffffff' }}>{timer}s</strong></span>
                                                : <button type="button" onClick={handleResendOtp} disabled={submitting} style={{ background: 'none', border: 'none', color: '#F8C38F', fontWeight: 700, cursor: 'pointer', padding: '4px', fontFamily: 'inherit' }}>Resend Code</button>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {success && <div style={{ marginTop: '14px', padding: '10px 14px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '10px', color: '#4ade80', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} />{success}</div>}
                            {error && <div style={{ marginTop: '14px', padding: '10px 14px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.35)', borderRadius: '10px', color: '#f87171', fontSize: '13px', fontWeight: 600 }}>{error}</div>}

                            <button type="submit" disabled={submitting} style={{ marginTop: '16px', width: '100%', padding: '13px', background: 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '14px', fontFamily: 'inherit', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, boxShadow: '0 4px 14px rgba(231,66,27,0.35)' }}>
                                {submitting ? 'Saving…' : (otpSent ? 'Verify & Save Changes' : 'Save Changes')}
                            </button>
                        </form>
                    )}

                    {/* Menu Items Glass Box Container */}
                    <div style={{
                        background: 'rgba(19, 17, 28, 0.45)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        {menuItems.map(({ icon, label, href }, index) => {
                            let iconColor = 'rgba(255,255,255,0.45)';
                            if (label === 'My Campaigns') iconColor = '#f97316';
                            else if (label === 'Activity History') iconColor = '#3b82f6';
                            else if (label === 'Leaderboard') iconColor = '#fbbf24';
                            else if (label === 'Submit Video') iconColor = '#ec4899';
                            else if (label === 'Events & Sponsors') iconColor = '#a78bfa';
                            else if (label === 'Payment Methods') iconColor = '#10b981';
                            else if (label === 'Help & Support') iconColor = '#64748b';

                            return (
                                <div key={label}>
                                    <button
                                        onClick={() => { haptics.tap(); router.push(href); }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            padding: '16px 20px',
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#ffffff',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            fontFamily: 'inherit',
                                            textAlign: 'left',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <span style={{ color: iconColor, display: 'flex', alignItems: 'center' }}>
                                                {icon}
                                            </span>
                                            {label}
                                        </span>
                                        <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                                    </button>
                                    {index < menuItems.length - 1 && (
                                        <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.05)', marginLeft: '20px', marginRight: '20px' }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Mobile Logout Button */}
                    <div className="mobile-logout">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </div>
    );
}
