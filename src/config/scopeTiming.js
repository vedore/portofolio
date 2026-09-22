export const HERO_STICKY_START_OFFSET = 40;
export const HERO_ANIMATION_START = 0;
export const HERO_ANIMATION_END = 330;
export const HERO_SCOPE_START = HERO_ANIMATION_END;
export const HERO_SCOPE_END = HERO_SCOPE_START + 390;
export const HERO_SCROLL_HEIGHT = HERO_SCOPE_END + 100;
export const SECTION_PAGE_TRANSITION_MS = 1000; // 520
export const SCENE_THEME_INTERVAL_MS = 12000;
export const SCENE_THEME_TRANSITION_SPEED = 0.5;
export const SCENE_REVEAL_MS = 1200;

export const SECTION_HOLD_START = 0.38;
export const SECTION_HOLD_END = 0.68;

export const SCOPE_CONTENT_START = 0.16;
export const SCOPE_CONTENT_RANGE = 0.9;
export const SCOPE_PROGRESS_STEPS = 250;
// Hero fade uses camera progress, so the text clears before lens entry.
export const HERO_CARD_FADE_START = 0.58;
export const HERO_CARD_FADE_RANGE = 0.26;

export const CAMERA_END_PROGRESS = 0.9;
export const CAMERA_MID_PROGRESS = CAMERA_END_PROGRESS / 2;
export const HERO_DETAILS_FADE_END = CAMERA_MID_PROGRESS / 2;
export const HERO_BACKDROP_MID_OPACITY = 0.25;
export const CAMERA_SCOPE_ENTRY_PROGRESS = 1;
export const SCROLL_DAMPING_SPEED = 12;
export const SCROLL_MAX_SPEED_VH = 240;
export const SCROLL_MAX_FRAME_SECONDS = 1 / 30;
export const SCROLL_SETTLE_VH = 0.001;
export const SCOPE_SCROLL_IDLE_MS = 140;
export const SCOPE_SNAP_DURATION_MS = 450;

export const LENS_ENTRY = {
  startVh: HERO_ANIMATION_START + CAMERA_END_PROGRESS * (HERO_ANIMATION_END - HERO_ANIMATION_START),
  endVh: HERO_SCOPE_START + 47,
  cameraEnd: 0.65,
  darkEnd: 0.6,
  fieldStart: 0.35,
  fieldEnd: 0.8,
  contentStart: 0.65,
  contentEnd: 0.9,
  controlsStart: 0.85,
};
