import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { MICROSCOPE_SURFACES } from '../../config/sceneAppearance.js';

export const MODEL_POSITION = [0, -1.45, 0];
export const MODEL_ROTATION = [0, 0, 0];
export const MODEL_SCALE = 1.35;

function MicroscopeModel() {
  const { scene } = useGLTF('/models/microscope.glb');

  const { model, materials } = useMemo(() => {
    // Own materials, but share immutable geometry/textures with useGLTF's cache.
    const model = scene.clone(true);
    const materials = new Map();
    const prepareMaterial = (source) => {
      if (materials.has(source)) return materials.get(source);
      const material = source.clone();
      if (material.isMeshStandardMaterial) {
        const surface = MICROSCOPE_SURFACES.find(({ prefix }) => source.name.startsWith(prefix));
        if (surface) {
          material.color.set(surface.color);
          material.metalness = surface.metalness;
          material.roughness = surface.roughness;
          material.envMapIntensity = surface.envMapIntensity ?? 0.85;
        }
      }
      materials.set(source, material);
      return material;
    };

    model.traverse((child) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;
      child.material = Array.isArray(child.material)
        ? child.material.map(prepareMaterial)
        : prepareMaterial(child.material);
    });
    return { model, materials };
  }, [scene]);

  useEffect(() => () => {
    materials.forEach((material) => material.dispose());
  }, [materials]);

  return (
    <group name="microscope">
      <primitive
        object={model}
        position={MODEL_POSITION}
        rotation={MODEL_ROTATION}
        scale={MODEL_SCALE}
      />
    </group>
  );
}

useGLTF.preload('/models/microscope.glb');

export default MicroscopeModel;
