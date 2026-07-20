import { ThemedStandardMaterial } from './ThemeTransition.jsx';

const CHAMBER_SIZE = {
  width: 40,
  height: 20,
  depth: 40,
};

const WALLS = [
  {
    id: 'front',
    position: [0, 0, CHAMBER_SIZE.depth / 2],
    rotation: [0, Math.PI, 0],
    args: [CHAMBER_SIZE.width + 1, CHAMBER_SIZE.height, 56, 24],
  },
  {
    id: 'right',
    position: [CHAMBER_SIZE.width / 2, 0, 0],
    rotation: [0, -Math.PI / 2, 0],
    args: [CHAMBER_SIZE.depth, CHAMBER_SIZE.height, 56, 24],
  },
  {
    id: 'back',
    position: [0, 0, -CHAMBER_SIZE.depth / 2],
    rotation: [0, 0, 0],
    args: [CHAMBER_SIZE.width + 1, CHAMBER_SIZE.height, 56, 24],
  },
  {
    id: 'top',
    position: [0, CHAMBER_SIZE.height / 2, 0],
    rotation: [Math.PI / 2, 0, 0],
    args: [CHAMBER_SIZE.width + 1, CHAMBER_SIZE.depth + 1, 56, 56],
  },
  {
    id: 'floor',
    position: [0, -CHAMBER_SIZE.height / 2, 0],
    rotation: [-Math.PI / 2, 0, 0],
    args: [CHAMBER_SIZE.width + 1, CHAMBER_SIZE.depth + 1, 56, 56],
  },
];

const LEFT_WALL_PANELS = [
  {
    id: 'left-top',
    position: [-CHAMBER_SIZE.width / 2, 7.4, 0],
    args: [CHAMBER_SIZE.depth, 5.2, 56, 8],
  },
  {
    id: 'left-bottom',
    position: [-CHAMBER_SIZE.width / 2, -5.8, 0],
    args: [CHAMBER_SIZE.depth, 10, 56, 8],
  },
  {
    id: 'left-back',
    position: [-CHAMBER_SIZE.width / 2, 2, -14.5],
    args: [12, 5.6, 18, 8],
  },
  {
    id: 'left-front',
    position: [-CHAMBER_SIZE.width / 2, 2, 14.5],
    args: [12, 5.6, 18, 8],
  },
];

const WINDOW_FRAME = [
  {
    id: 'window-top',
    position: [-19.92, 4.8, 0],
    scale: [0.14, 0.14, 8.2],
  },
  {
    id: 'window-bottom',
    position: [-19.92, -0.8, 0],
    scale: [0.14, 0.14, 8.2],
  },
  {
    id: 'window-left',
    position: [-19.92, 2, -8.5],
    scale: [0.14, 2.92, 0.14],
  },
  {
    id: 'window-right',
    position: [-19.92, 2, 8.5],
    scale: [0.14, 2.92, 0.14],
  },
];

function WallDetails() {
  return (
    <group>
      <mesh position={[-19.86, 2, -13.2]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[6.4, 2.4, 0.1]} />
        <meshStandardMaterial color="#b99269" roughness={0.82} metalness={0.01} />
      </mesh>
      <mesh position={[-19.78, 2, -13.2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[5.7, 1.8, 0.06]} />
        <meshStandardMaterial color="#d8c19c" roughness={0.86} metalness={0.01} />
      </mesh>
      {[
        { y: 2.42, z: -14.8, color: '#fff7d6' },
        { y: 1.82, z: -13.45, color: '#f4b6a4' },
        { y: 2.14, z: -12.1, color: '#d9f99d' },
      ].map((note) => (
        <mesh key={`${note.y}-${note.z}`} position={[-19.7, note.y, note.z]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.95, 0.58, 0.04]} />
          <meshStandardMaterial color={note.color} roughness={0.72} />
        </mesh>
      ))}
      {[-14.7, -13.2, -11.7].map((z) => (
        <mesh key={z} position={[-19.66, 2.88, z]} rotation={[0, Math.PI / 2, 0]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.34} roughness={0.3} />
        </mesh>
      ))}

      <mesh position={[-19.82, 1.4, 13]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.16, 0.32]} />
        <meshStandardMaterial color="#9a6b3f" roughness={0.62} metalness={0.06} />
      </mesh>
      {[-1.25, 0, 1.25].map((z) => (
        <mesh key={z} position={[-19.72, 1.86, 13 + z]} rotation={[0, 0, Math.PI / 2]} receiveShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.82, 16]} />
          <meshStandardMaterial color={z === 0 ? '#fbbf24' : '#a7f3d0'} roughness={0.35} metalness={0.02} transparent opacity={0.82} />
        </mesh>
      ))}

      <mesh position={[-19.86, -4, -13]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[4.6, 2.8, 0.1]} />
        <meshStandardMaterial color="#8fa19a" roughness={0.76} metalness={0.03} />
      </mesh>
      <mesh position={[-19.78, -4, -13]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[3.9, 2.1, 0.05]} />
        <meshStandardMaterial color="#fff8e7" roughness={0.7} />
      </mesh>
      {[-0.75, 0, 0.75].map((z) => (
        <mesh key={z} position={[-19.72, -4, -13 + z]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.4, 0.08, 0.04]} />
          <meshStandardMaterial color="#0f766e" roughness={0.5} />
        </mesh>
      ))}

      {[6.9, -6.9].map((z) => (
        <mesh key={z} position={[-19.74, 5.8, z]} rotation={[0, Math.PI / 2, 0]}>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshStandardMaterial color="#facc15" emissive="#f59e0b" emissiveIntensity={0.85} roughness={0.28} />
        </mesh>
      ))}
    </group>
  );
}

