import { useState, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import RoomScene from './components/RoomScene';
import FurnitureCard from './components/FurnitureCard';
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

  const handleGenerate = useCallback(async (r: Room, style: StyleTag[], budget: number) => {
    setLoading(true);
    setError(null);
    setSelectedItem(null);
    setRoom(r);

    try {
      // 1. Fetch full DB for swap alternatives (fire in parallel with recommend)
      const [recommendRes, fullDb] = await Promise.all([
        recommendFurniture({ room: r, style, budget }),
        getAllFurniture(),
      ]);

      setAllFurniture(fullDb);
      setDetectedRoomType(recommendRes.detected_room_type);

      // 2. Get layout positions
      const layoutRes = await layoutFurniture({
        furniture: recommendRes.items,
        room: r,
      });

      setFurniture(layoutRes.items);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? '發生未知錯誤';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSwap = useCallback((oldItem: FurnitureItem, newItem: FurnitureItem) => {
    // Replace oldItem with newItem in the layout, keeping position
    setFurniture(prev =>
      prev.map(f =>
        f.id === oldItem.id
          ? { ...newItem, x: f.x, z: f.z, score: f.score }
          : f
      )
    );
    setSelectedItem({ ...newItem, x: oldItem.x, z: oldItem.z, score: oldItem.score });
  }, []);

  const handleSelectFurniture = useCallback((item: FurnitureItem | null) => {
    setSelectedItem(item);
  }, []);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left: Control Panel */}
      <ControlPanel
        onGenerate={handleGenerate}
        loading={loading}
        detectedRoomType={detectedRoomType}
      />

      {/* Center: 3D Scene */}
      <main className="flex-1 relative">
        <RoomScene
          room={room}
          furniture={furniture}
          selectedId={selectedItem?.id}
          onSelectFurniture={handleSelectFurniture}
        />

        {/* Error Toast */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-900/90 border border-red-700 text-red-200 px-5 py-3 rounded-xl text-sm max-w-sm text-center shadow-lg backdrop-blur">
            <p className="font-semibold mb-0.5">找不到符合條件的家具</p>
            <p className="text-xs text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs underline text-red-400 hover:text-red-200"
            >
              關閉
            </button>
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-[#1a1d27] border border-[#2d3148] rounded-2xl px-8 py-6 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-300 text-sm">AI 正在規劃家具配置...</p>
            </div>
          </div>
        )}
      </main>

      {/* Right: Furniture Card */}
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
