import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { BakeShadows } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import Environment from './Environment';
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

function Scene({ progress, isMobile, scopeProgress = 0, chamberTheme = 'warm' }) {
  const [hasWebGL, setHasWebGL] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const enableShadows = !isMobile;
  const devCameraPath = isMobile ? CAMERA_PATH.mobile : CAMERA_PATH.desktop;
  const scopeFade = Math.min(
    1,
    Math.max(0, (scopeProgress - SCOPE_ACTIVATION_START) / SCOPE_ACTIVATION_RANGE),
  );

  useEffect(() => {
    const canvas = document.createElement('canvas');
    // Three r181 requires WebGL2. Release the probe's GPU context afterward.
    const gl = canvas.getContext('webgl2');
    setHasWebGL(Boolean(gl));
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }, []);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(motion.matches);
    const updateVisibility = () => setIsPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    motion.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      motion.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
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
        shadows={enableShadows}
        dpr={isMobile ? 1 : [1, 1.5]}
        frameloop={ENABLE_DEV_CONTROLS ? 'always' : 'demand'}
        camera={{ position: [0, 2.4, 7.4], fov: isMobile ? 42 : 35, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1,
          powerPreference: 'default',
        }}
      >
        <color attach="background" args={['#b4c7c8']} />

        <Suspense fallback={null}>
          <Environment />
          <Lights enableShadows={enableShadows} themeMode={chamberTheme} />
          {!ENABLE_DEV_CONTROLS ? <ScrollCamera progress={progress} isMobile={isMobile} /> : null}
          <MicroscopeChamber themeMode={chamberTheme} />
          <WaterfallPlane
            isActive={scopeFade < 1 && isPageVisible}
            themeMode={chamberTheme}
            reducedMotion={reducedMotion}
            isMobile={isMobile}
          />
          <MicroscopeModel />
          {/* Geometry and light positions are static; only the camera moves. */}
          {enableShadows ? <BakeShadows /> : null}
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
