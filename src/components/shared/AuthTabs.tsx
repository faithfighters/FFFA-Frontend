'use client';

import Link from 'next/link';
import styles from './AuthTabs.module.css';

export default function AuthTabs({ active }: { active: 'join' | 'login' }) {
    return (
        <div className={styles.tabs}>
            <Link href="/register?intent=donate" className={`${styles.tab} ${active === 'join' ? styles.active : ''}`}>
                Join Now
            </Link>
            <Link href="/login" className={`${styles.tab} ${active === 'login' ? styles.active : ''}`}>
                Login
            </Link>
        </div>
    );
}
