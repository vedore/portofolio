import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { BakeShadows } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import Environment from './Environment';
import MicroscopeModel from './MicroscopeModel';
import ScrollCamera from './ScrollCamera';
import Lights from './Lights';
import CameraTuner from './CameraTuner';
import LabBench from './LabBench';
import { startSceneThemeCycle } from '../../utils/sceneTheme.js';
import { CAMERA_PATH } from '../../config/cameraPath';
import { SCENE_REVEAL_MS } from '../../config/scopeTiming.js';

const ENABLE_DEV_CONTROLS = import.meta.env.VITE_ENABLE_ORBIT === 'true';

function SceneReady({ onReady }) {
  useEffect(() => {
    // This mounts only after every suspended scene asset is ready.
    const frame = requestAnimationFrame(() => onReady(true));
    return () => cancelAnimationFrame(frame);
  }, [onReady]);
  return null;
}

function Scene({ progress, isMobile, lensEntry, reducedMotion }) {
  const [hasWebGL, setHasWebGL] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [chamberTheme, setChamberTheme] = useState('cold');
  const enableShadows = !isMobile;
  const devCameraPath = isMobile ? CAMERA_PATH.mobile : CAMERA_PATH.desktop;
  const isSceneActive = hasWebGL && (ENABLE_DEV_CONTROLS || lensEntry.field < 1);

  useEffect(() => {
    if (!isSceneActive) return;
    return startSceneThemeCycle(() => {
      setChamberTheme((theme) => (theme === 'warm' ? 'cold' : 'warm'));
    });
  }, [isSceneActive]);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    // Three r181 requires WebGL2. Release the probe's GPU context afterward.
    const gl = canvas.getContext('webgl2');
    setHasWebGL(Boolean(gl));
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }, []);

  if (!hasWebGL) {
    return <div className="fixed inset-0 z-0 bg-white" />;
  }

  return (
    <div
      key="scene"
      className={`fixed inset-0 z-0 transition-opacity ease-out ${ENABLE_DEV_CONTROLS ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{
        visibility: isSceneActive ? 'visible' : 'hidden',
        opacity: isReady ? 1 : 0,
        transitionDuration: `${reducedMotion ? 0 : SCENE_REVEAL_MS}ms`,
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
        <color attach="background" args={['#ffffff']} />

        <Suspense fallback={null}>
          <Environment />
          <Lights enableShadows={enableShadows} themeMode={chamberTheme} />
          {!ENABLE_DEV_CONTROLS ? <ScrollCamera progress={progress} isMobile={isMobile} entryCamera={lensEntry.camera} reducedMotion={reducedMotion} /> : null}
          <LabBench themeMode={chamberTheme} />
          <MicroscopeModel />
          {/* Geometry and light positions are static; only the camera moves. */}
          {enableShadows ? <BakeShadows /> : null}
          <SceneReady onReady={setIsReady} />
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
