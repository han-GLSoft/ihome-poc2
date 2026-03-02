import type { Room } from '../types/furniture';

const CM = 0.01;

export default function RoomBox({ room }: { room: Room }) {
  const w = room.width * CM;
  const d = room.depth * CM;
  const h = room.height * CM;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#2A3F61" roughness={0.9} metalness={0.06} />
      </mesh>

      {/* Room wireframe */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color="#6366F1"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Floor grid */}
      <gridHelper
        args={[
          Math.max(w, d),
          Math.round(Math.max(room.width, room.depth) / 50),
          '#4C6386',
          '#3C5377',
        ]}
        position={[0, 0.001, 0]}
      />
    </group>
  );
}
