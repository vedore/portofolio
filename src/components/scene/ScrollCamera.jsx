import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_PATH } from '../../config/cameraPath';

const smoothstep = (t) => t * t * (3 - 2 * t);
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function ScrollCamera({ progress, isMobile }) {
  const { camera } = useThree();
  const currentPosition = useRef(new THREE.Vector3());
  const currentTarget = useRef(new THREE.Vector3());

  const config = isMobile ? CAMERA_PATH.mobile : CAMERA_PATH.desktop;

  const path = useMemo(
    () => ({
      start: new THREE.Vector3(...config.start),
      mid: new THREE.Vector3(...config.mid),
      end: new THREE.Vector3(...config.end),
      target: new THREE.Vector3(...config.target),
    }),
    [config],
  );

  useEffect(() => {
    currentPosition.current.copy(path.start);
    currentTarget.current.copy(path.target);
    camera.position.copy(path.start);
    camera.lookAt(path.target);
  }, [camera, path]);

  useFrame((_, delta) => {
    const firstStage = clamp(progress / 0.85);
    const secondStage = clamp((progress - 0.15) / 0.3);

    const desiredPosition = new THREE.Vector3();

    if (progress < 0.62) {
      desiredPosition.lerpVectors(path.start, path.mid, smoothstep(firstStage));
    } else {
      desiredPosition.lerpVectors(path.mid, path.end, smoothstep(secondStage));
    }

    const desiredTarget = path.target.clone();
    //desiredTarget.z += progress > 0.8 ? -smoothstep(clamp((progress - 0.8) / 0.2)) * 0.5 : 0;

    const damping = 1 - Math.exp(-delta * 5);
    currentPosition.current.lerp(desiredPosition, damping);
    currentTarget.current.lerp(desiredTarget, damping);

    camera.position.copy(currentPosition.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

export default ScrollCamera;
