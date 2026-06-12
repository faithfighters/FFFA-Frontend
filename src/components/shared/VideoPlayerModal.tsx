'use client';

import { X, Play, Pause, Volume2, VolumeX, ThumbsUp, ChevronUp, ChevronDown, Flag, CheckCircle2, AlertCircle, Vote } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

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
}

// Deterministic particle burst for vote celebration (14 particles, evenly spread)
const VOTE_PARTICLES = [
    { dx:  68, dy:   0, size: 7, color: '#dc2626', round: true  },
    { dx:  56, dy:  38, size: 5, color: '#f59e0b', round: false },
    { dx:  30, dy:  58, size: 8, color: '#4ade80', round: true  },
    { dx:   0, dy:  70, size: 5, color: '#60a5fa', round: false },
    { dx: -30, dy:  58, size: 6, color: '#fbbf24', round: true  },
    { dx: -56, dy:  38, size: 5, color: '#f87171', round: false },
    { dx: -68, dy:   0, size: 8, color: '#a78bfa', round: true  },
    { dx: -56, dy: -38, size: 5, color: '#dc2626', round: false },
    { dx: -30, dy: -58, size: 7, color: '#f59e0b', round: true  },
    { dx:   0, dy: -70, size: 5, color: '#4ade80', round: false },
    { dx:  30, dy: -58, size: 6, color: '#60a5fa', round: true  },
    { dx:  56, dy: -38, size: 5, color: '#fbbf24', round: false },
    { dx:  80, dy:  22, size: 6, color: '#f87171', round: true  },
    { dx: -80, dy: -22, size: 5, color: '#dc2626', round: false },
];
const PARTICLE_DURATIONS = [680, 720, 660, 750, 700, 680, 730, 660, 710, 690, 740, 670, 720, 700];

// 28 confetti pieces that fall from the top of the reel shell on vote success
// left: % across reel width | cx: horizontal drift px | cr: final rotation deg
const REEL_CONFETTI = [
    { left: 3,  size: 8,  color: '#dc2626', round: true,  delay: 0,   dur: 850,  cx:  12, cr: 360 },
    { left: 8,  size: 6,  color: '#f59e0b', round: false, delay: 70,  dur: 950,  cx:  -8, cr: 480 },
    { left: 14, size: 10, color: '#4ade80', round: true,  delay: 20,  dur: 800,  cx:  20, cr: 540 },
    { left: 19, size: 6,  color: '#60a5fa', round: false, delay: 140, dur: 900,  cx: -15, cr: 360 },
    { left: 24, size: 8,  color: '#a78bfa', round: true,  delay: 50,  dur: 1050, cx:  10, cr: 450 },
    { left: 29, size: 7,  color: '#fbbf24', round: false, delay: 190, dur: 750,  cx: -20, cr: 540 },
    { left: 34, size: 9,  color: '#f87171', round: true,  delay: 30,  dur: 1000, cx:  18, cr: 360 },
    { left: 39, size: 6,  color: '#dc2626', round: false, delay: 110, dur: 850,  cx: -12, cr: 480 },
    { left: 44, size: 8,  color: '#f59e0b', round: true,  delay: 60,  dur: 950,  cx:  25, cr: 540 },
    { left: 49, size: 7,  color: '#4ade80', round: false, delay: 170, dur: 800,  cx: -18, cr: 360 },
    { left: 54, size: 9,  color: '#60a5fa', round: true,  delay: 0,   dur: 900,  cx:   8, cr: 450 },
    { left: 59, size: 6,  color: '#a78bfa', round: false, delay: 90,  dur: 1100, cx: -25, cr: 540 },
    { left: 64, size: 8,  color: '#fbbf24', round: true,  delay: 240, dur: 750,  cx:  15, cr: 360 },
    { left: 69, size: 7,  color: '#f87171', round: false, delay: 40,  dur: 1000, cx: -10, cr: 480 },
    { left: 74, size: 10, color: '#dc2626', round: true,  delay: 120, dur: 850,  cx:  22, cr: 540 },
    { left: 79, size: 6,  color: '#f59e0b', round: false, delay: 80,  dur: 950,  cx:  -8, cr: 360 },
    { left: 84, size: 8,  color: '#4ade80', round: true,  delay: 160, dur: 800,  cx:  12, cr: 450 },
    { left: 89, size: 7,  color: '#60a5fa', round: false, delay: 10,  dur: 900,  cx: -20, cr: 540 },
    { left: 94, size: 9,  color: '#a78bfa', round: true,  delay: 100, dur: 1050, cx:  18, cr: 360 },
    { left: 97, size: 6,  color: '#fbbf24', round: false, delay: 210, dur: 750,  cx: -15, cr: 480 },
    { left: 6,  size: 7,  color: '#f87171', round: true,  delay: 290, dur: 950,  cx:   8, cr: 540 },
    { left: 16, size: 8,  color: '#dc2626', round: false, delay: 150, dur: 850,  cx: -22, cr: 360 },
    { left: 26, size: 6,  color: '#f59e0b', round: true,  delay: 270, dur: 800,  cx:  15, cr: 450 },
    { left: 36, size: 9,  color: '#4ade80', round: false, delay: 130, dur: 900,  cx: -18, cr: 540 },
    { left: 46, size: 7,  color: '#60a5fa', round: true,  delay: 320, dur: 1000, cx:  25, cr: 360 },
    { left: 56, size: 8,  color: '#a78bfa', round: false, delay: 180, dur: 750,  cx: -12, cr: 480 },
    { left: 66, size: 6,  color: '#fbbf24', round: true,  delay: 230, dur: 1100, cx:  20, cr: 540 },
    { left: 76, size: 9,  color: '#f87171', round: false, delay: 340, dur: 850,  cx: -25, cr: 360 },
];

