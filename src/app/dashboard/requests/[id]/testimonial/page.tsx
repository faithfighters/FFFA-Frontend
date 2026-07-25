'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Video as VideoIcon, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { haptics } from '@/lib/haptics';

async function uploadToS3(file: File, folder: string): Promise<string> {
    const presignRes = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ contentType: file.type, fileSizeBytes: file.size, folder }),
    });
    const presignData = await presignRes.json();
    if (!presignRes.ok) throw new Error(presignData.message || 'Failed to get upload URL.');

    const s3Res = await fetch(presignData.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
    });
    if (!s3Res.ok) throw new Error('Upload to storage failed.');

    return presignData.publicUrl;
}

export default function TestimonialPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [requestTitle, setRequestTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const type = 'video' as const;
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        fetch(`/api/assistance-requests/${id}`, { credentials: 'include' })
            .then(r => r.json())
            .then(d => setRequestTitle(d.request?.requestTitle || ''))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    const canSubmit = !!videoFile;

    const handleSubmit = async () => {
        if (!canSubmit || submitting) return;
        setSubmitting(true);
        setError('');
        try {
            let videoUrl = '';
            let photoUrl = '';
            if (videoFile) {
                videoUrl = await uploadToS3(videoFile, 'videos');
            }
            if (photoFile) {
                photoUrl = await uploadToS3(photoFile, 'images');
            }

            const res = await fetch(`/api/assistance-requests/${id}/testimonial`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    type,
                    videoUrl: videoUrl || undefined,
                    photoUrl: photoUrl || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Failed to submit testimonial.');
                setSubmitting(false);
                return;
            }
            haptics.tap();
            setDone(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '24px', color: 'rgba(255,255,255,0.6)' }}>Loading…</div>;

    if (done) {
        return (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="#4ade80" style={{ marginBottom: '16px' }} />
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '0 0 8px' }}>Thank you for sharing!</h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', marginBottom: '24px' }}>
                    Your testimonial helps inspire the community and shows the real impact of their support.
                </p>
                <button
                    onClick={() => router.push('/dashboard/requests')}
                    style={{ padding: '12px 24px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)', color: '#ffffff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                    Back to My Requests
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px 20px 40px', maxWidth: '520px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '0 0 4px' }}>Share Your Testimonial</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 24px' }}>
                {requestTitle ? `For: ${requestTitle}` : 'Let the community know how their support helped you.'}
            </p>

            <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                padding: '28px', borderRadius: '14px', border: '1.5px dashed rgba(255,255,255,0.15)',
                cursor: 'pointer', textAlign: 'center', marginBottom: '16px',
            }}>
                <VideoIcon size={24} color="rgba(255,255,255,0.4)" />
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                    {videoFile ? videoFile.name : 'Tap to choose a video'}
                </span>
                <input type="file" accept="video/*" style={{ display: 'none' }} onChange={e => setVideoFile(e.target.files?.[0] || null)} />
            </label>

            <div style={{ marginTop: '16px' }}>
                <label style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 14px', borderRadius: '12px', border: '1.5px dashed rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                }}>
                    <ImageIcon size={18} color="rgba(255,255,255,0.4)" />
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                        {photoFile ? photoFile.name : 'Add a photo (optional)'}
                    </span>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setPhotoFile(e.target.files?.[0] || null)} />
                </label>
            </div>

            {error && (
                <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(220,38,38,0.15)', color: '#f87171', fontSize: '13px' }}>
                    {error}
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                style={{
                    width: '100%', marginTop: '20px', padding: '14px', borderRadius: '50px', border: 'none',
                    background: canSubmit ? 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)' : 'rgba(255,255,255,0.1)',
                    color: '#ffffff', fontWeight: 700, fontSize: '14px',
                    cursor: canSubmit && !submitting ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                }}
            >
                {submitting ? 'Submitting…' : 'Submit Testimonial'}
            </button>
        </div>
    );
}
