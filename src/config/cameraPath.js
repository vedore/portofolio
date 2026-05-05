export const CAMERA_START_POSITION = [7.316, 3.167, 2.683];
export const CAMERA_MID_POSITION = [5.384, 6.967, 0.91];
export const CAMERA_END_POSITION = [2.1, 5.1, 0];
export const LENS_TARGET_POSITION = [0.0, 1.0, 0.0];

export const MOBILE_CAMERA_START_POSITION = [7.316, 3.167, 2.683];
export const MOBILE_CAMERA_MID_POSITION = [5.384, 6.967, 0.91];
export const MOBILE_CAMERA_END_POSITION = [2.1, 5.1, 0];

export const CAMERA_PATH = {
  desktop: {
    start: CAMERA_START_POSITION,
    mid: CAMERA_MID_POSITION,
    end: CAMERA_END_POSITION,
    target: LENS_TARGET_POSITION,
  },
  mobile: {
    start: MOBILE_CAMERA_START_POSITION,
    mid: MOBILE_CAMERA_MID_POSITION,
    end: MOBILE_CAMERA_END_POSITION,
    target: LENS_TARGET_POSITION,
  },
};
