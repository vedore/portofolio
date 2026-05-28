import { useCallback, useMemo } from 'react';
import {
  CAMERA_END_PROGRESS,
  CAMERA_MID_PROGRESS,
  HERO_ANIMATION_END,
  HERO_ANIMATION_START,
  HERO_CARD_FADE_RANGE,
  HERO_CARD_FADE_START,
  HERO_SCOPE_END,
  HERO_SCOPE_START,
  HERO_SCROLL_HEIGHT,
} from '../config/scopeTiming.js';
import { clamp } from '../utils/progress.js';
import { getSpecimenScopeProgress } from '../utils/scopeProgress.js';

export function useScopeProgress({ heroProgress, sections }) {
  const heroScrollRangeVh = HERO_SCROLL_HEIGHT - 100;
  const scopeStartVh = clamp(HERO_SCOPE_START, 0, heroScrollRangeVh);
  const scopeEndVh = clamp(HERO_SCOPE_END, scopeStartVh, heroScrollRangeVh);
  const currentHeroVh = heroProgress * heroScrollRangeVh;
  const scopeProgress = clamp(
    (currentHeroVh - scopeStartVh) / Math.max(scopeEndVh - scopeStartVh, 0.001),
  );
  const heroCardOpacity = 1 - clamp((scopeProgress - HERO_CARD_FADE_START) / HERO_CARD_FADE_RANGE);

  const getSpecimenHeroProgress = useCallback((targetIndex) => {
    const targetScopeProgress = getSpecimenScopeProgress(targetIndex, sections.length);
    const targetHeroVh = scopeStartVh + targetScopeProgress * (scopeEndVh - scopeStartVh);

    return clamp(targetHeroVh / heroScrollRangeVh);
  }, [heroScrollRangeVh, scopeEndVh, scopeStartVh, sections]);

  const getCameraHeroProgress = useCallback((cameraProgress) => {
    const animationVh =
      HERO_ANIMATION_START + cameraProgress * (HERO_ANIMATION_END - HERO_ANIMATION_START);

    return clamp(animationVh / heroScrollRangeVh);
  }, [heroScrollRangeVh]);

  const phaseTargets = useMemo(() => [
    { id: 'start', label: 'Welcome!', progress: 0 },
    { id: 'middle', label: 'View', progress: getCameraHeroProgress(CAMERA_MID_PROGRESS) },
    { id: 'end', label: 'Scope', progress: getCameraHeroProgress(CAMERA_END_PROGRESS) },
    ...sections.map((section, index) => ({
      id: section.id,
      label: section.title,
      progress: getSpecimenHeroProgress(index),
    })),
  ], [getCameraHeroProgress, getSpecimenHeroProgress, sections]);

  const currentPhaseIndex = phaseTargets.reduce((closestIndex, phase, index) => {
    const closestDistance = Math.abs(heroProgress - phaseTargets[closestIndex].progress);
    const distance = Math.abs(heroProgress - phase.progress);

    return distance < closestDistance ? index : closestIndex;
  }, 0);

  const meterPosition = phaseTargets.reduce((position, phase, index) => {
    const nextPhase = phaseTargets[index + 1];

    if (!nextPhase || heroProgress < phase.progress || heroProgress > nextPhase.progress) {
      return position;
    }

    const phaseProgress = clamp(
      (heroProgress - phase.progress) / Math.max(nextPhase.progress - phase.progress, 0.001),
    );

    return index + phaseProgress;
  }, heroProgress >= phaseTargets.at(-1).progress ? phaseTargets.length - 1 : 0);

  return {
    currentPhaseIndex,
    heroCardOpacity,
    heroScrollRangeVh,
    meterPosition,
    phaseTargets,
    scopeEndVh,
    scopeProgress,
    scopeStartVh,
  };
}
