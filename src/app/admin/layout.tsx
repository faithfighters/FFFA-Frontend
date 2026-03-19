'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import styles from './AdminLayout.module.css';

const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/members', label: 'Members', icon: '👥' },
    { href: '/admin/votes', label: 'Voting Cycles', icon: '🗳️' },
    { href: '/admin/videos', label: 'Video Moderation', icon: '🎥' },
    { href: '/admin/charities', label: 'Charities', icon: '🏛️' },
    { href: '/admin/payouts', label: 'Payouts', icon: '💰' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className={styles.adminContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoBadge}>FFFA</div>
                    <span className={styles.roleLabel}>Admin Portal</span>
                </div>

                <nav className={styles.sidebarNav}>
                    {navLinks.map((link, i) => {
                        const isActive = pathname === link.href;
                        return (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Link
                                    href={link.href}
                                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                                >
                                    <span className={styles.navIcon}>{link.icon}</span>
                                    {link.label}
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.navLink} style={{ opacity: 0.8 }}>
                        <span className={styles.navIcon}>🏠</span>
                        Back to Site
                    </Link>
                    <button onClick={logout} className={`${styles.navLink} ${styles.logoutBtn}`}>
                        <span className={styles.navIcon}>🚪</span>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={styles.mainContent}>
                <div className={styles.topbar}>
                    <h1 className={styles.pageTitle}>
                        {navLinks.find(l => l.href === pathname)?.label || 'Admin'}
                    </h1>
                    <div className={styles.adminProfile}>
                        <div className={styles.avatar}>A</div>
                        <span>Admin User</span>
                    </div>
                </div>

                <div className={styles.contentWrapper}>
                    {children}
                </div>
            </main>
        </div>
    );
}
