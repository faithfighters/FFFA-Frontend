import { Suspense } from 'react';
import PageBanner from '@/components/PageBanner';
import Newsletter from '@/components/Newsletter';
import { Cause } from '@/lib/types';
import styles from './page.module.css';

async function getLeaderboardData() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/leaderboard`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed');
        return res.json();
    } catch {
        return { causes: [], stats: { totalVotes: 0, totalToCharity: 0, activeCauses: 0 } };
    }
}

export default async function LeaderboardPage() {
    const data = await getLeaderboardData();
    const sorted: Cause[] = data.causes || [];
    const stats = data.stats || {};

    return (
        <>
            <PageBanner
                title="Donation Race"
                backgroundImage="/images/hero-flag.png"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Donation Race', href: '/leaderboard' },
                ]}
            />

            {/* Stats Bar */}
            <section className={styles.statsBar}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{(stats.totalVotes || 0).toLocaleString()}</span>
                            <span className={styles.statLabel}>Total Votes Cast</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>${(stats.totalToCharity || 0).toLocaleString()}</span>
                            <span className={styles.statLabel}>Total to Charity</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{sorted.length}</span>
                            <span className={styles.statLabel}>Active Causes</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>80%</span>
                            <span className={styles.statLabel}>Goes to Charity</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leaderboard */}
            <section className={`section ${styles.leaderboard}`}>
                <div className="container">
                    <span className="section-label">Live Rankings</span>
                    <h2 className="heading-lg">Cause Leaderboard</h2>

                    <div className={styles.table}>
                        <div className={styles.tableHeader}>
                            <span className={styles.colRank}>Rank</span>
                            <span className={styles.colCause}>Cause</span>
                            <span className={styles.colCategory}>Category</span>
                            <span className={styles.colVotes}>Votes</span>
                            <span className={styles.colProgress}>Progress</span>
                            <span className={styles.colRaised}>Raised</span>
                        </div>
                        {sorted.length === 0 && (
                            <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--color-gray-400)' }}>
                                No active causes yet.
                            </div>
                        )}
                        {sorted.map((cause, i) => {
                            const progress = Math.round((cause.raisedAmount / cause.goalAmount) * 100);
                            return (
                                <div key={cause.id} className={`${styles.tableRow} ${i < 3 ? styles.topThree : ''}`}>
                                    <span className={`${styles.colRank} ${styles.rank}`}>
                                        {i === 0 && <span className={styles.medal}>🥇</span>}
                                        {i === 1 && <span className={styles.medal}>🥈</span>}
                                        {i === 2 && <span className={styles.medal}>🥉</span>}
                                        {i > 2 && <span className={styles.rankNum}>{i + 1}</span>}
                                    </span>
                                    <span className={styles.colCause}>
                                        <strong>{cause.name}</strong>
                                    </span>
                                    <span className={styles.colCategory}>
                                        <span className={styles.categoryBadge}>{cause.category}</span>
                                    </span>
                                    <span className={`${styles.colVotes} ${styles.voteCount}`}>
                                        {cause.totalVotes.toLocaleString()}
                                    </span>
                                    <span className={styles.colProgress}>
                                        <div className={styles.progressBar}>
                                            <div className={styles.progressFill} style={{ width: `${Math.min(progress, 100)}%` }} />
                                        </div>
                                        <span className={styles.progressText}>{progress}%</span>
                                    </span>
                                    <span className={`${styles.colRaised} ${styles.raisedAmount}`}>
                                        ${cause.raisedAmount.toLocaleString()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Newsletter />
        </>
    );
}
