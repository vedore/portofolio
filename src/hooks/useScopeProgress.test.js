import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useScopeProgress } from './useScopeProgress.js';
import {
  CAMERA_END_PROGRESS,
  CAMERA_MID_PROGRESS,
  HERO_ANIMATION_END,
  HERO_ANIMATION_START,
  HERO_BACKDROP_MID_OPACITY,
  HERO_DETAILS_FADE_END,
  HERO_SCROLL_HEIGHT,
} from '../config/scopeTiming.js';

function at(cameraProgress) {
  let result;
  function Probe() {
    result = useScopeProgress({
      heroProgress: (HERO_ANIMATION_START + cameraProgress * (HERO_ANIMATION_END - HERO_ANIMATION_START)) / (HERO_SCROLL_HEIGHT - 100),
      sections: [],
      reducedMotion: false,
    });
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
  return result;
}

const start = at(0);
assert.equal(start.heroCardOpacity, 1);
assert.equal(start.heroDetailsOpacity, 1);
assert.equal(start.heroBackdropOpacity, 1);
for (const progress of [HERO_DETAILS_FADE_END, CAMERA_MID_PROGRESS]) {
  const state = at(progress);
  assert.equal(state.heroCardOpacity, 1, 'Keep the name visible through the second position');
  assert.equal(state.heroDetailsOpacity, 0, 'Hide supporting content before the second position');
  assert.equal(state.heroBackdropOpacity, HERO_BACKDROP_MID_OPACITY);
}
assert.equal(at(CAMERA_END_PROGRESS).heroCardOpacity, 0, 'Clear the entire hero by the third position');
for (let step = 1; step <= 100; step += 1) {
  const previous = at((step - 1) / 100);
  const current = at(step / 100);
  for (const key of ['heroCardOpacity', 'heroDetailsOpacity', 'heroBackdropOpacity']) {
    assert.ok(current[key] >= 0 && current[key] <= previous[key], 'Fades stay bounded and continuous');
    assert.ok(previous[key] - current[key] < 0.1, 'No abrupt opacity jumps');
  }
}
console.log('Hero: full start, name-only middle, lighter backdrop, and clear third position passed.');
