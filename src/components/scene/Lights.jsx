function Lights({ enableShadows = false }) {
  return (
    <>
      <ambientLight intensity={1.15} color="#f2f8ff" />
      <directionalLight
        position={[4, 8, 6]}
        intensity={1.55}
        color="#ffffff"
        castShadow={enableShadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-4, 2.2, 4]} intensity={0.7} color="#7dc7ff" />
      <pointLight position={[2, 1.5, -2]} intensity={0.45} color="#dff4ff" />
    </>
  );
}

export default Lights;
