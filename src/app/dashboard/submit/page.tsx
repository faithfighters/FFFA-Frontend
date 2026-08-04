'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, CheckCircle, Target, Send, HeartHandshake, Hospital, Zap, Home, FileText } from 'lucide-react';
import { haptics } from '@/lib/haptics';
import styles from '../page.module.css';

const CAUSE_CATEGORIES = [
    'Veterans', 'Youth Programs', 'Food Security', 'Disaster Relief',
    'Healthcare', 'First Responders', 'Housing', 'Utility Assistance',
    'Medical Relief', 'Education', 'Poverty Alleviation', 'Other',
];

type BillType = 'hospital' | 'utility' | 'rent' | 'other' | '';

export default function DashboardSubmitPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const [activeCauses, setActiveCauses] = useState<{ id: string; name: string; category: string }[]>([]);
    const [causeMode, setCauseMode] = useState<'existing' | 'new'>('new');
    const [selectedExistingCauseId, setSelectedExistingCauseId] = useState('');
    const [causeName, setCauseName] = useState('');
    const [causeCategory, setCauseCategory] = useState('');
    const [causeGoal, setCauseGoal] = useState('');

    // ── Assistance request details ──
    const [beneficiaryName, setBeneficiaryName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [urgencyReason, setUrgencyReason] = useState('');
    const [submitterPhone, setSubmitterPhone] = useState('');
    const [submitterEmail, setSubmitterEmail] = useState('');
    const [billType, setBillType] = useState<BillType>('');
    const [institutionName, setInstitutionName] = useState('');
    const [billAddress, setBillAddress] = useState('');
    const [billPhone, setBillPhone] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [infoLoading, setInfoLoading] = useState(true);
    const [error, setError] = useState('');
    const [step, setStep] = useState('');

    useEffect(() => {
        fetch('/api/causes?status=active', { credentials: 'include' })
            .then(r => r.json())
            .then(data => {
                const causes = data.causes ?? [];
                setActiveCauses(causes);
                if (causes.length > 0) setCauseMode('existing');
            })
            .catch(() => {})
            .finally(() => setInfoLoading(false));
    }, []);

    const validateVideoDuration = (f: File): Promise<boolean> =>
        new Promise(resolve => {
            const url = URL.createObjectURL(f);
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                URL.revokeObjectURL(url);
                resolve(video.duration <= 60);
            };
            video.onerror = () => { URL.revokeObjectURL(url); resolve(true); }; // allow if can't read
            video.src = url;
        });

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files[0];
        if (!f) return;
        const ok = await validateVideoDuration(f);
        if (!ok) { setError('Video must be 1 minute or less.'); return; }
        setError('');
        setFile(f);
        setFileName(f.name);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const ok = await validateVideoDuration(f);
        if (!ok) { setError('Video must be 1 minute or less.'); e.target.value = ''; return; }
        setError('');
        setFile(f);
        setFileName(f.name);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        haptics.tap();
        if (!file) { haptics.error(); setError('Please select a video file.'); return; }
        if (!title.trim()) { haptics.error(); setError('Please enter a title.'); return; }
        if (causeMode === 'new' && (!causeName || !causeCategory)) { haptics.error(); setError('Please fill in cause name and category.'); return; }
        if (causeMode === 'existing' && !selectedExistingCauseId) { haptics.error(); setError('Please select an existing cause.'); return; }
        if (!beneficiaryName.trim()) { haptics.error(); setError('Please enter the name of the person or family in need.'); return; }
        if (!targetAmount || Number(targetAmount) <= 0) { haptics.error(); setError('Please enter a target funding amount.'); return; }
        if (!urgencyReason.trim()) { haptics.error(); setError('Please explain why this request is urgent.'); return; }
        if (!billType) { haptics.error(); setError('Please select a bill type.'); return; }
        if (!institutionName.trim()) { haptics.error(); setError('Please enter the institution/company name.'); return; }
        if (!billAddress.trim()) { haptics.error(); setError('Please enter the billing address.'); return; }
        if (!billPhone.trim()) { haptics.error(); setError('Please enter the billing phone number.'); return; }

        const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
        if (!allowedTypes.includes(file.type)) { setError('Please upload an MP4, MOV, WebM, or AVI file.'); return; }
        if (file.size > 200 * 1024 * 1024) { setError('File must be under 200MB.'); return; }

        setLoading(true);
        try {
            setStep('Uploading video…');
            const presignRes = await fetch('/api/upload/presign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ contentType: file.type, fileSizeBytes: file.size, folder: 'videos' }),
            });
            if (!presignRes.ok) throw new Error('Failed to get upload URL.');
            const { uploadUrl, publicUrl } = await presignRes.json();

            await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
                .then(r => { if (!r.ok) throw new Error('Storage upload failed.'); });

            setStep('Setting up cause…');
            let causeId: string | undefined;
            let resolvedTag = causeCategory;

            if (causeMode === 'existing') {
                causeId = selectedExistingCauseId;
                const found = activeCauses.find(c => c.id === selectedExistingCauseId);
                resolvedTag = found?.category || found?.name || '';
            } else if (causeMode === 'new' && causeName) {
                const causeRes = await fetch('/api/causes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        name: causeName,
                        description: description || causeName,
                        category: causeCategory,
                        goalAmount: causeGoal ? Number(causeGoal) : 0,
                    }),
                });
                if (!causeRes.ok) {
                    const err = await causeRes.json().catch(() => ({}));
                    throw new Error(err.message || 'Failed to create cause.');
                }
                const causeData = await causeRes.json();
                causeId = causeData.cause?.id ?? causeData.cause?._id?.toString();
                resolvedTag = causeCategory;
            }

            setStep('Saving video…');
            const body: Record<string, unknown> = {
                title, description, videoUrl: publicUrl, causeTag: resolvedTag,
                beneficiaryName, targetAmount: Number(targetAmount), urgencyReason,
                submitterPhone: submitterPhone || undefined,
                submitterEmail: submitterEmail || undefined,
            };
            if (causeId) body.causeId = causeId;
            if (billType) {
                body.paymentDestination = {
                    type: billType,
                    institutionName,
                    address: billAddress,
                    phone: billPhone,
                    accountNumber,
                };
            }

            const res = await fetch('/api/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const d = await res.json().catch(() => ({}));
                throw new Error(d.error || d.message || 'Submission failed.');
            }

            haptics.success();
            setSubmitted(true);
        } catch (err) {
            haptics.error();
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setLoading(false);
            setStep('');
        }
    };

    const resetForm = () => {
        setSubmitted(false);
        setTitle(''); setDescription(''); setFile(null); setFileName('');
        setCauseMode('existing'); setSelectedExistingCauseId('');
        setCauseName(''); setCauseCategory(''); setCauseGoal('');
        setBeneficiaryName(''); setTargetAmount(''); setUrgencyReason('');
        setSubmitterPhone(''); setSubmitterEmail('');
        setBillType(''); setInstitutionName(''); setBillAddress(''); setBillPhone(''); setAccountNumber('');
    };

    if (submitted) {
        return (
            <div>
                <div className={styles.pageHeader}>
                    <h1>Submit a Video</h1>
                    <p>Share a reel for a cause close to your heart.</p>
                </div>
                <div className={styles.successCard}>
                    <CheckCircle size={56} color="#16a34a" strokeWidth={1.5} />
                    <h2>Reel Submitted!</h2>
                    <p>Your reel has been submitted for review. It will be transcribed and checked automatically. Once approved it will appear in campaigns.</p>
                    <button onClick={resetForm} className={styles.submitBtn}>Submit Another Reel</button>
                </div>
            </div>
        );
    }

    if (infoLoading) {
        return (
            <div>
                <div className={styles.pageHeader}><h1>Submit a Video</h1><p>Share a reel for a cause close to your heart.</p></div>
                <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Loading…</div>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1>Submit a Video</h1>
                <p>Share a reel for a cause close to your heart — 1 minute or less.</p>
            </div>

            <form onSubmit={handleSubmit}>
                {error && <div className={styles.errorBanner}>{error}</div>}

                {/* ── Section 1: Video & Details ── */}
                <div className={styles.formCard}>
                    <h3>📹 Video Details</h3>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Video File *</label>
                        <div
                            className={styles.dropzone}
                            style={{ borderColor: isDragging ? '#E7421B' : file ? '#4ade80' : undefined, background: isDragging ? 'rgba(231, 66, 27, 0.08)' : file ? 'rgba(34,197,94,0.08)' : undefined }}
                            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <span className={styles.dropzoneIcon}>
                                <Upload size={28} color={file ? '#4ade80' : isDragging ? '#E7421B' : 'rgba(255,255,255,0.4)'} />
                            </span>
                            <p className={styles.dropzoneText} style={{ color: file ? '#4ade80' : undefined, fontWeight: file ? 600 : undefined }}>
                                {fileName || 'Drag & drop your video here, or click to browse'}
                            </p>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>MP4, MOV, WebM — max 1 minute · up to 200MB</p>
                        </div>
                        <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Title *</label>
                        <input className={styles.formInput} type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your reel a compelling title" required />
                    </div>

                    <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                        <label className={styles.formLabel}>Description</label>
                        <textarea className={styles.formTextarea} value={description} onChange={e => setDescription(e.target.value)} placeholder="Share the story behind this reel…" />
                    </div>
                </div>

                {/* ── Section 2: Cause ── */}
                <div className={styles.formCard}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={18} color="#E7421B" /> Linked Cause <span style={{ fontWeight: 500, color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>(members vote on this)</span></h3>

                    {activeCauses.length > 0 && (
                        <div className={styles.causeTabs}>
                            {(['existing', 'new'] as const).map(mode => (
                                <button
                                    key={mode}
                                    type="button"
                                    className={`${styles.causeTab} ${causeMode === mode ? styles.causeTabActive : ''}`}
                                    onClick={() => setCauseMode(mode)}
                                >
                                    {mode === 'existing' ? 'Link to existing cause' : '+ Create new cause'}
                                </button>
                            ))}
                        </div>
                    )}

                    {causeMode === 'existing' && activeCauses.length > 0 ? (
                        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                            <label className={styles.formLabel}>Select Cause *</label>
                            <select className={styles.formSelect} value={selectedExistingCauseId} onChange={e => setSelectedExistingCauseId(e.target.value)} required>
                                <option value="">— Pick a cause —</option>
                                {activeCauses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.category})</option>)}
                            </select>
                        </div>
                    ) : (
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                <label className={styles.formLabel}>Cause Name *</label>
                                <input className={styles.formInput} type="text" value={causeName} onChange={e => setCauseName(e.target.value)} placeholder="e.g. Disaster Relief Fund" required={causeMode === 'new'} />
                            </div>
                            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                <label className={styles.formLabel}>Category *</label>
                                <select className={styles.formSelect} value={causeCategory} onChange={e => setCauseCategory(e.target.value)} required={causeMode === 'new'}>
                                    <option value="">— Pick category —</option>
                                    {CAUSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                <label className={styles.formLabel}>Fundraising Goal ($)</label>
                                <input className={styles.formInput} type="number" value={causeGoal} onChange={e => setCauseGoal(e.target.value)} placeholder="e.g. 5000" min="0" />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Section 3: Assistance Request Details ── */}
                <div className={styles.formCard}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <HeartHandshake size={18} color="#E7421B" /> Assistance Details
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '-8px', marginBottom: '16px' }}>
                        Who this help is for, so admins can track and fund the request.
                    </p>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                            <label className={styles.formLabel}>Name of Person / Family in Need *</label>
                            <input className={styles.formInput} type="text" value={beneficiaryName} onChange={e => setBeneficiaryName(e.target.value)} placeholder="e.g. The Johnson Family" required />
                        </div>
                        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                            <label className={styles.formLabel}>Target Funding Amount ($) *</label>
                            <input className={styles.formInput} type="number" min="1" step="0.01" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="e.g. 3500" required />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Urgency Reason *</label>
                        <textarea className={styles.formTextarea} value={urgencyReason} onChange={e => setUrgencyReason(e.target.value)} placeholder="e.g. Medical emergency — surgery scheduled next week; family has no insurance coverage…" required />
                    </div>
                    <div className={styles.formGrid} style={{ marginBottom: 0 }}>
                        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                            <label className={styles.formLabel}>Your Phone Number</label>
                            <input className={styles.formInput} type="tel" value={submitterPhone} onChange={e => setSubmitterPhone(e.target.value)} placeholder="(555) 000-0000" />
                        </div>
                        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                            <label className={styles.formLabel}>Your Contact Email</label>
                            <input className={styles.formInput} type="email" value={submitterEmail} onChange={e => setSubmitterEmail(e.target.value)} placeholder="you@example.com" />
                        </div>
                    </div>
                </div>

                {/* ── Section 4: Payment Destination ── */}
                <div className={styles.formCard}>
                    <h3>Payment Destination <span style={{ fontWeight: 400, fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>(optional — bill pay details)</span></h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '-8px', marginBottom: '16px' }}>
                        Tell us where to send the funds so we can pay the institution directly.
                    </p>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Bill Type</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                            {(['hospital', 'utility', 'rent', 'other'] as const).map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setBillType(billType === t ? '' : t)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                        border: billType === t ? '1.5px solid #E7421B' : '1.5px solid rgba(255,255,255,0.1)',
                                        background: billType === t ? 'rgba(231,66,27,0.12)' : 'rgba(255,255,255,0.04)',
                                        color: billType === t ? '#F8C38F' : 'rgba(255,255,255,0.65)',
                                    }}
                                >
                                    {t === 'hospital' && <><Hospital size={14} /> Hospital Bill</>}
                                    {t === 'utility' && <><Zap size={14} /> Utility Bill</>}
                                    {t === 'rent' && <><Home size={14} /> Rent / Eviction</>}
                                    {t === 'other' && <><FileText size={14} /> Other</>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {billType && (
                        <>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                    <label className={styles.formLabel}>
                                        {billType === 'hospital' && 'Hospital / Institution Name'}
                                        {billType === 'utility' && 'Utility Company Name'}
                                        {billType === 'rent' && 'Landlord / Property Management'}
                                        {billType === 'other' && 'Institution / Payee Name'}
                                    </label>
                                    <input className={styles.formInput} type="text" value={institutionName} onChange={e => setInstitutionName(e.target.value)} placeholder="e.g. Memorial Hospital" />
                                </div>
                                <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                    <label className={styles.formLabel}>Phone Number</label>
                                    <input className={styles.formInput} type="tel" value={billPhone} onChange={e => setBillPhone(e.target.value)} placeholder="(555) 000-0000" />
                                </div>
                            </div>
                            <div className={styles.formGrid} style={{ marginBottom: 0 }}>
                                <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                    <label className={styles.formLabel}>
                                        {billType === 'rent' ? 'Payment Portal / Mailing Address' : 'Address'}
                                    </label>
                                    <input className={styles.formInput} type="text" value={billAddress} onChange={e => setBillAddress(e.target.value)} placeholder="123 Main St, City, State 00000" />
                                </div>
                                <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                    <label className={styles.formLabel}>
                                        {billType === 'rent' ? 'Tenant / Lease ID' : 'Account / Reference Number'}
                                    </label>
                                    <input className={styles.formInput} type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="e.g. ACC-12345" />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {loading && step && (
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><span>{step}</span></p>
                )}
                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? (step || 'Submitting…') : <><Send size={16} style={{ marginRight: '6px' }} />Submit Reel</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
