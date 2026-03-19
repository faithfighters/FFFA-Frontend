'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './page.module.css';

export default function AdminOverviewPage() {
    return (
        <ProtectedRoute adminOnly>
            <AdminOverviewContent />
        </ProtectedRoute>
    );
}

interface Analytics {
    overview: {
        totalMembers: number;
        totalAdmins: number;
        totalMonthlyRevenue: number;
        totalToCharity: number;
        totalToPlatform: number;
        totalPaidOut: number;
    };
    videoStats: { pending: number; approved: number; rejected: number };
    payoutStats: { totalPaidOut: number; pendingPayouts: number };
}

function AdminOverviewContent() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/analytics', { credentials: 'include' })
            .then((r) => r.json())
            .then((data) => setAnalytics(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className={styles.dashboard}><p>Loading...</p></div>;

    const ov = analytics?.overview;
    const vs = analytics?.videoStats;

    return (
        <div className={styles.dashboard}>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>👥</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{ov?.totalMembers ?? 0}</span>
                        <span className={styles.statLabel}>Total Members</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>💰</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>${ov?.totalToCharity?.toFixed(2) ?? '0.00'}</span>
                        <span className={styles.statLabel}>Allocated to Charity</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>🎥</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue} style={{ color: (vs?.pending ?? 0) > 0 ? 'var(--color-red)' : 'inherit' }}>
                            {vs?.pending ?? 0}
                        </span>
                        <span className={styles.statLabel}>Pending Videos</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📤</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{analytics?.payoutStats.pendingPayouts ?? 0}</span>
                        <span className={styles.statLabel}>Pending Payouts</span>
                    </div>
                </div>
            </div>

            <div className={styles.overviewGrid}>
                <div className={styles.recentActivity}>
                    <h2 className="heading-sm" style={{ marginBottom: 'var(--space-lg)' }}>Revenue Breakdown</h2>
                    <div className={styles.activityList}>
                        <div className={styles.activityItem}>
                            <div className={styles.activityIcon}>💵</div>
                            <div className={styles.activityDetails}>
                                <p><strong>Monthly Revenue</strong></p>
                                <span className={styles.activityTime}>${ov?.totalMonthlyRevenue?.toFixed(2) ?? '0.00'} / month</span>
                            </div>
                        </div>
                        <div className={styles.activityItem}>
                            <div className={styles.activityIcon}>🏦</div>
                            <div className={styles.activityDetails}>
                                <p><strong>80% to Charities</strong></p>
                                <span className={styles.activityTime}>${ov?.totalToCharity?.toFixed(2) ?? '0.00'} / month</span>
                            </div>
                        </div>
                        <div className={styles.activityItem}>
                            <div className={styles.activityIcon}>⚙️</div>
                            <div className={styles.activityDetails}>
                                <p><strong>20% Operations</strong></p>
                                <span className={styles.activityTime}>${ov?.totalToPlatform?.toFixed(2) ?? '0.00'} / month</span>
                            </div>
                        </div>
                        <div className={styles.activityItem}>
                            <div className={styles.activityIcon}>✅</div>
                            <div className={styles.activityDetails}>
                                <p><strong>Total Paid Out</strong></p>
                                <span className={styles.activityTime}>${ov?.totalPaidOut?.toFixed(2) ?? '0.00'} lifetime</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.recentActivity}>
                    <h2 className="heading-sm" style={{ marginBottom: 'var(--space-lg)' }}>Video Stats</h2>
                    <div className={styles.activityList}>
                        <div className={styles.activityItem}>
                            <div className={styles.activityIcon}>⏳</div>
                            <div className={styles.activityDetails}>
                                <p><strong>Pending Review</strong></p>
                                <span className={styles.activityTime}>{vs?.pending ?? 0} videos</span>
                            </div>
                        </div>
                        <div className={styles.activityItem}>
                            <div className={styles.activityIcon}>✅</div>
                            <div className={styles.activityDetails}>
                                <p><strong>Approved</strong></p>
                                <span className={styles.activityTime}>{vs?.approved ?? 0} videos</span>
                            </div>
                        </div>
                        <div className={styles.activityItem}>
                            <div className={styles.activityIcon}>❌</div>
                            <div className={styles.activityDetails}>
                                <p><strong>Rejected</strong></p>
                                <span className={styles.activityTime}>{vs?.rejected ?? 0} videos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
