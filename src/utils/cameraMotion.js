import { CAMERA_END_PROGRESS } from '../config/scopeTiming.js';
import { clamp, smoothstep } from './progress.js';

export function getCameraPosition(curve, scopeEntry, progress, entryCamera, reducedMotion, position) {
  if (reducedMotion) return position.copy(curve.points[0]);
  if (progress >= CAMERA_END_PROGRESS) {
    return position.lerpVectors(curve.points[2], scopeEntry, entryCamera);
  }

  // Ease the entire journey, so scrolling never parks at the middle waypoint.
  return curve.getPoint(smoothstep(clamp(progress / CAMERA_END_PROGRESS)), position);
}
