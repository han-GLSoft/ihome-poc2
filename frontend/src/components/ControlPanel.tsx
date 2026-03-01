import { useState } from 'react';
import type { Room, StyleTag } from '../types/furniture';

interface ControlPanelProps {
  onGenerate: (room: Room, style: StyleTag[], budget: number) => void;
  loading: boolean;
  detectedRoomType?: string;
}

const STYLE_OPTIONS: { value: StyleTag; label: string }[] = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'modern', label: 'Modern' },
  { value: 'nordic', label: 'Nordic' },
];

const ROOM_TYPE_LABEL: Record<string, string> = {
  bedroom: '臥室 Bedroom',
  living_room: '客廳 Living Room',
};

export default function ControlPanel({ onGenerate, loading, detectedRoomType }: ControlPanelProps) {
  const [room, setRoom] = useState<Room>({ width: 400, depth: 350, height: 280 });
  const [styles, setStyles] = useState<StyleTag[]>(['minimal']);
  const [budget, setBudget] = useState(800);

  const toggleStyle = (s: StyleTag) => {
    setStyles(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const handleGenerate = () => {
    if (styles.length === 0) return;
    onGenerate(room, styles, budget);
  };

  return (
    <aside className="w-72 min-w-[18rem] h-full bg-[#1a1d27] border-r border-[#2d3148] flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-5 py-5 border-b border-[#2d3148]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🏠</span>
          <h1 className="text-lg font-bold text-white tracking-wide">iHome AI</h1>
        </div>
        <p className="text-xs text-slate-400">AI 家具配置系統</p>
      </div>

      <div className="flex-1 px-5 py-4 flex flex-col gap-5">
        {/* Room Dimensions */}
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            房間尺寸 (cm)
          </h2>
          <div className="flex flex-col gap-3">
            {(['width', 'depth', 'height'] as const).map(dim => (
              <div key={dim}>
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-slate-300 capitalize">
                    {dim === 'width' ? '寬 Width' : dim === 'depth' ? '深 Depth' : '高 Height'}
                  </label>
                  <span className="text-sm font-mono text-indigo-400">{room[dim]}</span>
                </div>
                <input
                  type="range"
                  min={dim === 'height' ? 220 : 200}
                  max={dim === 'height' ? 320 : 600}
                  step={10}
                  value={room[dim]}
                  onChange={e => setRoom({ ...room, [dim]: Number(e.target.value) })}
                  className="w-full h-1.5 rounded-full bg-[#2d3148] appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Style Selection */}
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            風格偏好
          </h2>
          <div className="flex gap-2 flex-wrap">
            {STYLE_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => toggleStyle(value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  styles.includes(value)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#2d3148] text-slate-400 hover:bg-[#363b5e]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {styles.length === 0 && (
            <p className="text-xs text-red-400 mt-1">請至少選擇一種風格</p>
          )}
        </section>

        {/* Budget */}
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            預算 Budget
          </h2>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-slate-300">USD</span>
            <span className="text-sm font-mono text-indigo-400">${budget}</span>
          </div>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={budget}
            onChange={e => setBudget(Number(e.target.value))}
            className="w-full h-1.5 rounded-full bg-[#2d3148] appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>$100</span>
            <span>$2000</span>
          </div>
        </section>

        {/* Detected room type badge */}
        {detectedRoomType && (
          <div className="bg-[#1e2235] border border-indigo-800 rounded-lg px-3 py-2">
            <p className="text-xs text-slate-400 mb-0.5">AI 偵測房型</p>
            <p className="text-sm font-semibold text-indigo-300">
              {ROOM_TYPE_LABEL[detectedRoomType] ?? detectedRoomType}
            </p>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="px-5 py-4 border-t border-[#2d3148]">
        <button
          onClick={handleGenerate}
          disabled={loading || styles.length === 0}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
            loading || styles.length === 0
              ? 'bg-[#2d3148] text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              生成中...
            </span>
          ) : (
            '✦ 生成 AI 家具方案'
          )}
        </button>
      </div>
    </aside>
  );
}
