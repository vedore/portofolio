import { ThemedLight } from './ThemeTransition.jsx';

function Lights({ enableShadows = false, themeMode = 'warm' }) {
  return (
    <>
      <ThemedLight
        type="ambientLight"
        themeMode={themeMode}
        warmIntensity={1.1}
        coldIntensity={1.25}
        warmColor="#fff1d6"
        coldColor="#eef8ff"
      />
      <ThemedLight
        type="directionalLight"
        themeMode={themeMode}
        position={[4, 8, 6]}
        warmIntensity={1.28}
        coldIntensity={1.45}
        warmColor="#ffe0aa"
        coldColor="#e5f4ff"
        castShadow={enableShadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <ThemedLight
        type="directionalLight"
        themeMode={themeMode}
        position={[-3, 5.5, 2.2]}
        warmIntensity={1.22}
        coldIntensity={0.92}
        warmColor="#ffbd73"
        coldColor="#b8e7ff"
        castShadow={enableShadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <ThemedLight
        type="pointLight"
        themeMode={themeMode}
        position={[-4, 2.2, 4]}
        warmIntensity={0.52}
        coldIntensity={0.78}
        warmColor="#ffc36e"
        coldColor="#7dc7ff"
      />
      <ThemedLight
        type="pointLight"
        themeMode={themeMode}
        position={[2, 1.5, -2]}
        warmIntensity={0.36}
        coldIntensity={0.55}
        warmColor="#ffe4b5"
        coldColor="#dff4ff"
      />
    </>
  );
}

export default Lights;
