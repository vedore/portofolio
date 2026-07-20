import { Text } from '@react-three/drei';
import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ThemedStandardMaterial } from './ThemeTransition.jsx';

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec3 pos = position;
    pos.z += sin(pos.x * 8.0 + uTime * 1.2) * 0.015;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  float lineMask(float y, float speed, float offset) {
    float row = fract(y * 18.0 - uTime * speed + offset);
    return smoothstep(0.08, 0.0, abs(row - 0.5));
  }

  void main() {
    float column = step(0.08, fract(vUv.x * 10.0)) * (1.0 - step(0.82, fract(vUv.x * 10.0)));
    float lineA = lineMask(vUv.y, 0.18, floor(vUv.x * 10.0) * 0.13);
    float lineB = lineMask(vUv.y, 0.28, floor(vUv.x * 6.0) * 0.21);
    float scan = smoothstep(0.035, 0.0, abs(fract(vUv.y * 2.0 - uTime * 0.12) - 0.5));
    float edgeFade = smoothstep(0.0, 0.14, vUv.x) * (1.0 - smoothstep(0.86, 1.0, vUv.x));
    float intensity = (lineA * 0.7 + lineB * 0.32 + scan * 0.16) * column * edgeFade;

    vec3 base = vec3(0.04, 0.075, 0.065);
    vec3 green = vec3(0.44, 1.0, 0.66);
    vec3 amber = vec3(1.0, 0.72, 0.32);
    vec3 color = mix(base, green, intensity);
    color = mix(color, amber, scan * 0.18);

    gl_FragColor = vec4(color, 0.58 + intensity * 0.36);
  }
`;

const CODE_LINES = [
];

function useCodeMaterial() {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );
}

function WaterfallPlane({ isActive = true, themeMode = 'warm' }) {
  const invalidate = useThree((state) => state.invalidate);
  const material = useCodeMaterial();

  useFrame((state) => {
    if (!isActive) return;

    material.uniforms.uTime.value = state.clock.elapsedTime;
    invalidate();
  });

  return (
    <group position={[-27, 1.7, 0]} rotation={[0, Math.PI / 2, 0]}>
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
        <planeGeometry args={[18, 8, 32, 32]} />
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

      {CODE_LINES.map((line, index) => (
        <Text
          key={line}
          position={[-7.8 + (index % 2) * 8.2, 2.9 - index * 0.92, -0.04]}
          fontSize={0.42}
          color={index % 2 ? '#fbbf24' : '#a7f3d0'}
          anchorX="left"
          anchorY="middle"
          outlineWidth={0.004}
          outlineColor="#08110d"
        >
          {line}
        </Text>
      ))}
    </group>
  );
}

export default WaterfallPlane;
