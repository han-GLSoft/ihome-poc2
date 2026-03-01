import { useState, useCallback, useMemo } from 'react';
import { AlertTriangle, X } from 'lucide-react';
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
    [furniture],
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
      const layoutRes = await layoutFurniture({ furniture: recommendRes.items, room: r });
      setFurniture(layoutRes.items);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail ?? '找不到符合條件的家具，請嘗試調高預算或縮小房間尺寸。');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSwap = useCallback((oldItem: FurnitureItem, newItem: FurnitureItem) => {
    setFurniture(prev =>
      prev.map(f =>
        f.id === oldItem.id ? { ...newItem, x: f.x, z: f.z, score: f.score } : f,
      ),
    );
    setSelectedItem(prev =>
      prev?.id === oldItem.id
        ? { ...newItem, x: oldItem.x, z: oldItem.z, score: oldItem.score }
        : prev,
    );
  }, []);

  return (
    <div className="flex h-full w-full overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Left */}
      <ControlPanel
        onGenerate={handleGenerate}
        loading={loading}
        detectedRoomType={detectedRoomType}
        totalPrice={furniture.length > 0 ? totalPrice : undefined}
        itemCount={furniture.length}
      />

      {/* Center */}
      <main className="flex-1 relative overflow-hidden">
        <RoomScene
          room={room}
          furniture={furniture}
          selectedId={selectedItem?.id}
          onSelectFurniture={item => setSelectedItem(item)}
        />

        <FurnitureListBar
          furniture={furniture}
          selectedId={selectedItem?.id}
          onSelect={item => setSelectedItem(item)}
        />

        {/* Error */}
        {error && (
          <div
            className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-start gap-3 px-5 py-4 rounded-2xl max-w-sm w-[90%] shadow-2xl"
            style={{
              background: 'rgba(127,29,29,0.95)',
              border: '1px solid rgba(239,68,68,0.3)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <AlertTriangle size={16} color="#F87171" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold font-cinzel" style={{ color: '#FECACA' }}>
                無法生成方案
              </p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: '#FCA5A5' }}>
                {error}
              </p>
            </div>
            <button onClick={() => setError(null)} style={{ color: '#F87171' }}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)' }}
          >
            <div
              className="flex flex-col items-center gap-5 rounded-2xl px-10 py-8"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              }}
            >
              {/* Animated rings */}
              <div className="relative w-12 h-12">
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ background: 'rgba(34,197,94,0.15)' }}
                />
                <div
                  className="absolute inset-1 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: '#22C55E', borderTopColor: 'transparent' }}
                />
              </div>
              <div className="text-center">
                <p className="font-cinzel font-semibold text-sm tracking-wide" style={{ color: 'var(--text)' }}>
                  AI 正在規劃配置
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
                  分析房間尺寸與風格偏好…
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && furniture.length === 0 && !error && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-20"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid var(--border)' }}
            >
              <span className="text-3xl opacity-40">🛋</span>
            </div>
            <p className="text-sm font-cinzel tracking-widest" style={{ color: 'var(--text-dim)' }}>
              設定參數後點擊生成方案
            </p>
          </div>
        )}
      </main>

      {/* Right */}
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
