import { ShoppingBag, LayoutGrid } from 'lucide-react';
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
  lamp:         'Lamp',
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
    <div
      className="absolute bottom-0 left-0 right-0 z-10"
      style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      {/* Header strip */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: 'rgba(15,23,42,0.85)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2">
          <LayoutGrid size={13} color="#6366F1" />
          <span
            className="text-xs font-cinzel font-semibold tracking-widest uppercase"
            style={{ color: '#94A3B8' }}
          >
            配置清單
          </span>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(99,102,241,0.2)',
              color: '#818CF8',
              border: '1px solid rgba(99,102,241,0.3)',
            }}
          >
            {furniture.length} 件
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <ShoppingBag size={12} color="#22C55E" />
          <span className="text-xs" style={{ color: '#64748B' }}>預估總額</span>
          <span className="text-sm font-bold font-cinzel" style={{ color: '#22C55E' }}>
            ${total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Cards row */}
      <div
        className="flex gap-2 overflow-x-auto px-3 py-2.5"
        style={{ background: 'rgba(15,23,42,0.75)' }}
      >
        {furniture.map((item, idx) => {
          const isSelected = item.id === selectedId;
          const color = CATEGORY_COLOR[item.category] ?? '#6B7280';
          const catLabel = CATEGORY_LABEL[item.category] ?? item.category;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="flex-shrink-0 flex items-center gap-2.5 rounded-xl px-3 py-2 text-left"
              style={{
                minWidth: 170,
                background: isSelected
                  ? 'rgba(99,102,241,0.2)'
                  : 'rgba(30,41,59,0.8)',
                border: isSelected
                  ? '1px solid rgba(99,102,241,0.5)'
                  : '1px solid rgba(255,255,255,0.06)',
                boxShadow: isSelected ? '0 0 12px rgba(99,102,241,0.15)' : 'none',
                transition: 'all 180ms ease',
              }}
            >
              {/* Category color block */}
              <div
                className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{
                  background: `${color}25`,
                  border: `1px solid ${color}50`,
                }}
              >
                <span
                  className="text-xs font-bold font-cinzel"
                  style={{ color }}
                >
                  {catLabel.substring(0, 2).toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="min-w-0">
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: isSelected ? '#E0E7FF' : '#CBD5E1' }}
                >
                  {item.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-xs font-bold font-cinzel"
                    style={{ color: '#22C55E' }}
                  >
                    ${item.price}
                  </span>
                  <span className="text-xs" style={{ color: '#475569' }}>
                    {item.style_tags[0]}
                  </span>
                </div>
              </div>

              {/* Index */}
              <span
                className="ml-auto text-xs font-mono flex-shrink-0"
                style={{ color: isSelected ? '#818CF8' : '#334155' }}
              >
                #{idx + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
