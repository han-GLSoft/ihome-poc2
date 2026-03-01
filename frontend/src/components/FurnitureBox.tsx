import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type { Mesh } from 'three';
import type { FurnitureItem } from '../types/furniture';

const CM = 0.01;

const CATEGORY_COLORS: Record<string, string> = {
  bed:          '#7C6FA0',
  wardrobe:     '#5A7A8A',
  desk:         '#6B8A6B',
  sofa:         '#8A6B5A',
  coffee_table: '#7A7A5A',
  tv_stand:     '#5A6B8A',
  bookshelf:    '#8A7A5A',
  lamp:         '#9A8A5A',
};

const CATEGORY_LABELS: Record<string, string> = {
  bed:          'Bed',
  wardrobe:     'Wardrobe',
  desk:         'Desk',
  sofa:         'Sofa',
  coffee_table: 'Coffee Table',
  tv_stand:     'TV Stand',
  bookshelf:    'Bookshelf',
  lamp:         'Lamp',
};

interface Props {
  item: FurnitureItem;
  onClick: (item: FurnitureItem) => void;
  isSelected: boolean;
}

export default function FurnitureBox({ item, onClick, isSelected }: Props) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const w = item.width * CM;
  const d = item.depth * CM;
  const h = item.height * CM;
  const x = item.x ?? 0;
  const z = item.z ?? 0;
  const y = h / 2;

  const base = CATEGORY_COLORS[item.category] ?? '#6B7280';

  useFrame(() => {
    if (!meshRef.current) return;
    const target = isSelected ? 1.04 : hovered ? 1.02 : 1;
    meshRef.current.scale.setScalar(
      meshRef.current.scale.x + (target - meshRef.current.scale.x) * 0.12,
    );
  });

  return (
    <group position={[x, y, z]}>
      <mesh
        ref={meshRef}
        onClick={e => { e.stopPropagation(); onClick(item); }}
        onPointerOver={e => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={isSelected ? '#818CF8' : hovered ? '#A5B4FC' : base}
          roughness={isSelected ? 0.3 : 0.65}
          metalness={isSelected ? 0.3 : 0.05}
          transparent
          opacity={isSelected ? 1 : 0.9}
          emissive={isSelected ? '#4F46E5' : '#000000'}
          emissiveIntensity={isSelected ? 0.15 : 0}
        />
      </mesh>

      {/* Selected outline */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[w + 0.015, h + 0.015, d + 0.015]} />
          <meshStandardMaterial color="#6366F1" wireframe transparent opacity={0.6} />
        </mesh>
      )}

      {/* Label */}
      <Text
        position={[0, h / 2 + 0.1, 0]}
        fontSize={0.1}
        color={isSelected ? '#E0E7FF' : hovered ? '#CBD5E1' : '#64748B'}
        anchorX="center"
        anchorY="bottom"
        renderOrder={1}
      >
        {CATEGORY_LABELS[item.category] ?? item.category}
      </Text>
    </group>
  );
}
