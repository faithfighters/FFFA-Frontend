'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Film, X, Heart } from 'lucide-react';

interface TestimonialStory {
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

export default function TestimonialsGalleryPage() {
    const [stories, setStories] = useState<TestimonialStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [selected, setSelected] = useState<TestimonialStory | null>(null);

    useEffect(() => {
        fetch('/api/assistance-requests/testimonials/all', { credentials: 'include' })
            .then(async r => {
                if (!r.ok) return;
                const d = await r.json();
                setStories(d.stories || []);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{ paddingBottom: '40px' }}>
            <style>{`
                .testimonials-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
                @media (max-width: 900px) { .testimonials-grid { grid-template-columns: repeat(3, 1fr); } }
                @media (max-width: 640px) { .testimonials-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
                @media (max-width: 480px) { .testimonials-grid { grid-template-columns: 1fr; } }
            `}</style>

            <div style={{
                position: 'relative', borderRadius: '28px', overflow: 'hidden', marginBottom: '32px',
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                padding: '40px 48px',
            }}>
                <div style={{ position: 'absolute', top: '-60px', right: '120px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(231, 66, 27, 0.25)', filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <Heart size={16} color="#f59e0b" fill="#f59e0b" />
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px' }}>Real Impact</span>
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '10px' }}>
                        Testimonial Videos
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', maxWidth: '480px' }}>
                        Stories shared by members whose campaigns were funded by this community.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="testimonials-grid">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} style={{ borderRadius: '20px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', aspectRatio: '9/14' }} />
                    ))}
                </div>
            ) : stories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 40px', background: '#15131f', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}><Film size={48} color="rgba(255,255,255,0.25)" /></div>
                    <p style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>No testimonials shared yet</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Check back soon for stories from the community.</p>
                </div>
            ) : (
                <div className="testimonials-grid">
                    <AnimatePresence>
                        {stories.map((story, i) => (
                            <motion.div
                                key={story.id}
                                layout
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.04, duration: 0.35 }}
                                onClick={() => setSelected(story)}
                                onMouseEnter={() => setHoveredId(story.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', position: 'relative',
                                    aspectRatio: '9 / 14', background: '#0f172a',
                                    boxShadow: hoveredId === story.id
                                        ? '0 16px 48px rgba(231, 66, 27, 0.25), 0 4px 16px rgba(0,0,0,0.12)'
                                        : '0 2px 12px rgba(0,0,0,0.07)',
                                    transform: hoveredId === story.id ? 'translateY(-6px)' : 'translateY(0)',
                                    transition: 'box-shadow 0.3s, transform 0.3s',
                                }}
                            >
                                {story.testimonial.videoUrl ? (
                                    <video src={story.testimonial.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} preload="metadata" muted playsInline />
                                ) : story.testimonial.photoUrl ? (
                                    <img src={story.testimonial.photoUrl} alt={story.requestTitle} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }} />
                                )}

                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />

                                <div style={{
                                    position: 'absolute', top: '12px', left: '12px',
                                    background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    color: 'white', fontSize: '12px', fontWeight: 700,
                                    padding: '4px 10px', borderRadius: '50px',
                                    textTransform: 'uppercase', letterSpacing: '0.4px',
                                }}>
                                    {story.category}
                                </div>

                                {story.testimonial.videoUrl && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        opacity: hoveredId === story.id ? 1 : 0.85,
                                        transition: 'opacity 0.2s',
                                    }}>
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
                                            border: '2px solid rgba(255,255,255,0.35)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Play size={18} color="white" fill="white" />
                                        </div>
                                    </div>
                                )}

                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 14px 16px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'white', lineHeight: 1.3, marginBottom: '5px' }}>{story.requestTitle}</div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Shared by {story.memberName}</div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {selected && (
                <div
                    onClick={() => setSelected(null)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
                        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'linear-gradient(180deg, #1a1530, #15131f)', border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '24px', padding: '24px', maxWidth: '440px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 4px' }}>{selected.requestTitle}</h2>
                                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', textTransform: 'capitalize', margin: 0 }}>
                                    {selected.category} · Shared by {selected.memberName}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                            >
                                <X size={16} color="white" />
                            </button>
                        </div>

                        {selected.testimonial.videoUrl && (
                            <video src={selected.testimonial.videoUrl} controls autoPlay style={{ width: '100%', borderRadius: '14px', marginBottom: '16px', background: '#000' }} />
                        )}
                        {selected.testimonial.photoUrl && (
                            <img src={selected.testimonial.photoUrl} alt="" style={{ width: '100%', borderRadius: '14px', marginBottom: '16px' }} />
                        )}

                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
                            {selected.description}
                        </p>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
