import { RoundedBox } from '@react-three/drei';
import { LAB } from '../../config/sceneAppearance.js';
import { ThemedStandardMaterial } from './ThemeTransition.jsx';

const contactVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const contactFragment = `
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float shadow = (1.0 - smoothstep(0.2, 1.0, dot(p, p))) * 0.28;
    gl_FragColor = vec4(0.035, 0.065, 0.07, shadow);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function LabBench({ themeMode }) {
  const underside = LAB.benchTop - LAB.benchThickness;
  const legHeight = underside - LAB.floor;

  return (
    <group name="lab-bench">
      <RoundedBox
        name="bench-top"
        position={[0, LAB.benchTop - LAB.benchThickness / 2, 0]}
        args={[LAB.width, LAB.benchThickness, LAB.depth]}
        radius={0.06} smoothness={2} bevelSegments={2} castShadow receiveShadow
      >
        <ThemedStandardMaterial themeMode={themeMode} warmColor="#d9cbb2" coldColor="#cad8d8" roughness={0.38} metalness={0.12} />
      </RoundedBox>
      <RoundedBox
        position={[0, underside - 0.16, 0]}
        args={[LAB.width - 0.12, 0.32, LAB.depth - 0.12]}
        radius={0.06} smoothness={2} bevelSegments={2} castShadow receiveShadow
      >
        <meshStandardMaterial color="#263c43" roughness={0.4} metalness={0.55} />
      </RoundedBox>
      {[-3.6, 3.6].map((x) =>
        [-1.7, 1.7].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, LAB.floor + legHeight / 2, z]} castShadow receiveShadow>
            <boxGeometry args={[0.14, legHeight, 0.14]} />
            <meshStandardMaterial color="#50656a" roughness={0.3} metalness={0.8} />
          </mesh>
        )),
      )}
      {/* Static contact grounding also works on mobile without a shadow map. */}
      <mesh position={[0, LAB.benchTop + 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 2.5]} />
        <shaderMaterial vertexShader={contactVertex} fragmentShader={contactFragment} transparent depthWrite={false} />
      </mesh>

      <group position={[-2.6, LAB.benchTop, -0.9]} rotation={[0, 0.16, 0]}>
        <RoundedBox position={[0, 0.05, 0]} args={[1.65, 0.1, 1.05]} radius={0.04} smoothness={2} bevelSegments={2} receiveShadow castShadow>
          <meshStandardMaterial color="#37545b" roughness={0.45} metalness={0.5} />
        </RoundedBox>
        {[-0.5, 0, 0.5].map((x) => (
          <group key={x} position={[x, 0.12, 0]}>
            <mesh receiveShadow>
              <boxGeometry args={[0.36, 0.035, 0.75]} />
              <meshStandardMaterial color="#b9e0db" roughness={0.16} metalness={0.25} />
            </mesh>
            <mesh position={[0, 0.02, -0.24]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.32, 0.22]} />
              <meshStandardMaterial color="#f0eee5" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>
      <group position={[2.65, LAB.benchTop, -1.1]}>
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.45, 0.1, 0.7]} />
          <meshStandardMaterial color="#e1e8e6" roughness={0.5} metalness={0.15} />
        </mesh>
        {[-0.44, 0, 0.44].map((x) => (
          <group key={x} position={[x, 0.1, 0]}>
            <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.115, 0.1, 0.6, 16]} />
              <meshStandardMaterial color="#8ebfbb" roughness={0.22} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0.62, 0]} castShadow>
              <cylinderGeometry args={[0.13, 0.13, 0.09, 16]} />
              <meshStandardMaterial color={x === 0 ? '#c29e59' : '#285a61'} roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

export default LabBench;
