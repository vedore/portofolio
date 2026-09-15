import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ThemedStandardMaterial } from './ThemeTransition.jsx';

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uAccent;
  varying vec2 vUv;

  void main() {
    // A quiet molecular ribbon instead of a high-contrast code waterfall.
    float phase = vUv.x * 18.85 - uTime * 0.22;
    float wave = sin(phase) * 0.23;
    float strandA = 1.0 - smoothstep(0.003, 0.012, abs(vUv.y - 0.5 - wave));
    float strandB = 1.0 - smoothstep(0.003, 0.012, abs(vUv.y - 0.5 + wave));
    float rung = 1.0 - smoothstep(0.035, 0.095, abs(fract(vUv.x * 42.0) - 0.5));
    rung *= 1.0 - smoothstep(abs(wave), abs(wave) + 0.01, abs(vUv.y - 0.5));
    vec2 gridUv = abs(fract(vUv * vec2(42.0, 18.0)) - 0.5);
    float grid = 1.0 - smoothstep(0.012, 0.035, min(gridUv.x, gridUv.y));
    float edge = smoothstep(0.0, 0.15, vUv.x) * (1.0 - smoothstep(0.85, 1.0, vUv.x));
    vec3 base = vec3(0.012, 0.028, 0.034);
    vec3 color = base + uAccent * (strandA * 0.38 + strandB * 0.22 + rung * 0.09) * edge;
    color += uAccent * grid * 0.025;
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function useCodeMaterial() {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uAccent: { value: new THREE.Color('#76d5cd') },
        },
        vertexShader,
        fragmentShader,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
    [],
  );
}

function WaterfallPlane({ isActive = true, themeMode = 'warm', reducedMotion = false, isMobile = false }) {
  const invalidate = useThree((state) => state.invalidate);
  const material = useCodeMaterial();
  const accent = useMemo(() => new THREE.Color(themeMode === 'cold' ? '#76d5cd' : '#d8b97a'), [themeMode]);

  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    invalidate();
    if (!isActive || reducedMotion) return undefined;
    // Don't turn a demand Canvas into a 60fps decorative animation loop.
    const timer = window.setInterval(invalidate, 1000 / (isMobile ? 12 : 24));
    return () => window.clearInterval(timer);
  }, [invalidate, isActive, isMobile, reducedMotion]);

  useEffect(() => invalidate(), [accent, invalidate]);

  useFrame((_, delta) => {
    if (!isActive) return;
    if (!reducedMotion) material.uniforms.uTime.value += Math.min(delta, 0.1);
    material.uniforms.uAccent.value.lerp(accent, reducedMotion ? 1 : 1 - Math.exp(-delta * 4.5));
  });

  return (
    <group name="molecular-display" position={[-9.3, 1.9, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.6, 0.5, 0.5]}>
      <mesh position={[0, 0.2, -0.34]} renderOrder={-7}>
        <planeGeometry args={[22, 10]} />
        <ThemedStandardMaterial
          themeMode={themeMode}
          warmColor="#14251f"
          coldColor="#07151d"
          roughness={0.82}
          metalness={0.08}
        />
      </mesh>

      <mesh position={[0, 0.2, -0.22]} renderOrder={-6}>
        <planeGeometry args={[18, 8]} />
        <primitive object={material} attach="material" />
      </mesh>

      <mesh position={[0, 4.35, -0.12]} renderOrder={-5}>
        <boxGeometry args={[18.8, 0.16, 0.16]} />
        <ThemedStandardMaterial
          themeMode={themeMode}
          warmColor="#8b7654"
          coldColor="#5a7078"
          roughness={0.62}
          metalness={0.12}
        />
      </mesh>
      <mesh position={[0, -3.95, -0.12]} renderOrder={-5}>
        <boxGeometry args={[18.8, 0.16, 0.16]} />
        <ThemedStandardMaterial
          themeMode={themeMode}
          warmColor="#8b7654"
          coldColor="#5a7078"
          roughness={0.62}
          metalness={0.12}
        />
      </mesh>

    </group>
  );
}

export default WaterfallPlane;
