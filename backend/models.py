from pydantic import BaseModel
from typing import Optional


class Room(BaseModel):
    width: float   # cm
    depth: float   # cm
    height: float  # cm


class FurnitureItem(BaseModel):
    id: str
    name: str
    category: str
    room_type: str  # "bedroom" | "living_room" | "universal"
    width: float    # cm
    depth: float    # cm
    height: float   # cm
    style_tags: list[str]
    price: float
    amazon_url: str
    priority_score: float
    score: Optional[float] = None
    x: Optional[float] = None   # Three.js world units (meters)
    z: Optional[float] = None   # Three.js world units (meters)


class RecommendRequest(BaseModel):
    room: Room
    style: list[str]
    budget: float


class LayoutRequest(BaseModel):
    furniture: list[FurnitureItem]
    room: Room


class RecommendResponse(BaseModel):
    items: list[FurnitureItem]
    detected_room_type: str


class LayoutResponse(BaseModel):
    items: list[FurnitureItem]
