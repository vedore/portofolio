import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (value) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

function LivingSpecimen({
  progress = 0,
  isMobile = false,
  isActive = true,
  themeMode = 'warm',
}) {
  const specimenRef = useRef(null);
  const specimenMaterialRef = useRef(null);
  const coreMaterialRef = useRef(null);
  const lightRef = useRef(null);
  const invalidate = useThree((state) => state.invalidate);
  const segmentCount = isMobile ? 24 : 40;
  const targetSpecimenColor = useMemo(
    () => new THREE.Color(themeMode === 'cold' ? '#39d8ff' : '#35f2bd'),
    [themeMode],
  );
  const targetCoreColor = useMemo(
    () => new THREE.Color(themeMode === 'cold' ? '#b995ff' : '#ffae36'),
    [themeMode],
  );
  const brightness = smoothstep((progress - 0.18) / 0.76);

  useEffect(() => invalidate(), [brightness, invalidate, themeMode]);

  useFrame((state, delta) => {
    if (!isActive) return;

    const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 1.35) * 0.5;
    const specimenMaterial = specimenMaterialRef.current;
    const coreMaterial = coreMaterialRef.current;
    const specimen = specimenRef.current;
    const light = lightRef.current;

    if (specimenMaterial) {
      specimenMaterial.color.lerp(targetSpecimenColor, 1 - Math.exp(-delta * 4.5));
      specimenMaterial.emissive.copy(specimenMaterial.color);
      specimenMaterial.emissiveIntensity = 0.08 + brightness * (0.9 + pulse * 0.22);
    }

    if (coreMaterial) {
      coreMaterial.color.lerp(targetCoreColor, 1 - Math.exp(-delta * 4.5));
      coreMaterial.emissive.copy(coreMaterial.color);
      coreMaterial.emissiveIntensity = 0.14 + brightness * (1.3 + pulse * 0.34);
    }

    if (specimen) {
      const scale = 1 + brightness * 0.035 + pulse * brightness * 0.018;
      specimen.scale.set(scale, 0.16, scale * 0.78);
    }

    if (light) {
      light.color.lerp(targetSpecimenColor, 1 - Math.exp(-delta * 4.5));
      light.intensity = brightness * (0.48 + pulse * 0.14);
    }

    invalidate();
  });

  return (
    <group position={[0.52, 1.34, 0.14]}>
      <mesh>
        <cylinderGeometry args={[0.5, 0.47, 0.065, segmentCount]} />
        <meshPhysicalMaterial
          color="#bcefea"
          roughness={0.08}
          metalness={0}
          transmission={0.5}
          thickness={0.08}
          transparent
          opacity={0.34}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.038, 0]}>
        <torusGeometry args={[0.46, 0.028, 8, segmentCount]} />
        <meshStandardMaterial
          color="#d9fffa"
          roughness={0.18}
          metalness={0.05}
          transparent
          opacity={0.48}
        />
      </mesh>
      <mesh ref={specimenRef} position={[0, 0.057, 0]} scale={[1, 0.16, 0.78]}>
        <sphereGeometry args={[0.25, segmentCount, 12]} />
        <meshStandardMaterial
          ref={specimenMaterialRef}
          color={themeMode === 'cold' ? '#39d8ff' : '#35f2bd'}
          emissive={themeMode === 'cold' ? '#39d8ff' : '#35f2bd'}
          emissiveIntensity={0.08}
          roughness={0.42}
          transparent
          opacity={0.82}
        />
        <mesh position={[0.08, 0.04, -0.025]} scale={[0.34, 0.42, 0.34]}>
          <sphereGeometry args={[0.25, 18, 12]} />
          <meshStandardMaterial
            ref={coreMaterialRef}
            color={themeMode === 'cold' ? '#b995ff' : '#ffae36'}
            emissive={themeMode === 'cold' ? '#b995ff' : '#ffae36'}
            emissiveIntensity={0.14}
            roughness={0.35}
          />
        </mesh>
      </mesh>
      <pointLight
        ref={lightRef}
        position={[0, 0.32, 0]}
        color={themeMode === 'cold' ? '#39d8ff' : '#35f2bd'}
        intensity={0}
        distance={3.6}
        decay={2}
      />
    </group>
  );
}

export default LivingSpecimen;
