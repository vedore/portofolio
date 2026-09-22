import assert from 'node:assert/strict';
import { test } from 'node:test';
import { startSceneThemeCycle } from './sceneTheme.js';
import { SCENE_THEME_INTERVAL_MS } from '../config/scopeTiming.js';

test('theme cycle pauses for hidden tabs and reduced motion, and cleans up', (t) => {
  const document = Object.assign(new EventTarget(), { hidden: false });
  const motion = Object.assign(new EventTarget(), { matches: false });
  const timers = new Map();
  let nextId = 0;
  let cycles = 0;
  globalThis.document = document;
  globalThis.window = {
    matchMedia: () => motion,
    setInterval: (callback, delay) => {
      assert.equal(delay, SCENE_THEME_INTERVAL_MS);
      timers.set(++nextId, callback);
      return nextId;
    },
    clearInterval: (id) => timers.delete(id),
  };
  t.after(() => {
    delete globalThis.document;
    delete globalThis.window;
  });
  const stop = startSceneThemeCycle(() => cycles++);
  assert.equal(timers.size, 1);
  timers.values().next().value();
  timers.values().next().value();
  assert.equal(cycles, 2);

  document.hidden = true;
  document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(timers.size, 0);
  document.hidden = false;
  document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(timers.size, 1);
  motion.matches = true;
  motion.dispatchEvent(new Event('change'));
  assert.equal(timers.size, 0);
  motion.matches = false;
  motion.dispatchEvent(new Event('change'));
  assert.equal(timers.size, 1);

  stop();
  document.dispatchEvent(new Event('visibilitychange'));
  motion.dispatchEvent(new Event('change'));
  assert.equal(timers.size, 0);
});