function LabBench() {
  return (
    <group>
      <mesh position={[0, -1.9, 0]} receiveShadow>
        <boxGeometry args={[8.8, 0.34, 4.8]} />
        <meshStandardMaterial color="#c9b18d" roughness={0.74} metalness={0.04} />
      </mesh>
      <mesh position={[0, -1.68, 0]} receiveShadow>
        <boxGeometry args={[9.2, 0.12, 5.2]} />
        <meshStandardMaterial color="#fff7e6" roughness={0.5} metalness={0.08} />
      </mesh>
      {[-3.8, 3.8].map((x) =>
        [-1.9, 1.9].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -3.55, z]} receiveShadow>
            <cylinderGeometry args={[0.12, 0.16, 3.25, 12]} />
            <meshStandardMaterial color="#8aa0a6" roughness={0.55} metalness={0.36} />
          </mesh>
        )),
      )}
      <mesh position={[-2.75, -1.42, -1.7]} rotation={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[1.45, 0.08, 0.82]} />
        <meshStandardMaterial color="#99f6e4" roughness={0.28} metalness={0.02} emissive="#0f766e" emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[2.85, -1.36, -1.5]} rotation={[0, -0.28, 0]} receiveShadow>
        <boxGeometry args={[1.25, 0.1, 0.48]} />
        <meshStandardMaterial color="#e0f2fe" roughness={0.35} metalness={0.04} />
      </mesh>
      <mesh position={[2.85, -1.28, -1.5]} rotation={[0, -0.28, 0]}>
        <boxGeometry args={[0.82, 0.035, 0.26]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.22} roughness={0.42} />
      </mesh>
      <mesh position={[3.35, -1.18, 1.35]} receiveShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.9, 16]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.42} metalness={0.04} transparent opacity={0.82} />
      </mesh>
      <mesh position={[3.35, -0.68, 1.35]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.55} roughness={0.28} />
      </mesh>
      {[-0.55, 0, 0.55].map((x) => (
        <mesh key={x} position={[-0.8 + x, -1.28, 1.85]} rotation={[0, 0.12, 0]} receiveShadow>
          <boxGeometry args={[0.42, 0.04, 0.78]} />
          <meshStandardMaterial color="#fde68a" roughness={0.58} metalness={0.02} />
        </mesh>
      ))}
      <pointLight position={[3.35, -0.32, 1.35]} intensity={0.75} color="#fbbf24" distance={5} />
    </group>
  );
}

function MicroscopeChamber({ themeMode = 'warm' }) {
  return (
    <group position={[0, 0.6, 0]}>
      {WALLS.map((wall) => (
        <mesh
          key={wall.id}
          position={wall.position}
          rotation={wall.rotation}
          renderOrder={-3}
        >
          <planeGeometry args={wall.args} />
          <ThemedStandardMaterial
            themeMode={themeMode}
            warmColor={wall.id === 'floor' ? '#aaa594' : '#cfc8b8'}
            coldColor={wall.id === 'floor' ? '#aebcc0' : '#d9e2e4'}
            roughness={0.86}
            metalness={0.02}
          />
        </mesh>
      ))}

      {LEFT_WALL_PANELS.map((panel) => (
        <mesh
          key={panel.id}
          position={panel.position}
          rotation={[0, Math.PI / 2, 0]}
          renderOrder={-3}
        >
          <planeGeometry args={panel.args} />
          <ThemedStandardMaterial
            themeMode={themeMode}
            warmColor="#b9aa8d"
            coldColor="#c3d0d2"
            roughness={0.88}
            metalness={0.02}
          />
        </mesh>
      ))}

      {WINDOW_FRAME.map((piece) => (
        <mesh key={piece.id} position={piece.position} scale={piece.scale} receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <ThemedStandardMaterial
            themeMode={themeMode}
            warmColor="#f2e5c9"
            coldColor="#e9f3f2"
            roughness={0.52}
            metalness={0.08}
          />
        </mesh>
      ))}

      <LabBench />
      <WallDetails />
    </group>
  );
}

export default MicroscopeChamber;
