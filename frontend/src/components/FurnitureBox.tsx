import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type { Mesh } from 'three';
import type { FurnitureItem } from '../types/furniture';

const CM = 0.01;

const CATEGORY_COLORS: Record<string, string> = {
  bed: '#7c6fa0',
  wardrobe: '#5a7a8a',
  desk: '#6b8a6b',
  sofa: '#8a6b5a',
  coffee_table: '#7a7a5a',
  tv_stand: '#5a6b8a',
  bookshelf: '#8a7a5a',
  lamp: '#9a8a5a',
};

const CATEGORY_LABELS: Record<string, string> = {
  bed: 'Bed',
  wardrobe: 'Wardrobe',
  desk: 'Desk',
  sofa: 'Sofa',
  coffee_table: 'Coffee Table',
  tv_stand: 'TV Stand',
  bookshelf: 'Bookshelf',
  lamp: 'Lamp',
};

interface FurnitureBoxProps {
  item: FurnitureItem;
  onClick: (item: FurnitureItem) => void;
  isSelected: boolean;
}

export default function FurnitureBox({ item, onClick, isSelected }: FurnitureBoxProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const w = item.width * CM;
  const d = item.depth * CM;
  const h = item.height * CM;
  const x = item.x ?? 0;
  const z = item.z ?? 0;
  const y = h / 2; // sit on floor

  const baseColor = CATEGORY_COLORS[item.category] ?? '#6b7280';

  useFrame(() => {
    if (!meshRef.current) return;
    const target = isSelected ? 1.06 : hovered ? 1.03 : 1;
    meshRef.current.scale.setScalar(
      meshRef.current.scale.x + (target - meshRef.current.scale.x) * 0.15
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
          color={isSelected ? '#818cf8' : hovered ? '#a5b4fc' : baseColor}
          roughness={0.6}
          metalness={0.1}
          transparent
          opacity={isSelected ? 1 : 0.88}
        />
      </mesh>

      {/* Top edge outline when selected */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[w + 0.02, h + 0.02, d + 0.02]} />
          <meshStandardMaterial color="#818cf8" wireframe />
        </mesh>
      )}

      {/* Category label */}
      <Text
        position={[0, h / 2 + 0.12, 0]}
        fontSize={0.12}
        color={hovered || isSelected ? '#e0e7ff' : '#94a3b8'}
        anchorX="center"
        anchorY="bottom"
        renderOrder={1}
      >
        {CATEGORY_LABELS[item.category] ?? item.category}
      </Text>
    </group>
  );
}
