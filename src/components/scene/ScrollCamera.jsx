import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_PATH } from '../../config/cameraPath';

const smoothstep = (t) => t * t * (3 - 2 * t);
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const START_HOLD_END = 0.14;
const MID_MOVE_END = 0.42;
const MID_HOLD_END = 0.58;
const END_MOVE_END = 0.84;
const END_HOLD_END = 0.9;

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
    if (progress <= START_HOLD_END) {
      desiredPosition.current.copy(path.start);
    } else if (progress < MID_MOVE_END) {
      const moveToMid = smoothstep(
        clamp((progress - START_HOLD_END) / (MID_MOVE_END - START_HOLD_END)),
      );
      desiredPosition.current.lerpVectors(path.start, path.mid, moveToMid);
    } else if (progress <= MID_HOLD_END) {
      desiredPosition.current.copy(path.mid);
    } else if (progress < END_MOVE_END) {
      const moveToEnd = smoothstep(
        clamp((progress - MID_HOLD_END) / (END_MOVE_END - MID_HOLD_END)),
      );
      desiredPosition.current.lerpVectors(path.mid, path.end, moveToEnd);
    } else if (progress <= END_HOLD_END) {
      desiredPosition.current.copy(path.end);
    } else {
      const moveToScope = smoothstep(clamp((progress - END_HOLD_END) / (1 - END_HOLD_END)));
      desiredPosition.current.lerpVectors(path.end, path.scopeEntry, moveToScope);
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
