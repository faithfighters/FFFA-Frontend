'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import VideoPlayerModal from '@/components/shared/VideoPlayerModal';
import { Play, Flame, ArrowRight, Trophy, Users, Zap, TrendingUp, Film, Clock } from 'lucide-react';
import styles from './page.module.css';
import { PLAN_CONFIG, PlanKey } from '@/lib/types';

interface DashStats {
    totalVotes: number;
    activeCauses: number;
    memberSince?: string;
}

function DashboardContent() {
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [stats, setStats] = useState<DashStats | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [communityVideos, setCommunityVideos] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
    const [votesRemaining, setVotesRemaining] = useState<number>(0);
    const [votesTotal, setVotesTotal] = useState<number>(0);
    const [boosterRemaining, setBoosterRemaining] = useState<number>(0);
    const [resetTime, setResetTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [dataVersion, setDataVersion] = useState(0);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const firstName = user?.name?.split(' ')[0] || 'there';

    useEffect(() => {
        if (searchParams.get('checkout') !== 'success') return;
        fetch('/api/stripe/sync', { method: 'POST', credentials: 'include' })
            .then(() => refreshUser())
            .then(() => { setDataVersion(v => v + 1); router.replace('/dashboard'); })
            .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const [videosRes, votesRes] = await Promise.all([
                    fetch('/api/videos', { credentials: 'include' }),
                    fetch('/api/votes', { credentials: 'include' }),
                ]);
                if (videosRes.ok) {
                    const vd = await videosRes.json();
                    setCommunityVideos((vd.videos || []).slice(0, 4));
                }
                if (votesRes.ok) {
                    const votesData = await votesRes.json();
                    const used = ((votesData.userVotes ?? []) as { count: number }[]).reduce((s, v) => s + v.count, 0);
                    const planTotal = user.votesTotal ?? 0;
                    setVotesTotal(planTotal);
                    setVotesRemaining(Math.max(0, planTotal - used));
                    setBoosterRemaining(user.boosterVotesRemaining ?? 0);
                    setStats({ totalVotes: used, activeCauses: (votesData.causes ?? []).length, memberSince: user.joinedAt });
                }
            } catch {
                setStats({ totalVotes: 0, activeCauses: 0 });
            } finally { setLoading(false); }
        };
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, user?.votesTotal, user?.boosterVotesRemaining, user?.plan, dataVersion]);

    // Live countdown to daily reset (midnight local time)
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            const ms = midnight.getTime() - now.getTime();
            const h = Math.floor(ms / 3600000);
            const m = Math.floor((ms % 3600000) / 60000);
            setResetTime(h > 0 ? `${h}h ${m}m` : `${m}m`);
        };
        tick();
        const id = setInterval(tick, 60000);
        return () => clearInterval(id);
    }, []);

    if (loading) {
        return (
            <div className={styles.dashboardRoot}>
                <div className={styles.heroSkeleton} />
                <div className={styles.statsGrid}>
                    {[...Array(4)].map((_, i) => <div key={i} className={styles.statSkeleton} />)}
                </div>
            </div>
        );
    }

    const votePercent = votesTotal > 0 ? Math.round(((votesTotal - votesRemaining) / votesTotal) * 100) : 0;

    const quickLinks = [
        { icon: <Trophy size={22} />, label: 'Vote / Donate', desc: 'Allocate your votes to causes', href: '/dashboard/vote', color: '#f59e0b', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)' },
        { icon: <Zap size={22} />, label: 'Submit a Video', desc: 'Share a reel for a cause', href: '/dashboard/submit', color: '#8b5cf6', bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' },
        { icon: <TrendingUp size={22} />, label: 'Leaderboard', desc: 'See who\'s leading the race', href: '/dashboard/leaderboard', color: '#10b981', bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' },
    ];

    return (
        <div className={styles.dashboardRoot}>

            {/* ── Hero Greeting ─────────────────────────────── */}
            <div className={styles.heroCard}>
                {/* Glow blobs */}
                <div className={styles.heroGlowRed} />
                <div className={styles.heroGlowBlue} />

                <div className={styles.heroText}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>
                        Welcome back
                    </p>
                    <h1 className={styles.heroTitle}>
                        Hello, <span style={{ background: 'linear-gradient(90deg, #f87171, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{firstName}</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px' }}>
                        You have <strong style={{ color: '#f87171' }}>{votesRemaining} plan vote{votesRemaining !== 1 ? 's' : ''}</strong>
                        {boosterRemaining > 0 && <> + <strong style={{ color: '#fbbf24' }}>{boosterRemaining} booster</strong></>}
                        {' '}left today.
                    </p>
                </div>

                <div className={styles.heroActions}>
                    <button
                        onClick={() => router.push('/dashboard/vote')}
                        className={styles.heroButton}
                    >
                        Cast Votes <ArrowRight size={16} />
                    </button>
                    {/* Vote progress bar */}
                    {votesTotal > 0 && (
                        <div className={styles.voteProgress}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>VOTES USED</span>
                                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>{votePercent}%</span>
                            </div>
                            <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                                <div style={{ width: `${votePercent}%`, height: '100%', background: 'linear-gradient(90deg, #f87171, #fb923c)', borderRadius: '3px', transition: 'width 0.8s ease' }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Stat Cards ────────────────────────────────── */}
            <div className={styles.statsGrid}>
                {/* Plan Votes */}
                <div className={styles.statCard}>
                    <div className={styles.statCardTop}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                            <Users size={20} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626', background: '#fef2f2', padding: '4px 10px', borderRadius: '50px' }}>
                            {user?.plan ? PLAN_CONFIG[user.plan as PlanKey].name : 'Free'}
                        </span>
                    </div>
                    <div style={{ fontSize: '30px', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: '4px' }}>
                        {votesTotal > 0 ? `${votesRemaining}/${votesTotal}` : '—'}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Plan Votes</div>
                    {resetTime && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                            <Clock size={11} color="#94a3b8" />
                            Resets in {resetTime}
                        </div>
                    )}
                </div>

                {/* Booster Votes */}
                <div className={styles.statCard}>
                    <div className={styles.statCardTop}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                            <Zap size={20} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '4px 10px', borderRadius: '50px' }}>No Limit</span>
                    </div>
                    <div style={{ fontSize: '30px', fontWeight: 900, color: boosterRemaining > 0 ? '#f59e0b' : '#0f172a', letterSpacing: '-1px', marginBottom: '4px' }}>
                        {boosterRemaining > 0 ? `+${boosterRemaining}` : '0'}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Booster Votes</div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                        {boosterRemaining > 0 ? 'Use anytime · no daily limit' : 'Buy on Plans & Votes page'}
                    </div>
                </div>

                {/* Active Campaigns */}
                <div className={styles.statCard}>
                    <div className={styles.statCardTop}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                            <Flame size={20} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '4px 10px', borderRadius: '50px' }}>Live</span>
                    </div>
                    <div style={{ fontSize: '30px', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: '4px' }}>{stats?.activeCauses ?? 0}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Campaigns</div>
                </div>

                {/* Votes Cast */}
                <div className={styles.statCard}>
                    <div className={styles.statCardTop}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                            <Trophy size={20} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669', background: '#dcfce7', padding: '4px 10px', borderRadius: '50px' }}>This cycle</span>
                    </div>
                    <div style={{ fontSize: '30px', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: '4px' }}>{stats?.totalVotes ?? 0}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Votes Cast</div>
                </div>
            </div>

            {/* ── Featured Campaigns ────────────────────────── */}
            <div className={styles.featuredSection}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>Featured Campaigns</h2>
                        <p style={{ fontSize: '13px', color: '#94a3b8' }}>Watch, feel inspired, and vote for the causes that move you</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/campaigns')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '10px 20px', background: '#0f172a', color: 'white',
                            border: 'none', borderRadius: '50px', fontWeight: 700, fontSize: '13px',
                            cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        View All <ArrowRight size={14} />
                    </button>
                </div>

                {communityVideos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><Film size={40} color="#cbd5e1" /></div>
                        <p style={{ color: '#94a3b8', fontWeight: 600 }}>No campaigns yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className={styles.campaignGrid}>
                        {communityVideos.map((video) => (
                            <div
                                key={video.id}
                                onClick={() => setSelectedVideo(video)}
                                onMouseEnter={() => setHoveredCard(video.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className={styles.campaignCard}
                                style={{
                                    boxShadow: hoveredCard === video.id ? '0 16px 48px rgba(220,38,38,0.18)' : undefined,
                                    transform: hoveredCard === video.id ? 'translateY(-6px)' : undefined,
                                }}
                            >
                                {video.thumbnailUrl ? (
                                    <img src={video.thumbnailUrl} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hoveredCard === video.id ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.4s' }} />
                                ) : video.videoUrl ? (
                                    <video src={video.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} preload="metadata" muted playsInline />
                                ) : null}
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />

                                {/* Cause pill */}
                                {video.causeTag && (
                                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                        {video.causeTag}
                                    </div>
                                )}

                                {/* Play button */}
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hoveredCard === video.id ? 1 : 0.7, transition: 'opacity 0.2s' }}>
                                    <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Play size={16} color="white" fill="white" />
                                    </div>
                                </div>

                                {/* Bottom info */}
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'white', lineHeight: 1.3, marginBottom: '4px' }}>{video.title}</div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>By {video.authorName}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                                        <Flame size={12} color="#f87171" />
                                        <span style={{ fontSize: '12px', color: '#f87171', fontWeight: 700 }}>{video.voteCount ?? 0} votes</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Quick Actions ─────────────────────────────── */}
            <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Quick Actions</h2>
                <div className={styles.quickGrid}>
                    {quickLinks.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={e => { e.preventDefault(); router.push(link.href); }}
                            className={styles.quickCard}
                            style={{ background: link.bg }}
                        >
                            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: link.color, marginBottom: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                {link.icon}
                            </div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {link.label} <ArrowRight size={14} color="#94a3b8" />
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>{link.desc}</div>
                        </a>
                    ))}
                </div>
            </div>

            {selectedVideo && (
                <VideoPlayerModal
                    videos={communityVideos}
                    initialIndex={communityVideos.findIndex(v => v.id === selectedVideo.id)}
                    onClose={() => setSelectedVideo(null)}
                    currentUserId={user?.id}
                    votesRemaining={votesRemaining + boosterRemaining}
                    votesTotal={votesTotal + boosterRemaining}
                    onVoteCast={() => { refreshUser().then(() => setDataVersion(v => v + 1)); }}
                />
            )}
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={null}>
            <DashboardContent />
        </Suspense>
    );
}
