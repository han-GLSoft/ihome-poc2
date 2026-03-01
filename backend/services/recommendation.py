import json
import os
from typing import Optional
from models import FurnitureItem, Room

_DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "furniture_db.json")


def load_furniture_db() -> list[dict]:
    with open(_DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def detect_room_type(items: list[dict]) -> str:
    """Detect room type from candidate items: if any bed exists → bedroom, else living_room."""
    for item in items:
        if item["category"] == "bed":
            return "bedroom"
    return "living_room"


def _score_item(item: dict, style: list[str], budget: float) -> float:
    style_match = sum(1 for tag in item["style_tags"] if tag in style)
    budget_margin = (budget - item["price"]) / budget if budget > 0 else 0
    return (
        style_match * 0.5
        + budget_margin * 0.2
        + item["priority_score"] * 0.3
    )


def recommend(
    room: Room,
    style: list[str],
    budget: float,
    db: Optional[list[dict]] = None,
) -> tuple[list[FurnitureItem], str]:
    """
    Returns (scored_and_sorted_items, detected_room_type).

    Steps:
    1. Filter by price <= budget
    2. Filter by furniture width <= room.width AND furniture depth <= room.depth
    3. Score each item
    4. Detect room type from top candidates
    5. Keep only items matching detected room type (or "universal")
    6. Deduplicate by category (keep highest scoring per category)
    7. Sort by score descending
    """
    if db is None:
        db = load_furniture_db()

    # Step 1+2: size and budget filter
    candidates = [
        item for item in db
        if item["price"] <= budget
        and item["width"] <= room.width
        and item["depth"] <= room.depth
    ]

    if not candidates:
        return [], "unknown"

    # Step 3: score
    scored = [
        {**item, "score": _score_item(item, style, budget)}
        for item in candidates
    ]

    # Step 4: detect room type
    room_type = detect_room_type(scored)

    # Step 5: filter by room type
    filtered = [
        item for item in scored
        if item["room_type"] == room_type or item["room_type"] == "universal"
    ]

    # Step 6: deduplicate by category — keep best per category
    best_by_category: dict[str, dict] = {}
    for item in filtered:
        cat = item["category"]
        if cat not in best_by_category or item["score"] > best_by_category[cat]["score"]:
            best_by_category[cat] = item

    result = sorted(best_by_category.values(), key=lambda x: x["score"], reverse=True)

    return [FurnitureItem(**item) for item in result], room_type
