import type { FurnitureItem } from '../types/furniture';

interface FurnitureCardProps {
  item: FurnitureItem;
  allFurniture: FurnitureItem[];
  onSwap: (oldItem: FurnitureItem, newItem: FurnitureItem) => void;
  onClose: () => void;
}

const STYLE_COLOR: Record<string, string> = {
  minimal: 'bg-sky-900/60 text-sky-300',
  modern: 'bg-violet-900/60 text-violet-300',
  nordic: 'bg-emerald-900/60 text-emerald-300',
};

export default function FurnitureCard({ item, allFurniture, onSwap, onClose }: FurnitureCardProps) {
  // Find alternatives: same category, different id
  const alternatives = allFurniture.filter(
    f => f.category === item.category && f.id !== item.id
  );

  return (
    <aside className="w-72 min-w-[18rem] h-full bg-[#1a1d27] border-l border-[#2d3148] flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#2d3148] flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-slate-500 mb-1 uppercase tracking-widest">Selected Item</p>
          <h2 className="text-base font-bold text-white leading-tight">{item.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white transition-colors text-lg leading-none mt-0.5"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 px-5 py-4 flex flex-col gap-4">
        {/* Price */}
        <div className="flex items-center justify-between bg-[#1e2235] rounded-xl px-4 py-3">
          <span className="text-sm text-slate-400">Price</span>
          <span className="text-xl font-bold text-indigo-300">${item.price}</span>
        </div>

        {/* Dimensions */}
        <section>
          <h3 className="text-xs text-slate-500 uppercase tracking-widest mb-2">尺寸 Dimensions</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'W', value: item.width },
              { label: 'D', value: item.depth },
              { label: 'H', value: item.height },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#1e2235] rounded-lg px-2 py-2 text-center">
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className="text-sm font-mono font-semibold text-slate-200">{value}<span className="text-xs text-slate-500">cm</span></p>
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
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${STYLE_COLOR[tag] ?? 'bg-slate-800 text-slate-300'}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* AI Score */}
        {item.score !== undefined && (
          <section>
            <h3 className="text-xs text-slate-500 uppercase tracking-widest mb-2">AI Score</h3>
            <div className="bg-[#1e2235] rounded-xl px-4 py-2 flex items-center gap-3">
              <div className="flex-1 h-2 bg-[#2d3148] rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${Math.min(item.score * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs font-mono text-indigo-400 w-10 text-right">
                {item.score.toFixed(2)}
              </span>
            </div>
          </section>
        )}

        {/* Alternatives (swap) */}
        {alternatives.length > 0 && (
          <section>
            <h3 className="text-xs text-slate-500 uppercase tracking-widest mb-2">
              換一個 Alternatives
            </h3>
            <div className="flex flex-col gap-2">
              {alternatives.map(alt => (
                <button
                  key={alt.id}
                  onClick={() => onSwap(item, alt)}
                  className="flex items-center justify-between bg-[#1e2235] hover:bg-[#252a3e] border border-transparent hover:border-indigo-800 rounded-xl px-3 py-2.5 transition-all text-left group"
                >
                  <div>
                    <p className="text-sm text-slate-200 group-hover:text-white transition-colors">{alt.name}</p>
                    <p className="text-xs text-slate-500">{alt.width}×{alt.depth}cm · ${alt.price}</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-indigo-400 transition-colors text-lg">⇄</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Amazon CTA */}
      <div className="px-5 py-4 border-t border-[#2d3148]">
        <a
          href={item.amazon_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#e47911] hover:bg-[#f59732] text-white font-semibold text-sm transition-all shadow-lg shadow-orange-900/30"
        >
          <span>🛒</span>
          <span>View on Amazon</span>
        </a>
      </div>
    </aside>
  );
}
