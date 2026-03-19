'use client';

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PLAN_CONFIG } from '@/lib/types';
import styles from './page.module.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 },
    }),
};

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}

function DashboardContent() {
    const { user, logout } = useAuth();
    if (!user) return null;

    const planInfo = user.plan ? PLAN_CONFIG[user.plan] : null;

    const stats = [
        { icon: '🗳️', value: user.votesRemaining ?? 0, label: 'Donation Votes Remaining' },
        { icon: '📊', value: user.votesTotal ?? 0, label: 'Donation Votes / Cycle' },
        { icon: '💰', value: `$${planInfo?.price ?? 0}`, label: 'Monthly Plan' },
        { icon: '🏷️', value: planInfo?.name ?? 'None', label: 'Current Plan' },
    ];

    const actions = [
        { href: '/vote', icon: '🗳️', label: 'Allocate Donations' },
        { href: '/submit-video', icon: '🎥', label: 'Submit a Video' },
        { href: '/leaderboard', icon: '🏆', label: 'View Leaderboard' },
        { href: '/media', icon: '📺', label: 'Watch Videos' },
    ];

    return (
        <div className={styles.dashPage}>
            <div className="container">
                {/* Welcome Header */}
                <motion.div
                    className={styles.welcome}
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div>
                        <h1 className={styles.welcomeTitle}>Welcome, {user.name}</h1>
                        <p className={styles.welcomeSub}>Your FFFA Dashboard</p>
                    </div>
                    <button onClick={logout} className={`btn btn--outline ${styles.logoutBtn}`}>
                        Sign Out
                    </button>
                </motion.div>

                {/* Stats Cards */}
                <div className={styles.statsGrid}>
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            className={styles.statCard}
                            custom={i} variants={fadeUp}
                            initial="hidden" animate="visible"
                            whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.10)', transition: { duration: 0.2 } }}
                        >
                            <div className={styles.statIcon}>{s.icon}</div>
                            <div className={styles.statInfo}>
                                <span className={styles.statValue}>{s.value}</span>
                                <span className={styles.statLabel}>{s.label}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Fund Allocation */}
                <motion.div
                    className={styles.section}
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <h2 className="heading-md">Fund Allocation</h2>
                    <p className="text-body" style={{ marginBottom: 'var(--space-lg)' }}>
                        Your contribution is transparently split every month.
                    </p>
                    <div className={styles.allocationBar}>
                        <motion.div
                            className={styles.allocationCharity}
                            initial={{ width: 0 }}
                            whileInView={{ width: '80%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                            style={{ width: undefined }}
                        >
                            <span>80% to Charities</span>
                        </motion.div>
                        <div className={styles.allocationOps}>
                            <span>20% Operations</span>
                        </div>
                    </div>
                    {planInfo && (
                        <div className={styles.allocationDetail}>
                            <div className={styles.allocItem}>
                                <span className={styles.allocLabel}>Your charity contribution</span>
                                <span className={styles.allocValue}>${(planInfo.price * 0.8).toFixed(2)}/mo</span>
                            </div>
                            <div className={styles.allocItem}>
                                <span className={styles.allocLabel}>Platform operations</span>
                                <span className={styles.allocValue}>${(planInfo.price * 0.2).toFixed(2)}/mo</span>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    className={styles.section}
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <h2 className="heading-md">Quick Actions</h2>
                    <div className={styles.actionsGrid}>
                        {actions.map((a, i) => (
                            <motion.div
                                key={a.href}
                                custom={i} variants={fadeUp}
                                initial="hidden" whileInView="visible" viewport={{ once: true }}
                                whileHover={{ scale: 1.04, boxShadow: '0 12px 28px rgba(0,0,0,0.12)', transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Link href={a.href} className={styles.actionCard}>
                                    <span className={styles.actionIcon}>{a.icon}</span>
                                    <span className={styles.actionLabel}>{a.label}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
