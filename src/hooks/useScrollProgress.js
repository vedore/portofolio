import { useEffect, useState } from 'react';
import { clamp, smoothScrollPosition } from '../utils/progress.js';

const getViewportHeight = (container) =>
  container?.clientHeight || window.visualViewport?.height || window.innerHeight || 1;

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
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });

  useEffect(() => {
    let frameId = 0;
    let previousTime = performance.now();
    let displayedVh;
    const container = scrollContainerRef?.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = (time) => {
      frameId = 0;
      const viewportHeight = getViewportHeight(container);
      const scrollTop = container?.scrollTop ?? window.scrollY;
      const maxAnimationRangeVh = Math.max(heroHeightVh - 100, 0);
      const resolvedAnimationEndVh = animationEndVh ?? maxAnimationRangeVh;
      const animationStart = clamp(animationStartVh, 0, maxAnimationRangeVh);
      const animationEnd = clamp(resolvedAnimationEndVh, animationStart, maxAnimationRangeVh);
      const targetVh = clamp(scrollTop / viewportHeight * 100, 0, maxAnimationRangeVh);
      displayedVh = displayedVh === undefined || motion.matches
        ? targetVh
        : smoothScrollPosition(displayedVh, targetVh, (time - previousTime) / 1000);
      previousTime = time;
      const heroProgress = clamp(displayedVh / Math.max(maxAnimationRangeVh, 0.001));
      const progress = clamp((displayedVh - animationStart) / Math.max(animationEnd - animationStart, 0.001));

      const isMobile = window.innerWidth < 768;

      setState((previous) => {
        if (
          previous.progress === progress &&
          previous.heroProgress === heroProgress &&
          previous.isMobile === isMobile &&
          previous.reducedMotion === motion.matches
        ) {
          return previous;
        }

        return {
          progress,
          heroProgress,
          isMobile,
          reducedMotion: motion.matches,
        };
      });

      if (displayedVh !== targetVh) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    const requestUpdate = () => {
      if (frameId) {
        return;
      }

      previousTime = performance.now();
      frameId = window.requestAnimationFrame(update);
    };

    update(performance.now());
    const scrollTarget = container ?? window;
    const resizeTarget = window.visualViewport ?? window;

    scrollTarget.addEventListener('scroll', requestUpdate, { passive: true });
    motion.addEventListener('change', requestUpdate);
    window.addEventListener('resize', requestUpdate);
    if (resizeTarget !== window) {
      resizeTarget.addEventListener('resize', requestUpdate);
    }

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      scrollTarget.removeEventListener('scroll', requestUpdate);
      motion.removeEventListener('change', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (resizeTarget !== window) {
        resizeTarget.removeEventListener('resize', requestUpdate);
      }
    };
  }, [animationEndVh, animationStartVh, heroHeightVh, scrollContainerRef]);

  return state;
}
