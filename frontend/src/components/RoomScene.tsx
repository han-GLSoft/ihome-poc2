import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, GizmoHelper, GizmoViewport } from '@react-three/drei';
import RoomBox from './RoomBox';
import FurnitureBox from './FurnitureBox';
import type { FurnitureItem, Room } from '../types/furniture';

interface RoomSceneProps {
  room: Room;
  furniture: FurnitureItem[];
  selectedId?: string;
  onSelectFurniture: (item: FurnitureItem) => void;
}

const CM = 0.01;

export default function RoomScene({ room, furniture, selectedId, onSelectFurniture }: RoomSceneProps) {
  const camDistance = Math.max(room.width, room.depth) * CM * 1.4;

  return (
    <div className="flex-1 h-full relative">
      <Canvas
        shadows
        camera={{
          position: [camDistance, camDistance * 0.8, camDistance],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        onPointerMissed={() => onSelectFurniture(null as unknown as FurnitureItem)}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight position={[-3, 4, -3]} intensity={0.4} color="#8888ff" />
          <Environment preset="city" />

          {/* Room */}
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

          {/* Controls */}
          <OrbitControls
            makeDefault
            maxPolarAngle={Math.PI / 2}
            minDistance={1}
            maxDistance={20}
          />

          {/* Corner gizmo */}
          <GizmoHelper alignment="bottom-right" margin={[70, 70]}>
            <GizmoViewport labelColor="white" axisHeadScale={1} />
          </GizmoHelper>
        </Suspense>
      </Canvas>

      {/* Empty state overlay */}
      {furniture.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-5xl mb-4 opacity-30">🛋️</p>
          <p className="text-slate-500 text-sm">設定房間參數並點擊「生成 AI 家具方案」</p>
        </div>
      )}

      {/* Hint */}
      {furniture.length > 0 && !selectedId && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur px-4 py-2 rounded-full text-xs text-slate-300 pointer-events-none">
          點擊家具查看詳情 · 拖曳旋轉 · 滾輪縮放
        </div>
      )}
    </div>
  );
}
