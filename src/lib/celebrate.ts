// Confetti burst + recorded crowd-cheer clip, shared by every celebration moment
// (per-vote success modal, 100%-goal celebration). Confetti is drawn on a canvas;
// the cheer plays a real audio file from /public/images.

export function fireConfetti(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const colors = ['#F8C38F', '#E7421B', '#fbbf24', '#60a5fa', '#34d399', '#ffffff'];
    const pieceCount = 140;
    // Speeds are expressed per second (not per frame) so motion stays consistent
    // regardless of the display's actual refresh rate.
    const pieces = Array.from({ length: pieceCount }, () => ({
        x: Math.random() * width,
        startY: -20 - Math.random() * 80,
        w: 6 + Math.random() * 5,
        h: 8 + Math.random() * 6,
        rotStart: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 360, // deg/sec
        vy: 260 + Math.random() * 220, // px/sec — clears the full canvas well within the animation duration
        vx: (Math.random() - 0.5) * 2.2 * 60, // px/sec
        color: colors[Math.floor(Math.random() * colors.length)],
        swingPhase: Math.random() * Math.PI * 2,
    }));

    const start = performance.now();
    const duration = 3200;
    let frameId: number;

    const draw = (now: number) => {
        const elapsed = now - start;
        const t = elapsed / 1000;
        ctx.clearRect(0, 0, width, height);

        for (const p of pieces) {
            const swing = p.swingPhase + t * 5;
            const x = p.x + p.vx * t + Math.sin(swing) * 18;
            const y = p.startY + p.vy * t;
            const rot = p.rotStart + p.rotSpeed * t;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((rot * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        }

        if (elapsed < duration) {
            frameId = requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, width, height);
        }
    };

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
}

/** Real recorded crowd-cheer clip — used for the per-vote success modal. */
export function playCheerSound() {
    try {
        const audio = new Audio('/images/dennish18-crowd-cheering-143103.mp3');
        audio.volume = 0.55;
        audio.play().catch(() => {
            // Autoplay may be blocked until the user interacts with the page — fail silently.
        });
    } catch {
        // Audio may be unavailable in this environment — fail silently.
    }
}

/** Firecracker-cracking clip — used specifically for the 100%-goal-reached celebration. */
export function playFireworksSound() {
    try {
        const audio = new Audio('/images/dragon-studio-fireworks-07-419025.mp3');
        audio.volume = 0.55;
        audio.play().catch(() => {
            // Autoplay may be blocked until the user interacts with the page — fail silently.
        });
    } catch {
        // Audio may be unavailable in this environment — fail silently.
    }
}
