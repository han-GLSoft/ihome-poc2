import type { Room } from '../types/furniture';

const CM = 0.01;

export default function RoomBox({ room }: { room: Room }) {
  const w = room.width * CM;
  const d = room.depth * CM;
  const h = room.height * CM;

  return (
    <group>
      {/* Floor — subtle dark surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#131C30" roughness={0.95} metalness={0.05} />
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
          '#1E293B',
          '#1A2540',
        ]}
        position={[0, 0.001, 0]}
      />
    </group>
  );
}
