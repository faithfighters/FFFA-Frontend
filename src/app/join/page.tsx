'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function JoinPage() {
    const { user } = useAuth();

    useEffect(() => {
        const initiateCheckout = async () => {
            try {
                const res = await fetch('/api/stripe/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ plan: 'faith_fighter' }),
                });
                const data = await res.json();
                if (res.ok && data.url) {
                    window.location.href = data.url;
                }
            } catch {
                window.location.href = '/';
            }
        };

        if (user) {
            initiateCheckout();
        } else {
            window.location.href = '/register';
        }
    }, [user]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#020B18',
            color: '#fff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
            <p>Redirecting to checkout...</p>
        </div>
    );
}
