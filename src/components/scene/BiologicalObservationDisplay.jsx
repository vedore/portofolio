import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ThemedStandardMaterial } from './ThemeTransition.jsx';

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z += sin(pos.x * 1.8 + uTime * 0.45) * 0.018;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uThemeBlend;
  varying vec2 vUv;

  float hash(float value) {
    return fract(sin(value * 127.1) * 43758.5453);
  }

  mat2 rotate2d(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c);
  }

  void main() {
    vec3 warmBase = vec3(0.025, 0.070, 0.058);
    vec3 coldBase = vec3(0.018, 0.048, 0.075);
    vec3 warmCell = vec3(0.235, 0.980, 0.720);
    vec3 coldCell = vec3(0.220, 0.820, 1.000);
    vec3 warmCore = vec3(1.000, 0.620, 0.180);
    vec3 coldCore = vec3(0.750, 0.520, 1.000);
    vec3 base = mix(warmBase, coldBase, uThemeBlend);
    vec3 cellColor = mix(warmCell, coldCell, uThemeBlend);
    vec3 coreColor = mix(warmCore, coldCore, uThemeBlend);

    float membranes = 0.0;
    float interiors = 0.0;
    float nuclei = 0.0;

    for (int i = 0; i < 9; i++) {
      float seed = float(i) + 1.0;
      vec2 center = vec2(
        0.08 + hash(seed * 2.7) * 0.84,
        0.10 + hash(seed * 5.3) * 0.80
      );
      center += vec2(
        sin(uTime * (0.08 + hash(seed) * 0.06) + seed),
        cos(uTime * (0.07 + hash(seed * 4.0) * 0.05) + seed * 1.7)
      ) * 0.014;

      vec2 p = rotate2d(hash(seed * 8.1) * 6.2831) * (vUv - center);
      vec2 radius = vec2(
        0.055 + hash(seed * 3.4) * 0.055,
        0.045 + hash(seed * 6.2) * 0.045
      );
      float distanceToCell = length(p / radius);
      float interior = 1.0 - smoothstep(0.78, 1.0, distanceToCell);
      float membrane = (1.0 - smoothstep(0.98, 1.09, distanceToCell))
        * smoothstep(0.84, 0.96, distanceToCell);
      float nucleus = 1.0 - smoothstep(
        0.0,
        0.32,
        length((p - vec2(radius.x * 0.16, -radius.y * 0.08)) / radius)
      );

      membranes = max(membranes, membrane);
      interiors = max(interiors, interior);
      nuclei = max(nuclei, nucleus * interior);
    }

    float horizontalLines = 0.04 * step(0.86, fract(vUv.y * 92.0));
    float scanPosition = fract(vUv.y * 1.35 - uTime * 0.085);
    float scanLine = 1.0 - smoothstep(0.0, 0.055, abs(scanPosition - 0.5));
    float vignette = smoothstep(0.0, 0.12, vUv.x)
      * smoothstep(0.0, 0.12, 1.0 - vUv.x)
      * smoothstep(0.0, 0.1, vUv.y)
      * smoothstep(0.0, 0.1, 1.0 - vUv.y);

    vec3 color = base;
    color = mix(color, cellColor * 0.34, interiors * 0.62);
    color += cellColor * membranes * 0.72;
    color = mix(color, coreColor, nuclei * 0.88);
    color += cellColor * (scanLine * 0.17 + horizontalLines);
    color *= mix(1.0, 0.58, smoothstep(0.68, 1.0, uProgress));

    float alpha = (0.72 + membranes * 0.22 + scanLine * 0.06) * vignette;
    gl_FragColor = vec4(color, alpha);
  }
`;

function BiologicalObservationDisplay({
  progress = 0,
  isActive = true,
  themeMode = 'warm',
}) {
  const invalidate = useThree((state) => state.invalidate);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: progress },
          uThemeBlend: { value: themeMode === 'cold' ? 1 : 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useEffect(() => {
    material.uniforms.uProgress.value = progress;
    if (!isActive) {
      material.uniforms.uThemeBlend.value = themeMode === 'cold' ? 1 : 0;
    }
    invalidate();
  }, [invalidate, isActive, material, progress, themeMode]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    if (!isActive) return;

    const targetTheme = themeMode === 'cold' ? 1 : 0;
    material.uniforms.uThemeBlend.value = THREE.MathUtils.damp(
      material.uniforms.uThemeBlend.value,
      targetTheme,
      4.5,
      delta,
    );
    material.uniforms.uTime.value = state.clock.elapsedTime;
    invalidate();
  });

  return (
    <group position={[-27, 1.7, 0]} rotation={[0, Math.PI / 2, 0]}>
      <mesh position={[0, 0.2, -0.34]} renderOrder={-7}>
        <planeGeometry args={[22, 10]} />
        <ThemedStandardMaterial
          themeMode={themeMode}
          warmColor="#0a211b"
          coldColor="#061622"
          roughness={0.82}
          metalness={0.08}
        />
      </mesh>

      <mesh position={[0, 0.2, -0.22]} renderOrder={-6}>
        <planeGeometry args={[18, 8, 24, 16]} />
        <primitive object={material} attach="material" />
      </mesh>

      {[4.35, -3.95].map((y) => (
        <mesh key={y} position={[0, y, -0.12]} renderOrder={-5}>
          <boxGeometry args={[18.8, 0.16, 0.16]} />
          <ThemedStandardMaterial
            themeMode={themeMode}
            warmColor="#8b7654"
            coldColor="#5a7078"
            roughness={0.62}
            metalness={0.12}
          />
        </mesh>
      ))}
    </group>
  );
}

export default BiologicalObservationDisplay;
