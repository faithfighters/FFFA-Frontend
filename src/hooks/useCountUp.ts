'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface UseCountUpOptions {
    duration?: number;
    prefix?: string;
    suffix?: string;
}

export function useCountUp(target: number, options: UseCountUpOptions = {}) {
    const { duration = 1400, prefix = '', suffix = '' } = options;
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const prefersReducedMotion = useReducedMotion();
    const [value, setValue] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!isInView || hasAnimated.current || prefersReducedMotion) return;
        hasAnimated.current = true;

        let raf: number;
        const start = performance.now();

        const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));
            if (progress < 1) {
                raf = requestAnimationFrame(tick);
            }
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [isInView, prefersReducedMotion, target, duration]);

    const displayValue = prefersReducedMotion && isInView ? target : value;
    const display = `${prefix}${displayValue.toLocaleString()}${suffix}`;

    return { ref, display };
}
