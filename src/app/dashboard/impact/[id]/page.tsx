'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, ArrowLeft } from 'lucide-react';

interface ImpactStory {
    id: string;
    memberName: string;
    requestTitle: string;
    category: string;
    description: string;
    testimonial: {
        type?: string;
        writtenText?: string;
        videoUrl?: string;
        photoUrl?: string;
        submittedAt?: string;
    };
}

export default function ImpactStoryPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [story, setStory] = useState<ImpactStory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`/api/assistance-requests/${id}/impact`, { credentials: 'include' })
            .then(async r => {
                if (!r.ok) { setError('This story is not available yet.'); return; }
                const d = await r.json();
                setStory(d.story);
            })
            .catch(() => setError('This story is not available yet.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div style={{ padding: '24px', color: 'rgba(255,255,255,0.6)' }}>Loading…</div>;

    return (
        <div style={{ padding: '20px 20px 40px', maxWidth: '600px', margin: '0 auto' }}>
            <button
                onClick={() => router.push('/dashboard')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#F8C38F', fontSize: '14px', fontWeight: 700, marginBottom: '20px', padding: 0, fontFamily: 'inherit' }}
            >
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            {error || !story ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#15131f', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Heart size={32} color="rgba(255,255,255,0.25)" style={{ marginBottom: '12px' }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, margin: 0 }}>{error || 'Story not found.'}</p>
                </div>
            ) : (
                <div style={{ background: 'linear-gradient(180deg, #1a1530, #15131f)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '28px 24px' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 16px',
                        background: 'linear-gradient(135deg, #F8C38F, #E7421B)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px',
                    }}>
                        ❤️
                    </div>

                    <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', textAlign: 'center', margin: '0 0 4px' }}>
                        {story.requestTitle}
                    </h1>
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '13px', textTransform: 'capitalize', margin: '0 0 24px' }}>
                        {story.category} · Shared by {story.memberName}
                    </p>

                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>Before</div>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>{story.description}</p>
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '20px 0' }} />

                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>After</div>
                        {story.testimonial.type === 'written' && story.testimonial.writtenText && (
                            <p style={{ fontSize: '15px', color: '#ffffff', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>
                                &ldquo;{story.testimonial.writtenText}&rdquo;
                            </p>
                        )}
                        {story.testimonial.type === 'video' && story.testimonial.videoUrl && (
                            <video src={story.testimonial.videoUrl} controls style={{ width: '100%', borderRadius: '14px', marginTop: '8px', background: '#000' }} />
                        )}
                        {story.testimonial.photoUrl && (
                            <img src={story.testimonial.photoUrl} alt="" style={{ width: '100%', borderRadius: '14px', marginTop: '14px' }} />
                        )}
                    </div>

                    <div style={{
                        background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)',
                        borderRadius: '14px', padding: '16px', textAlign: 'center',
                    }}>
                        <p style={{ fontSize: '13px', color: '#4ade80', fontWeight: 700, margin: 0 }}>
                            Thank you for being part of this community's impact. 🙏
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
