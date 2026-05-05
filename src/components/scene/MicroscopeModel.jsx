import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const MODEL_POSITION = [0, -1.45, 0];
export const MODEL_ROTATION = [0, 0, 0];
export const MODEL_SCALE = 1.35;

function MicroscopeModel() {
  // Change this path if you rename or move the microscope asset in /public/models.
  const { scene } = useGLTF('/models/microscope.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) {
        return;
      }

      child.castShadow = false;
      child.receiveShadow = false;

      if (child.material && 'envMapIntensity' in child.material) {
        child.material.envMapIntensity = 1.1;
      }

      if (child.material && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.roughness = Math.min(child.material.roughness ?? 0.7, 0.82);
        child.material.metalness = Math.min(child.material.metalness ?? 0.18, 0.22);
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.52, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#dfeaf3" roughness={0.95} metalness={0.02} />
      </mesh>
    </group>
  );
}

useGLTF.preload('/models/microscope.glb');

export default MicroscopeModel;
