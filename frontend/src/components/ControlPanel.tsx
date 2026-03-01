import { useState } from 'react';
import {
  Home, Maximize2, Layers, Wallet, Cpu, Sparkles, Loader2,
} from 'lucide-react';
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
  { value: 'modern',  label: 'Modern',  desc: '現代' },
  { value: 'nordic',  label: 'Nordic',  desc: '北歐' },
];

const ROOM_ICONS: Record<string, string> = {
  bedroom:     '🛏',
  living_room: '🛋',
};

const ROOM_LABELS: Record<string, string> = {
  bedroom:     'Bedroom · 臥室',
  living_room: 'Living Room · 客廳',
};

const DIM_LABELS: Record<string, { en: string; zh: string }> = {
  width:  { en: 'Width',  zh: '寬' },
  depth:  { en: 'Depth',  zh: '深' },
  height: { en: 'Height', zh: '高' },
};

export default function ControlPanel({
  onGenerate, loading, detectedRoomType, totalPrice, itemCount,
}: ControlPanelProps) {
  const [room, setRoom] = useState<Room>({ width: 400, depth: 350, height: 280 });
  const [styles, setStyles] = useState<StyleTag[]>(['minimal']);
  const [budget, setBudget] = useState(800);

  const toggleStyle = (s: StyleTag) =>
    setStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const budgetUsedPct =
    totalPrice != null && budget > 0 ? Math.min((totalPrice / budget) * 100, 100) : 0;
  const overBudget = (totalPrice ?? 0) > budget;

  return (
    <aside
      className="w-[17rem] h-full flex flex-col overflow-y-auto"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}
          >
            <Home size={17} color="#22C55E" />
          </div>
          <div>
            <h1 className="font-cinzel text-sm font-semibold text-white leading-tight tracking-wider">
              iHome AI
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
              AI 家具配置系統
            </p>
          </div>
        </div>
      </div>

      {/* ── Main form ─────────────────────────────────── */}
      <div className="flex-1 px-5 py-5 flex flex-col gap-6">

        {/* Room Dimensions */}
        <section>
          <SectionLabel icon={<Maximize2 size={12} />} label="房間尺寸" sub="cm" />
          <div className="flex flex-col gap-4 mt-3">
            {(['width', 'depth', 'height'] as const).map(dim => {
              const min = dim === 'height' ? 220 : 200;
              const max = dim === 'height' ? 320 : 600;
              const pct = ((room[dim] - min) / (max - min)) * 100;
              const { en, zh } = DIM_LABELS[dim];
              return (
                <div key={dim}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                      {zh} <span style={{ color: 'var(--text-dim)' }}>{en}</span>
                    </span>
                    <span
                      className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded"
                      style={{
                        background: 'rgba(99,102,241,0.12)',
                        color: '#818CF8',
                        border: '1px solid rgba(99,102,241,0.2)',
                      }}
                    >
                      {room[dim]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={10}
                    value={room[dim]}
                    onChange={e => setRoom({ ...room, [dim]: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      background: `linear-gradient(to right, #6366F1 ${pct}%, var(--surface-2) ${pct}%)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <Divider />

        {/* Style */}
        <section>
          <SectionLabel icon={<Layers size={12} />} label="風格偏好" />
          <div className="grid grid-cols-3 gap-2 mt-3">
            {STYLE_OPTIONS.map(({ value, label, desc }) => {
              const active = styles.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => toggleStyle(value)}
                  className="flex flex-col items-center py-3 px-2 rounded-xl text-center"
                  style={
                    active
                      ? {
                          background: 'rgba(99,102,241,0.2)',
                          border: '1px solid rgba(99,102,241,0.5)',
                          color: '#C7D2FE',
                        }
                      : {
                          background: 'var(--bg)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-muted)',
                        }
                  }
                >
                  <span className="text-xs font-semibold leading-none font-cinzel tracking-wide">
                    {label}
                  </span>
                  <span className="text-xs mt-1 opacity-60">{desc}</span>
                </button>
              );
            })}
          </div>
          {styles.length === 0 && (
            <p className="text-xs mt-2 flex items-center gap-1" style={{ color: '#F87171' }}>
              請至少選擇一種風格
            </p>
          )}
        </section>

        <Divider />

        {/* Budget */}
        <section>
          <SectionLabel icon={<Wallet size={12} />} label="預算" sub="USD" />
          <div className="flex justify-between items-center mt-3 mb-2">
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>上限</span>
            <span className="text-lg font-bold font-cinzel" style={{ color: '#22C55E' }}>
              ${budget.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={budget}
            onChange={e => setBudget(Number(e.target.value))}
            style={{
              width: '100%',
              background: `linear-gradient(to right, #22C55E ${((budget - 100) / 1900) * 100}%, var(--surface-2) ${((budget - 100) / 1900) * 100}%)`,
            }}
          />
          <div
            className="flex justify-between text-xs mt-1.5"
            style={{ color: 'var(--text-dim)' }}
          >
            <span>$100</span><span>$2,000</span>
          </div>
        </section>

        {/* Budget usage */}
        {totalPrice != null && (itemCount ?? 0) > 0 && (
          <div
            className="rounded-xl p-3"
            style={{
              background: overBudget ? 'rgba(239,68,68,0.06)' : 'rgba(34,197,94,0.06)',
              border: `1px solid ${overBudget ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.15)'}`,
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs" style={{ color: 'var(--text-dim)' }}>配置總額</span>
              <span
                className="text-xs font-bold font-mono"
                style={{ color: overBudget ? '#F87171' : '#22C55E' }}
              >
                ${totalPrice.toLocaleString()} / ${budget.toLocaleString()}
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: 'var(--surface-2)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${budgetUsedPct}%`,
                  background: overBudget
                    ? 'linear-gradient(90deg, #EF4444, #F87171)'
                    : 'linear-gradient(90deg, #16A34A, #22C55E)',
                }}
              />
            </div>
          </div>
        )}

        {/* Detected room type */}
        {detectedRoomType && (
          <div
            className="flex items-center gap-3 rounded-xl px-3.5 py-3"
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            <span className="text-xl">{ROOM_ICONS[detectedRoomType] ?? '🏠'}</span>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>AI 偵測房型</p>
              <p
                className="text-xs font-semibold mt-0.5 font-cinzel tracking-wide"
                style={{ color: '#A5B4FC' }}
              >
                {ROOM_LABELS[detectedRoomType] ?? detectedRoomType}
              </p>
            </div>
            <Cpu size={14} color="#6366F1" className="ml-auto flex-shrink-0" />
          </div>
        )}
      </div>

      {/* ── Generate CTA ─────────────────────────────── */}
      <div className="px-5 py-5" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => { if (styles.length > 0) onGenerate(room, styles, budget); }}
          disabled={loading || styles.length === 0}
          className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5"
          style={
            loading || styles.length === 0
              ? {
                  background: 'var(--surface-2)',
                  color: 'var(--text-dim)',
                  border: '1px solid var(--border)',
                }
              : {
                  background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                  color: '#fff',
                  boxShadow: '0 4px 24px rgba(34,197,94,0.25)',
                }
          }
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              AI 規劃中…
            </>
          ) : (
            <>
              <Sparkles size={15} />
              生成 AI 家具方案
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

function SectionLabel({
  icon, label, sub,
}: { icon: React.ReactNode; label: string; sub?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ color: 'var(--text-dim)' }}>{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-widest font-cinzel" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      {sub && <span className="text-xs" style={{ color: 'var(--text-dim)' }}>({sub})</span>}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border)' }} />;
}
