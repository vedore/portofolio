export const SCENE_THEMES = {
  day: {
    chamberSky: '#87CEEB',
    chamberCloud: '#F5F7FA',
    chamberEdge: '#F5F7FA',
    chamberWaveStrength: 0.8,
    waterDeep: '#2F7F8F',
    waterFoam: '#8FD3CE',
    sun: '#FFD27A',
    sunOpacity: 0.16,
  },
  night: {
    chamberSky: '#071A2F',
    chamberCloud: '#8FB3D9',
    chamberEdge: '#BFD7FF',
    chamberWaveStrength: 0.45,
    waterDeep: '#061A28',
    waterFoam: '#315B7A',
    sun: '#9FC7FF',
    sunOpacity: 0.08,
  },
};

export const getSceneTheme = (themeMode) => SCENE_THEMES[themeMode] ?? SCENE_THEMES.day;
