import {
  HERO_SCROLL_HEIGHT,
  LENS_ENTRY,
  SCOPE_CONTENT_RANGE,
  SCOPE_CONTENT_START,
  SCOPE_PROGRESS_STEPS,
  SECTION_HOLD_END,
  SECTION_HOLD_START,
} from '../config/scopeTiming.js';
import { clamp, inverseSmoothstep, smoothstep } from './progress.js';

export const quantizeScopeProgress = (progress) => Math.round(progress * SCOPE_PROGRESS_STEPS) / SCOPE_PROGRESS_STEPS;

export const getLensEntryState = (heroProgress, reducedMotion = false) => {
  const progress = clamp(
    (heroProgress * (HERO_SCROLL_HEIGHT - 100) - LENS_ENTRY.startVh) /
      (LENS_ENTRY.endVh - LENS_ENTRY.startVh),
  );
  const reveal = (start, end) => smoothstep(clamp((progress - start) / (end - start)));
  const field = reveal(LENS_ENTRY.fieldStart, LENS_ENTRY.fieldEnd);

  return {
    progress,
    camera: reducedMotion ? 0 : reveal(0, LENS_ENTRY.cameraEnd),
    darkness: reducedMotion ? 0 : reveal(0, LENS_ENTRY.darkEnd),
    field,
    content: reducedMotion ? 1 : reveal(LENS_ENTRY.contentStart, LENS_ENTRY.contentEnd),
    controls: reducedMotion ? 1 : reveal(LENS_ENTRY.controlsStart, 1),
    isInteractive: progress === 1,
  };
};

export const getScopeState = (scopeProgress, sectionCount) => {
  const contentProgress = smoothstep(
    clamp((scopeProgress - SCOPE_CONTENT_START) / SCOPE_CONTENT_RANGE),
  );
  const rawPosition = contentProgress * Math.max(sectionCount - 1, 1);
  const currentIndex = Math.min(Math.floor(rawPosition), sectionCount - 1);
  const nextIndex = Math.min(currentIndex + 1, sectionCount - 1);
  const shiftProgress = currentIndex === nextIndex ? 0 : smoothstep(clamp(
    (rawPosition - currentIndex - SECTION_HOLD_START) / (SECTION_HOLD_END - SECTION_HOLD_START),
  ));

  return { currentIndex, nextIndex, shiftProgress };
};

export const getSpecimenScopeProgress = (targetIndex, sectionCount) => {
  const stepCount = Math.max(sectionCount - 1, 1);
  const rawPosition =
    targetIndex >= sectionCount - 1
      ? stepCount
      : targetIndex + SECTION_HOLD_START * 0.5;
  const contentProgress = clamp(rawPosition / stepCount);

  return clamp(SCOPE_CONTENT_START + inverseSmoothstep(contentProgress) * SCOPE_CONTENT_RANGE);
};

export const getScopeSnapIndex = (scopeProgress, sectionCount) => {
  const { currentIndex, nextIndex, shiftProgress } = getScopeState(quantizeScopeProgress(scopeProgress), sectionCount);
  if (shiftProgress === 0 || shiftProgress === 1) return null;
  return shiftProgress < 0.5 ? currentIndex : nextIndex;
};
