import axios from 'axios';
import type {
  FurnitureItem,
  RecommendRequest,
  RecommendResponse,
  LayoutRequest,
  LayoutResponse,
} from '../types/furniture';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api'),
  headers: { 'Content-Type': 'application/json' },
});

export async function getAllFurniture(): Promise<FurnitureItem[]> {
  const res = await api.get<FurnitureItem[]>('/furniture');
  return res.data;
}

export async function recommendFurniture(req: RecommendRequest): Promise<RecommendResponse> {
  const res = await api.post<RecommendResponse>('/recommend', req);
  return res.data;
}

export async function layoutFurniture(req: LayoutRequest): Promise<LayoutResponse> {
  const res = await api.post<LayoutResponse>('/layout', req);
  return res.data;
}
