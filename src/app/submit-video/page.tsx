'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import styles from './page.module.css';

export default function SubmitVideoPage() {
    return (
        <ProtectedRoute>
            <SubmitVideoContent />
        </ProtectedRoute>
    );
}

const CAUSE_TAGS = [
    'Veterans',
    'Youth Programs',
    'Food Security',
    'Disaster Relief',
    'Healthcare',
    'First Responders',
    'Housing',
    'Utility Assistance',
];

type BillType = 'hospital' | 'utility' | 'rent' | 'other' | '';

function SubmitVideoContent() {
    // Story details
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [causeTag, setCauseTag] = useState('');
    const [fileName, setFileName] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    // Submitter info
    const [submitterPhone, setSubmitterPhone] = useState('');
    const [submitterEmail, setSubmitterEmail] = useState('');

    // Beneficiary
    const [beneficiaryName, setBeneficiaryName] = useState('');
    const [urgencyReason, setUrgencyReason] = useState('');
    const [targetAmount, setTargetAmount] = useState('');

    // Bill pay destination
    const [billType, setBillType] = useState<BillType>('');
    const [institutionName, setInstitutionName] = useState('');
    const [billAddress, setBillAddress] = useState('');
    const [billPhone, setBillPhone] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) setFileName(file.name);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setFileName(file.name);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload: Record<string, unknown> = {
                title,
                description,
                causeTag,
                beneficiaryName,
                urgencyReason,
                targetAmount: targetAmount ? Number(targetAmount) : undefined,
                submitterPhone,
                submitterEmail,
                videoUrl: '#pending-upload',
            };

            if (billType) {
                payload.paymentDestination = {
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
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || data.message || 'Submission failed.');
                return;
            }
            setSubmitted(true);
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className={styles.submitPage}>
                <div className="container">
                    <div className={styles.successCard}>
                        <div className={styles.successIcon}>🎬</div>
                        <h2 className="heading-lg">Video Submitted!</h2>
                        <p className="text-body" style={{ marginTop: 'var(--space-md)' }}>
                            Your video <strong>&ldquo;{title}&rdquo;</strong> has been submitted for review.
                            Our team will review it and notify you once it&apos;s approved.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.submitPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <h1 className="heading-lg">Submit a Video</h1>
                    <p className="text-body">Share a story of need from your community. 80% of member donations fund stories like yours.</p>
                </div>

                {error && (
                    <div style={{ background: '#fee2e2', border: '1px solid #ef4444', borderRadius: 8, padding: 'var(--space-md)', marginBottom: 'var(--space-lg)', color: '#dc2626' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* ── Video Upload ── */}
                    <div
                        className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ''} ${fileName ? styles.dropZoneHasFile : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                    >
                        {fileName ? (
                            <div className={styles.fileInfo}>
                                <span className={styles.fileIcon}>🎥</span>
                                <span className={styles.fileNameText}>{fileName}</span>
                                <button type="button" className={styles.removeFile} onClick={() => setFileName('')}>✕</button>
                            </div>
                        ) : (
                            <>
                                <div className={styles.dropIcon}>📁</div>
                                <p className={styles.dropText}>Drag &amp; drop your video here</p>
                                <p className={styles.dropOr}>or</p>
                                <label className={`btn btn--primary ${styles.browseBtn}`}>
                                    Browse Files
                                    <input type="file" accept="video/mp4,video/mov,video/avi,video/webm,video/*" onChange={handleFileChange} hidden />
                                </label>
                                <p className={styles.dropHint}>MP4, MOV, AVI, WEBM — Max 500MB</p>
                            </>
                        )}
                    </div>

                    {/* ── Story Details ── */}
                    <h3 className={styles.sectionTitle}>Story Details</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Video Title *</label>
                            <input className={styles.input} type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. A Family Faces Eviction" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Cause Category *</label>
                            <select className={styles.input} value={causeTag} onChange={(e) => setCauseTag(e.target.value)} required>
                                <option value="">Select a cause category</option>
                                {CAUSE_TAGS.map((tag) => (
                                    <option key={tag} value={tag}>{tag}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Story Description *</label>
                        <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us about this story and why it matters to the community..." rows={4} required />
                    </div>

                    {/* ── Submitter Contact ── */}
                    <h3 className={styles.sectionTitle}>Your Contact Information</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Phone Number</label>
                            <input className={styles.input} type="tel" value={submitterPhone} onChange={(e) => setSubmitterPhone(e.target.value)} placeholder="(555) 000-0000" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Contact Email</label>
                            <input className={styles.input} type="email" value={submitterEmail} onChange={(e) => setSubmitterEmail(e.target.value)} placeholder="you@example.com" />
                        </div>
                    </div>

                    {/* ── Beneficiary Info ── */}
                    <h3 className={styles.sectionTitle}>Beneficiary Information</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Name of Person / Family in Need *</label>
                            <input className={styles.input} type="text" value={beneficiaryName} onChange={(e) => setBeneficiaryName(e.target.value)} placeholder="e.g. The Johnson Family" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Target Funding Amount ($) *</label>
                            <input className={styles.input} type="number" min="1" step="0.01" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="e.g. 3500" required />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Urgency Reason *</label>
                        <textarea className={styles.textarea} value={urgencyReason} onChange={(e) => setUrgencyReason(e.target.value)} placeholder="e.g. Medical emergency — surgery scheduled for next week; family has no insurance coverage..." rows={3} required />
                    </div>

                    {/* ── Bill / Payment Destination ── */}
                    <h3 className={styles.sectionTitle}>Payment Destination <span style={{ fontWeight: 400, fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>(Bill Pay Details)</span></h3>
                    <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginBottom: 'var(--space-lg)' }}>
                        Tell us where to send the funds so we can pay the institution directly.
                    </p>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Bill Type *</label>
                        <div className={styles.billTypeGrid}>
                            {(['hospital', 'utility', 'rent', 'other'] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    className={`${styles.billTypeBtn} ${billType === t ? styles.billTypeBtnActive : ''}`}
                                    onClick={() => setBillType(t)}
                                >
                                    {t === 'hospital' && '🏥 Hospital Bill'}
                                    {t === 'utility' && '💡 Utility Bill'}
                                    {t === 'rent' && '🏠 Rent / Eviction'}
                                    {t === 'other' && '📄 Other'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {billType && (
                        <>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        {billType === 'hospital' && 'Hospital / Institution Name'}
                                        {billType === 'utility' && 'Utility Company Name'}
                                        {billType === 'rent' && 'Landlord / Property Management'}
                                        {billType === 'other' && 'Institution / Payee Name'}
                                    </label>
                                    <input className={styles.input} type="text" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} placeholder="e.g. Memorial Hospital" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Phone Number</label>
                                    <input className={styles.input} type="tel" value={billPhone} onChange={(e) => setBillPhone(e.target.value)} placeholder="(555) 000-0000" />
                                </div>
                            </div>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        {billType === 'rent' ? 'Payment Portal / Mailing Address' : 'Address'}
                                    </label>
                                    <input className={styles.input} type="text" value={billAddress} onChange={(e) => setBillAddress(e.target.value)} placeholder="123 Main St, City, State 00000" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        {billType === 'hospital' && 'Account / Reference Number'}
                                        {billType === 'utility' && 'Account Number'}
                                        {billType === 'rent' && 'Tenant / Lease ID'}
                                        {billType === 'other' && 'Account / Reference Number'}
                                    </label>
                                    <input className={styles.input} type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="e.g. ACC-12345" />
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className={`btn btn--primary ${styles.submitBtn}`}
                        disabled={loading || !title || !causeTag || !description || !beneficiaryName || !targetAmount || !urgencyReason}
                    >
                        {loading ? 'Submitting...' : 'Submit for Review'}
                    </button>
                </form>
            </div>
        </div>
    );
}
