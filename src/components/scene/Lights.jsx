import { ThemedLight } from './ThemeTransition.jsx';

function Lights({ enableShadows = false, themeMode = 'warm' }) {
  return (
    <>
      <ThemedLight
        type="ambientLight"
        themeMode={themeMode}
        warmIntensity={0.22}
        coldIntensity={0.28}
        warmColor="#fff1d6"
        coldColor="#eef8ff"
      />
      <ThemedLight
        type="directionalLight"
        themeMode={themeMode}
        position={[1, 7, 4]}
        warmIntensity={3.2}
        coldIntensity={3}
        warmColor="#ffe0aa"
        coldColor="#e5f4ff"
        castShadow={enableShadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={6}
        shadow-camera-bottom={-5}
        shadow-camera-near={0.5}
        shadow-camera-far={22}
        shadow-normalBias={0.025}
        shadow-bias={-0.0002}
      />
      <ThemedLight
        type="directionalLight"
        themeMode={themeMode}
        position={[-4, 3.5, 1]}
        warmIntensity={0.9}
        coldIntensity={1.1}
        warmColor="#ffbd73"
        coldColor="#b8e7ff"
      />
      <ThemedLight
        type="directionalLight"
        themeMode={themeMode}
        position={[-2, 5, -4]}
        warmIntensity={1.8}
        coldIntensity={2.1}
        warmColor="#ffce91"
        coldColor="#8adce5"
      />
    </>
  );
}

export default Lights;
