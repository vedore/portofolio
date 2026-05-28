export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

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
