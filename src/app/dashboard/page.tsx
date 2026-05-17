'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import styles from './page.module.css';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'All Campaigns', href: '/vote', icon: '📋' },
    { label: 'Video Submission', href: '/dashboard/videos', icon: '🎬' },
    { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: '🏆' },
    { label: 'Activities', href: '/dashboard/activities', icon: '⚡' },
    { label: 'Subscription', href: '/dashboard/subscription', icon: '💳' },
    { label: 'Reports', href: '/dashboard/reports', icon: '📈' },
];

const bottomItems = [
    { label: 'My Profile', href: '/dashboard/profile', icon: '👤' },
    { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardLayout />
        </ProtectedRoute>
    );
}

function DashboardLayout() {
    const { user, logout, refreshUser } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [causes, setCauses] = useState<{ id: string; name: string; raisedAmount: number; goalAmount: number; image?: string }[]>([]);
    const [loading, setLoading] = useState(true);

    const firstName = user?.name?.split(' ')[0] || 'User';

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        refreshUser().catch(() => {});
        fetch('/api/votes', { credentials: 'include' })
            .then(r => r.json())
            .then(data => {
                if (data.causes) setCauses(data.causes);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const votesUsed = (user?.votesTotal ?? 0) - (user?.votesRemaining ?? 0);

    const statCards = [
        { icon: '🗳️', iconClass: styles.statIconBlue, value: `${votesUsed}/${user?.votesTotal ?? 6}`, label: 'Votes This Cycle', badge: 'Cycle' },
        { icon: '💰', iconClass: styles.statIconGreen, value: `$${((user?.votesTotal ?? 0) * 10).toLocaleString()}`, label: 'Total Impact', badge: '+12%' },
        { icon: '📋', iconClass: styles.statIconYellow, value: `${causes.length}`, label: 'Campaigns Supported', badge: 'Active' },
        {
            icon: '📅', iconClass: styles.statIconPurple,
            value: user?.joinedAt
                ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : 'Mar 2024',
            label: 'Member Since', badge: 'Member',
        },
    ];

    return (
        <div className={styles.dashPage}>
            {/* Mobile overlay */}
            <div
                className={`${styles.mobileOverlay} ${mobileOpen ? styles.overlayVisible : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoBadge}>
                        <div className={styles.logoIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                            </svg>
                        </div>
                        <span className={styles.logoText}>FFFA</span>
                    </div>
                    <div className={styles.toggleArrows}>
                        <button className={styles.toggleArrow}>‹</button>
                        <button className={styles.toggleArrow}>›</button>
                    </div>
                </div>

                <nav className={styles.sidebarNav}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                            >
                                <span className={styles.navIcon}>{item.icon}</span>
                                <span className={styles.navLabel}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.sidebarFooter}>
                    {bottomItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span className={styles.navLabel}>{item.label}</span>
                        </Link>
                    ))}
                    <button
                        className={`${styles.navLink} ${styles.logoutBtn}`}
                        onClick={async () => { await logout(); router.replace('/login'); }}
                    >
                        <span className={styles.navIcon}>🚪</span>
                        <span className={styles.navLabel}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className={styles.mainContent}>
                {/* Top bar */}
                <header className={styles.topbar}>
                    <button className={styles.menuToggle} onClick={() => setMobileOpen(!mobileOpen)}>☰</button>

                    <div className={styles.searchBar}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input type="text" className={styles.searchInput} placeholder="Search..." />
                        <span className={styles.searchShortcut}>
                            <span className={styles.shortcutKey}>⌘</span>
                            <span className={styles.shortcutKey}>F</span>
                        </span>
                    </div>

                    <div className={styles.topbarRight}>
                        <button className={styles.notificationBtn}>🔔</button>
                        <div className={styles.userProfile}>
                            <div className={styles.userAvatar}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
                                </svg>
                            </div>
                            <span className={styles.userName}>{firstName}</span>
                            <span className={styles.userDropdown}>▾</span>
                        </div>
                    </div>
                </header>

                <main className={styles.contentWrapper}>
                    {/* Greeting */}
                    <div className={styles.greeting}>
                        <div className={styles.greetingText}>
                            <h1>Hello {firstName} 👋</h1>
                            <p>Let&apos;s do something good today!</p>
                        </div>
                        <Link href="/vote" className={styles.castVoteBtn}>Cast Vote</Link>
                    </div>

                    {/* Stats */}
                    <div className={styles.statsGrid}>
                        {statCards.map((card, i) => (
                            <div key={i} className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <div className={`${styles.statIconWrap} ${card.iconClass}`}>{card.icon}</div>
                                    <span className={styles.statBadge}>{card.badge}</span>
                                </div>
                                <div className={styles.statValue}>{card.value}</div>
                                <div className={styles.statLabel}>{card.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Campaigns */}
                    <div className={styles.campaignsSection}>
                        <div className={styles.campaignsHeader}>
                            <h2 className={styles.campaignsTitle}>On Going Campaigns</h2>
                            <div className={styles.campaignsNav}>
                                <button className={styles.campaignsNavBtn}>‹</button>
                                <button className={styles.campaignsNavBtn}>›</button>
                            </div>
                        </div>

                        {loading ? (
                            <div className={styles.loadingSpinner}>Loading campaigns…</div>
                        ) : causes.length === 0 ? (
                            <div className={styles.emptyState}>No active campaigns right now.</div>
                        ) : (
                            <div className={styles.campaignsGrid}>
                                {causes.slice(0, 4).map((cause) => {
                                    const progress = cause.goalAmount > 0 ? Math.round((cause.raisedAmount / cause.goalAmount) * 100) : 0;
                                    return (
                                        <div key={cause.id} className={styles.campaignCard}>
                                            <div className={styles.campaignThumb}>
                                                {cause.image ? (
                                                    <img src={cause.image} alt={cause.name} />
                                                ) : (
                                                    <div className={styles.playBtn}>
                                                        <div className={styles.playIcon} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.campaignBody}>
                                                <div className={styles.campaignName}>{cause.name}</div>
                                                <div className={styles.campaignProgress}>
                                                    <div className={styles.campaignProgressFill} style={{ width: `${Math.min(progress, 100)}%` }} />
                                                </div>
                                                <div className={styles.campaignMeta}>
                                                    <span className={styles.campaignPercentage}>{progress}%</span>
                                                    <span className={styles.fireEmoji}>🔥</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className={styles.actionsGrid}>
                        <Link href="/vote" className={styles.actionCard}>
                            <div className={styles.actionIcon}>🗳️</div>
                            <div className={styles.actionTitle}>Vote for Causes</div>
                            <div className={styles.actionDesc}>Allocate your donation votes</div>
                        </Link>
                        <Link href="/join" className={styles.actionCard}>
                            <div className={styles.actionIcon}>💝</div>
                            <div className={styles.actionTitle}>Donate Now</div>
                            <div className={styles.actionDesc}>Support the mission directly</div>
                        </Link>
                        <Link href="/dashboard/profile" className={styles.actionCard}>
                            <div className={styles.actionIcon}>👤</div>
                            <div className={styles.actionTitle}>My Profile</div>
                            <div className={styles.actionDesc}>View and edit your profile</div>
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
}
