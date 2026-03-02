import type { FurnitureItem } from '../types/furniture';

export interface MaterialProps {
  color: string;
  roughness: number;
  metalness: number;
}

// Style × Category material lookup table
// Inspired by 材質.md AI Material Mapper strategy
const MATERIAL_MAP: Record<string, Record<string, MaterialProps>> = {
  bed: {
    nordic:  { color: '#D4B896', roughness: 0.75, metalness: 0.0 }, // light wood
    modern:  { color: '#E8E6E1', roughness: 0.55, metalness: 0.05 }, // matte white
    minimal: { color: '#DEDAD4', roughness: 0.65, metalness: 0.0 },
    default: { color: '#C8B99A', roughness: 0.70, metalness: 0.0 },
  },
  wardrobe: {
    nordic:  { color: '#C9A87C', roughness: 0.80, metalness: 0.0 }, // oak tone
    modern:  { color: '#CFCFCF', roughness: 0.50, metalness: 0.1 },
    minimal: { color: '#D9D5CE', roughness: 0.65, metalness: 0.0 },
    default: { color: '#B8A88A', roughness: 0.75, metalness: 0.0 },
  },
  desk: {
    nordic:  { color: '#C4A882', roughness: 0.78, metalness: 0.0 }, // solid wood
    modern:  { color: '#F5F5F5', roughness: 0.45, metalness: 0.15 }, // white + metal legs
    minimal: { color: '#E0DDD8', roughness: 0.60, metalness: 0.05 },
    default: { color: '#BEB09A', roughness: 0.72, metalness: 0.0 },
  },
  sofa: {
    nordic:  { color: '#B8C4C8', roughness: 0.85, metalness: 0.0 }, // fabric grey-blue
    modern:  { color: '#CFCFCF', roughness: 0.80, metalness: 0.0 }, // light grey fabric
    minimal: { color: '#D8D4CE', roughness: 0.82, metalness: 0.0 },
    default: { color: '#C4BCBA', roughness: 0.80, metalness: 0.0 },
  },
  coffee_table: {
    nordic:  { color: '#C8A870', roughness: 0.72, metalness: 0.0 }, // wood
    modern:  { color: '#E8E4E0', roughness: 0.20, metalness: 0.05 }, // marble-like
    minimal: { color: '#D4CFC8', roughness: 0.55, metalness: 0.0 },
    default: { color: '#C0B8A8', roughness: 0.65, metalness: 0.0 },
  },
  tv_stand: {
    nordic:  { color: '#BEA882', roughness: 0.78, metalness: 0.0 },
    modern:  { color: '#2A2A2A', roughness: 0.40, metalness: 0.2 }, // dark + matte
    minimal: { color: '#DEDAD4', roughness: 0.60, metalness: 0.05 },
    default: { color: '#A8A090', roughness: 0.70, metalness: 0.05 },
  },
  bookshelf: {
    nordic:  { color: '#C8B48A', roughness: 0.80, metalness: 0.0 },
    modern:  { color: '#E0DDD8', roughness: 0.50, metalness: 0.1 },
    minimal: { color: '#D8D4CC', roughness: 0.65, metalness: 0.0 },
    default: { color: '#BEB098', roughness: 0.75, metalness: 0.0 },
  },
  lamp: {
    nordic:  { color: '#C8A870', roughness: 0.60, metalness: 0.1 },
    modern:  { color: '#D4D4D4', roughness: 0.30, metalness: 0.6 }, // metal
    minimal: { color: '#E0DCD6', roughness: 0.40, metalness: 0.2 },
    default: { color: '#C8C0B0', roughness: 0.45, metalness: 0.25 },
  },
};

// Priority order for style tag matching
const STYLE_PRIORITY = ['nordic', 'modern', 'minimal'];

export function autoMaterial(furniture: FurnitureItem): MaterialProps {
  const categoryMap = MATERIAL_MAP[furniture.category];
  if (!categoryMap) {
    return { color: '#9CA3AF', roughness: 0.65, metalness: 0.05 };
  }

  for (const style of STYLE_PRIORITY) {
    if (furniture.style_tags.includes(style) && categoryMap[style]) {
      return categoryMap[style];
    }
  }

  return categoryMap.default ?? { color: '#9CA3AF', roughness: 0.65, metalness: 0.05 };
}
