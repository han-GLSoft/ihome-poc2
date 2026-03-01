import { X, ShoppingCart, ArrowLeftRight, Tag, Ruler, Zap } from 'lucide-react';
import type { FurnitureItem } from '../types/furniture';

const CATEGORY_COLOR: Record<string, string> = {
  bed:          '#7C6FA0',
  wardrobe:     '#5A7A8A',
  desk:         '#6B8A6B',
  sofa:         '#8A6B5A',
  coffee_table: '#7A7A5A',
  tv_stand:     '#5A6B8A',
  bookshelf:    '#8A7A5A',
  lamp:         '#9A8A5A',
};

const CATEGORY_LABEL: Record<string, string> = {
  bed:          'Bed',
  wardrobe:     'Wardrobe',
  desk:         'Desk',
  sofa:         'Sofa',
  coffee_table: 'Coffee Table',
  tv_stand:     'TV Stand',
  bookshelf:    'Bookshelf',
  lamp:         'Floor Lamp',
};

const STYLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  minimal: { bg: 'rgba(14,165,233,0.12)', text: '#38BDF8', border: 'rgba(14,165,233,0.25)' },
  modern:  { bg: 'rgba(167,139,250,0.12)', text: '#A78BFA', border: 'rgba(167,139,250,0.25)' },
  nordic:  { bg: 'rgba(52,211,153,0.12)', text: '#34D399', border: 'rgba(52,211,153,0.25)' },
};

interface FurnitureCardProps {
  item: FurnitureItem;
  allFurniture: FurnitureItem[];
  onSwap: (oldItem: FurnitureItem, newItem: FurnitureItem) => void;
  onClose: () => void;
}

export default function FurnitureCard({ item, allFurniture, onSwap, onClose }: FurnitureCardProps) {
  const alternatives = allFurniture.filter(
    f => f.category === item.category && f.id !== item.id
  );

  const color = CATEGORY_COLOR[item.category] ?? '#6B7280';
  const catLabel = CATEGORY_LABEL[item.category] ?? item.category;

  return (
    <aside
      className="flex flex-col overflow-hidden"
      style={{
        width: '21rem',
        minWidth: '21rem',
        height: '100%',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
      }}
    >
      {/* ── Hero ─────────────────────────────────────── */}
      <div
        className="relative px-6 pt-6 pb-5 flex-shrink-0"
        style={{
          background: `linear-gradient(145deg, ${color}18 0%, transparent 70%)`,
          borderBottom: `1px solid ${color}20`,
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            color: 'var(--text-dim)',
          }}
          aria-label="Close"
        >
          <X size={14} />
        </button>

        {/* Category pill */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${color}20`, border: `1px solid ${color}40` }}
          >
            <span
              className="text-xs font-bold font-cinzel"
              style={{ color }}
            >
              {catLabel.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <span
            className="text-xs font-cinzel font-semibold uppercase tracking-widest"
            style={{ color }}
          >
            {catLabel}
          </span>
        </div>

        {/* Product name */}
        <h2
          className="font-cinzel font-semibold leading-snug mb-1"
          style={{ fontSize: '1rem', color: 'var(--text)' }}
        >
          {item.name}
        </h2>

        {/* Style tags */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {item.style_tags.map(tag => {
            const s = STYLE_COLORS[tag] ?? { bg: 'rgba(100,116,139,0.15)', text: '#94A3B8', border: 'rgba(100,116,139,0.3)' };
            return (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Scrollable content ───────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">

        {/* Price */}
        <div
          className="flex items-center justify-between rounded-xl px-4 py-3.5"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <Tag size={14} color="var(--text-dim)" />
            <span className="text-xs font-cinzel uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>
              Price
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-cinzel" style={{ color: '#22C55E' }}>
              ${item.price}
            </span>
            <span className="text-xs ml-1" style={{ color: 'var(--text-dim)' }}>USD</span>
          </div>
        </div>

        {/* Dimensions */}
        <section>
          <SectionHead icon={<Ruler size={12} />} label="尺寸 Dimensions" />
          <div className="grid grid-cols-3 gap-2 mt-2.5">
            {[
              { s: 'W', label: 'Width', v: item.width },
              { s: 'D', label: 'Depth', v: item.depth },
              { s: 'H', label: 'Height', v: item.height },
            ].map(({ s, label, v }) => (
              <div
                key={s}
                className="rounded-xl py-3 text-center"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                title={label}
              >
                <p className="text-xs mb-1 font-cinzel" style={{ color: 'var(--text-dim)' }}>{s}</p>
                <p className="text-base font-bold font-cinzel" style={{ color: 'var(--text)' }}>{v}</p>
                <p className="text-xs" style={{ color: 'var(--text-dim)' }}>cm</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Score */}
        {item.score != null && (
          <section>
            <SectionHead icon={<Zap size={12} />} label="AI 推薦分數" />
            <div
              className="mt-2.5 rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            >
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ background: 'var(--surface-2)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(item.score * 100, 100)}%`,
                    background: 'linear-gradient(90deg, #6366F1, #818CF8)',
                    transition: 'width 600ms ease',
                  }}
                />
              </div>
              <span className="text-xs font-bold font-mono" style={{ color: '#818CF8', minWidth: 36 }}>
                {(item.score * 100).toFixed(0)}%
              </span>
            </div>
          </section>
        )}

        {/* Alternatives */}
        {alternatives.length > 0 && (
          <section>
            <SectionHead icon={<ArrowLeftRight size={12} />} label="類似商品 · 點擊替換" />
            <div className="flex flex-col gap-2 mt-2.5">
              {alternatives.map(alt => {
                const altColor = CATEGORY_COLOR[alt.category] ?? '#6B7280';
                const altCat = CATEGORY_LABEL[alt.category] ?? alt.category;
                return (
                  <button
                    key={alt.id}
                    onClick={() => onSwap(item, alt)}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-left w-full group"
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      transition: 'all 180ms ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.4)';
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(30,41,59,0.9)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                      (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)';
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ background: `${altColor}20`, border: `1px solid ${altColor}40` }}
                    >
                      <span className="text-xs font-bold font-cinzel" style={{ color: altColor }}>
                        {altCat.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#CBD5E1' }}>
                        {alt.name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
                        <span className="font-cinzel font-bold" style={{ color: '#22C55E' }}>
                          ${alt.price}
                        </span>
                        <span className="ml-1.5">{alt.width}×{alt.depth} cm</span>
                      </p>
                    </div>
                    <ArrowLeftRight size={14} color="#475569" className="flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* ── Sticky Amazon CTA ────────────────────────── */}
      <div
        className="px-5 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <a
          href={item.amazon_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-semibold text-sm"
          style={{
            background: 'linear-gradient(135deg, #FF9900 0%, #F59300 100%)',
            color: '#0F172A',
            boxShadow: '0 4px 20px rgba(255,153,0,0.25)',
            transition: 'box-shadow 200ms ease',
            fontFamily: "'Josefin Sans', sans-serif",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 30px rgba(255,153,0,0.45)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(255,153,0,0.25)';
          }}
        >
          <ShoppingCart size={16} />
          <span>購買 · View on Amazon</span>
        </a>
      </div>
    </aside>
  );
}

function SectionHead({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ color: 'var(--text-dim)' }}>{icon}</span>
      <span
        className="text-xs font-cinzel font-semibold uppercase tracking-widest"
        style={{ color: 'var(--text-dim)' }}
      >
        {label}
      </span>
    </div>
  );
}
