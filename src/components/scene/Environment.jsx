import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

function Environment() {
  const { gl, scene, invalidate } = useThree();

  useEffect(() => {
    // Bake local softbox reflections once, without a remote HDR or cube loop.
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = generator.fromScene(room, 0.04);
    const previousEnvironment = scene.environment;
    const previousIntensity = scene.environmentIntensity;
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.65;
    room.dispose();
    generator.dispose();
    invalidate();

    return () => {
      scene.environment = previousEnvironment;
      scene.environmentIntensity = previousIntensity;
      environment.dispose();
    };
  }, [gl, invalidate, scene]);

  return null;
}

export default Environment;
