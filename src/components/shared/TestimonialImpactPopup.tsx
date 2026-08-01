'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Notification {
    _id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    link?: string;
    imageUrl?: string;
}

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
    };
}

/**
 * Closes the feedback loop for voters: when a recipient's testimonial comes in,
 * every member who voted on that video gets a `testimonial_received` notification
 * (see backend AssistanceRequestsService.notifyVoters). This surfaces the FIRST
 * unread one as a rich popup — not just a line in the notification bell — since
 * this is meant to be one of the platform's most emotionally rewarding moments.
 */
export default function TestimonialImpactPopup() {
    const router = useRouter();
    const [notification, setNotification] = useState<Notification | null>(null);
    const [story, setStory] = useState<ImpactStory | null>(null);
    const [dismissing, setDismissing] = useState(false);

    useEffect(() => {
        fetch('/api/notifications', { credentials: 'include' })
            .then(r => r.json())
            .then(async (d) => {
                const unread: Notification[] = (d.notifications || []).filter(
                    (n: Notification) => !n.read && n.type === 'testimonial_received',
                );
                if (unread.length === 0) return;
                const next = unread[0];
                setNotification(next);

                const id = next.link?.split('/').pop();
                if (!id) return;
                const storyRes = await fetch(`/api/assistance-requests/${id}/impact`, { credentials: 'include' });
                if (storyRes.ok) {
                    const storyData = await storyRes.json();
                    setStory(storyData.story);
                }
            })
            .catch(() => {});
    }, []);

    const dismiss = async () => {
        if (!notification || dismissing) return;
        setDismissing(true);
        await fetch(`/api/notifications/${notification._id}/read`, { method: 'PATCH', credentials: 'include' }).catch(() => {});
        setNotification(null);
    };

    const viewFullStory = () => {
        if (notification?.link) router.push(notification.link);
        dismiss();
    };

    if (!notification) return null;

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(0,0,0,0.75)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            }}
            onClick={dismiss}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: '440px', borderRadius: '24px',
                    background: 'linear-gradient(180deg, #1a1530, #15131f)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
                    padding: '32px 24px 24px', textAlign: 'center',
                }}
            >
                <div style={{
                    width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 18px',
                    background: 'linear-gradient(135deg, #F8C38F, #E7421B)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px',
                    boxShadow: '0 8px 24px rgba(231,66,27,0.45)',
                }}>
                    ❤️
                </div>

                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: '0 0 10px', lineHeight: 1.3 }}>
                    Your vote made a difference!
                </h2>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: '0 0 22px' }}>
                    {notification.message}
                </p>

                {story && (
                    <div style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px', padding: '18px', textAlign: 'left', marginBottom: '20px',
                    }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#F8C38F', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                            {story.requestTitle}
                        </div>

                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px' }}>
                            <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Before:</strong> {story.description}
                        </div>

                        {story.testimonial.type === 'written' && story.testimonial.writtenText && (
                            <p style={{ fontSize: '14px', color: '#ffffff', fontStyle: 'italic', lineHeight: 1.6, margin: '10px 0 0' }}>
                                &ldquo;{story.testimonial.writtenText}&rdquo;
                            </p>
                        )}
                        {story.testimonial.type === 'video' && story.testimonial.videoUrl && (
                            <div style={{ fontSize: '13px', color: '#60a5fa', marginTop: '10px', fontWeight: 600 }}>
                                🎥 {story.memberName} recorded a video testimonial
                            </div>
                        )}
                        {story.testimonial.photoUrl && (
                            <img
                                src={story.testimonial.photoUrl}
                                alt=""
                                style={{ width: '100%', borderRadius: '10px', marginTop: '12px', maxHeight: '160px', objectFit: 'cover' }}
                            />
                        )}

                        <div style={{ fontSize: '12px', color: '#4ade80', fontWeight: 700, marginTop: '12px' }}>
                            Thank you for helping make this possible. 🙏
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                        onClick={viewFullStory}
                        style={{
                            width: '100%', padding: '14px', borderRadius: '50px', border: 'none',
                            background: 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)',
                            color: '#ffffff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        View Full Testimonial
                    </button>
                    <button
                        onClick={dismiss}
                        disabled={dismissing}
                        style={{
                            width: '100%', background: 'none', border: 'none',
                            color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 600,
                            cursor: 'pointer', padding: '4px', fontFamily: 'inherit',
                        }}
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
