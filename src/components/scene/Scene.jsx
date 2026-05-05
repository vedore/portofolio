import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import MicroscopeModel from './MicroscopeModel';
import ScrollCamera from './ScrollCamera';
import Lights from './Lights';
import Environment from './Environment';
import CameraTuner from './CameraTuner';
import { CAMERA_PATH } from '../../config/cameraPath';

const ENABLE_DEV_CONTROLS = import.meta.env.VITE_ENABLE_ORBIT === 'true';
const ENABLE_SHADOWS = false;

function Scene({ progress, isMobile }) {
  const [hasWebGL, setHasWebGL] = useState(true);
  const devCameraPath = isMobile ? CAMERA_PATH.mobile : CAMERA_PATH.desktop;

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl') ||
      canvas.getContext('webgl2');

    setHasWebGL(Boolean(gl));
  }, []);

  if (!hasWebGL) {
    return <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_#d8f0ff,_#eef6fc_32%,_#ffffff_72%)]" />;
  }

  return (
    <div className={`fixed inset-0 z-0 ${ENABLE_DEV_CONTROLS ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <Canvas
        shadows={ENABLE_SHADOWS}
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 2.4, 7.4], fov: isMobile ? 42 : 35, near: 0.1, far: 100 }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#edf7ff']} />
        <Suspense fallback={null}>
          <Environment isMobile={isMobile} />
          <Lights enableShadows={ENABLE_SHADOWS} />
          {!ENABLE_DEV_CONTROLS ? <ScrollCamera progress={progress} isMobile={isMobile} /> : null}
          <MicroscopeModel />
        </Suspense>

        {ENABLE_DEV_CONTROLS ? (
          <CameraTuner
            initialPosition={devCameraPath.start}
            lensTarget={devCameraPath.target}
          />
        ) : null}
      </Canvas>
    </div>
  );
}

export default Scene;
