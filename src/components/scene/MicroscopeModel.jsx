import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const MODEL_POSITION = [0, -1.45, 0];
export const MODEL_ROTATION = [0, 0, 0];
export const MODEL_SCALE = 1.35;

const COLORS = {
  background: '#101820', // deep navy
  floorSpot: '#2DD4BF',  // vivid teal
  accent: '#FBBF24',     // warm yellow
  softLight: '#A7F3D0',  // mint fill
  shadow: '#050A0D',     // almost black
  emissive: '#0F766E',   // darker teal glow
};

function MicroscopeModel() {
  const { scene } = useGLTF('/models/microscope.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      if (child.material && 'envMapIntensity' in child.material) {
        child.material.envMapIntensity = 1.6;
      }

      if (child.material && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.roughness = Math.min(child.material.roughness ?? 0.7, 0.65);
        child.material.metalness = Math.min(child.material.metalness ?? 0.18, 0.28);
        child.material.needsUpdate = true;
      }
    });
  }, [scene]);

  return (
    <group>
      <primitive
        object={scene}
        position={MODEL_POSITION}
        rotation={MODEL_ROTATION}
        scale={MODEL_SCALE}
      />

      {/* Spot/floor under microscope */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.52, 0]}
        receiveShadow
      >
        <circleGeometry args={[3.2, 96]} />
        <meshStandardMaterial
          color={COLORS.floorSpot}
          roughness={0.72}
          metalness={0.03}
          emissive={COLORS.emissive}
          emissiveIntensity={0.14}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload('/models/microscope.glb');

export default MicroscopeModel;