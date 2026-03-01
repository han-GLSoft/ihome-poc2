import type { FurnitureItem } from '../types/furniture';

interface FurnitureCardProps {
  item: FurnitureItem;
  allFurniture: FurnitureItem[];
  onSwap: (oldItem: FurnitureItem, newItem: FurnitureItem) => void;
  onClose: () => void;
}

const CATEGORY_COLOR: Record<string, string> = {
  bed: '#7c6fa0',
  wardrobe: '#5a7a8a',
  desk: '#6b8a6b',
  sofa: '#8a6b5a',
  coffee_table: '#7a7a5a',
  tv_stand: '#5a6b8a',
  bookshelf: '#8a7a5a',
  lamp: '#9a8a5a',
};

const CATEGORY_EMOJI: Record<string, string> = {
  bed: '🛏',
  wardrobe: '🚪',
  desk: '🖥',
  sofa: '🛋',
  coffee_table: '☕',
  tv_stand: '📺',
  bookshelf: '📚',
  lamp: '💡',
};

const CATEGORY_LABEL: Record<string, string> = {
  bed: 'Bed',
  wardrobe: 'Wardrobe',
  desk: 'Desk',
  sofa: 'Sofa',
  coffee_table: 'Coffee Table',
  tv_stand: 'TV Stand',
  bookshelf: 'Bookshelf',
  lamp: 'Floor Lamp',
};

const STYLE_BADGE: Record<string, string> = {
  minimal: 'bg-sky-900/60 text-sky-300 border-sky-800',
  modern: 'bg-violet-900/60 text-violet-300 border-violet-800',
  nordic: 'bg-emerald-900/60 text-emerald-300 border-emerald-800',
};

export default function FurnitureCard({ item, allFurniture, onSwap, onClose }: FurnitureCardProps) {
  const alternatives = allFurniture.filter(
    f => f.category === item.category && f.id !== item.id
  );

  const color = CATEGORY_COLOR[item.category] ?? '#6b7280';
  const emoji = CATEGORY_EMOJI[item.category] ?? '📦';
  const catLabel = CATEGORY_LABEL[item.category] ?? item.category;

  return (
    <aside className="w-80 min-w-[20rem] h-full bg-[#13151f] border-l border-[#252840] flex flex-col overflow-hidden">
      {/* Product Hero */}
      <div
        className="relative flex flex-col items-center justify-center py-8 px-5 flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${color}22 0%, ${color}11 50%, #13151f 100%)`,
          borderBottom: `1px solid ${color}30`,
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all text-sm"
        >
          ✕
        </button>

        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-lg"
          style={{ backgroundColor: `${color}30`, border: `1px solid ${color}50` }}
        >
          {emoji}
        </div>

        {/* Category badge */}
        <span
          className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2"
          style={{ backgroundColor: `${color}25`, color }}
        >
          {catLabel}
        </span>

        {/* Name */}
        <h2 className="text-base font-bold text-white text-center leading-snug">{item.name}</h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">

        {/* Price */}
        <div className="flex items-center justify-between bg-[#1a1d2e] rounded-xl px-4 py-3 border border-[#252840]">
          <span className="text-xs text-slate-500 uppercase tracking-widest">Price</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">${item.price}</span>
            <span className="text-xs text-slate-500">USD</span>
          </div>
        </div>

        {/* Dimensions */}
        <section>
          <h3 className="text-xs text-slate-500 uppercase tracking-widest mb-2">尺寸 Dimensions</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Width', short: 'W', value: item.width },
              { label: 'Depth', short: 'D', value: item.depth },
              { label: 'Height', short: 'H', value: item.height },
            ].map(({ short, label, value }) => (
              <div
                key={short}
                className="bg-[#1a1d2e] rounded-xl p-3 text-center border border-[#252840]"
                title={label}
              >
                <p className="text-xs text-slate-500 mb-1">{short}</p>
                <p className="text-sm font-bold text-slate-100 font-mono">{value}</p>
                <p className="text-xs text-slate-600">cm</p>
              </div>
            ))}
          </div>
        </section>

        {/* Style Tags */}
        <section>
          <h3 className="text-xs text-slate-500 uppercase tracking-widest mb-2">風格 Style</h3>
          <div className="flex flex-wrap gap-1.5">
            {item.style_tags.map(tag => (
              <span
                key={tag}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STYLE_BADGE[tag] ?? 'bg-slate-800 text-slate-300 border-slate-700'}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* AI Score */}
        {item.score !== undefined && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs text-slate-500 uppercase tracking-widest">AI 推薦分數</h3>
              <span className="text-xs font-bold text-indigo-400 font-mono">{(item.score * 100).toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-[#252840] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(item.score * 100, 100)}%`,
                  background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                }}
              />
            </div>
          </section>
        )}

        {/* Alternatives */}
        {alternatives.length > 0 && (
          <section>
            <h3 className="text-xs text-slate-500 uppercase tracking-widest mb-2">
              類似商品 · 點擊替換
            </h3>
            <div className="flex flex-col gap-2">
              {alternatives.map(alt => {
                const altColor = CATEGORY_COLOR[alt.category] ?? '#6b7280';
                const altEmoji = CATEGORY_EMOJI[alt.category] ?? '📦';
                return (
                  <button
                    key={alt.id}
                    onClick={() => onSwap(item, alt)}
                    className="flex items-center gap-3 bg-[#1a1d2e] hover:bg-[#1e2238] border border-[#252840] hover:border-indigo-700 rounded-xl px-3 py-2.5 transition-all text-left group w-full"
                  >
                    {/* Mini icon */}
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{ backgroundColor: `${altColor}25`, border: `1px solid ${altColor}40` }}
                    >
                      {altEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 group-hover:text-white transition-colors font-medium truncate">
                        {alt.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-emerald-400 font-mono">${alt.price}</span>
                        <span className="text-xs text-slate-600">{alt.width}×{alt.depth}cm</span>
                      </div>
                    </div>
                    <span className="text-slate-500 group-hover:text-indigo-400 transition-colors flex-shrink-0 text-base">
                      ⇄
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Buy Button */}
      <div className="px-4 py-4 border-t border-[#252840] flex-shrink-0 bg-[#13151f]">
        <a
          href={item.amazon_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #f90 0%, #f59732 100%)',
            boxShadow: '0 4px 20px rgba(249,153,0,0.3)',
            color: '#111',
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 28px rgba(249,153,0,0.5)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,153,0,0.3)')}
        >
          <span className="text-base">🛒</span>
          <span>購買 · View on Amazon</span>
        </a>
      </div>
    </aside>
  );
}
