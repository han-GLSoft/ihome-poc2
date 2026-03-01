import { useState, useCallback, useMemo } from 'react';
import ControlPanel from './components/ControlPanel';
import RoomScene from './components/RoomScene';
import FurnitureCard from './components/FurnitureCard';
import FurnitureListBar from './components/FurnitureListBar';
import { recommendFurniture, layoutFurniture, getAllFurniture } from './api/client';
import type { FurnitureItem, Room, StyleTag } from './types/furniture';

export default function App() {
  const [room, setRoom] = useState<Room>({ width: 400, depth: 350, height: 280 });
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [allFurniture, setAllFurniture] = useState<FurnitureItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null);
  const [detectedRoomType, setDetectedRoomType] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = useMemo(
    () => furniture.reduce((sum, f) => sum + f.price, 0),
    [furniture]
  );

  const handleGenerate = useCallback(async (r: Room, style: StyleTag[], budget: number) => {
    setLoading(true);
    setError(null);
    setSelectedItem(null);
    setRoom(r);

    try {
      const [recommendRes, fullDb] = await Promise.all([
        recommendFurniture({ room: r, style, budget }),
        getAllFurniture(),
      ]);

      setAllFurniture(fullDb);
      setDetectedRoomType(recommendRes.detected_room_type);

      const layoutRes = await layoutFurniture({
        furniture: recommendRes.items,
        room: r,
      });

      setFurniture(layoutRes.items);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
            ?? '找不到符合條件的家具，請嘗試調高預算或縮小房間尺寸。';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSwap = useCallback((oldItem: FurnitureItem, newItem: FurnitureItem) => {
    setFurniture(prev =>
      prev.map(f =>
        f.id === oldItem.id
          ? { ...newItem, x: f.x, z: f.z, score: f.score }
          : f
      )
    );
    setSelectedItem(prev =>
      prev?.id === oldItem.id
        ? { ...newItem, x: oldItem.x, z: oldItem.z, score: oldItem.score }
        : prev
    );
  }, []);

  const handleSelectFurniture = useCallback((item: FurnitureItem | null) => {
    setSelectedItem(item);
  }, []);

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#0d0f1a]">
      {/* Left: Control Panel */}
      <ControlPanel
        onGenerate={handleGenerate}
        loading={loading}
        detectedRoomType={detectedRoomType}
        totalPrice={furniture.length > 0 ? totalPrice : undefined}
        itemCount={furniture.length}
      />

      {/* Center: 3D Scene + bottom list */}
      <main className="flex-1 relative overflow-hidden">
        <RoomScene
          room={room}
          furniture={furniture}
          selectedId={selectedItem?.id}
          onSelectFurniture={handleSelectFurniture}
        />

        {/* Bottom furniture list bar */}
        <FurnitureListBar
          furniture={furniture}
          selectedId={selectedItem?.id}
          onSelect={handleSelectFurniture}
        />

        {/* Error toast */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-950/95 border border-red-700/60 text-red-200 px-5 py-3 rounded-2xl text-sm max-w-sm text-center shadow-2xl backdrop-blur z-20">
            <p className="font-bold mb-1">⚠ 無法生成方案</p>
            <p className="text-xs text-red-300 leading-relaxed">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-400 hover:text-red-200 underline transition-colors"
            >
              關閉
            </button>
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-[#13151f] border border-[#252840] rounded-2xl px-10 py-7 flex flex-col items-center gap-4 shadow-2xl">
              <div className="relative">
                <div className="w-10 h-10 border-2 border-indigo-900 rounded-full" />
                <div className="w-10 h-10 border-2 border-t-indigo-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute inset-0" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-sm mb-0.5">AI 正在規劃家具配置</p>
                <p className="text-slate-500 text-xs">分析房間尺寸與風格偏好中...</p>
              </div>
            </div>
          </div>
        )}

        {/* Initial empty state */}
        {!loading && furniture.length === 0 && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-16">
            <div className="text-6xl mb-4 opacity-20">🛋</div>
            <p className="text-slate-600 text-sm">設定房間參數，點擊左側按鈕生成 AI 家具方案</p>
          </div>
        )}
      </main>

      {/* Right: Furniture Detail Card */}
      {selectedItem && (
        <FurnitureCard
          item={selectedItem}
          allFurniture={allFurniture}
          onSwap={handleSwap}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
