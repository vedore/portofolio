import assert from 'node:assert/strict';
import { HERO_SCROLL_HEIGHT, HERO_SCOPE_START, HERO_SCOPE_END, LENS_ENTRY, SCOPE_CONTENT_RANGE, SCOPE_CONTENT_START, SECTION_HOLD_END, SECTION_HOLD_START } from '../config/scopeTiming.js';
import sections from '../data/ScopeViewSections.data.js';
import { inverseSmoothstep } from './progress.js';
import { getLensEntryState, getScopeSnapIndex, getScopeState, getSpecimenScopeProgress, quantizeScopeProgress } from './scopeProgress.js';

const count = sections.length;
const position = (progress) => {
  const { currentIndex, shiftProgress } = getScopeState(progress, count);
  return currentIndex + shiftProgress;
};
const progressAt = (rawPosition) => SCOPE_CONTENT_START +
  inverseSmoothstep(rawPosition / (count - 1)) * SCOPE_CONTENT_RANGE;

// Direct links and arrows must land on a fully settled specimen.
for (let index = 0; index < count; index += 1) {
  assert.equal(position(getSpecimenScopeProgress(index, count)), index);
  assert.equal(getScopeSnapIndex(getSpecimenScopeProgress(index, count), count), null);
}

// Only unfinished card transitions settle; hero/lens and complete cards stay put.
for (const progress of [-1, 0, SCOPE_CONTENT_START, 1]) {
  assert.equal(getScopeSnapIndex(progress, count), null);
}
for (let index = 0; index < count - 1; index += 1) {
  assert.equal(getScopeSnapIndex(progressAt(index + SECTION_HOLD_START + 0.08), count), index);
  assert.equal(getScopeSnapIndex(progressAt(index + SECTION_HOLD_END - 0.08), count), index + 1);
}

// Each handoff must stay continuous at both hold boundaries and index changes.
for (let index = 0; index < count - 1; index += 1) {
  for (const boundary of [SECTION_HOLD_START, SECTION_HOLD_END, 1]) {
    const progress = progressAt(index + boundary);
    assert.ok(Math.abs(position(progress + 0.00001) - position(progress - 0.00001)) < 0.001);
  }
  assert.ok(Math.abs(position(progressAt(index + (SECTION_HOLD_START + SECTION_HOLD_END) / 2)) - index - 0.5) < 0.001);
}

// Reversing scroll retraces the same positions without jumping between cards.
const forward = Array.from({ length: 1001 }, (_, index) => position(index / 1000));
const backward = Array.from({ length: 1001 }, (_, index) => position((1000 - index) / 1000));
assert.deepEqual(backward.reverse(), forward);
assert.equal(forward[0], 0);
assert.equal(forward.at(-1), count - 1);
for (let index = 1; index < forward.length; index += 1) {
  assert.ok(forward[index] >= forward[index - 1]);
  assert.ok(forward[index] - forward[index - 1] < 0.03);
}

console.log('Scope navigation and transition continuity passed.');

// The memoized carousel must render the same frame for the entire progress
// bucket, regardless of which direction entered it during scroll smoothing.
assert.equal(quantizeScopeProgress(0.4281), quantizeScopeProgress(0.4299));
assert.deepEqual(
  getScopeState(quantizeScopeProgress(0.4281), count),
  getScopeState(quantizeScopeProgress(0.4299), count),
);
for (let index = 0; index < count; index += 1) {
  assert.equal(position(quantizeScopeProgress(getSpecimenScopeProgress(index, count))), index);
}

const entryAt = (progress, reducedMotion = false) => getLensEntryState(
  (LENS_ENTRY.startVh + progress * (LENS_ENTRY.endVh - LENS_ENTRY.startVh)) / (HERO_SCROLL_HEIGHT - 100),
  reducedMotion,
);
const entryForward = Array.from({ length: 1001 }, (_, index) => entryAt(index / 1000));
const entryBackward = Array.from({ length: 1001 }, (_, index) => entryAt((1000 - index) / 1000));
assert.deepEqual(entryBackward.reverse(), entryForward);
assert.equal(entryAt(-1).field, 0);
assert.equal(entryAt(2).field, 1);
assert.equal(entryAt(2).isInteractive, true);
for (let index = 1; index < entryForward.length; index += 1) {
  const state = entryForward[index];
  for (const key of ['camera', 'darkness', 'field', 'content', 'controls']) {
    assert.ok(state[key] >= entryForward[index - 1][key]);
    assert.ok(state[key] - entryForward[index - 1][key] < 0.02);
  }
  // The viewing field overlaps the dark handoff; no blank blackout interval.
  if (state.darkness === 1) assert.ok(state.field > 0);
  if (state.controls > 0) assert.equal(state.field, 1);
  if (state.isInteractive) assert.equal(state.content, 1);
  if (state.progress < 1) assert.equal(state.isInteractive, false);
  const reduced = entryAt(index / 1000, true);
  assert.equal(reduced.camera, 0);
  assert.equal(reduced.darkness, 0);
  assert.equal(reduced.content, 1);
}
for (let index = 0; index < count; index += 1) {
  const vh = HERO_SCOPE_START + getSpecimenScopeProgress(index, count) * (HERO_SCOPE_END - HERO_SCOPE_START);
  assert.equal(getLensEntryState(vh / (HERO_SCROLL_HEIGHT - 100)).isInteractive, true);
}
// Entry finishes before the first specimen starts moving.
assert.ok(LENS_ENTRY.endVh < HERO_SCOPE_START + SCOPE_CONTENT_START * (HERO_SCOPE_END - HERO_SCOPE_START));
console.log('Lens entry overlap, reversal, controls and reduced motion passed.');
