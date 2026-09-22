import assert from 'node:assert/strict';
import { LENS_ENTRY, SCROLL_MAX_SPEED_VH, SCROLL_MAX_FRAME_SECONDS } from '../config/scopeTiming.js';
import { smoothScrollPosition } from './progress.js';

// A wheel burst crossing the old 90% boundary must advance gradually, even
// after an idle frame. Reversing input must immediately reverse that advance.
for (const delta of [1 / 120, 1 / 60, 1 / 30, 5]) {
  let position = LENS_ENTRY.startVh - 40;
  for (const target of [LENS_ENTRY.endVh, LENS_ENTRY.startVh - 60, LENS_ENTRY.endVh, 0]) {
    const before = position;
    position = smoothScrollPosition(position, target, delta);
    assert.equal(Math.sign(position - before), Math.sign(target - before));
    assert.ok(Math.abs(position - before) <= SCROLL_MAX_SPEED_VH * Math.min(delta, SCROLL_MAX_FRAME_SECONDS) + 1e-9);
    assert.ok(position >= Math.min(before, target) && position <= Math.max(before, target));
  }
}

// A held scroll position converges exactly, so controls activate and RAF stops.
for (const target of [0, LENS_ENTRY.startVh, LENS_ENTRY.endVh, 610]) {
  let position = 100;
  for (let frame = 0; frame < 600; frame += 1) {
    position = smoothScrollPosition(position, target, 1 / 60);
  }
  assert.equal(position, target);
  assert.equal(smoothScrollPosition(position, target, 1 / 60), target);
}

// Equal elapsed time gives the same easing at different display refresh rates.
const advance = (hz) => {
  let position = 0;
  for (let frame = 0; frame < hz / 2; frame += 1) position = smoothScrollPosition(position, 10, 1 / hz);
  return position;
};
assert.ok(Math.abs(advance(60) - advance(120)) < 1e-9);
console.log('Shared scroll smoothing: boundary bursts, reversal, idle frames and settling passed.');
