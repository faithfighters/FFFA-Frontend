'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Cause, VotingCycle } from '@/lib/types';
import styles from './page.module.css';

export default function VotePage() {
    return (
        <ProtectedRoute>
            <VoteContent />
        </ProtectedRoute>
    );
}

function VoteContent() {
    const { user, refreshUser } = useAuth();
    const [causes, setCauses] = useState<Cause[]>([]);
    const [cycle, setCycle] = useState<VotingCycle | null>(null);
    const [allocations, setAllocations] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const maxVotes = user?.votesTotal ?? 0;
    const usedVotes = Object.values(allocations).reduce((sum, v) => sum + v, 0);
    const remaining = maxVotes - usedVotes;

    useEffect(() => {
        fetch('/api/votes', { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => {
                if (data.causes) setCauses(data.causes);
                if (data.cycle) setCycle(data.cycle);
                if (data.userVotes?.length) {
                    const init: Record<string, number> = {};
                    for (const v of data.userVotes) {
                        init[v.causeId] = (init[v.causeId] || 0) + v.count;
                    }
                    setAllocations(init);
                }
            })
            .catch(() => setError('Failed to load donation data.'))
            .finally(() => setLoading(false));
    }, []);

    const addVote = (causeId: string) => {
        if (remaining <= 0) return;
        setAllocations((prev) => ({ ...prev, [causeId]: (prev[causeId] || 0) + 1 }));
    };

    const removeVote = (causeId: string) => {
        setAllocations((prev) => {
            const current = prev[causeId] || 0;
            if (current <= 0) return prev;
            return { ...prev, [causeId]: current - 1 };
        });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/votes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ allocation: allocations }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || data.message || 'Failed to submit donations.');
                return;
            }
            setSubmitted(true);
            await refreshUser();
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.votePage}>
                <div className="container" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                    <p>Loading donation data...</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        const allocatedCauses = Object.entries(allocations).filter(([, v]) => v > 0);
        return (
            <div className={styles.votePage}>
                <div className="container">
                    <div className={styles.successCard}>
                        <div className={styles.successIcon}>✅</div>
                        <h2 className="heading-lg">Donations Submitted!</h2>
                        <p className="text-body" style={{ marginTop: 'var(--space-md)' }}>
                            Thank you for making your voice heard. Your {usedVotes} donation vote{usedVotes !== 1 ? 's have' : ' has'} been recorded for this cycle.
                        </p>
                        <div className={styles.voteSummary}>
                            {allocatedCauses.map(([id, count]) => {
                                const cause = causes.find((c) => c.id === id);
                                return (
                                    <div key={id} className={styles.summaryItem}>
                                        <span>{cause?.name}</span>
                                        <span className={styles.summaryCount}>{count} donation vote{count > 1 ? 's' : ''}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.votePage}>
            <div className="container">
                <div className={styles.voteHeader}>
                    <div>
                        <h1 className="heading-lg">Allocate Your Donations</h1>
                        <p className="text-body">
                            {cycle
                                ? `${cycle.name} — Direct your donation votes to the causes that matter most`
                                : 'Direct your donation votes to the causes that matter to you'}
                        </p>
                    </div>
                    <div className={styles.voteCounter}>
                        <span className={styles.counterLabel}>Donation Votes Remaining</span>
                        <span className={styles.counterValue}>{remaining}</span>
                        <span className={styles.counterOf}>of {maxVotes}</span>
                    </div>
                </div>

                {!cycle && (
                    <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 8, padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)', color: '#854d0e', textAlign: 'center' }}>
                        No active donation cycle right now. Check back soon!
                    </div>
                )}

                {error && (
                    <div style={{ background: '#fee2e2', border: '1px solid #ef4444', borderRadius: 8, padding: 'var(--space-md)', marginBottom: 'var(--space-lg)', color: '#dc2626' }}>
                        {error}
                    </div>
                )}

                {causes.length === 0 && cycle ? (
                    <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--color-gray-500)' }}>
                        No causes available for this cycle yet.
                    </div>
                ) : (
                    <div className={styles.causesGrid}>
                        {causes.map((cause) => {
                            const votes = allocations[cause.id] || 0;
                            const progress = cause.goalAmount > 0
                                ? Math.round((cause.raisedAmount / cause.goalAmount) * 100)
                                : 0;
                            return (
                                <div key={cause.id} className={`${styles.causeCard} ${votes > 0 ? styles.causeCardActive : ''}`}>
                                    {cause.image && (
                                        <div className={styles.causeImage}>
                                            <Image src={cause.image} alt={cause.name} fill style={{ objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div className={styles.causeBody}>
                                        <span className={styles.causeCategory}>{cause.category}</span>
                                        <h3 className={styles.causeName}>{cause.name}</h3>
                                        <p className={styles.causeDesc}>{cause.description}</p>
                                        <div className={styles.causeProgress}>
                                            <div className={styles.causeProgressBar}>
                                                <div className={styles.causeProgressFill} style={{ width: `${Math.min(progress, 100)}%` }} />
                                            </div>
                                            <div className={styles.causeStats}>
                                                <span>${cause.raisedAmount.toLocaleString()} raised</span>
                                                <span>{cause.totalVotes.toLocaleString()} donations</span>
                                            </div>
                                        </div>
                                        <div className={styles.voteControls}>
                                            <button className={styles.voteBtn} onClick={() => removeVote(cause.id)} disabled={votes === 0} aria-label="Remove donation vote">−</button>
                                            <span className={styles.voteCount}>{votes}</span>
                                            <button className={styles.voteBtn} onClick={() => addVote(cause.id)} disabled={remaining === 0} aria-label="Add donation vote">+</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {usedVotes > 0 && (
                    <div className={styles.submitBar}>
                        <p>
                            {usedVotes} donation vote{usedVotes > 1 ? 's' : ''} allocated across{' '}
                            {Object.values(allocations).filter(v => v > 0).length} cause{Object.values(allocations).filter(v => v > 0).length !== 1 ? 's' : ''}
                        </p>
                        <button className="btn btn--primary" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Donations'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
