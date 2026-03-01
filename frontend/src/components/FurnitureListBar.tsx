import type { FurnitureItem } from '../types/furniture';

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

interface FurnitureListBarProps {
  furniture: FurnitureItem[];
  selectedId?: string;
  onSelect: (item: FurnitureItem) => void;
}

export default function FurnitureListBar({ furniture, selectedId, onSelect }: FurnitureListBarProps) {
  if (furniture.length === 0) return null;

  const total = furniture.reduce((sum, f) => sum + f.price, 0);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10">
      {/* Header row */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-black/80 backdrop-blur border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">配置清單</span>
          <span className="bg-indigo-600/80 text-white text-xs px-2 py-0.5 rounded-full font-mono">
            {furniture.length} 件
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-400">預估總額</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">${total.toLocaleString()}</span>
        </div>
      </div>

      {/* Scrollable item row */}
      <div className="flex gap-2 overflow-x-auto px-3 py-2.5 bg-black/70 backdrop-blur scrollbar-thin">
        {furniture.map((item, idx) => {
          const isSelected = item.id === selectedId;
          const color = CATEGORY_COLOR[item.category] ?? '#6b7280';
          const emoji = CATEGORY_EMOJI[item.category] ?? '📦';

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`
                flex-shrink-0 flex items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all min-w-[160px]
                ${isSelected
                  ? 'bg-indigo-600 border border-indigo-400 shadow-lg shadow-indigo-900/40'
                  : 'bg-[#1a1d27]/90 border border-white/10 hover:border-indigo-700 hover:bg-[#22273a]'}
              `}
            >
              {/* Color/category indicator */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                style={{ backgroundColor: `${color}40`, border: `1px solid ${color}60` }}
              >
                {emoji}
              </div>

              {/* Info */}
              <div className="min-w-0">
                <p className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {item.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-indigo-200' : 'text-emerald-400'}`}>
                    ${item.price}
                  </span>
                  {item.style_tags.slice(0, 1).map(tag => (
                    <span key={tag} className="text-xs text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Index badge */}
              <span className={`ml-auto text-xs font-mono flex-shrink-0 ${isSelected ? 'text-indigo-300' : 'text-slate-600'}`}>
                #{idx + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
