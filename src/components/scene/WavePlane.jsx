import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getSceneTheme } from '../../config/sceneThemes.js';

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;

    vec3 pos = position;
    float waveA = sin(pos.x * 1.6 + uTime * 0.8) * 0.07;
    float waveB = sin((pos.x + pos.y) * 2.4 - uTime * 1.1) * 0.04;
    float waveC = sin(pos.y * 3.2 + uTime * 0.55) * 0.03;

    vWave = waveA + waveB + waveC;
    pos.z += vWave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uDeepColor;
  uniform vec3 uFoamColor;
  uniform vec3 uSunColor;
  varying vec2 vUv;
  varying float vWave;

  void main() {
    float shore = smoothstep(0.0, 0.72, vUv.y);
    float foamLine = smoothstep(0.48, 0.5, fract(vUv.y * 5.0 + vWave * 2.0));
    float sunStreak = smoothstep(0.22, 0.0, abs(vUv.x - 0.58 + vWave * 1.6));
    sunStreak *= smoothstep(0.08, 0.62, vUv.y) * (1.0 - smoothstep(0.92, 1.0, vUv.y));

    vec3 color = mix(uDeepColor, uFoamColor, shore * 0.58 + foamLine * 0.12);
    color += uSunColor * sunStreak * 0.34;

    gl_FragColor = vec4(color, 0.86);
  }
`;

const PLANE_SIZE = {
  desktop: [50, 50],
  mobile: [10, 9],
};

function WavePlane({ isActive = true, isMobile = false, themeMode = 'day' }) {
  const invalidate = useThree((state) => state.invalidate);
  const theme = getSceneTheme(themeMode);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uDeepColor: { value: new THREE.Color('#2F7F8F') },
          uFoamColor: { value: new THREE.Color('#8FD3CE') },
          uSunColor: { value: new THREE.Color('#FFE3A3') },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  useFrame((state) => {
    if (!isActive) return;

    const lerpSpeed = 0.035;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uDeepColor.value.lerp(new THREE.Color(theme.waterDeep), lerpSpeed);
    material.uniforms.uFoamColor.value.lerp(new THREE.Color(theme.waterFoam), lerpSpeed);
    material.uniforms.uSunColor.value.lerp(new THREE.Color(theme.sun), lerpSpeed);
    invalidate();
  });

  const [width, height] = isMobile ? PLANE_SIZE.mobile : PLANE_SIZE.desktop;

  return (
    <mesh
      position={[-27, -3.2, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={-1}
    >
      <planeGeometry args={[width, height, 48, 48]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export default WavePlane;
