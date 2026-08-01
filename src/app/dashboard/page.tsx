'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import VideoPlayerModal from '@/components/shared/VideoPlayerModal';
import { Play, Flame, ArrowRight, Trophy, Users, Zap, TrendingUp, Film, Clock, CheckCircle2, Calendar, ChevronRight, X } from 'lucide-react';
import styles from './page.module.css';
import { haptics } from '@/lib/haptics';

interface DashStats {
    totalVotes: number;
    activeCauses: number;
    memberSince?: string;
}

const DESKTOP_HERO_IMAGES = [
    '/images/desktop1.png',
    '/images/desktop2.png',
    '/images/desktop3.png',
];

const MOBILE_HERO_IMAGES = [
    '/images/hands_bg_team.svg',
    '/images/america_hands_join.png',
    '/images/team_img.svg'
];

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
    const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);

    const firstName = user?.name?.split(' ')[0] || 'there';

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHeroImageIndex((prev) => (prev + 1) % DESKTOP_HERO_IMAGES.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const [showCelebration, setShowCelebration] = useState(false);
    const [showHowItWorks, setShowHowItWorks] = useState(false);
    const [communityMilestone, setCommunityMilestone] = useState<{ id: string } | null>(null);

    useEffect(() => {
        if (!communityMilestone) return;
        const timer = setTimeout(() => setCommunityMilestone(null), 8000);
        return () => clearTimeout(timer);
    }, [communityMilestone]);

    useEffect(() => {
        if (searchParams.get('checkout') === 'success') {
            setShowCelebration(true);
            fetch('/api/stripe/sync', { method: 'POST', credentials: 'include' })
                .then(() => refreshUser())
                .then(() => { setDataVersion(v => v + 1); router.replace('/dashboard'); })
                .catch(() => { });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Google-signup donors land here with ?startCheckout=<plan> — same Stripe checkout
    // the regular email/password donor flow kicks off right after OTP verification.
    useEffect(() => {
        const plan = searchParams.get('startCheckout');
        if (!plan || !user || user.plan) return;
        router.replace('/dashboard');
        fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ plan }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.url) window.location.href = data.url;
                else router.push('/dashboard/subscription?checkout=retry');
            })
            .catch(() => router.push('/dashboard/subscription?checkout=retry'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        if (user) {
            setVotesRemaining(user.votesRemaining ?? 0);
            setBoosterRemaining(user.boosterVotesRemaining ?? 0);
            setVotesTotal(user.votesTotal ?? 0);
        }
    }, [user]);

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
                    const allVideos: { id: string; voteCount?: number; requiredVotes?: number }[] = vd.videos || [];
                    setCommunityVideos(allVideos.slice(0, 4));

                    // Community notification — pop up once per member the first time they see
                    // a cause that has crossed 100% funding. "Seen" ids are remembered locally
                    // so the same milestone doesn't re-announce itself on every visit.
                    const seenKey = 'ffa_seen_milestones';
                    const seen: string[] = JSON.parse(localStorage.getItem(seenKey) || '[]');
                    const newlyFunded = allVideos.find(v =>
                        (v.requiredVotes ?? 0) > 0 &&
                        (v.voteCount ?? 0) >= (v.requiredVotes ?? 0) &&
                        !seen.includes(v.id)
                    );
                    if (newlyFunded) {
                        localStorage.setItem(seenKey, JSON.stringify([...seen, newlyFunded.id]));
                        setCommunityMilestone({ id: newlyFunded.id });
                    }
                }
                if (votesRes.ok) {
                    const votesData = await votesRes.json();
                    const used = ((votesData.userVotes ?? []) as { count: number }[]).reduce((s, v) => s + v.count, 0);
                    const planTotal = user.votesTotal ?? 0;
                    setVotesTotal(planTotal);
                    setVotesRemaining(user.votesRemaining ?? 0);
                    setBoosterRemaining(user.boosterVotesRemaining ?? 0);
                    setStats({ totalVotes: used, activeCauses: (votesData.causes ?? []).length, memberSince: user.joinedAt });
                }
            } catch {
                setStats({ totalVotes: 0, activeCauses: 0 });
            } finally { setLoading(false); }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, user?.votesTotal, user?.boosterVotesRemaining, user?.plan, user?.votesRemaining, dataVersion]);

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

    const memberSinceFormatted = stats?.memberSince
        ? new Date(stats.memberSince).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : '—';

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

    const quickLinks = [
        { icon: <Trophy size={22} />, label: 'Vote / Donate', desc: 'Allocate your votes to causes', href: '/dashboard/vote', color: '#fbbf24', bg: 'linear-gradient(135deg, rgba(245,158,11,0.16), rgba(245,158,11,0.06))' },
        { icon: <Zap size={22} />, label: 'Submit a Video', desc: 'Share a reel for a cause', href: '/dashboard/submit', color: '#a78bfa', bg: 'linear-gradient(135deg, rgba(139,92,246,0.16), rgba(139,92,246,0.06))' },
        { icon: <TrendingUp size={22} />, label: 'Leaderboard', desc: 'See who\'s leading the race', href: '/dashboard/leaderboard', color: '#34d399', bg: 'linear-gradient(135deg, rgba(16,185,129,0.16), rgba(16,185,129,0.06))' },
        { icon: <Flame size={22} />, label: 'Buy More Votes', desc: 'Top up to support more causes', href: '/dashboard/subscription', color: '#f87171', bg: 'linear-gradient(135deg, rgba(248,113,113,0.16), rgba(248,113,113,0.06))' },
    ];

    return (
        <div className={styles.dashboardRoot}>

            {/* ── Hero Card ─────────────────────────────────── */}
            <div className={styles.heroCard}>
                <div className={`${styles.heroBgContainer} ${styles.heroBgDesktopOnly}`}>
                    {DESKTOP_HERO_IMAGES.map((src, index) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={src}
                            src={src}
                            alt=""
                            className={`${styles.heroBgImage} ${index === currentHeroImageIndex ? styles.heroBgActive : ''}`}
                        />
                    ))}
                </div>
                <div className={`${styles.heroBgContainer} ${styles.heroBgMobileOnly}`}>
                    {MOBILE_HERO_IMAGES.map((src, index) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={src}
                            src={src}
                            alt=""
                            className={`${styles.heroBgImage} ${index === currentHeroImageIndex ? styles.heroBgActive : ''}`}
                        />
                    ))}
                </div>
                <div style={{ position: 'relative', zIndex: 3 }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>
                        Welcome back, {firstName}!
                    </p>
                    <h1 className={styles.heroTagline}>
                        Change lives.<br />
                        One <span className={styles.heroTaglineAccent}>Vote at</span><br />
                        a time.
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '20px', maxWidth: '320px', lineHeight: 1.55 }}>
                        Your votes help bring hope, faith, and support to those who need it most.
                    </p>
                    <div className={styles.heroCtaRow}>
                        {user?.plan ? (
                            <button onClick={() => { haptics.tap(); router.push('/dashboard/campaigns'); }} className={styles.heroBtnPrimary}>
                                Browse Campaigns
                            </button>
                        ) : (
                            <button onClick={() => { haptics.tap(); router.push('/dashboard/subscription'); }} className={styles.heroBtnPrimary}>
                                Purchase Plan
                            </button>
                        )}
                        <button onClick={() => { haptics.tap(); setShowHowItWorks(true); }} className={styles.heroBtnSecondary}>
                            ▶ How it Works
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Stat Strip ────────────────────────────────── */}
            <div className={styles.statStrip}>
                {[
                    {
                        value: votesTotal > 0 ? `${votesRemaining + boosterRemaining}/${votesTotal}` : '0',
                        label: 'Votes Remain',
                        icon: <Users size={24} color="#ff5e62" fill="#ff5e62" className={styles.statIcon} />
                    },
                    {
                        value: stats?.activeCauses ?? 0,
                        label: 'Active Campaigns',
                        icon: <Flame size={24} color="#ec4899" fill="#ec4899" className={styles.statIcon} />
                    },
                    {
                        value: stats?.totalVotes ?? 0,
                        label: 'Votes Casted',
                        icon: (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.statIcon}>
                                <circle cx="12" cy="12" r="9" />
                                <text x="12" y="16" fontSize="12" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" fill="#eab308">1</text>
                            </svg>
                        )
                    },
                    {
                        value: stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : '—',
                        label: 'Member Since',
                        icon: <Calendar size={24} color="#10b981" className={styles.statIcon} />
                    },
                ].map((s, i) => (
                    <div key={i} className={styles.statStripItem}>
                        <div className={styles.statIconWrapper}>{s.icon}</div>
                        <div className={styles.statStripValue}>{s.value}</div>
                        <div className={styles.statStripLabel}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Trending Campaign ─────────────────────────── */}
            <div className={styles.featuredSection}>
                <div className={styles.sectionHeader}>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '2px' }}>Trending Campaign</h2>
                    <button onClick={() => { haptics.tap(); router.push('/dashboard/campaigns'); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#F8C38F', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                        View all <ArrowRight size={14} />
                    </button>
                </div>

                {communityVideos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: '#15131f', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><Film size={40} color="rgba(255,255,255,0.25)" /></div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>No campaigns yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className={styles.campaignGrid}>
                        {communityVideos.map((video) => (
                            <div
                                key={video.id}
                                onClick={() => { haptics.tap(); setSelectedVideo(video); }}
                                onMouseEnter={() => setHoveredCard(video.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className={styles.campaignCard}
                                style={{
                                    boxShadow: hoveredCard === video.id ? '0 16px 48px rgba(231,66,27,0.18)' : undefined,
                                    transform: hoveredCard === video.id ? 'translateY(-6px)' : undefined,
                                }}
                            >
                                {video.thumbnailUrl ? (
                                    <img src={video.thumbnailUrl} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hoveredCard === video.id ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.4s' }} />
                                ) : video.videoUrl ? (
                                    <video src={video.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} preload="metadata" muted playsInline />
                                ) : null}
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />

                                {/* TRENDING pill */}
                                <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'linear-gradient(135deg, #F8C38F, #E7421B)', color: 'white', fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                    TRENDING
                                </div>

                                {/* Cause pill */}
                                {video.causeTag && (
                                    <div style={{ position: 'absolute', top: '40px', left: '12px', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
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
                                        <Flame size={12} color="#ffffff" />
                                        <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: 700 }}>
                                            {video.voteCount ?? 0}{video.requiredVotes ? ` / ${video.requiredVotes}` : ''} votes
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Quick Actions ─────────────────────────────── */}
            <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>Quick Actions</h2>
                <div className={styles.quickGrid}>
                    {quickLinks.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={e => { e.preventDefault(); haptics.tap(); router.push(link.href); }}
                            className={styles.quickCard}
                            style={{ background: link.bg }}
                        >
                            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: link.color, marginBottom: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                                {link.icon}
                            </div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {link.label} <ArrowRight size={14} color="rgba(255,255,255,0.4)" />
                            </div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{link.desc}</div>
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

            {showCelebration && (
                <PurchaseCelebrationModal
                    onClose={() => setShowCelebration(false)}
                    message="Your membership subscription was activated successfully! You now have voting power and full video access."
                />
            )}

            {/* How it Works — placeholder until the final production video is delivered */}
            {showHowItWorks && (
                <div
                    onClick={() => setShowHowItWorks(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.85)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
                    }}
                >
                    <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: '840px' }}>
                        <button
                            onClick={() => setShowHowItWorks(false)}
                            aria-label="Close video"
                            style={{
                                position: 'absolute', top: '-44px', right: 0, width: '36px', height: '36px',
                                borderRadius: '50%', border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.08)',
                                color: 'white', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            ✕
                        </button>
                        <video
                            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                            controls
                            autoPlay
                            style={{ width: '100%', borderRadius: '16px', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', background: '#000' }}
                        />
                    </div>
                </div>
            )}

            {/* Community notification — a cause just crossed 100% funding */}
            {communityMilestone && (
                <div
                    role="status"
                    style={{
                        position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)',
                        zIndex: 1000, width: 'min(420px, calc(100vw - 32px))',
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                        padding: '16px 18px', borderRadius: '16px',
                        background: 'rgba(20,17,31,0.96)', backdropFilter: 'blur(12px)',
                        border: '1.5px solid rgba(248,195,143,0.25)',
                        boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                        animation: 'communityMilestoneSlideIn 0.4s cubic-bezier(0.16,1,0.3,1)',
                    }}
                >
                    <span style={{ fontSize: '22px', lineHeight: 1 }}>❤️</span>
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#ffffff', lineHeight: 1.5 }}>
                            Another Faith Fighters family member has received the support they needed because of our community.
                        </p>
                    </div>
                    <button
                        onClick={() => setCommunityMilestone(null)}
                        aria-label="Dismiss notification"
                        style={{
                            background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
                            cursor: 'pointer', fontSize: '16px', padding: '2px', lineHeight: 1, flexShrink: 0,
                        }}
                    >
                        ✕
                    </button>
                    <style>{`
                        @keyframes communityMilestoneSlideIn {
                            from { opacity: 0; transform: translate(-50%, -16px); }
                            to { opacity: 1; transform: translate(-50%, 0); }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}

function PurchaseCelebrationModal({ onClose, message }: { onClose: () => void; message: string }) {
    return (
        <div 
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                boxSizing: 'border-box'
            }}
            onClick={onClose}
        >
            <div 
                onClick={e => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '480px',
                    height: 'min(640px, 90vh)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    backgroundImage: 'url(/images/vote_celebration.svg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '48px 24px 32px',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
                    border: '1.5px solid rgba(255,255,255,0.08)',
                    animation: 'vpm_slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
                    boxSizing: 'border-box',
                    color: '#ffffff'
                }}
            >
                {/* Dark gradient scrim so the title/text stays legible over the background art */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.05) 55%, transparent 65%)',
                    pointerEvents: 'none',
                }} />

                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '1.5px solid rgba(255,255,255,0.2)',
                        background: 'rgba(15,23,42,0.6)',
                        backdropFilter: 'blur(8px)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        zIndex: 10
                    }}
                >
                    <X size={18} />
                </button>

                {/* Top Section */}
                <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', textAlign: 'center' }}>
                    {/* Checkmark Circle Icon */}
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        border: '3px solid #ff7b5a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        background: 'rgba(255, 123, 90, 0.1)',
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff7b5a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 10px', color: '#ffffff', letterSpacing: '-0.5px' }}>
                        Purchase Successful!
                    </h2>

                    <p style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px', color: 'rgba(255,255,255,0.9)' }}>
                        Thank you for your <span style={{ color: '#ff7b5a' }}>contribution!</span>
                    </p>

                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5, padding: '0 12px' }}>
                        {message}
                    </p>
                </div>

                {/* Bottom Section */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '16px', zIndex: 10 }}>
                    {/* Supporting Card */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px 20px',
                        borderRadius: '16px',
                        background: 'rgba(15, 13, 23, 0.65)',
                        backdropFilter: 'blur(12px)',
                        border: '1.5px solid rgba(255, 255, 255, 0.08)',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}>
                        {/* Heart Icon Circle */}
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ff7b5a, #e7421b)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(231, 66, 27, 0.3)',
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'left' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                                Thank you for <span style={{ color: '#ff7b5a' }}>Supporting!</span>
                            </span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.3 }}>
                                Together we can bring hope and rebuild lives
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={onClose}
                        style={{
                            width: '100%',
                            padding: '14px 20px',
                            borderRadius: '50px',
                            background: 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 6px 20px rgba(231, 66, 27, 0.4)',
                            transition: 'transform 0.2s',
                        }}
                    >
                        Great!
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes vpm_slideUp { from { transform:translateY(24px);opacity:0 } to { transform:translateY(0);opacity:1 } }
            `}</style>
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
