import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import MicroscopeModel from './MicroscopeModel';
import ScrollCamera from './ScrollCamera';
import Lights from './Lights';
import CameraTuner from './CameraTuner';
import MicroscopeChamber from './MicroscopeChamber';
import WaterfallPlane from './WaterfallPlane';
import { CAMERA_PATH } from '../../config/cameraPath';
import {
  SCOPE_ACTIVATION_RANGE,
  SCOPE_ACTIVATION_START,
} from '../../config/scopeTiming.js';

const ENABLE_DEV_CONTROLS = import.meta.env.VITE_ENABLE_ORBIT === 'true';
const ENABLE_SHADOWS = false;

function Scene({ progress, isMobile, scopeProgress = 0, chamberTheme = 'warm' }) {
  const [hasWebGL, setHasWebGL] = useState(true);
  const devCameraPath = isMobile ? CAMERA_PATH.mobile : CAMERA_PATH.desktop;
  const scopeFade = Math.min(
    1,
    Math.max(0, (scopeProgress - SCOPE_ACTIVATION_START) / SCOPE_ACTIVATION_RANGE),
  );

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
    <div
      className={`fixed inset-0 z-0 transition-opacity duration-300 ${ENABLE_DEV_CONTROLS ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{
        opacity: 1 - scopeFade,
        visibility: !ENABLE_DEV_CONTROLS && scopeFade >= 1 ? 'hidden' : 'visible',
      }}
    >
      <Canvas
        shadows={ENABLE_SHADOWS}
        dpr={1}
        frameloop={ENABLE_DEV_CONTROLS ? 'always' : 'demand'}
        camera={{ position: [0, 2.4, 7.4], fov: isMobile ? 42 : 35, near: 0.1, far: 100 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'default',
        }}
      >
        {/*BackGround Color */}
        <color attach="background" args={['#FFFFFF']} />

        <Suspense fallback={null}>
          <Lights enableShadows={ENABLE_SHADOWS} themeMode={chamberTheme} />
          {!ENABLE_DEV_CONTROLS ? <ScrollCamera progress={progress} isMobile={isMobile} /> : null}
          <MicroscopeChamber themeMode={chamberTheme} />
          <WaterfallPlane isActive={scopeFade < 1} themeMode={chamberTheme} />
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
