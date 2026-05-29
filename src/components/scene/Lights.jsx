function Lights({ enableShadows = false, themeMode = 'warm' }) {
  const isCold = themeMode === 'cold';

  return (
    <>
      <ambientLight intensity={isCold ? 1.25 : 1.1} color={isCold ? '#eef8ff' : '#fff1d6'} />
      <directionalLight
        position={[4, 8, 6]}
        intensity={isCold ? 1.45 : 1.28}
        color={isCold ? '#e5f4ff' : '#ffe0aa'}
        castShadow={enableShadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-3, 5.5, 2.2]}
        intensity={isCold ? 0.92 : 1.22}
        color={isCold ? '#b8e7ff' : '#ffbd73'}
        castShadow={enableShadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-4, 2.2, 4]} intensity={isCold ? 0.78 : 0.52} color={isCold ? '#7dc7ff' : '#ffc36e'} />
      <pointLight position={[2, 1.5, -2]} intensity={isCold ? 0.55 : 0.36} color={isCold ? '#dff4ff' : '#ffe4b5'} />
    </>
  );
}

export default Lights;
