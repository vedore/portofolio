import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { getSceneTheme } from '../../config/sceneThemes.js';

function SunBeam({ themeMode = 'day' }) {
  const materialRef = useRef(null);
  const theme = getSceneTheme(themeMode);

  useFrame(() => {
    if (!materialRef.current) return;

    const lerpSpeed = 0.035;
    materialRef.current.color.lerp(new THREE.Color(theme.sun), lerpSpeed);
    materialRef.current.opacity += (theme.sunOpacity - materialRef.current.opacity) * lerpSpeed;
  });

  return (
    <group position={[0, 3, 0]} rotation={[0, 0, 0]}>
      <mesh renderOrder={2}>
        <coneGeometry args={[18, 20, 100, 1, true]} />
        <meshBasicMaterial
          ref={materialRef}
          color="#FFD27A"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default SunBeam;
