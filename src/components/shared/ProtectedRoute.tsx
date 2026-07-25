'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
    /** Blocks "need help" recipients who haven't purchased a membership plan yet — redirects to /join. */
    requiresSubscription?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false, requiresSubscription = false }: ProtectedRouteProps) {
    const { user, isLoading, isAdmin } = useAuth();
    const router = useRouter();
    const isPaywalled = !!user && requiresSubscription && user.userType === 'recipient' && !user.plan;

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else if (adminOnly && !isAdmin) {
                router.push('/');
            } else if (isPaywalled) {
                router.push('/join');
            }
        }
    }, [user, isLoading, isAdmin, adminOnly, isPaywalled, router]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', marginTop: 'var(--header-height)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner" />
                    <p style={{ marginTop: '1rem', color: 'var(--color-gray-500)' }}>Loading...</p>
                </div>
            </div>
        );
    }

    if (!user || (adminOnly && !isAdmin) || isPaywalled) return null;

    return <>{children}</>;
}
