import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const TRANSITION_SPEED = 4.5;
const COLOR_EPSILON = 0.00001;
const VALUE_EPSILON = 0.001;
const getColorDistanceSquared = (color, target) =>
  (color.r - target.r) ** 2 +
  (color.g - target.g) ** 2 +
  (color.b - target.b) ** 2;

export function ThemedStandardMaterial({
  themeMode,
  warmColor,
  coldColor,
  ...materialProps
}) {
  const materialRef = useRef(null);
  const initialColorRef = useRef(themeMode === 'cold' ? coldColor : warmColor);
  const invalidate = useThree((state) => state.invalidate);
  const targetColor = useMemo(
    () => new THREE.Color(themeMode === 'cold' ? coldColor : warmColor),
    [coldColor, themeMode, warmColor],
  );

  useEffect(() => invalidate(), [invalidate, targetColor]);

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material || getColorDistanceSquared(material.color, targetColor) <= COLOR_EPSILON) {
      material?.color.copy(targetColor);
      return;
    }

    material.color.lerp(targetColor, 1 - Math.exp(-delta * TRANSITION_SPEED));
    invalidate();
  });

  return (
    <meshStandardMaterial
      ref={materialRef}
      color={initialColorRef.current}
      {...materialProps}
    />
  );
}

export function ThemedLight({
  type,
  themeMode,
  warmColor,
  coldColor,
  warmIntensity,
  coldIntensity,
  ...lightProps
}) {
  const lightRef = useRef(null);
  const initialColorRef = useRef(themeMode === 'cold' ? coldColor : warmColor);
  const initialIntensityRef = useRef(
    themeMode === 'cold' ? coldIntensity : warmIntensity,
  );
  const invalidate = useThree((state) => state.invalidate);
  const targetColor = useMemo(
    () => new THREE.Color(themeMode === 'cold' ? coldColor : warmColor),
    [coldColor, themeMode, warmColor],
  );
  const targetIntensity = themeMode === 'cold' ? coldIntensity : warmIntensity;
  const Light = type;

  useEffect(() => invalidate(), [invalidate, targetColor, targetIntensity]);

  useFrame((_, delta) => {
    const light = lightRef.current;
    if (!light) {
      return;
    }

    const colorNeedsUpdate = getColorDistanceSquared(light.color, targetColor) > COLOR_EPSILON;
    const intensityNeedsUpdate = Math.abs(light.intensity - targetIntensity) > VALUE_EPSILON;

    if (!colorNeedsUpdate && !intensityNeedsUpdate) {
      light.color.copy(targetColor);
      light.intensity = targetIntensity;
      return;
    }

    const alpha = 1 - Math.exp(-delta * TRANSITION_SPEED);
    light.color.lerp(targetColor, alpha);
    light.intensity = THREE.MathUtils.lerp(light.intensity, targetIntensity, alpha);
    invalidate();
  });

  return (
    <Light
      ref={lightRef}
      color={initialColorRef.current}
      intensity={initialIntensityRef.current}
      {...lightProps}
    />
  );
}
