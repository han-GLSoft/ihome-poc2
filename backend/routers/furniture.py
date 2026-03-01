from fastapi import APIRouter, HTTPException
from models import (
    FurnitureItem,
    RecommendRequest,
    RecommendResponse,
    LayoutRequest,
    LayoutResponse,
)
from services.recommendation import recommend, load_furniture_db
from services.layout import auto_layout

router = APIRouter()


@router.get("/furniture", response_model=list[FurnitureItem])
def get_all_furniture():
    """Return all furniture items in the mock database."""
    db = load_furniture_db()
    return [FurnitureItem(**item) for item in db]


@router.post("/recommend", response_model=RecommendResponse)
def recommend_furniture(req: RecommendRequest):
    """
    Given room dimensions, style preferences, and budget,
    return a scored and sorted list of recommended furniture.
    """
    items, room_type = recommend(
        room=req.room,
        style=req.style,
        budget=req.budget,
    )
    if not items:
        raise HTTPException(
            status_code=404,
            detail="No furniture found matching the given constraints. Try increasing budget or room size.",
        )
    return RecommendResponse(items=items, detected_room_type=room_type)


@router.post("/layout", response_model=LayoutResponse)
def layout_furniture(req: LayoutRequest):
    """
    Given a list of furniture items and room dimensions,
    compute x/z positions for each item using the auto-layout algorithm.
    """
    if not req.furniture:
        raise HTTPException(status_code=400, detail="Furniture list cannot be empty.")

    # Detect room type from the furniture list
    has_bed = any(item.category == "bed" for item in req.furniture)
    room_type = "bedroom" if has_bed else "living_room"

    laid_out = auto_layout(
        furniture=req.furniture,
        room=req.room,
        room_type=room_type,
    )
    return LayoutResponse(items=laid_out)
