import { SCENE_THEME_INTERVAL_MS } from '../config/scopeTiming.js';

export function startSceneThemeCycle(onCycle) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  const update = () => {
    window.clearInterval(timer);
    if (!document.hidden && !motion.matches) {
      timer = window.setInterval(onCycle, SCENE_THEME_INTERVAL_MS);
    }
  };

  update();
  document.addEventListener('visibilitychange', update);
  motion.addEventListener('change', update);
  return () => {
    window.clearInterval(timer);
    document.removeEventListener('visibilitychange', update);
    motion.removeEventListener('change', update);
  };
}
