import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import RoomBox from './RoomBox';
import FurnitureBox from './FurnitureBox';
import type { FurnitureItem, Room } from '../types/furniture';

interface RoomSceneProps {
  room: Room;
  furniture: FurnitureItem[];
  selectedId?: string;
  onSelectFurniture: (item: FurnitureItem | null) => void;
}

const CM = 0.01;

export default function RoomScene({ room, furniture, selectedId, onSelectFurniture }: RoomSceneProps) {
  const camDist = Math.max(room.width, room.depth) * CM * 1.5;
  const gizmoBottomMargin = furniture.length > 0 ? 170 : 64;

  return (
    <div className="w-full h-full" style={{ background: '#0A0D1A' }}>
      <Canvas
        shadows
        camera={{ position: [camDist, camDist * 0.75, camDist], fov: 48, near: 0.05, far: 200 }}
        onPointerMissed={() => onSelectFurniture(null)}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          {/* Ambient */}
          <ambientLight intensity={0.5} color="#C8D8FF" />

          {/* Key light */}
          <directionalLight
            position={[6, 10, 6]}
            intensity={1.4}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            color="#FFFFFF"
          />

          {/* Fill light */}
          <directionalLight position={[-4, 3, -4]} intensity={0.3} color="#8899FF" />

          {/* Rim light */}
          <directionalLight position={[0, 6, -8]} intensity={0.2} color="#AABBFF" />

          {/* Room wireframe + floor */}
          <RoomBox room={room} />

          {/* Furniture */}
          {furniture.map(item => (
            <FurnitureBox
              key={item.id}
              item={item}
              isSelected={item.id === selectedId}
              onClick={onSelectFurniture}
            />
          ))}

          <OrbitControls
            makeDefault
            maxPolarAngle={Math.PI / 2.05}
            minDistance={0.5}
            maxDistance={25}
            enableDamping
            dampingFactor={0.08}
          />

          <GizmoHelper alignment="bottom-right" margin={[64, gizmoBottomMargin]}>
            <GizmoViewport labelColor="white" axisHeadScale={1} />
          </GizmoHelper>
        </Suspense>
      </Canvas>

      {/* Interaction hint */}
      {furniture.length > 0 && !selectedId && (
        <div
          className="absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs pointer-events-none font-cinzel tracking-widest"
          style={{
            background: 'rgba(15,23,42,0.8)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#475569',
            backdropFilter: 'blur(8px)',
          }}
        >
          點擊家具查看詳情 · 拖曳旋轉 · 滾輪縮放
        </div>
      )}
    </div>
  );
}
