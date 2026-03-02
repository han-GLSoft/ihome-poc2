import json
import os
from typing import Optional
from models import FurnitureItem, Room

_DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "furniture_db.json")


def load_furniture_db() -> list[dict]:
    with open(_DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def detect_room_type(items: list[dict]) -> str:
    """
    Detect dominant room type from scored candidates.
    Uses top scored non-universal items and weighted voting to avoid always picking bedroom.
    """
    scoped = [it for it in items if it.get("room_type") in {"bedroom", "living_room"}]
    if not scoped:
        return "living_room"

    top = sorted(scoped, key=lambda x: x.get("score", 0), reverse=True)[:10]
    totals = {"bedroom": 0.0, "living_room": 0.0}
    counts = {"bedroom": 0, "living_room": 0}
    for it in top:
        rt = it["room_type"]
        totals[rt] += float(it.get("score", 0))
        counts[rt] += 1

    if totals["bedroom"] == totals["living_room"]:
        return "bedroom" if counts["bedroom"] >= counts["living_room"] else "living_room"
    return "bedroom" if totals["bedroom"] > totals["living_room"] else "living_room"


def _score_item(item: dict, style: list[str], budget: float) -> float:
    requested = set(style)
    tags = set(item.get("style_tags", []))
    style_match = len(requested & tags)
    requested_count = max(len(requested), 1)
    tag_count = max(len(tags), 1)

    # coverage: how many selected styles are satisfied
    style_coverage = style_match / requested_count
    # precision: prefer items focused on selected style(s)
    style_precision = style_match / tag_count
    style_exact_bonus = 0.12 if style_match > 0 and style_precision >= 1.0 else 0.0
    style_miss_penalty = -0.25 if style_match == 0 else 0.0

    raw_margin = (budget - item["price"]) / budget if budget > 0 else 0
    budget_margin = max(0.0, min(raw_margin, 1.0))
    return (
        style_coverage * 0.5
        + style_precision * 0.2
        + style_exact_bonus
        + style_miss_penalty
        + budget_margin * 0.12
        + item["priority_score"] * 0.18
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
    2. Filter by furniture width/depth/height <= room dimensions
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
        and item["height"] <= room.height
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
