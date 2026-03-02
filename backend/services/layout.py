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


def _clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def _along_size(item: FurnitureItem, wall_side: str) -> float:
    # Along-wall footprint: north/south use width axis, east/west use depth axis.
    return (item.width if wall_side in {"north", "south"} else item.depth) * _CM_TO_M


def _normal_size(item: FurnitureItem, wall_side: str) -> float:
    # Normal-to-wall footprint: north/south use depth axis, east/west use width axis.
    return (item.depth if wall_side in {"north", "south"} else item.width) * _CM_TO_M


def _place_wall_group(
    items: list[FurnitureItem],
    wall_side: str,
    hw: float,
    hd: float,
) -> dict[str, tuple[float, float]]:
    """
    Dynamically distribute furniture on a wall based on current room dimensions.
    This makes re-generation respond clearly to width/depth changes.
    """
    if not items:
        return {}

    span = (2 * hw) if wall_side in {"north", "south"} else (2 * hd)
    along_half = (hw if wall_side in {"north", "south"} else hd)
    edge_gap = 0.08
    min_between = 0.1

    corners = [it for it in items if it.id.endswith("__corner")]
    regulars = [it for it in items if not it.id.endswith("__corner")]
    ordered = corners + regulars

    slots = len(ordered)
    usable = max(span - edge_gap * 2, 0.2)
    step = usable / (slots + 1)

    positions_along: list[float] = [(-along_half + edge_gap + step * (i + 1)) for i in range(slots)]

    # Corner-priority items snap toward both ends first.
    for i, _ in enumerate(corners):
        if i % 2 == 0:
            positions_along[i] = -along_half + edge_gap + step * 0.6
        else:
            positions_along[i] = along_half - edge_gap - step * 0.6

    placed: dict[str, tuple[float, float]] = {}
    last_along = None
    for idx, item in enumerate(ordered):
        along = positions_along[idx]
        a_size = _along_size(item, wall_side)
        n_size = _normal_size(item, wall_side)

        lo = -along_half + a_size / 2 + edge_gap
        hi = along_half - a_size / 2 - edge_gap
        along = _clamp(along, lo, hi)

        if last_along is not None and abs(along - last_along) < (a_size / 2 + min_between):
            along = _clamp(last_along + (a_size / 2 + min_between), lo, hi)
        last_along = along

        if wall_side == "north":
            x = along
            z = -hd + n_size / 2 + _WALL_GAP
        elif wall_side == "south":
            x = along
            z = hd - n_size / 2 - _WALL_GAP
        elif wall_side == "east":
            x = hw - n_size / 2 - _WALL_GAP
            z = along
        else:  # west
            x = -hw + n_size / 2 + _WALL_GAP
            z = along

        x = _clamp(x, -hw + n_size / 2 + _WALL_GAP, hw - n_size / 2 - _WALL_GAP)
        z = _clamp(z, -hd + n_size / 2 + _WALL_GAP, hd - n_size / 2 - _WALL_GAP)
        placed[item.id] = (x, z)

    return placed


def _place_center_group(items: list[FurnitureItem], hw: float, hd: float) -> dict[str, tuple[float, float]]:
    if not items:
        return {}

    # Scale center pattern with room size.
    ring_x = max(0.25, hw * 0.28)
    ring_z = max(0.25, hd * 0.28)
    placed: dict[str, tuple[float, float]] = {}
    for idx, item in enumerate(items):
        if idx == 0:
            x, z = 0.0, 0.0
        else:
            # Deterministic spiral-ish placement
            x = ((idx % 2) * 2 - 1) * ring_x * (0.55 + 0.1 * (idx % 3))
            z = (((idx + 1) % 2) * 2 - 1) * ring_z * (0.45 + 0.08 * (idx % 3))

        iw = item.width * _CM_TO_M
        id_ = item.depth * _CM_TO_M
        x = _clamp(x, -hw + iw / 2 + _WALL_GAP, hw - iw / 2 - _WALL_GAP)
        z = _clamp(z, -hd + id_ / 2 + _WALL_GAP, hd - id_ / 2 - _WALL_GAP)
        placed[item.id] = (x, z)
    return placed


def _place_fallback_grid(items: list[FurnitureItem], hw: float, hd: float) -> dict[str, tuple[float, float]]:
    if not items:
        return {}

    cols = 3 if len(items) <= 6 else 4
    rows = (len(items) + cols - 1) // cols
    span_x = max(0.3, hw * 1.2)
    span_z = max(0.3, hd * 0.9)
    step_x = span_x / max(cols - 1, 1)
    step_z = span_z / max(rows - 1, 1)
    start_x = -span_x / 2
    start_z = -span_z / 2 + hd * 0.08

    placed: dict[str, tuple[float, float]] = {}
    for idx, item in enumerate(items):
        col = idx % cols
        row = idx // cols
        x = start_x + col * step_x
        z = start_z + row * step_z

        iw = item.width * _CM_TO_M
        id_ = item.depth * _CM_TO_M
        x = _clamp(x, -hw + iw / 2 + _WALL_GAP, hw - iw / 2 - _WALL_GAP)
        z = _clamp(z, -hd + id_ / 2 + _WALL_GAP, hd - id_ / 2 - _WALL_GAP)
        placed[item.id] = (x, z)
    return placed


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
    north: list[FurnitureItem] = []
    south: list[FurnitureItem] = []
    east: list[FurnitureItem] = []
    west: list[FurnitureItem] = []
    center: list[FurnitureItem] = []
    fallback: list[FurnitureItem] = []

    def with_corner_marker(item: FurnitureItem, is_corner: bool) -> FurnitureItem:
        if not is_corner:
            return item
        # Use a temporary marker in id to keep logic simple and deterministic.
        return item.model_copy(update={"id": f"{item.id}__corner"})

    for item in furniture:
        rule = rules.get(item.category)
        if rule and rule["wall_side"]:
            target = with_corner_marker(item, bool(rule.get("corner")))
            side = rule["wall_side"]
            if side == "north":
                north.append(target)
            elif side == "south":
                south.append(target)
            elif side == "east":
                east.append(target)
            else:
                west.append(target)
        elif item.category == "coffee_table":
            center.append(item)
        else:
            fallback.append(item)

    placed: dict[str, tuple[float, float]] = {}
    for side, bucket in {
        "north": north,
        "south": south,
        "east": east,
        "west": west,
    }.items():
        for key, pos in _place_wall_group(bucket, side, hw, hd).items():
            placed[key.replace("__corner", "")] = pos

    for key, pos in _place_center_group(center, hw, hd).items():
        placed[key] = pos
    for key, pos in _place_fallback_grid(fallback, hw, hd).items():
        placed[key] = pos

    result: list[FurnitureItem] = []
    for item in furniture:
        x, z = placed.get(item.id, (0.0, 0.0))
        result.append(item.model_copy(update={"x": round(x, 3), "z": round(z, 3)}))

    return result
