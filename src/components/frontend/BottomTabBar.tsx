'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Heart, UserCheck, ShieldCheck } from 'lucide-react';
import styles from './BottomTabBar.module.css';

const tabs = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/stories', label: 'Stories', icon: Film },
    { href: '/donation', label: 'Give', icon: Heart, accent: true },
    { href: '/volunteer', label: 'Serve', icon: UserCheck },
    { href: '/about', label: 'About', icon: ShieldCheck },
];

export default function BottomTabBar() {
    const pathname = usePathname();

    // Hidden on auth pages and the dashboard, matching Header.tsx's own scope rules.
    const isAuthPage = pathname === '/subscribe' || pathname === '/coming-soon' || pathname === '/forgot-password';
    const isDashboard = pathname.startsWith('/dashboard');
    if (isAuthPage || isDashboard) return null;

    return (
        <nav className={styles.bar} aria-label="Primary">
            {tabs.map((tab) => {
                const active = pathname === tab.href;
                const Icon = tab.icon;
                if (tab.accent) {
                    return (
                        <Link key={tab.href} href={tab.href} className={styles.accentTab}>
                            <span className={styles.accentIcon}><Icon size={20} fill="currentColor" /></span>
                        </Link>
                    );
                }
                return (
                    <Link key={tab.href} href={tab.href} className={`${styles.tab} ${active ? styles.active : ''}`}>
                        <Icon size={20} />
                        <span>{tab.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
