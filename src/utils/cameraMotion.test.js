import assert from 'node:assert/strict';
import { CatmullRomCurve3, Vector3 } from 'three';
import { CAMERA_PATH } from '../config/cameraPath.js';
import { CAMERA_END_PROGRESS, CAMERA_MID_PROGRESS, HERO_ANIMATION_END, HERO_ANIMATION_START, HERO_SCROLL_HEIGHT, LENS_ENTRY } from '../config/scopeTiming.js';
import { getCameraPosition } from './cameraMotion.js';
import { getLensEntryState } from './scopeProgress.js';

for (const config of Object.values(CAMERA_PATH)) {
  const points = [config.start, config.mid, config.end].map((point) => new Vector3(...point));
  const curve = new CatmullRomCurve3(points, false, 'catmullrom');
  const scopeEntry = new Vector3(...config.scopeEntry);
  const at = (progress, reducedMotion = false) => {
    const vh = HERO_ANIMATION_START + progress * (HERO_ANIMATION_END - HERO_ANIMATION_START);
    const entry = getLensEntryState(vh / (HERO_SCROLL_HEIGHT - 100), reducedMotion);
    return getCameraPosition(curve, scopeEntry, progress, entry.camera, reducedMotion, new Vector3());
  };

  for (const [progress, point] of [[0, points[0]], [CAMERA_MID_PROGRESS, points[1]], [CAMERA_END_PROGRESS, points[2]]]) {
    assert.ok(at(progress).distanceTo(point) < 1e-9, 'Navigation must land on the configured waypoint');
  }

  // Every wheel increment moves, including the former start/middle/end holds.
  for (let index = 1; index <= 900; index += 1) {
    const progress = index * CAMERA_END_PROGRESS / 900;
    const distance = at(progress).distanceTo(at(progress - CAMERA_END_PROGRESS / 900));
    assert.ok(distance > 0 && distance < 0.03, 'No dead zones or sudden jumps');
    assert.deepEqual(at(progress, true), points[0]);
  }

  // The middle waypoint has a continuous, nonzero velocity; lens entry joins at rest.
  const epsilon = 1e-5;
  for (const boundary of [CAMERA_MID_PROGRESS, CAMERA_END_PROGRESS]) {
    const before = at(boundary).sub(at(boundary - epsilon)).divideScalar(epsilon);
    const after = at(boundary + epsilon).sub(at(boundary)).divideScalar(epsilon);
    assert.ok(before.distanceTo(after) < 0.01, 'Velocity must stay continuous');
    if (boundary === CAMERA_MID_PROGRESS) assert.ok(before.length() > 1);
  }
  const entryEnd = (LENS_ENTRY.endVh - HERO_ANIMATION_START) / (HERO_ANIMATION_END - HERO_ANIMATION_START);
  assert.ok(at(entryEnd).distanceTo(scopeEntry) < 1e-9);
  const forward = Array.from({ length: 101 }, (_, index) => at(index / 100));
  const reverse = Array.from({ length: 101 }, (_, index) => at((100 - index) / 100));
  assert.deepEqual(forward, reverse.reverse());
}
console.log('Desktop/mobile camera: continuous movement, waypoints, lens handoff, reversal and reduced motion passed.');
