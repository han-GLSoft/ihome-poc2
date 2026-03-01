export interface Room {
  width: number;  // cm
  depth: number;  // cm
  height: number; // cm
}

export interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  room_type: string;
  width: number;
  depth: number;
  height: number;
  style_tags: string[];
  price: number;
  amazon_url: string;
  priority_score: number;
  score?: number;
  x?: number;  // Three.js world units (meters)
  z?: number;  // Three.js world units (meters)
}

export interface RecommendRequest {
  room: Room;
  style: string[];
  budget: number;
}

export interface RecommendResponse {
  items: FurnitureItem[];
  detected_room_type: string;
}

export interface LayoutRequest {
  furniture: FurnitureItem[];
  room: Room;
}

export interface LayoutResponse {
  items: FurnitureItem[];
}

export type StyleTag = 'minimal' | 'modern' | 'nordic';
