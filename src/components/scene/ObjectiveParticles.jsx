import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const OBJECTIVE_POSITION = new THREE.Vector3(0, 1.38, 0);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (value) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
const seededValue = (seed) => {
  const value = Math.sin(seed * 91.3458) * 47453.5453;
  return value - Math.floor(value);
};

function ObjectiveParticles({
  progress = 0,
  isMobile = false,
  isActive = true,
  themeMode = 'warm',
}) {
  const meshRef = useRef(null);
  const materialRef = useRef(null);
  const invalidate = useThree((state) => state.invalidate);
  const count = isMobile ? 18 : 48;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const targetColor = useMemo(
    () => new THREE.Color(themeMode === 'cold' ? '#73dcff' : '#7cf7ce'),
    [themeMode],
  );
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const angle = seededValue(index + 1) * Math.PI * 2;
        const radius = 1.45 + seededValue(index + 21) * 3.6;

        return {
          start: new THREE.Vector3(
            Math.cos(angle) * radius,
            -0.35 + seededValue(index + 41) * 4.2,
            Math.sin(angle) * radius,
          ),
          target: OBJECTIVE_POSITION.clone().add(
            new THREE.Vector3(
              (seededValue(index + 61) - 0.5) * 0.28,
              (seededValue(index + 81) - 0.5) * 0.18,
              (seededValue(index + 101) - 0.5) * 0.28,
            ),
          ),
          speed: 0.45 + seededValue(index + 121) * 0.75,
          phase: seededValue(index + 141) * Math.PI * 2,
          size: 0.55 + seededValue(index + 161) * 0.85,
        };
      }),
    [count],
  );

  useEffect(() => invalidate(), [invalidate, progress, themeMode]);

  useFrame((state, delta) => {
    if (!isActive || !meshRef.current || !materialRef.current) return;

    const appearance = smoothstep((progress - 0.2) / 0.3);
    const convergence = smoothstep((progress - 0.55) / 0.43);
    const time = state.clock.elapsedTime;

    materialRef.current.opacity = appearance * (0.16 + convergence * 0.72);
    materialRef.current.color.lerp(targetColor, 1 - Math.exp(-delta * 4.5));
    materialRef.current.emissive.copy(materialRef.current.color);
    materialRef.current.emissiveIntensity = 0.2 + convergence * 1.45;

    particles.forEach((particle, index) => {
      const staggeredConvergence = smoothstep(
        (convergence - index / count * 0.16) / 0.84,
      );
      dummy.position.lerpVectors(
        particle.start,
        particle.target,
        staggeredConvergence,
      );

      const orbit = (1 - staggeredConvergence) * 0.14;
      dummy.position.x += Math.sin(time * particle.speed + particle.phase) * orbit;
      dummy.position.y += Math.cos(time * particle.speed * 0.8 + particle.phase) * orbit;
      dummy.position.z += Math.cos(time * particle.speed + particle.phase) * orbit;

      const scale = appearance
        * particle.size
        * (0.026 + convergence * 0.026)
        * (0.86 + Math.sin(time * 1.7 + particle.phase) * 0.14);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    if (appearance > 0 || progress > 0.16) {
      invalidate();
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, count]}
      frustumCulled={false}
      visible={progress > 0.16}
    >
      <sphereGeometry args={[1, isMobile ? 6 : 8, isMobile ? 4 : 6]} />
      <meshStandardMaterial
        ref={materialRef}
        color={themeMode === 'cold' ? '#73dcff' : '#7cf7ce'}
        emissive={themeMode === 'cold' ? '#73dcff' : '#7cf7ce'}
        emissiveIntensity={0.2}
        transparent
        opacity={0}
        depthWrite={false}
        roughness={0.25}
      />
    </instancedMesh>
  );
}

export default ObjectiveParticles;
