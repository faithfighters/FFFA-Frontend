'use client';

import { X, Play, Pause, Volume2, VolumeX, ThumbsUp, ChevronUp, ChevronDown, Flag, CheckCircle2, AlertCircle, Vote, Compass, Home, Activity, User, Flame, Menu, Zap, ShoppingBag } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { haptics } from '@/lib/haptics';
import { useAuth } from '@/context/AuthContext';
import { fireConfetti, playCheerSound } from '@/lib/celebrate';
import Lottie from 'lottie-react';
import confettiAnimation from '../../../public/images/Confetti.json';

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
    requiredVotes?: number;
    likesCount?: number;
    likedBy?: string[];
}

// Deterministic particle burst for vote celebration (14 particles, evenly spread)
const VOTE_PARTICLES = [
    { dx: 68, dy: 0, size: 7, color: '#dc2626', round: true },
    { dx: 56, dy: 38, size: 5, color: '#f59e0b', round: false },
    { dx: 30, dy: 58, size: 8, color: '#4ade80', round: true },
    { dx: 0, dy: 70, size: 5, color: '#60a5fa', round: false },
    { dx: -30, dy: 58, size: 6, color: '#fbbf24', round: true },
    { dx: -56, dy: 38, size: 5, color: '#f87171', round: false },
    { dx: -68, dy: 0, size: 8, color: '#a78bfa', round: true },
    { dx: -56, dy: -38, size: 5, color: '#dc2626', round: false },
    { dx: -30, dy: -58, size: 7, color: '#f59e0b', round: true },
    { dx: 0, dy: -70, size: 5, color: '#4ade80', round: false },
    { dx: 30, dy: -58, size: 6, color: '#60a5fa', round: true },
    { dx: 56, dy: -38, size: 5, color: '#fbbf24', round: false },
    { dx: 80, dy: 22, size: 6, color: '#f87171', round: true },
    { dx: -80, dy: -22, size: 5, color: '#dc2626', round: false },
];
const PARTICLE_DURATIONS = [680, 720, 660, 750, 700, 680, 730, 660, 710, 690, 740, 670, 720, 700];

