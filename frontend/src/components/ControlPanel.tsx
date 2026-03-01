import { useState } from 'react';
import type { Room, StyleTag } from '../types/furniture';

interface ControlPanelProps {
  onGenerate: (room: Room, style: StyleTag[], budget: number) => void;
  loading: boolean;
  detectedRoomType?: string;
  totalPrice?: number;
  itemCount?: number;
}

const STYLE_OPTIONS: { value: StyleTag; label: string; desc: string }[] = [
  { value: 'minimal', label: 'Minimal', desc: '簡約' },
  { value: 'modern', label: 'Modern', desc: '現代' },
  { value: 'nordic', label: 'Nordic', desc: '北歐' },
];

const ROOM_TYPE_LABEL: Record<string, { label: string; emoji: string }> = {
  bedroom: { label: '臥室 Bedroom', emoji: '🛏' },
  living_room: { label: '客廳 Living Room', emoji: '🛋' },
};

export default function ControlPanel({
  onGenerate, loading, detectedRoomType, totalPrice, itemCount
}: ControlPanelProps) {
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

  const budgetUsedPct = totalPrice != null ? Math.min((totalPrice / budget) * 100, 100) : 0;

  return (
    <aside className="w-72 min-w-[18rem] h-full bg-[#13151f] border-r border-[#252840] flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-[#252840]">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-600/50 flex items-center justify-center text-sm">
            🏠
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide leading-none">iHome AI</h1>
            <p className="text-xs text-slate-500 mt-0.5">AI 家具配置系統</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-4 flex flex-col gap-5">

        {/* Room Dimensions */}
        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-indigo-600/50 inline-block" />
            房間尺寸 (cm)
          </h2>
          <div className="flex flex-col gap-3.5">
            {(['width', 'depth', 'height'] as const).map(dim => {
              const min = dim === 'height' ? 220 : 200;
              const max = dim === 'height' ? 320 : 600;
              const pct = ((room[dim] - min) / (max - min)) * 100;
              return (
                <div key={dim}>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs text-slate-400">
                      {dim === 'width' ? '寬 Width' : dim === 'depth' ? '深 Depth' : '高 Height'}
                    </label>
                    <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded">
                      {room[dim]} cm
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={10}
                      value={room[dim]}
                      onChange={e => setRoom({ ...room, [dim]: Number(e.target.value) })}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-indigo-500"
                      style={{
                        background: `linear-gradient(to right, #6366f1 ${pct}%, #252840 ${pct}%)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-[#252840]" />

        {/* Style */}
        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-violet-600/50 inline-block" />
            風格偏好
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {STYLE_OPTIONS.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => toggleStyle(value)}
                className={`flex flex-col items-center py-2.5 px-2 rounded-xl text-center transition-all border ${
                  styles.includes(value)
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/30'
                    : 'bg-[#1a1d2e] border-[#252840] text-slate-400 hover:border-indigo-800 hover:text-slate-300'
                }`}
              >
                <span className="text-xs font-bold leading-none mb-0.5">{label}</span>
                <span className="text-xs opacity-70">{desc}</span>
              </button>
            ))}
          </div>
          {styles.length === 0 && (
            <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
              <span>⚠</span> 請至少選擇一種風格
            </p>
          )}
        </section>

        {/* Divider */}
        <div className="h-px bg-[#252840]" />

        {/* Budget */}
        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-emerald-600/50 inline-block" />
            預算 Budget
          </h2>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-slate-500">USD</span>
            <span className="text-sm font-bold font-mono text-emerald-400">${budget.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={budget}
            onChange={e => setBudget(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-emerald-500"
            style={{
              background: `linear-gradient(to right, #10b981 ${((budget - 100) / 1900) * 100}%, #252840 ${((budget - 100) / 1900) * 100}%)`,
            }}
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1.5">
            <span>$100</span>
            <span>$2,000</span>
          </div>
        </section>

        {/* Budget usage indicator */}
        {totalPrice != null && itemCount != null && itemCount > 0 && (
          <div className="bg-[#1a1d2e] border border-[#252840] rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-500">預算使用</span>
              <span className={`text-xs font-bold font-mono ${budgetUsedPct > 90 ? 'text-red-400' : 'text-emerald-400'}`}>
                ${totalPrice.toLocaleString()} / ${budget.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 bg-[#252840] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${budgetUsedPct}%`,
                  background: budgetUsedPct > 90
                    ? 'linear-gradient(90deg, #f87171, #ef4444)'
                    : 'linear-gradient(90deg, #10b981, #34d399)',
                }}
              />
            </div>
          </div>
        )}

        {/* AI Room Type */}
        {detectedRoomType && (
          <div
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 border"
            style={{
              background: 'linear-gradient(135deg, #1e1f35, #13151f)',
              borderColor: '#3730a3',
            }}
          >
            <span className="text-xl">{ROOM_TYPE_LABEL[detectedRoomType]?.emoji ?? '🏠'}</span>
            <div>
              <p className="text-xs text-slate-500">AI 偵測房型</p>
              <p className="text-sm font-semibold text-indigo-300">
                {ROOM_TYPE_LABEL[detectedRoomType]?.label ?? detectedRoomType}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="px-5 py-4 border-t border-[#252840]">
        <button
          onClick={handleGenerate}
          disabled={loading || styles.length === 0}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            loading || styles.length === 0
              ? 'bg-[#1a1d2e] text-slate-600 cursor-not-allowed border border-[#252840]'
              : 'text-white border border-indigo-500 shadow-xl shadow-indigo-950/50'
          }`}
          style={
            loading || styles.length === 0
              ? {}
              : { background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }
          }
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-500 border-t-indigo-400 rounded-full animate-spin" />
              <span>AI 規劃中...</span>
            </>
          ) : (
            <>
              <span>✦</span>
              <span>生成 AI 家具方案</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
