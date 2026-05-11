import { useEffect, useState } from 'react';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function useScrollProgress({
  heroHeightVh = 320,
  animationStartVh = 0,
  animationEndVh,
  scrollContainerRef,
} = {}) {
  const [state, setState] = useState({
    progress: 0,
    heroProgress: 0,
    isMobile: false,
  });

  useEffect(() => {
    let frameId = 0;
    const container = scrollContainerRef?.current;

    const update = () => {
      const viewportHeight = container?.clientHeight || window.innerHeight || 1;
      const scrollTop = container?.scrollTop ?? window.scrollY;
      const scrollableHero = Math.max((heroHeightVh / 100) * viewportHeight - viewportHeight, 1);
      const maxAnimationRangeVh = Math.max(heroHeightVh - 100, 0);
      const resolvedAnimationEndVh = animationEndVh ?? maxAnimationRangeVh;
      const animationStart = clamp(animationStartVh, 0, maxAnimationRangeVh);
      const animationEnd = clamp(resolvedAnimationEndVh, animationStart, maxAnimationRangeVh);
      const animationStartPx = (animationStart / 100) * viewportHeight;
      const animationEndPx = (animationEnd / 100) * viewportHeight;
      const animationRangePx = Math.max(animationEndPx - animationStartPx, 1);
      const heroProgress = clamp(scrollTop / scrollableHero);
      const progress = clamp((scrollTop - animationStartPx) / animationRangePx);

      setState({
        progress,
        heroProgress,
        isMobile: window.innerWidth < 768,
      });
    };

    const requestUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        update();
      });
    };

    update();
    const scrollTarget = container ?? window;
    scrollTarget.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      scrollTarget.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [animationEndVh, animationStartVh, heroHeightVh, scrollContainerRef]);

  return state;
}
