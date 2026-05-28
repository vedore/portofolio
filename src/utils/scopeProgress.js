import {
  SCOPE_CONTENT_RANGE,
  SCOPE_CONTENT_START,
  SECTION_HOLD_START,
} from '../config/scopeTiming.js';
import { clamp, inverseSmoothstep } from './progress.js';

export const getSpecimenScopeProgress = (targetIndex, sectionCount) => {
  const stepCount = Math.max(sectionCount - 1, 1);
  const rawPosition =
    targetIndex >= sectionCount - 1
      ? stepCount
      : targetIndex + SECTION_HOLD_START * 0.5;
  const contentProgress = clamp(rawPosition / stepCount);

  return clamp(SCOPE_CONTENT_START + inverseSmoothstep(contentProgress) * SCOPE_CONTENT_RANGE);
};
