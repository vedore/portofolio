import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getSceneTheme } from '../../config/sceneThemes.js';

const vertexShader = `
  uniform float uTime;
  uniform float uWaveStrength;
  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;

    vec3 pos = position;
    float waveA = sin(pos.x * 1.2 + uTime * 0.7) * 0.08;
    float waveB = sin(pos.y * 1.8 - uTime * 0.9) * 0.05;
    float waveC = sin((pos.x + pos.y) * 1.6 + uTime * 0.45) * 0.04;

    vWave = waveA + waveB + waveC;
    pos.z += vWave * uWaveStrength;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uSkyColor;
  uniform vec3 uCloudColor;
  varying vec2 vUv;
  varying float vWave;

  void main() {
    float verticalLight = smoothstep(0.0, 1.0, vUv.y);
    float cloudBand = smoothstep(0.46, 0.5, fract(vUv.y * 4.0 + vWave * 1.4));
    vec3 color = mix(uSkyColor, uCloudColor, verticalLight * 0.28 + cloudBand * 0.14);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const CHAMBER_SIZE = {
  width: 40,
  height: 20,
  depth: 40,
};

const WALLS = [
  {
    id: 'front',
    position: [0, 0, CHAMBER_SIZE.depth / 2],
    rotation: [0, Math.PI, 0],
    args: [CHAMBER_SIZE.width + 1, CHAMBER_SIZE.height, 56, 24],
  },
  {
    id: 'back',
    position: [0, 0, -CHAMBER_SIZE.depth / 2],
    rotation: [0, 0, 0],
    args: [CHAMBER_SIZE.width + 1, CHAMBER_SIZE.height, 56, 24],
  },
  {
    id: 'left',
    position: [-CHAMBER_SIZE.width / 2, 0, 0],
    rotation: [0, Math.PI / 2, 0],
    args: [CHAMBER_SIZE.depth, CHAMBER_SIZE.height, 56, 24],
  },
  {
    id: 'right',
    position: [CHAMBER_SIZE.width / 2, 0, 0],
    rotation: [0, -Math.PI / 2, 0],
    args: [CHAMBER_SIZE.depth, CHAMBER_SIZE.height, 56, 24],
  },
  {
    id: 'top',
    position: [0, CHAMBER_SIZE.height / 2, 0],
    rotation: [Math.PI / 2, 0, 0],
    args: [CHAMBER_SIZE.width + 1, CHAMBER_SIZE.depth + 1, 56, 56],
  },
  {
    id: 'floor',
    position: [0, -CHAMBER_SIZE.height / 2, 0],
    rotation: [-Math.PI / 2, 0, 0],
    args: [CHAMBER_SIZE.width + 1, CHAMBER_SIZE.depth + 1, 56, 56],
  },
];

function MicroscopeChamber({ themeMode = 'day' }) {
  const invalidate = useThree((state) => state.invalidate);
  const theme = getSceneTheme(themeMode);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uWaveStrength: { value: theme.chamberWaveStrength },
          uSkyColor: { value: new THREE.Color(theme.chamberSky) },
          uCloudColor: { value: new THREE.Color(theme.chamberCloud) },
        },
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useFrame((state) => {
    const lerpSpeed = 0.035;
    const targetSky = new THREE.Color(theme.chamberSky);
    const targetCloud = new THREE.Color(theme.chamberCloud);

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uWaveStrength.value +=
      (theme.chamberWaveStrength - material.uniforms.uWaveStrength.value) * lerpSpeed;
    material.uniforms.uSkyColor.value.lerp(targetSky, lerpSpeed);
    material.uniforms.uCloudColor.value.lerp(targetCloud, lerpSpeed);

    invalidate();
  });

  return (
    <group position={[0, 0.6, 0]}>
      {WALLS.map((wall) => (
        <mesh
          key={wall.id}
          position={wall.position}
          rotation={wall.rotation}
          renderOrder={-3}
        >
          <planeGeometry args={wall.args} />
          <primitive object={material} attach="material" />
        </mesh>
      ))}

    </group>
  );
}

export default MicroscopeChamber;
