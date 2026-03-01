import { useRef } from 'react';
import type { Mesh } from 'three';
import type { Room } from '../types/furniture';

const CM = 0.01; // cm → meters

interface RoomBoxProps {
  room: Room;
}

export default function RoomBox({ room }: RoomBoxProps) {
  const floorRef = useRef<Mesh>(null);

  const w = room.width * CM;
  const d = room.depth * CM;
  const h = room.height * CM;

  return (
    <group>
      {/* Floor */}
      <mesh ref={floorRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#1e2235" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Room wireframe outline box */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color="#3d4a7a"
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Floor grid */}
      <gridHelper
        args={[Math.max(w, d), Math.round(Math.max(room.width, room.depth) / 50), '#2d3a5e', '#242d4e']}
        position={[0, 0.001, 0]}
      />
    </group>
  );
}
