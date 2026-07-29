const can = () =>
    typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
const vibe = (pattern: number | number[]) => {
    if (can()) navigator.vibrate(pattern);
};
export const haptics = {
    tap: () => vibe(10),
    success: () => vibe([20, 80, 30]),
    error: () => vibe([50, 30, 50]),
    warning: () => vibe(30),
    select: () => vibe(5),
    menu: () => vibe(8),
};
