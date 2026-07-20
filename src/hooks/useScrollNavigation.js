import { useCallback } from 'react';
import { HERO_SCROLL_HEIGHT } from '../config/scopeTiming.js';
import { getMeasuredViewportHeight } from '../utils/dom.js';
import { clamp, easeInOutCubic } from '../utils/progress.js';
import { getSpecimenScopeProgress } from '../utils/scopeProgress.js';

export function useScrollNavigation({
  animateRef,
  phaseTargets,
  scopeEndVh,
  scopeStartVh,
  scrollContainerRef,
  sections,
}) {
  const animateScrollTo = useCallback((targetScrollY, durationOverride) => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    if (animateRef.current) {
      window.cancelAnimationFrame(animateRef.current);
    }

    const startScrollY = container.scrollTop;
    const distance = targetScrollY - startScrollY;
    const duration = durationOverride ?? clamp(Math.abs(distance) * 0.75, 900, 2200);
    const startTime = performance.now();

    const tick = (time) => {
      const elapsed = time - startTime;
      const progress = clamp(elapsed / duration);

      container.scrollTop = startScrollY + distance * easeInOutCubic(progress);

      if (progress < 1) {
        animateRef.current = window.requestAnimationFrame(tick);
      } else {
        animateRef.current = 0;
      }
    };

    animateRef.current = window.requestAnimationFrame(tick);
  }, [animateRef, scrollContainerRef]);

  const navigateToSpecimen = useCallback((targetIndex) => {
    if (targetIndex < 0 || targetIndex >= sections.length) {
      return;
    }

    const targetScopeProgress = getSpecimenScopeProgress(targetIndex, sections.length);
    const targetHeroVh = scopeStartVh + targetScopeProgress * (scopeEndVh - scopeStartVh);
    const viewportHeight = getMeasuredViewportHeight(scrollContainerRef.current);
    const targetScrollY = (targetHeroVh / 100) * viewportHeight;

    animateScrollTo(targetScrollY);
  }, [animateScrollTo, scopeEndVh, scopeStartVh, scrollContainerRef, sections]);

  const scrollToStart = useCallback(() => {
    animateScrollTo(0, 900);
  }, [animateScrollTo]);

  const scrollToHeroProgress = useCallback((targetProgress) => {
    const viewportHeight = getMeasuredViewportHeight(scrollContainerRef.current);
    const scrollableHero = Math.max((HERO_SCROLL_HEIGHT / 100) * viewportHeight - viewportHeight, 1);

    animateScrollTo(targetProgress * scrollableHero);
  }, [animateScrollTo, scrollContainerRef]);

  const scrubToMeterPosition = useCallback((targetPosition) => {
    const lowerIndex = Math.floor(clamp(targetPosition, 0, phaseTargets.length - 1));
    const upperIndex = Math.min(lowerIndex + 1, phaseTargets.length - 1);
    const localProgress = clamp(targetPosition - lowerIndex);
    const lowerPhase = phaseTargets[lowerIndex];
    const upperPhase = phaseTargets[upperIndex];
    const targetProgress =
      lowerPhase.progress + (upperPhase.progress - lowerPhase.progress) * localProgress;

    scrollToHeroProgress(targetProgress);
  }, [phaseTargets, scrollToHeroProgress]);

  const navigateToPhase = useCallback((targetIndex) => {
    const phaseIndex = Math.round(clamp(targetIndex, 0, phaseTargets.length - 1));
    const phase = phaseTargets[phaseIndex];

    scrollToHeroProgress(phase.progress);
  }, [phaseTargets, scrollToHeroProgress]);

  return {
    navigateToPhase,
    navigateToSpecimen,
    scrollToStart,
    scrubToMeterPosition,
  };
}