interface Cause {
    id: string;
    name: string;
    category: string;
    totalVotes?: number;
}

interface VideoPlayerModalProps {
    videos: Video[];
    initialIndex?: number;
    onClose: () => void;
    currentUserId?: string;
    votesRemaining?: number;
    votesTotal?: number;
    onVoteCast?: (newRemaining: number) => void;
}

export default function VideoPlayerModal({
    videos,
    initialIndex = 0,
    onClose,
    currentUserId,
    votesRemaining = 0,
    votesTotal = 0,
    onVoteCast,
}: VideoPlayerModalProps) {
    const [idx, setIdx] = useState(Math.max(0, Math.min(initialIndex, videos.length - 1)));
    const video = videos[idx];

    // Map of video array index → HTMLVideoElement (covers render window ±2)
    const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
    const touchStartY = useRef<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [reporting, setReporting] = useState(false);
    const [panelOpen, setPanelOpen] = useState(false);
    // Per-video landscape detection
    const [landscapeMap, setLandscapeMap] = useState<Map<string, boolean>>(new Map());
    const isLandscape = video ? (landscapeMap.get(video.id) ?? false) : false;

    const [matchedCause, setMatchedCause] = useState<Cause | null>(null);
    const [causeLoading, setCauseLoading] = useState(true);
    const [myVotes, setMyVotes] = useState(0);
    const [pendingVotes, setPendingVotes] = useState(0);
    const [localRemaining, setLocalRemaining] = useState(votesRemaining);
    const [votingStatus, setVotingStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [voteError, setVoteError] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);

    const isOwnReel = !!currentUserId && !!video?.authorId && currentUserId === video.authorId;

    useEffect(() => {
        if (votingStatus !== 'success') return;
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([15, 60, 25]);
        const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reducedMotion) {
            setShowCelebration(true);
            const t = setTimeout(() => setShowCelebration(false), 1500);
            return () => clearTimeout(t);
        }
    }, [votingStatus]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    useEffect(() => { setLocalRemaining(votesRemaining); }, [votesRemaining]);

    // Play active video, pause all others — fires after idx change
    useEffect(() => {
        videoRefs.current.forEach((el, i) => {
            if (i === idx) {
                el.muted = isMuted;
                el.play().catch(() => {});
            } else {
                el.pause();
                el.currentTime = 0;
            }
        });
        setIsPlaying(true);
        setPanelOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idx]);

    // Reset per-video UI state and fetch cause when active video changes
    useEffect(() => {
        setMyVotes(0);
        setPendingVotes(0);
        setVotingStatus('idle');
        setVoteError('');
        setMatchedCause(null);
        setCauseLoading(true);

        if (!video) return;

        const tag = video.causeTag?.toLowerCase() ?? '';
        const tagWords = tag.split(/\s+/).filter(Boolean);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const normalize = (c: any) => {
            if (!c || typeof c !== 'object') return null;
            const id: string | undefined = c.id || c._id?.toString();
            if (!id || !c.name) return null;
            return { ...c, id } as Cause;
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const scoreCause = (c: any) => {
            const name = (c.name ?? '').toLowerCase();
            const cat  = (c.category ?? '').toLowerCase();
            if (cat === tag || name === tag) return 100;
            if (tag.includes(cat) || cat.includes(tag)) return 80;
            if (name.includes(tag) || tag.includes(name)) return 70;
            const words = [...name.split(/\s+/), ...cat.split(/\s+/)];
            const overlap = tagWords.filter(w => words.some(cw => cw.includes(w) || w.includes(cw))).length;
            return overlap > 0 ? overlap * 10 : -1;
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const matchCause = (causes: any[]) => {
            const scored = causes.map(c => ({ c, s: scoreCause(c) })).filter(x => x.s >= 0);
            if (!scored.length) return null;
            scored.sort((a, b) => b.s - a.s);
            return scored[0].c;
        };

        fetch('/api/votes', { credentials: 'include' })
            .then(r => r.json())
            .then(async data => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const cycleCauses: any[] = (data.causes ?? []).map(normalize).filter(Boolean);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const userVotes: any[] = data.userVotes ?? [];
                let found = matchCause(cycleCauses);
                if (!found) {
                    try {
                        const allRes = await fetch('/api/causes?status=active', { credentials: 'include' });
                        if (allRes.ok) {
                            const allData = await allRes.json();
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            found = matchCause((allData.causes ?? [] as any[]).map(normalize).filter(Boolean));
                        }
                    } catch { /* ignore */ }
                }
                setMatchedCause(found ?? null);
                if (found) {
                    const foundId = found.id;
                    const existing = userVotes.find(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (v: any) => v.causeId === foundId || v.causeId === found._id?.toString()
                    );
                    if (existing) setMyVotes(existing.count);
                }
            })
            .catch(() => setMatchedCause(null))
            .finally(() => setCauseLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [video?.id]);

    // Instant navigation — no artificial delay, CSS transition handles the feel
    const goTo = useCallback((next: number) => {
        if (next < 0 || next >= videos.length) return;
        setIdx(next);
    }, [videos.length]);

    // Keyboard nav
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { if (panelOpen) setPanelOpen(false); else onClose(); }
            if (e.key === 'ArrowDown') goTo(idx + 1);
            if (e.key === 'ArrowUp') goTo(idx - 1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [idx, goTo, onClose, panelOpen]);

    if (!video) return null;

    const togglePlay = () => {
        const el = videoRefs.current.get(idx);
        if (!el) return;
        if (isPlaying) { el.pause(); setIsPlaying(false); }
        else { el.play().catch(() => {}); setIsPlaying(true); }
    };

    const toggleMute = () => {
        const newMuted = !isMuted;
        videoRefs.current.forEach(el => { el.muted = newMuted; });
        setIsMuted(newMuted);
    };

    const handleReport = async () => {
        const reason = prompt('Enter the reason for reporting this video:', 'Inappropriate content');
        if (reason === null) return;
        setReporting(true);
        try {
            const res = await fetch(`/api/videos/${video.id}/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason }),
            });
            if (res.ok) alert('Thank you! This reel has been flagged for review.');
            else alert('Failed to report this video.');
        } catch { alert('An error occurred while reporting.'); }
        finally { setReporting(false); }
    };

    const stagedTotal = myVotes + pendingVotes;
    const stagedRemaining = localRemaining - pendingVotes;

    const adjustPending = (change: 1 | -1) => {
        if (change > 0 && stagedRemaining < 1) return;
        if (change < 0 && stagedTotal < 1) return;
        setPendingVotes(p => p + change);
    };

    const submitVotes = async () => {
        if (!matchedCause || stagedTotal === myVotes) return;
        setVotingStatus('saving');
        setVoteError('');
        try {
            const causeId = matchedCause.id || (matchedCause as { _id?: { toString(): string } })._id?.toString();
            if (!causeId) {
                setVotingStatus('error');
                setVoteError('Could not identify cause. Please try again.');
                setTimeout(() => { setVotingStatus('idle'); setVoteError(''); }, 3000);
                return;
            }
            const res = await fetch('/api/votes', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ allocation: { [causeId]: stagedTotal } }),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                setVotingStatus('error');
                setVoteError(errData.message || 'Failed to save vote.');
                setTimeout(() => { setVotingStatus('idle'); setVoteError(''); }, 3000);
            } else {
                setMyVotes(stagedTotal);
                setPendingVotes(0);
                setLocalRemaining(stagedRemaining);
                setPanelOpen(false);
                setVotingStatus('success');
                onVoteCast?.(stagedRemaining);
                setTimeout(() => {
                    setVotingStatus('idle');
                }, 1800);
            }
        } catch {
            setVotingStatus('error');
            setVoteError('Network error. Please try again.');
            setTimeout(() => { setVotingStatus('idle'); setVoteError(''); }, 3000);
        }
    };

    const shellDimensions = {
        width: 'min(390px, 100vw)',
        height: 'min(calc(min(390px, 100vw) * 16 / 9), 100dvh)',
    };

    // Render window: idx-1 (preloaded above), idx (active), idx+1 (preloaded below), idx+2 (buffering ahead)
    const renderWindow = [idx - 1, idx, idx + 1, idx + 2].filter(i => i >= 0 && i < videos.length);

    const votingPanel = () => {
        if (causeLoading) return <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Loading vote info…</p>;
        if (isOwnReel) return <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>You cannot vote on your own reel.</p>;
        if (!matchedCause) return <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>No active voting cycle for this cause.</p>;

        const hasChange = stagedTotal !== myVotes;
        const submitLabel = votingStatus === 'saving'
            ? 'Saving…'
            : myVotes > 0
                ? `Update to ${stagedTotal} Vote${stagedTotal !== 1 ? 's' : ''}`
                : `Give ${stagedTotal} Vote${stagedTotal !== 1 ? 's' : ''}`;

        return (
            <div>
                {/* Cause header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <Vote size={14} color="rgba(255,255,255,0.6)" />
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0, fontWeight: 600 }}>
                        Voting for &ldquo;{matchedCause.name}&rdquo;
                    </p>
                </div>

                {matchedCause.totalVotes !== undefined && (
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>
                        {matchedCause.totalVotes.toLocaleString()} total votes cast for this cause
                    </div>
                )}

                {/* Already-submitted indicator */}
                {myVotes > 0 ? (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 12px', borderRadius: '10px', marginBottom: '14px',
                        background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)',
                    }}>
                        <CheckCircle2 size={14} color="#4ade80" />
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80' }}>
                            You&apos;ve already given <strong>{myVotes} vote{myVotes !== 1 ? 's' : ''}</strong> to this cause
                        </span>
                    </div>
                ) : (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 12px', borderRadius: '10px', marginBottom: '14px',
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                        <Vote size={14} color="rgba(255,255,255,0.4)" />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
                            You haven&apos;t voted for this cause yet
                        </span>
                    </div>
                )}

                {/* Vote counter row */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                    {showCelebration && (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none', zIndex: 50 }}>
                            {VOTE_PARTICLES.map((p, i) => (
                                <div
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        width: `${p.size}px`,
                                        height: `${p.size}px`,
                                        borderRadius: p.round ? '50%' : '2px',
                                        background: p.color,
                                        ['--vx' as string]: `${p.dx}px`,
                                        ['--vy' as string]: `${p.dy}px`,
                                        animation: `vpm_particle ${PARTICLE_DURATIONS[i]}ms cubic-bezier(0.25,0.46,0.45,0.94) forwards`,
                                    } as React.CSSProperties & Record<string, string>}
                                />
                            ))}
                        </div>
                    )}
                    <button
                        onClick={() => adjustPending(-1)}
                        disabled={stagedTotal < 1 || votingStatus === 'saving'}
                        style={voteCtrlBtn(stagedTotal < 1 || votingStatus === 'saving', false)}
                        aria-label="Remove vote"
                    >−</button>
                    <div style={{ textAlign: 'center', minWidth: '64px' }}>
                        <div style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>{stagedTotal}</div>
                        <div style={{ fontSize: '11px', color: pendingVotes !== 0 ? '#fbbf24' : 'rgba(255,255,255,0.45)', fontWeight: 700, marginTop: '2px' }}>
                            {pendingVotes > 0 ? `+${pendingVotes} staging` : pendingVotes < 0 ? `${pendingVotes} removing` : 'votes'}
                        </div>
                    </div>
                    <button
                        onClick={() => adjustPending(1)}
                        disabled={stagedRemaining < 1 || votingStatus === 'saving'}
                        style={voteCtrlBtn(stagedRemaining < 1 || votingStatus === 'saving', true)}
                        aria-label="Add vote"
                    >+</button>
                    {hasChange && votingStatus !== 'success' && (
                        <button
                            onClick={submitVotes}
                            disabled={votingStatus === 'saving'}
                            style={{
                                flex: 1, padding: '10px', borderRadius: '12px', border: 'none',
                                backgroundColor: votingStatus === 'saving' ? 'rgba(255,255,255,0.15)' : '#dc2626',
                                color: '#ffffff', fontSize: '13px', fontWeight: 700,
                                cursor: votingStatus === 'saving' ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit',
                            }}
                        >
                            {submitLabel}
                        </button>
                    )}
                </div>

                {/* Pending breakdown: "1 saved + 2 staging = 3 total" */}
                {myVotes > 0 && pendingVotes !== 0 && (
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px', paddingLeft: '2px' }}>
                        {myVotes} confirmed&nbsp;
                        <span style={{ color: pendingVotes > 0 ? '#fbbf24' : '#fca5a5' }}>
                            {pendingVotes > 0 ? `+ ${pendingVotes} staging` : `− ${Math.abs(pendingVotes)} removing`}
                        </span>
                        &nbsp;= {stagedTotal} total
                    </div>
                )}

                {(votingStatus !== 'idle' || voteError) && (
                    <div style={{
                        fontSize: '12px', fontWeight: 600, padding: '8px 12px', borderRadius: '10px',
                        marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px',
                        backgroundColor: votingStatus === 'success' ? 'rgba(22,163,74,0.25)' : 'rgba(220,38,38,0.25)',
                        color: votingStatus === 'success' ? '#4ade80' : '#fca5a5',
                    }}>
                        {votingStatus === 'success'
                            ? <><CheckCircle2 size={14} /> Votes updated! Returning to reel…</>
                            : <><AlertCircle size={14} /> {voteError}</>
                        }
                    </div>
                )}
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                    {stagedRemaining} of {votesTotal} votes remaining
                </div>
            </div>
        );
    };

    return (
        <div
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.92)', animation: 'vpm_fadeIn 0.2s ease-out' }}
            onClick={() => {
                if (panelOpen) setPanelOpen(false);
                else onClose();
            }}
        >
            <style>{`
                @keyframes vpm_fadeIn { from { opacity:0 } to { opacity:1 } }
                @keyframes vpm_slideUp { from { transform:translateY(20px);opacity:0 } to { transform:translateY(0);opacity:1 } }
                @keyframes vpm_particle {
                    0%   { transform: translate(-50%,-50%) scale(1.2); opacity: 1; }
                    60%  { opacity: 0.85; }
                    100% { transform: translate(calc(-50% + var(--vx)), calc(-50% + var(--vy))) scale(0.1); opacity: 0; }
                }
                @keyframes vpm_pop {
                    0%   { transform: scale(1); }
                    35%  { transform: scale(1.55); }
                    65%  { transform: scale(0.88); }
                    100% { transform: scale(1); }
                }
                @keyframes vpm_confetti {
                    0%   { opacity: 1; transform: translateY(-20px) translateX(0) rotate(0deg); }
                    85%  { opacity: 0.9; }
                    100% { opacity: 0; transform: translateY(110vh) translateX(var(--cx)) rotate(var(--cr)); }
                }
                @media (max-width: 600px) {
                    .vpm-shell { width:100vw !important; height:100dvh !important; max-height:none !important; border-radius:0 !important; }
                    .vpm-nav { display:none !important; }
                    .vpm-dots { display:none !important; }
                }
            `}</style>

            {/* Left nav */}
            {videos.length > 1 && (
                <div className="vpm-nav" style={{ position: 'absolute', left: 'calc(50% - min(390px,100vw)/2 - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', zIndex: 10 }}>
                    <button
                        onClick={e => { e.stopPropagation(); goTo(idx - 1); }}
                        disabled={idx === 0}
                        style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: idx === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: idx === 0 ? 'rgba(255,255,255,0.3)' : 'white', cursor: idx === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <ChevronUp size={20} />
                    </button>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap' }}>{idx + 1} / {videos.length}</span>
                    <button
                        onClick={e => { e.stopPropagation(); goTo(idx + 1); }}
                        disabled={idx === videos.length - 1}
                        style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: idx === videos.length - 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: idx === videos.length - 1 ? 'rgba(255,255,255,0.3)' : 'white', cursor: idx === videos.length - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <ChevronDown size={20} />
                    </button>
                </div>
            )}

            {/* Right dots */}
            {videos.length > 1 && (
                <div className="vpm-dots" style={{ position: 'absolute', right: 'calc(50% - min(390px,100vw)/2 - 24px)', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', zIndex: 10 }}>
                    {videos.map((_, i) => (
                        <button
                            key={i}
                            onClick={e => { e.stopPropagation(); goTo(i); }}
                            style={{ width: '8px', height: i === idx ? '24px' : '8px', borderRadius: '99px', border: 'none', background: i === idx ? '#dc2626' : 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: 0, transition: 'all 0.25s', flexShrink: 0 }}
                        />
                    ))}
                </div>
            )}

            {/* Reel shell */}
            <div
                className="vpm-shell"
                style={{
                    position: 'relative',
                    width: shellDimensions.width,
                    height: shellDimensions.height,
                    maxHeight: '100dvh',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    backgroundColor: '#000',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
                    animation: 'vpm_slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
                }}
                onClick={e => {
                    e.stopPropagation();
                    if (panelOpen) setPanelOpen(false);
                }}
                onTouchStart={e => { touchStartY.current = e.touches[0].clientY; }}
                onTouchEnd={e => {
                    if (touchStartY.current === null) return;
                    const dy = touchStartY.current - e.changedTouches[0].clientY;
                    touchStartY.current = null;
                    if (Math.abs(dy) < 50) return;
                    if (dy > 0) goTo(idx + 1);
                    else goTo(idx - 1);
                }}
            >
                {/* ── Video stack: renders current ±1 and ±2 for preloading ── */}
                {renderWindow.map(i => {
                    const v = videos[i];
                    const offset = i - idx; // -1 above, 0 visible, 1 below, 2 buffering
                    const landscape = landscapeMap.get(v.id) ?? false;
                    return (
                        <video
                            key={v.id}
                            ref={el => { if (el) videoRefs.current.set(i, el); else videoRefs.current.delete(i); }}
                            src={v.videoUrl}
                            preload="auto"
                            loop
                            playsInline
                            muted={isMuted}
                            onLoadedMetadata={e => {
                                const el = e.currentTarget;
                                if (el.videoWidth && el.videoHeight) {
                                    setLandscapeMap(prev => {
                                        const next = new Map(prev);
                                        next.set(v.id, el.videoWidth > el.videoHeight);
                                        return next;
                                    });
                                }
                            }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: landscape ? 'contain' : 'cover',
                                backgroundColor: '#000',
                                cursor: 'pointer',
                                // TikTok-style vertical slide
                                transform: `translateY(${offset * 100}%)`,
                                transition: 'transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
                                willChange: 'transform',
                                // idx+2 is off-screen (200%) — keeps it out of view but buffering
                            }}
                            onClick={e => { e.stopPropagation(); if (i === idx) togglePlay(); }}
                        />
                    );
                })}

                {/* Gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 25%, transparent 50%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.9) 100%)', pointerEvents: 'none', zIndex: 5 }} />

                {/* Reel-level confetti — above gradient, below controls, clipped by shell overflow:hidden */}
                {showCelebration && (
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 12, overflow: 'hidden' }}>
                        {REEL_CONFETTI.map((p, i) => (
                            <div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    left: `${p.left}%`,
                                    top: 0,
                                    width: `${p.size}px`,
                                    height: `${p.size}px`,
                                    borderRadius: p.round ? '50%' : '2px',
                                    background: p.color,
                                    willChange: 'transform, opacity',
                                    ['--cx' as string]: `${p.cx}px`,
                                    ['--cr' as string]: `${p.cr}deg`,
                                    animation: `vpm_confetti ${p.dur}ms ease-in ${p.delay}ms both`,
                                } as React.CSSProperties & Record<string, string>}
                            />
                        ))}
                    </div>
                )}

                {/* Top bar */}
                <div
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '16px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}
                    onClick={e => e.stopPropagation()}
                >
                    <span style={statusBadgeStyle(video.status)}>{video.status}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handleReport}
                            disabled={reporting}
                            style={{ border: 'none', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 700, padding: '6px 12px', borderRadius: '20px', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            <Flag size={12} /> {reporting ? '…' : 'Report'}
                        </button>
                        <button
                            onClick={onClose}
                            style={{ width: '36px', height: '36px', border: 'none', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Right side action buttons */}
                <div
                    style={{ position: 'absolute', right: '14px', bottom: panelOpen ? '340px' : '120px', display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center', zIndex: 20, transition: 'bottom 0.35s cubic-bezier(0.16,1,0.3,1)' }}
                    onClick={e => e.stopPropagation()}
                >
                    <button onClick={togglePlay} style={sideActionBtn} aria-label={isPlaying ? 'Pause' : 'Play'}>
                        {isPlaying ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" style={{ marginLeft: '2px' }} />}
                    </button>
                    <button onClick={toggleMute} style={sideActionBtn} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                        {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <button
                            onClick={() => setPanelOpen(p => !p)}
                            style={{ ...sideActionBtn, backgroundColor: panelOpen ? '#dc2626' : myVotes > 0 ? 'rgba(220,38,38,0.6)' : 'rgba(255,255,255,0.15)', animation: votingStatus === 'success' ? 'vpm_pop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards' : undefined }}
                            aria-label="Vote"
                        >
                            <ThumbsUp size={22} />
                            {myVotes > 0 && (
                                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#dc2626', color: 'white', fontSize: '10px', fontWeight: 800, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(0,0,0,0.4)' }}>
                                    {myVotes > 9 ? '9+' : myVotes}
                                </span>
                            )}
                        </button>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 4px rgba(0,0,0,0.6)', textAlign: 'center', lineHeight: 1 }}>
                            {causeLoading ? '…' : matchedCause?.totalVotes !== undefined
                                ? matchedCause.totalVotes >= 1000
                                    ? `${(matchedCause.totalVotes / 1000).toFixed(1)}k`
                                    : matchedCause.totalVotes.toString()
                                : '0'
                            }
                        </span>
                    </div>
                </div>

                {/* Bottom info bar */}
                <div
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 16px 16px', zIndex: 20 }}
                    onClick={e => e.stopPropagation()}
                >
                    <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#dc2626,#f87171)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: 'white', flexShrink: 0 }}>
                                {video.authorName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{video.authorName}</div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{video.causeTag}</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: '6px 0 0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {video.title}
                        </p>
                    </div>
                    <button
                        onClick={() => setPanelOpen(p => !p)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                    >
                        <ChevronUp size={16} />
                        Vote &amp; Details
                    </button>
                </div>

                {/* Slide-up voting panel */}
                <div
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30, backgroundColor: 'rgba(15,23,42,0.97)', backdropFilter: 'blur(20px)', borderRadius: '24px 24px 0 0', padding: '0 0 32px', transform: panelOpen ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)', maxHeight: '75%', overflowY: 'auto' }}
                    onClick={e => e.stopPropagation()}
                >
                    <div
                        onClick={() => setPanelOpen(false)}
                        style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px 12px', background: 'rgba(15,23,42,0.98)', borderBottom: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', borderRadius: '24px 24px 0 0' }}
                    >
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <ChevronDown size={18} color="white" />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Back to Reel</span>
                    </div>
                    <div style={{ padding: '16px 20px 0' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '0 0 4px', lineHeight: 1.3 }}>{video.title}</h2>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>{video.causeTag} Campaign</div>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: '20px', whiteSpace: 'pre-wrap' }}>{video.description || 'No description provided.'}</p>
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }} />
                        {votingPanel()}
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '20px 0 16px' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>Submitted By</div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{video.authorName}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>Upload Date</div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                                    {new Date(video.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Style helpers ─────────────────────────────────────────── */
const sideActionBtn: React.CSSProperties = {
    position: 'relative',
    width: '48px', height: '48px', borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s',
};

function statusBadgeStyle(status: string): React.CSSProperties {
    const map: Record<string, [string, string]> = {
        approved: ['rgba(22,163,74,0.25)', '#4ade80'],
        pending:  ['rgba(234,179,8,0.25)',  '#fde047'],
        rejected: ['rgba(220,38,38,0.25)',  '#fca5a5'],
    };
    const [bg, color] = map[status] ?? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.7)'];
    return {
        padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
        textTransform: 'capitalize', backgroundColor: bg, color,
        backdropFilter: 'blur(8px)', border: `1px solid ${color}40`,
    };
}

function voteCtrlBtn(disabled: boolean, isPrimary: boolean): React.CSSProperties {
    return {
        width: '44px', height: '44px', borderRadius: '50%', border: 'none',
        backgroundColor: disabled ? 'rgba(255,255,255,0.1)' : isPrimary ? '#dc2626' : 'rgba(255,255,255,0.15)',
        color: disabled ? 'rgba(255,255,255,0.3)' : '#ffffff',
        fontSize: '22px', fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        transition: 'all 0.2s',
        boxShadow: disabled ? 'none' : isPrimary ? '0 4px 16px rgba(220,38,38,0.5)' : 'none',
    };
}
