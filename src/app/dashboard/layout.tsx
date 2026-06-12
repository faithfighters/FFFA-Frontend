'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './DashboardLayout.module.css';

import {
    LayoutDashboard,
    Grid,
    Video,
    Trophy,
    Activity,
    CreditCard,
    User,
    LogOut,
    Search,
    ChevronDown,
    ArrowLeft,
    Calendar,
    Menu,
} from 'lucide-react';
import NotificationBell from '@/components/shared/NotificationBell';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'All Campaigns', href: '/dashboard/campaigns', icon: <Grid size={20} /> },
    { label: 'Activities', href: '/dashboard/vote', icon: <Trophy size={20} /> },
    { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: <Activity size={20} /> },
    { label: 'Submit Video', href: '/dashboard/submit', icon: <Video size={20} /> },
    { label: 'Plans & Votes', href: '/dashboard/subscription', icon: <CreditCard size={20} /> },
    { label: 'Events', href: '/dashboard/events', icon: <Calendar size={20} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading: loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const userMenuRef = useRef<HTMLDivElement>(null);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchValue.trim()) {
            router.push(`/dashboard/campaigns?q=${encodeURIComponent(searchValue.trim())}`);
            setSearchValue('');
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    if (loading) {
        return (
            <div className={styles.adminContainer} style={{ alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#64748b', fontSize: 14 }}>Loading…</p>
            </div>
        );
    }

    if (!user) return null;

    const firstName = user.name?.split(' ')[0] || 'User';

    return (
        <div className={styles.adminContainer}>
            <div
                className={`${styles.mobileOverlay} ${mobileOpen ? styles.overlayVisible : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoBadge}>
                        <div className={styles.logoIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                            </svg>
                        </div>
                        <span className={styles.logoText}>FFFA</span>
                    </div>
                    <a href="/" className={styles.backLink}>
                        <ArrowLeft size={12} /> Back to site
                    </a>
                </div>

                <nav className={styles.sidebarNav}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push(item.href);
                                }}
                            >
                                <span className={styles.navIcon}>{item.icon}</span>
                                <span className={styles.navLabel}>{item.label}</span>
                            </a>
                        );
                    })}
                </nav>

                <div className={styles.sidebarFooter} />
            </aside>

            <div className={styles.mainContent}>
                <header className={styles.topbar}>
                    <button
                        className={styles.menuToggle}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <Menu size={22} />
                    </button>

                    <div className={styles.searchBar}>
                        <span className={styles.searchIcon}><Search size={18} /></span>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search campaigns…"
                            aria-label="Search campaigns"
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        <span className={styles.searchShortcut}>
                            <span className={styles.shortcutKey}>↵</span>
                        </span>
                    </div>

                    <div className={styles.topbarRight}>
                        <NotificationBell />
                        <div className={styles.userProfileWrapper} ref={userMenuRef}>
                            <div className={styles.userProfile} onClick={() => setUserMenuOpen(o => !o)}>
                                <div className={styles.userAvatar}>
                                    {user.image ? (
                                        <img src={user.image} alt={firstName} />
                                    ) : (
                                        <User size={22} />
                                    )}
                                </div>
                                <span className={styles.userName}>{firstName}</span>
                                <span className={styles.userDropdown}><ChevronDown size={14} /></span>
                            </div>
                            {userMenuOpen && (
                                <div className={styles.userMenu}>
                                    <button
                                        className={styles.userMenuItem}
                                        onClick={() => { setUserMenuOpen(false); router.push('/dashboard/profile'); }}
                                    >
                                        <User size={15} /> My Profile
                                    </button>
                                    <div className={styles.userMenuDivider} />
                                    <button
                                        className={`${styles.userMenuItem} ${styles.userMenuItemDanger}`}
                                        onClick={async () => { setUserMenuOpen(false); await logout(); router.replace('/'); }}
                                    >
                                        <LogOut size={15} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className={styles.contentWrapper}>
                    {children}
                </main>
            </div>
        </div>
    );
}
