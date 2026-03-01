from models import FurnitureItem, Room

# Category placement rules: (wall_side, corner)
# wall_side: "north" | "south" | "east" | "west" | None
# corner: True = place in corner, False = free placement
_BEDROOM_PLACEMENT = {
    "bed": {"wall_side": "north", "corner": False},
    "wardrobe": {"wall_side": "east", "corner": True},
    "desk": {"wall_side": "west", "corner": True},
    "bookshelf": {"wall_side": "east", "corner": False},
    "lamp": {"wall_side": None, "corner": False},
}

_LIVING_ROOM_PLACEMENT = {
    "sofa": {"wall_side": "south", "corner": False},
    "tv_stand": {"wall_side": "north", "corner": False},
    "coffee_table": {"wall_side": None, "corner": False},  # center
    "bookshelf": {"wall_side": "east", "corner": False},
    "lamp": {"wall_side": None, "corner": False},
}

# Convert cm to Three.js world units (meters)
_CM_TO_M = 0.01

# Wall offset from room edge (meters)
_WALL_GAP = 0.05


def _room_half(room: Room):
    hw = room.width * _CM_TO_M / 2
    hd = room.depth * _CM_TO_M / 2
    return hw, hd


def _place_wall(
    item: FurnitureItem,
    wall_side: str,
    hw: float,
    hd: float,
    x_cursor: float,
    z_cursor: dict,
) -> tuple[float, float]:
    """Returns (x, z) in Three.js coords for wall-hugging placement."""
    iw = item.width * _CM_TO_M
    id_ = item.depth * _CM_TO_M

    if wall_side == "north":
        z = -hd + id_ / 2 + _WALL_GAP
        x = z_cursor.get("north", -hw + iw / 2 + _WALL_GAP)
        z_cursor["north"] = x + iw / 2 + 0.1
        return x, z

    if wall_side == "south":
        z = hd - id_ / 2 - _WALL_GAP
        x = z_cursor.get("south", -hw + iw / 2 + _WALL_GAP)
        z_cursor["south"] = x + iw / 2 + 0.1
        return x, z

    if wall_side == "east":
        x = hw - id_ / 2 - _WALL_GAP
        z = z_cursor.get("east", -hd + iw / 2 + _WALL_GAP)
        z_cursor["east"] = z + iw / 2 + 0.1
        return x, z

    if wall_side == "west":
        x = -hw + id_ / 2 + _WALL_GAP
        z = z_cursor.get("west", -hd + iw / 2 + _WALL_GAP)
        z_cursor["west"] = z + iw / 2 + 0.1
        return x, z

    # fallback: center
    return 0.0, 0.0


def _place_center(item: FurnitureItem, hw: float, hd: float) -> tuple[float, float]:
    return 0.0, 0.0


def auto_layout(
    furniture: list[FurnitureItem],
    room: Room,
    room_type: str,
) -> list[FurnitureItem]:
    """
    Assigns x, z coordinates (Three.js world space, meters) to each furniture item.
    Uses category-based wall placement rules with cursor tracking to avoid overlap.
    """
    rules = _BEDROOM_PLACEMENT if room_type == "bedroom" else _LIVING_ROOM_PLACEMENT
    hw, hd = _room_half(room)

    cursors: dict[str, float] = {}
    result: list[FurnitureItem] = []

    for item in furniture:
        rule = rules.get(item.category)

        if rule and rule["wall_side"]:
            x, z = _place_wall(item, rule["wall_side"], hw, hd, 0, cursors)
        elif item.category == "coffee_table":
            x, z = _place_center(item, hw, hd)
        else:
            # fallback grid: scatter along center strip
            idx = len(result)
            x = (idx % 3 - 1) * (item.width * _CM_TO_M + 0.3)
            z = (idx // 3) * (item.depth * _CM_TO_M + 0.3) - hd * 0.3
            x = max(-hw + item.width * _CM_TO_M / 2 + _WALL_GAP, min(hw - item.width * _CM_TO_M / 2 - _WALL_GAP, x))
            z = max(-hd + item.depth * _CM_TO_M / 2 + _WALL_GAP, min(hd - item.depth * _CM_TO_M / 2 - _WALL_GAP, z))

        result.append(item.model_copy(update={"x": round(x, 3), "z": round(z, 3)}))

    return result
