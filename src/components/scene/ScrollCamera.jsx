import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_PATH } from '../../config/cameraPath';
import { getCameraPosition } from '../../utils/cameraMotion.js';

function ScrollCamera({ progress, isMobile, entryCamera, reducedMotion }) {
  const { camera, invalidate } = useThree();
  const desiredPosition = useRef(new THREE.Vector3());
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

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3([path.start, path.mid, path.end], false, 'catmullrom'),
    [path],
  );

  useEffect(() => {
    camera.position.copy(path.start);
    camera.lookAt(path.target);
    invalidate();
  }, [camera, invalidate, path]);

  useEffect(() => {
    progressRef.current = progress;
    invalidate();
  }, [entryCamera, invalidate, progress, reducedMotion]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key.toLowerCase() !== 'c') {
        return;
      }

      const cameraPosition = camera.position
        .toArray()
        .map((n) => Number(n.toFixed(3)));

      const targetPosition = path.target
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
  }, [camera, path]);

  useFrame(() => {
    getCameraPosition(curve, path.scopeEntry, progress, entryCamera, reducedMotion, desiredPosition.current);

    // Progress is already smoothed together with the lens; never catch up separately.
    camera.position.copy(desiredPosition.current);
    camera.lookAt(path.target);
  });

  return null;
}

export default ScrollCamera;