// 28 confetti pieces that fall from the top of the reel shell on vote success
// left: % across reel width | cx: horizontal drift px | cr: final rotation deg
const REEL_CONFETTI = [
    { left: 3, size: 8, color: '#dc2626', round: true, delay: 0, dur: 850, cx: 12, cr: 360 },
    { left: 8, size: 6, color: '#f59e0b', round: false, delay: 70, dur: 950, cx: -8, cr: 480 },
    { left: 14, size: 10, color: '#4ade80', round: true, delay: 20, dur: 800, cx: 20, cr: 540 },
    { left: 19, size: 6, color: '#60a5fa', round: false, delay: 140, dur: 900, cx: -15, cr: 360 },
    { left: 24, size: 8, color: '#a78bfa', round: true, delay: 50, dur: 1050, cx: 10, cr: 450 },
    { left: 29, size: 7, color: '#fbbf24', round: false, delay: 190, dur: 750, cx: -20, cr: 540 },
    { left: 34, size: 9, color: '#f87171', round: true, delay: 30, dur: 1000, cx: 18, cr: 360 },
    { left: 39, size: 6, color: '#dc2626', round: false, delay: 110, dur: 850, cx: -12, cr: 480 },
    { left: 44, size: 8, color: '#f59e0b', round: true, delay: 60, dur: 950, cx: 25, cr: 540 },
    { left: 49, size: 7, color: '#4ade80', round: false, delay: 170, dur: 800, cx: -18, cr: 360 },
    { left: 54, size: 9, color: '#60a5fa', round: true, delay: 0, dur: 900, cx: 8, cr: 450 },
    { left: 59, size: 6, color: '#a78bfa', round: false, delay: 90, dur: 1100, cx: -25, cr: 540 },
    { left: 64, size: 8, color: '#fbbf24', round: true, delay: 240, dur: 750, cx: 15, cr: 360 },
    { left: 69, size: 7, color: '#f87171', round: false, delay: 40, dur: 1000, cx: -10, cr: 480 },
    { left: 74, size: 10, color: '#dc2626', round: true, delay: 120, dur: 850, cx: 22, cr: 540 },
    { left: 79, size: 6, color: '#f59e0b', round: false, delay: 80, dur: 950, cx: -8, cr: 360 },
    { left: 84, size: 8, color: '#4ade80', round: true, delay: 160, dur: 800, cx: 12, cr: 450 },
    { left: 89, size: 7, color: '#60a5fa', round: false, delay: 10, dur: 900, cx: -20, cr: 540 },
    { left: 94, size: 9, color: '#a78bfa', round: true, delay: 100, dur: 1050, cx: 18, cr: 360 },
    { left: 97, size: 6, color: '#fbbf24', round: false, delay: 210, dur: 750, cx: -15, cr: 480 },
    { left: 6, size: 7, color: '#f87171', round: true, delay: 290, dur: 950, cx: 8, cr: 540 },
    { left: 16, size: 8, color: '#dc2626', round: false, delay: 150, dur: 850, cx: -22, cr: 360 },
    { left: 26, size: 6, color: '#f59e0b', round: true, delay: 270, dur: 800, cx: 15, cr: 450 },
    { left: 36, size: 9, color: '#4ade80', round: false, delay: 130, dur: 900, cx: -18, cr: 540 },
    { left: 46, size: 7, color: '#60a5fa', round: true, delay: 320, dur: 1000, cx: 25, cr: 360 },
    { left: 56, size: 8, color: '#a78bfa', round: false, delay: 180, dur: 750, cx: -12, cr: 480 },
    { left: 66, size: 6, color: '#fbbf24', round: true, delay: 230, dur: 1100, cx: 20, cr: 540 },
    { left: 76, size: 9, color: '#f87171', round: false, delay: 340, dur: 850, cx: -25, cr: 360 },
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
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();
    const hasActivePlan = user?.role === 'admin' || !!user?.plan;
    const [idx, setIdx] = useState(Math.max(0, Math.min(initialIndex, videos.length - 1)));
    const video = videos[idx];

    // Map of video array index → HTMLVideoElement (covers render window ±2)
    const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
    // Indices with enough buffer ahead (or fully cached) to start clean playback —
    // gates .play() so we get a short spinner instead of a stutter-start on slow connections.
    const [bufferedReady, setBufferedReady] = useState<Set<number>>(new Set());
    // Note: the ref callback below is an inline function, recreated every render —
    // React calls it with `null` then the element again on every re-render (not just
    // on real mount/unmount), so readiness can only be *added* here, never cleared
    // from that branch, or a render triggered by marking readiness would immediately
    // erase it again in a self-perpetuating loop (this happened — the spinner never
    // cleared until this comment was written to explain why).
    const markBuffered = (i: number) => {
        setBufferedReady(prev => (prev.has(i) ? prev : new Set(prev).add(i)));
    };
    const touchStartY = useRef<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [reporting, setReporting] = useState(false);
    const [panelOpen, setPanelOpen] = useState(false);
    // Per-video landscape detection
    const [landscapeMap, setLandscapeMap] = useState<Map<string, boolean>>(new Map());
    const isLandscape = video ? (landscapeMap.get(video.id) ?? false) : false;

    // Like state mapped by video.id
    const [likesMap, setLikesMap] = useState<Map<string, { liked: boolean; likeCount: number }>>(new Map());
    const currentLikesState = video ? (likesMap.get(video.id) ?? {
        liked: !!currentUserId && !!video.likedBy && video.likedBy.includes(currentUserId),
        likeCount: video.likesCount ?? video.voteCount ?? 26
    }) : { liked: false, likeCount: 0 };

    const [matchedCause, setMatchedCause] = useState<Cause | null>(null);
    const [causeLoading, setCauseLoading] = useState(true);
    const [myVotes, setMyVotes] = useState(0);
    const [pendingVotes, setPendingVotes] = useState(0);
    const [localRemaining, setLocalRemaining] = useState(votesRemaining);
    const [votingStatus, setVotingStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [voteError, setVoteError] = useState('');
    const [showVoteSuccessModal, setShowVoteSuccessModal] = useState(false);
    const [showGoalCelebration, setShowGoalCelebration] = useState(false);
    const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
    const [voteBursts, setVoteBursts] = useState<{ id: number; particles: { dx: number; dy: number; delay: number }[] }[]>([]);

    const isOwnReel = !!currentUserId && !!video?.authorId && currentUserId === video.authorId;

    const handleLike = () => {
        if (!video) return;
        const current = likesMap.get(video.id) ?? {
            liked: !!currentUserId && !!video.likedBy && video.likedBy.includes(currentUserId),
            likeCount: video.likesCount ?? video.voteCount ?? 26
        };

        const nextLiked = !current.liked;
        const nextLikeCount = nextLiked ? current.likeCount + 1 : Math.max(0, current.likeCount - 1);

        // Optimistic update
        const newMap = new Map(likesMap);
        newMap.set(video.id, {
            liked: nextLiked,
            likeCount: nextLikeCount
        });
        setLikesMap(newMap);
        haptics.tap();

        // Perform actual API call
        fetch(`/api/videos/${video.id}/like`, {
            method: 'POST',
            credentials: 'include',
        })
            .then(async (res) => {
                if (!res.ok) throw new Error('API failed');
                const data = await res.json();
                if (data.success) {
                    // Sync with actual backend response
                    const syncMap = new Map(likesMap);
                    syncMap.set(video.id, {
                        liked: data.liked,
                        likeCount: data.likesCount
                    });
                    setLikesMap(syncMap);
                }
            })
            .catch(() => {
                // Rollback on error
                const rollbackMap = new Map(likesMap);
                rollbackMap.set(video.id, current);
                setLikesMap(rollbackMap);
            });
    };

    useEffect(() => {
        if (votingStatus !== 'success') return;
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([15, 60, 25]);
    }, [votingStatus]);

    useEffect(() => {
        if (!video) return;
        fetch(`/api/videos/${video.id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.video) {
                    const latest = data.video;
                    setLikesMap(prev => {
                        const newMap = new Map(prev);
                        newMap.set(video.id, {
                            liked: !!currentUserId && !!latest.likedBy && latest.likedBy.includes(currentUserId),
                            likeCount: latest.likesCount ?? latest.voteCount ?? 0
                        });
                        return newMap;
                    });
                }
            })
            .catch(() => {});
    }, [idx, video?.id, currentUserId]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    useEffect(() => { setLocalRemaining(votesRemaining); }, [votesRemaining]);

    // 100%-goal celebration — reset the "already fired" guard whenever the overlay closes
    const celebrationFiredRef = useRef(false);
    useEffect(() => {
        if (!showGoalCelebration) celebrationFiredRef.current = false;
    }, [showGoalCelebration]);

    // Per-vote success modal — cheer plays once per showing, guarded the same way.
    const voteSuccessSoundFiredRef = useRef(false);
    useEffect(() => {
        if (showVoteSuccessModal && !voteSuccessSoundFiredRef.current) {
            voteSuccessSoundFiredRef.current = true;
            playCheerSound();
        }
        if (!showVoteSuccessModal) voteSuccessSoundFiredRef.current = false;
    }, [showVoteSuccessModal]);

    // Play active video, pause all others — fires after idx change. Playback on the
    // active video only starts once it's marked buffered-ready (see effect below);
    // otherwise the poster + spinner show until enough is buffered.
    useEffect(() => {
        videoRefs.current.forEach((el, i) => {
            if (i === idx) {
                el.muted = isMuted;
                if (bufferedReady.has(idx)) el.play().catch(() => { });
            } else {
                el.pause();
                el.currentTime = 0;
            }
        });
        setIsPlaying(true);
        setPanelOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idx]);

    // Catches the case where the active video wasn't buffered-ready yet when idx
    // changed above — starts playback the moment it becomes ready.
    useEffect(() => {
        if (!bufferedReady.has(idx)) return;
        const el = videoRefs.current.get(idx);
        if (el && el.paused) {
            el.muted = isMuted;
            el.play().catch(() => { });
        }
    }, [bufferedReady, idx, isMuted]);

    // Reset per-video UI state and fetch cause when active video changes.
    // The counter always starts fresh at 1 — it represents "how many votes to add
    // right now", not a running total, so switching videos never carries a stale number.
    // If the user has no votes left at all, start at 0 instead so the UI doesn't
    // imply a vote is ready to cast.
    useEffect(() => {
        setMyVotes(0);
        setPendingVotes(localRemaining > 0 ? 1 : 0);
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
            const cat = (c.category ?? '').toLowerCase();
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
                        (v: any) => (v.causeId === foundId || v.causeId === found._id?.toString()) && v.videoId === video.id
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
        else { el.play().catch(() => { }); setIsPlaying(true); }
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

    const requiredVotes = video.requiredVotes || 0;
    const otherUsersVotes = Math.max(0, (video.voteCount || 0) - myVotes);

    const adjustPending = (change: 1 | -1) => {
        if (change > 0) {
            if (stagedRemaining < 1) return;
            if (requiredVotes > 0 && stagedTotal + otherUsersVotes >= requiredVotes) return;
        }
        if (change < 0 && pendingVotes <= 1) return;
        setPendingVotes(p => p + change);
    };

    // Glowing prayer-hand + particle burst — fired the instant a member taps "Cast Votes",
    // independent of whether the network call succeeds, for immediate uplifting feedback.
    const triggerVoteBurst = () => {
        const id = Date.now() + Math.random();
        const particles = Array.from({ length: 8 }, (_, i) => ({
            dx: Math.cos((i / 8) * Math.PI * 2) * (30 + Math.random() * 20),
            dy: Math.sin((i / 8) * Math.PI * 2) * (30 + Math.random() * 20) - 20,
            delay: Math.random() * 0.15,
        }));
        setVoteBursts(b => [...b, { id, particles }]);
        setTimeout(() => setVoteBursts(b => b.filter(v => v.id !== id)), 1600);
    };

    const submitVotes = async () => {
        if (!matchedCause || pendingVotes === 0) return;
        triggerVoteBurst();
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
                body: JSON.stringify({
                    allocation: { [causeId]: stagedTotal },
                    videoId: video.id,
                }),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                setVotingStatus('error');
                setVoteError(errData.message || 'Failed to save vote.');
                setTimeout(() => { setVotingStatus('idle'); setVoteError(''); }, 3000);
            } else {
                const previousTotal = video.voteCount || 0;
                const newTotal = otherUsersVotes + stagedTotal;
                const goalJustReached = requiredVotes > 0 && previousTotal < requiredVotes && newTotal >= requiredVotes;

                setMyVotes(stagedTotal);
                setPendingVotes(0);
                setLocalRemaining(stagedRemaining);
                setPanelOpen(false);
                setVotingStatus('success');
                if (goalJustReached) {
                    setShowGoalCelebration(true);
                } else {
                    setShowVoteSuccessModal(true);
                }
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

        const targetMet = requiredVotes > 0 && (video.voteCount || 0) >= requiredVotes;

        return (
            <div>
                {myVotes > 0 && (
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 600, marginBottom: '10px' }}>
                        You've already cast {myVotes} vote{myVotes === 1 ? '' : 's'} on this video.
                    </div>
                )}
                {/* Voting counter row */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <button
                        onClick={() => adjustPending(-1)}
                        disabled={pendingVotes <= 1 || votingStatus === 'saving'}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            border: '1.5px solid rgba(255,255,255,0.3)',
                            backgroundColor: 'rgba(0,0,0,0.35)',
                            color: '#ffffff',
                            fontSize: '18px',
                            fontWeight: 700,
                            cursor: (pendingVotes <= 1 || votingStatus === 'saving') ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            opacity: (pendingVotes <= 1 || votingStatus === 'saving') ? 0.4 : 1,
                            transition: 'all 0.2s',
                        }}
                        aria-label="Remove vote"
                    >−</button>

                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        border: '1.5px solid transparent',
                        background: 'linear-gradient(135deg, #CC8DDE 0%, #1F37BB 100%) padding-box, linear-gradient(180deg, #F9CEFC 0%, #4251C6 100%) border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(31, 55, 187, 0.35)'
                    }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, lineHeight: 1.1 }}>{pendingVotes}</span>
                        <span style={{ fontSize: '7px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2px' }}>
                            {pendingVotes === 1 ? 'Vote' : 'Votes'}
                        </span>
                    </div>

                    <button
                        onClick={() => adjustPending(1)}
                        disabled={stagedRemaining < 1 || votingStatus === 'saving' || (requiredVotes > 0 && stagedTotal + otherUsersVotes >= requiredVotes)}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            border: '1.5px solid rgba(255,255,255,0.3)',
                            backgroundColor: 'rgba(0,0,0,0.35)',
                            color: '#ffffff',
                            fontSize: '18px',
                            fontWeight: 700,
                            cursor: (stagedRemaining < 1 || votingStatus === 'saving' || (requiredVotes > 0 && stagedTotal + otherUsersVotes >= requiredVotes)) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            opacity: (stagedRemaining < 1 || votingStatus === 'saving' || (requiredVotes > 0 && stagedTotal + otherUsersVotes >= requiredVotes)) ? 0.4 : 1,
                            transition: 'all 0.2s',
                        }}
                        aria-label="Add vote"
                    >+</button>

                    <button
                        onClick={submitVotes}
                        disabled={votingStatus === 'saving' || pendingVotes === 0}
                        style={{
                            flex: 1,
                            marginLeft: '10px',
                            padding: '11px 20px',
                            borderRadius: '50px',
                            border: 'none',
                            background: votingStatus === 'saving' || pendingVotes === 0
                                ? 'rgba(255,255,255,0.15)'
                                : 'linear-gradient(90deg, #F8C38F 0%, #E7421B 100%)',
                            color: '#ffffff',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: votingStatus === 'saving' || pendingVotes === 0 ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s',
                            boxShadow: pendingVotes > 0 && votingStatus !== 'saving' ? '0 4px 12px rgba(231,66,27,0.35)' : 'none'
                        }}
                    >
                        {votingStatus === 'saving' ? 'Saving…' : `Cast ${pendingVotes} Vote${pendingVotes === 1 ? '' : 's'}`}
                    </button>
                </div>

                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', fontWeight: 600, marginTop: '8px' }}>
                    {stagedRemaining} out of {votesTotal} votes remaining
                </div>

                {/* Out of votes — let them buy more without leaving the reel */}
                {localRemaining <= 0 && (
                    <button
                        onClick={() => { onClose(); router.push('/dashboard/subscription'); }}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            width: '100%', marginTop: '10px', padding: '11px 16px', borderRadius: '50px',
                            border: '1.5px solid transparent',
                            background: 'linear-gradient(#15131f, #15131f) padding-box, linear-gradient(90deg, #F8C38F 0%, #E7421B 100%) border-box',
                            cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        <Zap size={14} color="#F8C38F" />
                        <span style={{
                            fontSize: '13px', fontWeight: 700,
                            background: 'linear-gradient(90deg, #F8C38F 0%, #E7421B 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                            Buy More Votes
                        </span>
                    </button>
                )}

                {/* Error feedback */}
                {voteError && (
                    <div style={{
                        fontSize: '12px', fontWeight: 600, padding: '8px 12px', borderRadius: '10px',
                        marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px',
                        backgroundColor: 'rgba(220,38,38,0.25)',
                        color: '#fca5a5',
                    }}>
                        <AlertCircle size={14} /> {voteError}
                    </div>
                )}
            </div>
        );
    };

    if (!hasActivePlan) {
        return (
            <div
                style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(10px)', fontFamily: 'var(--font-inter), sans-serif' }}
                onClick={onClose}
            >
                <div 
                    onClick={e => e.stopPropagation()}
                    style={{
                        background: '#15131f',
                        borderRadius: '24px',
                        padding: '36px 32px',
                        maxWidth: '420px',
                        width: '90%',
                        textAlign: 'center',
                        border: '1.5px solid rgba(255,255,255,0.06)',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
                        position: 'relative',
                        animation: 'vpm_slideUp 0.3s cubic-bezier(0.16,1,0.3,1)'
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute', top: 16, right: 16,
                            background: 'rgba(255,255,255,0.06)',
                            border: '1.5px solid rgba(255,255,255,0.1)',
                            borderRadius: '50%',
                            width: '32px', height: '32px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <X size={14} />
                    </button>

                    <div style={{
                        width: '72px', height: '72px', borderRadius: '20px',
                        background: 'rgba(231, 66, 27, 0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px',
                    }}>
                        <AlertCircle size={36} color="#E7421B" />
                    </div>

                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
                        Subscription Plan Required
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}>
                        To watch community reels and cast votes for your favorite causes, you need an active monthly subscription plan.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                            onClick={() => {
                                onClose();
                                router.push('/dashboard/subscription');
                            }}
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
                                boxShadow: '0 6px 20px rgba(231, 66, 27, 0.35)',
                                transition: 'transform 0.2s',
                            }}
                        >
                            Purchase Plan
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                width: '100%',
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '13px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                padding: '8px 0',
                                transition: 'color 0.2s',
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.92)', animation: 'vpm_fadeIn 0.2s ease-out', fontFamily: 'var(--font-inter), sans-serif' }}
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
                .vpm-top-tier {
                    display: none !important;
                }
                .vpm-mobile-nav {
                    display: none !important;
                }
                .vpm-bottom-info {
                    position: absolute;
                    bottom: 0px;
                    left: 0;
                    right: 0;
                    padding: 0 16px 16px;
                    z-index: 20;
                    transition: bottom 0.3s cubic-bezier(0.16,1,0.3,1);
                }
                .vpm-right-actions {
                    position: absolute;
                    right: 16px;
                    bottom: 120px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    align-items: center;
                    z-index: 25;
                    transition: bottom 0.35s cubic-bezier(0.16,1,0.3,1);
                }
                .vpm-right-actions.panel-open {
                    bottom: 380px;
                }
                @media (max-width: 600px) {
                    .vpm-shell { width:100vw !important; height:100dvh !important; max-height:none !important; border-radius:0 !important; }
                    .vpm-nav { display:none !important; }
                    .vpm-dots { display:none !important; }
                    .vpm-top-tier {
                        display: flex !important;
                    }
                    .vpm-mobile-nav {
                        display: flex !important;
                        position: absolute;
                        bottom: 10px;
                        left: 12px;
                        right: 12px;
                        height: 66px;
                        padding: 0 8px;
                        gap: 4px;
                        background: rgba(21, 19, 31, 0.85);
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        border-radius: 22px;
                        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45), 0 1px 0 rgba(255, 255, 255, 0.05) inset;
                        z-index: 25;
                        align-items: center;
                        justify-content: space-around;
                    }
                    .vpm-bottom-info {
                        bottom: 80px !important;
                        padding-bottom: 8px !important;
                    }
                    .vpm-right-actions {
                        bottom: 200px !important;
                    }
                    .vpm-right-actions.panel-open {
                        bottom: 460px !important;
                    }
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
                            style={{ width: '8px', height: i === idx ? '24px' : '8px', borderRadius: '99px', border: 'none', background: i === idx ? 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)' : 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: 0, transition: 'all 0.25s', flexShrink: 0 }}
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
                        <div
                            key={v.id}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                transform: `translateY(${offset * 100}%)`,
                                transition: 'transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
                                willChange: 'transform',
                                backgroundColor: '#000',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Blurred background thumbnail for landscape videos */}
                            {landscape && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundImage: `url(${v.thumbnailUrl || '/images/login_backgrounf_img.svg'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    filter: 'blur(24px) brightness(0.35)',
                                    opacity: 0.85,
                                    transform: 'scale(1.15)', // Prevent white edges from blur
                                }} />
                            )}
                            <video
                                ref={el => { if (el) videoRefs.current.set(i, el); else videoRefs.current.delete(i); }}
                                src={v.videoUrl}
                                poster={v.thumbnailUrl}
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
                                onProgress={e => {
                                    const el = e.currentTarget;
                                    if (el.readyState >= 4) { markBuffered(i); return; }
                                    if (el.buffered.length === 0) return;
                                    const bufferedAhead = el.buffered.end(el.buffered.length - 1) - el.currentTime;
                                    if (bufferedAhead >= 2) markBuffered(i);
                                }}
                                onCanPlay={e => {
                                    if (e.currentTarget.readyState >= 4) markBuffered(i);
                                }}
                                onError={() => markBuffered(i)} // stop spinning if the source fails — nothing left to wait for
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: landscape ? 'contain' : 'cover',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                }}
                                onClick={e => { e.stopPropagation(); if (i === idx) togglePlay(); }}
                            />
                            {i === idx && !bufferedReady.has(idx) && (
                                <div style={{
                                    position: 'absolute', inset: 0, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    pointerEvents: 'none', zIndex: 6,
                                }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '50%',
                                        border: '3px solid rgba(255,255,255,0.25)',
                                        borderTopColor: '#F8C38F',
                                        animation: 'reelBufferSpin 0.8s linear infinite',
                                    }} />
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 25%, transparent 50%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.9) 100%)', pointerEvents: 'none', zIndex: 5 }} />



                {/* Top bar (Double Tier S2 Header Overlay) */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }} onClick={e => e.stopPropagation()}>
                    {/* Top Tier Header */}
                    <div className="vpm-top-tier" style={{
                        height: '60px',
                        padding: '0 16px',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/images/FFFA_logo_Horizontal.svg" alt="Faith Fighters logo" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Flame size={20} fill="#ff7b5a" stroke="none" style={{ filter: 'drop-shadow(0 2px 6px rgba(249, 115, 22, 0.4))' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.0 }}>
                                    <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 800 }}>{localRemaining}</span>
                                    <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '7px', fontWeight: 800, letterSpacing: '0.5px' }}>VOTES</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                                aria-label="Toggle menu"
                            >
                                <Menu size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Sub-Header Tier */}
                    <div style={{
                        padding: '12px 16px 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <span style={statusBadgeStyle(video.status)}>{video.status}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={handleReport}
                                disabled={reporting}
                                style={{
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    backdropFilter: 'blur(8px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Flag size={11} /> {reporting ? '…' : 'Report'}
                            </button>
                            <button
                                onClick={toggleMute}
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backdropFilter: 'blur(8px)'
                                }}
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                            >
                                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            </button>
                            <button
                                onClick={onClose}
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backdropFilter: 'blur(8px)'
                                }}
                                aria-label="Close"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right side action buttons */}
                <div
                    className={`vpm-right-actions ${panelOpen ? 'panel-open' : ''}`}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Thumbs Up (Like) */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <button
                            onClick={handleLike}
                            style={{
                                ...sideActionBtn,
                                background: currentLikesState.liked ? 'linear-gradient(135deg, #F8C38F 0%, #E7421B 100%)' : 'rgba(0,0,0,0.35)',
                                border: currentLikesState.liked ? 'none' : '1.5px solid rgba(255,255,255,0.4)',
                                boxShadow: currentLikesState.liked ? '0 4px 14px rgba(231, 66, 27, 0.4)' : 'none',
                            }}
                            aria-label="Like"
                        >
                            <ThumbsUp size={20} fill={currentLikesState.liked ? 'white' : 'none'} />
                        </button>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 4px rgba(0,0,0,0.6)', textAlign: 'center', lineHeight: 1 }}>
                            {currentLikesState.likeCount}
                        </span>
                    </div>

                    {/* Vote Flame Gradient Button */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <button
                            onClick={() => setPanelOpen(p => !p)}
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                border: 'none',
                                background: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease',
                                padding: 0
                            }}
                            aria-label="Vote Details"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/images/vote_btn.svg" alt="Vote" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                        </button>
                    </div>

                    {/* Share Button */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <button
                            onClick={() => {
                                if (navigator.clipboard) {
                                    navigator.clipboard.writeText(window.location.origin + `/media?id=${video.id}`);
                                    alert('Reel link copied to clipboard!');
                                } else {
                                    alert('Sharing is not supported on this browser.');
                                }
                            }}
                            style={{
                                ...sideActionBtn,
                                backgroundColor: 'rgba(0,0,0,0.35)',
                                borderColor: 'rgba(255,255,255,0.4)',
                                borderStyle: 'solid',
                                borderWidth: '1.5px',
                            }}
                            aria-label="Share"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="18" cy="5" r="3" />
                                <circle cx="6" cy="12" r="3" />
                                <circle cx="18" cy="19" r="3" />
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Bottom info bar */}
                <div
                    className="vpm-bottom-info"
                    onClick={e => e.stopPropagation()}
                >
                    <div style={{ marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', margin: '0 0 8px', letterSpacing: '-0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            {video.title}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                                {video.description || video.title}
                            </p>
                            <button
                                onClick={() => setPanelOpen(p => !p)}
                                style={{ background: 'none', border: 'none', color: '#ffffff', fontWeight: 700, fontSize: '13px', cursor: 'pointer', padding: 0, margin: 0, textDecoration: 'none', opacity: 0.9, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                            >
                                &nbsp;more
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ position: 'relative', width: '100%', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '99px', margin: '14px 0 10px', overflow: 'visible' }}>
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: `${requiredVotes > 0 ? Math.min(100, Math.max(0, ((video.voteCount || 0) / requiredVotes) * 100)) : 45}%`,
                            background: 'linear-gradient(90deg, #F8C38F 0%, #E7421B 100%)',
                            borderRadius: '99px'
                        }} />
                        <div style={{
                            position: 'absolute',
                            left: `calc(${requiredVotes > 0 ? Math.min(100, Math.max(0, ((video.voteCount || 0) / requiredVotes) * 100)) : 45}% - 11px)`,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                            zIndex: 2,
                        }}>
                            <Flame size={12} fill="#E7421B" stroke="none" />
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Navigation Bar Replica */}
                <div className="vpm-mobile-nav" onClick={e => e.stopPropagation()}>
                    {[
                        { label: 'Home', href: '/dashboard', icon: <Home size={20} /> },
                        { label: 'Shop', href: 'https://shop.faithfightersforamerica.com/', icon: <ShoppingBag size={20} />, external: true },
                        { label: 'Explore', href: '/dashboard/campaigns', icon: <Compass size={20} /> },
                        { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: <Activity size={20} /> },
                        { label: 'Profile', href: '/dashboard/profile', icon: <User size={20} /> },
                    ].map((item) => {
                        const isVote = item.label === 'Explore';
                        // While this reel view is open, "Explore" is the active tab exclusively —
                        // the other tabs would otherwise also read as active since the modal can
                        // be opened from several of their own pages (Home, Explore, etc).
                        const isActive = isVote;

                        return (
                            <button
                                key={item.label}
                                onClick={() => {
                                    if (isVote) {
                                        if (pathname.startsWith('/dashboard/campaigns')) {
                                            goTo(0);
                                        } else {
                                            onClose();
                                            router.push('/dashboard/campaigns?playLatest=true');
                                        }
                                    } else if (item.external) {
                                        window.location.href = item.href;
                                    } else {
                                        onClose();
                                        router.push(item.href);
                                    }
                                }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px',
                                    flex: 1,
                                    height: '52px',
                                    borderRadius: '16px',
                                    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                                    background: isActive
                                        ? 'linear-gradient(135deg, rgba(248, 195, 143, 0.18), rgba(231, 66, 27, 0.22))'
                                        : 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s, background 0.2s',
                                    fontFamily: 'inherit'
                                }}
                            >
                                <span style={{
                                    display: 'flex', color: isActive ? '#F8C38F' : 'inherit',
                                    filter: isActive ? 'drop-shadow(0 0 6px rgba(231, 66, 27, 0.5))' : 'none',
                                }}>
                                    {item.icon}
                                </span>
                                <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2px', lineHeight: 1 }}>{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Slide-up voting panel */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 30,
                        background: 'rgba(15, 23, 42, 0.45)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: '24px 24px 0 0',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderBottom: 'none',
                        padding: '0 0 24px',
                        transform: panelOpen ? 'translateY(0)' : 'translateY(100%)',
                        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
                        maxHeight: '80%',
                        overflowY: 'auto'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Top drag handle indicator */}
                    <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '2px', margin: '12px auto 16px', cursor: 'pointer' }} onClick={() => setPanelOpen(false)} />

                    <div style={{ padding: '0 20px' }}>
                        <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                            {video.title}
                        </h2>

                        <div style={{ marginBottom: '12px' }}>
                            <div style={{
                                maxHeight: '120px',
                                overflowY: 'auto',
                                scrollbarWidth: 'thin',
                                marginBottom: '6px',
                                paddingRight: '6px'
                            }}>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4 }}>
                                    {video.description || video.title}
                                </p>
                            </div>
                            <button
                                onClick={() => setPanelOpen(false)}
                                style={{ background: 'none', border: 'none', color: '#ffffff', fontWeight: 700, fontSize: '13px', cursor: 'pointer', padding: 0, margin: 0, opacity: 0.9 }}
                            >
                                less
                            </button>
                        </div>

                        <div style={{ fontSize: '13px', color: '#ffffff', opacity: 0.9, marginBottom: '16px' }}>
                            Category: <span style={{ fontWeight: 600 }}>{video.causeTag}</span>
                        </div>

                        {/* Progress Bar inside drawer */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0 20px' }}>
                            <div style={{ position: 'relative', flex: 1, height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '99px', overflow: 'visible' }}>
                                <div style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: `${requiredVotes > 0 ? Math.min(100, Math.max(0, ((video.voteCount || 0) / requiredVotes) * 100)) : 45}%`,
                                    background: 'linear-gradient(90deg, #F8C38F 0%, #E7421B 100%)',
                                    borderRadius: '99px'
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    left: `calc(${requiredVotes > 0 ? Math.min(100, Math.max(0, ((video.voteCount || 0) / requiredVotes) * 100)) : 45}% - 11px)`,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                                    zIndex: 2,
                                }}>
                                    <Flame size={12} fill="#E7421B" stroke="none" />
                                </div>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', minWidth: '32px' }}>
                                {Math.round(requiredVotes > 0 ? Math.min(100, Math.max(0, ((video.voteCount || 0) / requiredVotes) * 100)) : 45)}%
                            </span>
                        </div>

                        {requiredVotes > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '-12px 0 20px', fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>
                                <Flame size={12} color="#f97316" />
                                <span style={{ fontWeight: 700, color: '#ffffff' }}>{video.voteCount || 0}</span>
                                &nbsp;votes received &middot;&nbsp;
                                <span style={{ fontWeight: 700, color: '#ffffff' }}>{Math.max(0, requiredVotes - (video.voteCount || 0))}</span>
                                &nbsp;more needed to complete
                            </div>
                        )}

                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }} />
                        {votingPanel()}
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '20px 0 16px' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.9 }}>
                            <div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>Submitted by</div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{video.authorName}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>Upload date</div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
                                    {new Date(video.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vote animation — glowing prayer hand + particle burst, fired per cast.
                    Rendered outside the sliding drawer so it stays visible even though the
                    drawer itself slides away the instant a vote succeeds. */}
                {voteBursts.map(burst => (
                    <div
                        key={burst.id}
                        style={{
                            position: 'fixed', left: '50%', bottom: '18%',
                            transform: 'translateX(-50%)',
                            pointerEvents: 'none', zIndex: 200,
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/fffa file 1 (1).png"
                            alt=""
                            style={{
                                width: '34px', height: '34px', objectFit: 'contain',
                                animation: 'voteHandFloat 1.5s cubic-bezier(0.16,1,0.3,1) forwards',
                                filter: 'drop-shadow(0 0 6px rgba(248,195,143,0.9)) drop-shadow(0 0 14px rgba(231,66,27,0.6))',
                            }}
                        />
                        {burst.particles.map((p, i) => (
                            <div
                                key={i}
                                style={{
                                    position: 'absolute', top: '16px', left: '16px',
                                    width: '5px', height: '5px', borderRadius: '50%',
                                    background: i % 2 === 0 ? '#F8C38F' : '#fde68a',
                                    boxShadow: '0 0 6px 1px rgba(248,195,143,0.9)',
                                    opacity: 0,
                                    animation: `voteParticleDrift 1.1s ease-out ${p.delay}s forwards`,
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    ['--dx' as any]: `${p.dx}px`,
                                    ['--dy' as any]: `${p.dy}px`,
                                }}
                            />
                        ))}
                    </div>
                ))}
                <style>{`
                    @keyframes reelBufferSpin {
                        to { transform: rotate(360deg); }
                    }
                    @keyframes voteHandFloat {
                        0% { opacity: 0; transform: translateY(0) scale(0.6); }
                        15% { opacity: 1; transform: translateY(-8px) scale(1.05); }
                        75% { opacity: 1; transform: translateY(-70px) scale(1); }
                        100% { opacity: 0; transform: translateY(-96px) scale(0.9); }
                    }
                    @keyframes voteParticleDrift {
                        0% { opacity: 0; transform: translate(0, 0) scale(0.4); }
                        20% { opacity: 1; }
                        100% { opacity: 0; transform: translate(var(--dx), calc(var(--dy) - 40px)) scale(1); }
                    }
                `}</style>

                {showVoteSuccessModal && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 100,
                            backgroundImage: 'url(/images/vote_celebration.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '40px 24px 32px',
                            color: '#ffffff',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <Lottie
                            animationData={confettiAnimation}
                            loop={false}
                            style={{ position: 'absolute', top: '-12%', left: 0, right: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
                        />

                        {/* Top Section */}
                        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', textAlign: 'center' }}>
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
                                Congratulations!
                            </h2>

                            <p style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px', color: 'rgba(255,255,255,0.9)' }}>
                                You just <span style={{ color: '#ff7b5a' }}>made</span> a difference.
                            </p>

                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5, padding: '0 12px' }}>
                                Your vote has been cast and a donation has been made to help those in need.
                            </p>
                        </div>

                        {/* Bottom Section */}
                        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '16px', zIndex: 10 }}>

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

                            {/* Buttons */}
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
                                <button
                                    onClick={() => {
                                        setShowVoteSuccessModal(false);
                                        onClose();
                                        window.location.href = '/dashboard/campaigns';
                                    }}
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
                                    Explore More Campaigns
                                </button>

                                <button
                                    onClick={() => {
                                        setShowVoteSuccessModal(false);
                                        onClose();
                                        window.location.href = '/dashboard';
                                    }}
                                    style={{
                                        width: '100%',
                                        background: 'none',
                                        border: 'none',
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        padding: '8px 0',
                                        transition: 'color 0.2s',
                                    }}
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showGoalCelebration && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 100,
                            background: 'radial-gradient(circle at 50% 20%, rgba(231,66,27,0.35), rgba(11,10,18,0.96) 70%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '40px 24px 32px',
                            color: '#ffffff',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <canvas
                            ref={(el) => {
                                confettiCanvasRef.current = el;
                                if (el && !celebrationFiredRef.current) {
                                    celebrationFiredRef.current = true;
                                    playCheerSound();
                                    fireConfetti(el);
                                }
                            }}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
                        />

                        {/* Top Section */}
                        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', textAlign: 'center' }}>
                            <div style={{
                                width: '72px', height: '72px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #F8C38F, #E7421B)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '20px', boxShadow: '0 8px 24px rgba(231,66,27,0.45)',
                                fontSize: '34px',
                            }}>
                                🎉
                            </div>

                            <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.5px' }}>
                                Goal Reached!
                            </h2>

                            <p style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px', color: 'rgba(255,255,255,0.9)' }}>
                                This prayer request just hit <span style={{ color: '#F8C38F' }}>100% funding</span>.
                            </p>

                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5, padding: '0 12px' }}>
                                Because of votes like yours, this community came together and made it happen. Thank you for being part of the mission.
                            </p>
                        </div>

                        {/* Bottom Section */}
                        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
                            <button
                                onClick={() => {
                                    setShowGoalCelebration(false);
                                    onClose();
                                    window.location.href = '/dashboard/campaigns';
                                }}
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
                                }}
                            >
                                Explore More Campaigns
                            </button>

                            <button
                                onClick={() => setShowGoalCelebration(false)}
                                style={{
                                    width: '100%',
                                    background: 'none',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    padding: '8px 0',
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
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
        pending: ['rgba(234,179,8,0.25)', '#fde047'],
        rejected: ['rgba(220,38,38,0.25)', '#fca5a5'],
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
