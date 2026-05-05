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
  const desiredPosition = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());
  const progressRef = useRef(progress);

  const config = isMobile ? CAMERA_PATH.mobile : CAMERA_PATH.desktop;

  const path = useMemo(
    () => ({
      start: new THREE.Vector3(...config.start),
      mid: new THREE.Vector3(...config.mid),
      end: new THREE.Vector3(...config.end),
      scopeEntry: new THREE.Vector3(...config.scopeEntry),
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

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key.toLowerCase() !== 'c') {
        return;
      }

      const cameraPosition = camera.position
        .toArray()
        .map((n) => Number(n.toFixed(3)));

      const targetPosition = currentTarget.current
        .toArray()
        .map((n) => Number(n.toFixed(3)));

      console.log('PROGRESS:', Number(progressRef.current.toFixed(3)));
      console.log('CAMERA POSITION:', cameraPosition);
      console.log('TARGET POSITION:', targetPosition);
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [camera]);

  useFrame((_, delta) => {
    const firstStage = clamp(progress / 0.62);
    const secondStage = clamp((progress - 0.62) / 0.28);
    const thirdStage = clamp((progress - 0.9) / 0.058);

    if (progress < 0.62) {
      desiredPosition.current.lerpVectors(path.start, path.mid, smoothstep(firstStage));
    } else if (progress < 0.9) {
      desiredPosition.current.lerpVectors(path.mid, path.end, smoothstep(secondStage));
    } else {
      desiredPosition.current.lerpVectors(path.end, path.scopeEntry, smoothstep(thirdStage));
    }

    desiredTarget.current.copy(path.target);

    const damping = 1 - Math.exp(-delta * 5);
    currentPosition.current.lerp(desiredPosition.current, damping);
    currentTarget.current.lerp(desiredTarget.current, damping);

    camera.position.copy(currentPosition.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

export default ScrollCamera;
