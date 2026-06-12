'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Flame, Users, Sparkles, Film } from 'lucide-react';
import VideoPlayerModal from '@/components/shared/VideoPlayerModal';
import { useAuth } from '@/context/AuthContext';

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    videoUrl: string;
    authorId?: string;
    authorName: string;
    causeTag: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    voteCount?: number;
}

export default function CampaignsPage() {
    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <CampaignsContent />
        </Suspense>
    );
}

function LoadingSkeleton() {
    return (
        <div style={{ padding: '0' }}>
            <div style={{ height: '180px', background: 'linear-gradient(135deg, #1e1b4b 0%, #dc2626 100%)', borderRadius: '24px', marginBottom: '32px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
                {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ borderRadius: '20px', overflow: 'hidden', background: '#f1f5f9', aspectRatio: '9/14' }} />
                ))}
            </div>
        </div>
    );
}

function CampaignsContent() {
    const { user } = useAuth();
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTag, setActiveTag] = useState('All');
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [votesRemaining, setVotesRemaining] = useState<number>(0);
    const [votesTotal, setVotesTotal] = useState<number>(0);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const playId = searchParams.get('play');
    const qParam = searchParams.get('q') ?? '';
    const [searchQuery, setSearchQuery] = useState(qParam);

    useEffect(() => { setSearchQuery(searchParams.get('q') ?? ''); }, [searchParams]);

    useEffect(() => {
        fetch('/api/videos', { credentials: 'include' })
            .then(r => r.json())
            .then(data => {
                const fetched: Video[] = data.videos || [];
                setVideos(fetched);
                if (playId) {
                    const v = fetched.find(v => v.id === playId);
                    if (v) setSelectedVideo(v);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));

        fetch('/api/votes', { credentials: 'include' })
            .then(r => r.json())
            .then(votesData => {
                const used = ((votesData.userVotes ?? []) as { count: number }[]).reduce((s, v) => s + v.count, 0);
                const total = user?.votesTotal ?? 0;
                setVotesTotal(total);
                setVotesRemaining(Math.max(0, total - used));
            })
            .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playId]);

    const allTags = ['All', ...Array.from(new Set(videos.map(v => v.causeTag).filter(Boolean)))];

    const filtered = videos.filter(v => {
        const matchSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.authorName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchTag = activeTag === 'All' || v.causeTag === activeTag;
        return matchSearch && matchTag;
    });

    if (loading) return <LoadingSkeleton />;

    const featured = filtered[0];
    const rest = filtered.slice(1);

    return (
        <div style={{ paddingBottom: '40px' }}>

            {/* ── Hero Banner ───────────────────────────── */}
            <div style={{
                position: 'relative',
                borderRadius: '28px',
                overflow: 'hidden',
                marginBottom: '36px',
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                padding: '48px 48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '180px',
            }}>
                {/* Blurred blob */}
                <div style={{ position: 'absolute', top: '-60px', right: '120px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(220,38,38,0.25)', filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-40px', left: '200px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', filter: 'blur(60px)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <Sparkles size={16} color="#f59e0b" />
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Campaigns</span>
                    </div>
                    <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '10px' }}>
                        Champion a Cause.<br />
                        <span style={{ background: 'linear-gradient(90deg, #f87171, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Cast Your Vote.</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', maxWidth: '380px' }}>
                        Browse faith-driven reels submitted by the community. Watch, feel inspired, and vote for the causes that move you.
                    </p>
                </div>

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        {[
                            { label: 'Campaigns', value: videos.length, icon: <Flame size={16} color="#f87171" /> },
                            { label: 'Votes Left', value: votesRemaining, icon: <Users size={16} color="#a78bfa" /> },
                        ].map(stat => (
                            <div key={stat.label} style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '14px 20px', textAlign: 'center', minWidth: '100px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>{stat.icon}</div>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>{stat.value}</div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Filters Row ───────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', gap: '16px', flexWrap: 'wrap' }}>
                {/* Tag pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            style={{
                                padding: '7px 16px',
                                borderRadius: '50px',
                                border: activeTag === tag ? '1.5px solid #dc2626' : '1.5px solid #e2e8f0',
                                background: activeTag === tag ? '#dc2626' : 'white',
                                color: activeTag === tag ? 'white' : '#475569',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                transition: 'all 0.15s',
                            }}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                    <input
                        type="text"
                        placeholder="Search campaigns…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{
                            paddingLeft: '40px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px',
                            border: '1.5px solid #e2e8f0', borderRadius: '14px',
                            fontSize: '14px', fontFamily: 'inherit', outline: 'none',
                            width: '240px', background: 'white', color: '#0f172a',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        }}
                    />
                </div>
            </div>

            {/* ── Empty State ───────────────────────────── */}
            {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 40px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}><Film size={48} color="#cbd5e1" /></div>
                    <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>No campaigns found</p>
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Try adjusting your search or filter.</p>
                </div>
            )}

            {/* ── Featured Card (first result, large) ───── */}
            {featured && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setSelectedVideo(featured)}
                    onMouseEnter={() => setHoveredId(featured.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                        position: 'relative',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        marginBottom: '24px',
                        cursor: 'pointer',
                        aspectRatio: '21/7',
                        background: '#0f172a',
                        boxShadow: hoveredId === featured.id ? '0 20px 60px rgba(220,38,38,0.2)' : '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'box-shadow 0.3s',
                    }}
                >
                    {featured.thumbnailUrl ? (
                        <img src={featured.thumbnailUrl} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: hoveredId === featured.id ? 'scale(1.03)' : 'scale(1)' }} />
                    ) : featured.videoUrl ? (
                        <video src={featured.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} preload="metadata" muted playsInline />
                    ) : null}

                    {/* Gradient overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />

                    {/* Featured badge */}
                    <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'linear-gradient(135deg, #dc2626, #f87171)', color: 'white', fontSize: '12px', fontWeight: 800, padding: '5px 12px', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={10} /> Featured
                    </div>

                    {/* Info */}
                    <div style={{ position: 'absolute', bottom: '28px', left: '28px', right: '28px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>{featured.causeTag}</div>
                        <div style={{ fontSize: '26px', fontWeight: 900, color: 'white', marginBottom: '8px', lineHeight: 1.15 }}>{featured.title}</div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>By {featured.authorName}</div>
                    </div>

                    {/* Play button */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                        border: '2px solid rgba(255,255,255,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: hoveredId === featured.id ? 1 : 0,
                        transition: 'opacity 0.2s',
                    }}>
                        <Play size={22} color="white" fill="white" />
                    </div>
                </motion.div>
            )}

            {/* ── Grid ─────────────────────────────────── */}
            {rest.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '20px',
                }}>
                    <AnimatePresence>
                        {rest.map((video, i) => (
                            <motion.div
                                key={video.id}
                                layout
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.04, duration: 0.35 }}
                                onClick={() => setSelectedVideo(video)}
                                onMouseEnter={() => setHoveredId(video.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    aspectRatio: '9 / 14',
                                    background: '#0f172a',
                                    boxShadow: hoveredId === video.id
                                        ? '0 16px 48px rgba(220,38,38,0.18), 0 4px 16px rgba(0,0,0,0.12)'
                                        : '0 2px 12px rgba(0,0,0,0.07)',
                                    transform: hoveredId === video.id ? 'translateY(-6px)' : 'translateY(0)',
                                    transition: 'box-shadow 0.3s, transform 0.3s',
                                }}
                            >
                                {/* Thumbnail / video */}
                                {video.thumbnailUrl ? (
                                    <img src={video.thumbnailUrl} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s', transform: hoveredId === video.id ? 'scale(1.06)' : 'scale(1)' }} />
                                ) : video.videoUrl ? (
                                    <video src={video.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} preload="metadata" muted playsInline />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }} />
                                )}

                                {/* Dark gradient bottom */}
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />

                                {/* Cause tag pill */}
                                <div style={{
                                    position: 'absolute', top: '12px', left: '12px',
                                    background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    color: 'white', fontSize: '12px', fontWeight: 700,
                                    padding: '4px 10px', borderRadius: '50px',
                                    textTransform: 'uppercase', letterSpacing: '0.4px',
                                }}>
                                    {video.causeTag}
                                </div>

                                {/* Play overlay on hover */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: hoveredId === video.id ? 1 : 0,
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

                                {/* Bottom info */}
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 14px 16px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'white', lineHeight: 1.3, marginBottom: '5px' }}>{video.title}</div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>By {video.authorName}</div>

                                    {/* Divider */}
                                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0 8px' }} />

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Flame size={12} color="#f87171" />
                                            <span style={{ fontSize: '12px', color: '#f87171', fontWeight: 700 }}>{video.voteCount ?? 0} votes</span>
                                        </div>
                                        <div style={{
                                            fontSize: '12px', fontWeight: 700, color: '#dc2626',
                                            background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)',
                                            padding: '3px 8px', borderRadius: '50px',
                                        }}>
                                            Vote Now
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {selectedVideo && (
                <VideoPlayerModal
                    videos={filtered}
                    initialIndex={filtered.findIndex(v => v.id === selectedVideo.id)}
                    onClose={() => setSelectedVideo(null)}
                    currentUserId={user?.id}
                    votesRemaining={votesRemaining}
                    votesTotal={votesTotal}
                    onVoteCast={newRemaining => setVotesRemaining(newRemaining)}
                />
            )}
        </div>
    );
}
