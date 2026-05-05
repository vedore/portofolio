import { ContactShadows, Float } from '@react-three/drei';

function Environment({ isMobile = false }) {
  return (
    <>
      <Float speed={1.2} rotationIntensity={isMobile ? 0.02 : 0.04} floatIntensity={0.1}>
        <mesh position={[-3.8, 3.1, -5]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color="#d4ecff" transparent opacity={0.26} />
        </mesh>
      </Float>

      {!isMobile ? (
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.2}
          scale={12}
          blur={2.2}
          far={4}
          color="#8ec8e8"
        />
      ) : null}
    </>
  );
}

export default Environment;
