'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
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
    Home,
    Flame,
    Compass,
    HeartHandshake,
    PlayCircle,
    ShoppingBag,
    Users,
    Mail,
} from 'lucide-react';

const bottomNavItems = [
    { label: 'Home', href: '/dashboard', icon: <Home size={20} /> },
    { label: 'Shop', href: 'https://shop.faithfightersforamerica.com/', icon: <ShoppingBag size={20} />, external: true },
    { label: 'Explore', href: '/dashboard/campaigns?playLatest=true', icon: <Compass size={20} /> },
    { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: <Activity size={20} /> },
    { label: 'Profile', href: '/dashboard/profile', icon: <User size={20} /> },
];
import NotificationBell from '@/components/shared/NotificationBell';
import TestimonialImpactPopup from '@/components/shared/TestimonialImpactPopup';
import { haptics } from '@/lib/haptics';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'All Campaigns', href: '/dashboard/campaigns', icon: <Grid size={20} /> },
    { label: 'Activities', href: '/dashboard/activities', icon: <Trophy size={20} /> },
    { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: <Activity size={20} /> },
    { label: 'Submit Video', href: '/dashboard/submit', icon: <Video size={20} /> },
    { label: 'My Requests', href: '/dashboard/requests', icon: <HeartHandshake size={20} /> },
    { label: 'Testimonial Videos', href: '/dashboard/testimonials', icon: <PlayCircle size={20} /> },
    { label: 'Plans & Votes', href: '/dashboard/subscription', icon: <CreditCard size={20} /> },
    { label: 'Events', href: '/dashboard/events', icon: <Calendar size={20} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading: loading, logout, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const userMenuRef = useRef<HTMLDivElement>(null);
    const votesRemaining = user ? (user.votesRemaining ?? 0) + (user.boosterVotesRemaining ?? 0) : 0;

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

    // Paths a "need help" recipient can access before purchasing a membership.
    // Requests/testimonial pages track the recipient's own help request, so they
    // stay reachable regardless of subscription status — gating them would block
    // the exact population this feature serves.
    const PAYWALL_EXEMPT_PATHS = ['/dashboard', '/dashboard/submit', '/dashboard/profile', '/dashboard/subscription'];
    const isPaywallExempt = PAYWALL_EXEMPT_PATHS.includes(pathname) || pathname.startsWith('/dashboard/requests') || pathname.startsWith('/dashboard/impact');
    const isPaywalled = !!user
        && user.userType === 'recipient'
        && !user.plan
        && !isPaywallExempt;

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        } else if (!loading && isPaywalled) {
            router.replace('/join');
        }
    }, [user, loading, isPaywalled, router]);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    if (loading) {
        return (
            <div className={styles.adminContainer} style={{ alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Loading…</p>
            </div>
        );
    }

    if (!user || isPaywalled) return null;

    const firstName = user.name?.split(' ')[0] || 'User';
    const sidebarNavItems = isAdmin
        ? [
            ...navItems,
            { label: 'Volunteers', href: '/dashboard/admin/volunteers', icon: <Users size={20} /> },
            { label: 'Contact Messages', href: '/dashboard/admin/messages', icon: <Mail size={20} /> },
        ]
        : navItems;

    return (
        <div className={styles.adminContainer}>
            <TestimonialImpactPopup />
            {/* SVG Defs for gradients */}
            <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
                <defs>
                    <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#E7421B" />
                        <stop offset="50%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#F8C38F" />
                    </linearGradient>
                </defs>
            </svg>

            <div
                className={`${styles.mobileOverlay} ${mobileOpen ? styles.overlayVisible : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoBadge}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/FFFA_logo_Horizontal.svg" alt="Faith Fighters logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
                    </div>
                    <a href="/" className={styles.backLink}>
                        <ArrowLeft size={12} /> Back to site
                    </a>
                </div>

                <nav className={styles.sidebarNav}>
                    {sidebarNavItems.map((item) => {
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
                    <Link href="/dashboard" className={styles.headerLeft}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/FFFA_logo_Horizontal.svg" alt="Faith Fighters logo" className={styles.headerLogo} />
                    </Link>

                    <div className={styles.topbarRight}>
                        <div className={styles.headerVotesContainer}>
                            <div className={styles.headerVotesFlameWrapper}>
                                <Flame size={24} fill="url(#flameGradient)" stroke="none" className={styles.headerVotesFlame} />
                            </div>
                            <div className={styles.headerVotesTextContainer}>
                                <span className={styles.headerVotesCount}>{votesRemaining !== null ? votesRemaining : 0}</span>
                                <span className={styles.headerVotesLabel}>VOTES</span>
                            </div>
                        </div>

                        {/* Profile Wrapper - only visible on desktop screen */}
                        <div className={styles.userProfileWrapper} ref={userMenuRef}>
                            <div 
                                className={styles.userProfile}
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                <div className={styles.userAvatar}>
                                    {user.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={user.image} alt={user.name || 'User'} />
                                    ) : (
                                        <div className={styles.userAvatarFallback}>
                                            {(user.name || 'U').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.userInfoContainer}>
                                    <span className={styles.userName}>{user.name || 'User'}</span>
                                    <span className={styles.userPlanName}>
                                        {user.plan === 'faith_fighter' ? 'Faith Fighter' : user.plan === 'faith_hero' ? 'Faith Hero' : user.plan === 'faith_builder' ? 'Faith Builder' : 'Free Plan'}
                                    </span>
                                </div>
                                <ChevronDown size={14} className={styles.userDropdownChevron} />
                            </div>

                            {userMenuOpen && (
                                <div className={styles.userMenu}>
                                    <button 
                                        className={styles.userMenuItem}
                                        onClick={() => { setUserMenuOpen(false); router.push('/dashboard/profile'); }}
                                    >
                                        <User size={14} /> Profile Settings
                                    </button>
                                    <div className={styles.userMenuDivider} />
                                    <button 
                                        className={`${styles.userMenuItem} ${styles.userMenuItemDanger}`}
                                        onClick={() => { setUserMenuOpen(false); logout(); }}
                                    >
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            className={styles.menuToggle}
                            onClick={() => { haptics.menu(); setMobileOpen(!mobileOpen); }}
                            aria-label="Toggle menu"
                        >
                            <Menu size={22} />
                        </button>
                    </div>
                </header>

                <main className={styles.contentWrapper}>
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className={styles.bottomNav}>
                {bottomNavItems.map((item) => {
                    const isActive = !item.external && (pathname === item.href ||
                        (item.href !== '/dashboard' && pathname.startsWith(item.href)));
                    return (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`${styles.bottomNavItem} ${isActive ? styles.bottomNavActive : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                haptics.select();
                                if (item.external) {
                                    window.location.href = item.href;
                                } else {
                                    router.push(item.href);
                                }
                            }}
                            aria-label={item.label}
                        >
                            <span className={styles.bottomNavIcon}>{item.icon}</span>
                            <span className={styles.bottomNavLabel}>{item.label}</span>
                        </a>
                    );
                })}
            </nav>
        </div>
    );
}
