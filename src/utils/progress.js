import {
  SCROLL_DAMPING_SPEED,
  SCROLL_MAX_SPEED_VH,
  SCROLL_MAX_FRAME_SECONDS,
  SCROLL_SETTLE_VH,
} from '../config/scopeTiming.js';

export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

// Smooth one shared scroll position, in viewport-height units, for every layer.
export const smoothScrollPosition = (current, target, deltaSeconds) => {
  const delta = clamp(deltaSeconds, 0, SCROLL_MAX_FRAME_SECONDS);
  const distance = target - current;
  if (Math.abs(distance) <= SCROLL_SETTLE_VH) return target;
  const step = distance * (1 - Math.exp(-SCROLL_DAMPING_SPEED * delta));
  const maxStep = SCROLL_MAX_SPEED_VH * delta;
  return current + clamp(step, -maxStep, maxStep);
};

export const smoothstep = (t) => t * t * (3 - 2 * t);

export const inverseSmoothstep = (value) => {
  let low = 0;
  let high = 1;

  for (let index = 0; index < 18; index += 1) {
    const mid = (low + high) / 2;
    const estimate = smoothstep(mid);

    if (estimate < value) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
};

export const easeInOutCubic = (value) =>
  value < 0.5 ? 4 * value * value * value : 1 - ((-2 * value + 2) ** 3) / 2;
