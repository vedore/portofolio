import { useEffect, useState } from 'react';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function useScrollProgress({
  heroHeightVh = 320,
  animationStartVh = 0,
  animationEndVh,
} = {}) {
  const [state, setState] = useState({
    progress: 0,
    isMobile: false,
  });

  useEffect(() => {
    const update = () => {
      const viewportHeight = window.innerHeight || 1;
      const scrollableHero = Math.max((heroHeightVh / 100) * viewportHeight - viewportHeight, 1);
      const maxAnimationRangeVh = Math.max(heroHeightVh - 100, 0);
      const resolvedAnimationEndVh = animationEndVh ?? maxAnimationRangeVh;
      const animationStart = clamp(animationStartVh, 0, maxAnimationRangeVh);
      const animationEnd = clamp(resolvedAnimationEndVh, animationStart, maxAnimationRangeVh);
      const animationStartPx = (animationStart / 100) * viewportHeight;
      const animationEndPx = (animationEnd / 100) * viewportHeight;
      const animationRangePx = Math.max(animationEndPx - animationStartPx, 1);
      const progress = clamp((window.scrollY - animationStartPx) / animationRangePx);

      setState({
        progress,
        isMobile: window.innerWidth < 768,
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [animationEndVh, animationStartVh, heroHeightVh]);

  return state;
}
