import { LAB } from '../../config/sceneAppearance.js';
import LabBench from './LabBench.jsx';
import { ThemedStandardMaterial } from './ThemeTransition.jsx';

const CHAMBER_SIZE = {
  width: 18,
  height: 16,
  depth: 24,
};

const WALLS = [
  {
    id: 'front',
    position: [0, 0, CHAMBER_SIZE.depth / 2],
    rotation: [0, Math.PI, 0],
    args: [CHAMBER_SIZE.width + 1, CHAMBER_SIZE.height],
  },
  {
    id: 'right',
    position: [CHAMBER_SIZE.width / 2, 0, 0],
    rotation: [0, -Math.PI / 2, 0],
    args: [CHAMBER_SIZE.depth, CHAMBER_SIZE.height],
  },
  {
    id: 'back',
    position: [0, 0, -CHAMBER_SIZE.depth / 2],
    rotation: [0, 0, 0],
    args: [CHAMBER_SIZE.width + 1, CHAMBER_SIZE.height],
  },
  {
    id: 'top',
    position: [0, CHAMBER_SIZE.height / 2, 0],
    rotation: [Math.PI / 2, 0, 0],
    args: [CHAMBER_SIZE.width + 1, CHAMBER_SIZE.depth + 1],
  },
  {
    id: 'floor',
    position: [0, LAB.floor, 0],
    rotation: [-Math.PI / 2, 0, 0],
    args: [CHAMBER_SIZE.width + 1, CHAMBER_SIZE.depth + 1],
  },
];

const LEFT_WALL_PANELS = [
  {
    id: 'left-top',
    position: [-CHAMBER_SIZE.width / 2, 6, 0],
    args: [CHAMBER_SIZE.depth, 4],
  },
  {
    id: 'left-bottom',
    position: [-CHAMBER_SIZE.width / 2, -3, 0],
    args: [CHAMBER_SIZE.depth, 6],
  },
  {
    id: 'left-back',
    position: [-CHAMBER_SIZE.width / 2, 2, -8.5],
    args: [7, 4],
  },
  {
    id: 'left-front',
    position: [-CHAMBER_SIZE.width / 2, 2, 8.5],
    args: [7, 4],
  },
];

const WINDOW_FRAME = [
  {
    id: 'window-top',
    position: [-8.94, 4, 0],
    scale: [0.14, 0.12, 10.2],
  },
  {
    id: 'window-bottom',
    position: [-8.94, 0, 0],
    scale: [0.14, 0.12, 10.2],
  },
  {
    id: 'window-left',
    position: [-8.94, 2, -5],
    scale: [0.14, 4, 0.12],
  },
  {
    id: 'window-right',
    position: [-8.94, 2, 5],
    scale: [0.14, 4, 0.12],
  },
];

function MicroscopeChamber({ themeMode = 'warm' }) {
  return (
    <group name="laboratory">
      {WALLS.map((wall) => (
        <mesh
          key={wall.id}
          position={wall.position}
          rotation={wall.rotation}
          renderOrder={-3}
          receiveShadow={wall.id === 'floor'}
        >
          <planeGeometry args={wall.args} />
          <ThemedStandardMaterial
            themeMode={themeMode}
            warmColor={wall.id === 'floor' ? '#8e8b7f' : '#c2bcae'}
            coldColor={wall.id === 'floor' ? '#687d81' : '#a8bdc1'}
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
            warmColor="#c6bca9"
            coldColor="#b4c7c8"
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
            warmColor="#746a53"
            coldColor="#395861"
            roughness={0.3}
            metalness={0.65}
          />
        </mesh>
      ))}

      {[-8, -4, 4, 8].map((z) => (
        <mesh key={z} position={[-8.97, -2.3, z]}>
          <boxGeometry args={[0.04, 4.5, 0.035]} />
          <meshStandardMaterial color="#62797c" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[-8.86, 4.12, 0]}>
        <boxGeometry args={[0.05, 0.04, 10]} />
        <meshBasicMaterial color={themeMode === 'cold' ? '#b6efed' : '#ffe0ab'} toneMapped={false} />
      </mesh>
      <LabBench themeMode={themeMode} />
    </group>
  );
}

export default MicroscopeChamber;
