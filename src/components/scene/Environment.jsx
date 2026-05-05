import { ContactShadows, Float } from '@react-three/drei';

function Environment({ isMobile = false }) {
  return (
    <>


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
