'use client';

import { useEffect, useState } from 'react';

// Renders the given defaults immediately (byte-identical to today's hardcoded
// output, so there's no hydration mismatch or loading flash), then silently
// swaps in any admin-saved overrides once fetched. A key the admin hasn't
// edited yet just falls back to its default.
export function useSiteContent<T extends Record<string, any>>(page: string, defaults: T): T {
    const [content, setContent] = useState<T>(defaults);

    useEffect(() => {
        let cancelled = false;
        fetch(`/api/site-content/${page}`)
            .then(r => (r.ok ? r.json() : null))
            .then(data => {
                if (cancelled || !data?.content) return;
                setContent(prev => ({ ...prev, ...data.content }));
            })
            .catch(() => {});
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return content;
}
