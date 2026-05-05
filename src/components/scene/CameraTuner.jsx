import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const roundTriplet = (values) => values.map((n) => Number(n.toFixed(3)));

function CameraTuner({ lensTarget = [0, 1, 0], initialPosition = [2, 2, 5] }) {
  const controlsRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...initialPosition);

    if (controlsRef.current) {
      controlsRef.current.target.set(...lensTarget);
      controlsRef.current.update();
    }

    function printCapture(label) {
      if (!controlsRef.current) {
        return;
      }

      const cameraPosition = roundTriplet(camera.position.toArray());
      const targetPosition = roundTriplet(controlsRef.current.target.toArray());

      console.log(`${label} CAMERA:`, cameraPosition);
      console.log(`${label} TARGET:`, targetPosition);
      console.log(
        `${label}\n` +
          `camera: [${cameraPosition.join(', ')}]\n` +
          `target: [${targetPosition.join(', ')}]`,
      );
    }

    function handleKeyDown(event) {
      const key = event.key.toLowerCase();

      if (key === 'c') {
        printCapture('CURRENT');
      }

      if (key === '1') {
        printCapture('START');
      }

      if (key === '2') {
        printCapture('MID');
      }

      if (key === '3') {
        printCapture('END');
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [camera, initialPosition, lensTarget]);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan
      />

      <mesh position={lensTarget}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </>
  );
}

export default CameraTuner;
